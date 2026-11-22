import { describe, expect, it } from 'vitest';
import { colors } from '../colors';
import { contrastRatio } from '../contrast';

/**
 * Every pair in docs/DESIGN_BRIEF.md section 9 "Contrast check".
 * `briefRatio` is the value printed in the brief; the test also checks our maths agrees with it.
 */
const pairs = [
  { element: 'Body text', fg: colors.charcoal, bg: colors.cream, briefRatio: 14.38, needs: 4.5 },
  { element: 'Headings, links', fg: colors.forest, bg: colors.cream, briefRatio: 9.31, needs: 4.5 },
  { element: 'Secondary text', fg: colors.muted, bg: colors.cream, briefRatio: 5.38, needs: 4.5 },
  { element: 'Input border', fg: colors.sageDeep, bg: colors.white, briefRatio: 3.94, needs: 3.0 },
  { element: '"Use soon" text', fg: colors.warn, bg: colors.warnFill, briefRatio: 4.85, needs: 4.5 },
  { element: 'Allergen text', fg: colors.alert, bg: colors.alertFill, briefRatio: 5.35, needs: 4.5 },
  { element: 'Button text', fg: colors.white, bg: colors.forest, briefRatio: 9.9, needs: 4.5 },
  { element: 'Sage label on forest', fg: colors.sage, bg: colors.forest, briefRatio: 5.7, needs: 4.5 },
] as const;

describe('WCAG contrast: DESIGN_BRIEF section 9', () => {
  it.each(pairs)('$element ($fg on $bg) passes $needs:1', ({ fg, bg, needs, briefRatio }) => {
    const ratio = contrastRatio(fg, bg);
    expect(ratio).toBeGreaterThanOrEqual(needs);
    expect(ratio).toBeCloseTo(briefRatio, 1);
  });

  it('sage on cream FAILS 3:1 (rule 2.3.1: sage is never text, border or icon on light backgrounds)', () => {
    expect(contrastRatio(colors.sage, colors.cream)).toBeLessThan(3);
  });

  it('forest on charcoal FAILS (rule 2.3.2: never put one on the other)', () => {
    expect(contrastRatio(colors.forest, colors.charcoal)).toBeLessThan(3);
  });
});

describe('contrastRatio maths', () => {
  it('black on white is 21:1 and is symmetric', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#000000')).toBeCloseTo(21, 5);
  });
  it('rejects invalid hex', () => {
    expect(() => contrastRatio('#12', '#FFFFFF')).toThrow();
  });
});
