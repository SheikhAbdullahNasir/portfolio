# AGENTS.md: Portfolio V2

Instructions for any coding agent (Claude Code, Codex, OpenCode, or others) working in this repository. Read this file first, then `docs/PROJECT_STATE.md`, then `docs/BUILD_SPEC.md`.

## What this is
The personal portfolio of Abdullah Bin Nasir, a software developer in Karachi building products with AI. One long scrolling page at launch, built so it can grow into multiple pages later (for example a case study page per project).

## Stack
- Astro 7, TypeScript (strict).
- Plain CSS with design tokens (CSS custom properties) in one tokens file. No CSS framework unless a decision in `docs/DECISIONS.md` says otherwise.
- Interactions as small, framework-free scripts inside Astro components. Add a library (GSAP, Lenis, Three.js, React) only when a feature needs it, and record the reason in `docs/DECISIONS.md`.
- Content in Astro content collections (projects) and typed data files (everything else). Copy lives in content, never hard-coded in components.
- Hosting: Vercel, static output, custom domain from GoDaddy. See `docs/DEPLOY.md`.

## Sources of truth
- `docs/PROJECT_STATE.md`: what is done, what is next. Update it at the end of every working session.
- `docs/BUILD_SPEC.md`: what to build, section by section, with acceptance checks.
- `docs/CONTENT.md`: every piece of approved copy and every placeholder.
- `docs/DECISIONS.md`: why things are the way they are. Add an entry for any meaningful decision; never delete old entries, mark them superseded.
- `docs/reference/`: prototype code and assets from the design phase. Reference only; rewrite cleanly for production.

## Rules
1. **Never invent facts.** No made-up features, numbers, dates, employers, links, clients, or results. If content is missing, render the placeholder from `docs/CONTENT.md` and list it in `docs/PROJECT_STATE.md`.
2. **No office or employer-specific work** in any file. Only the general career story in `docs/CONTENT.md`.
3. **No em dashes** in user-facing copy.
4. **Everything is a starting direction.** Colors, fonts, layout, and copy are expected to change. Keep them easy to change: tokens for design values, content files for copy.
5. **Accessibility is required:** semantic HTML, keyboard access for every control, visible focus, `prefers-reduced-motion` respected by every animation, text contrast at least 4.5:1, touch targets at least 44px, real text for screen readers (decorative canvases are `aria-hidden` or labeled).
6. **Performance budget:** see `docs/BUILD_SPEC.md`. Heavy features (3D, large libraries) load lazily, after the main content.
7. **Mobile and desktop both matter.** Check every section at 390px and 1440px widths. Hover-only interactions need a tap or always-visible alternative on touch screens.
8. **Ask before big moves.** Do not change the stack, add a major dependency, restructure content, or change approved copy without Abdullah's go-ahead.

## Workflow
- Work in milestones from `docs/BUILD_SPEC.md`, one at a time.
- Small, focused commits with clear messages. Use `main` for routine work; use a branch for larger or riskier changes.
- After each milestone: run the build, check for type errors, check desktop and mobile widths, then update `docs/PROJECT_STATE.md`.
- When a check cannot be run (for example a real-device test), say so in `docs/PROJECT_STATE.md` instead of claiming it passed.

## Commands (fill in after scaffolding)
- Install: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview build: `npm run preview`
- Type check: `npx astro check`
