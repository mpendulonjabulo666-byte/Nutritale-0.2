import type { Market, MarketCode } from './types';

/**
 * Launch markets, in rollout order (owner decision, 22 Nov 2026):
 * South Africa first, then the United Kingdom, then the United States.
 *
 * To add a country, add one entry here. No other code changes.
 * Only mark an allergen rule 'verified' after reading the regulator's own page,
 * and record the URL and date.
 */
export const markets: readonly Market[] = [
  {
    code: 'ZA',
    name: 'South Africa',
    locale: 'en-ZA',
    currency: 'ZAR',
    measurement: 'metric',
    temperature: 'C',
    stage: 'first',
    allergenRule: {
      allergens: ['eggs', 'milk', 'crustaceans', 'molluscs', 'fish', 'peanuts', 'soybeans', 'tree-nuts', 'gluten-cereals'],
      regulation: 'R146 of 1 March 2010 (labelling and advertising of foodstuffs), definition of "common allergens"',
      url: 'https://ascfoodsafety.com/allergen-labelling-guide/',
      status: 'secondary',
      checked: '2026-11-22',
      note:
        'Read on a secondary site only, which contradicts itself (one list adds sulphites and omits molluscs). ' +
        'The official PDF (health.gov.za/wp-content/uploads/2025/07/Labelling-Regulations-R146-of-1-March-2010.pdf) ' +
        'is a scan with no text layer and was not read. Check the definition there before calling this list verified. ' +
        'Draft R3337 is not law (no publication date as of Oct 2026).',
    },
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    locale: 'en-GB',
    currency: 'GBP',
    measurement: 'metric',
    temperature: 'C',
    stage: 'second',
    allergenRule: {
      allergens: [
        'celery',
        'gluten-cereals',
        'crustaceans',
        'eggs',
        'fish',
        'lupin',
        'milk',
        'molluscs',
        'mustard',
        'peanuts',
        'sesame',
        'soybeans',
        'sulphites',
        'tree-nuts',
      ],
      regulation: 'Food Standards Agency, the 14 allergens (retained Regulation 1169/2011)',
      url: 'https://www.gov.uk/government/publications/allergen-guidance-for-food-businesses/allergen-guidance-for-food-businesses',
      status: 'verified',
      checked: '2026-11-22',
      note: 'Sulphites only above 10 parts per million. Page updated 17 July 2026.',
    },
  },
  {
    code: 'US',
    name: 'United States',
    locale: 'en-US',
    currency: 'USD',
    measurement: 'us-customary',
    temperature: 'F',
    stage: 'third',
    allergenRule: {
      allergens: ['milk', 'eggs', 'fish', 'crustaceans', 'tree-nuts', 'peanuts', 'wheat', 'soybeans', 'sesame'],
      regulation: 'FDA major food allergens (FALCPA, plus sesame under the FASTER Act from 1 Jan 2023)',
      url: 'https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies',
      status: 'verified',
      checked: '2026-11-22',
      note:
        'The law also requires the type of tree nut and the species of fish and crustacean shellfish. ' +
        'Whether FDA still lists coconut as a tree nut was not checked.',
    },
  },
];

/** The market used when a user's country is unknown or not launched yet. */
export const defaultMarketCode: MarketCode = 'ZA';

export function getMarket(code: MarketCode): Market | undefined {
  const wanted = code.toUpperCase();
  return markets.find((market) => market.code === wanted);
}

/** Like getMarket, but falls back to the default market instead of returning undefined. */
export function marketOrDefault(code: MarketCode | undefined | null): Market {
  const found = code ? getMarket(code) : undefined;
  if (found) return found;
  const fallback = getMarket(defaultMarketCode);
  if (!fallback) throw new Error(`Default market ${defaultMarketCode} is missing from the markets list`);
  return fallback;
}
