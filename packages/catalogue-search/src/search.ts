import { editDistance, fuzzyThreshold, letters, normalise } from './normalise';
import type {
  Catalogue,
  Ingredient,
  Locale,
  MatchType,
  SearchOptions,
  SearchResponse,
  SearchResult,
  SubstituteResult,
} from './types';

export const DEFAULT_LIMIT = 8;
const MAX_SUGGESTIONS = 3;

/** Display name for a locale: exact tag, then language ('en'), then '*'. */
export function displayNameFor(ingredient: Ingredient, locale: Locale = '*'): string {
  const names = ingredient.names;
  const lang = locale.split('-')[0] ?? '';
  return names[locale] ?? names[lang] ?? names['*'] ?? Object.values(names)[0] ?? ingredient.id;
}

interface Term {
  term: string;
  /** letters only, no plural folding (used for prefix / contains while typing) */
  full: string;
  /** letters only, plural folded (used for exact and fuzzy) */
  key: string;
  /** locale of the term; names count with their own locale key */
  locale: string;
  isName: boolean;
}

interface Entry {
  ingredient: Ingredient;
  terms: Term[];
}

const indexCache = new WeakMap<Catalogue, Entry[]>();

/**
 * Builds (once per catalogue array) the normalised terms of every ingredient.
 * Cached by array identity: pass a new array after changing the catalogue.
 */
function indexOf(catalogue: Catalogue): Entry[] {
  const cached = indexCache.get(catalogue);
  if (cached) return cached;
  const entries: Entry[] = catalogue.map((ingredient) => {
    const terms: Term[] = [];
    const add = (term: string, locale: string, isName: boolean): void => {
      const full = letters(term);
      if (!full) return;
      terms.push({ term, full, key: normalise(term), locale, isName });
    };
    for (const [locale, name] of Object.entries(ingredient.names)) add(name, locale, true);
    for (const alias of ingredient.aliases) add(alias.term, alias.locale, false);
    return { ingredient, terms };
  });
  indexCache.set(catalogue, entries);
  return entries;
}

/** 0 = the user's locale (or its language), 1 = '*', 2 = another locale. */
function localeRank(termLocale: string, userLocale: string): number {
  if (termLocale === userLocale) return 0;
  const lang = userLocale.split('-')[0];
  if (termLocale === lang) return 0;
  if (termLocale === '*') return 1;
  return 2;
}

interface Candidate {
  matchType: MatchType;
  matchedTerm: string;
  score: number;
  /** extra tiebreak: shorter matched term first */
  len: number;
}

function better(a: Candidate, b: Candidate | undefined): boolean {
  if (!b) return true;
  if (a.score !== b.score) return a.score > b.score;
  return a.len < b.len;
}

function scoreLevels(entry: Entry, qFull: string, qKey: string, locale: string, display: string): Candidate | undefined {
  let best: Candidate | undefined;
  for (const t of entry.terms) {
    let c: Candidate | undefined;
    if (t.key === qKey || t.full === qFull) {
      if (t.isName && t.term === display) {
        c = { matchType: 'exact', matchedTerm: t.term, score: 1, len: t.full.length };
      } else {
        const rank = localeRank(t.locale, locale);
        c = { matchType: 'alias', matchedTerm: t.term, score: 0.95 - rank * 0.05, len: t.full.length };
      }
    } else if (qFull.length >= 2 && (t.full.startsWith(qFull) || t.key.startsWith(qKey))) {
      c = { matchType: 'prefix', matchedTerm: t.term, score: 0.7 + 0.1 * (qFull.length / t.full.length), len: t.full.length };
    } else if (qFull.length >= 3 && t.full.includes(qFull)) {
      c = { matchType: 'contains', matchedTerm: t.term, score: 0.5 + 0.1 * (qFull.length / t.full.length), len: t.full.length };
    }
    if (c && better(c, best)) best = c;
  }
  return best;
}

function bestDistance(entry: Entry, qKey: string, max: number): { d: number; term: string } {
  let best = { d: max + 1, term: '' };
  for (const t of entry.terms) {
    const d = editDistance(qKey, t.key, Math.min(max, best.d));
    if (d < best.d) best = { d, term: t.term };
  }
  return best;
}

