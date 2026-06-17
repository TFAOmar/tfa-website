# Non-Medical Term Life Application

A new, shorter application flow modeled on the Foresters Strong Foundation (non-medical) product, kept carrier-agnostic in copy. Lives alongside the existing medical Life Insurance Application, reuses the same submission pipeline, and gets a CTA on every advisor profile.

## What gets built

### 1. New route + page
- Route: `/advisors/:advisorSlug/non-medical-life` (also bare `/non-medical-life-application` fallback)
- New page `src/pages/NonMedicalLifeApplication.tsx` — mirrors the look/header/footer of `LifeInsuranceApplication.tsx` (advisor lookup, sticky header with TFA logo, secure badge, back link to advisor)
- Page title: "Non-Medical Term Life Application" (no Foresters branding shown to applicant)
- Add to `standalonePages` in `App.tsx` so global Header/Footer/FloatingCTA are hidden

### 2. New wizard
New folder `src/components/non-medical-life-application/` with its own `ApplicationWizard.tsx` and steps. Reuses the existing `Validated*` inputs, `ProgressBar`, `SaveProgressModal`, `ResumeApplicationModal`, honeypot hook, and shake-on-error hook.

Steps (6 total — shorter than the medical app, no PART 2 medical questionnaire):
1. **Product Details** — coverage amount, term length (10/15/20/25/30), optional riders (Accidental Death $, Children's Term $, Waiver of Premium), optional Charity Benefit beneficiary (name, Tax ID, address)
2. **Proposed Insured** — name, sex, DOB, SSN, address, phone(s), email, state/country of birth, US citizen + immigration status, photo ID type/state/number, occupation/duties, employment status, income, military status, primary language
3. **Owner (if other than insured)** + Financial Questions 1a/1b
4. **Beneficiaries** — up to 5 primary + 3 contingent (name, DOB, relationship, %, SSN, phone, address); enforce 100% total per group
5. **Lifestyle + PART 1 Medical (questions 2–15)** — the only health questions Strong Foundation requires; conditional "Additional Information" textarea when any answer is Yes
6. **Existing Insurance + Review & Submit** — replacement disclosure, TIA acknowledgement, fraud notice, signature (typed name + date), agreement checkboxes

Persistence: same resume-token pattern as the existing wizard (uses `life_insurance_applications` table with a new `product_type` value).

### 3. Database — minimal schema change
Add an enum/text column to distinguish products in the shared table:
- `ALTER TABLE life_insurance_applications ADD COLUMN product_type text NOT NULL DEFAULT 'medical';`
- New submissions from the non-medical wizard set `product_type = 'non_medical_term'`
- Existing rows remain `'medical'`

(No new table; reuses existing RLS, grants, admin view, and notification function.)

### 4. Submission pipeline (reused)
- Same insert into `life_insurance_applications`
- Same call to `send-life-insurance-notification` edge function
- Same PDF generator (`src/lib/lifeInsurancePdfGenerator.ts`) — extended to skip the Part-2 medical section and label the document "Non-Medical Term Life Application" when `product_type = 'non_medical_term'`
- Same advisor email routing (advisor + clients inbox)
- Admin Applications page (`/admin/applications`) gets a product-type column and filter so non-medical apps are visible without a separate dashboard

### 5. Profile CTA on every advisor
Add a reusable `<NonMedicalLifeCTA advisorSlug={slug} />` button and drop it into every `AdvisorXxx.tsx` page (35+ files) next to the existing Schedule/Apply CTAs. Label: "Apply for Non-Medical Term Life" → links to `/advisors/:slug/non-medical-life`. Also surface on the generic `/advisors` directory cards where the existing life-insurance CTA already appears.

## Technical details

**Files created**
- `src/pages/NonMedicalLifeApplication.tsx`
- `src/components/non-medical-life-application/ApplicationWizard.tsx`
- `src/components/non-medical-life-application/steps/Step1Product.tsx` … `Step6Review.tsx`
- `src/components/advisors/NonMedicalLifeCTA.tsx`
- `src/types/nonMedicalLifeApplication.ts` (Zod schemas per step)

**Files edited**
- `src/App.tsx` — route + `standalonePages` entry
- `src/lib/lifeInsurancePdfGenerator.ts` — conditional sections based on `product_type`
- `supabase/functions/send-life-insurance-notification/index.ts` — read `product_type`, swap email subject/body wording when non-medical
- `src/components/admin/ApplicationsTable.tsx` + `ApplicationDetailModal.tsx` — show product type
- All `src/pages/AdvisorXxx.tsx` files — add CTA button

**Migration**
```sql
ALTER TABLE public.life_insurance_applications
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'medical';
```
(No new GRANT/RLS needed — column inherits table-level policies.)

**Not changed**
- Existing `/advisors/:slug/life-insurance` medical flow is untouched
- No new edge function, no new admin route, no new storage bucket

## Open follow-ups (handled during build, not blockers)
- Confirm final CTA button copy/placement on one advisor page, then propagate to all
- Decide whether the "Charity Benefit" section is shown by default or hidden behind a toggle (will default to collapsed/optional)
