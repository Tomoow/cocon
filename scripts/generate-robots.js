/**
 * Writes public/robots.txt with Sitemap URL from SITE_URL.
 * Run before `astro build`. Set SITE_URL in Netlify (or .env) to your production domain.
 */
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const site = process.env.SITE_URL || 'https://yourdomain.com';
const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${site}/sitemap-index.xml
`;

const outPath = join(__dirname, '..', 'public', 'robots.txt');
writeFileSync(outPath, robots, 'utf8');
console.log('Generated public/robots.txt (Sitemap:', `${site}/sitemap-index.xml)`);
