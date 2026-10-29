# Project State: Portfolio V2

_Last updated 2026-10-29 (milestone 2 content model, Claude Code). Update this file at the end of every working session._

## Current objective
Milestone 2 (content model) is done, committed, and pushed. Next: milestone 3 (nav and hero, static).

## Live preview
- Vercel is connected to the GitHub repo and deploys every push to `main`: https://portfolio-murex-two-31.vercel.app/
- Milestone 2 is pushed (commit `4f94692`). The home page looks the same as milestone 1 because sections are still empty; `/content-preview` is dev-only and not deployed.

## Done
- Content plan and copy (`docs/CONTENT.md`).
- Design direction explored and chosen as a starting point (prototypes on a Claude Design canvas named "Portfolio V2 Directions", private to Abdullah; key code copied into `docs/reference/`).
- Stack and hosting chosen (`docs/DECISIONS.md` #18, #19).
- **Milestone 1 scaffold** (commit `5e63cde`, deployed to Vercel):
  - Astro 7.4.4 + TypeScript 6 (strict preset), static output. Node 22.23.4 or newer (`package.json` `engines`).
  - Design tokens in `src/styles/tokens.css`, base styles in `src/styles/global.css`.
  - Self-hosted Fontsource variable fonts (Bricolage Grotesque, Geist, Geist Mono).
  - Base layout `src/layouts/BaseLayout.astro` with skip link and empty header and footer slots.
  - Home page with an empty hero and empty sections `#work`, `#now`, `#about`, `#beyond`, `#contact`.
- **Milestone 2 content model** (commit `4f94692`, pushed):
  - Projects collection: schema in `src/content.config.ts`, entries in `src/content/projects/docscout.md` and `patient-voice-agent.md`. Fields as in BUILD_SPEC 2, plus `mobileSummary` (CONTENT.md has a mobile summary for each project) and an optional `note` on each screenshot. `visual` is either `screenshots` (images through Astro's `image()` helper) or `diagram` (steps).
  - DocScout screenshots live in `src/assets/projects/docscout/` so Astro can optimize them (served as WebP). `docscout-home.png` is Abdullah's fresh retake (2026-10-29, 870x680, no browser chrome, no text selection; no crop needed). `docscout-issue.jpg` is copied from `docs/reference/assets/`. The old home screenshot with the selection was deleted from `docs/reference/assets/`.
  - Card color names in `src/data/palette.ts` (green, blue, burgundy, gold, plum), matching the `--card-*` tokens. The schema only accepts these names.
  - `src/lib/projects.ts`: `getProjects()` returns published projects sorted by `order`; `projectNumber()` gives "01", "02".
  - Typed site data from CONTENT.md: `src/data/site.ts` (site, résumé), `nav.ts`, `hero.ts`, `now.ts`, `about.ts`, `beyond.ts`, `contact.ts` (contact and footer). The home page now reads its section list from `nav.ts`.
  - Placeholders: missing content is left out of the data (optional field, empty list, no link), and the page renders the matching text from `src/data/placeholders.ts` through `src/components/Placeholder.astro` (dashed accent box, mono font). Adding the real content makes the placeholder disappear by itself.
  - Dev-only review page at `/content-preview` (`src/pages/[devPage].astro`): every piece of content and every placeholder in plain form, with project cards in their colors. It only exists under `npm run dev`; the production build does not include it.
  - The home page still shows empty sections. Rendering the content there starts in milestone 3.

## Verified (milestone 2)
- `npx astro check`: 0 errors, 0 warnings, 0 hints (17 files).
- `npm run build`: passes; output is only `index.html` (the dev preview page is not built).
- Schema validation: temporarily setting DocScout's `color` to `red` made `astro sync` fail with a clear schema error; the file was restored.
- `/content-preview` in the dev server: both projects listed in order ("01 DocScout · MVP · Live", "02 Patient Voice Agent · Working prototype"), both DocScout screenshots load through Astro's image pipeline, no console errors, no horizontal scroll at 1024px. Six placeholders render: résumé, DocScout stack, DocScout GitHub, Patient Voice Agent why, Patient Voice Agent stack, Patient Voice Agent GitHub.
- Patient Voice Agent stack filled in from Abdullah (Python, FastAPI, PostgreSQL (Supabase), SQLAlchemy, Vapi); five placeholders remain.
- After swapping in the new DocScout home screenshot: `astro check` 0 errors, build passes, `/content-preview` serves both screenshots as WebP (HTTP 200) and shows no retake note.
- No em dashes in `src/`.

## Verified (milestone 1)
- `npm run build` and `npx astro check` passed. No JavaScript shipped.
- 1440px and 390px: correct side padding (80px, 20px), no horizontal scroll, fonts load, skip link visible on focus with the accent ring.

## Not verified yet
- Real-device testing (needs Abdullah's phone and laptop).
- Lighthouse scores (milestone 7).
- Font layout shift: fallbacks are not size-matched yet. Revisit in milestone 7.
- Screenshot alt text was written from what the screenshots show; Abdullah may want to reword it.

## Not started
- Milestones 3 to 8.

## Placeholders to fill (from Abdullah)
Rendered on the site where marked "visible". The rest are notes in the project files.
- GitHub link for DocScout (visible: `links.github` in `docscout.md`).
- GitHub link for Patient Voice Agent (visible: `links.github` in `patient-voice-agent.md`).
- DocScout stack, verify from repo (visible: `stack` in `docscout.md`).
- Patient Voice Agent "why" line (visible: `why` in `patient-voice-agent.md`).
- Patient Voice Agent headline confirmation (current text is Claude's draft; comment in the file).
- Patient Voice Agent flow diagram check against the repo, and dashboard status (comment in the file).
- Résumé PDF (visible: set `href` in `src/data/site.ts` once `public/Abdullah-Bin-Nasir-Resume.pdf` exists).
- Skills to list, if any (no skills section until decided).

## Open design questions (do not block the build)
- Final display font (Bricolage Grotesque is provisional).
- Accent color (periwinkle `#8fb3ff` for now).
- A more relevant hero 3D object (research later).
- About personal touch without a photo.
- Where exactly the melt effect lives (hero name is the candidate).

## Next useful action
1. Start milestone 3: smart pill nav, menu overlay with full keyboard support, hero text and buttons.

## Checks not yet possible
- Real-device testing (needs Abdullah's phone and laptop).
