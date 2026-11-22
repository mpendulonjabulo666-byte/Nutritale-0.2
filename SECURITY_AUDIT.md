# SECURITY_AUDIT.md

MongoDB, API security and Postman test results.

**Status: NOT STARTED.** Nothing has been tested. Every result below is NOT RUN. Do not change a result unless you ran the check in the current session and can quote the output.

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
| Atlas database users | Checked 22 Nov 2026: one user with the owner-level `atlasAdmin` role. **Finding:** the app must not use it. Create a separate user with readWrite on the app database only. |
| Atlas network access list | Checked 22 Nov 2026: one single-IP entry (from Atlas auto setup), nothing open to everyone. Home and mobile IPs change, so the owner's own access may break. A server needs its own entry. |
| Postman | Checked 22 Nov 2026: still not reachable from the planning session (no Postman tool, no Postman CLI installed there). Inspect it from the owner's terminal. |
| Atlas backups and encryption settings | UNKNOWN. Check the free-tier terms. |
| Postman workspace | UNKNOWN. Not inspected yet. |
| Repository visibility | Public. Secrets must never be committed. |
| Legacy NutriTale carry-over items to verify | Rotate any key that was ever exposed in chat or code; delete leftover test pages such as `t.php`; take a database export before any migration; keep PayFast merchant ID, key and passphrase only in `config.local.php`. |

## 2. MongoDB security checklist (all NOT STARTED)
- [ ] App connects with its own least-privilege user (readWrite on one database only)
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
| Argon2id password hashing | NOT STARTED | NOT RUN |
| Short-lived access tokens | NOT STARTED | NOT RUN |
| Refresh-token rotation and revocation | NOT STARTED | NOT RUN |
| Logout invalidates tokens | NOT STARTED | NOT RUN |
| Account recovery with expiring, single-use link | NOT STARTED | NOT RUN |
| Reset and payment links built from a fixed configured base URL, never the request's Host header | NOT STARTED | NOT RUN |
| Role-based access control | NOT STARTED | NOT RUN |
| Ownership checks (no insecure direct object references) | NOT STARTED | NOT RUN |
| Premium entitlement checked on the server | NOT STARTED | NOT RUN |
| Input validation on every endpoint (shared schemas) | NOT STARTED | NOT RUN |
| Rate limiting (login, reset, chat, import) | NOT STARTED | NOT RUN |
| Request size limits | NOT STARTED | NOT RUN |
| CORS limited to known origins | NOT STARTED | NOT RUN |
| Secure HTTP headers | NOT STARTED | NOT RUN |
| Error responses leak no internals | NOT STARTED | NOT RUN |
| Audit log for sensitive actions | NOT STARTED | NOT RUN |
| HTTPS only in production | NOT STARTED | NOT RUN |
| Food chat limited to food topics, with a general-information health note | NOT STARTED | NOT RUN |
| Agent (Vex) access through typed tools with their own permissions | NOT STARTED | NOT RUN |

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
| 1 Authentication | — | 0 | — | — | NOT RUN |
| 2 User management | — | 0 | — | — | NOT RUN |
| 3 Pantry | — | 0 | — | — | NOT RUN |
| 4 Ingredient matching | — | 0 | — | — | NOT RUN |
| 5 Recipes | — | 0 | — | — | NOT RUN |
| 6 Meal planner | — | 0 | — | — | NOT RUN |
| 7 Shopping list | — | 0 | — | — | NOT RUN |
| 8 Food chat | — | 0 | — | — | NOT RUN |
| 9 Subscriptions | — | 0 | — | — | NOT RUN |
| 10 Admin | — | 0 | — | — | NOT RUN |

## 5. Findings log
| ID | Severity | What | Where | Fixed | Re-tested |
|---|---|---|---|---|---|
| (none yet) | | | | | |

## 6. What was NOT checked
(the audit must list this at the end)
