# Cocon

Astro + Tailwind + Netlify (hosting, CMS, forms). Static site, no runtime backend.

## Setup

- **Astro** – static-first
- **Tailwind CSS** – via `@tailwindcss/vite`
- **Netlify** – build, deploy, Forms, CMS (Git Gateway)

## Commands

| Command           | Action                              |
| ----------------- | ----------------------------------- |
| `npm install`     | Install dependencies                |
| `npm run dev`     | Dev server at `http://localhost:4321` |
| `npm run build`   | Production build → `dist/`          |
| `npm run preview` | Preview production build locally   |
| `npm run cms:proxy` | Local CMS backend (run with `npm run dev` to test `/admin` without deploying) |

### Test the CMS locally (no deploy, no credits)

1. **Terminal 1:** `npm run dev`
2. **Terminal 2:** `npm run cms:proxy`
3. Open **http://localhost:4321/admin** — the CMS uses the local proxy and writes to your repo (local commits only). No Netlify deploy or credits used.

## Netlify

- **Build:** `npm run build`, publish `dist/` (see `netlify.toml`).
- **Forms:** Example contact form on the homepage; submissions go to Netlify Forms (honeypot for spam).
- **CMS:** Admin UI at `/admin`; config in `public/admin/config.yml`. Add collections only when components exist; fields map exactly to components (no flexible layout).

## Project structure

```
src/
├── components/     # Astro components (1:1 with Figma when ready)
├── layouts/        # BaseLayout.astro (Tailwind, meta)
├── pages/         # Routes (index, thank-you, …)
└── styles/        # global.css, design tokens (when you provide Figma tokens)
public/
├── admin/         # Netlify CMS (index.html, config.yml)
└── uploads/       # CMS media (optional)
```

## Next steps (your workflow)

1. **Design tokens** – Share Figma tokens (colors, spacing, typography, radius). We’ll add them to `src/styles/` / Tailwind so components stay on-design.
2. **Components** – Build each Figma component as an Astro component in `src/components/`; map CMS fields to component props only when components exist.
3. **Pages** – Compose pages from components; then wire CMS content where needed (without adding flexible layout in the CMS).

## Subagents

Use these when working on the project:

- **astro-frontend** – Astro builds, components, responsive layout, performance; implements Figma 1:1; stops and asks if Figma is missing states/variants.
- **netlify-cms-engineer** – Netlify Forms, CMS config, build/deploy; keeps CMS idiot-proof and design-drift-free; escalates if content could break layout.
- **physio-seo-a11y** – SEO and accessibility (if applicable).
- **ux-ui-designer-healthcare** – Design decisions (if applicable).

After each prompt, consider: “Should the **netlify-cms-engineer** or **astro-frontend** subagent review or own part of this?” and invoke them when relevant.
