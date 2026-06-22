## New Agent Onboarding Application

Replicate the standalone HTML as a real multi-step form on the site. Carrier-agnostic, navy/gold branding to match the bundle (Inter, #1E3A5F header, #E4B548 accent), with the same 15 sections, same field labels, same required-field asterisks, and same legal copy.

### Route & entry points
- New page: `/agent-onboarding-application` (standalone — no global Header/Footer, added to `standalonePages` list).
- Linked from the existing `/onboarding-checklist` "Resources" panel as "New Agent Onboarding Application" and from `/advisors/onboard` page.

### Multi-step wizard (15 steps, mirrors the bundle)
1. Applicant information — Full legal name*, Preferred name, DOB*, SSN*, US citizen/work auth*, Driver's license #, Issuing state
2. Contact information — Residential address*, City*, State*, ZIP*, Mailing address, Mobile*, Alt phone, Email*, Preferred language, Best time to contact
3. Emergency contact — Name, Relationship, Phone, Alt phone
4. Licensing & producer information — NPN*, Resident license state*, Dynamic table of state licenses (state, license #, lines of authority, expiration), Years licensed, # states licensed
5. E&O coverage — Carrier*, Policy #*, Coverage amount, Expiration*, Upload declaration page
6. AML certification & CE — Provider, Date completed, Expiration, CE compliant?, Upload AML certificate
7. Background & compliance disclosure — 8 yes/no questions with conditional explain textareas (felony, license action, termination, investigation, bond refusal, bankruptcy, debit balance, other contracts)
8. Employment & industry history — Dynamic table (company, title, from, to, reason for leaving)
9. Professional references — Dynamic table (name, relationship, company, phone/email; min 3)
10. Sub-firm & upline — Recruited by, Upline/mentor, Sub-firm, Referral source
11. Education & designations — Highest education, School, Designations
12. Commission direct deposit — Bank name, Account type, Routing #, Account #, Name on account, Upload voided check
13. Tax information — Tax classification (Individual/Sole Prop/LLC/S-Corp/C-Corp), Business/entity name, EIN
14. Authorization & background check consent — Exact legal copy from bundle, checkbox "I authorize"
15. Certification & signature — Exact legal copy, typed signature, date (auto), printed name, NPN, checkbox "I certify"

Each step: progress bar, Back/Save & continue, autosave to draft on blur/step change. Resume-by-token pattern reused from life-insurance wizard.

### Storage
- New Supabase table `agent_onboarding_applications`: `id`, `status` (draft/submitted), `current_step`, `resume_token`, `applicant_name`, `applicant_email`, `applicant_phone`, `form_data jsonb`, `signature`, `signed_at`, `submitted_at`, `created_at`, `updated_at`.
- New Supabase storage bucket `agent-onboarding-uploads` (private) for E&O dec page, AML cert, voided check, plus optional driver's license/W-9. Signed URLs delivered in the notification.
- RLS: anonymous insert/update on own draft via `resume_token` (security-definer RPC, same pattern as `update_draft_application_by_token`); admins (has_role) can read all.
- Honeypot field via `useHoneypot` (per project rule).

### Notifications
- New edge function `send-agent-onboarding-notification`:
  - To: `contracting@tfainsuranceadvisors.com`, From: `noreply@tfainsuranceadvisors.com` (project rules).
  - Subject: `New Agent Onboarding Application — {applicant_name}`.
  - Body: summary of all 15 sections, plus signed-URL links to uploaded documents.
  - Generates a PDF mirroring the bundle layout (jsPDF + autoTable, same pattern as `lifeInsurancePdfGenerator.ts`) and attaches it.
- Pipedrive: per project rule, post a Lead (Leads Inbox only) tagged `Agent Onboarding`. No Deal.
- Fire-and-forget invocation uses `await` + try/catch around `supabase.functions.invoke` (per recent fix to avoid navigation aborting the request).

### Files to add / change

```text
src/pages/AgentOnboardingApplication.tsx               (new — standalone shell)
src/components/agent-onboarding/OnboardingWizard.tsx   (new — step controller + autosave)
src/components/agent-onboarding/steps/Step01..Step15.tsx (new — one file per section)
src/components/agent-onboarding/ProgressBar.tsx        (new)
src/components/agent-onboarding/FileUploadField.tsx    (new — wraps Supabase Storage)
src/types/agentOnboardingApplication.ts                (new — zod schemas + TS types)
src/hooks/useAgentOnboardingApplication.ts             (new — draft load/save)
src/lib/agentOnboardingPdfGenerator.ts                 (new — branded PDF)
supabase/functions/send-agent-onboarding-notification/ (new edge function)
supabase/migrations/<ts>_agent_onboarding.sql          (new table, RPCs, bucket, policies, GRANTs)

src/App.tsx                                            (add route + standalonePages entry)
src/components/onboarding/ResourcesPanel.tsx           (add link to new application)
src/pages/AdvisorOnboarding.tsx                        (CTA to new application)
```

### Visual design
Carrier-agnostic, matches bundle:
- Navy `#1E3A5F` headers, gold `#E4B548` accent on section numbers and step indicators
- Inter font (already in project)
- White card on light gray background, 15 numbered section cards
- Asterisk in gold for required fields
- "Help" inline hints under each section heading (toggleable like the bundle's `showHelp`)

### Validation
- Zod schemas per step (`src/types/agentOnboardingApplication.ts`).
- SSN, EIN, routing/account numbers: format-checked, never logged.
- All file uploads: type/size limits (10MB, pdf/jpg/png).
- Required fields enforced before each "Continue".

### Out of scope
- No changes to the existing `/advisors/onboard` $49.99 payment form or the `/onboarding-checklist` UX itself (only a new link is added).
- No auth gate — public form, like other applications. Drafts resumable only via tokenized URL emailed to the applicant.
