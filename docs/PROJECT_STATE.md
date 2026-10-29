# Project State: Portfolio V2

_Last updated 2026-10-29 (milestone 7 done, waiting for review, Claude Code). Update this file at the end of every working session._

## Current objective
Every placeholder is filled (résumé and the Patient Voice Agent "why" line, 2026-10-29). Milestone 7 (quality pass) is done and pushed (commit `37d8600`), waiting for Abdullah's review: accessibility audit, 404 page, meta tags and share image, final favicon, performance check with Lighthouse. Follow-up pushed as its own commit so the two can be compared: the globe at 30 fps while idle (DECISIONS #41). Milestone 8 (launch): Abdullah connected the domain; the site is live at https://www.abdullahbinnasir.site and `site`, canonical, Open Graph, sitemap, and robots.txt now use it (DECISIONS #44).

## Milestone 8 launch (2026-10-29)
- Abdullah connected the GoDaddy domain in Vercel: www is primary, the apex and `http://` redirect to `https://www.abdullahbinnasir.site/` with 308 (checked with curl before the change).
- `site` in `astro.config.mjs` changed from the Vercel address to `https://www.abdullahbinnasir.site`.
- There was no sitemap before (`/sitemap.xml` returned 404). Added `src/pages/sitemap.xml.ts` (lists `/`; the 404 page is left out) and replaced `public/robots.txt` with `src/pages/robots.txt.ts`, which adds the `Sitemap:` line. Both are built from `site`, with no new dependency (`@astrojs/sitemap` would be one).
- Share image not rebuilt: it shows no URL; only its address in the meta tags changed.
- Checked in the build: canonical `https://www.abdullahbinnasir.site/`, `og:url` and `og:image` on the new domain on both pages, `sitemap.xml` and `robots.txt` correct, no Vercel address left in `dist/`, `src/`, `scripts/`, or the config. `npx astro check` 0 errors, 0 warnings; build passes.
- Checked on the live site after the push: see the entry below.