function sortResults(results: SearchResult[]): SearchResult[] {
  return results.sort(
    (a, b) => b.score - a.score || a.displayName.localeCompare(b.displayName),
  );
}

/**
 * The "no dead end" search ladder:
 * normalise -> exact name -> alias (user's locale, then '*', then others)
 * -> prefix (2+ letters) -> contains (3+ letters) -> fuzzy (1 edit for words
 * of 4 letters or fewer, 2 otherwise) -> unknown (suggestions + add custom).
 * Never throws on odd input.
 */
export function search(query: string, options: SearchOptions): SearchResponse {
  const locale = options.locale ?? '*';
  const catalogue = options.catalogue ?? [];
  const rawLimit = options.limit ?? DEFAULT_LIMIT;
  const limit = Math.max(0, Math.min(DEFAULT_LIMIT, Math.floor(Number.isFinite(rawLimit) ? rawLimit : DEFAULT_LIMIT)));

  const qFull = letters(typeof query === 'string' ? query : String(query ?? ''));
  const qKey = normalise(qFull);
  if (!qFull) {
    return { status: 'empty', results: [], suggestions: [], canAddCustom: false };
  }

  const entries = indexOf(catalogue);

  // Steps 2-5: exact, alias, prefix, contains.
  const hits: SearchResult[] = [];
  for (const entry of entries) {
    const displayName = displayNameFor(entry.ingredient, locale);
    const c = scoreLevels(entry, qFull, qKey, locale, displayName);
    if (c) {
      hits.push({ ingredient: entry.ingredient, displayName, matchType: c.matchType, matchedTerm: c.matchedTerm, score: c.score });
    }
  }
  if (hits.length) {
    const results = sortResults(hits).slice(0, limit);
    const status = results[0]?.matchType ?? hits[0]!.matchType;
    return { status, results, suggestions: [], canAddCustom: false };
  }

  // Step 6: fuzzy.
  const max = fuzzyThreshold(qKey);
  const fuzzy: SearchResult[] = [];
  for (const entry of entries) {
    const { d, term } = bestDistance(entry, qKey, max);
    if (d <= max) {
      fuzzy.push({
        ingredient: entry.ingredient,
        displayName: displayNameFor(entry.ingredient, locale),
        matchType: 'fuzzy',
        matchedTerm: term,
        score: 0.4 - 0.1 * d,
      });
    }
  }
  if (fuzzy.length) {
    const results = sortResults(fuzzy).slice(0, limit);
    const top = sortResults([...fuzzy])[0]!;
    return {
      status: 'fuzzy',
      results,
      didYouMean: { ingredient: top.ingredient, displayName: top.displayName },
      suggestions: [],
      canAddCustom: true,
    };
  }

  // Step 7: unknown. Never a dead end: nearest names + "add as my own item".
  const nearest = entries
    .map((entry) => ({
      name: displayNameFor(entry.ingredient, locale),
      d: bestDistance(entry, qKey, Number.POSITIVE_INFINITY).d,
    }))
    .sort((a, b) => a.d - b.d || a.name.localeCompare(b.name));
  const suggestions: string[] = [];
  for (const n of nearest) {
    if (suggestions.length >= MAX_SUGGESTIONS) break;
    if (!suggestions.includes(n.name)) suggestions.push(n.name);
  }
  return { status: 'unknown', results: [], suggestions, canAddCustom: true };
}

/** Cooking swaps for an ingredient, with names in the user's locale. Unknown ids give []. */
export function substitutesFor(id: string, catalogue: Catalogue, locale: Locale = '*'): SubstituteResult[] {
  const byId = new Map(catalogue.map((i) => [i.id, i] as const));
  const ingredient = byId.get(id);
  if (!ingredient) return [];
  const out: SubstituteResult[] = [];
  for (const sub of ingredient.substitutes) {
    const target = byId.get(sub.id);
    if (target) out.push({ ingredient: target, displayName: displayNameFor(target, locale), note: sub.note });
  }
  return out;
}
