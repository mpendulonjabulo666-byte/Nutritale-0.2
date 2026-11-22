# DESIGN_BRIEF.md: NutriTale V1

**Status:** DRAFT for the owner's review. Written 22 Nov 2026.
**Prototype:** the clickable canvas "NutriTale V1 Prototype" (claude.ai artifact, private to the owner). Its source files are copied in `design/prototype/`.
**Research behind this brief:** `docs/research/` (three note files, every claim with a source link).

Labels used here: **Checked** (a source was read, named in `docs/research/`), **Estimate**, **UNKNOWN**.

---

## 1. V1 scope (decision D2: DECIDED by the owner, 22 Nov 2026)

Build only these five modules:

| # | Module | In V1 |
|---|---|---|
| 1 | Accounts and authentication | Register, sign in, profile, diet preferences, allergy preferences |
| 2 | Food catalogue and search | Catalogue, aliases, exact and fuzzy match, "did you mean", alternatives, no dead ends |
| 3 | My Pantry | Add, edit, remove, quantities, expiry dates, categories, pantry matching |
| 4 | Recipes | Discovery, pantry-matched suggestions, details, times, nutrition where verified, missing ingredients, favourites |
| 5 | Shopping list | Missing ingredients from recipes, add and remove, mark bought, categories |

**Not in V1:** food chat, maps and stores, weekly planner, advanced admin, advanced analytics, Vex integration, subscriptions and payments. Keep the code modular so they plug in later.

## 2. Brand tokens

### 2.1 Colours (owner's palette)
| Token | Hex | Use |
|---|---|---|
| `forest` | #174C35 | Primary buttons, headings, active states, links |
| `sage` | #A9CDB6 | Decoration and fills on dark backgrounds only |
| `mint` | #EAF4ED | Soft fills, active tab pill, chips, "have" tags |
| `cream` | #FAF8F1 | App background |
| `charcoal` | #202722 | Body text |
| `white` | #FFFFFF | Cards, inputs |

### 2.2 Support colours (added to pass contrast, checked by calculation)
| Token | Hex | Why it exists |
|---|---|---|
| `muted` | #5B6A60 | Secondary text. 5.38:1 on cream. |
| `sageDeep` | #5E8A6E | Input borders, chip outlines, icons. 3.70:1 on cream (needs 3:1). |
| `warn` / `warnFill` | #8A5A00 / #F6E7C8 | "Use soon", missing ingredients. 4.85:1 together. |
| `alert` / `alertFill` | #B3261E / #FBE3E1 | Allergens, "out of stock". 5.35:1 together. |

### 2.3 Contrast rules (Checked: calculated with the WCAG formula)
1. `sage` fails on every light background (1.5 to 1.7:1). Never use it for text, borders or icons on cream, mint or white.
2. `forest` passes on every light background (5.7 to 9.9:1). `forest` on `charcoal` fails (1.54:1): never put one on the other.
3. `mint`, `cream` and `white` are almost the same lightness (1.06 to 1.13:1). A card on cream needs a shadow or a border to show its edge.
4. Never show status by colour alone. Always add a word ("Have", "Missing", "Use in 2 days").

### 2.4 Type
| Role | Font | Sizes used |
|---|---|---|
| Display and headings | Playfair Display 600 | 36, 32, 30, 28, 22 |
| Interface and body | DM Sans 400 to 700 | 17 (buttons), 16 (body), 15, 14, 13 |
| Numbers, labels, times | Space Grotesk 500 to 600 | 17, 15, 14, 13 (uppercase labels with letter spacing) |

Minimum body size: 16. Nothing below 12. Every size must still work at 200% system font size (see section 9).

### 2.5 Shape and space
- Radius: inputs and buttons 14 to 16, cards 18 to 22, chips 22 (pill), tab bar 26.
- Spacing: screen side margin 22. Gaps 8, 10, 12, 14, 18, 22.
- Shadows: soft forest tint, for example `0 8px 22px rgba(23,76,53,.10)`. Keep shadows few on Android (cost is UNKNOWN, see `docs/research/expo_animation_stack.md`).

## 3. Design language (original, built from three references)

