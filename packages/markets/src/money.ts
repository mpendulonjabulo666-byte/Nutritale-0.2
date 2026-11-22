import type { Market } from './types';

/**
 * Rule: money is stored as an integer number of minor units (cents, pence)
 * together with its currency code. Never store a float.
 */

/** Number of minor-unit digits for a currency (2 for ZAR, GBP and USD). */
export function minorDigits(currency: string): number {
  return new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
}

/** Format an amount in minor units in the market's currency and locale. R 12,50 / £12.50 / $12.50. */
export function formatMoney(amountMinor: number, market: Pick<Market, 'locale' | 'currency'>): string {
  if (!Number.isInteger(amountMinor)) throw new RangeError('amountMinor must be an integer number of minor units');
  const digits = minorDigits(market.currency);
  return new Intl.NumberFormat(market.locale, { style: 'currency', currency: market.currency }).format(amountMinor / 10 ** digits);
}
