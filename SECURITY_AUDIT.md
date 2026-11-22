# SECURITY_AUDIT.md

MongoDB, API security and Postman test results.

**Status: STARTED 22 Nov 2026.** Checked locally so far: the API skeleton's middleware (section 3.1), and on 22 Nov 2026 the J07a auth, user and catalogue routes with in-memory storage (section 3.2, vitest and newman; no database, nothing deployed). Every other result below is NOT RUN. Do not change a result unless you ran the check in the current session and can quote the output.

Rules for this file:
1. HTTP 200 does not mean secure. A secure endpoint also refuses the wrong caller, the wrong data and too many requests.
2. Postman tests the controls. The controls themselves live in the API code.
3. No secret, key, token or connection string with a password goes in this file, in Postman collections, or in git. Postman environments hold only test values.
4. Fix a failed check before marking the endpoint complete. Record the fix and re-run the check.

---

## 1. Known so far (planning notes, 22 Nov 2026)

| Area | State |
|---|---|
| Atlas cluster | Checked 22 Nov 2026 (read-only). Project "Nutritale", cluster `Nutritale`, free tier, Cape Town, empty (system databases only). An older project "Project 0" holds an unused sample-data cluster. |
| Atlas database users | Checked 22 Nov 2026: owner-level `atlasAdmin` user (not for the app), and `nutritale_app` created 22 Nov 2026 with `readWrite@nutritale` on one cluster (seen in the Atlas UI). Connection with this user NOT yet tested. Password is only in the owner's local `.env`. |
| Atlas network access list | Checked 22 Nov 2026: one single-IP entry (from Atlas auto setup), nothing open to everyone. Home and mobile IPs change, so the owner's own access may break. A server needs its own entry. |
| Postman | Checked 22 Nov 2026: still not reachable from the planning session (no Postman tool, no Postman CLI installed there). Inspect it from the owner's terminal. |
| Atlas backups and encryption settings | UNKNOWN. Check the free-tier terms. |
| Postman workspace | UNKNOWN. Not inspected yet. |
| Repository visibility | Public. Secrets must never be committed. |
| Legacy NutriTale carry-over items to verify | Rotate any key that was ever exposed in chat or code; delete leftover test pages such as `t.php`; take a database export before any migration; keep PayFast merchant ID, key and passphrase only in `config.local.php`. |

## 2. MongoDB security checklist (all NOT STARTED)
- [ ] App connects with its own least-privilege user (readWrite on one database only). User exists; connection not tested yet.
- [ ] Admin or Atlas-owner credentials never used by the app
- [ ] Network access list has no allow-everyone entry
- [ ] TLS in transit confirmed
- [ ] Connection string only in an environment variable, never committed
- [ ] Schema validation on every collection
- [ ] Unique indexes where duplicates must not exist
- [ ] Query construction safe against NoSQL injection (no raw user objects in queries)
- [ ] Every query filtered by the signed-in user's id (ownership)
- [ ] Backups and restore tested (what the free tier offers is UNKNOWN)

## 3. API security checklist (all NOT STARTED)
| Control | Built | Tested |
|---|---|---|
| Argon2id password hashing | Built (`@node-rs/argon2`, m=19456, t=2, p=1) | PASS, 22 Nov 2026 (see 3.2) |
| Short-lived access tokens | Built (HS256 JWT, 15 min, `jose`) | PASS, 22 Nov 2026 (see 3.2) |
| Refresh-token rotation and revocation | Built (SHA-256 hash stored, 30 days, family revoked on reuse) | PASS, 22 Nov 2026 (see 3.2) |
| Logout invalidates tokens | Built (revokes the session; access tokens check the session) | PASS, 22 Nov 2026 (see 3.2) |
| Account recovery with expiring, single-use link | NOT STARTED | NOT RUN |
| Reset and payment links built from a fixed configured base URL, never the request's Host header | NOT STARTED | NOT RUN |
| Role-based access control | NOT STARTED | NOT RUN |
| Ownership checks (no insecure direct object references) | Built for `/me` routes (user id only from the token; no route takes one) | PASS, 22 Nov 2026 (see 3.2) |
| Premium entitlement checked on the server | NOT STARTED | NOT RUN |
| Input validation on every endpoint (shared schemas) | Built for every current route (zod `.strict()`, `apps/api/src/routes/schemas.ts`) | PASS, 22 Nov 2026 (see 3.2) |
| Rate limiting (login, reset, chat, import) | Global limit, plus a tighter shared limit for register, login and refresh, plus a catalogue limit (per IP, in-process store). Reset, chat, import: no such routes yet. | Global: PASS (3.1, 3.2). Auth and catalogue: PASS, 22 Nov 2026 (see 3.2) |
| Request size limits | Built (`express.json` limit from `JSON_BODY_LIMIT`) | PASS, 22 Nov 2026 (see 3.1) |
| CORS limited to known origins | Built (allow-list from `CORS_ORIGINS`) | PASS, 22 Nov 2026 (see 3.1) |
| Secure HTTP headers | Built (`helmet`, `x-powered-by` off) | PASS, 22 Nov 2026 (see 3.1) |
| Error responses leak no internals | Built (central error handler, one shape `{ error: { code, message } }`, `X-Request-Id` header) | PASS for 400, 404, 413 (3.1) and for 400, 401, 403, 404, 409, 429 on the J07a routes, 22 Nov 2026 (see 3.2). S2 fixed. |
| Audit log for sensitive actions | NOT STARTED | NOT RUN |
| HTTPS only in production | NOT STARTED | NOT RUN |
| Food chat limited to food topics, with a general-information health note | NOT STARTED | NOT RUN |
| Agent (Vex) access through typed tools with their own permissions | NOT STARTED | NOT RUN |

