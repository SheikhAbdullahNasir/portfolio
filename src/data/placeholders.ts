// Placeholder text for content that is still missing, copied from docs/CONTENT.md.
// Render these through the Placeholder component so they stay visible until filled.
// When the real content arrives, add it to the data or project file; the placeholder
// stops showing on its own. Keep this list in sync with docs/PROJECT_STATE.md.
export const placeholders = {
  projectWhy: '[Why I built it, in your words]',
  projectStack: '[Stack: confirm from repo]',
  projectGithub: '[GitHub link pending]',
  resume: '[Resume PDF not provided yet]',
} as const;

export type PlaceholderKey = keyof typeof placeholders;
