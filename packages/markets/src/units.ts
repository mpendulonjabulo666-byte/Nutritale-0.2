import type { Market } from './types';

/**
 * Rule: quantities are stored in metric only (grams, millilitres, degrees
 * Celsius). Convert to the user's units for display, never for storage.
 */

export interface Quantity {
  value: number;
  unit: 'g' | 'kg' | 'oz' | 'lb' | 'ml' | 'l' | 'tsp' | 'tbsp' | 'cup' | '°C' | '°F';
}

/** Exact factors: 1 oz = 28.349523125 g; 1 US cup = 236.5882365 ml. */
export const GRAMS_PER_OUNCE = 28.349523125;
export const OUNCES_PER_POUND = 16;
export const ML_PER_US_CUP = 236.5882365;
export const ML_PER_US_TABLESPOON = ML_PER_US_CUP / 16;
export const ML_PER_US_TEASPOON = ML_PER_US_TABLESPOON / 3;

function round(value: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

function checkAmount(amount: number, what: string): void {
  if (!Number.isFinite(amount) || amount < 0) throw new RangeError(`${what} must be a finite number of 0 or more`);
}

/** Mass for display. Metric: g, or kg from 1,000 g. US: oz, or lb from 1 lb. */
export function displayMass(grams: number, market: Pick<Market, 'measurement'>): Quantity {
  checkAmount(grams, 'grams');
  if (market.measurement === 'metric') {
    return grams >= 1000 ? { value: round(grams / 1000), unit: 'kg' } : { value: round(grams, 0), unit: 'g' };
  }
  const ounces = grams / GRAMS_PER_OUNCE;
  return ounces >= OUNCES_PER_POUND ? { value: round(ounces / OUNCES_PER_POUND), unit: 'lb' } : { value: round(ounces, 1), unit: 'oz' };
}

/**
 * Volume for display. Metric: ml, or l from 1,000 ml.
 * US: tsp under 1 tbsp, tbsp under 1/4 cup, then cups.
 */
export function displayVolume(ml: number, market: Pick<Market, 'measurement'>): Quantity {
  checkAmount(ml, 'millilitres');
  if (market.measurement === 'metric') {
    return ml >= 1000 ? { value: round(ml / 1000), unit: 'l' } : { value: round(ml, 0), unit: 'ml' };
  }
  if (ml < ML_PER_US_TABLESPOON) return { value: round(ml / ML_PER_US_TEASPOON), unit: 'tsp' };
  if (ml < ML_PER_US_CUP / 4) return { value: round(ml / ML_PER_US_TABLESPOON), unit: 'tbsp' };
  return { value: round(ml / ML_PER_US_CUP), unit: 'cup' };
}

/** Temperature for display, rounded to a whole degree (never "-0"). */
export function displayTemperature(celsius: number, market: Pick<Market, 'temperature'>): Quantity {
  if (!Number.isFinite(celsius)) throw new RangeError('celsius must be a finite number');
  const whole = (value: number) => Math.round(value) + 0;
  if (market.temperature === 'C') return { value: whole(celsius), unit: '°C' };
  return { value: whole((celsius * 9) / 5 + 32), unit: '°F' };
}
