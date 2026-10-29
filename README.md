# Portfolio V2

Live: **https://www.abdullahbinnasir.site**

The personal portfolio of Abdullah Bin Nasir, a software developer in Karachi building products with AI. It is one long scrolling page today, set up so it can grow into more pages later (for example a case study page per project).

## Stack
- [Astro 7](https://astro.build) with TypeScript (strict), static output
- Plain CSS with design tokens in `src/styles/tokens.css`
- Small framework-free scripts for the interactions, no UI framework
- Fonts from Fontsource (Bricolage Grotesque, Geist, Geist Mono), icons from Remix Icon, inlined at build time
- Hosted on Vercel, custom domain from GoDaddy

## Features
- **Hero** with a dotted globe drawn on a canvas, Karachi pinned with arcs to a few cities. It loads lazily after the page is idle and can be dragged. The first name has a "melt" effect for desktop mouse users.
- **Pill navigation** that shows the current section and a project counter in Selected work, plus a full-screen menu (a modal dialog with keyboard support).
- **Selected work**: one sticky card per project that stacks as you scroll. Each card shows either layered screenshots or a flow diagram drawn in HTML and CSS.
- **Now**, **About** (paragraph and short timeline), **Beyond the code** (four themed cards that open on hover, tap, or keyboard), and **Contact** (email with a copy button, social links, résumé).
- Scroll reveals on text as it enters view.
- Every animation respects `prefers-reduced-motion`, and the optional effects can be switched off in `src/data/features.ts`.
- Open Graph share image, favicons, sitemap, robots.txt, and a 404 page.
- Missing content shows a visible placeholder instead of made-up text.

## Run it locally
Needs Node 22.23.4 or newer.

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run check
```

- `npm run dev` starts the dev server. In dev only, `/content-preview` lists every piece of content and placeholder.
- `npm run build` builds the static site into `dist/`. `npm run preview` serves that build.
- `npm run check` runs the type check (`astro check`).
- `npm run og` regenerates `public/og.png`, `public/apple-touch-icon.png`, and `public/favicon.ico` with headless Chrome. Run it after changing the hero copy, the tokens, or `public/favicon.svg`. It needs Chrome or Edge; set `CHROME_PATH` if it is not found.

## Add a new project
Projects live in `src/content/projects/`, one Markdown file each. The schema is in `src/content.config.ts`.

1. Copy an existing file, for example `src/content/projects/docscout.md`, and rename it to the new slug.
2. Fill in the front matter:
   - `title`, `slug`, `status` (short pill text), `headline`, `summary`, and optional `mobileSummary` and `why`.
   - `order`: display order, lowest first. It also sets the "01 / 02" counter.
   - `color`: one of `green`, `blue`, `burgundy`, `gold`, `plum`.
   - `facts` and `stack`: short lists. Leave `stack` empty until it is verified.
   - `links`: `live` and `github` URLs, or `githubPrivate: true` for a private repo.
   - `visual`: either `type: screenshots` with images in `src/assets/projects/<slug>/` (each with `alt` text), or `type: diagram` with at least two `steps`.
   - `published: true` to show it.
3. Run `npm run dev` and check the card at 390px and 1440px wide.

Only use real facts. If something is missing, leave the field out and the card shows the placeholder from `docs/CONTENT.md`. The Markdown body is reserved for a future case study page and can stay empty.

## Folders
```
src/
  components/   page sections and cards (beyond/ holds the Beyond the code cards)
  content/      projects collection (one Markdown file per project)
  data/         typed copy and settings for everything else
  assets/       project screenshots
  layouts/      BaseLayout (head, meta tags, nav, footer)
  pages/        home page, 404, sitemap, robots.txt, dev-only content preview
  scripts/      globe, melt, and scroll reveal scripts
  styles/       tokens.css, global.css, beyond.css
public/         résumé PDF, favicons, share image
scripts/        og-image.mjs (share image and icons)
docs/           project docs; docs/reference/ holds design-phase prototypes
```

## Docs
- [AGENTS.md](AGENTS.md): rules for any coding agent working here (Claude Code reads it through `CLAUDE.md`)
- [docs/PROJECT_STATE.md](docs/PROJECT_STATE.md): what is done and what is next
- [docs/BUILD_SPEC.md](docs/BUILD_SPEC.md): what to build, section by section, with acceptance checks
- [docs/CONTENT.md](docs/CONTENT.md): approved copy and placeholders
- [docs/DECISIONS.md](docs/DECISIONS.md): why things are the way they are
- [docs/DEPLOY.md](docs/DEPLOY.md): Vercel and custom domain setup
