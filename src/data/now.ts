// Now section copy from docs/CONTENT.md. Update `lastUpdated` whenever the items change.

export interface NowItem {
  label: string;
  text: string;
  /** Remix Icon name (src/components/Icon.astro). */
  icon: 'hammer-line' | 'book-open-line' | 'compass-3-line';
}

export const now = {
  heading: 'Now',
  lastUpdatedLabel: 'Last updated',
  lastUpdated: 'October 2026',
  items: [
    { label: 'Building', text: 'This portfolio, from scratch.', icon: 'hammer-line' },
    { label: 'Learning', text: 'n8n, for practical AI automation workflows.', icon: 'book-open-line' },
    {
      label: 'Exploring',
      text: 'AI agents, starting with a planned agent phase for DocScout.',
      icon: 'compass-3-line',
    },
  ] satisfies NowItem[],
} as const;
