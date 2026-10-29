// 404 page copy from docs/CONTENT.md (approved by Abdullah, 2026-10-29).

export const notFound = {
  title: 'Page not found',
  code: '404',
  heading: 'This page does not exist.',
  text: 'The link may be old or mistyped. Everything I have built so far is on the home page.',
  primaryCta: { label: 'Back to home', href: '/' },
  secondaryCta: { label: 'Get in touch', href: '/#contact' },
} as const;
