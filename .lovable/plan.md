# Kristin Martin Landing Page

A standalone, shareable page (QR-code friendly) where someone can meet Kristin, choose a path, and submit a short request — no site header or footer, just her branding.

## Page address
- `/kristin` (main link)
- Also reachable at `/advisors/kristin-martin/connect`

## What's on the page

1. **Hero** — Kristin's new full-length photo, her name, "Director of Agents & Operations", CA Lic# 4334059, Chino Hills location, and two buttons: "Join / Learn the Business" and "Free Clarity Application".

2. **Services available for you** — short cards covering living trust & estate planning, mortgage protection, income protection, 401k/403b/Roth education, tax-free retirement, index annuities, children's trust funds, life insurance, and living benefits (taken from her paper interest sheet).

3. **Two paths** — choosing one scrolls to the form and tags the submission:
   - *Join / learn the business* — career conversation request.
   - *Free client clarity application* — the checklist version of her printed form: name, phone, email, check-all-that-apply interest topics, and preferred follow-up method (email or text).

4. **Preferred date & time** — every submission includes preferred contact date and a time-of-day choice (morning / afternoon / evening), plus an optional message.

5. **Call & text** — tap-to-call and tap-to-text buttons using her card numbers: direct (949) 312-8331, mobile (626) 824-4939, office (888) 305-5396, and email kristin@tfainsuranceadvisors.com.

6. **Optional SMS consent checkbox** on the form, as on every other form.

## Where submissions go
Through the existing lead pipeline, routed to Kristin's email and tagged with her advisor slug plus the selected path and interest topics, so they appear with her other leads.

## Technical notes
- New `src/pages/KristinMartinConnect.tsx`; routes added in `src/App.tsx` with both paths listed in `standalonePages` so the global header/footer/floating CTA are hidden.
- Photo uploaded via `lovable-assets` to `src/assets/advisors/kristin-martin-full.jpg.asset.json`; her existing headshot stays in the advisor directory.
- Form uses `zod` validation, `useHoneypot`, `SmsConsentCheckbox`, and `submitForm` with `form_name: "kristin-martin-connect"`, `advisor_slug: "kristin-martin"`, `advisor_email: "kristin@tfainsuranceadvisors.com"`.
- SEO via `SEOHead` + Person JSON-LD; sitemap entry for `/kristin`.
- Uses navy/gold design tokens; the two reference screenshots are styling inspiration only, not embedded.

## Needs confirming
- Which number should the "Text" button use — mobile (626) 824-4939?
