// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// Production canonical URL. Used for:
//   - sitemap-index.xml + sitemap-0.xml entries
//   - <link rel="canonical"> tags
//   - Open Graph / og:url
// Can be overridden via `SITE_URL` env var for staging/preview builds.
const site = process.env.SITE_URL || 'https://kine-cocon.be';

// https://astro.build/config
export default defineConfig({
  site,
  // imageService: 'compile' optimizes images at build time only — Cloudflare
  // Workers don't support sharp at runtime, and all our pages are prerendered.
  adapter: cloudflare({ imageService: 'compile' }),
  // Canonicalise URLs with a trailing slash. The sitemap and all internal
  // links use the slashed form, and requests for the no-slash variant
  // auto-redirect to the canonical version. Without this, Google sees
  // internal links pointing at /contact while the sitemap says /contact/,
  // which it flags as "Redirect error" in Search Console.
  trailingSlash: 'always',
  // Inline the page-level stylesheets into each HTML document instead of
  // serving them as separate render-blocking <link rel="stylesheet"> files.
  // Removes 2 fetches from the critical request chain (was: HTML → JS → 2
  // CSS, now: HTML → JS). For a small marketing site where each visitor
  // hits 1-2 pages, the cost (~12 KB extra in each HTML) is much smaller
  // than the benefit (fewer round-trips before first paint).
  build: {
    inlineStylesheets: 'always',
  },
  // /afspraak is intercepted client-side and shown as a modal/sheet (see
  // AfspraakModal.astro). The redirect is the no-JS fallback so the link
  // never 404s — visitors land on the home page instead.
  redirects: {
    // Both the no-slash and trailing-slash forms collapse to the same
    // entry in Cloudflare's _redirects (Astro normalises the key), so
    // listing both raises a duplicate-rule error at deploy time.
    '/afspraak': '/',
  },
  integrations: [
    sitemap({
      // Hide pages from the sitemap that shouldn't appear as Google
      // results. They're still reachable via the footer / direct URL,
      // and each emits `<meta name="robots" content="noindex,nofollow">`
      // (via BaseLayout's `noindex` prop) as a belt-and-suspenders
      // signal to crawlers.
      filter: (page) =>
        !page.includes('/thank-you') &&
        !page.includes('/privacy') &&
        !page.includes('/voorwaarden'),
    }),
  ],
  vite: {
    plugins: [
      tailwindcss(),
      // Dev-only: Vite/sirv doesn't know about .lottie files and serves them
      // with an empty Content-Type, which makes @lottiefiles/dotlottie-wc fail
      // to load the animation locally. Production (Cloudflare Workers) serves
      // these as `application/zip+dotlottie`, so we mirror that here so the
      // dev experience matches.
      {
        name: 'serve-lottie-mime',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url && /\.lottie(\?|$)/.test(req.url)) {
              res.setHeader('Content-Type', 'application/zip+dotlottie');
            }
            next();
          });
        },
      },
    ],
  },
});
