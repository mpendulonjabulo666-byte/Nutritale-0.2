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

## shadcn/ui and Kokonut UI: DONE (job J04b, 22 Nov 2026, owner's PC)
The cloud build machine could not reach `ui.shadcn.com` or `kokonutui.com` (proxy HTTP 403), so this was finished on the
owner's PC. Flags checked on ui.shadcn.com/docs/cli and kokonutui.com/docs/installation the same day. From `apps/web`:

```
npx shadcn@latest init -d -y --no-monorepo                        # shadcn 4.23.0, style "base-nova"
# components.json:  "registries": { "@kokonutui": "https://kokonutui.com/r/{name}.json" }
npx shadcn@latest add https://kokonutui.com/r/utils.json -y -o    # -o: replace lib/utils.ts with Kokonut's cn()
npx shadcn@latest add @kokonutui/slide-text-button -y
```

What `init` added: `components.json`, `components/ui/button.tsx`, `lib/utils.ts`, CSS variables in `app/globals.css`, and the
packages `@base-ui/react`, `class-variance-authority`, `cn` (shadcn's own class merger; maintainer shadcn, repo shadcn-ui/cn),
`shadcn` (needed at build time for `@import "shadcn/tailwind.css"`; it pulls many sub-dependencies into the lockfile) and
`tw-animate-css`. Kokonut's utils step added `clsx` and `tailwind-merge`. None of the new packages has an install script.

Changed by hand after `init`, to keep the brand:
- `init -d` swapped DM Sans for Geist and set `--font-sans: var(--font-sans)` (circular). Reverted: `layout.tsx` is unchanged,
  `--font-sans` is DM Sans again, and `--font-heading` is Playfair Display.
- shadcn's grey colour variables (`--primary`, `--background`, ...) now point at the brand tokens (`--nt-forest`, `--nt-cream`, ...).
  Input borders use `sageDeep` (3:1 on white); the focus ring is forest. `--radius` is 16px (brief section 2.5).
- The `.dark` block from shadcn is left as generated. The app has no dark theme and never sets `.dark`.

Two `cn` helpers exist: `@/lib/utils` (clsx + tailwind-merge, used by Kokonut components) and the `cn` package (imported directly
by shadcn's `components/ui/button.tsx`). They do the same job.

The landing page uses Kokonut's `slide-text-button` ("See what it does", links to the feature list). It animates only transform
and opacity, and honours reduced motion. Restyled with brand classes: 52px tall, forest, 17px label.

## Brand tokens
`app/layout.tsx` writes every colour from `@nutritale/shared` as a CSS variable (`--nt-forest`, ...), and `app/globals.css`
maps them into Tailwind v4 `@theme` (`bg-forest`, `text-muted`, `text-sage-deep`, `ease-brand`, ...). Fonts: Playfair Display,
DM Sans and Space Grotesk via `next/font/google`. Reduced motion: `MotionConfig reducedMotion="user"` plus a
`prefers-reduced-motion` CSS rule.

## Checks
- `npm run typecheck -w @nutritale/web` (runs `next typegen` first, which creates the `LayoutProps` type): passes.
- `npm run lint -w @nutritale/web`: passes.
- `next build`: failed on the cloud build machine only, because `fonts.googleapis.com` was blocked there. On the owner's PC,
  22 Nov 2026, `npm run build -w @nutritale/web` passed: "Compiled successfully in 38.2s", routes `/` and `/_not-found` prerendered
  as static. The prerendered page contains the brand-styled button, and the CSS contains `--primary:var(--nt-forest)`.
  If it must build offline, self-host the fonts with `next/font/local`.
