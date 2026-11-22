/**
 * Motion tokens shared by web (`motion`) and mobile (Reanimated 4).
 * Source: docs/DESIGN_BRIEF.md section 6.1. Durations in milliseconds.
 *
 * Rules (6.2): animate only transform and opacity; no decorative motion longer than 5 s;
 * respect the reduced-motion setting (replace movement with a fade or nothing).
 */
export const duration = {
  /** Press feedback (scale 0.97). */
  fast: 150,
  /** Fades, chips, toasts (brief range 250 to 350). */
  base: 300,
  /** Cards and sections rising in (brief range 500 to 550). */
  enter: 520,
  /** Heart pop, tick draw, ring fill (brief range 350 to 450). */
  celebrate: 400,
  /** Loader only (brief range 1.2 to 2.4 s). */
  loop: 1600,
} as const;

export type DurationToken = keyof typeof duration;

/** cubic-bezier(.2,.8,.2,1) as control points. */
export const easing = {
  standard: [0.2, 0.8, 0.2, 1] as const,
  css: 'cubic-bezier(.2,.8,.2,1)',
} as const;

/** Stagger between items rising in (brief range 60 to 100 ms). */
export const stagger = {
  min: 60,
  default: 80,
  max: 100,
} as const;

/** Scale on press. */
export const pressScale = 0.97;

/** Longest decorative motion allowed (WCAG 2.2.2). */
export const maxDecorativeMs = 5000;

export const motion = { duration, easing, stagger, pressScale, maxDecorativeMs } as const;
