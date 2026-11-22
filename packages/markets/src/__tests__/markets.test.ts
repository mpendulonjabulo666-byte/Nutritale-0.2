import { describe, expect, it } from 'vitest';
import { allAllergenIds, allergenName, allergensFor, splitAllergens } from '../allergens';
import { getMarket, marketOrDefault, markets } from '../markets';
import { formatMoney, minorDigits } from '../money';
import type { Market } from '../types';
import { displayMass, displayTemperature, displayVolume } from '../units';

const za = getMarket('ZA')!;
const gb = getMarket('GB')!;
const us = getMarket('US')!;
const spaces = (s: string) => s.replace(/[\s  ]+/g, ' ');

describe('market list', () => {
  it('has the three launch markets in the owner-decided order', () => {
    expect(markets.map((m) => [m.code, m.stage])).toEqual([
      ['ZA', 'first'],
      ['GB', 'second'],
      ['US', 'third'],
    ]);
  });

  it('codes are unique upper-case ISO codes, locales and currencies are valid', () => {
    expect(new Set(markets.map((m) => m.code)).size).toBe(markets.length);
    for (const m of markets) {
      expect(m.code).toMatch(/^[A-Z]{2}$/);
      expect(Intl.getCanonicalLocales(m.locale)).toEqual([m.locale]);
      expect(m.locale.endsWith(`-${m.code}`)).toBe(true);
      expect(() => new Intl.NumberFormat('en', { style: 'currency', currency: m.currency })).not.toThrow();
    }
  });

  it('getMarket ignores case; the UK is GB, not UK', () => {
    expect(getMarket('gb')?.name).toBe('United Kingdom');
    expect(getMarket('UK')).toBeUndefined();
  });

  it('marketOrDefault falls back to South Africa', () => {
    expect(marketOrDefault('FR').code).toBe('ZA');
    expect(marketOrDefault(undefined).code).toBe('ZA');
    expect(marketOrDefault(null).code).toBe('ZA');
    expect(marketOrDefault('us').code).toBe('US');
  });
});

describe('allergen rules', () => {
  it('every rule uses known ids, has no duplicates, a source URL and a check date', () => {
    for (const m of markets) {
      const rule = m.allergenRule;
      expect(rule.allergens.length).toBeGreaterThan(0);
      expect(new Set(rule.allergens).size).toBe(rule.allergens.length);
      for (const id of rule.allergens) expect(allAllergenIds).toContain(id);
      expect(rule.url).toMatch(/^https:\/\//);
      expect(rule.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('a rule marked verified must cite a regulator page', () => {
    const regulatorHosts = ['www.gov.uk', 'www.food.gov.uk', 'www.fda.gov', 'www.health.gov.za', 'www.gov.za'];
    for (const m of markets) {
      const host = /^https:\/\/([^/]+)/.exec(m.allergenRule.url)?.[1];
      if (m.allergenRule.status === 'verified') expect(regulatorHosts).toContain(host);
    }
  });

  it('UK has the FSA 14 and US has the FDA 9', () => {
    expect(gb.allergenRule.allergens).toHaveLength(14);
    expect(us.allergenRule.allergens).toHaveLength(9);
    expect(us.allergenRule.allergens).toContain('sesame');
    expect(us.allergenRule.allergens).toContain('wheat');
    expect(us.allergenRule.allergens).not.toContain('molluscs');
    expect(gb.allergenRule.allergens).toContain('gluten-cereals');
    expect(gb.allergenRule.allergens).not.toContain('wheat');
  });

  it('South Africa stays marked secondary until R146 itself is read', () => {
    expect(za.allergenRule.status).toBe('secondary');
    expect(za.allergenRule.note).toMatch(/not read/);
  });

  it('display names follow the market', () => {
    expect(allergenName('crustaceans', us)).toBe('Crustacean shellfish');
    expect(allergenName('crustaceans', gb)).toBe('Crustaceans');
    expect(allergensFor(us).map((a) => a.name)).toContain('Crustacean shellfish');
  });

  it('splits an ingredient’s tags into the market’s legal list and the rest', () => {
    const wheatFlour = ['wheat', 'gluten-cereals'] as const;
    expect(splitAllergens(wheatFlour, us)).toEqual({ listed: ['wheat'], other: ['gluten-cereals'] });
    expect(splitAllergens(wheatFlour, gb)).toEqual({ listed: ['gluten-cereals'], other: ['wheat'] });
    expect(splitAllergens(['mustard'], za)).toEqual({ listed: [], other: ['mustard'] });
  });
});

describe('units (stored metric, shown in the market’s units)', () => {
  it('mass', () => {
    expect(displayMass(500, za)).toEqual({ value: 500, unit: 'g' });
    expect(displayMass(1500, gb)).toEqual({ value: 1.5, unit: 'kg' });
    expect(displayMass(100, us)).toEqual({ value: 3.5, unit: 'oz' });
    expect(displayMass(453.59237, us)).toEqual({ value: 1, unit: 'lb' });
  });

  it('volume', () => {
    expect(displayVolume(250, za)).toEqual({ value: 250, unit: 'ml' });
    expect(displayVolume(1500, gb)).toEqual({ value: 1.5, unit: 'l' });
    expect(displayVolume(4.92892159375, us)).toEqual({ value: 1, unit: 'tsp' });
    expect(displayVolume(14.78676478125, us)).toEqual({ value: 1, unit: 'tbsp' });
    expect(displayVolume(236.5882365, us)).toEqual({ value: 1, unit: 'cup' });
  });

  it('temperature', () => {
    expect(displayTemperature(180, za)).toEqual({ value: 180, unit: '°C' });
    expect(displayTemperature(180, us)).toEqual({ value: 356, unit: '°F' });
    expect(displayTemperature(-18, us)).toEqual({ value: 0, unit: '°F' });
  });

  it('rejects bad input instead of showing nonsense', () => {
    expect(() => displayMass(-1, za)).toThrow(RangeError);
    expect(() => displayVolume(Number.NaN, us)).toThrow(RangeError);
    expect(() => displayTemperature(Number.POSITIVE_INFINITY, us)).toThrow(RangeError);
  });
});

describe('money (integer minor units)', () => {
  it('formats in each market’s currency and locale', () => {
    expect(minorDigits('ZAR')).toBe(2);
    expect(spaces(formatMoney(1250, za))).toBe('R 12,50');
    expect(formatMoney(1250, gb)).toBe('£12.50');
    expect(formatMoney(1250, us)).toBe('$12.50');
  });

  it('refuses fractional minor units', () => {
    expect(() => formatMoney(12.5, za)).toThrow(RangeError);
  });
});

describe('a new market is data only', () => {
  it('works with every helper without code changes', () => {
    const au: Market = {
      code: 'AU',
      name: 'Australia',
      locale: 'en-AU',
      currency: 'AUD',
      measurement: 'metric',
      temperature: 'C',
      stage: 'later',
      allergenRule: { allergens: ['lupin', 'sesame'], regulation: 'test only', url: 'https://example.com', status: 'unverified', checked: '2026-11-22' },
    };
    expect(allergensFor(au).map((a) => a.id)).toEqual(['lupin', 'sesame']);
    expect(displayMass(2000, au)).toEqual({ value: 2, unit: 'kg' });
    expect(formatMoney(999, au)).toBe('$9.99');
  });
});
