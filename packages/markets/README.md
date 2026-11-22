# @nutritale/markets

Country (market) settings for NutriTale, as data: locale, currency, measurement
units, temperature unit, launch stage and the allergen list that each country's
food-label law names. Adding a country is a data change only.

Launch order (owner decision, 22 Nov 2026): **South Africa (ZA) first, United
Kingdom (GB) second, United States (US) third.** Country codes are ISO 3166-1,
so the UK is `GB`.

No runtime dependencies. Works in the Expo app (checked with a Metro Android
bundle, 22 Nov 2026), the Next.js app and the API.

```
npm test -w @nutritale/markets
npm run typecheck -w @nutritale/markets
```

## API

```ts
import { marketOrDefault, allergensFor, splitAllergens, displayMass, displayVolume,
         displayTemperature, formatMoney } from '@nutritale/markets';
import { search, seedCatalogue } from '@nutritale/catalogue-search';

const m = marketOrDefault(user.country);      // unknown or missing -> ZA
search('aubergine', { locale: m.locale, catalogue: seedCatalogue }); // names follow the market

allergensFor(m);                // [{ id: 'celery', name: 'Celery' }, ...] in the regulator's order
splitAllergens(['wheat', 'gluten-cereals'], m); // { listed: [...], other: [...] }
displayMass(454, m);            // ZA/GB { value: 454, unit: 'g' }   US { value: 1, unit: 'lb' }
displayVolume(250, m);          // ZA/GB { value: 250, unit: 'ml' }  US { value: 1.06, unit: 'cup' }
displayTemperature(180, m);     // ZA/GB { value: 180, unit: '°C' }  US { value: 356, unit: '°F' }
formatMoney(1250, m);           // ZA 'R 12,50'  GB '£12.50'  US '$12.50' (Node ICU output)
```

## Rules this package sets

1. **Store metric, show local.** Quantities are stored in grams, millilitres and
   degrees Celsius. Convert only for display.
2. **Store money as integer minor units** (cents, pence) with a currency code.
   `formatMoney` refuses fractions.
3. **Tag every ingredient with the superset of allergen ids** (`AllergenId`).
   Each market shows the groups its law names (`listed`). Show the rest too
   (`other`), because a user's own allergy does not follow the law, but do not
   call them legal allergens. Wheat is tagged `wheat` and `gluten-cereals`: the
   US names wheat; the UK and South Africa name cereals containing gluten.
4. **Never call an allergen list verified without reading the regulator's page.**
   A test fails if a `verified` rule cites a non-regulator site.

## Allergen sources (read 22 Nov 2026)

| Market | List | Status | Source |
|---|---|---|---|
| ZA | 9 groups: eggs, milk, crustaceans, molluscs, fish, peanuts, soybeans, tree nuts, cereals containing gluten | **secondary** | ascfoodsafety.com guide, which contradicts itself (one list adds sulphites and omits molluscs). The official R146 PDF on health.gov.za is a scan with no text layer and was not read. |
| GB | FSA 14 | verified | gov.uk FSA allergen guidance (updated 17 Jul 2026) |
| US | FDA 9, including sesame | verified | fda.gov "Food Allergies" (current as of 11 Mar 2026) |

**Before the South African launch:** someone must read the "common allergens"
definition in the R146 Gazette text and either mark the ZA rule `verified` or
correct it. Until then, the app should say the list is for guidance and tell
users to check the product label.

## How to add a country

1. Add one `Market` entry in `src/markets.ts`: ISO code, BCP 47 locale, ISO 4217
   currency, `metric` or `us-customary`, `C` or `F`, stage, and the allergen rule
   with its source URL, status and check date.
2. If the law uses other words for a group, add a key for that country in
   `allergenNames` (for example `US: 'Crustacean shellfish'`).
3. If the law names a group that is not in `AllergenId` yet, add the id and its
   name. Then tag the catalogue's ingredients with it.
4. Add the country's ingredient names and aliases in `@nutritale/catalogue-search`
   (see its README). Run `npm test`.

## NOT done

- Payments, prices and tax per market. Subscriptions are out of V1 scope (D2).
  Provider decisions are recorded in `DEVELOPMENT_ROADMAP.md` (D13).
- Not wired into the mobile, web or API apps yet. That is the next step for the
  South African launch experience.
- `Intl` output on a real phone (Hermes) was not checked; formats come from the
  device's locale data and may differ slightly from Node.
- UK gas marks and US fraction display ("1/4 cup") are left to the UI.
- Country detection (store region, device locale or a user setting) is not
  decided here.
