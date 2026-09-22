# Rise page: brand, hero photo, dark video band, real advisors

Scope: Rise-only files plus new Rise asset pointers. No global CSS, shared components, or dependency changes.

## 1. Rise logo
- Upload `rise-logo-navy.png` as a Rise asset pointer and reference it from `rise.config.ts` as `riseLogoSrc`, with an empty `riseLogoLight` slot for a future light variant.
- Header and footer swap the "RISE" text placeholder for the image, alt "Rise Real Estate", sized to the same visual height as the TFA logo (40px mobile / 48px desktop lockup). Footer picks the light variant automatically when one is set.

## 2. Rise gold accent
- `accent` becomes `#CBB26B` (hero rule, questionnaire progress, "Why now" rule, selected outlines).
- `accentStrong` starts at `#7A6528` for every white-text surface (buttons, header CTA, play pill, submit). Measured white-on-`#7A6528` is about 5.3:1, so it passes; the exact measured value is reported after the change.

## 3. Hero with photograph
- The attached hero PNG is converted to JPG (quality 82, max width 2400px), uploaded as a Rise asset, and stored in config as `heroImage`.
- Hero becomes full-width: image `object-fit: cover`, focal point right of center, with a left-to-right overlay from `rgba(17,24,39,0.78)` to `rgba(17,24,39,0.15)`.
- Text turns ivory; partnership line, headline, supporting line, and CTA row keep their order and current staged entrance.
- Minimum height 88vh desktop / 80vh mobile. On mobile the focal point shifts to keep the house visible and the overlay flattens to `rgba(17,24,39,0.7)` across the full width.
- Headline contrast on the overlay is measured and reported (target >= 4.5:1).

## 4. Dark video band
- Video section background becomes `#111827`; heading ivory, intro a slightly muted ivory checked at >= 4.5:1; play pill uses `accentStrong`. The rise-into-frame entrance is untouched.

## 5. Advisors
- Joshua Patrick — Estate Planning Specialist, Rise Real Estate, (949) 377-7731 call and text, Josh@theFPgroup.com, uploaded headshot.
- Mackenzie Alexander — Financial Strategist, The Financial Architects, (714) 292-5488 call and text, MAlexander@tfainsuranceadvisors.com, uploaded headshot.
- Headshots render `object-fit: cover` in the existing round slot, face-focused; initials fallback stays for empty photos.
- Headshot mapping confirmed: `ChatGPT_Image_...png` is Joshua, `Mackenzie_-_Large_File_Size.jpg` is Mackenzie.

## 6. Names, bios, companies
- Every "Makenzie" across Rise files becomes "Mackenzie", including the contact-step button and summary/follow-up copy.
- Company shown under each title.
- Config gains `shortBio` and `fullBio` per advisor. The card shows `shortBio` with a "More about Joshua" / "More about Mackenzie" text toggle that expands `fullBio` inline (accessible button, aria-expanded). Supplied bio text used verbatim.
- Email addresses stored in config only — not displayed or linked on the cards. Call and Text remain the only two actions.

## 7. Prior review fixes
Already in place and kept: `accentStrong` on white-text surfaces, "Just me" exclusive selection, hidden-branch answers pruned from state, header CTA at 44px.

## Technical notes
Files expected to change: `src/config/rise.config.ts`, `src/components/rise/RiseHeader.tsx`, `RiseFooter.tsx`, `RiseHero.tsx`, `RiseVideo.tsx`, `RiseAdvisors.tsx`, `RiseSummaryContact.tsx`, `src/pages/rise/RisePage.tsx` (new CSS variables for hero/video surfaces), plus new `.asset.json` pointers under `src/assets/rise/`.

## Verification
At 390px and desktop: logo lockup legible, hero headline readable over the overlay, dark video band renders, advisor cards show real names, titles, companies, and bio toggle. Contrast values reported for `accentStrong`, hero headline, and video intro text.
