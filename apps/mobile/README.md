# @nutritale/mobile

Expo SDK 58 app (React Native 0.88.1, React 19.3.0), TypeScript strict, Expo Router. Part of the NutriTale monorepo.

## How it was created (22 Nov 2026)
Command checked on docs.expo.dev ("Create a project" and the `create-expo-app` reference) before running:

```
cd apps
npx --yes create-expo-app@latest mobile --template default --yes --no-install --no-agents-md
```

`default` template = Expo Router + TypeScript. `--no-install` because dependencies are installed once from the repo root (`npm install`).

Then, from `apps/mobile`:

```
EXPO_OFFLINE=1 npx expo install lottie-react-native @shopify/flash-list react-native-svg
npm install lucide-react-native -w @nutritale/mobile
```

`react-native-reanimated`, `react-native-worklets` and `expo-image` were already in the template at the SDK 58 pins.
`EXPO_OFFLINE=1` was needed because the build machine's network proxy blocks the online compatibility check
(error: `HTTP Proxy Network Error: Forbidden`). Offline mode uses the SDK's bundled version list, so versions are still the SDK pins.

| Package | Installed |
|---|---|
| expo | ~58.0.26 |
| expo-router | ~58.0.32 |
| react-native-reanimated | 4.7.1 |
| react-native-worklets | 0.13.0 |
| lottie-react-native | ~7.5.0 |
| expo-image | ~58.0.18 |
| @shopify/flash-list | 2.3.2 |
| react-native-svg | 15.16.0 |
| lucide-react-native | ^1.77.0 |

## Brand fonts: DONE (job J03b, 22 Nov 2026)
Installed with `npx expo install @expo-google-fonts/playfair-display @expo-google-fonts/dm-sans @expo-google-fonts/space-grotesk`
(0.4.2, 0.4.2, 0.4.1; packages MIT, fonts SIL OFL 1.1; no install scripts). `expo-font` was already in the template.

- `src/theme/fonts.ts` imports only the weights the brief uses, through per-weight subpaths: Playfair Display 600, DM Sans
  400/500/600/700, Space Grotesk 500/600. The Android bundle carries exactly these 7 files (about 590 KB).
- `src/app/_layout.tsx` loads them with `useFonts` and keeps the splash screen up until they are ready. If loading fails,
  the app opens with system fonts and logs a warning instead of staying on the splash screen.
- Use `fonts.display`, `fonts.body`, `fonts.bodySemibold`, `fonts.numeric` and so on in styles. In React Native each weight is
  its own family, so do not also set `fontWeight`.

## React Native Reusables + NativeWind: UNABLE (re-checked 22 Nov 2026, job J03b)
The rule was to install them only if their official docs show a working setup for Expo SDK 58. They do not:
- NativeWind docs: "Nativewind 4.2.7 is the stable release and uses Tailwind CSS v3", and "Nativewind v4.2.7 adds Expo SDK 57
  support". The v5 line is a release candidate ("not intended for production use"), and its tested target is "Expo 57.0.22,
  React Native 0.86.3". No page mentions SDK 58 or React Native 0.88. (nativewind.dev/docs/getting-started/installation,
  nativewind.dev/v5/getting-started/installation, github.com/nativewind/nativewind/releases)
- Stable NativeWind needs Tailwind 3, but `apps/web` uses Tailwind 4.3 in the same npm workspace; v5 pins Tailwind 4.1.12.
- `reactnativereusables.com/docs/installation` still renders no install steps (JavaScript-only page), and the GitHub README
  gives no command or SDK version.
Screens are built with `StyleSheet` and the shared tokens instead. Check again when NativeWind lists SDK 58.

## What is here
- `src/app/index.tsx`: redirects to `/welcome` (no auth yet, so everyone is signed out).
- `src/app/welcome.tsx`: public signed-out entry. Sign-in and register are not built yet; the buttons open the tabs as a placeholder.
- `src/app/(tabs)/`: Home, Pantry, Discover, Shopping, Profile. Icon and label always visible. Profile has "Sign out", which returns to `/welcome`.
- `src/theme/`: re-exports `@nutritale/shared` tokens and builds the Reanimated easing from `cubic-bezier(.2,.8,.2,1)`.
- Reduced motion: `ReducedMotionConfig mode={ReduceMotion.System}` in the root layout, plus `useReduceMotion()` (live `AccessibilityInfo` listener). With it on, `RiseIn` and the button press scale do not animate.

## Not done yet
- The floating custom tab bar from the prototype (J03). The standard Expo Router tab bar is styled with the tokens for now.
- No run on a phone or emulator. Checked only with `tsc --noEmit` and `npx expo export --platform android` (Metro bundle).

## Commands
```
npm run typecheck -w @nutritale/mobile
npm run start -w @nutritale/mobile
```
