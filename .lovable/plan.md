
# Aileen Gutierrez — Referral Partner Recruitment Page

A standalone B2B landing page for Aileen to share with real estate pros, CPAs, attorneys, and financial advisors she meets through NAHREP and other networks. Sister page to the existing client referral page at `/aileen`.

## Route & files

- **Route:** `/aileen/partners` (also accepts `?ref=Source` to track lead origin, e.g. `?ref=NAHREP-Mixer`)
- **New page:** `src/pages/AileenPartnerProgram.tsx`
- **Register route** in `src/App.tsx` and add `/aileen/partners` to the `standalonePages` array.
- **Reuses:** `aileen-gutierrez.jpg` (already in `src/assets/advisors/`), TFA logo, existing palette pattern from `/aileen` for consistency.

## Page sections (top to bottom)

1. **Minimal header** — TFA wordmark left; gold "Partner Program" pill right (peer-to-peer signal instead of bilingual badge — different audience).
2. **Hero**
   - Eyebrow: "Referral Partner Program"
   - Headline: "Your Clients Already Trust You. Now Get Paid for It."
   - Sub: "Join The Financial Architects Referral Partner Program — earn referral fees on mortgage protection and living trusts without changing anything about how you do business."
   - Primary CTA: "Become a Partner" (smooth-scrolls to form anchor)
   - Secondary text link: "How it works ↓"
   - Background: navy gradient with subtle gold glow accents (premium feel — different from the warm client page).
3. **What's In It For You** — 3-column value grid with gold-circle icons:
   - Earn Referral Fees (DollarSign / Handshake)
   - Higher Comp If Licensed (TrendingUp)
   - Get Paid on Living Trusts (ShieldCheck / FileText)
4. **How It Actually Works** — 4-step horizontal flow with numbered gold circles connected by a thin gold line on desktop, stacked vertically on mobile. Copy verbatim from brief (Sign Up → Refer → We Handle Everything → Get Paid).
5. **What Makes This Different** — Two-column checklist (gold Check icons, navy text) with the 5 bullet items from the brief.
6. **Credibility strip** — Single full-width band on warm gray:
   - Lead line: "The Financial Architects partners with top-rated carriers to protect families across California."
   - 3 small stat chips: "50+ referral partners and growing" · "Bilingual: English & Spanish" · "Backed by The Financial Architects"
   - (No fabricated testimonial — leave room for one later by including a structured `<blockquote>` slot commented for future use.)
7. **Meet Your Partner — About Aileen** — Same layout as `/aileen` (rounded gold-ringed headshot + first-person quote from brief). Reinforces it's a personal partnership.
8. **Partner Sign-Up Form** (anchor target `#partner-form`):
   - Fields: Full Name, Business Name, Industry (Select), Phone, Email, Currently Life-Licensed? (Select: Yes / No / Interested in getting licensed), How did you hear about this program? (text, optional).
   - Validation: zod schema.
   - Bot protection: `useHoneypot` hook.
   - Submission: `submitForm` from `src/lib/formSubmit.ts` with
     - `form_name: "aileen-partner-program"`
     - `advisor_email: "aileen@tfainsuranceadvisors.com"`
     - `advisor_slug: "aileen-gutierrez"`
     - `company_name: <business name>`
     - `interest_category: "Referral Partner"`
     - `tags: ["partner-recruitment", <industry>, <licensed status>]`
     - `notes`: industry + licensed status + how-heard + `?ref=` source.
   - Submit button: "Let's Partner Up"
   - On success: inline confirmation panel — "You're in! Aileen will reach out within 24 hours to get you set up with your own referral portal." Includes Aileen's direct phone/email for impatient partners.
9. **Footer** (page-local)
   - TFA wordmark + tagline: "Protecting Families. Building Legacies. Empowering Partners."
   - Aileen's phone, email, Covina address
   - Disclaimer (verbatim): "The Financial Architects is an independent financial services firm. Referral compensation varies by product and licensing status. All partner information is confidential."

## Design notes

- Inverts the client-page palette to feel premium B2B: hero uses navy `#1B2A4A` background with white text and gold `#C8A951` accents; body sections use white with navy text and warm gray `#F4F1EA` section breaks. Gold check/circle accents throughout. Inline CSS palette object (same pattern as `/aileen`) to keep tokens isolated.
- Slightly tighter spacing, more confident typography weights than the client page (font-bold for hero, font-semibold for section headings).
- Subtle hover lift on value cards and the form button. No heavy animation.
- All icons: lucide-react (already in project).

## SEO

- Title: "Referral Partner Program | Aileen Gutierrez · TFA"
- Description: "Real estate pros, CPAs, attorneys, and advisors: refer clients to Aileen Gutierrez at The Financial Architects and earn on mortgage protection and living trusts."
- Canonical: `https://tfawealthplanning.com/aileen/partners`
- `robots: index,follow`

## Pipedrive routing

- Standard `pipedrive-submit` edge function; routes to Aileen's Leads Inbox via her advisor email (already in `src/data/advisors.ts`).
- `interest_category: "Referral Partner"` keeps these distinguishable from client leads in Pipedrive.

## Out of scope

- Building an actual partner portal, real-time tracking dashboard, or co-branded landing-page generator (those are referenced as features in the copy but are operational systems Aileen runs separately — not built here).
- A separate partner-only Pipedrive pipeline (using Leads Inbox + tag/category is sufficient, per project's Leads-Inbox-only rule).
- Real testimonials or partner logos (none provided yet — placeholder copy only).

## QA before handoff

- Render `/aileen/partners` and `/aileen/partners?ref=NAHREP` — `ref` value attached to submission notes.
- Submit a test lead, confirm it lands in `form_submissions` with `form_type: "aileen-partner-program"` and routes to Aileen.
- Mobile viewport (375px): hero stacks, 3-column value grid → 1 column, 4-step flow → vertical, form is thumb-friendly.
- Confirm no global Header/Footer/FloatingCTA leak.
