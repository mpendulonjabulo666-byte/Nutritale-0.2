# Expo React Native animation and UI library stack (low-end Android), and how it maps to the web stack

Research date: 22 Nov 2026. Package versions and dates below were read live from the npm registry (registry.npmjs.org) on 22 Nov 2026 unless another source is given. Expo SDK 58's pinned versions were read from `bundledNativeModules.json` inside the published `expo@58.0.26` tarball.

## 1. Current Expo SDK, React Native version, New Architecture

### Takeaway
Expo SDK 58 is current (`expo@58.0.26`, latest tag, 17 Nov 2026). It ships React Native 0.88.1 and React 19.3.0. The New Architecture is mandatory: it has been always on since SDK 55 and can no longer be turned off.

### Cited Findings
- Expo SDK 58 was released 15 Oct 2026 and "upgrades React Native from 0.86 to 0.88". It removes `InteractionManager`, the `Modal` `animated` prop and some `StatusBar` props. Strict TypeScript API is now the default. Expo Router drops much of its forked React Navigation API. — [Expo SDK 58 changelog](https://expo.dev/changelog/sdk-58.md)
- npm dist-tags: `expo` latest = 58.0.26 (2026-11-17); sdk-57 = 57.0.33; sdk-56 = 56.0.24. The npm time field gives 58.0.0 as published 2026-09-29, two weeks before the changelog post, which was probably a pre-release; the changelog date is the announced date. — [npm registry: expo](https://registry.npmjs.org/expo)
- SDK 58 pinned versions from `bundledNativeModules.json` (expo@58.0.26): react-native 0.88.1, react 19.3.0, react-native-reanimated 4.7.1, react-native-worklets 0.13.0, react-native-gesture-handler ~3.3.0, lottie-react-native ~7.5.0, @shopify/react-native-skia 2.14.0, @shopify/flash-list 2.3.2, expo-image ~58.0.18, react-native-svg 15.16.0, expo-blur ~58.0.6, expo-router ~58.0.32, react-native-screens ~4.30.1. Rive is not in the bundled list. — [expo@58.0.26 tarball](https://registry.npmjs.org/expo/58.0.26)
- SDK 57 was released 30 Jun 2026 with RN 0.86 and React 19.2, Reanimated 4.3→4.5, worklets 0.8→0.10, gesture-handler 2.31→2.32. — [Expo SDK 57 changelog](https://expo.dev/changelog/sdk-57.md)
- "SDK 55 and later run entirely on the New Architecture." "The New Architecture is always enabled and cannot be disabled." "SDK 54 is the last SDK version where the New Architecture can be disabled." RN 0.82 removed the option to disable it. — [Expo docs: New Architecture](https://docs.expo.dev/guides/new-architecture.md)
- react-native npm latest = 0.88.1 (2026-10-27); next = 0.89.0-rc.2 (2026-11-17). — [npm registry: react-native](https://registry.npmjs.org/react-native)
- SDK 58 expo-image adds `transition.skipOnCacheHit` and an `svgVariables` prop. — [Expo SDK 58 changelog](https://expo.dev/changelog/sdk-58.md)

### Inferences
- Start new work on SDK 58. Install every native package with `npx expo install <pkg>` so you get the SDK-pinned version (for example Reanimated 4.7.1, not npm latest 4.8.0).
- Because the New Architecture is mandatory, every animation library you pick must support Fabric. Reanimated 3 and older libraries that only run on the legacy architecture are out.

### Gaps
- SDK 58's minimum Android API level was not checked (UNVERIFIED).
- No source covered whether an SDK 59 beta exists. The npm `canary` tag points to 58.0.0-canary builds only.

## 2. Reanimated 4, worklets, CSS animations API, Moti, Gesture Handler

### Takeaway
Use Reanimated 4.x (the SDK 58 pin is 4.7.1; npm latest is 4.8.0) with the separate `react-native-worklets` package. It runs only on the New Architecture and adds a CSS-style `animation*`/`transition*` API, which is the closest match to `motion`'s declarative style. Moti has had no release since January 2025, so do not adopt it. Gesture Handler is at v3 (SDK 58 pins ~3.3.0).

### Cited Findings
- Latest Reanimated is 4.8.0 (19 Nov 2026), which enables Shared Element Transitions by default and adds CSS gradient animations. 4.7.0 (18 Sep 2026) made the new layout-animation engine the default. 4.6.0 added RN 0.87 support and CSS animation callbacks. 4.5.0 added CSS shadow, background and border props plus pseudo-selectors. 4.4.0 added a platform-backed CSS engine on iOS. 4.3.0 added CSS animations for SVG. No Reanimated 5 is mentioned. — [Software Mansion Reanimated changelog](https://swmansion.com/changelog/react-native-reanimated/)
- react-native-reanimated@4.8.0 peerDependencies: `react-native: "0.87 - 0.89"`, `react-native-worklets: "0.14.x"`. reanimated-3 tag = 3.19.5 (2025-12-22). — [npm registry](https://registry.npmjs.org/react-native-reanimated)
- react-native-worklets latest = 0.14.0 (2026-11-19). SDK 58 pins 0.13.0. — [npm registry](https://registry.npmjs.org/react-native-worklets)
- "Reanimated 4.x works only with" the New Architecture (Fabric). Reanimated 3 is "no longer actively maintained". `react-native-worklets` is a required separate dependency. Expo install command: `npx expo install react-native-reanimated react-native-worklets`. Expo SDK 50+ includes the Babel plugin (`react-native-worklets/plugin`) by default. — [Reanimated docs: Getting started](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)
- Reanimated 4 stable release introduced the CSS-based animation API. — [SWM blog: Reanimated 4 stable](https://swmansion.com/blog/reanimated-4-stable-release-the-future-of-react-native-animations-ba68210c3713); [heise](https://heise.de/-10502942)
- Moti: latest 0.30.0, published 2025-01-29, with no release since. Its peer is `react-native-reanimated: "*"` and it depends on `framer-motion ^6.5.1`. — [npm registry: moti](https://registry.npmjs.org/moti)
- react-native-gesture-handler: latest 3.5.0 (2026-11-05); `legacy` tag 2.33.1 (2026-10-16). SDK 58 pins ~3.3.0. — [npm registry](https://registry.npmjs.org/react-native-gesture-handler)

### Inferences
- Moti has had no release in nearly two years while Reanimated 4 went through eight minor releases. Its compatibility with Reanimated 4.7 and 4.8 is not proven. Reanimated's own CSS transitions API now covers Moti's main use case (declarative state-to-style animation), so skip Moti.
- Gesture Handler v3 is a major version. Code samples written for v2 may not apply as-is, so check the v3 docs before copying examples.

### Gaps
- Moti compatibility with Reanimated 4.x was not tested or confirmed (UNVERIFIED either way).
- The exact list of Gesture Handler v3 breaking changes was not fetched.
- Whether the Android CSS animation engine is platform-backed like iOS's was not confirmed.

## 3. Does `motion` (motion.dev) support React Native?

### Takeaway
No. `motion` is web-only: React DOM, Vue and vanilla JS. There is no official React Native port. The closest equivalent is Reanimated 4: its CSS transitions and keyframes for declarative use, and its layout animations (`entering`/`exiting`) in place of `AnimatePresence`. Third-party options exist (Legend Motion) but are not official.

### Cited Findings
- Motion's documentation index lists React (`motion/react`), Vue (`motion-v`), vanilla JS and Svelte. It covers HTML, SVG and WebGL targets, with no mention of React Native or Expo. — [motion.dev llms.txt](https://motion.dev/llms.txt)
- npm `motion` latest = 14.14.0 (2026-11-13). Peers are `react-dom`, with no react-native peer. — [npm registry: motion](https://registry.npmjs.org/motion)
- `@legendapp/motion` latest 2.5.3 (2025-10-17). Peers are `react-native: "*"` and `nativewind >=4.0.0`. It is a third-party, Framer-Motion-like API for RN. — [npm registry](https://registry.npmjs.org/@legendapp/motion); [Legend Motion docs](https://legendapp.com/dev/motion)
- `react-native-ease` 0.10.0 (2026-11-13), from App & Flow (Janic Duplessis), describes itself as "Lightweight declarative animations powered by platform APIs". Peers are `uniwind >=1` / `nativewind >=4`. — [npm registry](https://registry.npmjs.org/react-native-ease/latest)

### Inferences
- "Use the same animations as the web" can only mean the same motion design tokens: durations, easing curves, spring stiffness and damping, and stagger. Put these in one shared TS constants file. Web passes them to `motion`, and mobile passes them to Reanimated `withSpring`/`withTiming` or to CSS transition props. The code cannot be shared.
- Legend Motion's last release was over a year ago. react-native-ease is new (0.x). Neither is needed when Reanimated is already in the SDK.

### Gaps
- react-native-ease's README could not be fetched (npmjs.com returned an error), so its internals and maturity are UNVERIFIED.

## 4. React Native equivalents of shadcn/ui, Kokonut UI, motion-primitives

### Takeaway
React Native Reusables (MIT) is the shadcn/ui port. It uses the same copy-in component model, styled with NativeWind or Uniwind. NativeWind stable is 4.2.7, with v5 at release candidate (5.0.0-rc.1). Uniwind 1.14.0 targets Tailwind v4. Kokonut UI and motion-primitives have no official RN versions.

### Cited Findings
- React Native Reusables: "Bringing shadcn/ui to React Native", MIT licence, styled with NativeWind. — [RNR README](https://cdn.jsdelivr.net/gh/founded-labs/react-native-reusables@main/README.md); site says "components with Nativewind or Uniwind" — [reactnativereusables.com](https://www.reactnativereusables.com)
- The repo moved from `mrzachnugent/react-native-reusables` to `founded-labs/react-native-reusables`. — [GitHub](https://www.github.com/mrzachnugent/react-native-reusables); [jsDelivr README path](https://cdn.jsdelivr.net/gh/founded-labs/react-native-reusables@main/README.md)
- `@rn-primitives/slot` (the primitives layer RNR is built on) latest 1.5.2 (2026-07-02). — [npm registry](https://registry.npmjs.org/@rn-primitives/slot)
- nativewind: latest 4.2.7 (2026-09-14); rc/preview 5.0.0-rc.1 (2026-11-02). Peer `tailwindcss >3.3.0`. — [npm registry](https://registry.npmjs.org/nativewind)
- uniwind: latest 1.14.0 (2026-11-17), MIT. Peers `tailwindcss >=4`, `react-native >=0.81.0`, `@expo/metro-config`. — [npm registry](https://registry.npmjs.org/uniwind)
- tamagui latest 3.3.3 (2026-11-13), MIT. — [npm registry](https://registry.npmjs.org/tamagui). @gluestack-ui/core latest 5.0.15 (2026-06-25), MIT. — [npm registry](https://registry.npmjs.org/@gluestack-ui/core)
- motion-primitives on npm: 0.1.0 (2025-03-04), no peers. It is a web library (copy-paste components built on `motion`). — [npm registry](https://registry.npmjs.org/motion-primitives)
- An npm search for Kokonut + react-native returned no Kokonut package, and `kokonutui` is not an npm package. Kokonut UI is distributed as a shadcn registry for the web. — [npm search API](https://registry.npmjs.org/-/v1/search?text=kokonut%20react-native&size=5); [bestofjs: kokonutui](https://bestofjs.org/projects/kokonutui)

### Inferences
- Recommended mapping:
  - shadcn/ui → React Native Reusables.
  - Tailwind classes → NativeWind or Uniwind. Pick one, and match whichever RNR's CLI currently defaults to.
  - clsx + tailwind-merge → the same two packages. They are plain JS and work in RN, as RNR's `cn()` helper does. This was not re-verified in RNR source this session.
  - Kokonut and motion-primitives effects (for example the text-effect) → rebuild the few you need by hand with Reanimated, such as staggered per-word opacity and translateY.
- Tamagui and Gluestack are alternatives but do not share shadcn's code model, so they break parity with the web stack.

### Gaps
- RNR's current CLI command, its default styling engine (NativeWind 4 vs Uniwind) and its Expo SDK 58 support were not confirmed. The site fetch returned metadata only (UNVERIFIED).
- NativeWind v5's final release date is unknown. As of 22 Nov 2026 it is an RC only.

## 5. lucide-react-native

### Takeaway
It is actively maintained and versioned in lockstep with lucide-react (both at 1.77.0, 20 Nov 2026). It needs `react-native-svg`, which SDK 58 pins at 15.16.0.

### Cited Findings
- lucide-react-native latest 1.77.0 (2026-11-20), ISC licence. Peers `react-native-svg ^12 || ^13 || ^14 || ^15`, `react ^16.5.1 … ^19`. — [npm registry](https://registry.npmjs.org/lucide-react-native)
- lucide-react latest 1.77.0 (2026-11-20). — [npm registry](https://registry.npmjs.org/lucide-react)

### Inferences
- Use the same icon names on web and mobile. Import named icons individually so only the icons used are bundled.

### Gaps
- None material.

## 6. Lottie vs Rive for custom loading animations

### Takeaway
Lottie (`lottie-react-native` ~7.5.0) is in the Expo SDK 58 native-module list, Apache-2.0, and installs with `npx expo install`. Rive's new runtime (`@rive-app/react-native` 0.5.18, MIT) needs `react-native-nitro-modules` and is not SDK-pinned. For a simple loading animation, Lottie is the lower-risk choice. A head-to-head performance comparison on low-end Android was not found.

### Cited Findings
- lottie-react-native latest 7.5.1 (2026-11-13), Apache-2.0. Peers `react >=19.2`, `react-native >=0.84`, `@lottiefiles/dotlottie-react ^0.13.5` (the web/dotLottie side). next = 8.0.0-rc.0 (2026-08-22). — [npm registry](https://registry.npmjs.org/lottie-react-native)
- Expo docs install command: `npx expo install lottie-react-native`. The docs page lists bundled version 7.2.2, which conflicts with SDK 58's `bundledNativeModules.json` (~7.5.0). The docs page is probably showing an older SDK. — [Expo docs: Lottie](https://docs.expo.dev/versions/latest/sdk/lottie/); [expo@58.0.26 tarball](https://registry.npmjs.org/expo/58.0.26)
- Rive: "`@rive-app/react-native` … replaces the legacy `rive-react-native` package". The legacy package "is still supported, but we recommend migrating". Requirements: Expo SDK 53+, RN 0.78+, Android SDK 24+, `react-native-nitro-modules` (≥0.35.10, or ≥0.36.2 on RN 0.87+). — [Rive docs: React Native](https://rive.app/docs/runtimes/react-native/react-native)
- @rive-app/react-native latest 0.5.18 (2026-11-20), MIT. Peers `react-native-nitro-modules >=0.35.10 <0.37`, `@rive-app/canvas ^2.39.0`. Legacy rive-react-native latest 9.8.6 (2026-10-15). — [npm registry](https://registry.npmjs.org/@rive-app/react-native)

### Inferences
- Both need native code. If Rive is not in Expo Go's bundled set, it almost certainly needs a development build (EAS or local). That is UNVERIFIED for Rive specifically.
- Rive's new RN runtime is still 0.x. Lottie is mature and SDK-pinned. Keep each loader to one short Lottie file and test it on a real low-end phone in a release build.

### Gaps
- No primary-source benchmark of Lottie vs Rive CPU, memory or FPS on low-end Android was found (UNVERIFIED). Rive's renderer default on Android and its runtime and editor pricing were not confirmed.
- Whether either works in Expo Go on SDK 58 was not confirmed.

## 7. @shopify/react-native-skia for animated food elements

### Takeaway
Skia 2.14.0 is pinned by SDK 58 and requires Reanimated 4 and worklets. Reanimated's own guide points to Skia for animations too complex for many animated Views. No source measured Skia's cost on low-end Android.

### Cited Findings
- @shopify/react-native-skia latest 2.14.0 (2026-10-01), MIT. Peers `react >=19.0`, `react-native >=0.78`, `react-native-worklets >=0.7.0`, `react-native-reanimated >=4.0.0`. — [npm registry](https://registry.npmjs.org/@shopify/react-native-skia)
- Reanimated performance guide: "animate no more than 100 components for low-end Android devices and no more than 500 components for iOS". For more complex cases it suggests Reanimated with react-native-skia. — [Reanimated docs: Performance](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/)

### Inferences
- Skia adds native binary size and a GPU canvas. Use it only for a few hero illustrations, not for list rows. Simple food stickers animated with transform and opacity on `expo-image` or SVG are cheaper.

### Gaps
- Skia's APK size and frame times on low-end Android were not sourced (UNVERIFIED).

## 8. Reduced-motion support

### Takeaway
Reanimated animations default to `ReduceMotion.System`, which honours the OS setting. `useReducedMotion()` gives a boolean for custom logic. React Native's `AccessibilityInfo.isReduceMotionEnabled()` covers non-Reanimated code.

### Cited Findings
- Reanimated: enum `ReduceMotion.System | Always | Never`. "By default all animations are configured with `ReduceMotion.System`." `reduceMotion` is an option on `withTiming`/`withSpring`/`withDelay`. Layout animations use `.reduceMotion(...)`, and when reduced motion is on, "entering, keyframe, and layout animations instantaneously reach their endpoints." `useReducedMotion` "returns a boolean indicating whether the reduced motion setting was enabled when the app started." — [Reanimated docs: Accessibility](https://docs.swmansion.com/react-native-reanimated/docs/guides/accessibility/)
- `ReducedMotionConfig` appears in the Reanimated docs sidebar under "Device", but its page was not read. — [Reanimated docs: Accessibility](https://docs.swmansion.com/react-native-reanimated/docs/guides/accessibility/)

### Inferences
- `useReducedMotion` reads the setting only at app start. To react live to changes, use `AccessibilityInfo` with its `reduceMotionChanged` event (standard RN API; page not fetched this session).
- On web, `motion` has its own `useReducedMotion`/`MotionConfig reducedMotion="user"`. Gate both platforms off the same design rule.

### Gaps
- Whether Reanimated's CSS animation and transition API respects ReduceMotion automatically was not documented on the page read (UNVERIFIED).
- `AccessibilityInfo` docs were not fetched this session (UNVERIFIED citation).

## 9. Performance rules for low-end Android

### Takeaway
Animate transform and opacity only, keep animations on the UI thread (Reanimated worklets), stay under about 100 animated components at once, measure in release builds, use FlashList v2 for long lists and expo-image for photos.

### Cited Findings
- Prefer non-layout styles: use `translateX`/`translateY` "instead of `top`/`left`". Animating non-layout styles "is generally more performant". — [Reanimated docs: Performance](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/)
- Android feature flags: `ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS` (4.0.0+) is a fast path for non-layout style updates but "affect[s] the touch detection system for components with animated transforms". `USE_COMMIT_HOOK_ONLY_FOR_REACT_COMMITS` (RN 0.80+, Reanimated 4.2.0+) helps scrolling FPS. — [Reanimated docs: Performance](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/)
- Slowdowns are "noticeable only in the development build". Use release builds, or Android's `debugOptimized` variant (RN 0.82+), for judging. Memoize gesture objects with `useMemo`, especially in `FlatList` items. — [Reanimated docs: Performance](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/)
- @shopify/flash-list latest 2.3.3 (2026-10-01). SDK 58 pins 2.3.2. — [npm registry](https://registry.npmjs.org/@shopify/flash-list); [expo@58.0.26 tarball](https://registry.npmjs.org/expo/58.0.26)
- expo-image SDK 58 pin ~58.0.18. SDK 58 adds `transition.skipOnCacheHit`, and SDK 57 added `writeToCacheAsync`/`readFromCacheAsync`. — [Expo SDK 58 changelog](https://expo.dev/changelog/sdk-58.md); [Expo SDK 57 changelog](https://expo.dev/changelog/sdk-57.md)

### Inferences
- Avoid `expo-blur` and animated large shadows on Android lists. Use solid or semi-transparent fills and borders, and keep elevation static. Not backed by a primary benchmark found this session.
- FlashList v2 over FlatList for any list over about 20 rows. expo-image with `cachePolicy` and fixed sizes for food photos.
- Turn the Android flags on only after testing touch handling, because of the documented touch-detection side effect.

### Gaps
- No primary source on blur and shadow cost on Android was found this session (UNVERIFIED).
- FlashList v2's New-Architecture-only status and its benchmarks against FlatList were not fetched.
