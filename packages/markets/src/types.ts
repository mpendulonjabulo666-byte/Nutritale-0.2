/**
 * ISO 3166-1 alpha-2 country code. The named codes are the launch markets;
 * any other code works too, so adding a country is a data change only.
 * Note: the United Kingdom is 'GB' (ISO), not 'UK'.
 */
export type MarketCode = 'ZA' | 'GB' | 'US' | (string & {});

/**
 * One id per allergen group. A superset of every launch market's list, so an
 * ingredient is tagged once and each market shows only the groups its law names.
 * 'wheat' and 'gluten-cereals' are separate on purpose: the US names wheat,
 * the UK and South Africa name cereals containing gluten. Tag wheat with both.
 */
export type AllergenId =
  | 'gluten-cereals'
  | 'wheat'
  | 'crustaceans'
  | 'molluscs'
  | 'eggs'
  | 'fish'
  | 'peanuts'
  | 'tree-nuts'
  | 'soybeans'
  | 'milk'
  | 'sesame'
  | 'mustard'
  | 'celery'
  | 'lupin'
  | 'sulphites';

/**
 * How sure we are that a market's allergen list matches the law.
 * - verified: read on the regulator's own page; see `url` and `checked`.
 * - secondary: from a secondary source only. The app must not present it as the legal list.
 * - unverified: not checked at all.
 */
export type SourceStatus = 'verified' | 'secondary' | 'unverified';

export interface AllergenRule {
  /** The allergen groups this market's label law names, in the regulator's order. */
  allergens: readonly AllergenId[];
  /** The law or regulation, in plain words. */
  regulation: string;
  /** Where the list was read. */
  url: string;
  status: SourceStatus;
  /** Date the source was last read (YYYY-MM-DD). */
  checked: string;
  note?: string;
}

/** 'metric': grams, millilitres. 'us-customary': ounces, pounds, cups, fluid ounces. */
export type MeasurementSystem = 'metric' | 'us-customary';

export type TemperatureUnit = 'C' | 'F';

/** Where a market is in the rollout. */
export type LaunchStage = 'first' | 'second' | 'third' | 'later';

export interface Market {
  code: MarketCode;
  /** English name for admin screens and logs. */
  name: string;
  /** BCP 47 tag. Pass it to `@nutritale/catalogue-search` as `locale` and to Intl. */
  locale: string;
  /** ISO 4217 currency code. */
  currency: string;
  measurement: MeasurementSystem;
  temperature: TemperatureUnit;
  stage: LaunchStage;
  allergenRule: AllergenRule;
}
