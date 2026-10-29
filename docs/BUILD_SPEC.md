# Build Spec: Portfolio V2

_Written 2026-10-29 from the design phase in Claude chat. Every visual value here is a starting direction and may change. Copy lives in `docs/CONTENT.md`._

## 1. Goals
- Get hired (full-time, on-site in Karachi or remote anywhere) and find collaborators, equally.
- Show real projects honestly, with real visuals.
- Feel calm, dark, and crafted, with one interesting moment per section and nothing heavy.
- Grow over time: more projects, later a case study page per project, maybe other pages.

## 2. Architecture

### Routes
- `/` home page (the one long scrolling page).
- Future, not built at launch: `/work/[slug]` case study per project, generated from the same project entry. Structure the project collection so this is a small addition later.
- `404` page in the same style.

### Content model
- **Projects collection** (`src/content/projects/*.md`), one file per project. Frontmatter:
  - `title`, `slug`, `order` (number, display order), `status` (for example "MVP · Live", "Working prototype"), `color` (one of the card palette names), `headline`, `summary`, `why` (optional; render placeholder if missing), `facts` (list of short chips), `stack` (list; may be empty until verified), `links` (live, github; optional each), `visual` (type: `screenshots` or `diagram`, plus image paths or diagram steps), `published` (boolean).
  - Markdown body: reserved for the future case study page. Empty at launch is fine.
- **Site data** (`src/data/*.ts`, typed): hero, status, nav items, now items (with "last updated" date), about text and timeline, beyond-the-code items, contact links.
- Adding a project = adding one file. The stacking cards, the "01 / 02" counter, and the menu update on their own.

### Layout and components
- One base layout used by every page: head meta, fonts, tokens, smart pill nav, footer.
- Suggested components: `NavPill`, `MenuOverlay`, `Hero`, `Globe` (canvas island), `ProjectStack`, `ProjectCard`, `FlowDiagram`, `NowCards`, `About`, `BeyondGrid` with `CricketCard`, `GamingCard`, `EventPassCard`, `ReadingCard`, `Contact`, `IconTile`, `Footer`.

## 3. Design tokens (starting values)
| Token | Value | Use |
|---|---|---|
| `--bg` | `#141414` | Page background (soft charcoal) |
| `--surface` | `#1c1c1b` | Neutral cards (Now, menu) |
| `--ink` | `#edebe5` | Main text |
| `--muted` | `#a19f97` | Secondary text and labels |
| `--line` | `rgba(237,235,229,0.10)` | Dividers |
| `--accent` | `#8fb3ff` | Small details only: status dot, Menu button, labels, résumé |
| Card 1 | `#15332b` forest green, ink `#e8f1ec`, muted `#b7d3c6` | Project 01 |
| Card 2 | `#162a4a` deep blue, ink `#e6edf8`, muted `#b3c4e3` | Project 02 |
| Card 3 | `#3d1c24` burgundy, ink `#f6e6ea`, muted `#d9b7bf` | Project 03 |
| Card 4 | `#45370f` old gold, ink `#f6ecd2`, muted `#dccb9e` | Project 04 |
| Card 5 | `#33203a` plum, ink `#f1e6f4`, muted `#cdb4d4` | Project 05 |

- Fonts (provisional): Bricolage Grotesque 700/800 for display, Geist 400/500/600 for text, Geist Mono for labels. Self-host (for example via Fontsource), subset, `font-display: swap`.
- Radius: 28px project cards, 20 to 24px other cards, 999px pills. Desktop side padding 80px, mobile 16 to 20px.
- Project colors cycle in order; a sixth project reuses card 1 unless a new color is added.

## 4. Sections (home page)

### 4.1 Smart pill nav
- Floating pill, top center (desktop) or full width with 12px margins (mobile). Always visible.
- Contents: round "A" monogram (back to top), current label, optional counter, divider, Résumé link (desktop only), Menu button (accent).
- Label is "Abdullah Bin Nasir" at the top of the page, then the current section name; in Selected work it adds "01 / 02" for the project in view. Use `IntersectionObserver`, not scroll math.
- Menu opens a full-screen overlay: large section links (Work, Now, About, Beyond the code, Contact) with numbers, Résumé button, email. Esc closes; focus moves into the overlay and is trapped while open; focus returns to the Menu button on close; `aria-expanded` kept in sync; background does not scroll while open.
- Acceptance: fully usable by keyboard alone; label updates while scrolling on desktop and mobile.

### 4.2 Hero
- Label "Karachi, Pakistan", huge name "Abdullah", one-liner, status line with accent dot, two buttons (See work, Get in touch).
- Globe island behind or beside the text (see 5.1). Desktop: right side, behind the name. Mobile: behind the text, partly off the right edge, about 60% opacity; the text leads.
- Cursor glow on desktop: soft radial light that follows the pointer over the hero. None on touch screens.
- Melt effect on the name (see 5.2). Candidate, build it behind a flag so it can be turned off.

### 4.3 Selected work (sticky stacking cards)
- Section heading, then one card per published project, in `order`.
- Each card: number and title label, status pill, headline, summary, why line, fact chips, links, visual. Desktop: two columns (text, visual). Mobile: visual on top, shortened text, buttons; the card must fit one screen height.
- Stacking: each card wrapper is `position: sticky` with a slightly larger `top` than the one before (for example 104px, 124px, 144px) so the edges peek out. As the next card covers it, the covered card scales to about 0.94 and darkens (overlay to about 45%). Use native scroll only, no scroll-jacking. Prefer CSS scroll-driven animations with a small JS fallback.
- DocScout visual: two real screenshots layered (home page and a labeled issue card). Patient Voice Agent visual: a flow diagram built in HTML/CSS (see `docs/CONTENT.md`), not an image.
- Reduced motion: no scale or dim, cards may still stack or simply list.

