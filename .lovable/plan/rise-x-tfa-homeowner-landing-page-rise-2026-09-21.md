# Rise x TFA homeowner landing page (/rise)

Rebuild `/rise` to the new specification as a fully isolated, mobile-first page for Rise homeowners. Everything lives in Rise-only files.

Note on the existing state: `/rise` already exists in this project from an earlier concept (an older page, assessment, intake form, and content file). Its route is already registered and already listed as a standalone page, so the router needs no change. The old Rise files will be replaced by the new structure.

## Page structure

1. **Hero** — "You bought the home. Now protect what you're building." One supporting sentence, primary CTA "See where you stand" (scrolls to questionnaire), secondary "Watch the 5-minute video." Partnership sentence stated in words near the top.
2. **Manny's video** — large click-to-load thumbnail facade, youtube-nocookie, no autoplay, one-line reason to watch, tasteful placeholder until the URL is set in config.
3. **Why now** — three plain-language points in an editorial layout (no card grid, no icon circles), using the supplied draft copy.
4. **Guided questionnaire** — one question at a time, progress indicator, back button, smooth transitions, branching (Q1b after either "Yes", Q2b after "Children under 18"). Q2 is multi-select.
5. **Summary, then contact** — "Areas worth a conversation" list built from the stated rules (estate plan always first with adaptive wording; guardianship, decision authority, mortgage protection, life insurance, retirement added conditionally). Contact step sits directly beneath: name, phone, email, preferred contact method, button "Have Joshua or Makenzie reach out." No other form on the page.
6. **Joshua + Makenzie** — photo placeholders, names, titles, two-sentence placeholder bios, a line on who reaches out and when, and direct Call / Text buttons.

**Testimonials** render only when the config array has entries; empty array means the section does not render. No invented quotes.

## Branding

- Standalone minimal Rise header with a RISE | The Financial Architects lockup, hairline divider, equal optical weight, one CTA. Text placeholder for the Rise mark.
- TFA typography and neutrals; Rise contributes one accent color used on the primary CTA, questionnaire progress, and one hero accent.
- `--rise-accent` defined inline on the page wrapper with a placeholder value, read from the config.
- Rise-only footer component with a clearly marked slot for TFA legal and disclosure language.

## Single config file

One Rise config module holds: accent color, logo paths, video URL, advisor names/titles/bios/photos/phones, testimonials array, disclosure text, and `RISE_FORM_MODE`. Topped with the comment `DRAFT COPY — pending compliance review`. Swapping real assets means editing only this file.

## Form handling

- One submit function gated by `RISE_FORM_MODE` (`"mock"` initially): validate, log payload to console, show a realistic success state, and display "Preview — submissions are not sent." on the contact step.
- Payload: contact fields, all answers, the summary items shown, and a silently captured `?ref=` value.
- No connection to any existing TFA handler, Supabase, or external service. Shaped so a GoHighLevel webhook can be dropped in later.

## SEO and motion

- Use the project's existing `SEOHead` component as-is (import only, no edits) with `noIndex`, title "Rise × The Financial Architects | Planning for New Homeowners", a one-sentence description, and canonical `https://tfawealthplanning.com/rise`. No hand-written robots meta effect. The report will confirm the noindex tag does not persist after navigating to another route.
- Restrained motion: subtle fade/translate on section entry, smooth step transitions, `prefers-reduced-motion` respected. No pinned scroll, parallax, or gradient text.

## Technical notes

New files (all Rise-scoped):

- `src/config/rise.config.ts` — the single swappable content/config file.
- `src/pages/rise/RisePage.tsx` — page shell, accent variable, SEOHead usage, section composition.
- `src/components/rise/RiseHeader.tsx`, `RiseHero.tsx`, `RiseVideo.tsx`, `RiseWhyNow.tsx`, `RiseQuestionnaire.tsx`, `RiseSummaryContact.tsx`, `RiseAdvisors.tsx`, `RiseTestimonials.tsx`, `RiseFooter.tsx`.
- `src/lib/rise/questions.ts` (questions + branching), `src/lib/rise/summary.ts` (summary rules), `src/lib/rise/submitRiseLead.ts` (mock/live submit).

Existing files imported unchanged: `SEOHead` and the `useHoneypot` hook.

Existing files touched:

- `src/App.tsx` — only the import line, to point the already-registered `/rise` route at the new page component. The route entry and standalone-page entry already exist and stay as they are.
- Old concept files `src/pages/Rise.tsx`, `src/components/rise/RiseAssessment.tsx`, `src/components/rise/RiseIntakeForm.tsx`, `src/data/riseLandingContent.ts`, `src/lib/rise/submitLead.ts` are removed. An import search confirms the only reference outside the Rise files is the `src/App.tsx` import line above.

No global CSS, Tailwind config, design token, shared header/footer, shared advisor page, form, CRM, Supabase, or dependency changes. Verification at 390px plus desktop, including branching, summary rules, mock submit, and the noindex tag not persisting after navigation.
