## Plan: Add Pre-Qualification Questionnaire to Manuel Soto's Profile

The generic prequalification route `/advisors/:advisorSlug/prequalification` already exists in `src/App.tsx` and works for any advisor in `src/data/advisors.ts` — Manuel is already there, so no routing or data work is needed. We only need to surface the CTA on his profile page.

### Changes to `src/pages/AdvisorManuelSoto.tsx`

1. **Hero section CTAs** (around line 179, alongside the existing "Life Insurance" and "Coaching" buttons): add a new `<Link to="/advisors/manuel-soto/prequalification">` button styled identically to the other outline CTAs, labeled **"Life Insurance Pre-Qualification"** with a `FileText` icon — matching the pattern used on Neil Clark's page.

2. **Bottom CTA section** (around line 370): add the same Pre-Qualification button next to the existing CTAs there for consistency.

No new files, no route changes, no data changes — just two button additions on Manuel's page.