## Live site
- **https://www.abdullahbinnasir.site** (since 2026-10-29). The apex and `http://` redirect to it (308). Vercel deploys every push to `main`; the project address https://portfolio-murex-two-31.vercel.app/ still works. Details in `docs/DEPLOY.md`.
- `/content-preview` is dev-only and not deployed.

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
- **Milestone 4 selected work** (commit `85e7956`, pushed):
  - `src/components/ProjectStack.astro`: one sticky card per published project from `getProjects()`, inside `#work`. Card i sticks at `--stack-top` + i x `--stack-peek` (desktop 104px, 124px, ...; mobile 80px, 92px, ...), so the edges of covered cards peek out. Native scroll only.
  - Covered card: scales to 0.94 (from the top center) and darkens with a black overlay to 30% (`--stack-scale`, `--stack-dim`). Done with a CSS scroll-driven animation: a 1px marker sits at each card's in-flow position, and card i animates on marker i+1's view timeline, from the moment the next card enters the screen until it reaches its sticky top (DECISIONS #24). Browsers without scroll-driven animations (Firefox today) get a small rAF-throttled scroll script that sets `--covered` instead. The last card is never animated.
  - Scroll room after the last card (`--stack-dwell`: 30svh on desktop, 8svh on mobile) so it settles at its sticky top before the stack scrolls away. On mobile the work section's bottom padding is 24px instead of 96px, so the gap before Now stays small.
  - Reduced motion: scale and dim (CSS path and fallback styles) only exist inside `prefers-reduced-motion: no-preference`, and a `prefers-reduced-motion: reduce` block also sets `animation: none`, `transform: none`, and dim opacity 0 with `!important`, which beats any running animation or inline value. The fallback script clears its inline `--covered` and stops under reduce, and follows the setting live (`matchMedia` change listener). The cards still stack.
  - Keyboard: tabbing to a link in a covered card scrolls back to where that card has just stuck, so the focused link is never hidden under the next card.
  - All cards share one height: `100svh` minus the sticky top, the peeks, and `--stack-bottom`, capped at 760px on desktop, so the lowest card always fits the screen.
  - `src/components/ProjectCard.astro`: number and title (`h3`), status pill, headline, summary, why, fact chips, stack, links, visual. Desktop: two columns (text, visual). Mobile: visual on top taking whatever height is left, short summary, chips, buttons; why and stack hidden. Phones under 720px tall also hide the chips; laptops under 720px tall get tighter text. Live link opens in a new tab with a hidden "(opens in a new tab)". Missing why, stack, and GitHub show their placeholders.
  - DocScout visual: the two real screenshots layered (home page, issue card over its lower right corner), WebP through Astro's `<Image>` with `srcset` (480/870 and 320/534), lazy loaded.
  - `src/components/FlowDiagram.astro`: the Patient Voice Agent flow as an `<ol>` of five numbered HTML/CSS boxes with CSS arrows, on a dotted panel. Steps come from the project file. On desktop the steps share the box's height (flex, up to 116px each) with larger type, so the diagram fills the visual area like the screenshots. On short phones only the titles show.
  - Pill counter: cards carry `data-nav-project="01"`. `NavPill` now keeps the set of cards in the band and shows the highest number, because stacked cards overlap (the old "last one to enter" logic would stick on "02" when scrolling back up).
  - New tokens in `tokens.css`: `--stack-top`, `--stack-peek`, `--stack-gap`, `--stack-bottom`, `--stack-dwell`, `--stack-max-height`, `--stack-scale`, `--stack-dim`.
  - Shipped JavaScript is now about 3 KB raw, 1.3 KB gzipped (all inline).
- **Milestone 5 Now, About, Beyond the code, Contact** (commit `2ba73f1`, pushed; waiting for review):
  - `src/components/Icon.astro`: inline SVG icons from Remix Icon (`@iconify-json/ri`, new dev dependency, DECISIONS #25), read at build time. Decorative unless given a `label`.
  - `src/components/NowCards.astro`: "Last updated October 2026" line, three cards (Building, Learning, Exploring) with an accent icon each (hammer, open book, compass; `icon` field in `src/data/now.ts`). One column on mobile, three from 768px.
  - `src/components/About.astro`: timeline (three steps, the last one in the accent) beside the approved paragraph on desktop, stacked on mobile. The timeline line draws in on scroll with a CSS view timeline, only under `prefers-reduced-motion: no-preference`; otherwise it is simply drawn. No photo and no personal touch (still open).
  - Beyond the code, `src/components/BeyondGrid.astro` plus `src/components/beyond/`: 12-column bento on desktop (Cricket 7 + Gaming 5, Events 5 + Reading 7), one column below 1024px. Shared frame in `src/styles/beyond.css`; theme colors as new tokens (`--cricket-*`, `--gaming-*`, `--pass-*`, `--reading-*`). All art is drawn SVG or CSS; no logos, game art, crests, or real covers.
    - Cricket: pitch from above (grass stripes, strip, creases, stumps), red ball with a seam that spins while open; chips; reveal line.
    - Gaming: violet corner brackets, "PLAYER 01" and "ONLINE · WEEKENDS", drawn controller, definition list; opening brightens the border and adds a glow; reveal line.
    - Events: cream pass with a dark header (lanyard slot, "PASS"), attendee name, dashed tear line with edge notches, four colored stickers that tilt the other way when open.
    - Reading: drawn book (title and author as text on an illustrated cover) whose cover swings open a little.
    - Opening: hover with a mouse; a tap anywhere on the card on touch screens; a "+" button (`aria-expanded`, `aria-controls`) on Cricket and Gaming for keyboard users (DECISIONS #26). The hint reads "Hover a card" or "Tap a card" by `(hover: none)`. Without JavaScript the buttons hide and touch screens show the reveal lines.
    - Reduced motion: ball spin, sticker tilt, and book opening only exist under `no-preference`; the reveal line still appears (its fade is cut to near zero by the global rule).
  - `src/components/Contact.astro`: big headline and sub-line; the email as a large `mailto:` link with an accent underline that sweeps in on hover and focus; a "Copy email" button (JavaScript only) that shows "Copied" for 2 seconds and announces it through a `role="status"` region. Copy tries the Clipboard API, then `execCommand('copy')`; if both are blocked it selects the email text. Tiles for LinkedIn, GitHub, X, Instagram: brand icon in a 32px tile, name, handle, arrow, new tab with a hidden "(opens in a new tab)"; lift and arrow nudge on hover; magnetic pull up to 6px for a mouse only, never under reduced motion. The résumé tile in the accent color takes a full row under the socials; while the PDF is missing it shows the placeholder, and its "Download PDF" link appears once `href` is set. Tiles: one column, two from 640px, four from 1024px.
  - `src/components/Footer.astro` in the base layout: copyright with the build year, "Download resume PDF" (placeholder until the PDF exists), "Back to top" (`#top`).
  - Shipped JavaScript is now about 4.9 KB raw, 2 KB gzipped (all inline).

- **Milestone 6 interactions** (commit `cda3262`, review fixes `4ac5bf5` and `e74cc91`, Melt 9 in `2e59080`; approved):
  - Flags in `src/data/features.ts`: `melt` and `scrollReveals` (both on). Setting one to `false` removes that effect and leaves the plain page. The same file holds `meltSettings` (Melt 9, Pull 0.06).
  - Globe, `src/scripts/globe.ts` (rewritten from `docs/reference/globe.js`, typed): about 900 points on a Fibonacci sphere (650 below 450px), Karachi pin with a pulsing ring, arcs to London, New York, Dubai, Berlin, Singapore, San Francisco, Toronto with a travelling dot on each, gentle sway. Colors come from the `--accent` and `--ink` tokens. The canvas sizes itself to the hero's object slot (ResizeObserver) at up to 2x pixel density.
    - Loading: `Hero.astro` fetches the module with a dynamic `import()` after the `load` event, in `requestIdleCallback` (2s timeout; `setTimeout` where it is missing). The canvas and caption fade in after the first frame.
    - Pausing: the animation runs only while the canvas is on screen (IntersectionObserver), the tab is visible (`visibilitychange`), and reduced motion is off. Under reduced motion it draws one still frame facing Karachi, and switches live if the setting changes.
    - Desktop (1024px and up): right side behind the name, 640px at 1440, caption "Karachi · remote anywhere" under it (from `hero.globeCaption`; hidden from screen readers with the rest of the decorative slot, because the status line says the same). Mouse devices tilt it toward the cursor while idle.
    - Mobile: behind the text, about a third off the right edge, at 60% opacity (`--globe-opacity`). The hero has `touch-action: pan-y pinch-zoom`, so vertical scrolling and zoom stay native.
    - Drag (every device, review fix, DECISIONS #31): starts anywhere in the hero inside the globe's circle except on links and buttons. The front follows the pointer one to one with no easing; sway and tilt pause while dragging. On release the sway resumes from the current angle, with a short glide after a flick (time constant 320ms, capped). Easing toward the idle angle is time-based (270ms), so it feels the same at any frame rate. Grab and grabbing cursors for a mouse (`data-globe-cursor` on the hero).
    - Orientation fix: the reference's yaw (-67°) and pitch (-0.32) put Karachi on the far side, so the pin never showed. Now yaw +67° and pitch +0.32: Karachi faces the viewer, a little above center (DECISIONS #27). Confirmed by Abdullah (2026-10-29).
  - Cursor glow (review fix, DECISIONS #32): a neutral warm-white radial light (`--hero-glow` 5%, radius `--hero-glow-size` 220px after the second review (was 420px), soft falloff) that follows the mouse over the hero and fades out when it leaves. The hero now spans the full viewport width (content inset `--hero-inset`, same as the sections), so the glow has no side edges, and a mask fades it out toward the hero's bottom. Only at 1024px and up, with `hover: hover` and `pointer: fine`, and never under reduced motion.
  - Melt, `src/scripts/melt.ts` (from `docs/reference/melt-test.html`; Melt 9, Pull 0.06 after review, were 7 and 0.15; values in `meltSettings`; kept, DECISIONS #34): SVG goo filter (`#hero-melt` in `Hero.astro`). On mouse devices only, the script adds an `aria-hidden` row of letter spans and visually hides the original "Abdullah"; the `<h1>` still reads "Abdullah Bin Nasir". Active while the mouse is over the name or within about a third of its height above or below; the filter is only applied while the effect is moving and is removed at rest. Blur scales with the font size. Off on touch screens, under reduced motion (checked on every move and on change), and with the flag off. No idle wave on touch (the spec allows off).
  - Scroll reveals, `src/scripts/reveal.ts` (loaded from `BaseLayout.astro` when the flag is on): elements with `data-reveal` fade in, sharpen from a 6px blur, and rise 14px (`--reveal-duration`, `--reveal-blur`, `--reveal-rise`). Review fix (DECISIONS #30): they replay each time they enter from below while scrolling down, never while scrolling up. An element resets only once it is fully below the screen; one reached while scrolling up (skipped past by a menu jump) appears without the animation. Only the reveal animates; hiding is instant. Targets: section headings, Now line and cards, About timeline and paragraph, Contact headline and sub-line (DECISIONS #29). Hidden only under `html.reveal`, which the script sets, and only under `prefers-reduced-motion: no-preference`.
  - JavaScript after the review fixes: first load is about 4.4 KB gzipped (inline scripts 6.2 KB raw, 2.3 KB gzipped, including the reveals; hero script 4.4 KB raw, 2.1 KB gzipped, with the melt and glow). The globe chunk loads later: 5.2 KB raw, 2.4 KB gzipped. Total about 6.7 KB gzipped, well under the 30 KB budget.

- **Milestone 7 quality pass** (waiting for review; DECISIONS #35 to #40):
  - Meta in `BaseLayout.astro`: canonical link, Open Graph (type, site name, locale, title, description, URL, image with size, type, and alt), `twitter:card` large image, `noindex` prop (used by the 404 page). Absolute URLs come from `site` in `astro.config.mjs` (the Vercel address until launch; DEPLOY.md now says to change it). `public/robots.txt` allows everything.
  - Share image `public/og.png` (1200x630): monogram badge, "Karachi, Pakistan", "Abdullah", the one-liner, and a still frame of the globe facing Karachi. Made by `npm run og` (`scripts/og-image.mjs`, headless Chrome, site fonts, tokens, and hero copy), which also makes `apple-touch-icon.png` (180px, badge on the page background) and `favicon.ico` (32px). Rerun it after changing the hero copy, tokens, or favicon.
  - Favicon `public/favicon.svg`: the pill's badge, with the real Bricolage ExtraBold "A" outline as a path.
  - 404 page `src/pages/404.astro`: huge "404" with the accent dot, "This page does not exist.", a short line, Back to home and Get in touch. Copy is a draft in `src/data/notFound.ts` and CONTENT.md. Off the home page, menu links point to `/#section`, the monogram to `/` ("Home"), and the pill label stays "Abdullah Bin Nasir" (the page-end rule only applies on the home page). `.button` styles moved from `Hero.astro` to `global.css`.
  - Accessibility fixes: the Events pass card is now labelled "DEV EVENTS · KARACHI Abdullah Bin Nasir" (it was only the attendee name); the stack's focus fix also handles a link that is still off screen (at 390px "Visit live site" ended up under the next card); the melt no longer splits the name under reduced motion.
  - Performance fixes: globe dots batched into 16 brightness steps (about 15 to 30% less main-thread time at 4x CPU); melt letters swapped in after the name's font loads (desktop CLS 0.034 to 0); DocScout screenshots get a middle size (640 and 420) and a closer mobile `sizes` for the overlay (55vw).
  - JavaScript at first load is unchanged in size (about 4.4 KB gzipped plus the 2.4 KB lazy globe chunk), well under the 30 KB budget.

## Verified (milestone 7)
Checked on the built site (`dist/`) through a throwaway static server in the scratchpad with gzip, like Vercel (another session's Astro preview server held the folder again). Lighthouse 13.6.0 from the command line with headless Chrome; other checks in the in-app browser and in headless Chrome driven over the DevTools Protocol, which can emulate reduced motion, touch, JavaScript off, and CPU throttling.
- `npx astro check` 0 errors, 0 warnings, 1 hint (the same `execCommand` hint). `npm run build` passes (2 pages). No em dashes in `src/`, `scripts/`, `public/`, or CONTENT.md.
- **Lighthouse, home page, mobile (default simulated throttling)**, six runs after the fixes: Performance 91, 98, 100, 94, 95, 87 (median about 95); Accessibility 100, Best Practices 100, SEO 100 in every run. FCP and LCP 1.0 to 1.7s, TBT 70 to 440ms, CLS 0, Speed Index 2.4 to 3.0s. Before the fixes, one run: 99 / 100 / 100 / 100.
  - The spread is this machine, not the page: the first style-and-layout task on identical builds took 391 to 983ms between runs (other sessions were running). The live Vercel site (milestone 6) measured 81, 93, 96 the same way. PageSpeed Insights on the deployed site will give a cleaner number (see below).
- **Lighthouse, home page, desktop:** 100 / 100 / 100 / 100 twice. FCP and LCP 0.3s, TBT 0 to 20ms, CLS 0 (was 0.034 before the melt fix).
- **Lighthouse, 404 page, mobile:** 100 / 100 / 100 / 63. SEO 63 only because the page is `noindex` on purpose. (Lighthouse refuses a 404 status, so it ran on `/404.html`.) The server returns status 404 with this page for unknown paths.
- Harsher check (real "devtools" throttling instead of simulated, before the fixes): Performance 65, FCP 3.4s, TBT 740ms, CLS 0 even with fonts arriving at 4.7s. The two costs: the first layout of the whole long page (about 140ms unthrottled, mostly cold font and text work; a warm relayout takes 4ms) and the globe animation (at 4x CPU it used 85 to 90% of the main thread before batching, 65 to 85% after).
- Accessibility audit (Lighthouse covers part; the rest by script and by hand):
  - Headings: one `h1` (hero name, reads "Abdullah Bin Nasir"), `h2` per section, `h3` per card; no skipped levels. 404: one `h1`.
  - Landmarks: `header` with `nav "Main"`, `main`, `footer`, the menu `dialog` with `nav "Sections"`; every section and card article has an accessible name.
  - Labels: every link and button has a name; icon-only buttons have `aria-label`; social tiles read name, handle, "(opens in a new tab)" with spaces.
  - Alt text: the two DocScout screenshots have descriptive alt; canvas, globe caption, melt letters, and decorative SVG are `aria-hidden`; the share image has alt in its meta.
  - Contrast: a script checked every visible text element against its real background (alpha included), with all Beyond cards open and reveals shown, at 1440 and 390. Every one passes 4.5:1 (3:1 for large text) with at least 0.5 to spare.
  - Focus order (real Tab presses in headless Chrome, 1440x900, 390x844, 360x640, 1280x680): skip link, monogram, Menu, See work, Get in touch, Visit live site, More about cricket, More about gaming, email, Copy email, four social tiles, Back to top. Every stop shows the 2px accent ring and, once scrolled, is on screen and not covered.
  - Touch targets: no link or button under 44px at 390.
  - Deep links: loading `/#about` lands the heading below the pill and focuses the section (desktop and mobile).
- **Reduced motion, emulated in real Chrome** (closes the milestone 4 to 6 gap): globe draws one still frame and stops; no reveal hidden; covered card scale `none` and dim 0; no running animations; glow off; name stays plain text; `scroll-behavior: auto`. Without reduced motion the same checks show the globe animating, 13 reveals waiting, scale 0.94 and dim 0.3.
- **JavaScript off** (emulated): all content readable; Menu button and Beyond "+" buttons hidden; on touch screens the Beyond reveal lines show. Hidden text is only the by-design breakpoint variants (short vs full summary, mobile hides why and stack) and the desktop hover reveals.
- 404 at 1440 and 390: layout as intended, no horizontal scroll, buttons 52px, the menu's Contact link goes to `/#contact`.
- Share image, touch icon, and favicon looked at as images.

## Not checked (milestone 7)
- Screen readers (NVDA, VoiceOver): only the accessibility tree and names were inspected.
- Real phones and laptops, Safari, Firefox (no Firefox or Safari here). The stack fallback script in Firefox is still unchecked.
- A real touch drag of the globe and the momentum glide by feel.
- Lighthouse on the deployed site: these changes are not pushed yet. To run it yourself after pushing: open https://pagespeed.web.dev, paste the Vercel URL, and read the Mobile tab (it runs on Google's machines, so it is steadier than a laptop). Or in Chrome: open the site in an Incognito window, DevTools, Lighthouse tab, Mode "Navigation", Device "Mobile", all categories, "Analyze page load". Run it two or three times and take the median.
- The share card as LinkedIn, X, or WhatsApp actually render it (needs the deployed site; LinkedIn Post Inspector or a test post).
- The voice-control "label in name" case: the monogram shows "A" but is named "Back to top". Left as is.

## Globe at 30 fps while idle (Abdullah, 2026-10-29; DECISIONS #41)
- Asked: 30 fps while idle, full speed while dragging, in its own commit to compare against milestone 7. `IDLE_FPS` in `src/scripts/globe.ts`.
- The first version (skip frames until 29ms had passed) fell to 20 to 24 fps idle when the browser ran below 60 fps (4x CPU throttling); now a running 33ms schedule, which averages 27 to 30 there.
- Measured in headless Chrome on the built site, milestone 7 build next to this one:
  - Frames drawn per second, unthrottled, 1440x900: idle 30 (was 60), back to 30 after a drag; dragging and the glide the same as milestone 7.
  - Main-thread time while the hero is on screen: unthrottled 1440 about 120 vs 177 to 189 ms per second (about 30 to 37% less; scripting about half); 2x CPU 390 about 249 vs 395; 4x CPU 390 about 630 to 700 vs 775 to 940.
  - With 4x CPU throttling, frame counts swung a lot between runs on this machine (the milestone 7 build itself idled at 15 to 37 fps), so throttled drag rates are not a fair comparison; the drag path is unchanged and draws every frame.
- `npx astro check` 0 errors, 0 warnings; build passes.
- Not checked: how the 30 fps sway, tilt, and travelling dots look by eye (the pane is throttled; judge on the preview against `37d8600`), real phones, 120Hz screens (the schedule should still give 30).
- Declined: `content-visibility: auto` on the lower sections (Abdullah, 2026-10-29).

## Milestone 6 approved (Abdullah, 2026-10-29)
- The 220px glow and the gentler melt feel right; keep the melt. Abdullah raised Melt from 7 to 9 himself (commit `2e59080`). Milestone 6 is done.

## Milestone 6 second review tweaks (Abdullah, 2026-10-29)
- Glow radius 420px to 220px (`--hero-glow-size`), brightness kept. Melt Pull 0.15 to 0.06, Melt kept at 7, moved to `meltSettings` in `src/data/features.ts` (`melt.ts` reads it). DECISIONS #33; BUILD_SPEC 5.2 notes the new Pull. Globe orientation confirmed.
- Checked: `npx astro check` 0 errors (same one hint); build passes; the built CSS has `--hero-glow-size:220px` and the hero script has `{melt:7,pull:.06}`.
- Not checked in the browser: the look and feel of the smaller glow and the gentler melt (value changes only; judge on the Vercel preview).

## Milestone 6 review fixes (Abdullah, 2026-10-29)
Asked: glow without clipped edges, softer and warm white; globe drag in the right direction, one to one, on desktop and mobile, with a smooth return to the sway; reveals that replay on the way down only. Details in the milestone 6 entry above and DECISIONS #30 to #32 (BUILD_SPEC 5.1 and 5.3 updated to match).
Verified in the built site (in-app browser, same throwaway static server, temporary `launch.json` entry reverted; the pane was hidden, so frames were forced with screenshots):
- `npx astro check` 0 errors (same one hint); build passes; no em dashes in `src/`.
- Glow at 1440x900: the hero box is 0 to 1425px (full width, was capped at 1440 with the page content), the name still starts at 80px and the globe still spans 705 to 1345px. The glow layer has the warm-white gradient and the bottom mask, and turns on under the mouse. At 1920x1080 the hero spans 1905px and its name (312.5px) and globe right edge (1592.5px) line up exactly with the Now section's content. The glow's look (strength, softness) was not judged by eye: at 5% it barely shows in the pane's screenshots.
- Drag direction and rate at 1440 (synthetic mouse events, Karachi pin found by its pixels): dragging 100px right moved the pin 88px right, a further 50px moved it 39px more (the pin sits off-center, so it moves a little less than the pointer; the center moves one to one). Holding still kept it at the same spot across frames; after release it continued from the same spot (452.2, 452.5, 453.9px), no jump.
- Real mouse at 1440: cursor "grab" over the globe (also over the name inside its circle), none off it, "grabbing" while dragging, back to "grab" after release; a drag selected no text.
- Drag at 390x844 with touch-type events: 60px right moved the pin 53px right. Mobile layout unchanged (globe 156 to 507px, top 101px, name at 20px, no glow, no cursor change, no horizontal scroll).
- Reveals at 1440 (Now heading): revealed on the way down; stayed revealed when scrolled past and back up into view; reset once fully below the screen; replayed (transitions running) on the next pass down. Jumped past without being seen, then scrolled back up to: revealed at once with no animation.
- Not checked: the momentum glide by feel (synthetic and tool drags have no real flick speed), a real touch drag on a phone, reduced motion (cannot be emulated; the drag, glow, and reveals all return early or sit under `no-preference`), Safari and Firefox.

## Verified (milestone 6)
Checked in the built site from `dist/` in the in-app browser (Chromium). Another session's Astro preview server was holding the folder again, so the same kind of throwaway static server in the scratchpad was used (its temporary `launch.json` entry was reverted). The pane was hidden for most of the check, which stops or throttles animation frames (0 to 2 frames per second), so animations were judged from forced frames, not watched live.
- `npx astro check`: 0 errors, 0 warnings, 1 hint (the same `execCommand` hint). `npm run build` passes. No console errors. No em dashes in `src/`.
- 1440x900: globe canvas 640px at the right (705 to 1345px), behind the name; the Karachi pin shows between "a" and "h"; caption under it; the globe chunk is requested only after load. Moving the mouse over the name applied the filter (blur reached 7.3px at 240px type), letters shifted and swelled, and the goo fused neighbours. The glow turned on and followed the pointer. The `<h1>` keeps the same height (216px) with the letters in place. No horizontal scroll.
- Pausing: with the hero on screen the canvas kept changing; scrolled to Now, it stayed identical across 600ms.
- Reveals at 1440: the Now line and cards were hidden before scrolling, a forced frame mid-way showed them blurred, and a second later all were revealed at opacity 1.
- 390x844: globe 351px, from x 156 to 507 (117px off the right edge), top 101px, behind the name and one-liner, opacity 0.6; caption and glow hidden; no melt letters (plain text); hero `touch-action: pan-y pinch-zoom`; no horizontal scroll. A right-to-left drag inside the globe turned it (arcs and pin moved to the far side) and did not scroll the page.
- Reveals at 390: the Contact headline and sub-line reveal when scrolled into view; skipped straight past to the page end, they stay hidden until scrolled back to, as intended.
- Found and fixed: the reference's orientation (above). A mouse drag over the hero in drag mode selected the name; a globe drag start now cancels the default (re-checked: nothing selected). Reveal elements also faded out when the script started; now hiding is instant.
- Not checked: reduced motion (cannot be emulated here; the still frame, glow, melt, and reveal paths were reviewed in code, and the CSS rules sit under `no-preference`), a real touch drag on a phone (the emulated drag arrives as a mouse), the melt at a smooth frame rate (the pane was throttled, so it eased out slowly), the tab-hidden pause, Safari and Firefox, the no-JavaScript view, real devices.

## Verified (milestone 5)
Checked in the built site from `dist/` in the in-app browser (Chromium). Another session's Astro preview server was holding the folder, so a throwaway static server in the scratchpad was used again (its temporary `launch.json` entry was reverted).
- `npx astro check`: 0 errors, 0 warnings, 1 hint (`execCommand` is deprecated; kept on purpose as the copy fallback). `npm run build` passes. No console errors. No em dashes in `src/`.
- 1440x900: Now cards three across (408px each). About in two columns. Bento rows: Cricket 730px + Gaming 515px, Events 515px + Reading 730px, no overflow inside any card. Hovering Cricket shows the reveal line and spins the ball. Contact tiles four across with the résumé tile below. Footer on one line. No horizontal scroll.
- Found and fixed: hovering a top-row card pushed the second row down 28px; the desktop grid now keeps the reveal line's space and only fades it.
- Found and fixed at 1024px (the pane's own width at one point): five-across contact tiles overflowed by about 250px; now four across with `minmax(0, 1fr)`.
- Found and fixed: the CSS minifier folded `animation-timeline: view()` into the `animation` shorthand, which browsers drop, so the About line never animated; the timeline now goes through a custom property (same trick as the stack). Read back as scale 1 once the timeline is in view.
- 390x844: everything one column, no horizontal scroll. The email at 23.4px fits one line (338px) and the link is 44px tall; copy button, tiles, toggles, and footer links are at least 44px. "Tap a card" shows. Tapping the Cricket card opens it (reveal visible, ball spinning, button `aria-expanded="true"`, "+" turns to "x"); tapping again closes it. Tapping Events tilts the stickers; tapping Reading opens the book; Gaming's button opens its reveal with the glow.
- Keyboard: Tab from the Beyond hint lands on "More about cricket" with the focus ring; Enter opens the card and sets `aria-expanded="true"`.
- Copy email: the in-app browser denies the Clipboard API; the fallback copied, the button showed "Copied", and the status region held "Copied".
- Reduced motion: confirmed through the CSSOM that the spin, sticker tilt, book opening, and line draw live only inside `prefers-reduced-motion: no-preference`, and tile movement is off under `reduce`. The setting itself cannot be emulated here.
- Not checked: real phones and laptops, screen readers (structure only), the line mid-draw (the hidden pane does not advance scroll timelines, so only the end state was read), the magnetic pull feel, the no-JavaScript view, Safari and Firefox.

## Milestone 5 review fixes (Abdullah, 2026-10-29)
- Beyond the code "+" buttons: on mouse devices (`hover: hover` and `pointer: fine`) the button is invisible (opacity 0, no pointer events) but stays in the tab order, and shows when it has keyboard focus (`:focus-visible`). Always visible on touch screens.
- Anchor jumps: sections had 96px of top padding above the heading, so menu and anchor links left the heading about 120px below the pill. Sections now have `scroll-margin-top` equal to minus their top padding (`--section-pad` in `index.astro`), so with `html`'s `scroll-padding-top` (88px) the heading lands just below the pill. The section ids, focus handling, and pill label are unchanged.
- Verified in the built site (in-app browser, same throwaway static server):
  - Every menu link (Work, Now, About, Beyond the code, Contact) at 1440x900 and 390x844: the heading top lands at 89px, under the pill (which ends at 63 to 70px), focus moves to the section, and the menu closes. Contact also reaches 89px (the page has room). Real clicks with smooth scroll checked for About (1440) and Beyond the code (390); the pill label reads the section name after the jump.
  - 1440: cricket "+" opacity 0 until a real Tab press reaches it, then opacity 1 with the focus ring; Gaming's stays hidden. 390: "+" visible (opacity 1).
  - `npx astro check` 0 errors; build passes.
- Not checked: the hero buttons and pill monogram were not clicked separately (they use the same anchors and rule), real phones.

## Verified (milestone 4)
Checked in the built site served from `dist/` in the in-app browser (Chromium). Another session's Astro dev and preview servers were holding the folder, so a throwaway static server in the scratchpad was used.
- `npx astro check`: 0 errors, 0 warnings, 0 hints (23 files). `npm run build` passes. No console errors. No em dashes in `src/`.
- 1440x900: cards 752px tall, card 1 sticks at 104px, card 2 at 124px. As card 2 slides up, card 1 goes scale 1, 0.97, 0.947, 0.94 and dim 0, 0.20, 0.40, 0.45, and reverses when scrolling back. Card 2 never animates. Both leave together after the dwell. Text column fits. No horizontal scroll.
- 1280x680 (short laptop): text column uses about 380px of 468px.
- 390x844: cards 740px tall, bottoms at 820px and 832px, no overflow in either card, buttons 44px, flow details wrap and fit, no horizontal scroll.
- 360x640: both cards fit (chips and flow details hidden), flow steps 31px with no overflow, no horizontal scroll.
- Pill counter: "Selected work 01 / 02" on the first card, "02 / 02" once card 2 reaches the band, back to "01 / 02" scrolling up, no counter above the first card.
- Keyboard: with card 2 covering card 1, a real Tab press moved focus to DocScout's "Visit live site"; the page scrolled back so the link is uncovered (hit test lands on the link) and the focus ring shows.
- Reduced motion: confirmed through the CSSOM that the animation rules live only inside `@media (prefers-reduced-motion: no-preference)`. The in-app browser cannot emulate the setting, so the reduced-motion page was not watched directly.
- Not checked: the scroll-script fallback (needs Firefox), real phones (mobile toolbars change `svh`), screen readers (only structure inspected), Lighthouse.

## Verified (milestone 4 review tuning)
Abdullah's review (2026-10-29): fuller flow diagram on desktop, dim 45% to 40%, less space after the last card on mobile. Checked the same way (built `dist/` in the in-app browser).
- `npx astro check` 0 errors; build passes.
- 1440x900: flow steps 91px each (were 69px), 511px wide, spanning 600px of the 672px visual area (89%); no overflow in steps or card. Covered card ends at scale 0.94 and dim 0.40. No horizontal scroll.
- Follow-up (Abdullah, 2026-10-29): `--stack-dim` lowered again to 0.3. At 1440x900 the covered card's overlay goes 0.01, 0.17, 0.30 as the next card slides up (scale still ends at 0.94); also confirmed at the in-app pane's own mobile-width size. Build passes.
- 390x844: gap from the last card's bottom to the Now heading is 189px (was about 445px). The last card still reaches its sticky top (92px) and holds there for about 67px of scroll before leaving. No horizontal scroll. Card layout unchanged from the milestone 4 check.

## Reduced-motion bug report (Abdullah, 2026-10-29)
Report: with Chrome DevTools emulating `prefers-reduced-motion: reduce`, the cards still shrank and darkened.
- Cause: **not reproduced, so not confirmed.** In the in-app browser (Chromium 152) the shipped CSS already had every scale and dim rule inside `@media (prefers-reduced-motion: no-preference)`, and turning that rule off while scrolled into the stack cancelled both animations at once. The DevTools setting cannot be emulated here. Open questions for Abdullah: Chrome version, local dev or the Vercel preview, and whether the page was reloaded after switching the setting.
- Hardening shipped anyway: the explicit `reduce` block with `!important` overrides (so even an animation that keeps running is overridden), and the fallback script now clears its inline values and listens for the setting changing.
- Real bug found while checking the fallback: `--covered` was registered with `inherits: false`, so the dim layer (`::after`) never got the value and the fallback only scaled, never darkened. Now `inherits: true`.
- Checked (built site, by editing the media rules in the CSSOM to match or not): reduce block active while the animation rule is still active: 0 running animations, scale `none`, dim 0. Fallback forced on (animation rule removed, `data-stack-fallback` set): `--covered` 0.5 gives scale 0.97 and dim 0.15, 1 gives 0.94 and 0.30; with the reduce block active: scale `none`, dim 0. `npx astro check` 0 errors; build passes.
- Confirmed by Abdullah (2026-10-29): after the deploy, with reduced motion emulated in Chrome DevTools, the cards stack with no scale or dim. The original cause stays unconfirmed.
- Not checked: the script's live `change` listener (needs a real media change in a browser without scroll-driven animations; logic reviewed only).

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
- Lighthouse on the deployed site (local numbers are in "Verified (milestone 7)").
- Font layout shift: measured in milestone 7 (CLS 0 on mobile and desktop, also with fonts arriving late), so size-matched fallbacks are not needed for now.
- Screenshot alt text was written from what the screenshots show; Abdullah may want to reword it.

## Not started
- Nothing from the build spec's milestones. Later items (BUILD_SPEC "Later"): case study pages, a replacement 3D object, an About personal touch, more projects.

## Placeholders to fill (from Abdullah)
None. The built pages (`index.html`, `404.html`) contain no placeholder (checked 2026-10-29: zero `data-placeholder` markers and none of the placeholder texts).

Notes, not shown on the site:
- Patient Voice Agent GitHub link: the repo is private for now, so the card has no GitHub button and no placeholder (`githubPrivate: true` in `patient-voice-agent.md`). When the repo goes public, replace that line with `github: <url>`; the button then appears on its own.
- Patient Voice Agent headline confirmation (current text is Claude's draft; comment in the file).
- Patient Voice Agent flow diagram check against the repo, and dashboard status (comment in the file).
- Skills to list, if any (no skills section until decided).
- Beyond the code copy needs edits later (Abdullah to provide).

## Résumé and last placeholder (Abdullah, 2026-10-29)
- Résumé: `public/Abdullah_Bin_Nasir_Resume.pdf`, added by Abdullah and used exactly as is (underscores, not the hyphenated name the docs planned; `resume` in `src/data/site.ts`, DEPLOY.md updated). Linked from the pill (desktop), the menu, the contact tile, the contact "Download PDF" link, and the footer "Download resume PDF". The pill, menu, and tile open it in a new tab (with a hidden "(opens in a new tab)"); the two download links download it and open it in a new tab where a browser ignores `download`.
- Patient Voice Agent "why": "A personal project to explore voice AI with real backend validation." (desktop card; mobile hides the why line, as for DocScout).
- Checked: `npx astro check` 0 errors, 0 warnings; build passes; the built home page and 404 page have zero placeholders; five résumé links on home; `dist/` holds the PDF byte for byte (54,804 bytes) and the server returns it with status 200. In headless Chrome at 1440x900, 1280x680, 1024x768, 390x844, and 360x640: both cards fit with nothing overflowing (the Patient Voice Agent text ends 41 to 183px above the card bottom on desktop), the pill is 426px wide on desktop with a 44px Resume link, résumé tile 72px tall, download links 44px, no horizontal scroll. Screenshot of the contact section at 1440 looked right.
- Not checked: opening the PDF in a real browser tab and the download on phones (iOS Safari may show it inline instead).

## Content update (Abdullah, 2026-10-29)
- DocScout: GitHub link https://github.com/SheikhAbdullahNasir/docscout and stack TypeScript, React, Node.js, Express.js (in `docscout.md` and CONTENT.md). The card now shows Visit live site and GitHub side by side, and the stack line on desktop.
- Patient Voice Agent: GitHub placeholder removed (private repo, see above). An empty links row is hidden so it leaves no gap.
- 404 page copy and the share image alt text approved (CONTENT.md, DECISIONS #42).
- Checked: `npx astro check` 0 errors, 0 warnings; build passes; the built page has only the résumé and "why" placeholders. In headless Chrome at 1440x900, 1280x680, 1024x768, 390x844, and 360x640: no overflow in either card, DocScout's two buttons on one 44px row, Patient Voice Agent's empty links row hidden, no horizontal scroll.

## Open design questions (do not block the build)
- Final display font (Bricolage Grotesque is provisional).
- Accent color (periwinkle `#8fb3ff` for now).
- A more relevant hero 3D object (research later).
- About personal touch without a photo.

## Next useful action
1. Abdullah reviews milestone 7 and the 30 fps globe on the live site.
2. Run PageSpeed Insights on https://www.abdullahbinnasir.site (Mobile, two or three runs, take the median) and check the share card with LinkedIn Post Inspector.
3. Optional: Google Search Console with the sitemap (`docs/DEPLOY.md` step 2.6).

## Checks not yet possible
- Real-device testing (needs Abdullah's phone and laptop).
- Stacking fallback script in Firefox (no Firefox in this environment).
- A real touch drag of the globe (needs a phone).
