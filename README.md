# Nutritale-0.2
a professional, scalable, production-ready AI-powered food technology platform.

## Planning documents
- `docs/MASTER_PROMPT.md` — the full architecture, development and security prompt, plus the owner's addendum
- `ARCHITECTURE_AUDIT.md` — what currently exists and what needs changing
- `SECURITY_AUDIT.md` — MongoDB, API security and Postman test results
- `DEVELOPMENT_ROADMAP.md` — implementation phases and outstanding work
- `CLAUDE.md` — rules for every agent and person, including the push checklist
- `docs/DESIGN_BRIEF.md` — V1 scope, brand tokens, motion system, the six screens and the accessibility review
- `docs/research/` — sourced research notes behind the design brief
- `design/prototype/` — source of the clickable prototype (one file per screen)
- `docs/AGENT_JOBS_V1.md` — build jobs for the owner's agents, and which UI library goes in the web app and which in the phone app

## Code (monorepo, npm workspaces)
| Folder | What |
|---|---|
| `apps/mobile` | Expo SDK 58 app (Expo Router, five tabs, public `/welcome`) |
| `apps/web` | Next.js 16 landing page (Tailwind v4, `motion`, lucide) |
| `apps/api` | Express + TypeScript API skeleton (`/health`, env validation, security middleware). No database connected. |
| `packages/shared` | `@nutritale/shared`: colour, type, shape and motion tokens, plus a WCAG contrast test |
| `packages/catalogue-search` | `@nutritale/catalogue-search`: locale-aware ingredient search ("no dead end" ladder) with an en-ZA / en-GB / en-US seed |
| `packages/markets` | `@nutritale/markets`: country settings (ZA, GB, US): locale, currency, units and each country's allergen list |

Needs Node 20 or newer. From the repo root:
```
npm install
npm run typecheck
npm test
npm run lint
```

Status (22 Nov 2026): V1 scope decided. Monorepo scaffold added (jobs J01 to J04, see each app's README for what was and was not verified). Audit results are filled in only where a check really ran.
