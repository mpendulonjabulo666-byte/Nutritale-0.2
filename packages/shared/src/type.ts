/**
 * Type tokens. Source: docs/DESIGN_BRIEF.md section 2.4.
 * Minimum body size 16. Nothing below 12. Every size must work at 200% system font size.
 */
export const fontFamily = {
  display: 'Playfair Display',
  body: 'DM Sans',
  numeric: 'Space Grotesk',
} as const;

export const fontWeight = {
  display: 600,
  bodyRegular: 400,
  bodyMedium: 500,
  bodySemibold: 600,
  bodyBold: 700,
  numericMedium: 500,
  numericSemibold: 600,
} as const;

/** Sizes in px (web) / dp (mobile). */
export const fontSize = {
  /** Playfair Display 600 headings */
  display: [36, 32, 30, 28, 22] as const,
  /** DM Sans: 17 buttons, 16 body, then 15, 14, 13 */
  body: { button: 17, body: 16, md: 15, sm: 14, xs: 13 } as const,
  /** Space Grotesk numbers, labels and times */
  numeric: [17, 15, 14, 13] as const,
  minimumBody: 16,
  absoluteMinimum: 12,
} as const;

/** Letter spacing for uppercase Space Grotesk labels (em). The brief says "with letter spacing" but gives no value: 0.08em is a starting point (Estimate). */
export const labelLetterSpacingEm = 0.08;
