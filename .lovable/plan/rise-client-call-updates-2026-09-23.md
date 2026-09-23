# /rise client-call updates

Most of this round is already in place from the previous pass. Two items remain, plus verification.

## Changes

1. Mackenzie's company line becomes all caps: "THE FINANCIAL ARCHITECTS" (Joshua already reads "RISE ESTATE PLANNING"). Titles stay "Financial Strategist".
2. Set `tfaReviewsUrl` to `https://g.page/r/CT9bAvd1ecwCEBM` so the "See our Google reviews" link renders on the thank-you card. The link stays hidden whenever the field is empty.

## Already in place (verify only)

- Joshua's shortBio opening and verbatim fullBio.
- License numbers "CA Lic# 4510565" and "CA Lic# 22051832", rendered under each company line in small muted text.
- Required "Who is your real estate agent?" field with "Agent's name" placeholder, placed after email and before preferred contact method, sent as `agentName`; silent `?ref=` capture retained.
- Credibility line on the thank-you card.
- Testimonials section renders quote, name, optional role and photo from config, and stays hidden while the array is empty.

## Files

- `src/config/rise.config.ts` (only file expected to change)

## Verification

- Screenshot advisor cards at 390px showing both license numbers.
- Complete the questionnaire and submit to screenshot the thank-you card with the reviews link opening in a new tab.
