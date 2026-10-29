// Site-wide data. Copy comes from docs/CONTENT.md; milestone 2 fills in the rest.

export const site = {
  name: 'Abdullah Bin Nasir',
  description:
    'Abdullah Bin Nasir builds products with AI, end to end. Based in Karachi, open to full-time roles and collaborations.',
  lang: 'en',
} as const;

export interface Section {
  /** Anchor id used in the URL and by the nav. */
  id: string;
  /** Section label shown in the pill nav and used as the section heading for now. */
  label: string;
}

// Home page sections, in page order. The hero has no label in the nav.
export const sections: readonly Section[] = [
  { id: 'work', label: 'Selected work' },
  { id: 'now', label: 'Now' },
  { id: 'about', label: 'About' },
  { id: 'beyond', label: 'Beyond the code' },
  { id: 'contact', label: 'Contact' },
];
