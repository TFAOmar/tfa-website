# Rise page: deeper warm tones + split video reveal triggers

Two scoped adjustments to /rise. Rise-only files, nothing global or shared.

## 1. Deeper background tones

- Ivory surface becomes `#F2ECE0` (header, hero, questionnaire, advisors).
- Sand surface becomes `#E6DDCD` (video section, "Why now", footer).
- Cards stay white with the existing hairline border and soft shadow.
- Muted text: at the current setting it lands at 5.16:1 on the new ivory but exactly 4.50:1 on the new sand — too close to the line. It will be darkened one step so both tones clear the threshold comfortably (5.56:1 ivory, 4.85:1 sand). Navy headings and body text unchanged.

## 2. Split the video section reveal

- The section heading and intro line get their own observer that fires when 20% of the section is in view, then fade in and rise as they do now.
- The video block keeps its own separate observer at 35%, so it still rises into frame after the heading has appeared.
- Both observers fire once and disconnect.
- Reduced-motion behaviour and the visible-by-default rule (hidden states only inside `rise-js`) are unchanged.

## Technical notes

- `src/config/rise.config.ts`: update `bgColor`, `bgAltColor`, and `mutedTextHsl` (215 15% 38%).
- `src/components/rise/RiseVideo.tsx`: add a second ref/observer pair for the heading block at threshold 0.20; the existing block observer stays at 0.35 on its static wrapper. Heading transition no longer keys off the video block's state.
- No other files change; no shared components, tokens, or packages touched.
