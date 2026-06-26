# Omar Sanchez Instagram Landing Page (@4am.omar)

## Goal
Build a high-converting, mobile-first recruiting landing page for Omar Sanchez (COO, TFA) targeting Instagram traffic from @4am.omar. Primary conversion: "Apply to Connect" form submission.

## Route & Files
- **Route:** `/connect-with-omar` (clean, IG-bio friendly, distinct from existing `/advisors/omar-sanchez` profile)
- **New page:** `src/pages/OmarConnect.tsx` — single-file landing page with all sections
- **Register in:** `src/App.tsx` — add route + add to `standalonePages` array (no global Header/Footer/FloatingCTA, per project pattern)
- **Reuse:** Omar's existing headshot at `src/assets/advisors/omar-sanchez.jpg`, `useHoneypot` hook, `submitForm` from `src/lib/formSubmit.ts`

## Page Sections (single page, smooth scroll)
1. Sticky compact header — TFA logo left, "Apply to Connect" button right (scrolls to `#apply`)
2. Hero — IG badge, headline, subheadline, dual CTAs, Omar headshot with floating credentials card
3. "Start Here" intro video — placeholder `<div>` (16:9) ready for embed swap, supporting copy + CTA
4. About Omar — bio + pull-quote card with signature
5. "This May Be a Fit If You Are…" — 6 checkmark cards + 1 warning card (not-for-you)
6. "What We Focus On" — 6 value cards (Sales Training, Leadership, Systems, etc.)
7. "How to Start the Conversation" — 4-step horizontal process + CTA
8. "Standards Over Hype" — 4 bold statement cards on dark band
9. Application form (`#apply`)
10. FAQ — 6 items via shadcn Accordion
11. Footer with disclaimers + placeholder Privacy/Terms/Contact links
12. **Mobile sticky bottom bar** — "Apply to Connect" (hidden on desktop, scrolls to `#apply`)

## Form
All required fields per spec (name, email, phone, city, state, licensed_status, financial_services_status, applicant_type, bilingual_status, interest_reason textarea, best_contact_time, consent checkbox).

- Validation: Zod schema (email format, phone regex, required fields, consent must be true)
- Honeypot via `useHoneypot` hook
- Loading state on submit; inline error messages
- **Backend:** Use existing `submitForm` → `pipedrive-submit` edge function (no new Supabase table) with:
  - `form_name: "omar_connect_recruitment"`
  - `advisor_email: "omar@tfainsuranceadvisors.com"`
  - `interest_category: "career-opportunity"`
  - `tags: ["instagram-4am-omar", "recruitment", <applicant_type>, <licensed_status>]`
  - All recruiting-specific answers packed into `notes` field
  - UTM params auto-captured by existing `extractUTMParams()`
  - `source_url` auto-captured (hidden `source=instagram_4am_omar` added to notes)
- Success state replaces form with thank-you message + "Request Intro Call" button linking to Omar's existing Pipedrive scheduler URL (same one used on his advisor page)

## Design
- Palette: dark navy (#0A1628 / existing `--primary`), black, white, subtle gold (existing `--accent`), blue accent
- Typography: existing Inter; oversized hero headline, generous spacing
- Components: shadcn Card, Button, Input, Textarea, Select, Checkbox, Accordion, Badge
- Mobile-first: single column < md, 2–3 col grids on lg+
- Subtle motion only (fade-in on scroll for section headings); no heavy animations
- Rounded-2xl cards, subtle border + shadow
- All colors via semantic tokens — no hardcoded hex in components

## SEO (via existing `SEOHead` component)
- Title: "Apply to Connect with Omar Sanchez | The Financial Architects"
- Description: per spec
- Canonical: `${siteConfig.url}/connect-with-omar`
- OG title/description per spec
- `noindex` NOT set (user wants discoverable)

## Out of Scope (explicit)
- No new Supabase `tfa_leads` table — using existing `form_submissions` + Pipedrive routing pattern that all other advisor forms use (keeps admin dashboard unified)
- No real video embed — placeholder div with clear swap instructions in a code comment
- No Calendly integration — reuses Omar's existing Pipedrive scheduler link
- No new logo asset — uses existing TFA logo