### 4.4 Now
- Three cards: Building, Learning, Exploring, with a small icon each and a "Last updated" date. One column on mobile.

### 4.5 About
- Short timeline (intern, junior developer, focus on AI automation and agents) beside the approved paragraph. Optional: the line of the timeline draws in on scroll.
- No photo for now. A personal touch is still open (ideas: live Karachi clock, real GitHub activity graph, small desk illustration). Do not build one without approval.

### 4.6 Beyond the code (themed bento)
- Desktop grid of 12 columns, two rows: Cricket (7) and Gaming (5), then Events (5) and Reading (7). Mobile: one column.
- Shared frame for all four: same radius, spacing, fonts. Each has its own color and one drawn element.
  - **Cricket:** deep green card, drawn pitch with creases and stumps, drawn red ball that spins on hover, chips "TEAM · PAK", "FORMAT · ALL", "OVERS LEFT · ∞". Hover reveals one extra line.
  - **Gaming:** dark navy card, violet corner brackets, "PLAYER 01" and "ONLINE · WEEKENDS" header, controller icon, a small definition list (Plays, Squad, Watches, Majors). Hover brightens the border and adds a glow, and reveals one line.
  - **Events:** cream event pass with a dark header ("DEV EVENTS · KARACHI", lanyard slot, "PASS"), "ATTENDEE" and his name, short text, dashed tear line, colored stickers for each event type that rotate on hover.
  - **Reading:** warm brown card with a drawn book (an illustration with title text, never the real cover) that opens slightly on hover.
- Touch screens: tap toggles the reveal (use real `<button>` or `aria-expanded`).
- No logos, game art, team crests, or real book covers.

### 4.7 Contact and footer
- Huge headline, sub-line, the email as large text with an underline that sweeps in on hover and a "Copy email" button (shows "Copied").
- Tiles for LinkedIn, GitHub, X, Instagram: small brand icon (about 30px tile), name, handle, arrow; slight lift and arrow nudge on hover; subtle magnetic pull on desktop only. Use a maintained icon set.
- Résumé tile in the accent color: opens the PDF in a new tab; a small "Download PDF" link too.
- Footer: copyright, a download link, back to top.

## 5. Interactions

### 5.1 Globe (hero 3D, placeholder object)
- Canvas 2D, hand-written, no library: about 900 points on a Fibonacci sphere, Karachi pinned (24.86, 67.0) with a pulsing ring, arcs to a few cities (London, New York, Dubai, Berlin, Singapore, San Francisco, Toronto) with a moving dot on each arc. Gentle sway around Karachi; desktop tilts toward the cursor; desktop and mobile can be dragged horizontally, with the front following the pointer (DECISIONS #31).
- Reference implementation: `docs/reference/globe.js`.
- Loads after the main content (Astro island with `client:visible` or an idle-loaded script). Pause the animation when off screen or when the tab is hidden. Reduced motion: draw one still frame.
- Status: placeholder. Abdullah wants to research a more relevant 3D object later; that object may be heavier (Three.js or Spline). Keep the hero layout so the object can be swapped without touching the text.

### 5.2 Melt effect (candidate)
- SVG goo filter on the hero name: letters scale and lean slightly toward the cursor, then blur and threshold so neighbours fuse. Tuned by Abdullah to about Melt 7, Pull 0.15, later lowered to Pull 0.06 (DECISIONS #33; values in `meltSettings`, `src/data/features.ts`).
- Reference: `docs/reference/melt-test.html`.
- Requirements: real text for screen readers (letters split visually only), off for touch screens or replaced by a gentle idle wave, off for reduced motion, filter only active while interacting, blur scales with font size.

### 5.3 Scroll reveals (optional, subtle)
- Short fade or blur-to-sharp as text enters view. Replays each time an element enters from below while scrolling down, never while scrolling up (DECISIONS #30). Off for reduced motion.

## 6. Performance and quality budget
- Lighthouse on mobile: Performance 95+, Accessibility 100, Best Practices 100, SEO 100 (aim; report actual numbers).
- Home page JavaScript at first load: under about 30 KB compressed, excluding any lazily loaded 3D.
- Images: AVIF or WebP via Astro's image tools, explicit sizes, lazy below the fold.
- No layout shift from fonts or images.
- Works without JavaScript for reading content (interactions may degrade).
- Meta: title, description, Open Graph image (design later), favicon from the "A" monogram.

## 7. Milestones
1. **Scaffold:** Astro 7 + TypeScript, tokens file, fonts, base layout, empty sections, deploy a preview to Vercel.
2. **Content model:** projects collection with both projects, typed site data from `docs/CONTENT.md`, placeholders where content is missing.
3. **Nav and hero (static):** smart pill, menu overlay with full keyboard support, hero text and buttons.
4. **Selected work:** project cards, stacking behaviour, DocScout screenshots, Patient Voice Agent flow diagram.
5. **Now, About, Beyond the code, Contact:** including themed cards and icon tiles.
6. **Interactions:** globe, cursor glow, melt (behind a flag), scroll reveals, reduced-motion pass, touch pass.
7. **Quality pass:** accessibility audit, Lighthouse, mobile and desktop checks, 404 page, meta and favicon.
8. **Launch:** connect the custom domain (see `docs/DEPLOY.md`).

Later (not now): `/work/[slug]` case study pages, replacement 3D object, About personal touch, more projects.
