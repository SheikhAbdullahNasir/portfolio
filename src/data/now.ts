// Now section copy from docs/CONTENT.md. Update `lastUpdated` whenever the items change.

export interface NowItem {
  label: string;
  text: string;
}

export const now = {
  heading: 'Now',
  lastUpdated: 'October 2026',
  items: [
    { label: 'Building', text: 'This portfolio, from scratch.' },
    { label: 'Learning', text: 'n8n, for practical AI automation workflows.' },
    { label: 'Exploring', text: 'AI agents, starting with a planned agent phase for DocScout.' },
  ] satisfies NowItem[],
} as const;
