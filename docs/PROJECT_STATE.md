# Project State: Portfolio V2

_Last updated 2026-10-29 (milestone 1 scaffold, Claude Code). Update this file at the end of every working session._

## Current objective
Milestone 1 (scaffold) is done locally and waiting for Abdullah's review. Next: the Vercel preview deploy (the last part of milestone 1), then milestone 2 (content model).

## Done
- Content plan and copy (`docs/CONTENT.md`).
- Design direction explored and chosen as a starting point (prototypes on a Claude Design canvas named "Portfolio V2 Directions", private to Abdullah; key code copied into `docs/reference/`).
- Stack and hosting chosen (`docs/DECISIONS.md` #18, #19).
- **Milestone 1 scaffold (local):**
  - Astro 7.4.4 + TypeScript 6 (strict preset), static output. `@astrojs/check` for type checking.
  - Design tokens in `src/styles/tokens.css` (all values from BUILD_SPEC section 3, including the five card colors, font stacks, radii, gutters, focus ring).
  - Global base styles in `src/styles/global.css`: dark background, focus-visible ring, skip link, `.visually-hidden`, global `prefers-reduced-motion` rule.
  - Fonts self-hosted through Fontsource variable packages (Bricolage Grotesque, Geist, Geist Mono), `font-display: swap`, split by `unicode-range` so browsers only download the subsets the page uses.
  - Base layout `src/layouts/BaseLayout.astro`: head meta (title, description from CONTENT.md, theme color, favicon), skip link, empty `header` and `footer` slots for the nav and footer.
  - Home page `src/pages/index.astro`: empty hero (`#top`, visually hidden `h1`) plus empty sections `#work`, `#now`, `#about`, `#beyond`, `#contact`, each with only its heading. Section ids and labels live in `src/data/site.ts`.
  - Placeholder "A" favicon at `public/favicon.svg` (final favicon is milestone 7).
  - `.claude/launch.json` with a `preview` entry for previewing the build.
  - Node requirement: Astro 7.4.4 needs Node 22.23.4 or newer. Recorded in `package.json` `engines`. Abdullah's machine was upgraded from 22.19.0 to 22.23.4 through winget on 2026-10-29.

## Verified (milestone 1)
- `npm install`: completed, 0 vulnerabilities.
- `npm run build`: passes, 1 page built, no warnings.
- `npx astro check`: 0 errors, 0 warnings, 0 hints.
- Built page ships no JavaScript (0 script tags); CSS is one file, about 7 KB uncompressed.
- In the browser pane on the production preview (`npm run preview`):
  - 1440px wide: side padding 80px, section heading 56px, no horizontal scroll.
  - 390px wide: side padding 20px, section heading 32px, no horizontal scroll.
  - Bricolage Grotesque and Geist load (latin subset only); headings render in Bricolage.
  - First Tab focuses the skip link, which becomes visible with the accent focus ring and is 48px tall.

## Not verified yet
- Vercel preview deploy (part of milestone 1 in BUILD_SPEC). Not done: the repo needs to be imported in Vercel by Abdullah (see `docs/DEPLOY.md`), or done on his go-ahead.
- Real-device testing (needs Abdullah's phone and laptop).
- Lighthouse scores (milestone 7).
- Font layout shift: fallbacks are not size-matched yet. Revisit in milestone 7 (for example preloading the latin display font or adding fallback metric overrides).

## Not started
- Milestones 2 to 8.

## Placeholders to fill (from Abdullah)
- GitHub links for DocScout and Patient Voice Agent.
- DocScout stack (verify from repo).
- Patient Voice Agent: "why" line, headline confirmation, flow diagram check against the repo, dashboard status.
- Résumé PDF.
- New DocScout home screenshot (current one has an accidental text selection on "next").
- Skills to list, if any.

## Open design questions (do not block the build)
- Final display font (Bricolage Grotesque is provisional).
- Accent color (periwinkle `#8fb3ff` for now).
- A more relevant hero 3D object (research later).
- About personal touch without a photo.
- Where exactly the melt effect lives (hero name is the candidate).

## Next useful action
1. Abdullah reviews milestone 1 and commits it.
2. Push to GitHub and import the repo in Vercel for the first preview deploy (`docs/DEPLOY.md` section 1).
3. Start milestone 2: projects content collection and typed site data from `docs/CONTENT.md`.

## Checks not yet possible
- Real-device testing (needs Abdullah's phone and laptop).
