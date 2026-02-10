// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Set SITE_URL in Netlify (or .env) to your production domain, e.g. https://cocon.be
const site = process.env.SITE_URL || 'https://yourdomain.com';

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/thank-you') && !page.includes('/admin'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});