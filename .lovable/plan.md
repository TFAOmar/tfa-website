# Kristin Martin Landing Page

A standalone, shareable page (QR-code friendly) where someone can meet Kristin, choose a path, and submit a short request.

Tapping a service card sets the path to Clarity, checks that interest, and scrolls to the form. Tag values are prefixed so they never collide with existing Pipedrive labels: `path:join` / `path:clarity` and `interest:<slug>`. The Path and Interests rows appear in the notification email only when those values are present, so no other form's email changes.

## Page address
- `/kristin` — the canonical page
- `/advisors/kristin-martin/connect` — redirects to `/kristin`
- Sitemap lists `/kristin` only

## Page order (mobile-first for QR scans)

1. **Hero** — modeled on her business card: her full-length photo on white, name with a gold accent, "Director of Agents & Operations", CA Lic# 4334059, and the full address 13890 Peyton Dr. #A, Chino Hills, CA 91709. Beneath it a navy band with contact chips.

2. **Two path buttons** — "Join / Learn the Business" and "Free Client Clarity Application". Choosing one scrolls to the form and switches which fields show.

3. **Form**
   - *Clarity application path*: name, phone, email, check-all-that-apply interest topics, preferred follow-up method (Email or Text), preferred date and time-of-day, optional message.
   - *Join / learn the business path*: name, phone, email, preferred follow-up method, optional message only — no interest topics, no preferred date/time.
   - SMS consent checkbox is optional when Email is chosen and **required** when Text is chosen; if it's unchecked the submit button explains why.
   - "Free consultation. No obligations." sits under the form.

4. **Services available for you** — illustrated cards in the same card layout/spacing style as the reference screenshot (its wording is not reused). Each card is tappable and pre-checks the matching interest in the form. Topics: living trust & estate planning, mortgage protection, income protection, how a 401k/403b/Roth IRA works, tax-free retirement plans, index annuities, children's trust funds, life insurance, living benefits.
   - Living trust card is worded as coordinating with the client's own attorney — never drafting or providing legal documents.
   - Retirement and 401k/Roth cards use "education" and "strategies" — no advice or guarantees.

5. **Contact block** — one Call button, (949) 312-8331, and one Text button, (626) 824-4939. Office (888) 305-5396 and kristin@tfainsuranceadvisors.com appear as plain text below.

6. **Compliance footer** — privacy policy link, the same TCPA/consent disclosure used on the other forms, and CA Lic# 4334059. Only the global navigation, floating CTA, and full site footer are hidden.

## Schema findings (checked before planning the form)

There is no dedicated "path" or "interests" column on submissions. What does exist and will be used:
- `tags` (string array) — stores the chosen path plus each selected interest topic; also becomes Pipedrive labels.
- `interest_category` (text) — comma-joined interest list, already used this way by the Book Consultation form.
- `form_submissions.form_data` (JSON) — keeps a full copy of the submission, including path, interests, preferred date/time, and follow-up method.

Nothing is crammed into the message body. Kristin's team notification email currently shows only name, email, phone, message/notes, assigned advisor, and source URL, so two rows — **Path** and **Interests** — will be added to that email template so both are visible at a glance.

## Where submissions go
Through the existing lead pipeline, routed to kristin@tfainsuranceadvisors.com and tagged with her advisor slug, so her leads land with the rest.

## Technical notes
- New `src/pages/KristinMartinConnect.tsx`; `/kristin` route in `src/App.tsx` plus `/advisors/kristin-martin/connect` as a `<Navigate replace>`; `/kristin` added to `standalonePages`.
- Photo uploaded via `lovable-assets` to `src/assets/advisors/kristin-martin-full.jpg.asset.json`; her existing headshot stays in the advisor directory.
- Form uses `zod` (with a refinement making SMS consent required when follow-up = Text), `useHoneypot`, `SmsConsentCheckbox`, and `submitForm` with `form_name: "kristin-martin-connect"`, `advisor_slug: "kristin-martin"`, `advisor_email: "kristin@tfainsuranceadvisors.com"`.
- Edge function `pipedrive-submit`: add Path and Interests rows to the team notification HTML.
- SEO via `SEOHead` + Person JSON-LD; navy/gold design tokens. The two reference screenshots are styling inspiration only and are not embedded.
