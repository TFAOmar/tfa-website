## Goal
Refine `/connect-with-omar` into a polished, executive-feeling Instagram bio link with a single conversion goal: **Apply to Connect with Omar**. Tighten hero clarity, remove fluff, improve mobile UX, and make CTAs unmistakable.

## Scope
- Edit only `src/pages/OmarConnect.tsx` (presentation only).
- No routing, schema, Pipedrive, or backend changes — form submission logic stays identical.

## Hero Rewrite (3-second clarity test)
Replace the current hero copy & layout with a tighter, executive structure:

- **Eyebrow chip:** `OMAR SANCHEZ · COO, THE FINANCIAL ARCHITECTS` (replaces the playful IG badge as the primary identifier; small IG handle moves to a secondary line)
- **H1 (tighter, benefit-led):** "Build a serious career in financial services."
- **Subhead:** "For ambitious professionals interested in financial services, leadership, sales, and advisor growth — apply to start a conversation with Omar Sanchez and the TFA team."
- **Single primary CTA:** large gold "Apply to Connect →" button. Secondary "Watch Intro" demoted to a quiet text-link underneath (not a competing button).
- **Trust strip directly under CTA:** "32 locations · 300+ licensed advisors nationwide · Headquartered in California"
- Portrait: remove the "Replace with Omar headshot" placeholder caption (it ships to production looking unfinished). Keep floating credentials card but tighten padding.

## Single-Goal Tightening (remove/demote)
- Remove the standalone "Watch Omar's Intro" section as a full section. Keep video as a smaller inline block inside About Omar (or remove entirely if it's still a placeholder — recommend removing the section and leaving a clear `{/* TODO: embed video */}` slot in About to avoid shipping a placeholder card).
- Remove the "Standards Over Hype" dark band of slogans — feels generic/hype-adjacent (the very thing the user wants gone).
- Trim "What We Focus On" from 6 cards to **4 most executive** (Sales Training, Leadership Development, Systems & Structure, Agency Growth). Drop Team Culture and Client Education cards.
- Trim "This May Be a Fit If You Are…" from 6 + warning card down to **4 clean fit statements**. Remove the warning/not-for-you card (hype-adjacent).
- Process: keep 4 steps but make them visually quieter (numbered row, no gradients).
- FAQ: keep, but reduce to 4 most important questions (licensed, job offer, income, looking for insurance instead).

## Mobile & Spacing Polish
- Reduce vertical section padding from `py-20`/`py-24` to `py-14 sm:py-20` consistently.
- Hero: stack tighter on mobile, reduce H1 to `text-[34px]` mobile / `text-6xl` desktop, remove the absolute-positioned floating card on mobile (render inline below image) to fix overflow.
- Form: 1-column on mobile, 2-column on `sm+`. Increase input height to `h-12`, larger touch targets, clearer field grouping with subtle dividers and section labels ("About you", "Your background", "Best way to reach you"). Use larger labels and `text-base` on inputs to prevent iOS zoom.
- Sticky mobile bottom bar: make button full-width gold, increase to `h-12`, add safe-area padding.
- Sticky header: replace "TFA" colored square with text wordmark `THE FINANCIAL ARCHITECTS` in small caps for a more executive feel.

## Visual / Executive Polish
- Replace bright accent gradients in hero with a more restrained navy → deep navy with a single subtle gold radial.
- Round corners reduced from `rounded-3xl`/`rounded-2xl` to `rounded-xl` for a tighter, less consumer feel.
- Remove the `blur-2xl` gold halo behind the portrait (too flashy).
- All section eyebrows use the same `text-xs uppercase tracking-[0.2em] text-accent font-semibold` style for consistency.
- CTAs: every "Apply to Connect" button uses the same gold-on-navy style with `ArrowRight` icon, `h-12`, `font-semibold`, `shadow-lg shadow-accent/20` so the action is unmistakable.

## Form Section Improvements
- Add a small heading above the form: "Apply to Connect" with subtitle "Takes about 2 minutes. We review every application personally."
- Group fields into 3 visually-labeled blocks (About you / Background / Contact preference).
- Move consent + submit into a sticky-feeling footer card with the primary CTA full-width on mobile, auto-width on desktop.
- Keep all Zod validation, honeypot, Pipedrive payload, success state, and scheduler link **unchanged**.

## Out of Scope
- No new images, no video embed (leave a clearly-marked slot or remove section entirely per above).
- No SEO/meta changes beyond the existing SEOHead (already correct).
- No design-token changes in `index.css` — reuse existing semantic tokens (`--primary`, `--accent`, `--muted-foreground`).
- No backend, no new routes, no analytics changes.
