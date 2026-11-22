/** Shape and space tokens. Source: docs/DESIGN_BRIEF.md section 2.5. Values in px / dp. */
export const radius = {
  input: 14,
  button: 16,
  card: 20,
  cardLarge: 22,
  chip: 22,
  tabBar: 26,
} as const;

export const spacing = {
  screenSide: 22,
  gap: [8, 10, 12, 14, 18, 22] as const,
  xs: 8,
  sm: 10,
  md: 12,
  lg: 14,
  xl: 18,
  xxl: 22,
} as const;

/** Minimum tap target sizes (section 4 and AGENT_JOBS rule 3). */
export const tapTarget = {
  minimum: 44,
  tabWidth: 58,
  tabHeight: 60,
} as const;

/** Soft forest-tinted shadow. Keep shadows few on Android. */
export const shadow = {
  card: { css: '0 8px 22px rgba(23,76,53,.10)', color: '#174C35', opacity: 0.1, offsetY: 8, radius: 22, elevation: 3 },
} as const;