The owner named Uber Eats, Duolingo and Yelp. We copy none of their screens. We take one principle from each. Sources: `docs/research/reference_app_ux.md`.

1. **From Uber Eats: search that understands food.** Uber's 2018 search post describes a food knowledge graph and query expansion (a search for one dish also finds related dishes). NutriTale does the same with a South African alias list: dhania = coriander, mealie meal = maize meal, brinjal = eggplant.
2. **From Duolingo: motion that rewards.** Small, quick reactions to every action (a tick draws, a heart pops, a ring fills). Duolingo's published lesson: timing matters as much as the drawing. Celebrations must make sense in every culture.
3. **From Yelp: information in clear blocks.** Each fact in its own card (time, serves, nutrition, allergens). The same pattern everywhere.

**Search rules from Baymard and NN/g (Checked, see research notes):** show 4 to 8 suggestions on mobile. Autocomplete must handle typos. A "no results" page must offer other searches or swaps, never an empty screen.

## 4. Navigation
- Five tabs in a floating bottom bar: Home, Pantry, Discover, Shopping, Profile.
- Every tab shows an icon **and** a text label. The active tab gets a mint pill, bold label and `aria-current="page"`.
- Tab targets are at least 58 x 60 px. Android asks for 48 dp, Apple for 44 pt (Checked).
- The scroll area has bottom padding and `scroll-padding-bottom` so the bar never covers a focused item (WCAG 2.2, 2.4.11).
- Signed-out users land on the public welcome screen, never straight on sign-in. Sign-out returns there.

## 5. The first six screens (all in the prototype)

| # | Screen | Prototype file | What it must prove |
|---|---|---|---|
| 1 | Welcome, sign in, register | `Main.dc.html` | Public welcome first. Register asks for allergies in step 1 of 2. Paste and "Show password" work. |
| 2 | Home | `Home.dc.html` | Search first, "Use soon" warning, category chips, pantry-matched recipe cards with a match ring (3 of 5). |
| 3 | My Pantry | `Pantry.dc.html` | Categories, quantity steppers, expiry badges, "Out of stock" state, "Add item" goes to search. |
| 4 | Ingredient search | `Search.dc.html` | Live matching: exact, alias, prefix, contains, then fuzzy. Unknown words get "Add as my own item". |
| 5 | Did you mean and swaps | `DidYouMean.dc.html` | Typo shown, best guess large, other names we understand, cooking swaps, add to shopping list. |
| 6 | Recipe details | `Recipe.dc.html` | Photo, floating nutrition badges, allergen tag, have/missing list, "Add 2 missing to shopping list", method, nutrition marked "Estimated". |
| + | Loader | `Loader.dc.html` | Custom NutriTale loader: the book's pages turn while a sprout grows. No generic spinner. |

### 5.1 States every screen must have (not all are drawn yet)
| State | Rule |
|---|---|
| Loading | Use the NutriTale loader for waits over 1 second. Use skeleton cards for lists. |
| Empty | Say what this is, why it is empty and the next step ("No items yet. Add your first ingredient.") |
| Error | Say what happened, why, and how to fix it. Put the message next to the field and announce it. **NOT DRAWN YET.** |
| Offline | Show saved pantry and recipes. Say "You are offline" in a status line. **NOT DRAWN YET.** |

### 5.2 Search: the "no dead end" ladder
The prototype runs this logic (tested 22 Nov 2026 with node: dhania → Coriander, brinjol → did you mean Brinjal, tomatos → Tomatoes, chick peas → Chickpeas, mealie meal → Maize meal, xyzberry → add as own item).

1. Normalise: lower case, letters only (so "chick peas" = "chickpeas").
2. Exact match on the name or any alias.
3. Starts-with match (2 letters or more).
4. Contains match (3 letters or more).
5. Fuzzy match: edit distance 1 for words of 4 letters or fewer, 2 for longer words. Show it as "Did you mean X?" with a one-tap "Yes".
6. Nothing found: never an empty screen. Offer "Add as my own pantry item" and log the word so the catalogue learns it.
7. Swaps come from the catalogue (a `substitutes` list per ingredient, with a short cooking note). They are cooking advice, never health advice.

