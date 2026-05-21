## Goal

Aileen Gutierrez already exists in `src/data/advisors.ts` and has two standalone landing pages (`/aileen` client referral, `/aileen/partners` partner recruitment), but she has no profile page on the main directory like every other advisor. Add one and cross-link the two existing landing pages from it.

## Changes

### 1. New profile page — `src/pages/AdvisorAileenGutierrez.tsx`
Mirror the structure used by `AdvisorRubenDavis.tsx` (hero, specialties, services grid, process steps, About, contact CTA with `ScheduleModal` + `ContactModal`, SEO via `SEOHead` + `JsonLd` with `generatePersonSchema` / `generateBreadcrumbSchema` / `generateWebPageSchema`, global Header/Footer via App shell).

Content tailored to Aileen:
- Title: Financial Strategist · Bilingual • Bilingüe
- Location: Covina, CA · Serving California families
- Specialties: Mortgage Protection, Living Trusts, Life Insurance, Family Income Protection, Estate Planning, Tax-Free Retirement
- Services grid: Mortgage Protection, Living Trusts, Life Insurance with Living Benefits, Family Income Protection, Estate Planning Basics, Retirement Strategies
- Process steps: Discovery Call → Needs Review → Personalized Plan → Implementation & Ongoing Support
- About: bilingual, family-first, referral-driven practice
- Contact: phone `(626) 643-0816`, email `aileen@tfainsuranceadvisors.com`, license `CA Lic# 0I97662`
- Hero image: `@/assets/advisors/aileen-gutierrez.jpg`

**Cross-links section** ("Resources & Referral Tools") with two cards:
- "Refer a client" → `/aileen` (for friends, family, and referral partners sharing her link)
- "Become a referral partner" → `/aileen/partners` (for real estate pros, CPAs, attorneys)

### 2. `src/data/advisors.ts`
Update Aileen's record:
- `landingPage: "/advisors/aileen-gutierrez"` (so the directory card links to her new profile, matching every other advisor)
- Expand `specialties` to: `["Mortgage Protection", "Living Trusts", "Life Insurance", "Estate Planning", "Family Income Protection"]`

### 3. `src/App.tsx`
- `import AdvisorAileenGutierrez from "./pages/AdvisorAileenGutierrez"`
- Add `<Route path="/advisors/aileen-gutierrez" element={<AdvisorAileenGutierrez />} />` alongside the other advisor profile routes
- Do NOT add it to `standalonePages` — the profile uses the global Header/Footer like every other advisor profile. `/aileen` and `/aileen/partners` remain standalone as configured.

### 4. Surface referral links on the profile
On `AdvisorAileenGutierrez.tsx`, add a clearly labeled "Resources" block with two `Link`s/Buttons:
- "Client referral page" → `/aileen`
- "Referral partner program" → `/aileen/partners`

## Out of scope
- No changes to `/aileen` or `/aileen/partners` content.
- No edits to other advisor records or the directory page (it already iterates `advisors[]` and will pick up the new `landingPage`).
- No new assets — reuse existing `aileen-gutierrez.jpg`.

## QA
- Visit `/advisors` → Aileen card links to `/advisors/aileen-gutierrez`.
- Visit `/advisors/aileen-gutierrez` → global Header/Footer present, profile renders, "Resources" links open `/aileen` and `/aileen/partners`.
- Visit `/aileen` and `/aileen/partners` → unchanged, still standalone.
- Contact + Schedule modals open and submit to `aileen@tfainsuranceadvisors.com`.
