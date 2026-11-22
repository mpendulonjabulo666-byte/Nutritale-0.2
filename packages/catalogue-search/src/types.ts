/**
 * A locale tag such as 'en-ZA'. '*' means "any locale" (the default).
 * The named tags are the ones the seed uses; any other BCP 47 tag works too,
 * so adding a locale or language is a data change only.
 */
export type Locale = 'en-ZA' | 'en-US' | 'en-GB' | '*' | (string & {});

export interface Alias {
  /** Where this term is used. '*' = used everywhere. */
  locale: Locale;
  term: string;
}

export interface Substitute {
  /** Id of another ingredient in the same catalogue. */
  id: string;
  /** Short cooking note. Cooking advice only, never a health claim. */
  note: string;
}

export interface Ingredient {
  id: string;
  /** Display name per locale. Must contain a '*' default. */
  names: Record<string, string>;
  category: string;
  aliases: Alias[];
  substitutes: Substitute[];
}

export type Catalogue = readonly Ingredient[];

export type MatchType = 'exact' | 'alias' | 'prefix' | 'contains' | 'fuzzy';

export type SearchStatus = MatchType | 'unknown' | 'empty';

export interface SearchResult {
  ingredient: Ingredient;
  /** Name to show, in the user's locale. */
  displayName: string;
  matchType: MatchType;
  /** The catalogue term (name or alias) that matched the query. */
  matchedTerm: string;
  /** 0..1, higher is better. Only meaningful for ordering. */
  score: number;
}

export interface SearchOptions {
  locale?: Locale;
  catalogue: Catalogue;
  limit?: number;
}

export interface SearchResponse {
  status: SearchStatus;
  results: SearchResult[];
  /** Set when status is 'fuzzy': the closest ingredient ("Did you mean X?"). */
  didYouMean?: { ingredient: Ingredient; displayName: string };
  /** Set when status is 'unknown': up to 3 nearest display names. */
  suggestions: string[];
  /** True when the user should be offered "Add as my own pantry item". */
  canAddCustom: boolean;
}

export interface SubstituteResult {
  ingredient: Ingredient;
  displayName: string;
  note: string;
}
