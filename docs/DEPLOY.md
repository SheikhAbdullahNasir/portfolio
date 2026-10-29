# Deploy: Vercel + GoDaddy domain

## Current setup (2026-10-29)
- Live at **https://www.abdullahbinnasir.site** (primary). The apex `abdullahbinnasir.site` and every `http://` address redirect to it (308).
- Vercel project address, still working: https://portfolio-murex-two-31.vercel.app
- Every push to `main` deploys to production.
- `site` in `astro.config.mjs` is `https://www.abdullahbinnasir.site`. It sets the canonical link, the Open Graph URLs (`og:url`, `og:image`), `sitemap.xml` (`src/pages/sitemap.xml.ts`), and the `Sitemap:` line in `robots.txt` (`src/pages/robots.txt.ts`). If the primary domain ever changes, change `site` and push; nothing else holds the address.
- The share image (`public/og.png`) shows no URL, so a domain change does not need `npm run og`.

## 1. First deploy
1. Push the repository to GitHub.
2. In Vercel, choose "Add New Project", import the repository. Vercel detects Astro; keep the defaults (build command `npm run build`, output `dist`).
3. Deploy. Every push to `main` updates production; every other branch gets its own preview link.

## 2. Connect the GoDaddy domain
1. In Vercel: Project, Settings, Domains, add your domain (for example `yourdomain.com`) and also `www.yourdomain.com`. Choose which one is primary; the other redirects to it.
2. Vercel then shows the exact DNS records to add. **Use the values Vercel shows you**, because they can differ per project. Typically they look like:
   - Apex (`@`): an `A` record pointing to an IP address Vercel gives you.
   - `www`: a `CNAME` record pointing to a Vercel hostname.
3. In GoDaddy: My Products, your domain, DNS, Manage DNS.
   - Edit or replace the existing `A` record for `@` with Vercel's value. Remove any other `A` record for `@` (for example GoDaddy parking or the current sample project), or traffic will split.
   - Edit the `www` `CNAME` to Vercel's value.
4. Wait for DNS to update (often minutes, sometimes a few hours). Vercel shows "Valid Configuration" and issues HTTPS automatically.
5. In `astro.config.mjs`, change `site` from the Vercel preview address to the primary domain (for example `https://yourdomain.com`), then push. The canonical link, the share image URLs, the sitemap, and robots.txt come from it. Check the share card afterwards with a link preview tool (for example the LinkedIn Post Inspector). Done 2026-10-29 (see Current setup).
6. Optional: add the site to Google Search Console (domain property, verified with a DNS `TXT` record in GoDaddy) and submit `https://www.abdullahbinnasir.site/sitemap.xml`.

## 3. Notes
- Before the switch, the domain hosted a sample project; pointing it to Vercel replaced that site.
- Keep `public/Abdullah_Bin_Nasir_Resume.pdf` as the single résumé file so the site never links an old copy. To update it, replace the file with the same name; if the name changes, update `resume` in `src/data/site.ts`.
- If anything looks wrong after switching, the old records can be restored in GoDaddy.
