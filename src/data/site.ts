// Site-wide data. Copy comes from docs/CONTENT.md.

export const site = {
  name: 'Abdullah Bin Nasir',
  shortName: 'Abdullah',
  monogram: 'A',
  location: 'Karachi, Pakistan',
  description:
    'Abdullah Bin Nasir builds products with AI, end to end. Based in Karachi, open to full-time roles and collaborations.',
  lang: 'en',
  locale: 'en_US',
  /** Open Graph share image, made by `npm run og` (scripts/og-image.mjs). */
  shareImage: {
    src: '/og.png',
    width: 1200,
    height: 630,
    alt: 'Abdullah, Karachi, Pakistan. I build products with AI, end to end.',
  },
} as const;

export interface Resume {
  /** Path under public/. Leave undefined until the PDF is added; the placeholder renders instead. */
  href?: string;
  /** File name the PDF must use when it is added to public/ (docs/DEPLOY.md). */
  fileName: string;
  pillLabel: string;
  label: string;
  downloadLabel: string;
}

export const resume: Resume = {
  // href: '/Abdullah-Bin-Nasir-Resume.pdf', once the PDF is in public/.
  fileName: 'Abdullah-Bin-Nasir-Resume.pdf',
  pillLabel: 'Resume',
  label: 'Resume (PDF)',
  downloadLabel: 'Download PDF',
};
