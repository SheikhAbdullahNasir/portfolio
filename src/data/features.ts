// On/off switches for the optional effects. Turning one off removes its behaviour
// and leaves the plain, readable page underneath.

export const features = {
  /** Goo melt on the hero name (desktop mouse only, never under reduced motion). */
  melt: true,
  /** Short fade and blur-to-sharp as text enters view (never under reduced motion). */
  scrollReveals: true,
} as const;

/** Melt tuning (see docs/reference/melt-test.html to try values). */
export const meltSettings = {
  /** Blur strength at 200px type; scales with the font size. */
  melt: 9,
  /** How far letters lean toward the cursor (0 to 1). */
  pull: 0.06,
} as const;
