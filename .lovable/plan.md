# /rise motion pass

Rise-only files. No global CSS, shared components, or packages.

## 1. Hero secondary CTA (already in place)

The hero already shows "Watch the 5-minute video" as a muted text link with a play glyph, hover underline, 44px tap height, scrolling to the video. Keep as is; "See where you stand" stays the only button.

## 2. Hero entrance sequence (new)

The hero animates once on load, beginning at first paint. Staggered order, each step starting 120ms after the previous, each ~500ms ease-out:

```text
0ms    partnership line      fade in
120ms  accent rule           draws left to right
240ms  headline              rises 24px + fades in
360ms  supporting line       fade in
480ms  CTA row               fade in
```

Total under one second. Header stays static.

- Hidden starting states apply only inside the `rise-js` wrapper class, so with scripts off the hero is fully visible.
- `prefers-reduced-motion` shows everything immediately with no transition.
- No scroll observer for the hero — it plays on mount.

## 3. Video thumbnail (already in place)

Edge-to-edge 16:9 cover thumbnail, `maxresdefault.jpg` with `hqdefault.jpg` fallback, bottom-left accent pill reading "Play · 5 min", whole thumbnail tappable, click-to-load unchanged.

## 4. Video entrance color pass (replaces the single wipe)

When the video block first enters the viewport, three layers wipe left to right using `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)`:

```text
0ms    solid navy block      ~500ms wipe
120ms  solid accent block    ~500ms wipe
240ms  thumbnail             ~500ms wipe
then   pill fades + scales 0.9 -> 1.0 over 300ms
```

- Fires once; the observer disconnects after firing.
- Below 768px each wipe shortens to ~350ms.
- Reduced motion: thumbnail and pill shown immediately, no wipe layers.
- Hidden/clipped states apply only inside `rise-js`.

## 5. Section reveals

Unchanged: fade-and-rise on questionnaire, summary/contact, advisor cards, footer; "Why now" points staged. Whole blocks only, never per word.

## Technical notes

Files to change:

- `src/components/rise/RiseHero.tsx` — mount-triggered staged entrance for the five hero elements, `rise-js` gated, reduced-motion safe.
- `src/components/rise/RiseVideo.tsx` — two absolutely positioned solid color layers (navy, `var(--rise-accent)`) above the thumbnail, each with its own clip-path transition and delay; thumbnail clip-path retimed; pill delay follows the thumbnail wipe; mobile durations shortened.

No other files change. Verification at 390px and desktop: hero sequence on load, video color pass on first scroll into view, no re-trigger on scroll up, reduced-motion pass.
