// @ts-check
import { defineConfig } from 'astro/config';

// Static output for Vercel. `site` makes the canonical link and the share image URLs
// absolute. It is the Vercel preview address for now; change it to the custom domain
// when it is connected (milestone 8, docs/DEPLOY.md).
export default defineConfig({
  output: 'static',
  site: 'https://portfolio-murex-two-31.vercel.app',
});
