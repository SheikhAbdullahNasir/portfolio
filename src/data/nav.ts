// Navigation: pill labels and menu links. Copy from docs/CONTENT.md.

export interface NavSection {
  /** Anchor id of the section on the home page. */
  id: string;
  /** Label in the pill nav and the section heading. */
  label: string;
  /** Shorter label in the full-screen menu. */
  menuLabel: string;
  /** Number shown next to the menu link. */
  number: string;
}

/** Pill label while the hero is in view. */
export const topLabel = 'Abdullah Bin Nasir';

// Home page sections, in page order. The hero is not listed.
export const navSections: readonly NavSection[] = [
  { id: 'work', label: 'Selected work', menuLabel: 'Work', number: '01' },
  { id: 'now', label: 'Now', menuLabel: 'Now', number: '02' },
  { id: 'about', label: 'About', menuLabel: 'About', number: '03' },
  { id: 'beyond', label: 'Beyond the code', menuLabel: 'Beyond the code', number: '04' },
  { id: 'contact', label: 'Contact', menuLabel: 'Contact', number: '05' },
];
