// On/off switches for the optional effects. Turning one off removes its behaviour
// and leaves the plain, readable page underneath.

export const features = {
  /** Goo melt on the hero name (desktop mouse only, never under reduced motion). */
  melt: true,
  /** Short fade and blur-to-sharp as text enters view (never under reduced motion). */
  scrollReveals: true,
} as const;
