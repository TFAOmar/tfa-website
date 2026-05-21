
# Aileen Gutierrez Referral Landing Page

A single-page, standalone landing page designed for real estate partners to share with their clients. Warm, personal, referral-driven tone — not a corporate insurance pitch.

## Route & files

- **Route:** `/aileen` (also accept `?ref=PartnerName` for pre-filling "Referred By")
- **New page:** `src/pages/AileenGutierrezReferral.tsx`
- **Register route** in `src/App.tsx` and add `/aileen` to the `standalonePages` array so global Header/Footer/FloatingCTA are excluded (per project convention).
- **Add Aileen to** `src/data/advisors.ts` (so existing form/notification/Pipedrive routing picks her up by email). Fields:
  - name: Aileen Gutierrez
  - title: Financial Strategist
  - email: aileen@tfainsuranceadvisors.com
  - phone (mobile): (626) 643-0816
  - location: 965 N. Grand Ave, Covina, CA 91724
  - bilingual: true
  - license: CA Lic #0197662
- **Assets (copy from uploads):**
  - `user-uploads://Aileen_Guttierez.jpg` → `src/assets/advisors/aileen-gutierrez.jpg` (clean headshot for About section + small badge)
  - `user-uploads://email_signature_1_27_25.png` → not used on page (reference only)

## Page sections (top to bottom)

1. **Minimal header** — small TFA wordmark left, "Bilingual • Bilingüe" gold badge right. No nav.
2. **Hero**
   - Headline: "You Were Referred by Someone Who Cares About You"
   - Sub: "Let's make sure your family and home are protected — it only takes a minute to get started."
   - Background: soft warm-white with a subtle lifestyle image overlay (family/home). Use a tasteful Unsplash-style placeholder or a soft gradient if no asset is provided — palette-tinted, not loud.
   - If a referral name is in `?ref=`, show a small chip: "Referred by **{name}**".
3. **Two-path selector** — two large tap-friendly cards side-by-side (stacked on mobile):
   - **Mortgage Protection** — house+shield icon (lucide `HomeIcon` + `Shield`). Copy + "Protect My Home" CTA.
   - **Living Trust** — document+heart/users icon. Copy + "Set Up My Trust" CTA.
   - Tapping a card smooth-scrolls to the form and sets the `interest` state (drives the form's hidden `interest_category` field + the submit headline).
4. **Lead form** (appears below; visible by default once a card is tapped, smooth-scrolled into view):
   - Fields: First Name, Last Name, Phone, Email, Referred By (prefilled from `?ref=`), Optional Message / Preferred Callback Time.
   - Submit: "Get My Free Consultation"
   - Validation: zod schema (per project security convention).
   - Bot protection: `useHoneypot` hook (project rule).
   - Submission: `submitForm` from `src/lib/formSubmit.ts` with `advisor_email: "aileen@tfainsuranceadvisors.com"`, `form_name: "aileen-referral-landing"`, `interest_category: "Mortgage Protection" | "Living Trust"`, `tags: ["referral-partner", interest]`.
   - On success: inline confirmation card ("Thank you — Aileen will reach out shortly") instead of redirecting away. Keeps the warm, personal feel.
5. **Trust strip** — 3 items with check icons:
   - "No cost to chat — just a conversation"
   - "Bilingual: English & Spanish"
   - "Your info stays private, always"
6. **About Aileen** — left: headshot in soft rounded frame with gold ring; right: first-person quote (copy from brief) and a signature line "— Aileen Gutierrez, The Financial Architects". Below quote: small tel: + mailto: links.
7. **Footer (page-local, no global footer)**
   - TFA wordmark + tagline "Protecting Families. Building Legacies."
   - Aileen's phone | email | Covina address
   - Disclaimer: "The Financial Architects is an independent financial services firm. All information submitted is confidential."

## Design system

- Use existing semantic tokens (navy, gold, warm-white background, soft gray). All HSL via Tailwind tokens — no hard-coded hex in JSX. If the warm-white `#FDFBF7` and the slightly different navy `#1B2A4A` shades aren't already in `index.css`, add page-scoped CSS variables (`--aileen-bg`, `--aileen-navy`, `--aileen-gold`, `--aileen-trust-green`) in `index.css` and reference via Tailwind arbitrary values or a small `.aileen-*` class set. Keep tokens isolated so they don't affect the rest of the site.
- Typography: existing Inter (project default). Hero headline in a slightly larger serif-feeling weight via tracking/size only (no new font install needed).
- Buttons: existing `Button` component with `variant="default"` (navy) and a gold accent variant via className override using tokens.
- Subtle motion: fade-in on card tap → form reveal. Use existing Tailwind transitions; no new deps.

## SEO

- `<Helmet>`:
  - Title: "Aileen Gutierrez | Mortgage Protection & Living Trusts | TFA"
  - Description: "Referred to Aileen Gutierrez? Get a free, no-pressure consultation on mortgage protection or a living trust. Bilingual. Serving California families."
  - Canonical: `https://tfawealthplanning.com/aileen`
  - `<meta name="robots" content="index,follow">`

## Routing integration details

- Pipedrive: form submission uses standard `pipedrive-submit` edge function. Because Aileen will exist in `advisors.ts` with her TFA email, leads route to her in the Leads Inbox automatically (matches project's "Leads Inbox only" rule and email-based routing).
- Email notifications go to `aileen@tfainsuranceadvisors.com` via existing form notification path (no new edge function).

## Out of scope (will not do unless asked)

- Building separate Mortgage Protection or Living Trust deep-dive pages.
- Wiring Aileen into the public `/advisors` directory grid (this page is standalone for referral sharing only).
- Adding a scheduling/calendar link (Aileen hasn't provided one).
- Creating a full advisor profile page like other advisors.

## QA before handoff

- Test `/aileen` and `/aileen?ref=John%20Smith` — ref chip + prefilled field both render.
- Submit a test lead, verify it lands as a Leads Inbox lead routed to Aileen's email (or, if she isn't yet a Pipedrive user, the fallback default-routing behavior is acceptable — flag in note).
- Mobile viewport (375px): cards stack, form is thumb-friendly, headshot scales.
- Confirm no global Header/Footer/FloatingCTA leak onto the page.
