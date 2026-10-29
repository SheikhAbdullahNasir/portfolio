// Project card palette names, in cycle order. Each name maps to the
// --card-<name>, --card-<name>-ink and --card-<name>-muted tokens in tokens.css.
export const cardColors = ['green', 'blue', 'burgundy', 'gold', 'plum'] as const;

export type CardColor = (typeof cardColors)[number];