### 3.1 Evidence: local probe of the API skeleton, 22 Nov 2026
Method: a script called `createApp(loadEnv({...}))` from `apps/api/src`, listened on a random local port and sent real HTTP requests with `fetch` (Node 24.19.0). Test values only: `CORS_ORIGINS=http://localhost:3000`, `JSON_BODY_LIMIT=1kb`, rate limit per 60 s. Not Postman (the Postman connection failed in this session). Two runs: run 1 with `RATE_LIMIT_MAX=5` gave every line below except the 413 and rate-limit lines; run 2 with `RATE_LIMIT_MAX=7` gave those two (in run 1 the limit was reached before the oversized-body request). The rate-limit line's label comes from the script; in run 2 the 429 started at request 8, i.e. after 7 allowed requests, with a different spoofed `X-Forwarded-For` on each. Output lines (CSP shortened with `...`):
```
PASS  GET /health 200  [200]
PASS  no x-powered-by
PASS  helmet header content-security-policy  [default-src 'self';base-uri 'self';...;object-src 'none';script-src 'self';...]
PASS  helmet header strict-transport-security  [max-age=31536000; includeSubDomains]
PASS  helmet header x-content-type-options  [nosniff]
PASS  helmet header x-frame-options  [SAMEORIGIN]
PASS  helmet header referrer-policy  [no-referrer]
PASS  unknown route 404 JSON  [{"error":{"code":"not_found","message":"Route not found"}}]
PASS  allowed origin gets CORS header  [http://localhost:3000]
PASS  other origin gets no CORS header  [none]
PASS  malformed JSON -> 400, no stack  [400 {"error":{"code":"request_error","message":"Bad request"}}]
PASS  oversized body -> 413  [413 {"error":{"code":"request_error","message":"Request body too large"}}]
PASS  rate limit hits 429 by request 6, even with spoofed X-Forwarded-For  [200,429,429,429]
```
With `RATE_LIMIT_MAX=5` the same run returned `429 Too many requests, please try again later.` as plain text (finding S2). Invalid `PORT=0` stopped start-up with `Invalid environment: PORT: Too small: expected number to be >=1`, naming the variable and not printing values.
Unit tests: `npm test -w @nutritale/api` → `Tests 12 passed (12)`.

### 3.2 Evidence: J07a routes, 22 Nov 2026
Method: `npm test -w @nutritale/api` (vitest + supertest against `createApp` with in-memory repositories and a test clock), then newman 6.2.3 against a local `STORAGE=memory` server started fresh for each collection (`AUTH_RATE_LIMIT_MAX=40`, `CATALOGUE_RATE_LIMIT_MAX=60`, `RATE_LIMIT_MAX=300`, throw-away random `JWT_SECRET`). Not the Postman app. No MongoDB.

vitest, `apps/api`:
```
 Test Files  6 passed (6)
      Tests  106 passed | 4 skipped (110)
```
Per file: `security-matrix.test.ts` 48 (44 passed, 4 skipped as not applicable: cases 7, 8, 9 on `GET /me`, case 8 on `POST /auth/logout`), `auth.test.ts` 24, `catalogue.test.ts` 15, `me.test.ts` 8, `app.test.ts` 9, `env.test.ts` 6.
Test names quoted for the rows above (all passed):
- `stores an Argon2id hash, not the password` (hash matches `$argon2id$v=19$m=19456,t=2,p=1$`)
- `case 3: expired access token is 401` (each protected route, clock moved 15 min 1 s)
- `rotates: returns a new pair and revokes the old refresh token`; `reuse of a revoked token revokes the whole session family`; `refuses an expired refresh token (after 30 days)`
- `revokes the session: the access token and the refresh token stop working at once`
- `case 6: another user's record cannot be reached`
- `gives the same status and body for an unknown email and a wrong password (no enumeration)`
- `has a tighter rate limit than the global one, shared with register and refresh`; `has its own rate limit with a JSON 429`; `case 11: rate limit returns 429 in the JSON error shape`
- `case 12: error bodies leak nothing and carry a request id`

newman summaries (every run `exit 0`):
```
01-authentication       requests 50   test-scripts 52   assertions 146   failed 0
02-user-management      requests 300  test-scripts 58   assertions 156   failed 0
04-ingredient-matching  requests 61   test-scripts 32   assertions 82    failed 0
```
Rate-limit lines from the runs: `Pass  rate limit reached: 429 after 24 extra requests` (auth), `... after 271 extra requests` (global, `/me`), `... after 45 extra requests` (catalogue), each followed by `Pass  429 uses the JSON error shape`. Request counts include the requests those rate-limit scripts send.

