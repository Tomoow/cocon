// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// Set SITE_URL in Cloudflare (or .env) to your production URL,
// e.g. https://cocon.lievenstom1997.workers.dev or later https://cocon.be
const site = process.env.SITE_URL || 'https://yourdomain.com';

// https://astro.build/config
export default defineConfig({
  site,
  // imageService: 'compile' optimizes images at build time only — Cloudflare
  // Workers don't support sharp at runtime, and all our pages are prerendered.
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/thank-you'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
