# /zuniga — TFA × Zuniga Professional Services landing page

A standalone, mobile-first page for clients scanning a QR code in the ZPS office. English only, no site header or footer, hidden from search engines.

## Page flow

1. **Co-branded header** — TFA logo left, ZPS logo right, a thin purple divider between them. Under it: "Financial planning and insurance services for Zuniga Professional Services clients."
2. **Intro** — a short headline and one supporting sentence. Headline and form render immediately; no animation gating.
3. **Lead form** — sits directly under the intro, reachable in one scroll on a phone.
4. **How we can help** — the TFA services list in a clean two-column list (no card grid).
5. **Advisors** — two cards side by side on desktop, stacked on mobile.
6. **Compliance footer** — same wording and links as /kristin.

## Form

- Full name (required)
- Mobile phone (required, formats as (555) 555-5555 while typing)
- Email (optional)
- "I'm interested in" — chips from the services list plus "Not sure yet"; at least one required
- Preferred advisor — No preference (default) / Richard Morales / Mariah Lorenzen
- Preferred follow-up — Call or Text; choosing Text shows the SMS consent checkbox and makes it required, with the exact /kristin consent wording
- Hidden: source "zuniga", the `src` query value (QR uses `?src=qr`), page path, timestamp
- Button: "Request a Free Consultation", disabled while sending, inline errors

On success the form is replaced by: "Thanks, [first name] — Richard or Mariah will reach out within one business day." with tap-to-call buttons for both.

## Services listed

Income Planning, Investment Management, Living Trusts, Estate & Legacy Planning, Tax Planning, Health Care Planning, Annuities, 401(k) Rollovers, Insurance, Group Retirement Plans, Business Insurance — the same list the main site shows, with Living Trusts added.

## Advisors (kept in a small editable list)

- Richard Morales — Advisor — CA Lic# 0D94958 — (562) 395-2922 — Richardmorales54@gmail.com — uploaded photo
- Mariah Lorenzen — Advisor — CA Lic# 0F93770 — (949) 514-5296 — Mariah@tfainsuranceadvisors.com — uploaded photo

Each card: photo, name, title, license, Call and Email buttons.

## Where submissions go

Through the same lead pipeline /kristin uses. Every submission tags as `zuniga-lead`, `zuniga-qr` when scanned, and `zuniga-<service>` per selection. Both Richard and Mariah are emailed on every submission regardless of preferred advisor, and the email shows the preferred advisor and the selected services. The leads inbox keeps receiving its copy as it does today.

## Look

Predominantly white with TFA navy and gold. ZPS purple appears only as the header divider, the selected chip state, and the submit button. No gradients, no purple panels, no card grid. Headings fade and rise briefly; everything stays visible with animation off or scripts disabled.

## Technical notes

- New files: `src/pages/ZunigaConnect.tsx`, `src/data/zunigaConfig.ts` (advisors + services), `src/assets/zuniga/` asset pointers for the ZPS logo and the two headshots via `lovable-assets`.
- `src/App.tsx`: add the `/zuniga` route and `/zuniga` to `standalonePages` — the only change to that file.
- Form uses `useHoneypot`, `zod` validation, `SmsConsentCheckbox` (imported unchanged), and `submitForm` with `form_name: "zuniga-connect"`, `advisor_slug: "zuniga"`, plus `path_label`/`interests_label` so the preferred advisor and services show in the notification email.
- `supabase/functions/pipedrive-submit/index.ts`: one added branch, matching the existing Escobar/American Way pattern, that sends the notification to both advisor addresses when `form_name === "zuniga-connect"`. No other form's behavior changes.
- `SEOHead` with `noIndex`; not added to the sitemap.
- QA on a 390px viewport: keyboard navigation, contrast, and reduced motion.
- End-to-end test submission named "TEST — Zuniga page check, please ignore" so it is obvious in Richard's and Mariah's inboxes; after verifying the tags and both notifications, the test record is deleted from both Supabase and Pipedrive.
- After the notification change is deployed, confirm the deployment reported no errors and that one other existing form still submits and notifies normally. Both results reported back.
