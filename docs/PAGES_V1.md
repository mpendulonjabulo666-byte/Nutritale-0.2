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
| 9 | Profile and settings | prototype `Profile.dc.html` | PLACEHOLDER | Photo (round, change photo), allergies (any allergy, not only the legal list), market, reduce motion, privacy, **Delete my account** (also deletes the photo). |
| 12 | Navigation bar restyle | section E, `design/reference/navigation-target.jpg` | NOT STARTED | Active dot, grey inactive tabs, Profile tab shows the user's photo or initials, Discover gets Search / Categories / Collections. |
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

## E. Navigation bar (owner's target: `design/reference/navigation-target.jpg`)
Copy the **look and behaviour** of the bottom bar in the picture. Keep our own five tabs and our own colours (forest green, gold, cream).

1. **Five tabs:** Home, Pantry, Discover, Shopping, Profile (the order the owner set on 23 Nov 2026). Each tab is an outline icon with its full label under it.
2. **Active tab:** dark green icon and bold dark label. A small dot sits under the active tab. **Inactive tabs:** grey icon and grey label. Never use colour alone for the active state: the bold label and the dot also show it.
3. **Profile tab shows the user's own photo** in a round avatar, not an icon. The active state is a green ring around the photo. If the user has no photo yet, show a round circle with their initials. Accessibility label: "Profile". The avatar and initials are decoration for the screen reader; the label carries the meaning.
4. **Photo rules (V1):** the user picks a photo from the phone in Profile. Until the API can store images, keep the photo on the phone only (mock). Storing photos on a server needs a storage service and a privacy-policy line. UNKNOWN: which storage service and its free-tier limits. Delete my account must also delete the photo. Picking a photo needs `expo-image-picker`, which is a new package: ask the owner first.
5. **Each tab opens a list screen with a back arrow, a title, a rounded search bar under it, and big photo cards**, as in the picture. A home indicator bar sits under the tab bar on phones that have one (use the safe area; do not draw it).
6. **Labels never cut off.** At the largest font size the labels may wrap to two lines or the bar may grow taller. They never show "…".

### Discover tab sub-views (from the picture's Recipes tab)
The picture's Recipes tab branches into Weekly recipes, Categories and Collections. In our app Discover has three views, switched by a small segmented control under the search bar:
| View | V1? | Contents |
|---|---|---|
| Search | Yes | The ingredient search that works now, with "Did you mean". |
| Categories | Yes | Big photo cards: Breakfast, Lunch, Dinner, Snacks, then more (Meat, Poultry, Fish, Vegetarian...). Tapping one opens the recipe list for it. |
| Collections | Yes, small | Curated groups, e.g. "Quick weeknight meals". Needs recipes first. Start with 3 collections made from the mock data. |
| Weekly recipes | **No, later** | This is the meal planner. It stays out of V1. |

Photos: every photo needs a confirmed licence before launch (decision D11). Use the four licensed-unknown legacy photos or plain colour cards for mock only.

## Later, not V1
Meal planner, food chat, store finder with maps, store stock and aisle numbers, barcode scanning, expiry push notifications (V1 shows in-app "use soon" banners), premium subscriptions, the trained NutriTale model in the app, admin.
