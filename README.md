# Cocon

Astro + Tailwind, deployed on Cloudflare Workers (Static Assets). Static site with the Cloudflare adapter, ready to add API routes when needed.

## Stack

- **Astro 5** – static-first, all pages prerendered
- **Tailwind CSS** – via `@tailwindcss/vite`
- **`@astrojs/cloudflare` adapter** – `imageService: 'compile'` (sharp at build time only)
- **Cloudflare Workers + Static Assets** – build, deploy, hosting (free plan)

## Commands

| Command           | Action                                |
| ----------------- | ------------------------------------- |
| `npm install`     | Install dependencies                  |
| `npm run dev`     | Dev server at `http://localhost:4321` |
| `npm run build`   | Production build → `dist/`            |
| `npm run preview` | Preview production build locally      |

## Deploy on Cloudflare

The repo is already wired up to Cloudflare. Each push to `main` triggers a new build via the connected Workers project (`cocon`). Deployed URL: <https://cocon.lievenstom1997.workers.dev>.

If you ever need to recreate the project from scratch:

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Workers** → **Import a repository**.
2. Pick `Tomoow/cocon` and confirm the auto-detected settings:
   - **Framework:** Astro
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. Add env var `NODE_VERSION = 20`.
4. Add env var `SITE_URL = https://cocon.lievenstom1997.workers.dev` (used by sitemap + `robots.txt`). Update it when a custom domain is attached.
5. Save and deploy.

Free plan limits (more than enough for this site): 100 000 Worker requests/day, unlimited bandwidth.

## Project structure

```
src/
├── components/     # Astro components
├── layouts/        # BaseLayout.astro (Tailwind, meta)
├── pages/          # Routes (index, over-ons, tarieven, thank-you)
└── styles/         # global.css, design tokens
public/
├── _headers        # Security headers (served via Workers Static Assets)
├── images/         # Static images
└── logo/           # Logo assets
content/
└── settings.json   # Site settings (title, hero announcement) — edit via PR for now
wrangler.jsonc      # Workers + Static Assets config
astro.config.mjs    # Astro + Cloudflare adapter
```

## Pending — to set up later

- **Custom domain.** When `cocon.be` (or another) is registered, add it under **Custom domains** in the Workers project. Update the `SITE_URL` env var to the new URL and redeploy so sitemap/robots use the right host.
- **CMS.** The Netlify CMS at `/admin` was removed during the Netlify → Cloudflare migration. Sanity (free plan) is the planned replacement — to be wired up in a separate change. Until then, [`content/settings.json`](content/settings.json) is edited directly via git/PR.
- **Contact form.** [`src/components/ContactForm.astro`](src/components/ContactForm.astro) is a placeholder: the fields render but the **Verstuur** button is disabled. Submission will be wired up later via a Pages Function or Worker route hitting Resend, once a custom domain is in place (Resend requires a verified sending domain).
