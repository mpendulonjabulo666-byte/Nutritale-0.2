# PAGES_V1.md: every V1 page, its design target and its status

Owner decisions from 23 Nov 2026. Build **every page first with mock data**, then connect the API and database. One page per team job (see `docs/AGENT_TEAM.md`).

Status words: DONE, WORKS (on phone, not all four checks yet), BROKEN, PLACEHOLDER, NOT STARTED. Status below is from the owner's phone screenshots on 23 Nov 2026.

## Fix on every page first (job P0)
1. Tab labels are cut off ("Disco…", "Shop…"). Use short labels or a smaller size that still passes large font.
2. A grey gear button floats over the top-right of every screen and covers headers. UNKNOWN whether it is app code or an Expo dev tool. Scout 1 finds out; if it is ours, remove or move it.
3. Button text wraps badly ("I already have an account", "Add 'xyzberry' to my pantry"). Buttons grow in height, text never clips.

## Pages, in build order

| # | Page | Design target | Status | Notes |
|---|---|---|---|---|
| 1 | Welcome and sign-in | `design/reference/welcome-signin-target.jpg` | WORKS, wrong design | Must look **exactly** like the target. See section A. |
| 2 | Create account and Sign in with email | prototype `Main.dc.html` | WORKS | Reached from "Continue with Email" and "Create account". |
| 3 | Home | Section B below | PLACEHOLDER | Recipe discovery leads. Pantry supports it. |
| 4 | My Pantry | Section C below | BROKEN | Row layout collapses: names show one letter per line. Rebuild from the new design instead of patching. |
| 5 | Discover (ingredient search) | prototype `Search.dc.html`, `DidYouMean.dc.html` | WORKS | "Did you mean" and the unknown-word card work on the phone. |
| 6 | Recipe list | prototype `Home.dc.html` cards | NOT STARTED | Must handle hundreds of recipes: search, filters, paging. Allergen filter on by default. |
| 7 | Recipe details | prototype `Recipe.dc.html` | NOT STARTED | Ingredients (have / missing), steps, allergens with source, "Add missing to shopping list". |
| 8 | Shopping list | prototype `Shopping.dc.html` + section D | PLACEHOLDER | Grouped by aisle type, real checkboxes, progress, "All bought, move to pantry". |
| 9 | Profile and settings | prototype `Profile.dc.html` | PLACEHOLDER | Allergies (any allergy, not only the legal list), market, reduce motion, privacy, **Delete my account**. |
| 10 | Add your own item | from the search dead end | NOT STARTED | Name, category, optional quantity and date. |
| 11 | Forgot password | none yet | NOT STARTED | Email field, then "check your email" screen. Mock only until the API has it. |

## A. Welcome and sign-in (exact target)
Top to bottom, as in the picture:
1. NutriTale logo: open book with a sprout and a gold arc, "NutriTale" in serif forest green, gold underline.
2. The open recipe book illustration with food, tomatoes and leaves.
3. "Welcome to NutriTale", a small gold leaf divider, then *"Your ingredients. Your recipes. Your story."*
4. Four full-width buttons: **Continue with Apple** (dark green), **Continue with Google** (cream), **Continue with Facebook** (blue), **Continue with Email** (dark green).
5. "Don't have an account? **Create account**".
6. "Terms of Service | Privacy Policy" with gold rules either side.

Rules:
- Email works first. Apple, Google and Facebook show a "Coming soon" note until each is set up with that company. Before any store submission they must work or be removed, because store reviewers reject buttons that do nothing. Apple requires Sign in with Apple when Google or Facebook sign-in is offered on iPhone.
- The illustration and logo must be separate image files. UNKNOWN: the owner has not supplied them yet. Until then, the builder crops them from the target picture for mock use only.
- The book art mentions "Plan Your Meals" and "Discover Stores". Both are later features. Replace that art text before launch.

## B. Home (owner's layout)
1. Header: NutriTale logo, notifications, profile.
2. Search bar: "Search ingredients, food or recipes".
3. Featured recipes: large food photos on recipe cards.
4. Categories: Breakfast, Lunch, Dinner, Snacks.
5. Your pantry: compact item count and a "use soon" reminder.
6. Recommended for you: recipes matched to the pantry.
7. Bottom tabs: Home, Pantry, Discover, Shopping, Profile.

Keep the existing identity: forest green and gold, cream background, serif headings.

## C. My Pantry
1. Same header as Home. Count line, e.g. "12 items · 2 to use soon".
2. **Pantry helper box.** The user types a list ("2 onions, milk, rice") and it becomes pantry items. First version: split the list and match each word with the catalogue search (free, no AI). AI or voice comes later.
3. Filter chips: All, Use soon, then categories.
4. Items **grouped under headings** (Produce, Dairy, Meat, Grains...), one clean row each: name, quantity stepper, "use soon" tag on the right. The name gets the full remaining width.
5. "What can I cook?" button: recipes ranked by how many ingredients the user has.
6. "Add missing to shopping list".

The helper is food only. It never asks about illness and gives no medical, diet or weight-loss advice. Illness chat stays out of V1.

## D. Shopping list
Grouped by type like a store (Baking, Dairy, Meat...), quantity on the left, checkbox on the right, "Add your items" row at the top. Stock levels, aisle numbers and store prices need store data, so they are later.

## Later, not V1
Meal planner, food chat, store finder with maps, store stock and aisle numbers, barcode scanning, expiry push notifications (V1 shows in-app "use soon" banners), premium subscriptions, the trained NutriTale model in the app, admin.