Production note: the API does this on the server (MongoDB Atlas Search or a normalised alias collection). The decision is OPEN; it goes into `DEVELOPMENT_ROADMAP.md`, Phase 2.

### 5.3 Allergens
- Mirror the eight allergen groups of South African regulation R146 (in force): egg, milk, crustaceans and molluscs, fish, peanuts, soy, tree nuts, gluten cereals. Source: `docs/research/mobile_accessibility_rules.md`. The newer draft (R3337) is not final. Check it again before launch.
- Allergen tags use the alert colours **and** a word ("Contains milk").
- The app hides recipes with a selected allergen and still says "Always check product labels too".

### 5.4 Nutrition
- Show values only with a named source. Otherwise label them "Estimated. Not yet verified."
- Do not use regulated claim words: "low fat", "source of", "light", "healthy" as a claim. Brand copy says "nourishing".
- The prototype values (340 kcal and so on) come from the legacy seed file `data/seed_recipes.php`. They are NOT verified.

## 6. Motion system

### 6.1 Motion tokens (one file shared by web and mobile: `packages/shared/motion.ts`)
| Token | Value | Use |
|---|---|---|
| `fast` | 150 ms | Press feedback (scale 0.97) |
| `base` | 250 to 350 ms | Fades, chips, toasts |
| `enter` | 500 to 550 ms, ease `cubic-bezier(.2,.8,.2,1)` | Cards and sections rising in, staggered by 60 to 100 ms |
| `celebrate` | 350 to 450 ms | Heart pop, tick draw, ring fill |
| `loop` | 1.2 to 2.4 s | Loader only |

### 6.2 Rules
1. Animate only `transform` and `opacity` (Reanimated docs: Checked). Never animate width, height, blur or shadows.
2. No decorative motion longer than 5 seconds. Floating badges and the logo sway run once (WCAG 2.2.2).
3. Respect the phone's reduced-motion setting: replace movement with a simple fade or no animation. Reanimated 4 follows the system setting by default (Checked). React Native's `AccessibilityInfo.isReduceMotionEnabled` gives live changes.
4. Keep fewer than about 100 animated components on screen on low-end Android (Reanimated docs).
5. Judge speed only in a release build on a cheap Android phone, never in a dev build.

### 6.3 Library mapping (Checked on npm, 22 Nov 2026; install with `npx expo install` so versions match the SDK)
The owner chose web libraries (shadcn/ui + Kokonut UI, `motion`, motion-primitives, lucide-react, clsx + tailwind-merge). Mobile cannot use most of them directly.

| Web (Next.js) | Mobile (Expo SDK 58, React Native 0.88) | Note |
|---|---|---|
| `motion` (motion.dev) | `react-native-reanimated` 4.x + `react-native-worklets` | `motion` has no React Native version. Reanimated 4 needs the New Architecture, which SDK 58 always uses. |
| shadcn/ui + Kokonut UI | React Native Reusables + NativeWind (4.2.7 stable) | Kokonut UI is web only. Rebuild its effects by hand. |
| motion-primitives `text-effect` | Reanimated `entering` animations per word | Web only. Rebuild by hand. |
| lucide-react | `lucide-react-native` + `react-native-svg` | Same icon names on both. |
| clsx + tailwind-merge | same packages | Plain JavaScript. Expected to work. Test it. |
| (none) | `lottie-react-native` (SDK-pinned ~7.5) | For the NutriTale loader. Lower risk than Rive. |
| (none) | `expo-image`, `@shopify/flash-list` v2 | Photos and long lists. |

Do not use Moti: last release January 2025, Reanimated 4 support UNVERIFIED.

## 7. Photos and data weight
- Every photo needs a licence and a credit. The legacy repo has `data/image_attribution.json` for recipe photos.
- **The prototype uses five images from the legacy repo** (logo, oats bowl, stir-fry, herbs, breakfast). The logo is the owner's. **The licence for the four photos is not on record.** Confirm or replace them before any public use.
- Data costs are high in South Africa (ICASA 2026: 1 GB costs about R35 to R85). Serve photos at card size, in WebP or AVIF, under about 80 KB each (Estimate). Add a data-saver setting that hides large photos.

