# DEVELOPMENT_ROADMAP.md

Implementation phases and outstanding work.

**Status: DRAFT for the owner's approval.** Written during planning on 22 Nov 2026. No phase has started. Dates are NOT SET: the owner decides them. The owner once named 30 November as a target. For this scope that is not realistic, and the scope or the date must change. That is a decision for the owner, not for an agent.

Working rules for every phase:
1. One feature at a time. Inspect first, then plan, then build, then test, then document.
2. A phase is done only when its tests ran and passed in the current session, its Postman collection passed, and `SECURITY_AUDIT.md` is updated.
3. Do not break or silently remove working features. Do not touch the legacy NutriTale app except to read it.
4. Ask the owner before spending money, posting, deploying, deleting data or touching keys.

---

## Decisions the owner still has to make
| # | Decision | Status |
|---|---|---|
| D1 | Database | **Decided: MongoDB.** (Planning note: an earlier suggestion was PostgreSQL. The owner chose MongoDB.) |
| D2 | First-release scope: which modules are in version 1 | **Decided 22 Nov 2026:** accounts, food catalogue and search, pantry, recipes, shopping list. Excluded: food chat, maps, planner, advanced admin and analytics, Vex, subscriptions. See `docs/DESIGN_BRIEF.md`. |
| D3 | Target dates | OPEN |
| D4 | Chat model provider and monthly cost limit | OPEN. Pricing not checked. |
| D5 | Map provider (start with opening Apple Maps and Google Maps) | OPEN. Pricing not checked. |
| D6 | Subscription billing route for the store apps (direct Apple and Google billing, or a billing service) | OPEN. Rules per region now in `docs/DESIGN_BRIEF.md` section 5.5. In-app purchase is required on iPhone so web subscribers can unlock Premium. |
| D7 | Who owns the product, the code and the store accounts | **Decided 22 Nov 2026:** a registered company owns NutriTale and receives the revenue. Its owner is the authorised merchant representative (identity, company and bank checks for every payment provider and for the Apple and Google developer accounts). Varrick is the developer and integrator: he builds checkout, webhooks and tests, and never holds the company's secret keys in the app. Company name and type ((Pty) Ltd or other): CONFIRM?. |
| D8 | Open Food Facts terms: attribution and share-alike duties | OPEN. Read their terms of use. |
| D9 | Web framework details and package manager | OPEN. Mobile stack proposed in `docs/DESIGN_BRIEF.md` section 6.3 (Expo SDK 58, Reanimated 4, React Native Reusables + NativeWind). |
| D10 | Server-side search engine for the catalogue (Atlas Search or an alias collection) | OPEN |
| D12 | First launch markets (the app is international) | **Decided 22 Nov 2026:** 1 South Africa, 2 United Kingdom, 3 United States. Country settings live in `packages/markets` so that adding a country is data only. |
| D13 | Web payment provider for foreign currencies | OPEN. PayFast stays for ZAR. Shortlist to contact, in the company's name: FastSpring, 2Checkout (Verifone), Paddle, Peach Payments, Dodo Payments. Facts gathered so far are in `docs/research/paddle_verification.md`; facts about the others came from another chat and are UNVERIFIED. Choose only after written answers from the providers. |
| D11 | Photo source and licences for launch | OPEN. The four legacy photos in the prototype have no licence on record. |

## Current priorities (owner, 22 Nov 2026)
1. Complete the South African launch experience.
2. Test the app on a physical phone.
3. Verify ingredient matching (catalogue search) with real people and real words.
4. Test authentication and API security (Postman collections 1 and 2).
5. Finish payment-provider verification (Paddle questions, PayFast approval).
6. Prepare the UK localisation layer (en-GB names, allergen set, GBP, units).

Do not start deferred V1 modules. Do not rebuild working architecture.

