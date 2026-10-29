# Portfolio V2

Personal portfolio of Abdullah Bin Nasir. Astro 7, TypeScript, deployed on Vercel.

## Start here
1. `AGENTS.md`: rules for any coding agent (Claude Code reads it through `CLAUDE.md`).
2. `docs/PROJECT_STATE.md`: where things stand and what to do next.
3. `docs/BUILD_SPEC.md`: what to build, milestone by milestone.
4. `docs/CONTENT.md`: all copy and placeholders.
5. `docs/DECISIONS.md`: why things are the way they are.
6. `docs/DEPLOY.md`: Vercel and custom domain steps.

## Using this handoff
1. Create an empty GitHub repository (for example `portfolio-v2`) and clone it.
2. Copy every file from this folder into the repository root and commit them ("Add project docs").
3. Open the folder in Claude Code and start with this prompt:

> Read AGENTS.md, docs/PROJECT_STATE.md and docs/BUILD_SPEC.md. Then do milestone 1 only: scaffold Astro 7 with TypeScript in this repo, add the design tokens and fonts, build the base layout with empty sections, and make sure `npm run build` passes. Do not build later milestones yet. When done, update docs/PROJECT_STATE.md, list what you verified, and stop so I can review.

4. Review, commit, and move to the next milestone with a similar prompt.
