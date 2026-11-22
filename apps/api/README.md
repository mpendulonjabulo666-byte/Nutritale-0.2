# @nutritale/api

Express 5 + TypeScript skeleton. **Does not connect to any database yet.**

- `GET /health` returns `{ "status": "ok" }`.
- `src/env.ts`: zod validation of `MONGODB_URI`, `MONGODB_DB`, `CORS_ORIGINS`, rate-limit and body-limit settings, read only from the environment. Errors name the variable, never its value.
- Middleware: helmet, CORS allow-list from `CORS_ORIGINS`, express-rate-limit, JSON body limit, 404 handler, and an error handler that never sends stack traces or library messages.
- Copy `.env.example` to `.env` and fill it in locally. Never commit `.env`.

```
npm run typecheck -w @nutritale/api
npm test -w @nutritale/api      # vitest + supertest, 12 tests
npm run dev -w @nutritale/api   # needs a filled-in .env loaded into the environment
```
