/**
 * Colour tokens. Source: docs/DESIGN_BRIEF.md sections 2.1 and 2.2.
 *
 * Rules (section 2.3):
 * - `sage` is decoration on dark backgrounds only. Never text, borders or icons on cream, mint or white.
 * - Never put `forest` on `charcoal` or the reverse (1.54:1).
 * - A card on cream needs a border or shadow (mint, cream and white are 1.06 to 1.13:1 apart).
 * - Never show status by colour alone: always add a word.
 */
export const colors = {
  // Owner's palette (2.1)
  forest: '#174C35',
  sage: '#A9CDB6',
  mint: '#EAF4ED',
  cream: '#FAF8F1',
  charcoal: '#202722',
  white: '#FFFFFF',
  // Support colours added to pass contrast (2.2)
  muted: '#5B6A60',
  sageDeep: '#5E8A6E',
  warn: '#8A5A00',
  warnFill: '#F6E7C8',
  alert: '#B3261E',
  alertFill: '#FBE3E1',
} as const;

export type ColorToken = keyof typeof colors;
export type HexColor = (typeof colors)[ColorToken];

/** Role aliases so screens say what a colour is for, not which colour it is. */
export const roles = {
  background: colors.cream,
  surface: colors.white,
  text: colors.charcoal,
  textSecondary: colors.muted,
  primary: colors.forest,
  onPrimary: colors.white,
  softFill: colors.mint,
  border: colors.sageDeep,
  warnText: colors.warn,
  warnSurface: colors.warnFill,
  alertText: colors.alert,
  alertSurface: colors.alertFill,
} as const;
