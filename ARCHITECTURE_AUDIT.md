# ARCHITECTURE_AUDIT.md

What currently exists and what needs changing.

**Status: NOT STARTED.** This file is a skeleton written during planning on 22 Nov 2026. Everything under "Known so far" was seen by the person planning. Everything else is for the audit to fill in. Nothing here has been tested.

Label every line you add: **Checked** (name the source), **Estimate**, or **UNKNOWN**.

---

## 1. Known so far (planning notes, 22 Nov 2026)

### MongoDB Atlas — Checked (read-only, through the MongoDB Atlas connection in the planning session)
| Item | Seen |
|---|---|
| Projects | Two, in one Atlas organisation: "Project 0" (created 22 Nov 03:59) and **"Nutritale"** (created 22 Nov 05:23). The master prompt says one primary database, so "Nutritale" is the one to use. |
| Cluster in "Nutritale" | `Nutritale`, free tier, AWS, af-south-1 (Cape Town), MongoDB 8.0.39, running (IDLE) |
| Databases in "Nutritale" | Only the system databases `admin` and `local`. No application data yet. |
| Old cluster in "Project 0" | `Varr1ck`, free tier, only the `sample_mflix` sample data. Unused. Leave it or delete it: the owner's choice. |
| Database users in "Nutritale" | Two: the owner-level admin user (`atlasAdmin`, not for the app) and `nutritale_app` (`readWrite@nutritale`, one cluster, created 22 Nov 2026). |
| Network access list in "Nutritale" | One entry: a single IP address (/32), created by Atlas auto setup. Not open to everyone. A server will need its own entry. |
| Backups, transaction support, free-tier limits | UNKNOWN. Check Atlas docs for the free tier before relying on any. |

Nothing was created, changed or deleted on the cluster.

### Postman — UNKNOWN
The owner says Postman is connected. The planning session had no Postman tool, so its workspace, collections and environments have not been seen. The audit must inspect them first.

### This repository — Checked
Checked 22 Nov 2026: planning docs, `CLAUDE.md`, `.gitignore`, `docs/DESIGN_BRIEF.md` and the prototype source in `design/prototype/`. There is no app code yet. The repository is **public**, so never commit secrets, real keys or private data.

### Legacy NutriTale — from the planning conversation, not re-verified here
- PHP 8 and MySQL, no framework. Live at nutritale.freedev.app on InfinityFree. Deployed by a GitHub Action over FTP from the `nutritale/` folder of `mpendulonjabulo666-byte/mpendulonjabulo666-byte.github.io`.
- 32 tables, all declared `ENGINE=InnoDB` in `sql/schema.sql` and `sql/db_migrations.php` (the live database's engines are UNKNOWN).
- 14 test scripts under `nutritale/tests/`. These are a checklist of what each feature must do, so they carry over as test cases for the port.
- PayFast payments are built but the merchant account is not yet approved to receive payments.
- Features on record: healthy recipes from any cuisine, pantry with AI ideas, allergy filtering, weekly planner and shopping list, hormone-supportive eating guide, favourites/ratings/own recipes, Premium with barcode scanning and ingredient links, expiry list.
- Known weakness found in the legacy app: the ingredient search ends on "none of the recipes use those ingredients" (a dead end). The new food catalogue must never do this.

## 2. Proposed mapping, legacy tables to MongoDB collections (PROPOSAL, derived from table names only)

| Legacy tables | Target collection(s) |
|---|---|
| users, password_resets, login_attempts | users (+ auth sessions) |
| recipes, recipe_ingredients, recipe_instructions, recipe_diet_tags, recipe_allergens | recipes (steps and tags embedded) |
| favorites, recipe_ratings | saved_recipes |
| user_pantry_items | pantry_items |
| ingredients, ingredient_aliases | food_catalogue, ingredients |
| meal_plan_items, meal_plan_templates, meal_plan_template_items | meal_plans |
| shopping_list_checks | shopping_lists, shopping_list_items |
| premium_subscriptions | subscriptions |
| user_diet_preferences, user_allergens, user_goals | user_preferences |
| ai_generations | food_chats, food_chat_messages (to confirm) |
| external_api_cache | UNKNOWN: confirm the external recipe API before deciding |
| ingredient_listings, ingredient_orders, recipe_purchases, vendor_payouts | Marketplace is switched off in legacy ("coming soon"). Decide whether it is ported at all. |
| platform_settings, recipe_reports, recipe_views, nutri_sessions, schema_migrations | settings, audit_logs, analytics, (sessions replaced by tokens) |

The audit must confirm each row against the real code before any migration is written. Existing user data is never deleted or overwritten.

---

## 3. Audit checklist (all NOT STARTED)

### 3.1 This repository
- [ ] Contents and structure
- [ ] Node, TypeScript and package manager versions chosen and pinned
- [ ] Monorepo layout from the master prompt (`apps/mobile`, `apps/api`, `apps/web`, `packages/shared`) created

### 3.2 MongoDB
- [ ] Database user for the app: least privilege, one database only
- [ ] Network access list reviewed (no open-to-everyone rule)
- [ ] Free-tier limits and what moves to a paid tier
- [ ] Collections, JSON schema validation, indexes, unique constraints
- [ ] Transactions: needed where? supported here?

### 3.3 Legacy NutriTale (read-only)
- [ ] Feature inventory with working / incomplete / technical debt per feature
- [ ] Which tests carry over, and as what
- [ ] Data to migrate (recipes, allergen rules, hormone guide, aliases) and its licence
- [ ] Which external recipe API is used, its limits and licence (UNKNOWN today)

### 3.4 Food data sources
- [ ] Open Food Facts. Checked on 22 Nov 2026: database under ODbL, individual contents under DbCL, images under CC BY-SA. Attribution and share-alike duties are NOT yet read. Read their terms of use before importing. Fit for plain foods like "beans" is UNKNOWN.
- [ ] Other candidate sources: licence, coverage, quality, rate limits
- [ ] Trust-rank design

### 3.5 Clients
- [ ] Expo app: SDK version, navigation, animation libraries
- [ ] Next.js web app
- [ ] Store requirements (Apple and Google): use the `app-store-ready` skill before submission

## 4. Findings and recommended changes
(empty — to be filled by the audit)

## 5. What was NOT checked
(the audit must list this at the end)
