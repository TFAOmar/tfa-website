# /zuniga — visual rebuild

Rebuild the look of the Zuniga page to the polish level of /rise, with its own distinct layout. All form behavior stays exactly as it is today: same field names, validation, submission, tags, consent logic, routing, and backend function. Only the presentation changes.

## New page structure

**Header** — white, subtle bottom border. Left: TFA logo, a small "×", the transparent ZPS logo, matched to the same optical height (about 34px on desktop, 26px on mobile). Right: a navy pill "Get started" that smooth-scrolls to the form. The old subtitle line under the logos is removed.

**Hero** — split, full width, about 80vh on desktop.
- Left: solid TFA navy panel. Gold eyebrow "For Zuniga Professional Services clients"; headline "Your taxes are in good hands. Now let's plan what comes next."; supporting line naming Richard and Mariah with "Free, no obligation."; gold button "Request a Free Consultation" scrolling to the form; white text link "Or call us directly ↓" scrolling to the call band.
- Right: a new warm, photorealistic lifestyle image — a couple in their 40s–50s at a kitchen table in a Southern California home reviewing paperwork with a laptop, late-afternoon light, no text or logos. Cover-cropped.
- Signature element: a white "Your advisors" card overlapping the bottom seam of the two halves, with both headshots as 72px squares cropped tight to head and shoulders on a matching light neutral background, names, and "Advisor · CA Lic# …".
- Mobile order: navy text panel, then the image at ~220px tall, then the advisor card overlapping the image bottom.

**What we help with** — warm light-gray band, three grouped columns with small line icons, names only, no descriptions: Retirement & Income; Protection; Estate & Tax. Single column on mobile. The old 11-item list with descriptions is removed.

**Form section** (scroll anchor) — white. Heading "Tell us what you'd like to talk about." with the subline about a one-business-day reply. Form in a centered card about 520px wide: name and mobile first, email below; smaller, denser interest chips; Call/Text as a segmented control; navy full-width submit button; "Free consultation. No obligations." kept underneath. Success state keeps both tap-to-call buttons.

**Closing call band** — navy, "Prefer to talk now?" with the two call buttons side by side (stacked on mobile). Existing compliance footer unchanged below it.

**Removed** — the subtitle under the logos, the large advisor-card section at the bottom, the descriptive services list, and every purple fill. ZPS purple survives only inside its own logo.

## Type, color, motion

TFA navy, white, warm gray, muted gold. No gradients. Hero headline ~52px desktop / ~32px mobile with tight leading. Brief fade-and-rise on the hero headline and advisor card only; everything is visible by default, with reduced motion, and if scripts do not run.

## Technical notes

- Only `src/pages/ZunigaConnect.tsx` is restructured. `src/data/zunigaConfig.ts` gains a service-group mapping and drops nothing the form relies on; `ZPS_PURPLE` is no longer used for fills.
- Form state, zod schema, `useHoneypot`, `submitForm` payload (`form_name: "zuniga-connect"`, advisor slug, tags, `path_label`/`interests_label`, sms consent version), `?src` capture, and `SmsConsentCheckbox` are carried over verbatim — markup only is reworked.
- No changes to `src/App.tsx`, `supabase/functions/pipedrive-submit`, or any shared component.
- New hero image generated into `src/assets/zuniga/` and imported directly.
- Headshots: tight square crops with a consistent light neutral backdrop so both read as one set; done as new image assets under `src/assets/zuniga/` so the originals stay untouched.
- A small local reveal helper inside the page (same pattern as /rise: hidden state applied only once the script confirms it runs).
- Smooth scrolling via element refs with `scrollIntoView`, honoring reduced motion.

## QA

Screenshots at 390px and 1440px, keyboard navigation through header, hero buttons, chips, segmented control and submit, contrast checks on navy/gold/white, reduced-motion pass, and a confirmation that the form still submits with the same payload as before.
