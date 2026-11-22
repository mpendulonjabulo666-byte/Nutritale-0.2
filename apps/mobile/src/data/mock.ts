/**
 * Mock data for building screens before the API exists (job J06).
 * Recipe names, counts and times come from design/prototype/ (which took them from the legacy
 * NutriTale seed file). They are NOT verified. No photos: the legacy photos have no licence on record.
 */

export type DietTag = 'Vegetarian' | 'Vegan';

export interface MockRecipe {
  id: string;
  title: string;
  /** Shown on the card badge; undefined when the prototype gives no time. */
  time?: string;
  have: number;
  total: number;
  diet: DietTag;
}

export const recipes: MockRecipe[] = [
  { id: 'overnight-oats', title: 'Overnight Oats with Mixed Berries', time: '10 min + overnight', have: 3, total: 5, diet: 'Vegetarian' },
  { id: 'chickpea-stir-fry', title: 'Chickpea & Vegetable Stir-Fry', time: '20 min', have: 4, total: 6, diet: 'Vegan' },
  { id: 'chakalaka-bean-stew', title: 'Chakalaka and Bean Stew', have: 6, total: 8, diet: 'Vegan' },
];

export interface MockPantryItem {
  id: string;
  name: string;
  /** Days until expiry; undefined = no date. */
  expiresInDays?: number;
}

/** 12 items, two of them to use soon (prototype Home: "12 items · 2 to use soon"). */
export const pantry: MockPantryItem[] = [
  { id: 'milk', name: 'Milk', expiresInDays: 2 },
  { id: 'spinach', name: 'Spinach', expiresInDays: 3 },
  { id: 'rolled-oats', name: 'Rolled oats' },
  { id: 'chickpeas', name: 'Chickpeas' },
  { id: 'onion', name: 'Onion', expiresInDays: 14 },
  { id: 'tomatoes', name: 'Tomatoes', expiresInDays: 6 },
  { id: 'rice', name: 'Rice' },
  { id: 'eggs', name: 'Eggs', expiresInDays: 12 },
  { id: 'maize-meal', name: 'Maize meal' },
  { id: 'sugar-beans', name: 'Sugar beans' },
  { id: 'garlic', name: 'Garlic', expiresInDays: 20 },
  { id: 'butter', name: 'Butter', expiresInDays: 30 },
];

/** Items that expire within this many days count as "use soon". */
export const USE_SOON_DAYS = 3;

export function itemsToUseSoon(items: MockPantryItem[] = pantry): MockPantryItem[] {
  return items
    .filter((item) => item.expiresInDays !== undefined && item.expiresInDays <= USE_SOON_DAYS)
    .sort((a, b) => (a.expiresInDays ?? 0) - (b.expiresInDays ?? 0));
}

/** Home category chips (prototype Home). "South African" is a market-specific chip for ZA. */
export const homeCategories = ['For you', 'Breakfast', 'Under 20 min', 'Vegan', 'South African', 'Kids'] as const;
