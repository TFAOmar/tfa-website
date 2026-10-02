# Deed, Homestead & Notary Request Page

A new page where agents or clients pick the services they need, answer your checklist questions, upload documents, and pay online. Your LDA team gets each paid request by email, ready to work.

## The page: /deed-services (standalone, own TFA header/footer)

**Step 1 — Choose services** (cards, pick one or more)
- Quitclaim / Trust Transfer Deed — $199 per deed (can add more than one property)
- Homestead Declaration — $199 per homestead
- Mobile Notary — "Quoted separately. Your notary sets the fee, including any travel." No charge today.

**Step 2 — Who's filling this out**
- "I'm an agent" (agent name, email, phone; client info entered next) or "I'm the client" (optional: which TFA agent referred you).

**Step 3 — Client & property questions** (from your checklist)
1. Current owner / grantor: full legal name, name exactly as on current deed
2. New owner / grantee: full legal name, how title will be held
3. Property: address, city/state/ZIP, APN
4. Legal description: upload most recent recorded deed (required for deed)
5. Existing recorded deed: recording date, document/instrument no., county
6. Transfer: type (Gift / Sale / Family transfer / Transfer to/from trust / Other), consideration/price if any
7. Mailing: grantee mailing address, return address for recorded document
8. Additional: other owners/interest holders; held in trust, LLC or entity? (if yes, details)
- Homestead-only: confirms the property is the owner's primary residence.
- Repeats per property when more than one deed is ordered.

**Step 4 — Notary scheduling** (only if Notary picked)
- Signer name(s), signing address, preferred dates/times, notes. LDA arranges the notary and sends the quote.

**Step 5 — Documents** — upload recorded deed, trust/entity docs, ID (optional), other.

**Step 6 — Review & pay** — summary, total (e.g. 1 deed + 1 homestead = $398), e-signature line ("I confirm this information is accurate"), checklist disclaimer, SMS consent, then card checkout (same-tab redirect).

**After payment** — confirmation screen with a request number.

## What your LDA team receives
- One email per paid request with every answer, the services and amount paid, and links to the uploaded files, plus a PDF summary. Agent gets a copy.
- Unpaid/abandoned requests are saved but not emailed.

## Questions to settle before building
- The LDA inbox email address (e.g. deeds@tfainsuranceadvisors.com).
- Which fees are refundable if a request can't be processed (shown on the page).

## Technical details
- Payments: reuse the existing Stripe account (already used by Estate Guru checkout). Create a "Deed Preparation" $199 and "Homestead Declaration" $199 price; checkout uses quantities.
- New table `deed_service_requests` (id, services, quantities, form_data jsonb, agent fields, status pending/paid, stripe_session_id, amount, created_at) with GRANTs + RLS: anon insert only, admin read.
- New private storage bucket `deed-documents`; uploads via an edge function that issues signed upload URLs (keyed by client-generated request UUID); LDA email uses time-limited signed links.
- Edge functions: `create-deed-checkout` (validates, rate-limits, saves row, creates Stripe session), `verify-deed-payment` (on success page, marks paid and sends the LDA email + PDF once, idempotent).
- Email uses the existing notification pattern from noreply@tfainsuranceadvisors.com with HTML escaping.
- Honeypot via `useHoneypot`; zod validation client and server.
- Route in App.tsx + standalonePages; noindex until reviewed.
