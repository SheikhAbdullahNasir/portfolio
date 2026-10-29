# Content: Portfolio V2

_Approved copy as of 2026-10-29. Everything is a starting version and will be edited over time. Text in [square brackets] is a placeholder: render it visibly in development and list it in `docs/PROJECT_STATE.md`. Never replace a placeholder with invented content._

## Site
- Name: Abdullah Bin Nasir
- Short name / monogram: Abdullah / "A"
- Location: Karachi, Pakistan
- Meta description (draft): "Abdullah Bin Nasir builds products with AI, end to end. Based in Karachi, open to full-time roles and collaborations."

## Navigation
- Pill label at top of page: "Abdullah Bin Nasir"
- Section labels: Selected work, Now, About, Beyond the code, Contact
- Menu links: Work (01), Now (02), About (03), Beyond the code (04), Contact (05)
- Résumé link label: "Resume" (pill), "Resume (PDF)" (menu, contact)

## Hero
- Label: "Karachi, Pakistan"
- Name: "Abdullah"
- One-liner: "I build products with AI, end to end."
- Status: "Open to full-time roles, on-site in Karachi or remote anywhere. Also up for collabs on good ideas."
- Buttons: "See work", "Get in touch"
- Globe caption (desktop): "Karachi · remote anywhere"

## Selected work
- Heading: "Selected work"

### Project 01: DocScout
- Order: 1. Color: forest green.
- Status pill: "MVP · Live"
- Headline: "A starting point for your next open-source contribution."
- Summary: "Paste a public GitHub repo. DocScout pulls the README, the contribution guide, and maintainer-labeled help-wanted issues into one place, with next steps for each."
- Mobile summary: "README, contribution guide, and help-wanted issues from any public repo, in one place."
- Why: "Built after dev events got me into open source, and I wanted an easier way to find a first task."
- Facts: "No login", "No GitHub writes", "AI off in the MVP"
- Stack: [Stack: confirm from repo]
- Links: live site https://docscoutserver-production.up.railway.app/ ; GitHub [link pending]
- Visual: two screenshots in `src/assets/projects/docscout/`: `docscout-home.png` (retaken 2026-10-29) and `docscout-issue.jpg`.
- Honesty notes: lead with labeled issues; the documentation-findings section exists but rarely returns results, so do not claim it "finds documentation problems". The AI agent phase is planned, not built.

### Project 02: Patient Voice Agent
- Order: 2. Color: deep blue.
- Status pill: "Working prototype"
- Headline: "A voice agent that handles patient intake over the phone." (Claude's draft; Abdullah to confirm or rewrite)
- Summary: "A patient calls and talks to Maya, an AI voice coordinator, who registers them or updates their record. The backend checks details like phone, date of birth, and zip before anything is saved."
- Mobile summary: "Callers talk to Maya, who registers or updates their record. 47 tests passing."
- Why: [Why I built it, in your words]
- Facts: "47 tests passing", "Vapi voice pipeline", "FastAPI + Supabase"
- Stack: Python, FastAPI, PostgreSQL (Supabase), SQLAlchemy, Vapi (confirmed by Abdullah 2026-10-29)
- Links: GitHub [link pending]. No live demo and no phone number on the site.
- Visual: flow diagram (HTML/CSS boxes), verify against the repo before launch:
  1. Caller (phone call)
  2. Vapi · Maya (speech to text, LLM, text to speech)
  3. FastAPI webhook (tool calls)
  4. Validation and services (shared layer)
  5. Supabase Postgres (patient records)
  - Add a dashboard step only if Abdullah confirms it works.
- Honesty notes: no claims of production use, real patients, compliance, or performance numbers. "Shared secret enforced when configured" is accurate; do not say it is always on. The 47 tests were run and passed on 2026-10-29.

## Now
- Heading: "Now"
- Last updated: "October 2026"
- Building: "This portfolio, from scratch."
- Learning: "n8n, for practical AI automation workflows."
- Exploring: "AI agents, starting with a planned agent phase for DocScout."

## About
- Heading: "About"
- Timeline: "Backend developer intern", "Junior software developer", "Focused on AI automation and agents"
- Paragraph: "I started as a backend developer intern and grew into a junior software developer role, working on APIs, validation, and database-backed apps. Somewhere along the way, AI tools changed how I build. I spend less time on boilerplate and more on the product, the architecture, and the decisions that matter. Now I'm focused on AI automation and agents, and I learn by shipping my own projects."
- No employer name, no dates, no durations until Abdullah confirms them. No office-specific work.

## Beyond the code
- Heading: "Beyond the code"
- Desktop hint: "Hover a card". Mobile hint: "Tap a card".
- Screen-reader names for the reveal buttons (added in milestone 5): "More about cricket", "More about gaming".

### Cricket
- Label: "Cricket"
- Title: "Every Pakistan match, start to finish."
- Text: "I've watched for as long as I can remember. I don't get to play much anymore, but if the team is on, I'm watching, even on a second screen while I work."
- Reveal: "World Cup season is the one time my calendar gets negotiable."
- Chips: "TEAM · PAK", "FORMAT · ALL", "OVERS LEFT · ∞"

### Gaming and esports
- Header: "PLAYER 01", "ONLINE · WEEKENDS"
- Title: "Gaming and esports"
- List: Plays: "PUBG Mobile, Tekken 8". Squad: "Online friends". Watches: "PUBG Mobile global events". Majors: "Evo, EWC".
- Reveal: "Truth is, I watch more esports than I play."

### Events and meetups
- Header: "DEV EVENTS · KARACHI", "PASS" (all events are in Karachi)
- Label: "ATTENDEE". Name: "Abdullah Bin Nasir"
- Text: "Started later than I should have. Now I go to learn, and to meet people I'll see again at the next one."
- Stickers: "AI meetup", "GitHub Copilot session", "Freelancing session", "First hackathon"

### Reading
- Label: "Reading · currently"
- Title: "A habit I'm still building."
- Text: "Some weeks I read twice, some months not at all. Right now it's The Art of Being Alone by Renuka Gavrani."
- Book illustration text: "The Art of Being Alone", "Renuka Gavrani" (illustration only, not the real cover)
- Update the book when it changes.

## Contact
- Headline: "Got an idea? Let's build it."
- Sub-line: "For roles, collabs, or just to talk shop, my inbox is open."
- Email: abdullah.nasir7312@gmail.com
- LinkedIn: https://www.linkedin.com/in/abdullahnasir300/ (handle "abdullahnasir300")
- GitHub: https://github.com/SheikhAbdullahNasir (handle "SheikhAbdullahNasir")
- X: https://x.com/techyAbdullah (handle "@techyAbdullah")
- Instagram: https://www.instagram.com/abdullah.ai__/ (handle "@abdullah.ai__")
- Résumé: [Resume PDF not provided yet]. File name when provided: `Abdullah-Bin-Nasir-Resume.pdf`. Opens in a new tab; small "Download PDF" link.

## Footer
- "© 2026 Abdullah Bin Nasir" (use the current year)
- "Download resume PDF", "Back to top"

## Still missing (show as placeholders)
- GitHub repository links for DocScout and Patient Voice Agent.
- DocScout stack (verify from its repo).
- Patient Voice Agent "why" line, headline confirmation, diagram check against its repo, dashboard status.
- Résumé PDF.
- Which skills to list as proven (no skills section until decided).
