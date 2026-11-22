# Mobile accessibility and food-information rules for a South African recipe/pantry app (Expo React Native, Android + iOS)

Research date: 22 November 2026. 15 tool calls. Every claim carries a source. Items marked UNVERIFIED were not confirmed from a primary source in this session.

## Which WCAG 2.1 / 2.2 success criteria matter most for a mobile recipe/pantry app?

### Takeaway
WCAG 2.2 (W3C Recommendation, 12 Dec 2024) is the current baseline. The core AA set for this app is: 4.5:1 text contrast, 3:1 non-text contrast, 200% text resize, reflow, visible focus, 24x24 minimum targets (44x44 is AAA), status messages, and accessible authentication. Animation from Interactions (2.3.3) is AAA, not AA. Redundant Entry (3.3.7) is Level A.

### Cited Findings
- WCAG 2.2 is a W3C Recommendation dated 12 December 2024. 4.1.1 Parsing is marked "Obsolete and removed". — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 1.4.1 Use of Color (A): "Color is not used as the only visual means of conveying information, indicating an action, ..." — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 1.4.3 Contrast (Minimum) (AA): text and images of text need "a contrast ratio of at least 4.5:1", with exceptions (large text is 3:1). — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 1.4.4 Resize Text (AA): "text can be resized without assistive technology up to 200 percent without loss of content or functionality." — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 1.4.10 Reflow (AA): content must be presentable "without requiring scrolling in two dimensions". — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 1.4.11 Non-text Contrast (AA): UI components and graphical objects need "a contrast ratio of at least 3:1 against adjacent color(s)". — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 2.2.2 Pause, Stop, Hide (Level A): applies to moving, blinking or scrolling information that "(1) starts automatically, (2) lasts more than five seconds" (and is presented in parallel with other content). The user must be able to pause, stop or hide it. — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 2.3.3 Animation from Interactions (Level AAA): "Motion animation triggered by interaction can be disabled, unless the animation is essential". — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 2.4.7 Focus Visible (AA): the keyboard focus indicator must be visible. 2.4.11 Focus Not Obscured (Minimum) (AA, new in 2.2): a focused component "is not entirely hidden due to author-created content" (relevant to sticky headers and bottom sheets). — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 2.5.5 Target Size (Enhanced) (AAA): "at least 44 by 44 CSS pixels". 2.5.8 Target Size (Minimum) (AA, new in 2.2): "at least 24 by 24 CSS pixels". — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 2.5.8 exceptions: spacing (a 24px circle centred on each undersized target must not overlap another target or circle), an equivalent control elsewhere, inline targets, user-agent-controlled targets, and essential presentation. The Understanding page advises aiming for 2.5.5 for important controls and says the criterion covers all pointer inputs, including touch. — [W3C Understanding 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- 3.3.7 Redundant Entry (Level A): information the user already entered must be auto-populated or available to select. Exceptions are when re-entry is essential, when it is needed for security, or when the earlier information is no longer valid. — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 3.3.8 Accessible Authentication (Minimum) (AA): "A cognitive function test (such as remembering a password or solving a puzzle) is not required for any step" unless an Alternative, a Mechanism to assist (for example, paste or a password manager), Object Recognition, or Personal Content is offered. — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 4.1.3 Status Messages (AA): "status messages can be programmatically determined through role or properties" so assistive technology can present them without moving focus. — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)

### Inferences
- Use 44x44 pt / 48x48 dp as the design target. It meets the platform guidance (next section) and the AAA 2.5.5 value. The 24px AA floor applies only to secondary or tightly packed controls.
- 3.3.8 in practice: allow paste in password fields, do not block password managers, and offer magic-link or OAuth sign-in. Do not use text CAPTCHAs.
- 3.3.7 in practice: carry pantry items, allergies and dietary profile forward. Do not make the user re-enter them in each flow (for example, between the shopping list and a recipe filter).
- 4.1.3 in practice: "Added to pantry", "Saved", timer finished and search-result counts must be announced. In RN, use `accessibilityLiveRegion` (Android) or `AccessibilityInfo.announceForAccessibility` (see below).
- 2.2.2 applies to auto-advancing carousels, looping hero animations or video, and Lottie loops that last more than 5 s. These need a pause control or must stop on their own.
- WCAG is written for web content. Applying it to native apps is the industry norm, but the Understanding page fetched does not mention native apps.

