// Contact and footer copy from docs/CONTENT.md.

export type SocialIcon = 'linkedin' | 'github' | 'x' | 'instagram';

export interface SocialLink {
  name: string;
  handle: string;
  href: string;
  icon: SocialIcon;
}

export const contact = {
  headline: "Got an idea? Let's build it.",
  subLine: 'For roles, collabs, or just to talk shop, my inbox is open.',
  email: 'abdullah.nasir7312@gmail.com',
  copyLabel: 'Copy email',
  copiedLabel: 'Copied',
  socials: [
    {
      name: 'LinkedIn',
      handle: 'abdullahnasir300',
      href: 'https://www.linkedin.com/in/abdullahnasir300/',
      icon: 'linkedin',
    },
    {
      name: 'GitHub',
      handle: 'SheikhAbdullahNasir',
      href: 'https://github.com/SheikhAbdullahNasir',
      icon: 'github',
    },
    { name: 'X', handle: '@techyAbdullah', href: 'https://x.com/techyAbdullah', icon: 'x' },
    {
      name: 'Instagram',
      handle: '@abdullah.ai__',
      href: 'https://www.instagram.com/abdullah.ai__/',
      icon: 'instagram',
    },
  ] satisfies SocialLink[],
} as const;

export const footer = {
  /** Year is filled in at build time. */
  copyright: (year: number) => `© ${year} Abdullah Bin Nasir`,
  downloadLabel: 'Download resume PDF',
  backToTopLabel: 'Back to top',
} as const;
