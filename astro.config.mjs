// @ts-check
import { defineConfig } from 'astro/config';

// Static output for Vercel. `site` is the primary domain (the apex redirects to www).
// It makes the canonical link, the share image URLs, the sitemap, and robots.txt
// absolute (docs/DEPLOY.md).
export default defineConfig({
  output: 'static',
  site: 'https://www.abdullahbinnasir.site',
});