### Gaps
- WCAG2ICT (W3C guidance for applying WCAG to non-web software and native apps) was not fetched. Read it to confirm how "CSS pixel" maps to dp/pt.
- The exact large-text thresholds for 1.4.3 (18pt / 14pt bold) were not quoted from the W3C text. Android and Apple state their own equivalents below.

## Platform guidance: hit targets, font scaling, RN accessibility props, screen readers

### Takeaway
Apple's default control size is 44x44 pt (minimum 28x28 pt). Android recommends at least 48x48 dp. RN scales fonts by default (`allowFontScaling` = true), and `maxFontSizeMultiplier` can cap the scale. Use `accessibilityRole`, `accessibilityLabel`, `accessibilityState`, `accessibilityHint` and live regions for TalkBack and VoiceOver.

### Cited Findings
- Apple HIG: iOS/iPadOS "Default control size 44x44 pt, Minimum control size 28x28 pt". Recommended padding is about 12 pt around bezelled elements and about 24 pt around elements without a bezel. — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility.md)
- Apple HIG: "Ideally, give people the option to enlarge text by at least 200 percent", through Dynamic Type or custom UI. The iOS default text size is 17 pt and the minimum is 11 pt. — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility.md)
- Apple HIG contrast (the values Accessibility Inspector uses, from WCAG AA): text up to 17 pt needs 4.5:1; 18 pt or bold text needs 3:1. Check contrast in both light and dark mode, and provide a higher-contrast scheme when Increase Contrast is on. — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility.md)
- Apple HIG: "Convey information with more than color alone", "Offer alternatives to gestures" (for example, a delete button as well as swipe-to-delete), and "Minimize use of time-boxed interface elements". — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility.md)
- Android: "each interactive UI element [should] have a focusable area, or touch target size, of at least 48dpx48dp. Larger is even better." Custom elements need explicit sizing. — [Android Developers: Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps)
- Android contrast: text smaller than 18sp, or bold text smaller than 14sp, needs at least 4.5:1. All other text needs at least 3:1. — [Android Developers](https://developer.android.com/guide/topics/ui/accessibility/apps)
- Android labels: describe purpose, not visuals. Do not add the role to the label ("Submit", not "Submit button"). Give each list item a unique description. Hide decorative elements from accessibility services. — [Android Developers](https://developer.android.com/guide/topics/ui/accessibility/apps)
- RN `Text`: `allowFontScaling` (default `true`) "Specifies whether fonts should scale to respect Text Size accessibility settings". `maxFontSizeMultiplier` (default `undefined`) sets the largest scale; `0` means no maximum. — [React Native Text](https://reactnative.dev/docs/text)
- RN `accessible`: touchables are accessible by default. It maps to `focusable` on Android and `isAccessibilityElement` on iOS. — [RN Accessibility](https://reactnative.dev/docs/accessibility)
- RN `accessibilityLabel` defaults to the concatenated Text children. `accessibilityHint` is read after the label. On iOS, VoiceOver reads hints only if the user has hints enabled. On Android, TalkBack hints "cannot be turned off". — [RN Accessibility](https://reactnative.dev/docs/accessibility)
- RN `accessibilityRole` values include button, checkbox, switch, togglebutton, header, link, tab/tablist, search, adjustable, alert, image, timer, progressbar and others. Use `link` only for external URLs and `button` for in-app navigation. The newer `role` prop takes precedence over `accessibilityRole`. — [RN Accessibility](https://reactnative.dev/docs/accessibility)
- RN `accessibilityState` fields: disabled, selected, checked (boolean or 'mixed'), busy, expanded. — [RN Accessibility](https://reactnative.dev/docs/accessibility)
- RN `accessibilityLiveRegion` (Android only): none, polite or assertive. It announces dynamic changes through TalkBack. — [RN Accessibility](https://reactnative.dev/docs/accessibility)
- RN `AccessibilityInfo`: `announceForAccessibility(string)`, `isScreenReaderEnabled()`, `isBoldTextEnabled()` (iOS only). — [RN AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)

### Inferences
- Do not set `allowFontScaling={false}` on body text, because that would fail 1.4.4. If layouts break at very large scales, use `maxFontSizeMultiplier` only on space-constrained UI (tab labels, chips), set to about 1.5–2.0, and test at 200%. The 1.5–2.0 range is my recommendation, not a sourced figure.
- Recipe cards: make the whole card one accessible element with a combined label (for example "Chakalaka, 30 minutes, contains no common allergens"). Do not let the screen reader stop on every child.
- Ingredient checkboxes: use role `checkbox` with `accessibilityState.checked`. The favourite heart: role `togglebutton` with `checked`. Step headings: role `header`.
- Use `announceForAccessibility` on iOS for status messages (4.1.3), because `accessibilityLiveRegion` is Android only.

### Gaps
- The Material 3 touch-target page (m3.material.io) was not fetched. The 48dp figure comes from developer.android.com instead.
- Specific TalkBack and VoiceOver behaviours beyond what the RN docs state (focus order, grouping, custom actions such as `accessibilityActions`) were not researched.

## Reduced motion: iOS Reduce Motion and Android "Remove animations"

### Takeaway
Read `AccessibilityInfo.isReduceMotionEnabled()` and subscribe to `reduceMotionChanged`. When the setting is on, replace movement (slides, zooms, parallax, bounce) with fades or instant changes, and stop automatic or looping animation.

### Cited Findings
- RN `isReduceMotionEnabled()` returns a `Promise<boolean>`. The `reduceMotionChanged` event is "true when a reduce motion is enabled (or when 'Transition Animation Scale' in 'Developer options' is 'Animation off')". `prefersCrossFadeTransitions()` is iOS only. — [RN AccessibilityInfo](https://reactnative.dev/docs/accessibilityinfo)
- Apple HIG: when Reduce Motion is on, "ensure your app or game responds by reducing automatic and repetitive animations, including zooming, scaling, and peripheral motion". Also tighten springs to reduce bounce, track animations directly with gestures, avoid animating z-axis depth, replace x/y/z transitions with fades, and avoid animating into or out of blurs. — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility.md)
- Apple HIG: let people control audio and video playback (no autoplay without controls), and respect Dim Flashing Lights. — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility.md)
- WCAG 2.3.3 (AAA): interaction-triggered motion can be disabled unless it is essential. 2.2.2 (A): auto-starting motion lasting more than 5 s must be pausable. — [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/)

### Inferences
- Have one `useReducedMotion` hook (from the RN API, or Reanimated's equivalent if the stack uses it) gate every animation preset. That meets the Apple guidance and 2.3.3 at low cost.
- Lottie or illustration loops should render a static frame when reduce motion is on.

### Gaps
- UNVERIFIED: the exact Android setting name and behaviour. Android 9+ has an accessibility toggle called "Remove animations", but no Android primary source was fetched. The RN doc mentions only the Developer options "Transition Animation Scale", so whether the RN API reflects the user-facing "Remove animations" toggle on every Android version needs a device test.
- Reanimated's `useReducedMotion` / `ReduceMotion` API was not checked in this session.

## South African context: accessibility law or standard, devices, data cost

### Takeaway
No binding South African digital-accessibility law or SANS mobile standard was confirmed. Government guidance (GCIS) only recommends WCAG 2.2 Level A for government sites. Data is expensive (an entry-level 1GB bundle costs R35–R85) and handsets as cheap as R399 exist, so image weight and offline use are real design constraints.

### Cited Findings
- GCIS: "It is recommended that government departments conform to at least Level A" of "WCAG 2.2 (and by extension WCAG 2.1)". This is a recommendation and cites no accessibility statute. — [GCIS Website accessibility](https://www.gcis.gov.za/website-accessibility)
- ICASA (State of the ICT Sector, 31 March 2026): 83,041,957 smartphone subscriptions in 2025 (+0.4% year on year), against 82,742,112 in 2024. — [ICASA State of ICT 2026](https://www.icasa.org.za/uploads/files/The-State-of-the-ICT-Sector-Report-of-South-Africa-31-March-2026.pdf)
- ICASA: the cheapest smartphone fell from R499 (2024) to R399 (2025). — [ICASA State of ICT 2026](https://www.icasa.org.za/uploads/files/The-State-of-the-ICT-Sector-Report-of-South-Africa-31-March-2026.pdf)
- ICASA: 4G/LTE population coverage was 99.50% and 5G 58.02% in 2025. Northern Cape rural 5G was 13%. — [ICASA State of ICT 2026](https://www.icasa.org.za/uploads/files/The-State-of-the-ICT-Sector-Report-of-South-Africa-31-March-2026.pdf)
- ICASA: a 2GB mobile basket cost R152/month in 2024 (1.63% of monthly GNI per capita, below the 2% affordability benchmark). South Africa had the highest entry-level mobile cost among BRICS countries. Mobile internet access was 75.6% nationally; fixed internet at home 17.4% (2024, citing Stats SA GHS). — [ICASA State of ICT 2026](https://www.icasa.org.za/uploads/files/The-State-of-the-ICT-Sector-Report-of-South-Africa-31-March-2026.pdf)
- ICASA tariff report (July–Dec 2025): Cell C standard prepaid 1GB costs R85. MVNOs Asuer Connect and Sakeng Mobile offer 30-day 1GB at R35 and R40. Telkom 1.2GB costs R79. — [ICASA Bi-annual Tariff Analysis, Mar 2026](https://www.icasa.org.za/uploads/files/2025-26FY-Q4-Bi-annual-Tariff-Analysis-Report-Abridged-Report-For-Publication-23032026.pdf)
- Derived (WebFetch's arithmetic on ICASA totals, not an ICASA-stated figure): smartphones are about 70.8% of mobile cellular subscriptions in 2025 (83.0M of 117.3M). — [ICASA State of ICT 2026](https://www.icasa.org.za/uploads/files/The-State-of-the-ICT-Sector-Report-of-South-Africa-31-March-2026.pdf)

### Inferences
- Budget images tightly. At R85 per GB, a 500 KB recipe photo costs about 4c per view, so a 20-recipe feed of unoptimised 500 KB images costs about R0.85. Serve WebP/AVIF thumbnails of about 30–80 KB, load lazily, cache on the device, and add a "data saver / no images on mobile data" setting. These targets are design inferences, not sourced limits.
- Expect many low-RAM Android devices, given R399 handsets. Keep animation light and test on a low-end Android device.
- For legal framing, describe WCAG 2.2 AA as best practice and the expected standard for app-store accessibility. Do not describe it as SA law.

### Gaps
- UNVERIFIED: whether PEPUDA (Promotion of Equality and Prevention of Unfair Discrimination Act, 2000) or the Constitution creates an enforceable digital-accessibility duty for private apps. The search returned only third-party blogs (allaccessible.org, 3playmedia, disabilityworld.org), which I did not verify, so treat their claims as unconfirmed.
- No SANS standard on mobile or web accessibility was found. Do not cite one.
- An ICASA "Draft Code for Persons with Disabilities Regulations 2020" exists ([ICASA PDF](https://www.icasa.org.za/uploads/files/Draft-Code-for-Persons-with-Disabilities-Regulations-2020.pdf)). It was not read. It most likely targets licensees (operators and broadcasters), not app developers.
- No sourced figure on low-end Android share (for example, by RAM or Android version) in SA. GSMA reports were not fetched.

## Food information: allergens, SA labelling regulations (R146 / R3337), nutrition-claim wording

### Takeaway
R146 (2010) is the law in force. It defines eight "common allergens" an app should mirror at minimum. R3337 (published for comment 21 April 2023) is still a draft as of Oct/Nov 2026. It proposes front-of-pack warning labels and tighter claim rules, but its final content is unknown. A recipe app is not a food label, so neither regulation binds it directly. Still, using the legal allergen list and avoiding unproven nutrition or health claims is the safe design choice.

### Cited Findings
- R146 of 2010 (*Regulations relating to the Labelling and Advertising of Foodstuffs*, under the Foodstuffs, Cosmetics and Disinfectants Act, 1972) defines "common allergen" as "egg, cow's milk, crustaceans and molluscs, fish, peanuts, soybeans, tree nuts and any significant cereals", including derived ingredients that keep their allergenicity. — [Acts Online R146 reg 1](https://www.acts.co.za/foodstuffs-/r146_1__definitions)
- R146: "significant cereal" means wheat (including kamut and spelt), rye, barley, oats and crossbred hybrids such as triticale. "Gluten" means the proteins in a significant cereal to which some people are intolerant. "Uncommon allergen" is any allergen not classified as common. — [Acts Online R146 reg 1](https://www.acts.co.za/foodstuffs-/r146_1__definitions)
- R3337 status: published for comment on 21 April 2023, with comments closing 21 September 2023 after an extension. It was tabled at Nedlac's Trade and Industry Chamber on 26 August 2026. "There is no firm publication date"; the regulations are not finalised or gazetted. — [Daily Maverick, 7 Oct 2026](https://www.dailymaverick.co.za/article/2026-10-07-food-warning.md)
- A food-safety consultancy (secondary source) says "R3337 is still a draft as of mid-2026 and is not yet in force" and "R146 remains the law you must comply with today". — [ASC Food Safety](https://ascfoodsafety.com/regulations-r3337-what-you-need-to-know/)
- Draft R3337 front-of-pack proposal (secondary source): a warning on products high in sugar, sodium or saturated fat, or containing artificial sweeteners, modelled on Chile. Wording: "WARNING: This product is high in [...] / contains artificial sweeteners." Claims such as "source of energy" or "with added vitamins" would be restricted on products that carry a warning. Claims are linked to nutrient profiling (reg 50). — [ASC Food Safety](https://ascfoodsafety.com/regulations-r3337-what-you-need-to-know/)
- Draft R3337 allergens (secondary source): it keeps the R146 list. It adds a lupin statement (reg 38: "Peanut-allergic individuals are at high risk to react to lupin present in this product") and a sulphite/"sulphate" declaration at 10 ppm (the source's wording may be a typo). — [ASC Food Safety](https://ascfoodsafety.com/regulations-r3337-what-you-need-to-know/)
- A July 2025 DALRRD gazette (GN R.6436, Gazette 53020, meat analogues) requires that nutrient and vegan claims follow the Foodstuffs Act regulations. "Light/lite" claims need a stated comparison and at least a 25% difference. It has no allergen list. — [Gov Gazette 53020](https://www.gov.za/sites/default/files/gcis_document/202507/53020rg11854gon6436.pdf)

### Inferences
- The allergen filter and badges should cover the R146 eight as a minimum: egg, milk, crustaceans and molluscs, fish, peanuts, soy, tree nuts, gluten cereals (wheat/rye/barley/oats). Optional extras for users: sesame, mustard, lupin, sulphites, celery. These extras are not confirmed as SA legal requirements.
- Allergen display best practice (design inference): show allergens as text with an icon, never by colour alone (WCAG 1.4.1). Show them near the top of the recipe, not only in the ingredients list. Label user-entered or AI-derived allergen data as unverified, and tell users to check product packaging.
- "Nutritional information where verified": show nutrition values only when they come from a cited source (for example, the SAFOODS / SA Food Composition Database; not researched here). Mark estimates as "estimated". Avoid claim words such as "low fat", "high protein", "light", "healthy", "source of". Under R146 and draft R3337 these are regulated claims with numeric conditions. A recipe app is not a food label, but using them invites misleading-claim risk.

### Gaps
- R146's own rules on nutrient content claims (the numeric thresholds for "low", "free", "source of") were not fetched. They are not quoted here.
- Whether R146 or R3337 applies to digital recipe content or apps at all is UNVERIFIED. They govern labels and advertising of foodstuffs.
- No primary-source text of draft R3337 was read. The allergen and claim details above come from secondary sources (ASC Food Safety, Daily Maverick). The earlier R3287 gazette numbering seen in search results ([LEAP/UNEP](https://leap.unep.org/en/countries/za/national-legislation/regulations-no-r-3287-2023-relating-labelling-and-advertising)) was not reconciled with R3337. Check the gazette before citing a number.
- Precautionary "may contain" labelling rules for SA were not found.