## 4. Postman test matrix
Ten collections, each protected endpoint run through the twelve cases below. Fill the table with PASS, FAIL or NOT RUN and the evidence (request name and the response line).

Collections: 1 Authentication · 2 User management · 3 Pantry · 4 Ingredient matching · 5 Recipes · 6 Meal planner · 7 Shopping list · 8 Food chat · 9 Subscriptions · 10 Admin.

Cases for every protected endpoint:
1. Valid authentication
2. Missing authentication
3. Expired authentication
4. Invalid authentication
5. Unauthorized user (wrong role)
6. Another user's record
7. Invalid request body
8. Missing required fields
9. Invalid data types
10. Unexpected extra parameters
11. Rate-limit behaviour
12. Correct error response (no stack traces, no database details)

| Collection | Endpoints | Cases run | PASS | FAIL | Evidence |
|---|---|---|---|---|---|
| 1 Authentication | register, login, refresh, logout | 1, 2, 4, 7, 8, 9, 10, 11, 12 (case 3 in vitest only: needs clock control; 5 not applicable, no roles) | 146 assertions | 0 | newman 22 Nov 2026, see 3.2 |
| 2 User management | GET /me, PATCH /me/preferences, DELETE /me | 1, 2, 4, 6, 7, 8, 9, 10, 11, 12 (case 3 in vitest only; 5 not applicable) | 156 assertions | 0 | newman 22 Nov 2026, see 3.2. All 12 cases also in vitest `security-matrix.test.ts` |
| 3 Pantry | — | 0 | — | — | NOT RUN |
| 4 Ingredient matching | GET /catalogue/search, GET /catalogue/:id/substitutes (public) | 7, 9, 10, 11, 12 (auth cases do not apply to public routes) | 82 assertions | 0 | newman 22 Nov 2026, see 3.2 |
| 5 Recipes | — | 0 | — | — | NOT RUN |
| 6 Meal planner | — | 0 | — | — | NOT RUN |
| 7 Shopping list | — | 0 | — | — | NOT RUN |
| 8 Food chat | — | 0 | — | — | NOT RUN |
| 9 Subscriptions | — | 0 | — | — | NOT RUN |
| 10 Admin | — | 0 | — | — | NOT RUN |

## 5. Findings log
| ID | Severity | What | Where | Fixed | Re-tested |
|---|---|---|---|---|---|
| S1 | Medium (before any deployment) | No `trust proxy` setting. Behind a hosting proxy every user would share the proxy's IP, so one busy user could rate-limit everyone. Set `app.set('trust proxy', <exact hop count>)` for the chosen host; never `true`. Spoofed `X-Forwarded-For` is ignored today (probe 3.1). | `apps/api/src/app.ts` | No | No |
| S2 | Low | The 429 response is plain text, not the API's JSON error format. Clients that parse JSON errors will fail on it. Fix: give `rateLimit` a `handler` that sends `{ error: { code: 'rate_limited', ... } }`. | `apps/api/src/app.ts` | Yes, 22 Nov 2026 (`apps/api/src/http/rateLimit.ts`) | Yes, 22 Nov 2026: `app.test.ts` `applies the rate limit` expects `{ error: { code: 'rate_limited', message: 'Too many requests, try again later' } }`; newman `Pass  429 uses the JSON error shape` |
| S4 | Low | `POST /auth/register` answers 409 `email_taken` for an existing email, so a caller can learn that an email has an account. Login does not leak this. Fix needs email verification (register always answers the same, the email says what happened). Slowed by the auth rate limit. | `apps/api/src/routes/auth.ts` | No | No |
| S5 | Medium (before running more than one instance) | Rate-limit counters live in process memory. With several API instances each counts separately, so the real limit is multiplied. Use a shared store (for example MongoDB or Redis) before scaling out. | `apps/api/src/http/rateLimit.ts` | No | No |
| S3 | Low (build tooling, not shipped to users) | `npm audit`, 22 Nov 2026: "3 moderate severity vulnerabilities", minimatch 7.0.0 - 11.0.0 (GHSA-g3hv-75wg-m249) through `@expo/fingerprint` in `expo`. The offered fix ("Will install expo@52.0.49, which is a breaking change") would downgrade Expo. Do not apply; wait for an Expo patch. | `apps/mobile` dependencies | No | No |

## 6. What was NOT checked
(the audit must list this at the end)
- Authentication with a real database: the J07a routes were tested only with in-memory storage (3.2). The MongoDB repositories (`apps/api/src/storage/mongo.ts`) are UNVERIFIED: the `mongodb-memory-server` binary download was refused (fastdl.mongodb.org, HTTP 403) in the build session, 22 Nov 2026.
- Account recovery, roles, audit log: not built.
- Postman app: collections 1, 2 and 4 (`docs/postman/`) were run with newman only, not in the Postman app or workspace.
- MongoDB connection with `nutritale_app`: the API can now connect (`STORAGE=mongo`), but it was not run against Atlas.
- HTTPS and production settings: nothing is deployed.
