# Project State: Portfolio V2

_Last updated 2026-10-29 (milestone 3 nav and hero, Claude Code). Update this file at the end of every working session._

## Current objective
Milestone 3 (nav and hero, static) is done and pushed, including Abdullah's review fixes. Next: milestone 4 (selected work).

## Live preview
- Vercel is connected to the GitHub repo and deploys every push to `main`: https://portfolio-murex-two-31.vercel.app/
- Milestone 3 is pushed (commit `4d02498`): the live preview now shows the pill nav, the menu, and the hero text. Sections below the hero are still empty; `/content-preview` is dev-only and not deployed.

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
- **Milestone 3 nav and hero** (commit `4d02498`, pushed):
  - `src/components/NavPill.astro`: fixed pill (centered from 1024px, full width with 12px margins below). "A" monogram links to `#top`, label shows "Abdullah Bin Nasir" in the hero and the section name after that, divider and Résumé on desktop only, accent Menu button. The label uses `IntersectionObserver` on a thin band 40% down the viewport; reaching the page end (footer in view) counts as the last section, so Contact still shows when it is too short to reach the band. On desktop the label is exactly as wide as the longest label it can show (every label is rendered invisibly in the same grid cell, including "Selected work" with a sample counter), so the pill never jumps and has no dead space. Labels come from `nav.ts`, so the width follows copy changes on its own.
  - Project counter ("01 / 02") is wired but has nothing to count yet: milestone 4 cards opt in with `data-nav-project="01"` inside `#work`. The total comes from `getProjects()`.
  - `src/components/MenuOverlay.astro`: full-screen modal `<dialog>` with numbered section links, Résumé, and email. Esc closes (native), Tab and Shift+Tab wrap inside the menu, focus returns to the Menu button on close, `aria-expanded` stays in sync, page scroll is locked while open. Choosing a section link closes the menu and moves focus to that section (sections have `tabindex="-1"`), so the next Tab continues from there; see DECISIONS #23.
  - The Menu button only shows when JavaScript runs (an inline script adds a `js` class to `<html>`). Without JavaScript the page still reads and scrolls.
  - Résumé has no PDF yet, so the pill (desktop) and the menu show the "[Resume PDF not provided yet]" placeholder. Adding `href` in `src/data/site.ts` turns both into links.
  - `src/components/Hero.astro`: label, huge name, one-liner, status line with accent dot, See work and Get in touch buttons, all from `src/data/hero.ts`. The `<h1>` reads "Abdullah Bin Nasir" to screen readers (the rest of the name is visually hidden). An empty, `aria-hidden` object slot (`data-hero-object`) holds the globe's place: right side on desktop, behind the text and off the right edge on mobile. No globe, glow, melt, or globe caption yet (milestone 6).
  - Review fixes (Abdullah, 2026-10-29): the one-liner fits one line on desktop and uses `text-wrap: balance` on mobile; on mobile the hero text starts in the upper middle of the screen (top padding `--nav-offset` + 10svh) instead of the bottom; the pill label sizing above.
  - New token `--nav-offset` (88px); `html` has `scroll-padding-top` so anchor links land below the pill, and `scrollbar-gutter: stable` so locking scroll does not shift the layout.
  - Shipped JavaScript: about 2 KB raw, under 1 KB gzipped (inline; nav label and menu).

## Verified (milestone 3)
Checked in the built site (`npm run preview`; another session's dev server was holding the folder) in the in-app browser.
- `npx astro check`: 0 errors, 0 warnings, 0 hints (20 files). `npm run build` passes.
- 1440px: pill centered, 646px wide, width stays the same for every label. Label follows the scroll: Abdullah Bin Nasir, Now, About, Contact at the page end, back to Abdullah Bin Nasir at the top. No horizontal scroll.
- 390px: pill full width (12px margins), monogram and Menu button 44px, Résumé hidden in the pill, hero buttons 52px, menu links 54px, no horizontal scroll in the page or the menu. Label updates on scroll.
- Keyboard only: Tab order is skip link, monogram, Menu, See work, Get in touch. Enter on Menu opens it with focus on Close; Tab cycles Close, five links, email, back to Close; Shift+Tab wraps the other way. Esc closes, focus returns to Menu with a visible ring, `aria-expanded` back to false, scroll unlocked. Enter on Contact closes the menu, scrolls to `#contact`, and focuses it. The Close button by mouse also returns focus to Menu.
- No console errors. No em dashes in `src/`.
- Not checked: the counter (no project cards yet), real phones, screen readers (only the accessibility tree was inspected), and the menu open fade under reduced motion (the global reduced-motion rule should cut it to near zero).

## Verified (milestone 3 review fixes)
- `npx astro check` 0 errors; build passes.
- 1440px: one-liner on one line (46px tall at 40px font). Pill 613px wide for every label (was 646px); label area 166px, set by "Selected work 02 / 02"; the next longest is "Abdullah Bin Nasir" at 130px.
- 390px x 800px: hero text runs from 168px to 528px; one-liner balanced over two lines ("I build products / with AI, end to end."); no horizontal scroll; pill unchanged (full width, label truncates if needed).

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
- Milestones 4 to 8.

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
1. Abdullah checks milestone 3 on the Vercel preview on his phone and laptop.
2. Milestone 4: project cards, stacking, DocScout screenshots, Patient Voice Agent flow diagram. Add `data-nav-project` to each card to light up the pill counter.

## Checks not yet possible
- Real-device testing (needs Abdullah's phone and laptop).
