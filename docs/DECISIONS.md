# Decisions: Portfolio V2

_Newest at the bottom. Never delete an entry; if it changes, add a new entry and mark the old one "Superseded by #n". Status: Confirmed (Abdullah agreed), Provisional (current direction, expected to change), Open._

| # | Date | Decision | Status | Why |
|---|---|---|---|---|
| 1 | 2026-10-29 | Build a new portfolio from scratch. V1 (Next.js, built with Codex) is reference only. | Confirmed | Fresh start; V1's design was never approved. |
| 2 | 2026-10-29 | Main goal: getting hired and finding collaborators, equally. | Confirmed | Both matter to him now. |
| 3 | 2026-10-29 | Launch as one long scrolling page, but never lock the site to one page. | Confirmed | Projects will grow; case study pages and other pages will come later. |
| 4 | 2026-10-29 | Launch with two projects: DocScout, then Patient Voice Agent. More added over time. Hackathon project not shown. | Confirmed | Show real work now; hackathon project has no UI yet. |
| 5 | 2026-10-29 | Hero copy: "I build products with AI, end to end." Status: full-time, on-site in Karachi or remote anywhere, plus collabs. | Confirmed | Kept general on purpose; no "backend developer" and no project types in the hero. |
| 6 | 2026-10-29 | Résumé lives in the nav and the contact section, not the hero. | Confirmed | Keeps the hero to two buttons; recruiters still find it fast. |
| 7 | 2026-10-29 | Patient Voice Agent shown as "Working prototype", no live demo, no phone number, flow diagram visual. | Confirmed | Vapi credits are limited; honesty about status; healthcare visuals must not show patient data. |
| 8 | 2026-10-29 | DocScout card leads with maintainer-labeled issues, not documentation findings; AI phase described as planned. | Confirmed | Matches what the live MVP actually returns. |
| 9 | 2026-10-29 | Visual direction: "Quiet dark" (calm, type-led, rounded project cards). Grid direction dropped; light editorial and dark editorial (newspaper style) parked. | Provisional | He loved its layout and the rounded cards. Newspaper idea felt unique but not the base. |
| 10 | 2026-10-29 | Background soft charcoal `#141414`; one color per project in a fixed order (green, blue, burgundy, gold, plum). | Provisional | His idea: new projects follow the pattern automatically. Graphite replaced by burgundy (too close to the background). |
| 11 | 2026-10-29 | Navigation: "smart pill" showing the current section and a full-screen Menu. | Provisional | Chosen over corner links, bottom dock, and side index. Revisit after the portfolio is complete if it feels off. |
| 12 | 2026-10-29 | Project section uses sticky stacking cards with native scroll (no scroll-jacking). | Provisional | His idea from sites he saw; native scroll keeps it smooth and normal to use. |
| 13 | 2026-10-29 | "Less dry" principle: one interesting moment per section, everything else calm; keep the page light. | Confirmed | Round 4 felt all-text; heavy effects everywhere would conflict with his dislike of slow, busy sites. |
| 14 | 2026-10-29 | Hero object: hand-drawn canvas dotted globe (Karachi pin, arcs to cities). | Provisional | Light and fills the space; he finds it not very relevant, so it is a placeholder until a better 3D object is researched (may be heavier, loaded lazily). |
| 15 | 2026-10-29 | Beyond the code as themed cards (cricket, gaming, event pass, reading) in a bento grid with hover or tap reveals. | Provisional | His idea; makes the section worth stopping at. Text will be tweaked later. |
| 16 | 2026-10-29 | Contact uses icon tiles for socials, big email with copy, résumé tile. | Provisional | More inviting than plain pills; use a proper icon set in the build. |
| 17 | 2026-10-29 | No photo of Abdullah for now. | Confirmed | "Not ready." Explore other personal touches for About. |
| 18 | 2026-10-29 | Stack: Astro 7 + TypeScript + plain CSS tokens + small scripts; libraries (GSAP, Three.js, React) only when needed. | Confirmed | Very little JavaScript by default, projects as content files, built-in support for future pages, and compatible with heavier 3D or GSAP loaded only where needed. Next.js considered; heavier by default and built for app-like sites. |
| 19 | 2026-10-29 | Hosting: Vercel with his GoDaddy domain. | Confirmed | Free, simple static hosting with previews per push; Netlify was an equal alternative. |
| 20 | 2026-10-29 | Everything in design and copy is a starting direction, not a final decision. | Confirmed | He expects to keep refining during and after the build. |
