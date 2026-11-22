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

## React Native Reusables + NativeWind: UNVERIFIED, not installed
The task said to add them only if their current official docs give a working setup for Expo SDK 58.
On 22 Nov 2026 `reactnativereusables.com/docs/installation` returned only page metadata (no steps), and the repo README
(`founded-labs/react-native-reusables`) points to the docs with no command or SDK version. No SDK 58 setup could be
verified, so both were skipped. Check the docs again before job J03.

## What is here
- `src/app/index.tsx`: redirects to `/welcome` (no auth yet, so everyone is signed out).
- `src/app/welcome.tsx`: public signed-out entry. Sign-in and register are not built yet; the buttons open the tabs as a placeholder.
- `src/app/(tabs)/`: Home, Pantry, Discover, Shopping, Profile. Icon and label always visible. Profile has "Sign out", which returns to `/welcome`.
- `src/theme/`: re-exports `@nutritale/shared` tokens and builds the Reanimated easing from `cubic-bezier(.2,.8,.2,1)`.
- Reduced motion: `ReducedMotionConfig mode={ReduceMotion.System}` in the root layout, plus `useReduceMotion()` (live `AccessibilityInfo` listener). With it on, `RiseIn` and the button press scale do not animate.

## Not done yet
- Brand fonts (Playfair Display, DM Sans, Space Grotesk) are not loaded. A system serif stands in for headings.
- The floating custom tab bar from the prototype (J03). The standard Expo Router tab bar is styled with the tokens for now.
- No run on a phone or emulator. Checked only with `tsc --noEmit` and `npx expo export --platform android` (Metro bundle).

## Commands
```
npm run typecheck -w @nutritale/mobile
npm run start -w @nutritale/mobile
```
