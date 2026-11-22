# @nutritale/web

Next.js 16.4.6 (App Router, TypeScript 5.9 strict, Tailwind CSS 4.3.3). Part of the NutriTale monorepo.

## How it was created (22 Nov 2026)
Flags checked on nextjs.org/docs/app/api-reference/cli/create-next-app before running:

```
cd apps
npx --yes create-next-app@latest web --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --skip-install --disable-git --no-react-compiler --no-agent-feedback --yes
npm install motion lucide-react -w @nutritale/web      # from the repo root
```

Installed: `motion` ^14.14.0, `lucide-react` ^1.77.0. `AGENTS.md` was written by create-next-app and is kept on purpose.

## shadcn/ui and Kokonut UI: UNABLE (network)
Flags checked on ui.shadcn.com/docs/cli. The command run was:

```
npx --yes shadcn@latest init -d -y --no-monorepo
```

It failed: `Request to https://ui.shadcn.com/init?... failed, reason: Request was cancelled.` The build machine's proxy refused
`ui.shadcn.com:443` (HTTP 403) and `kokonutui.com:443` (HTTP 403). So `components.json`, the `@kokonutui` registry entry,
`shadcn add https://kokonutui.com/r/utils.json` and any Kokonut component were **not** done. To finish on a PC with internet, from `apps/web`:

```
npx shadcn@latest init -d -y --no-monorepo
# add to components.json:  "registries": { "@kokonutui": "https://kokonutui.com/r/{name}.json" }
npx shadcn@latest add https://kokonutui.com/r/utils.json
```

## Brand tokens
`app/layout.tsx` writes every colour from `@nutritale/shared` as a CSS variable (`--nt-forest`, ...), and `app/globals.css`
maps them into Tailwind v4 `@theme` (`bg-forest`, `text-muted`, `text-sage-deep`, `ease-brand`, ...). Fonts: Playfair Display,
DM Sans and Space Grotesk via `next/font/google`. Reduced motion: `MotionConfig reducedMotion="user"` plus a
`prefers-reduced-motion` CSS rule.

## Checks
- `npm run typecheck -w @nutritale/web` (runs `next typegen` first, which creates the `LayoutProps` type): passes.
- `npm run lint -w @nutritale/web`: passes.
- `next build`: **fails on this build machine only** because `fonts.googleapis.com` is blocked
  ("Failed to fetch Playfair Display from Google Fonts"). With the three font imports stubbed out in a throwaway copy, the build
  passed and the CSS contained the token utilities (`bg-forest`, `text-sage-deep`), which confirms Tailwind v4. Run `npm run build`
  on a PC with internet to confirm the real build. If it must build offline, self-host the fonts with `next/font/local`.
