# Cocon

Astro + Tailwind, hosted on Cloudflare Pages. Static site, no runtime backend.

## Stack

- **Astro** – static-first
- **Tailwind CSS** – via `@tailwindcss/vite`
- **Cloudflare Pages** – build, deploy, hosting (free plan)

## Commands

| Command           | Action                              |
| ----------------- | ----------------------------------- |
| `npm install`     | Install dependencies                |
| `npm run dev`     | Dev server at `http://localhost:4321` |
| `npm run build`   | Production build → `dist/`          |
| `npm run preview` | Preview production build locally   |

## Deploy on Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Pick the repo and configure:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** add an env var `NODE_VERSION = 20` (or newer)
4. **Environment variables:** set `SITE_URL` to your deploy URL (e.g. `https://<project>.pages.dev`). This is used by the sitemap and `robots.txt`. Update it later when you point a custom domain.
5. Deploy. Each push to `main` triggers a new build.

Free plan limits (more than enough for this site): 500 builds/month, unlimited bandwidth and requests.

## Project structure

```
src/
├── components/     # Astro components
├── layouts/        # BaseLayout.astro (Tailwind, meta)
├── pages/          # Routes (index, over-ons, tarieven, thank-you)
└── styles/         # global.css, design tokens
public/
├── _headers        # Cloudflare Pages security headers
├── images/         # Static images
└── logo/           # Logo assets
content/
└── settings.json   # Site settings (title, hero announcement) — edit via PR for now
```

## Pending — to set up later

- **Custom domain.** When `cocon.be` (or another) is registered, add it under **Custom domains** in the Pages project. Update `SITE_URL` env var to the new URL and redeploy so sitemap/robots use the right host.
- **CMS.** The Netlify CMS at `/admin` was removed during migration. Sanity (free plan) is the planned replacement — to be wired up in a separate change. Until then, `content/settings.json` is edited directly via git/PR.
- **Contact form.** [`src/components/ContactForm.astro`](src/components/ContactForm.astro) is a placeholder: the fields render but the **Verstuur** button is disabled. Submission will be wired up later (likely Resend + a Cloudflare Pages Function once a custom domain is in place).
