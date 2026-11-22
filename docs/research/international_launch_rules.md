# NutriTale international launch rules (allergens, claims, store payments, web payments, first markets)

Research date: 22 Nov 2026. Label key:
- **[FETCHED 22 Nov 2026]**: page text was retrieved and read in this session.
- **[SEARCH-LISTING ONLY]**: the source showed up in search results but the page itself was not read.
- **UNVERIFIED**: comes from prior knowledge, with an official URL given for checking. Not confirmed in this session. Check it before relying on it.

---

## Q1. Allergen lists the app must mirror, per market

### Takeaway
SA's R146 has 8 allergen groups, and draft R3337 is still not law as of Oct 2026. The EU and UK use the same 14. The US has 9, including sesame. Canada and Australia/NZ have longer lists that add sesame, mustard (Canada), lupin (ANZ) and sulphites. Nigeria and Kenya were not verified. To be safe, the app should tag a superset of about 16 allergens and show users each market's list.

### Cited Findings
- **South Africa, R146 (in force). Common allergens:** egg, cow's milk, crustaceans and molluscs, fish, peanuts, soybeans, tree nuts, and gluten-containing cereals (wheat, rye, barley, oats, spelt/kamut). They must be declared when present. The same page has an overview elsewhere that lists a different set (adds sulphites, omits molluscs) and tells readers to confirm against R146. Treat the list as needing a check against the Gazette text. — [ASC Food Safety allergen guide](https://ascfoodsafety.com/allergen-labelling-guide/) [FETCHED 22 Nov 2026; secondary source]. Gazette text of R146 (2010): [gov.za R146 PDF](https://www.gov.za/sites/default/files/gcis_document/201409/30075t.pdf) [SEARCH-LISTING ONLY; this URL is the 2007 draft series, so check the right gazette]; [Georgetown Global Food Laws entry for R146](https://globalfoodlaws.georgetown.edu/documents/no-r146/) [SEARCH-LISTING ONLY]
- **South Africa, draft R3337 status:** not finalised. Published for comment on 21 Apr 2023, with comments closing 21 Sep 2023. Formally tabled at Nedlac's Trade and Industry Chamber on 26 Aug 2026. "There is no firm publication date." Steps still to come include a legal services review, a stakeholder feedback session, a Nedlac report to the minister, and then gazetting. — [Daily Maverick, 7 Oct 2026](https://dailymaverick.co.za/article/2026-10-07-food-warning) [FETCHED 22 Nov 2026]
- **R3337 and allergens:** a secondary source says R3337 is "expected to replace R146". It also says R3337 tightens how allergens are declared and "materially tightens the requirements for gluten-free and related claims". No new allergens were identified. — [ASC Food Safety](https://ascfoodsafety.com/allergen-labelling-guide/) [FETCHED 22 Nov 2026]
- **EU, Reg. 1169/2011 Annex II (14):** cereals containing gluten, crustaceans, eggs, fish, peanuts, soybeans, milk, nuts (tree nuts), celery, mustard, sesame seeds, sulphur dioxide/sulphites (>10 mg/kg or 10 mg/L as SO2), lupin, molluscs. — UNVERIFIED this session; official text: [EUR-Lex 32011R1169](https://eur-lex.europa.eu/eli/reg/2011/1169/oj)
- **UK, post-Brexit:** the same 14 allergens, kept through retained (assimilated) Reg. 1169/2011. — UNVERIFIED this session; [FSA allergen guidance](https://www.food.gov.uk/business-guidance/allergen-guidance-for-food-businesses)
- **US, FALCPA + FASTER Act (9 major allergens):** milk, eggs, fish, crustacean shellfish, tree nuts, peanuts, wheat, soybeans, sesame. Sesame became the 9th on 1 Jan 2023. — UNVERIFIED this session; [FDA Food Allergies](https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies)
- **Canada, priority allergens:** Health Canada publishes separate "priority food allergen" pages for sesame, mustard and sulphites. — [Health Canada sesame](https://www.canada.ca/en/health-canada/services/food-nutrition/reports-publications/food-safety/sesame-priority-food-allergen.html), [mustard](https://www.canada.ca/en/health-canada/services/food-nutrition/reports-publications/food-safety/mustard-priority-food-allergen.html), [sulphites](https://www.canada.ca/en/health-canada/services/food-nutrition/reports-publications/food-safety/sulphites-priority-allergens.html) [SEARCH-LISTING ONLY]. Full list: eggs, milk, mustard, peanuts, crustaceans and molluscs, fish, sesame, soy, sulphites, tree nuts, wheat and triticale, plus gluten sources. — UNVERIFIED this session; [Health Canada common food allergens](https://www.canada.ca/en/health-canada/services/food-nutrition/food-safety/food-allergies-intolerances/food-allergies.html)
- **Australia/New Zealand, FSANZ Code Std 1.2.3 (PEAL, mandatory from 25 Feb 2024):** milk, egg, fish, crustacea, mollusc, peanut, tree nuts (almond, Brazil nut, cashew, hazelnut, macadamia, pecan, pine nut, pistachio, walnut, each named individually), sesame, soy, wheat, gluten (barley, oats, rye), lupin, sulphites (≥10 mg/kg). — UNVERIFIED this session; [FSANZ allergen labelling](https://www.foodstandards.gov.au/consumer/labelling/allergen-labelling)
- **Nigeria (NAFDAC) and Kenya (KEBS):** no source found this session. See Gaps.

### Inferences
- These lists legally apply to **pre-packed food labels**. A recipe app is not covered by them. Mirroring them is a product-safety choice, not a legal duty (see Q2).
- A practical superset to tag every ingredient with: gluten cereals (wheat, rye, barley, oats, spelt, triticale), crustaceans, molluscs, eggs, fish, peanuts, tree nuts (by named nut), soy, milk, sesame, mustard, celery, lupin, sulphites. Allow a per-market filter view.
- Because R3337 has no publication date, building to R146 plus the EU 14 covers SA today and most of what R3337 is likely to keep.

### Gaps
- The exact R146 list (with or without molluscs and sulphites) needs a check against the official Gazette text. The only page read was secondary and contradicts itself.
- Nigeria (NAFDAC Pre-packaged Food Labelling Regulations) and Kenya (KS EAS 38 / Codex-based) allergen lists were not researched due to the tool budget. Both may follow the Codex GSLPF list (revised 2018). UNVERIFIED.
- The EU, UK, US, Canada and FSANZ lists come from prior knowledge. The official pages above were not fetched this session.

---

## Q2. Do recipe apps have to follow food-labelling claim rules ("healthy", "low fat", nutrition values)?

### Takeaway
No official guidance applying these rules to recipe apps was found in this session. The rules are written for food labels, presentation and advertising of food sold to consumers. For a recipe publisher, the risk is indirect: consumer-protection or misleading-advertising rules, and app-store review. Using claim words loosely in marketing for a paid app is still a risk.

### Cited Findings
- **US FDA "healthy" rule:** final rule updating the "healthy" nutrient content claim, published in the Federal Register on 27 Dec 2024 (89 FR, doc. 2024-29957). — [govinfo Federal Register](https://www.govinfo.gov/content/pkg/FR-2024-12-27/html/2024-29957.htm); [FDA constituent update](https://www.fda.gov/food/hfp-constituent-updates/fda-finalizes-updated-healthy-nutrient-content-claim) [SEARCH-LISTING ONLY]. Effective date (delayed to 28 Apr 2025) and compliance date (25 Feb 2028): UNVERIFIED this session.
- The FDA rule regulates claims on **food labels/labeling** of foods. It does not cover recipe publishers. — UNVERIFIED inference from the rule's scope; no FDA text read this session.
- **EU Reg. 1924/2006:** applies to nutrition and health claims "made in commercial communications, whether in the labelling, presentation or advertising of foods to be delivered as such to the final consumer" (Art. 1(2)). — UNVERIFIED this session (from prior knowledge); [EUR-Lex 32006R1924](https://eur-lex.europa.eu/eli/reg/2006/1924/oj)
- **SA R146 / R3337:** health and nutrition claims were one of the areas that drew submissions on R3337. — [Daily Maverick, 7 Oct 2026](https://dailymaverick.co.za/article/2026-10-07-food-warning) [FETCHED]. R146 claim restrictions apply to foodstuff labelling and advertising. UNVERIFIED this session.

### Inferences
- NutriTale sells no food, so it is very likely outside the scope of label-claim law in all the markets above. **Exception:** a partnership, affiliate link or sponsored product inside the app could make a statement "advertising of foods". The claim rules could then apply to that content.
- Safer wording: show computed nutrient values with a source note (e.g. "estimated from [dataset]"). Avoid regulated terms ("healthy", "low fat", "high protein", "sugar-free") as labels unless the recipe meets the target market's numeric threshold. Prefer neutral descriptors ("under 500 kcal per serving").
- Avoid health or disease claims (e.g. "lowers cholesterol") in store listings and ads. These carry the most risk under consumer law and store review.

### Gaps
- No regulator guidance found on recipe apps or recipe websites specifically, in any market.
- UK ASA/CAP rules on nutrition claims in ads were not checked. SA ASA/ARB code not checked.
- Numeric thresholds (e.g. EU "low fat" ≤3 g/100 g solids) were not fetched. Do not use them without checking the Annex to 1924/2006.

---

## Q3. App store payments for digital subscriptions

### Takeaway
- **Apple outside the US:** in-app purchase is mandatory and link-outs are banned, except where a regional entitlement exists. "Reader" apps are excluded from this summary.
- **Apple US storefront:** buttons and links to web purchase are allowed. Whether Apple may charge a fee on them is before the Supreme Court (argument 11 Jan 2027). The district court is to set any "reasonable fee".
- **Apple EU from 1 Oct 2026:** IAP 26% / 15%, alternative in-app payment 20% / 10%, link-out 15% / 10%.
- **Rule 3.1.3(b):** web subscribers can unlock premium in the iOS app, but only if the same subscription is also offered as an IAP.
- **Google Play from 30 Jun 2026 (US, UK, EEA):** alternative billing or web links allowed. 10% service fee on auto-renewing subscriptions under every payment method, plus a 5% billing fee only when Play Billing is used.

### Cited Findings
**Apple, global rules**
- 3.1.1: "If you want to unlock features or functionality within your app, (by way of example: subscriptions…) you must use in-app purchase." — [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) [FETCHED 22 Nov 2026]
- 3.1.1(a): link-out entitlements are "not required for developers to include buttons, external links, or other calls to action in their United States storefront apps… In all other storefronts, except for the United States storefront… apps and their metadata may not include buttons, external links, or other calls to action that direct customers to purchasing mechanisms other than in-app purchase." Entitlements exist only "in specific storefronts". — [same](https://developer.apple.com/app-store/review/guidelines/) [FETCHED]
- 3.1.3 intro: apps "cannot, within the app, encourage users to use a purchasing method other than in-app purchase, except for apps on the United States storefront and as set forth in 3.1.1(a) and 3.1.3(a). Developers can send communications outside of the app to their user base about purchasing methods other than in-app purchase." — [same](https://developer.apple.com/app-store/review/guidelines/) [FETCHED]
- 3.1.3(b) Multiplatform Services: apps "may allow users to access content, subscriptions, or features they have acquired in your app on other platforms or your web site… provided those items are also available as in-app purchases within the app." — [same](https://developer.apple.com/app-store/review/guidelines/) [FETCHED]

**Apple, US (Epic v. Apple)**
- Dec 2025: the Ninth Circuit held that Apple violated the injunction but may charge a reasonable fee for its technology on link-outs. The fee question was sent back to the district court. — [MacRumors, 11 Dec 2025](https://www.macrumors.com/2025/12/11/apple-app-store-fees-external-payment-links/) [SEARCH-LISTING]; summarised in [MacRumors, 29 Apr 2026](https://www.macrumors.com/2026/04/29/epic-games-wins-reversal-app-store-fee-battle/) [FETCHED]
- 28 Apr 2026: the Ninth Circuit granted Epic's reconsideration and reversed the stay that had let Apple keep its structure pending Supreme Court review. The district court is to set the fee. — [MacRumors, 29 Apr 2026](https://www.macrumors.com/2026/04/29/epic-games-wins-reversal-app-store-fee-battle/) [FETCHED]
- Supreme Court, No. 25-1311 *Apple Inc. v. Epic Games*: cert granted 30 Jun 2026, "limited to Question 1" (the civil contempt holding, per [Mealey's](https://www.mealeys.com/mealeys/articles/2495691) [SEARCH-LISTING]). Set for argument on 11 Jan 2027. No decision on the docket (latest entries are amicus briefs, 20 Nov 2026). — [SCOTUS docket 25-1311](https://www.supremecourt.gov/docket/docketfiles/html/public/25-1311.html) [FETCHED 22 Nov 2026]
- Whether any district-court fee on US link-outs is in force as of 22 Nov 2026 is **UNVERIFIED** (see Gaps).

**Apple, EU (effective 1 Oct 2026; announced 18 Aug 2026)**
- Every EU developer moves to a single set of business terms. The Core Technology Fee is replaced by the 5% Core Technology Commission (CTC). The Initial Acquisition Fee and Store Services Fee are eliminated. — [Apple Developer News, 18 Aug 2026](https://developer.apple.com/news/?id=gmws0jgp) [FETCHED]
- Rates:
  - Apple IAP: **26%** standard, **15%** reduced.
  - Alternative in-app payment processing: **20%** standard, **10%** reduced.
  - Store services commission on out-of-app offers with an actionable link: **15%** standard, **10%** reduced, applied to sales within 7 days of the link tap.
  - The reduced rate applies to Small Business Program members and to auto-renewable subscriptions after their first year.
  - CTC is 5%, and applies only to alternative marketplaces and web distribution.
  - With alternative payments, the developer collects and remits taxes and must send Apple a monthly transaction report within 15 days of month end.
  - [Apple, Apps in the EU](https://developer.apple.com/support/apps-in-the-eu/) [FETCHED 22 Nov 2026]

**Apple, South Korea and Japan**
- The Review Guidelines page does not name the countries. The StoreKit External Purchase docs page did not render (JavaScript), so the country list was not confirmed. — [StoreKit External Purchase](https://developer.apple.com/documentation/storekit/external_purchase) [fetch failed]
- South Korea: Apple's StoreKit External Purchase Entitlement (since 2022) allows alternative in-app payment with a reduced commission (26%). — UNVERIFIED this session.
- Japan: the Mobile Software Competition Act took full effect in Dec 2025, and Apple announced Japan-specific alternative payment and link-out options with commissions. — UNVERIFIED this session; figures not checked.

**Apple, rest of world (including South Africa)**
- In-app buttons, links or calls to action for web purchase are banned in every storefront except the US and the entitlement storefronts. No SA-specific exception was found. — [Review Guidelines 3.1.1(a)](https://developer.apple.com/app-store/review/guidelines/) [FETCHED]

**Google Play (post dated 24 Jun 2026)**
- A new billing choice program for users in the **UK and EEA**, alongside the existing **US** programs. Developers can offer an alternative billing system or link users to their own website, alongside Play Billing, and may design their own choice screen.
- **Service fee** from 30 Jun 2026 (US, EEA, UK first) applies under every payment method. It "starts at 10% on your first $1M (USD) in annual earnings", and "this 10% service fee also applies to all auto-renewing subscriptions."
- **Billing fee** is 5% in the US, UK and EEA, and applies only when Play Billing is used.
- Program rate cards arrive on 30 Sep 2026 (the rates are in images that could not be read).
- Rest-of-world billing fee details are "coming soon".
- [Android Developers Blog, 24 Jun 2026](https://android-developers.googleblog.com/2026/06/play-expanded-billing.html) [FETCHED]

### Inferences
- **Effective subscription take** (inference from the cited rates; the post does not state a total):
  - **Google Play, US/UK/EEA:** about 15% with Play Billing (10% + 5%), or about 10% plus your own processor fee with web or alternative billing.
  - **Apple EU:** link-out (15%, then 10% after year 1) plus your processor fee comes out about the same as IAP at the 15% small-business rate. Plain IAP via the Small Business Program is likely simplest.
- **Web-first with 3.1.3(b) is the practical model for a small budget:** sell on the website (PayFast, Paystack or a merchant of record), keep an IAP for the same subscription in the iOS app so web subscribers can log in and unlock, and never mention web pricing inside the iOS app outside the US.
- Outside the US, EU and entitlement countries, an SA developer must use IAP on iOS for in-app purchase. Google Play outside the US/UK/EEA presumably still requires Play Billing (UNVERIFIED; the post gives no ROW rules).
- The US link-out fee could change after a Supreme Court ruling (expected by mid-2027). Do not design around zero commission on US link-outs.

### Gaps
- Exact current Apple StoreKit External Purchase storefront list (Korea, Japan, NL dating, EU) and Japan MSCA commission rates: the doc page did not render.
- Whether the district court has set a fee for US link-outs after the 28 Apr 2026 Ninth Circuit order: not checked.
- Google Play's rate table for non-subscription transactions, the reduced program rate cards (images), and rest-of-world fees after June 2026.
- Apple Small Business Program rates outside the EU (15%) were not re-checked this session.

---

## Q4. Web payment providers for an SA individual or small SA company

### Takeaway
- **PayFast and Paystack ZA** are available and support recurring card billing. Both take Visa/Mastercard from abroad, but settle only in ZAR, so international buyers pay in rand.
- **Lemon Squeezy** lists SA for bank payouts, but it has stopped new sign-ups and shuts down on 31 Mar 2027. Rule it out.
- **Paddle** SA seller eligibility was not confirmed.
- **Stripe** direct SA accounts were not confirmed. Treat Stripe as unavailable unless verified.

### Cited Findings
- **PayFast:** cards cost "3.2% plus R 2.00 per transaction" (example R500 → "R18.00 (ex VAT)"). Can "receive international payments made via Visa and Mastercard credit cards from anywhere in the world". Says it can "Accept payments in almost any currency" under Multi-Currency Pricing, with no currency list given. Recurring card payments via tokenization, with no separate fee listed. Standard payout R8.70 ex VAT; immediate payout 0.8% ex VAT (min R14.00). — [PayFast fees](https://payfast.io/fees/) [FETCHED 22 Nov 2026]
- **Paystack ZA:** local cards 2.9% + R1 ex VAT (R1 waived under R10). International cards 3.1% + R1 ex VAT, "charged and settled in Rand by default". Capitec Pay / Ozow EFT 2%. Transfers R3 each. Recurring payments via the API, with no separate subscription fee listed. — [Paystack ZA pricing](https://paystack.com/za/pricing) [FETCHED]
- **Paystack currencies:** SA businesses accept ZAR only. International Visa, Mastercard and Amex are accepted once international payments are enabled. Enabling needs compliance requirements to be met, with a response within 48 working hours. "Only Kenya and Nigeria-based businesses have the ability to accept payments… in USD." — [Paystack support](https://support.paystack.com/hc/en-us/articles/360009973779-What-currency-is-available-to-my-business-) [FETCHED]
- **Lemon Squeezy:** South Africa is listed for bank payouts. Also: "Lemon Squeezy is no longer accepting new sign-ups and will shut down on March 31, 2027." — [Lemon Squeezy supported countries](https://docs.lemonsqueezy.com/help/getting-started/supported-countries) [FETCHED 22 Nov 2026]
- **Paddle:** the developer page covers buyer countries ("sell in over 200 countries") and says Paddle "automatically blocks transactions from unsupported countries". It does not state seller eligibility. The seller-eligibility help page failed to load. — [Paddle supported countries](https://developer.paddle.com/concepts/sell/supported-countries-locales) [FETCHED]; [Paddle help: which countries are supported](https://www.paddle.com/help/start/account-verification/which-countries-are-supported-by-paddle) [fetch failed]
- **Stripe:** Paystack (owned by Stripe) runs a page titled "Does Stripe operate in South Africa?", which suggests Paystack is Stripe's route for SA. — [Paystack](https://paystack.com/stripe/south-africa) [SEARCH-LISTING ONLY]. Paystack's SA launch after the Stripe acquisition: [TechCrunch, 6 May 2021](https://techcrunch.com/2021/05/06/paystack-expands-to-south-africa-seven-months-after-stripe-acquisition) [SEARCH-LISTING ONLY]. Stripe Atlas (US Delaware company, which needs US tax filings and costs money) was not researched.

### Inferences
- **Cheapest working stack now:** PayFast or Paystack for web subscriptions, priced in ZAR. International buyers see a foreign-currency conversion on their card.
  - Paystack international cards: 3.1% + R1. PayFast: 3.2% + R2.
  - VAT on fees applies in both cases.
- **Tax note:** neither PayFast nor Paystack is a merchant of record. Selling to EU/UK consumers makes the seller responsible for EU VAT (OSS) and UK VAT on digital services from the first sale. A merchant of record (Paddle) handles that, which is the main reason to want one. UNVERIFIED this session; check the EU OSS and HMRC rules before selling into the EU or UK.
- Do not sign up to Lemon Squeezy: new sign-ups are closed and it shuts down on 31 Mar 2027.

### Gaps
- Paddle's acceptance of SA sellers (individuals vs companies) and Paddle's fee (commonly cited as 5% + $0.50) were not verified this session.
- PayFast's actual settlement currency and multi-currency mechanics (whether it displays prices only or truly charges in USD/EUR) are unclear from the fees page.
- Stripe availability for SA-registered entities was not confirmed from stripe.com/global.
- Not researched: Polar.sh, FastSpring, 2Checkout/Verifone, Peach Payments.

---

## Q5. Recommended first 2–3 launch markets (INFERENCE)

### Takeaway (inference, not a sourced fact)
**1. South Africa first, 2. Nigeria/Kenya-style English Africa or the UK second, 3. the US for web-first acquisition.** Run a web-first subscription with an IAP mirror. EU-wide launch is not recommended first, because of VAT and allergen/claim complexity.

### Cited Findings
- (Draws on the findings cited in Q1–Q4.)

### Inferences
1. **South Africa (home market):**
   - Payments work natively: PayFast and Paystack in ZAR with no FX friction.
   - The allergen basis is R146, and R3337 has no publication date (Q1).
   - There is no VAT issue abroad.
   - Downside: on iOS, IAP is required with no link-out (Q3).
2. **United Kingdom:**
   - English-language market.
   - Allergen list identical to the EU 14 (UNVERIFIED this session).
   - Google Play billing choice is available from 30 Jun 2026.
   - Downside: UK VAT on digital services from the first sale without a merchant of record (UNVERIFIED). Delay until a merchant of record such as Paddle is confirmed or the volume justifies VAT registration.
3. **United States (web-first):**
   - The iOS storefront allows web purchase links and buttons (3.1.1(a)).
   - Google Play allows alternative billing and web links.
   - Risks:
     - The fee on link-outs could change after the Supreme Court argument on 11 Jan 2027.
     - The FDA "healthy" rule makes claim wording sensitive.
     - Nine allergens including sesame.
     - US sales tax on digital goods varies by state (not researched).
- **Nigeria/Kenya as an alternative to the UK:** Paystack operates there natively with USD acceptance for local businesses (Q4). However, an SA seller would still settle in ZAR, and the allergen rules there were not verified. Treat as a possible Market 2 only after checking.
- **Why not the EU first:** the 14-allergen basis is fine, but OSS VAT registration, claim rules under 1924/2006 if any marketing touches food products, and the more complex Apple EU fee options all add work for a solo founder.

### Gaps
- No market-size or willingness-to-pay data was researched for recipe/pantry apps in any of these markets.
- Merchant-of-record availability for SA sellers is the deciding unknown for the UK, US and EU.
