# @nutritale/catalogue-search

Locale-aware ingredient search for NutriTale. It ports the "no dead end" search
ladder from `docs/DESIGN_BRIEF.md` section 5.2 (prototype:
`design/prototype/Search.dc.html`) to strict TypeScript and makes it work
across countries: a user in en-US who types "cilantro" and a user in en-ZA who
types "dhania" both reach the same ingredient, and each sees the name used
where they live.

Standalone package. It has no runtime dependencies and does not depend on the
monorepo root.

```
cd packages/catalogue-search
npm install
npm test          # vitest, prints the timing line
npm run typecheck # tsc --noEmit, strict mode
```

## API

```ts
import { search, substitutesFor, seedCatalogue } from '@nutritale/catalogue-search';

const r = search('dhania', { locale: 'en-ZA', catalogue: seedCatalogue });
// r.status            'alias'
// r.results[0]        { ingredient, displayName: 'Coriander', matchType: 'alias',
//                       matchedTerm: 'dhania', score: 0.95 }

search('brinjol', { locale: 'en-US', catalogue: seedCatalogue });
// { status: 'fuzzy', didYouMean: { displayName: 'Eggplant', ... }, canAddCustom: true, ... }

search('xyzberry', { locale: 'en-ZA', catalogue: seedCatalogue });
// { status: 'unknown', results: [], suggestions: [3 nearest names], canAddCustom: true }

substitutesFor('amasi', seedCatalogue, 'en-US');
// [{ displayName: 'Buttermilk', note: 'Thinner and a little less sour.', ingredient }, ...]
```

### `search(query, { locale = '*', catalogue, limit = 8 })`

Returns:

| Field | Meaning |
|---|---|
| `status` | `'exact' \| 'alias' \| 'prefix' \| 'contains' \| 'fuzzy' \| 'unknown' \| 'empty'`. The match type of the best result, or `unknown` / `empty`. |
| `results` | Up to `limit` results (never more than 8), best first: `{ ingredient, displayName, matchType, matchedTerm, score }`. |
| `didYouMean` | Only for `fuzzy`: the closest ingredient, for a "Did you mean X?" with a one-tap "Yes". |
| `suggestions` | Only for `unknown`: up to 3 nearest display names. |
| `canAddCustom` | `true` for `fuzzy` and `unknown`: show "Add as my own pantry item". |

It never throws on odd input: an empty, blank, digits-only or non-string query
returns `status: 'empty'`.

### `substitutesFor(id, catalogue, locale)`

Cooking swaps for one ingredient, with display names in the user's locale and
a short note. Unknown ids, and substitute ids missing from the catalogue, are
skipped. Notes are cooking advice only, never health claims (a test checks the
seed for claim words).

### Types

```ts
Ingredient {
  id: string;
  names: Record<string, string>;   // locale -> display name; '*' is the default
  category: string;
  aliases: { locale: Locale; term: string }[];   // 'en-ZA' | 'en-US' | 'en-GB' | '*' | any tag
  substitutes: { id: string; note: string }[];
}
```

## The ladder

1. **Normalise** both the query and every catalogue term: lower case, strip
   diacritics (NFD), letters only ("chick peas" = "chickpeas",
   "jalapeño" = "jalapeno"), then fold simple plurals (trailing `es` after
   o/s/x/z/ch/sh, otherwise trailing `s`; words ending in `ss`, `us`, `is` are
   left alone). So "tomatos", "tomatoes" and "tomato" all meet.
2. **Exact**: the query equals the ingredient's display name for the user's
   locale.
3. **Alias**: the query equals an alias, or a name used in another locale.
   Ranked user's locale (or its language, e.g. `en`) first, then `*`, then
   other locales.
4. **Prefix**: a term starts with the query (2 letters or more).
5. **Contains**: a term contains the query (3 letters or more).
6. **Fuzzy**: only when steps 2 to 5 find nothing. Damerau (optimal string
   alignment) edit distance, so a swap of two letters is one edit: at most 1
   edit for queries of 4 letters or fewer, 2 otherwise.
7. **Unknown**: never a dead end. Up to 3 nearest names as suggestions and
   `canAddCustom: true`. Logging the word so the catalogue learns it is the
   caller's job (not in this package).

Display names: `names[locale]`, then `names[language]` (`en`), then `names['*']`.

The normalised terms are built once per catalogue array and cached by array
identity. If you change a catalogue in place, pass a new array.

## How to add a locale or language

Data only, no code change:

1. Add the display name under the new tag in `names`, for example
   `names: { '*': 'Coriander', 'en-US': 'Cilantro', 'fr': 'Coriandre' }`.
   A language key (`fr`) covers every region (`fr-FR`, `fr-CA`) unless a
   region key is also given.
2. Add local terms to `aliases` with that tag, for example
   `{ locale: 'en-AU', term: 'capsicum' }`.
3. Run `npm test`. The seed integrity tests check ids, `*` names, substitute
   links and that no two ingredients share a name.

Only add names that are real everyday usage. If unsure, leave it out.

Note: normalisation keeps only the letters a to z after removing accents.
Languages in Latin script (isiZulu, Afrikaans, French) work as data only.
Other scripts (Arabic, Chinese) need a change to `letters()` in
`src/normalise.ts` first.

## Seed data

`src/seed/catalogue.ts`: 44 common ingredients with en-ZA, en-GB and en-US
names and aliases (coriander / cilantro / dhania, aubergine / eggplant /
brinjal, courgette / zucchini / baby marrow, maize meal / mealie meal /
cornmeal, plain flour / cake flour / all-purpose flour, amasi / maas, samp,
sugar beans, rooibos and more).

Decisions recorded in the seed:
- Maize meal keeps one display name everywhere; `cornmeal` is an en-US alias.
  US cornmeal is often yellow and coarser, so it is not shown as the name.
- Bell pepper keeps one display name; `red pepper` (en-GB), `green pepper` and
  `sweet pepper` (en-ZA) are aliases, so a UK user does not see a bare
  "Pepper" that could mean black pepper.
- `yam` (sometimes used in the US for sweet potato) is left out because it is
  also a different vegetable.

## NOT done

- **Server-side indexing.** This is an in-memory search for the client and for
  tests. Production search on the API (MongoDB Atlas Search or a normalised
  alias collection) is **decision D10, still OPEN** in
  `DEVELOPMENT_ROADMAP.md`. This package does not decide it; its ladder and
  tests can serve as the spec for whichever is chosen.
- Logging unknown words for catalogue growth.
- Multi-word ranking (for example matching "beef" inside "minced beef" scores
  as plain `contains`, not by word).
- Non-Latin scripts (see above).
- The seed names were chosen from common usage, not checked against a
  dictionary or a native speaker per locale.
