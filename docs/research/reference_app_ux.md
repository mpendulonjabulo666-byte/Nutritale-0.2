# Reference-app UX principles for NutriTale (Uber Eats, Duolingo, Yelp, food search)

Research date: 22 Nov 2026. Each source is dated where the page gave a date. "[OLDER]" marks sources from before 2023. "[UNVERIFIED]" marks claims from secondary or aggregator sources. Where something is missing, the Gaps sections say so rather than filling it in.

## Uber Eats: search, discovery/home, filters, cards, photography, CTAs, Base design system

### Takeaway
Uber's own published material covers two things in depth. First, intent-driven search: a food knowledge graph plus query expansion, so "udon" also returns soba and ramen, and "Asian" includes Chinese and Japanese. Second, a very constrained design system (Base). It says little about visual card or photo rules. For NutriTale, the transferable principle is "understand food intent, expand the query, never show an empty page," and much less any particular screen layout.

### Cited Findings
**Search and query understanding** (Uber Engineering, 10 Jun 2018, [OLDER])
- Uber Eats first infers eater intent from a food knowledge graph, then uses a learned representation of intent to expand the query. The main problem named is ambiguous intent: someone searching "udon" may order soba. — [Uber Eng: Food Discovery with Uber Eats, Query Understanding](https://www.uber.com/blog/uber-eats-query-understanding/)
- The knowledge graph models restaurants, cuisines and menu items, with an ontology of properties and relationships. It is stored for real-time, low-latency queries. — [same](https://www.uber.com/blog/uber-eats-query-understanding/)
- Hierarchy example: "Asian" is inferred to include "Chinese" and "Japanese." "Udon" can expand to "ramen," "soba" and "Japanese." — [same](https://www.uber.com/blog/uber-eats-query-understanding/)
- Query2vec: each whole query is treated as a "word" and each restaurant ordered from as its "context." It uses a PMI matrix and GloVe-style factorisation. "Tan tan noodles" expands to "Szechuan," "Chinese" and "Spicy food." Learning-to-rank blends the expanded results with the original ones. — [same](https://www.uber.com/blog/uber-eats-query-understanding/)
- Zero-result handling: if "Shanghai Dumpling King" isn't available at the user's address, similar nearby restaurants of the same cuisine are shown instead. — [same](https://www.uber.com/blog/uber-eats-query-understanding/)
- Stated limits: learned expansion can't tell how terms relate. "Halal" expands to Middle Eastern, Mediterranean or South Asian, but not all of those are halal, so dietary filters need the explicit knowledge graph. Learned expansion also needs behavioural data, which is missing at launch. — [same](https://www.uber.com/blog/uber-eats-query-understanding/)
- That article does not cover misspelling handling. — [same](https://www.uber.com/blog/uber-eats-query-understanding/)

**Home and discovery structure** (Uber Newsroom, 7 Oct 2020, [OLDER])
- The 2020 redesign added tappable shortcuts to favourite cuisines and non-restaurant merchants, and curated rows such as "Hidden Gems" (neighbourhood) and "Family Favorites" (group bundles). It also added a "Trending" feed of what people nearby are ordering now. — [Uber Newsroom: Arriving now, the new Uber Eats](https://www.uber.com/newsroom/arriving-now-the-new-uber-eats)
- Recommendations get more personal as users order more. Past favourite meals can be reordered with one tap. — [same](https://www.uber.com/newsroom/arriving-now-the-new-uber-eats)
- The stated goal was to make finding food "faster" and to reduce "endless scrolling." — [same](https://www.uber.com/newsroom/arriving-now-the-new-uber-eats)
- The pickup map shows visual cues for go-to spots and deals, plus a list of nearby restaurants ranked by rating. — [same](https://www.uber.com/newsroom/arriving-now-the-new-uber-eats)
- The April 2019 "Refreshing the Eats experience" post is about order tracking, delay explanations, courier contact and support. It covers no visual or home design. — [Uber Newsroom: eatsredesign (10 Apr 2019)](https://www.uber.com/newsroom/eatsredesign)

**Base design system**
- Base started in 2018 as a React web library, released as open-source Base Web. Uber now calls it "the UI framework for all our products." — [Uber Design: How we scale design using patterns](https://www.uber.com/us/en/careers/design/work/design-platform/); see also [Introducing Base Web](https://www.uber.com/blog/introducing-base-web)
- Constraint set, quoted as "dead simple": "4 font categories, 3 main colors (white, black, and an accent color), and 5 core sizes based on a 4-pixel grid." — [Uber Design: design platform](https://www.uber.com/us/en/careers/design/work/design-platform/)
- Components are basic at the core and extended through overrides, which Uber compares to Lego bricks. Documentation lives in one Figma library with guidelines and do/don't examples. Governance is described as "an inclusive, evolving ecosystem," not gatekeeping. — [same](https://www.uber.com/us/en/careers/design/work/design-platform/)

### Inferences
- NutriTale's ingredient-to-recipe search fits the Uber knowledge-graph pattern without copying any visuals. Model ingredients, dishes, cuisines (for example isiZulu, Cape Malay, braai) and dietary tags as an explicit ontology. For example, "pap" covers mieliepap and phutu, and "mince" covers beef mince and soya mince. A small hand-built synonym/ontology table is the free-tier version of this. Query2vec needs order data NutriTale doesn't have.
- The halal limitation maps directly onto NutriTale: dietary filters (halal, vegetarian, diabetic-friendly) must come from explicit tags, never from "similar recipes" expansion.
- Base's "3 colours plus 4px grid plus 5 sizes" is a principle, constrain hard, and not a look. NutriTale can adopt the discipline with its own palette.

### Gaps
- No official Uber source found that documents the current (2025–2026) Eats search screen: instant suggestions, recent searches, typo tolerance UI, chip/carousel specs, filter sheet behaviour, card anatomy or food photography rules. Any such claims would come from screenshots or third-party teardowns and are not included here.
- Base Web documentation site (baseweb.design) and Uber Move typeface specs were not fetched, so there are no token values here.

## Duolingo: micro-interactions, feedback, streaks, mascot, Rive, published design principles

### Takeaway
Duolingo publishes measured results for motivation design: streak animations lifted 7-day retention by 1.7%, and 7-day-streak learners are 3.6x more likely to finish a course. It also documents a pipeline where animators and "creative technologists" ship Rive state machines straight into the app. Its art principles (few rounded shapes, bright colour, white space, exaggerated key details) and its 2026 tab redesign principles (consistency with purpose, whitespace over boxes) can be adopted without the owl.

### Cited Findings
**Streaks and motivation** (Duolingo blog, 31 Jan 2022, [OLDER])
- More than 6 million learners had a 7+ day streak. Learners who reach a 7-day streak are 3.6x more likely to complete their course. — [Duolingo: The habit-building research behind your streak](https://blog.duolingo.com/how-duolingo-streak-builds-habit)
- A new streak-extension animation, plus special milestone-day animations, raised the share of new learners still active 7 days later by 1.7%. — [same](https://blog.duolingo.com/how-duolingo-streak-builds-habit)
- Allowing two Streak Freezes to be equipped at once raised relative daily active learners by 0.38%, without more days off. A freeze pauses the streak for one day. The rationale cites a UPenn/UCLA study finding that "slack" motivates more than rigid rules. — [same](https://blog.duolingo.com/how-duolingo-streak-builds-habit)
- Short streaks feel more rewarding: going from 2 to 3 days is a 50% jump, while going from 200 to 201 is 0.5%. Long streaks are driven by loss aversion. — [same](https://blog.duolingo.com/how-duolingo-streak-builds-habit)
- A further post on improving the streak exists but was not read. — [Duolingo: Improving the streak](https://blog.duolingo.com/improving-the-streak)

**Milestone animation design** (Duolingo blog, Kurt Hartfelder, 21 Jan 2022, [OLDER])
- Research and focus groups showed new learners didn't understand the streak. The team suspected the "on fire" metaphor is not universal across cultures, so it moved to a phoenix motif because that bird appears on many flags and coats of arms. — [Duolingo: streak milestone design and animation](https://blog.duolingo.com/streak-milestone-design-animation)
- Milestones are framed as video-game "power-ups," with the mascot transforming. The earlier balloons were "cute, but not quite celebratory enough, energy-wise." — [same](https://blog.duolingo.com/streak-milestone-design-animation)
- Timing and energy are called "as important to the success of Duo's transformation as the design itself." The team made several rough timing passes before polishing. No durations or easing values are published. — [same](https://blog.duolingo.com/streak-milestone-design-animation)
- A simple in-app share card lets learners save or post the achievement without leaving the app. — [same](https://blog.duolingo.com/streak-milestone-design-animation)

**Art style and shape language** (Duolingo blog, Megan Barker, 2 Jul 2020, [OLDER])
- The style aims to be "minimalistic, playful," "quick to produce, clear to understand." It moved from hard-edged raster art to rounder vector shapes. Each object uses only a few "mission-critical" shapes with a clear silhouette and minimal detail. — [Duolingo: Shape language](https://blog.duolingo.com/shape-language-duolingos-art-style/)
- The palette is vibrant and bright, replacing earlier muted tones. Art is framed with white negative space so it doesn't interrupt the app. Key details are exaggerated toward caricature. Rotated lines guide the eye. Animation is used to capture attention. — [same](https://blog.duolingo.com/shape-language-duolingos-art-style/)
- Food and cultural visuals accompany taught sentences to build cultural engagement. — [same](https://blog.duolingo.com/shape-language-duolingos-art-style/)

**Core tabs redesign** (Duolingo blog, Leah Lee and Lokesh Fulfagar, 4 Feb 2026)
- Problems named: inconsistent header sizes, weak type hierarchy, uneven spacing, and header art that "took up space without communicating anything." — [Duolingo: Core tabs redesign](https://blog.duolingo.com/core-tabs-redesign)
- Principles: "balance consistency with purpose," "balance simplicity with clarity," and use whitespace to group content instead of boxing every section. Decisions: tiered header sizes by tab purpose, a minimal type-style set, and illustrations kept only where functional. — [same](https://blog.duolingo.com/core-tabs-redesign)
- Four directions were prototyped: Punchy, Soft, Modular (cards) and Flat. The post reports "higher engagement across tabs while maintaining core learning metrics" but gives no figures. — [same](https://blog.duolingo.com/core-tabs-redesign)

**Rive pipeline** (Rive blog, 25 Jul 2024)
- Duolingo first used Rive for reward animations (a treasure chest bursting with gems), then for phonetic lip-sync of characters, then for templated interactive learning animations reused across courses. — [Rive: Creative technologists, Duolingo's solution to the designer-developer handoff](https://rive.app/blog/creative-technologists-duolingo-s-solution-to-the-designer-to-developer-handoff)
- Workflow: animators build timelines in Rive. Creative technologists build the state-machine logic, write input specs and hand interactive assets to engineers. Simpler state machines are said to give more performant animations. — [same](https://rive.app/blog/creative-technologists-duolingo-s-solution-to-the-designer-to-developer-handoff)
- Related: Duolingo's character viseme (lip-sync) post, and Rive's post on the AI video call with the character Lily. Both were found but not read in full. — [Duolingo: world character visemes](https://blog.duolingo.com/world-character-visemes); [Rive: Duolingo's AI video call brings Lily to life](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life)
- LottieFiles also has a Duolingo case-study page, not read here. — [LottieFiles: Duolingo case study](https://lottiefiles.com/case-studies/duolingo/en)

### Inferences
- A cooking streak should reward early days heavily, since 2 to 3 days is a 50% jump. It should include built-in "slack," a freeze-style rest day, because households don't cook every day.
- Celebrate milestones with a culturally neutral or locally meaningful motif. Duolingo dropped "on fire" because it didn't read universally, and NutriTale's SA audience needs the same check (for example, a pot or a three-legged potjie in place of flames). Treat timing and energy as a design deliverable.
- For Expo or a PHP PWA, Rive state machines (one file, inputs such as `isCorrect` and `level`) are the documented route. Keep state machines simple for performance on budget Android.
- Use the 2026 tab principles directly: whitespace over boxes, illustrations only where they carry information.

### Gaps
- No Duolingo source found that publishes haptics guidelines, loading-screen design rules, exact animation durations or easing curves. Search returned a "design" hub but no haptics post.
- Lift figures (1.7% and 0.38%) come from 2022. No newer published numbers were found.

## Yelp: business cards, detail pages, ratings/reviews display, filter/sort, style guide

### Takeaway
Yelp's public material is mostly about its design-system process, not about UX rules for listings. That process includes the 2014 public style guide with its "island" container and "no special cases" mantra, and later Android and server-driven UI consistency posts. The one documented page change moved review highlights, hours and menu highlights up and put actions top-right. Evidence on rating-display and filter UX is thin.

### Cited Findings
- Yelp's style guide was announced 11 Feb 2014 at yelp.com/styleguide and used internally since May 2013. It aimed at visual consistency and less technical debt. It includes the "island" container pattern for calling out information, typography, forms, a Sass grid, and components taken from the business listing page. [OLDER] — [Yelp Eng: Yelp's got style](https://engineeringblog.yelp.com/2014/02/yelps-got-style-and-the-guide-to-back-it-up.html)
- Mantra: "There are no special cases." Use existing patterns first, otherwise change a pattern everywhere or create a new reusable one. The style guide renders live production code so it stays current. [OLDER] — [same](https://engineeringblog.yelp.com/2014/02/yelps-got-style-and-the-guide-to-back-it-up.html)
- Business page redesign (undated Search Engine Land article, likely 2014, [OLDER] [UNVERIFIED date]): images, featured reviews and local content made more prominent. Hours easier to find. Review highlights near the top. Menu highlights under hours instead of just a link. Review, add-photo, share and bookmark actions in the upper right. The rating distribution chart and 30-day trend graph were removed, and the author regretted losing the distribution chart. — [Search Engine Land: Yelp supersizes profiles](https://searchengineland.com/yelp-supersizes-profiles-makes-less-busy-184075)
- Later engineering posts on UI consistency exist but were not read: Android UI consistency (2018), CSS in React (2018), Styleguidist to Storybook (2022), and server-driven UI consistency across platforms (Apr 2026). — [Android UI](https://engineeringblog.yelp.com/2018/10/how-we-are-keeping-our-android-ui-consistent.html); [Storybook migration](https://engineeringblog.yelp.com/2022/07/migrating-from-styleguidist-to-storybook.html); [Server-driven UI (2026)](https://engineeringblog.yelp.com/2026/04/keeping-server-driven-ui-consistent-across-platforms.html)

### Inferences
- A NutriTale recipe page can borrow the information-priority idea without Yelp visuals. Put the decision facts at the top: time, cost in rands, how many of your pantry items it uses, and a review highlight. Keep actions (save, share, cook now) in one consistent spot.
- Consider keeping a rating distribution: the critic of Yelp's redesign valued it because it shows where ratings cluster, which a single star average hides.
- "No special cases" plus a live component catalogue suits a one-person free-tier team: every screen is assembled from the same few containers.

### Gaps
- No current (2024–2026) official Yelp documentation found on star or rating display rules (half-stars, colour scale, review counts), search-result card anatomy, or filter and sort UX. The public styleguide URL was not fetched, so whether it is still live is unknown.
- The server-driven UI post (2026) may describe current business-page components but was not read.

## Food-search best practices: did-you-mean, zero results, fuzzy search, synonyms, autocomplete

### Takeaway
Baymard benchmarks show search is widely broken. 56% of sites fail users' search needs, 69% don't offer autocomplete suggestions for misspelled queries, only 19% get autocomplete fully right, and about 50% build "no results" pages that drive abandonment. The documented fixes are cheap and fit a free-tier app: hand-mapped misspellings and synonyms, typo-tolerant autocomplete (4–8 suggestions on mobile), and a no-results page that never dead-ends.

### Cited Findings
**Overall benchmark** (Baymard, published 12 Sep 2024, updated 29 Apr 2026)
- 56% of sites fail to adequately support users' search needs. Only 44% have "decent" or "good" search UX. "Mediocre or worse" overall: desktop 46%, mobile 58%, apps 64%. Scope: 10,000+ ratings across 170+ sites and apps. — [Baymard: Ecommerce search query types](https://baymard.com/blog/ecommerce-search-query-types)
- About half of participants prefer search as their way to find products, and the other half use navigation. 34% used site search for non-product content. — [same](https://baymard.com/blog/ecommerce-search-query-types)
- Share of sites with issues by query type: Exact 12% (the body text says "a third" performed mediocre, which is internally inconsistent), Product Type 20%, Feature 39%, Use Case 43%, Abbreviation and Symbol 54%, Compatibility 44%, Symptom 37%, Non-Product 66%. — [same](https://baymard.com/blog/ecommerce-search-query-types)
- Abbreviation example: Staples mobile returned 78 results for "television" but 174 for "tv." This shows why synonym and abbreviation mapping matters. — [same](https://baymard.com/blog/ecommerce-search-query-types)

**Misspellings in autocomplete** (Baymard, Edward Scott, 31 Aug 2021, [OLDER] but still listed)
- 69% of sites don't give autocomplete suggestions for slightly misspelled queries. Nearly all test users relied on autocomplete at some point. — [Baymard: Offer autocomplete suggestions for misspellings](https://baymard.com/blog/offer-autocomplete-suggestions-for-misspellings)
- Users reacted to misspellings in four escalating ways: quick fix, spending 30+ seconds fixing, switching to category navigation, and abandoning search. — [same](https://baymard.com/blog/offer-autocomplete-suggestions-for-misspellings)
- Recommendations: map common misspellings to correct terms, using off-the-shelf spell-check plus manual mapping from search logs. Don't rely only on corrections on results or no-results pages, because users who abandon or retype never see them. Prioritise mobile, where typing is harder. — [same](https://baymard.com/blog/offer-autocomplete-suggestions-for-misspellings)

**Autocomplete design** (Baymard, 2 Aug 2022, rewritten from 2014)
- 80% of sites offer autocomplete, up from 72% in 2014. Only 19% get all implementation details right. — [Baymard: Autocomplete design](https://baymard.com/research-articles/autocomplete-design)
- Show no more than 10 suggestions on desktop and 4–8 on mobile. Style category-scope suggestions differently (italics, colour or indent). Highlight the predicted portion, not the typed text. — [same](https://baymard.com/research-articles/autocomplete-design)
- Mobile: remove competing sticky elements (chat bubbles, install banners), use adequate tap targets and dividers, and use title case rather than all caps. — [same](https://baymard.com/research-articles/autocomplete-design)
- NN/g (Kate Moran, 20 May 2018, [OLDER]): in one ecommerce study, users picked a suggestion in 23% of cases where suggestions appeared (31 of 136, ±7%). Every suggestion must return good results, since zero-result suggestions are worse than none. Scoped suggestions should be visually distinct. On mobile, use simple text suggestions only. — [NN/g: Site search suggestions](https://www.nngroup.com/articles/site-search-suggestions/)
- Note a conflict: NN/g says to highlight the user's typed text when matches can be mid-string, while Baymard says to highlight the predicted portion. NN/g says it depends on whether suggestions only append characters. — [NN/g](https://www.nngroup.com/articles/site-search-suggestions/); [Baymard](https://baymard.com/research-articles/autocomplete-design)

**No-results page** (Baymard, 4 Feb 2019, updated 18 Feb 2025)
- About 50% of ecommerce sites implement "no results" pages in ways that frustrate users and increase abandonment. — [Baymard: No results page](https://baymard.com/blog/no-results-page)
- Five fixes: (1) link to related broader categories with filters pre-applied; (2) suggest alternative, simplified queries with a preview of the top 3–5 results each, and if only one alternative returns results, apply it automatically and explain why; (3) personalised recommendations such as recently viewed items; (4) contact or help options; (5) popular or trending content. Search tips alone are not enough. — [same](https://baymard.com/blog/no-results-page)
- Related Baymard figures, cited only in article titles: 37% of sites don't persist the user's query, and 46% get autodirecting to category scopes wrong. These were not checked in the article bodies. [UNVERIFIED detail] — [Baymard on-site search collection](https://baymard.com/blog/collections/on-site-search)
- Uber Eats applies the same principle in food: an unavailable restaurant leads to similar-cuisine alternatives nearby, not an empty page. — [Uber Eng](https://www.uber.com/blog/uber-eats-query-understanding/)

### Inferences
- For NutriTale the "no results" case is mostly "no recipe uses all of these pantry items." Apply Baymard fix (2): drop one ingredient at a time, show "Without spinach: 4 recipes," and auto-apply if only one relaxation works, saying so. Also show trending SA recipes, never an empty screen.
- Abbreviation and symbol (54% failing) and synonyms are the high-risk query types for SA food. Examples: "tbsp" and "tablespoon"; "mealie meal," "maize meal" and "pap"; "chakalaka"; regional names such as "dhania" and "coriander," or "bhaji" and "spinach." Build a hand-maintained synonym and misspelling map from search logs (free) before considering paid fuzzy-search services.
- Mobile autocomplete should show 4–8 plain-text suggestions, mark ingredient vs recipe vs category scope distinctly, and never suggest a term that returns zero recipes.

### Gaps
- No Baymard or NN/g figure found for the share of search queries that are misspelled. The Baymard misspelling article explicitly doesn't give one.
- No food- or recipe-app-specific search research was found (all figures are ecommerce). Applicability to a cook-at-home app is inferred.
- "Recent searches" best-practice figures were not found within the tool-call budget.
