import { describe, expect, it } from 'vitest';
import { colors } from '../colors';
import { duration, easing, maxDecorativeMs } from '../motion';
import { fontSize } from '../type';

describe('tokens match DESIGN_BRIEF exactly', () => {
  it('colours', () => {
    expect(colors).toEqual({
      forest: '#174C35', sage: '#A9CDB6', mint: '#EAF4ED', cream: '#FAF8F1', charcoal: '#202722', white: '#FFFFFF',
      muted: '#5B6A60', sageDeep: '#5E8A6E', warn: '#8A5A00', warnFill: '#F6E7C8', alert: '#B3261E', alertFill: '#FBE3E1',
    });
  });
  it('motion durations and easing', () => {
    expect(duration).toEqual({ fast: 150, base: 300, enter: 520, celebrate: 400, loop: 1600 });
    expect(easing.css).toBe('cubic-bezier(.2,.8,.2,1)');
    expect(easing.standard).toEqual([0.2, 0.8, 0.2, 1]);
    for (const ms of Object.values(duration)) expect(ms).toBeLessThan(maxDecorativeMs);
  });
  it('type sizes respect the minimums', () => {
    expect(fontSize.body.body).toBe(16);
    const all = [...fontSize.display, ...Object.values(fontSize.body), ...fontSize.numeric];
    for (const s of all) expect(s).toBeGreaterThanOrEqual(fontSize.absoluteMinimum);
  });
});