## 8. Translating the prototype to Expo
| Prototype piece | Expo component |
|---|---|
| Bottom tab bar | Expo Router `Tabs` with a custom `tabBar` |
| Chips | `Pressable` with `accessibilityRole="button"` and `accessibilityState={{ selected }}` |
| Cards rising in | `Animated.View` with `entering={FadeInDown.duration(500).delay(i*60)}` |
| Match ring | `react-native-svg` `Circle` with an animated `strokeDashoffset` |
| Steppers | Two 44 px `Pressable`s and a `Text` with `accessibilityLiveRegion="polite"` (Android only; on iOS call `AccessibilityInfo.announceForAccessibility`) |
| Search field | `TextInput` with a debounced (about 150 ms, Estimate) call to `/catalogue/search` |
| Loader | Lottie file built from the SVG in `Loader.dc.html` |
| Photos | `expo-image` with `contentFit="cover"` and a blurhash placeholder |

## 9. Accessibility review (WCAG 2.1 AA, plus 2.2 where it matters)
Method: code review of the seven prototype files, plus contrast calculations. **Not done:** screen reader testing, 200% font size test, testing on a real phone. Those happen on the built app.

### Summary
Issues found: 10. Fixed in the prototype: 5. Open for the build: 5.

| # | Issue | WCAG | Severity | Status |
|---|---|---|---|---|
| 1 | Logo sway and floating badges ran for 6 s | 2.2.2 | Major | FIXED: run once |
| 2 | Swap options used `role="radio"` without arrow keys | 4.1.2 | Major | FIXED: toggle buttons with `aria-pressed` |
| 3 | Loader message announced every 1.6 s | 4.1.3 | Major | FIXED: one hidden "Loading recipe ideas" status |
| 4 | Bottom bar could cover the focused item | 2.4.11 (2.2) | Major | FIXED: `scroll-padding-bottom` on scroll areas |
| 5 | `sage` failed for text and borders on light backgrounds | 1.4.3, 1.4.11 | Critical | FIXED: `sageDeep` and `muted` added |
| 6 | No error states drawn for sign-in and registration | 3.3.1 | Major | OPEN: draw them before the build |
| 7 | Shopping and Profile tabs lead nowhere | 2.4.4 | Minor | OPEN: design these screens next |
| 8 | Screens are fixed at 390 px; 200% text not tested | 1.4.4 | Major | OPEN: test in the build with system font size at maximum |
| 9 | White text on the pantry photo header: contrast depends on the photo | 1.4.3 | Minor | OPEN: keep the dark overlay; check each real photo |
| 10 | Some text links are 37 px tall ("Forgot password?", "See all") | 2.5.8 passes (24 px); 44 px is AAA | Minor | OPEN: raise to 44 px in the build |

### Contrast check (Checked: calculated)
| Element | Foreground | Background | Ratio | Needs | Result |
|---|---|---|---|---|---|
| Body text | #202722 | #FAF8F1 | 14.38 | 4.5 | PASS |
| Headings, links | #174C35 | #FAF8F1 | 9.31 | 4.5 | PASS |
| Secondary text | #5B6A60 | #FAF8F1 | 5.38 | 4.5 | PASS |
| Input border | #5E8A6E | #FFFFFF | 3.94 | 3.0 | PASS |
| "Use soon" text | #8A5A00 | #F6E7C8 | 4.85 | 4.5 | PASS |
| Allergen text | #B3261E | #FBE3E1 | 5.35 | 4.5 | PASS |
| Button text | #FFFFFF | #174C35 | 9.90 | 4.5 | PASS |
| Sage label on forest | #A9CDB6 | #174C35 | 5.70 | 4.5 | PASS |

## 10. NOT CHECKED
- How the prototype looks on a real phone. Nobody has opened it on a device.
- Whether Lottie or Rive runs in Expo Go (research could not confirm).
- Blur and shadow cost on low-end Android (no source found).
- Photo licences for the four legacy photos.
- Whether R146 applies to app content at all, and the final text of R3337.
- Whether `clsx` and `tailwind-merge` work inside React Native Reusables.
