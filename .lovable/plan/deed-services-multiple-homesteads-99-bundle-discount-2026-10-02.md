# Deed Services: multiple homesteads + $99 bundle discount

## What changes for agents/clients
- **Multiple deeds and homesteads:** both counters go up to 10 (homestead is currently capped at 1). Each property gets its own questions; the "primary residence" question shows on every property that has a homestead.
- **Bundle discount:** a homestead costs **$99 when paired with a deed**, otherwise $199. Rule: each deed unlocks one $99 homestead.
  - 1 deed + 1 homestead = $199 + $99 = **$298**
  - 2 deeds + 2 homesteads = $398 + $198 = **$596**
  - 0 deeds + 1 homestead = **$199**
  - 1 deed + 2 homesteads = $199 + $99 + $199 = **$497**
- The service card shows "$199 per homestead — $99 with a deed", and the review/pay summary lists "Homestead (with deed) × N — $99 each" separately from any full-price homesteads, plus a "You saved $X" line.

## Stripe
- Stripe is already connected and charging the $199 deed and $199 homestead prices. I'll add one new price in the same account: **"Homestead Declaration (with Deed)" — $99**.
- Checkout charges the right mix of prices, and the total is always recalculated on the server (the page's number can't be tampered with).
- The LDA email/PDF shows the breakdown and amount paid.

## Technical details
- `stripe--create_stripe_product_and_price`: $99 one-time price; hardcode its ID as `HOMESTEAD_BUNDLE_PRICE` in `create-deed-checkout`.
- `create-deed-checkout`: `bundled = min(deeds, homesteads)`, `full = homesteads - bundled`; amount = deeds*19900 + bundled*9900 + full*19900; line items per price with quantities.
- `DeedServices.tsx`: remove `max: 1` homestead cap; shared `calcTotal()` for card/summary; property count stays `max(deeds, homesteads)`.
- `deedNotify.ts`: services line shows bundled vs full-price homesteads.
- No database changes.
