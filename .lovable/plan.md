# Compound Growth Calculator — easier to use and read

## What's in the way today
- Results stay empty until "Calculate" is pressed, so the page looks unfinished on arrival.
- Cards mix dark, glassy and light styles; some text (gray on navy, foreground on dark glass) is hard to read.
- Inputs and results sit far apart on phones; you scroll back and forth after every change.
- Compare mode, timing, and compounding options all show at once, crowding the main inputs.
- The page header is tall, pushing the calculator below the fold.

## Changes
1. **Live results** — numbers and chart update as you type (short debounce). Calculate button removed; "Reset" stays. Results show immediately with the default example.
2. **Clear layout**
   - Desktop: inputs left, results right; results panel stays in view while scrolling inputs.
   - Phone: inputs first, then a compact "Projected balance" bar that sticks to the bottom and jumps to full results when tapped.
3. **Simpler inputs** — four main fields up front (starting amount, monthly contribution, years, annual return), each with a slider plus typed box and a one-line hint. Compounding, contribution timing and Compare go under a "More options" toggle.
4. **Readable results** — one big projected balance, then two smaller tiles: "You put in" and "Growth earned", plus a simple bar showing the split. Chart gets clearer labels, larger tooltip, and colors that read on navy.
5. **Consistent styling** — one card style (solid navy surface, gold accents, white text), all text meeting 4.5:1 contrast. Shorter header so the calculator is visible without scrolling.
6. **Actions grouped** — "Email my results", "Year-by-year table" and "Book a consultation" sit together under the results.

The educational section, disclosures and bottom call-to-action stay as they are, just matched to the new card style.

## Not changing
Math, emailed PDF, compare-mode logic, page address, SEO details.

## Technical details
- Files: `src/components/tools/TFACompoundGrowthCalculator.tsx`, `src/pages/CompoundGrowthCalculator.tsx`.
- `useMemo` recalculation from inputs (validation inline, no blocking); keep `calculateScenario` unchanged.
- Sticky `lg:sticky lg:top-24` results column; mobile fixed bottom summary bar with `scrollIntoView`.
- Replace hardcoded `bg-slate-*`, `text-white/70`, drop-shadow rgba values with semantic tokens (add to index.css if missing).
- Verify at 375px and 1280px with Playwright: no horizontal scroll, values update live, contrast checks.
