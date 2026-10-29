// sitemap.xml for search engines, built from `site` in astro.config.mjs. Lists the
// pages meant for search; add new ones here (for example the future /work/[slug]).
// The 404 page is left out on purpose (it is noindex).
import type { APIRoute } from 'astro';

const pages = ['/'];

export const GET: APIRoute = ({ site }) => {
  const urls = pages.map((path) => `  <url><loc>${new URL(path, site)}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
