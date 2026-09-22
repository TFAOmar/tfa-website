# /rise review-pass changes

All changes stay inside Rise-only files plus the Rise config. No global CSS, shared components, or packages.

## 1. TFA logo in header and footer

Both the Rise header and footer currently show "The Financial Architects" as plain text. Replace with the same logo image the main site header uses: `src/assets/tfa-logo.png` (imported unchanged, no recolor or crop, aspect ratio preserved, alt "The Financial Architects"). The import is referenced through `rise.config.ts` so it stays swappable. The "RISE" text placeholder is sized so its cap height visually matches the logo, with the hairline divider between them unchanged.

## 2. Questionnaire

- Remove the Skip control entirely (every question has a "Not sure" option).
- Counter reads "Question 1" with no total, since branching changes the count.
- Progress bar stays.

## 3. Video block

- Caption under the video drops the length label and reads only the educational disclosure. The length label stays in the "Video coming soon" placeholder.
- Above 1024px the video block is capped at 960px wide and centered.

## 4. Header CTA

Confirm "Get started" scrolls to the questionnaire (it targets `#rise-questionnaire`, which exists on the questionnaire section). Verified in the browser as part of testing.

## 5. Advisor license number

Add an optional `licenseNumber` field per advisor in `rise.config.ts`. When present it renders under the advisor's title in small muted text; when empty nothing renders. Left empty for now until the real numbers arrive.

## 6. Motion

Rework `RiseReveal` so nothing depends on JavaScript to become visible:

- The page wrapper gets a `rise-js` class set by script at mount. The hidden starting state applies only inside that class, so with scripts off every section renders fully visible.
- Hero and header get no entrance animation — they are complete at first paint. Reveals start at the video section.
- Reveals: brief fade plus small upward translate, 300–400ms, once per element, observer disconnects after firing so scrolling up never re-triggers.
- The three "Why now" points stagger 80–100ms apart via a delay prop.
- Below 768px the translate distance and duration are reduced for a subtler version.
- `prefers-reduced-motion` shows everything immediately with no transition.
- No pinned scrolling, parallax, or scroll-linked effects.

## 7. Footer links

Confirm Privacy Policy, SMS Terms, and Terms resolve. Routes `/privacy-policy`, `/sms-terms`, and `/terms-of-service` all exist in the router; the footer's Terms link is checked against `/terms-of-service` and corrected if it points elsewhere.

## Technical notes

Files to change:

- `src/config/rise.config.ts` — logo import/reference, optional `licenseNumber` per advisor.
- `src/components/rise/RiseHeader.tsx` — logo lockup, cap-height sizing.
- `src/components/rise/RiseFooter.tsx` — logo lockup, link check.
- `src/components/rise/RiseQuestionnaire.tsx` — remove Skip, counter without total.
- `src/components/rise/RiseVideo.tsx` — caption, 960px desktop cap.
- `src/components/rise/RiseHero.tsx` — remove RiseReveal wrapper.
- `src/components/rise/RiseAdvisors.tsx` — license line, staged reveal usage.
- `src/components/rise/RiseWhyNow.tsx` — staged reveals per point.
- `src/components/rise/RiseReveal.tsx` — JS-gated hidden state, delay prop, mobile-subtle variant.
- `src/pages/rise/RisePage.tsx` — sets the `rise-js` wrapper class on mount.

Verification: 390px and desktop browser pass, header CTA scroll, footer links resolving, and a JavaScript-disabled load confirming every section is readable. Report will list files changed and the logo file used.
