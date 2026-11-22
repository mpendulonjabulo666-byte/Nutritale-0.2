# Paddle verification for NutriTale (22 Nov 2026)

Question from the owner (decision D13): can Paddle take USD and GBP website payments for NutriTale, run by a South African seller? Each line is labelled **Checked** (page read on 22 Nov 2026, link given), **UNVERIFIED** or **Inference**.

| # | Check | Result | Source |
|---|---|---|---|
| 1 | South African seller allowed | **Probably yes, not confirmed.** Paddle "works with software businesses anywhere in the world" except a list of unsupported countries. South Africa is not on that list (Checked). The page does not say whether a sole trader can sign up or only a company: "Paddle is built to serve software companies" (Checked). | [Supported countries (help)](https://www.paddle.com/help/start/intro-to-paddle/which-countries-are-supported-by-paddle) |
| 2 | Payouts to South Africa | **UNVERIFIED.** The page says Paddle "can payout to anywhere in the world with exception to sanctioned countries". The payout method (bank transfer or another), currency and fees are not stated. | same page |
| 3 | NutriTale product allowed | **Likely yes, with conditions (Inference).** Paddle forbids "Medical advice", including advice for "weight loss, muscle building"; physical products; and sales "where there is no bona fide software or service". So: sell NutriTale Premium as a software subscription (pantry, search, planner features), not as recipe content alone. Keep weight-loss, hormone or diet-advice wording out of everything Paddle sees. Food delivery and ingredient sales are not allowed through Paddle. | [What I can't sell](https://paddle.com/help/start/intro-to-paddle/what-am-i-not-allowed-to-sell-on-paddle) |
| 4 | Fees | **Checked:** "5% + 50¢" per checkout transaction; no monthly fee; no separate subscription fee. Products under $10: "contact us for bespoke pricing". Currency conversion and payout fees: not stated (UNVERIFIED). | [Pricing](https://www.paddle.com/pricing) |
| 5 | Recurring subscriptions | **Checked:** Paddle Billing handles subscriptions as merchant of record (it is the legal seller and handles sales tax and VAT). This also removes the EU and UK VAT registration problem for website sales (Inference from merchant-of-record role). | [Pricing](https://www.paddle.com/pricing) |
| 6 | USD and GBP prices | **UNVERIFIED** for this account. Prices can be set per country and "automatically convert[ed] into local currencies at checkout" (Checked). Whether ZAR is offered: UNVERIFIED (PayFast covers ZAR anyway). | [Supported countries (developer)](https://developer.paddle.com/concepts/sell/supported-countries-locales) |
| 7 | Fits the mobile plan | **Checked:** Paddle documents hosted checkout links from iOS apps for **US users only** ("due to developments in legislation around the App Store"). Purchases unlock in the app by webhook (`transaction.completed` → our entitlement record) or through RevenueCat (integration marked beta). Google Play is not mentioned. This matches `docs/DESIGN_BRIEF.md` 5.5: one entitlement record; in-app purchase still required on iPhone outside the US. | [Paddle for mobile apps](https://developer.paddle.com/get-started/how-paddle-works/mobile) |

## Verdict
Paddle stays the preferred provider for USD and GBP **pending three answers that only Paddle can give**. Ask Paddle sales or support before building:
1. Can a South African sole trader sign up, or do we need a registered company (Pty Ltd)?
2. How and in which currency do payouts reach a South African bank, and at what cost?
3. Is a recipe and pantry software subscription with no diet or medical claims accepted?

PayFast stays for South African website payments (ZAR) while Miss Mvula's verification completes. Apple and Google billing stay as in `docs/DESIGN_BRIEF.md` 5.5.

## Risk to note
The legacy NutriTale app has a hormone-supportive eating guide. If that idea moves into the new app, word it as general information ("supports", never "treats") and keep it out of anything sold through Paddle, because Paddle bans "advice (e.g., weight loss, muscle building)".