## Phase 0 — Audit and setup
- [x] Least-privilege database user `nutritale_app` created (22 Nov 2026, readWrite on `nutritale`, one cluster)
- [x] `.gitignore` for secrets and build output (merged 22 Nov 2026)
- [x] Design brief and clickable prototype of the first six screens (`docs/DESIGN_BRIEF.md`, `design/prototype/`)
- [ ] Owner reviews the prototype; draw error, empty and offline states; design Shopping and Profile
- [ ] Inspect existing connections (MongoDB, Postman, repos). Report; do not ask to reconnect.
- [ ] Fill `ARCHITECTURE_AUDIT.md` and `SECURITY_AUDIT.md` with real findings
- [ ] Create the monorepo layout, strict TypeScript, linting, test runner
- [ ] Draft the shared API contract and error format

## Phase 1 — Foundation
- [ ] Accounts: registration, login, token refresh, logout, recovery
- [ ] Security baseline: validation, rate limits, headers, CORS, audit log
- [ ] Postman collections 1 and 2 passing
- [ ] Seed script and test database, separate from any real data

## Phase 2 — Food catalogue and ingredient matching (the "no dead end" rule)
- [ ] Catalogue schema with aliases, trust rank, source and licence fields
- [ ] Import from approved sources, after licences are read (D8)
- [ ] Exact, alias, normalised and fuzzy matching, plus "did you mean"
- [ ] Rule: a search never returns an empty screen without alternatives
- [ ] Port the allergen and ingredient-matching tests from legacy
- [ ] Postman collection 4 passing

## Phase 3 — Pantry, recipes and discovery
- [ ] Pantry with quantities and expiry dates
- [ ] Recipes with filters, favourites and ratings
- [ ] Port recipe data and the healthy-only rule from legacy
- [ ] Postman collections 3 and 5 passing

## Phase 4 — Shopping list (planner NOT in V1)
- [ ] Weekly planner with budget (later release)
- [ ] Shopping list generated from the plan and the pantry
- [ ] Postman collections 6 and 7 passing

## Phase 5 — Mobile app and web
- [ ] Expo app shell and the five-tab navigation
- [ ] Screens for the modules built so far
- [ ] Brand colours and fonts from the master prompt
- [ ] Animations with reduced-motion support, tested on a low-end Android phone
- [ ] Next.js web: landing page and signed-in pages

## Phase 6 — Store readiness (subscriptions NOT in V1)
- [ ] One central "is Premium" record
- [ ] Web payments through PayFast (account approval is outside the code)
- [ ] Apple and Google billing for the store apps (D6)
- [ ] Run the `app-store-ready` check before any submission
- [ ] Account deletion inside the app, privacy policy page, store listing material
- [ ] Postman collection 9 passing

## Phase 7 — Food chat, waste reminders, stores and maps (NOT in V1)
- [ ] Food-only chat with saved and deletable conversations, health notes, general-information wording ("supports", never "treats")
- [ ] Expiry reminders and push notifications
- [ ] Nearby stores page: open Apple or Google Maps; "likely stocked", never "in stock"; list only verified shops
- [ ] Postman collection 8 passing

## Phase 8 — Admin, analytics and Vex (NOT in V1)
- [ ] Admin dashboard (users, recipes, catalogue, subscriptions, settings)
- [ ] Typed Vex tools with their own permissions, rate limits and audit trail
- [ ] Postman collection 10 passing

---

## Outstanding work that is NOT in this repository
Legacy NutriTale still has open items that earn or protect money. They continue in parallel and are not replaced by this plan:
- Miss Mvula's PayFast verification, then a sandbox payment test and a check that PayFast's notice reaches the site
- The forgot-password link built from the request host (live issue) and the PayFast base-URL setting
- Refund page rewrite, recipe photos (21 missing, 4 wrong), the J06 diff review
- Cortex Synapse items that need Tony's accounts

## Not yet checked
(list here anything a phase depends on that nobody has verified)
- South Africa's R146 "common allergens" definition: only a secondary source was read (the official PDF is a scan). Needed before the SA launch. See `packages/markets/README.md`.
- Whether Paddle accepts NutriTale's product: its policy bans "medical advice (e.g., weight loss, muscle building)". Ask Paddle with a product description before building anything on it.
- The app on a physical phone (owner's job; nothing has run on a device yet).
- `Intl` money formats on Hermes (phone) versus Node.
