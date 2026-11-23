# AGENT_JOBS_V1.md: build jobs for the owner's agents

Owner: Varrick. Lead agent: Vex. Every job below goes to one niche agent, on its own branch, and the Reviewer marks it DONE.

> **Update 23 Nov 2026:** page work now uses the five-agent page team and the four checks in `docs/AGENT_TEAM.md`, with the page list in `docs/PAGES_V1.md`. Jobs J01 to J08 below stay as the record. New page jobs start at J09.
Read first: `CLAUDE.md`, `docs/DESIGN_BRIEF.md`, `design/prototype/` (one `.dc.html` file per screen: the look, the copy and the behaviour to copy).

**Nothing is installed yet.** The design session had no app code to install into. Every install below runs on the owner's PC, from the terminal, by the Builder agent, after the owner says yes.

Labels: **Checked** = command read from official docs or npm on 22 Nov 2026. **UNVERIFIED** = check the official docs on the day before running it.

---

## Which UI library goes where
The owner chose shadcn/ui, Kokonut UI, `motion`, motion-primitives and lucide. These are **web** libraries. They work in `apps/web` (Next.js). The phone app (`apps/mobile`, Expo) cannot run them, so it uses the closest React Native version and copies the same look and motion.

| Look or effect | Web: `apps/web` | Mobile: `apps/mobile` |
|---|---|---|
| Components | shadcn/ui + Kokonut UI | React Native Reusables (the shadcn/ui port) + NativeWind |
| Animation | `motion` | `react-native-reanimated` 4 + `react-native-worklets` |
| Text effects | motion-primitives `text-effect` | Rebuild with Reanimated `entering` per word |
| Icons | `lucide-react` | `lucide-react-native` + `react-native-svg` |
| Loader | CSS or `motion` from `Loader.dc.html` | `lottie-react-native` file made from `Loader.dc.html` |
| Shared | `packages/shared`: colours, type, motion timings (`motion.ts`) | the same package |

## Install commands

### Web (`apps/web`), from Kokonut UI's docs (Checked)
```
bunx --bun shadcn@latest init
```
Then add to `apps/web/components.json`:
```json
"registries": { "@kokonutui": "https://kokonutui.com/r/{name}.json" }
```
Then:
```
bunx --bun shadcn@latest add https://kokonutui.com/r/utils.json
bunx --bun shadcn@latest add @kokonutui/<component-name>
```
- Kokonut UI needs Tailwind CSS v4.
- In the monorepo, add `-c ./apps/web` to point the CLI at the web app.
- motion-primitives (`npx motion-primitives@latest add text-effect`): UNVERIFIED. Its docs page shows no install command. Check its GitHub README first.

### Mobile (`apps/mobile`, Expo SDK 58)
```
npx expo install react-native-reanimated react-native-worklets
npx expo install lottie-react-native expo-image @shopify/flash-list react-native-svg
npm install lucide-react-native
```
- `npx expo install` picks the version that matches the SDK (Checked: Expo and Reanimated docs).
- Creating the Expo app and the React Native Reusables CLI command: UNVERIFIED. Read docs.expo.dev and reactnativereusables.com on the day.
- Do not install Moti. It is not maintained, and its support for Reanimated 4 is unknown.

## Jobs

| ID | Agent | Goal | Finish line | Waits for |
|---|---|---|---|---|
| J01 | Builder | Create the monorepo: `apps/mobile`, `apps/web`, `apps/api`, `packages/shared`. Strict TypeScript. | `tsc --noEmit` passes in every package. `.env` is ignored by git. | Owner's yes |
| J02 | Builder | `packages/shared`: colour, type and motion tokens from `docs/DESIGN_BRIEF.md` sections 2 and 6.1. | Tokens match the brief exactly. A unit test checks the contrast pairs. | J01 |
| J03 | Builder | Mobile UI kit: React Native Reusables, NativeWind, Reanimated, lucide, Lottie. Build Button, Chip, Card, Input, Stepper, Switch and TabBar. | A kit screen shows every part. Reduced motion turns movement off. | J02 |
| J04 | Builder | Web UI kit: shadcn init, Kokonut registry, `motion`. Use the same tokens as J02. | Web kit page renders. Tailwind v4 confirmed. | J02 |
| J05 | Designer | Draw the missing states: sign-in errors, empty lists, offline. Add them to the prototype. | Every screen has loading, empty, error and offline states. | none |
| J06 | Builder | Mobile screens 1 to 8 from `design/prototype/`, with mock data first. | Each screen matches its prototype file. Every tab works. | J03, J05 |
| J07 | Builder | API: accounts, catalogue search (the ladder in brief section 5.2), pantry, recipes, shopping list. Connects as `nutritale_app`. | Postman collections 1 to 7 pass the 12 cases in `SECURITY_AUDIT.md`. | J01 |
| J08 | Reviewer | Check each job against its finish line. Test on a cheap Android phone in a release build. | Report in the checklist format. Only the Reviewer writes DONE. | each job |

| J09 | Page team | P0 fixes in `docs/PAGES_V1.md` (tab labels, floating gear, wrapping buttons). | All four checks pass on every tab. | Owner's yes |
| J10 | Page team | Page 1, Welcome and sign-in, exactly like `design/reference/welcome-signin-target.jpg` (section A of the page list). Email works; Apple, Google, Facebook show "Coming soon". | All four checks pass. Side by side with the target, the owner says it matches. | J09 |
| J11 | Page team | Page 3, Home (section B). Mock recipes. | All four checks pass. | J10 |
| J12 | Page team | Page 4, My Pantry rebuild (section C), with the helper box (no AI). | All four checks pass. No row collapses at the largest font. | J10 |

| J13 | Page team | Navigation bar restyle: section E of `docs/PAGES_V1.md`. Active dot, grey inactive tabs, Profile tab with photo or initials, Discover switcher (Search, Categories, Collections). No photo upload yet, initials only. | All four checks pass, including largest font with no "…" on any tab label. | J10 phone check passes |

Parallel work: J04, J05 and J07 can run at the same time as J03, because they touch different folders.

## Rules for every agent
1. Follow `CLAUDE.md`: push checklist, no secrets, add files by name, keep the AI disclosure.
2. Animate only transform and opacity. No decorative motion longer than 5 seconds.
3. Every tap target is at least 44 px. Every icon-only button has a label.
4. Never show nutrition without a source. Mark it "Estimated".
5. Replace or confirm the licence of every photo before launch.
