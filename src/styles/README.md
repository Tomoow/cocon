# Design tokens and global styles

- **`global.css`** – Tailwind entry + `@theme` design tokens (colors, then spacing/typography/radius as you add them).
- **Components** – Live in `src/components/`; each component maps to a single Figma component. Use **semantic** tokens in components (e.g. `bg-background-default`, `text-primary`), not raw palette names.

## Color tokens

**Palette (raw)** – use only when semantic doesn’t fit:
- `primary-green`, `primary-orange`, `light-green`, `light-orange`, `light-yellow`, `white`, `grey`, `black`

**Semantic (prefer in components)**:
- **Brand:** `primary` (green), `accent` (orange)
- **Backgrounds:** `background-default` (white), `background-subtle` (light yellow), `background-muted` (light green), `background-muted-alt` (light orange)
- **Text:** `text-primary` (black), `text-secondary` (grey)
- **Surface:** `surface` (white)

Tailwind utilities: `bg-primary`, `text-accent`, `bg-background-subtle`, `text-text-secondary`, etc.
