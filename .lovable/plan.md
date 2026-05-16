## Diagnosis — Ruben Davis Life Insurance Flow

### What I found in the codebase

**Broken link `https://tfawealthplanning.com/davis-life-application/`**
- This path does not exist in `src/App.tsx`. It's a legacy URL (probably from the old WordPress site).
- The correct, working URL for Ruben's flow is: `https://tfawealthplanning.com/advisors/ruben-davis/life-insurance`
- His landing page (`AdvisorRubenDavis.tsx`) already links to that correct path.

**"Goes to main office instead of me"**
- When the application is opened via `/advisors/ruben-davis/life-insurance`, the wizard *does* pick up Ruben's email (`ruben@tfainsuranceadvisors.com`) from `src/data/advisors.ts` and submissions tag him as the advisor.
- However, the legacy `/davis-life-application/` link has no advisor context, so any submissions made through it default to the main inbox (Manny / Leads inbox fallback in `pipedrive-submit`).
- Fix: add an in-app redirect from `/davis-life-application` → `/advisors/ruben-davis/life-insurance` so the old corporate-site link resolves correctly and carries advisor routing.

**No confirmation emails to agent / client / beneficiary**
- The `send-life-insurance-notification` edge function currently sends:
  - Admin notification (to `clients@tfainsuranceadvisors.com`)
  - Advisor notification (to `advisor_email` on the application)
- It does **not** send a client confirmation, and never a beneficiary email.
- For Ruben specifically, his test likely succeeded technically but he didn't see anything because (a) no client confirmation is implemented, and (b) the advisor email was missing if he tested via the broken legacy URL.
- Fix: (1) ensure advisor email is always attached via the redirect above, (2) add a client confirmation email to the function, (3) confirm with Ruben whether a beneficiary email is actually desired (uncommon and a privacy concern — recommend skipping).

**Calendar integration**
- `AdvisorRubenDavis.tsx` renders `<ScheduleModal ... />` **without** a `schedulingLink` prop. The modal collects contact info and pushes a lead to Pipedrive, but never opens an actual calendar.
- His profile in `src/data/advisors.ts` has no `schedulingLink` field.
- Fix: add Ruben's Calendly (or other) booking URL to his static advisor entry and pass it to `ScheduleModal`. Once set, "Book a Consultation" will open his calendar in a new tab after the form submits.

**"Personal Message" video placeholder (ThankYou page)**
- `src/pages/ThankYou.tsx` lines 80–90 render a static Play-button placeholder with no `<video>` or embed wired up. There is no per-advisor video system.
- Fix: either (a) hide the section until real video URLs exist, or (b) add a `videoUrl` field on the advisor record and conditionally render a YouTube/Vimeo embed when present. Recommended short-term: hide the section to avoid confusion.

**"5-Step Financial Preparation Guide" / "Download Free Guide" links**
- `ThankYou.tsx` lines 142–171: the Download button has no `href` / `onClick` — it's a dead button. No PDF exists in the repo.
- Fix: either hide the section, or upload a PDF (e.g. `/public/guides/5-step-financial-preparation.pdf`) and wire the button to it.

**Contact info on Thank You + Life Insurance app shell**
- `ThankYou.tsx` and `LifeInsuranceApplication.tsx` hard-code the corporate number (888) 350-5396 and `info@tfainsuranceadvisors.com`. These pages don't know which advisor the visitor came from.
- Fix: pass advisor context through (URL state / query param) and show advisor-specific phone + email when present, falling back to corporate.

**Lead routing**
- `pipedrive-submit` routes by `advisor_slug` / `advisor_email`. Confirmed Ruben's static record has `email: "ruben@tfainsuranceadvisors.com"` and `landingPage: "/advisors/ruben-davis"`. With the redirect in place, leads will land on him in Pipedrive's Leads Inbox.
- Also confirm in Pipedrive that `ruben@tfainsuranceadvisors.com` is mapped to a Pipedrive user owner (or set `pipedrive_user_id` on his future dynamic record). Otherwise leads route to the default Leads Inbox owner.

---

## Plan

### 1. Fix the broken legacy URL
- In `src/App.tsx`, add a redirect route:
  - `/davis-life-application` and `/davis-life-application/*` → `<Navigate to="/advisors/ruben-davis/life-insurance" replace />`
- Same pattern can be applied later for any other "/{lastname}-life-application/" legacy URLs if they exist.

### 2. Add Ruben's calendar link
- Add a `schedulingLink: "<RUBEN_CALENDLY_URL>"` field to his entry in `src/data/advisors.ts`.
- In `AdvisorRubenDavis.tsx`, pass `schedulingLink={advisor.schedulingLink}` (or hard-code) to `<ScheduleModal />` and `<ContactModal />` where relevant.
- *Needs from Ruben*: his actual booking URL (Calendly, Acuity, etc.).

### 3. Send client confirmation email after life insurance submission
- Update `supabase/functions/send-life-insurance-notification/index.ts` to also send a branded confirmation to `applicant_email` (subject: "We received your life insurance application", body: next steps + advisor contact if present).
- Skip the beneficiary email (privacy / consent issues) unless Ruben confirms he wants it.

### 4. Clean up the Thank You page
- Hide the "Personal Message" video card and the "5-Step Financial Preparation Guide" card by default.
- Add `videoUrl` and `preparationGuideUrl` optional fields the team can populate later (or per-advisor in the future).
- Wire the contact info at the bottom to use advisor phone/email when an `advisor` query param is present, falling back to the corporate values.

### 5. Advisor-aware contact info on the application shell
- In `LifeInsuranceApplication.tsx`, when `advisor` is loaded, surface the advisor's phone (if available) and email instead of the generic 888 number / `info@`. Keep corporate fallback when no advisor is known.

### 6. Verify Pipedrive owner mapping for Ruben
- *Action item (no code)*: confirm in the Pipedrive UI that `ruben@tfainsuranceadvisors.com` maps to a Pipedrive user. If not, either add him as a Pipedrive user or set a manual `pipedrive_owner_id` for him in the routing logic.

### Technical changes (files)
```text
src/App.tsx                                            +redirect routes
src/data/advisors.ts                                   +schedulingLink for ruben-davis
src/pages/AdvisorRubenDavis.tsx                        pass schedulingLink to modals
src/pages/ThankYou.tsx                                 hide placeholders, advisor-aware contact
src/pages/LifeInsuranceApplication.tsx                 advisor-aware contact in header/footer
supabase/functions/send-life-insurance-notification/   add client confirmation email
```

### Open questions for you / Ruben (will block parts of the plan)
1. What is Ruben's preferred booking URL (Calendly / Acuity / Google Calendar appt link)?
2. Should the Thank You page video + preparation-guide sections be hidden, or do you want me to wire them to specific URLs?
3. Do you actually want a beneficiary confirmation email? (Recommended: no.)
4. Should the application's contact phone be Ruben's direct line when accessed via his slug?
