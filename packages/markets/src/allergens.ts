import type { AllergenId, Market } from './types';

/**
 * Display names per allergen group. '*' is the default; a market code key
 * (for example 'US') overrides it where that country's law uses other words.
 */
export const allergenNames: Readonly<Record<AllergenId, Readonly<Record<string, string>>>> = {
  'gluten-cereals': { '*': 'Cereals containing gluten' },
  wheat: { '*': 'Wheat' },
  crustaceans: { '*': 'Crustaceans', US: 'Crustacean shellfish' },
  molluscs: { '*': 'Molluscs' },
  eggs: { '*': 'Eggs' },
  fish: { '*': 'Fish' },
  peanuts: { '*': 'Peanuts' },
  'tree-nuts': { '*': 'Tree nuts' },
  soybeans: { '*': 'Soybeans' },
  milk: { '*': 'Milk' },
  sesame: { '*': 'Sesame' },
  mustard: { '*': 'Mustard' },
  celery: { '*': 'Celery' },
  lupin: { '*': 'Lupin' },
  sulphites: { '*': 'Sulphur dioxide and sulphites' },
};

export const allAllergenIds = Object.keys(allergenNames) as AllergenId[];

export function allergenName(id: AllergenId, market: Pick<Market, 'code'>): string {
  const names = allergenNames[id];
  return names[market.code] ?? names['*'] ?? id;
}

export interface MarketAllergen {
  id: AllergenId;
  name: string;
}

/** The allergen groups a market's label law names, with that market's display names. */
export function allergensFor(market: Market): MarketAllergen[] {
  return market.allergenRule.allergens.map((id) => ({ id, name: allergenName(id, market) }));
}

/**
 * Which of an ingredient's allergen tags this market's law names.
 * Tags outside the market's list are returned in `other`: still show them
 * (a user's own allergy does not follow the law), but not as a legal allergen.
 */
export function splitAllergens(tags: readonly AllergenId[], market: Market): { listed: AllergenId[]; other: AllergenId[] } {
  const listed = new Set(market.allergenRule.allergens);
  return {
    listed: tags.filter((tag) => listed.has(tag)),
    other: tags.filter((tag) => !listed.has(tag)),
  };
}
