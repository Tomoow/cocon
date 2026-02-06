# Design tokens and global styles

- **`global.css`** – Tailwind entry; add `@layer` overrides here if needed.
- **Design tokens** – When you provide Figma tokens (colors, spacing, typography, radius), we’ll add them here (e.g. CSS custom properties or Tailwind theme in `tailwind.config`) so components stay 1:1 with design.
- **Components** – Live in `src/components/`; each component maps to a single Figma component. No layout flexibility in CMS; fields map exactly to component props.
