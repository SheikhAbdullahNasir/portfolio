# Project State: Portfolio V2

_Last updated 2026-10-29 (milestone 6, Claude Code). Update this file at the end of every working session._

## Current objective
Milestone 6 (interactions: globe, cursor glow, melt, scroll reveals) is built, checked locally in the built site, and pushed (commit `cda3262`), so it deploys to the Vercel preview. Waiting for Abdullah's review. Next after approval: milestone 7 (quality pass).

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

- **Milestone 6 interactions** (commit `cda3262`, pushed; waiting for review):
  - Flags in `src/data/features.ts`: `melt` and `scrollReveals` (both on). Setting one to `false` removes that effect and leaves the plain page.
  - Globe, `src/scripts/globe.ts` (rewritten from `docs/reference/globe.js`, typed): about 900 points on a Fibonacci sphere (650 below 450px), Karachi pin with a pulsing ring, arcs to London, New York, Dubai, Berlin, Singapore, San Francisco, Toronto with a travelling dot on each, gentle sway. Colors come from the `--accent` and `--ink` tokens. The canvas sizes itself to the hero's object slot (ResizeObserver) at up to 2x pixel density.
    - Loading: `Hero.astro` fetches the module with a dynamic `import()` after the `load` event, in `requestIdleCallback` (2s timeout; `setTimeout` where it is missing). The canvas and caption fade in after the first frame.
    - Pausing: the animation runs only while the canvas is on screen (IntersectionObserver), the tab is visible (`visibilitychange`), and reduced motion is off. Under reduced motion it draws one still frame facing Karachi, and switches live if the setting changes.
    - Desktop (1024px and up): right side behind the name, 640px at 1440, caption "Karachi · remote anywhere" under it (from `hero.globeCaption`; hidden from screen readers with the rest of the decorative slot, because the status line says the same). Mouse devices tilt it toward the cursor.
    - Mobile: behind the text, about a third off the right edge, at 60% opacity (`--globe-opacity`). Touch screens drag it sideways: a drag starts anywhere in the hero inside the globe's circle except on links and buttons; the hero has `touch-action: pan-y pinch-zoom`, so vertical scrolling and zoom stay native.
    - Orientation fix: the reference's yaw (-67°) and pitch (-0.32) put Karachi on the far side, so the pin never showed. Now yaw +67° and pitch +0.32: Karachi faces the viewer, a little above center (DECISIONS #27). Abdullah should judge whether this matches what he liked in the prototype.
  - Cursor glow: a soft accent radial light (`--hero-glow`, `--hero-glow-size` 560px) that follows the mouse over the hero and fades out when it leaves. Only at 1024px and up, with `hover: hover` and `pointer: fine`, and never under reduced motion.
  - Melt, `src/scripts/melt.ts` (from `docs/reference/melt-test.html`, Melt 7, Pull 0.15): SVG goo filter (`#hero-melt` in `Hero.astro`). On mouse devices only, the script adds an `aria-hidden` row of letter spans and visually hides the original "Abdullah"; the `<h1>` still reads "Abdullah Bin Nasir". Active while the mouse is over the name or within about a third of its height above or below; the filter is only applied while the effect is moving and is removed at rest. Blur scales with the font size. Off on touch screens, under reduced motion (checked on every move and on change), and with the flag off. No idle wave on touch (the spec allows off).
  - Scroll reveals, `src/scripts/reveal.ts` (loaded from `BaseLayout.astro` when the flag is on): elements with `data-reveal` fade in, sharpen from a 6px blur, and rise 14px, once each (`--reveal-duration`, `--reveal-blur`, `--reveal-rise`). Only the reveal animates; hiding is instant. Targets: section headings, Now line and cards, About timeline and paragraph, Contact headline and sub-line (DECISIONS #29). Hidden only under `html.reveal`, which the script sets, and only under `prefers-reduced-motion: no-preference`.
  - JavaScript: first load is about 4.2 KB gzipped (inline scripts 5.5 KB raw, 2.1 KB gzipped, now including the reveals; hero script 4.5 KB raw, 2.1 KB gzipped, with the melt and glow). The globe chunk loads later: 4.3 KB raw, 2.0 KB gzipped. Total about 6.2 KB gzipped, well under the 30 KB budget.

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
- Lighthouse scores (milestone 7).
- Font layout shift: fallbacks are not size-matched yet. Revisit in milestone 7.
- Screenshot alt text was written from what the screenshots show; Abdullah may want to reword it.

## Not started
- Milestones 7 and 8.

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
- Beyond the code copy needs edits later (Abdullah to provide).

## Open design questions (do not block the build)
- Final display font (Bricolage Grotesque is provisional).
- Accent color (periwinkle `#8fb3ff` for now).
- A more relevant hero 3D object (research later).
- About personal touch without a photo.
- Whether the melt stays (built on the hero name behind `features.melt`).
- Globe orientation after the fix (Karachi now faces the viewer; the reference had it on the far side).

## Next useful action
1. Abdullah reviews milestone 6 on the Vercel preview on his laptop and phone. To judge: the globe's position and size on both, its orientation (Karachi facing the viewer), the cursor tilt and the phone drag, the glow strength, the melt feel and whether to keep it, and whether the scroll reveals feel subtle enough. Also worth a check with reduced motion on in the OS or DevTools (still globe, no glow, no melt, no reveals).
2. Milestone 7 (quality pass) once milestone 6 is approved.

## Checks not yet possible
- Real-device testing (needs Abdullah's phone and laptop).
- Stacking fallback script in Firefox (no Firefox in this environment).
- Milestone 6 effects under reduced motion, watched live (the setting cannot be emulated in the in-app browser).
- A real touch drag of the globe (needs a phone).
