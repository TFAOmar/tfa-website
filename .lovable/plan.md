## Goal

Aileen's two landing pages live at `/aileen` and `/aileen/partners`, which don't match the rest of the site. Every other advisor uses `/advisors/<slug>` for the profile and `/advisors/<slug>/<feature>` for sub-pages. Bring Aileen in line and keep the old links working.

## New URL structure

| Page | Old URL | New URL |
|---|---|---|
| Profile | `/advisors/aileen-gutierrez` | `/advisors/aileen-gutierrez` (unchanged) |
| Client referral landing | `/aileen` | `/advisors/aileen-gutierrez/refer` |
| Partner program | `/aileen/partners` | `/advisors/aileen-gutierrez/partners` |

`refer` reads naturally for a link someone shares with a friend ("aileen's refer page"); `partners` matches the existing partner-program copy. Both stay short enough to share by text.

## Changes

### `src/App.tsx`
- Add canonical routes:
  - `/advisors/aileen-gutierrez/refer` → `AileenGutierrezReferral`
  - `/advisors/aileen-gutierrez/partners` → `AileenPartnerProgram`
- Replace old routes with permanent redirects (`<Navigate replace>`):
  - `/aileen` → `/advisors/aileen-gutierrez/refer`
  - `/aileen/partners` → `/advisors/aileen-gutierrez/partners`
- Update `standalonePages` to use the new canonical paths.

### `src/pages/AileenGutierrezReferral.tsx`
- Update `<link rel="canonical">` to `https://tfawealthplanning.com/advisors/aileen-gutierrez/refer`.

### `src/pages/AileenPartnerProgram.tsx`
- Update `<link rel="canonical">` to `https://tfawealthplanning.com/advisors/aileen-gutierrez/partners`.

### `src/pages/AdvisorAileenGutierrez.tsx`
- Update the two "Resources & Referral Tools" cards to link to the new canonical URLs.

### Out of scope
- No copy/design changes to either landing page.
- No changes to form submission, Pipedrive routing, or `advisor_slug` values (they're already `aileen-gutierrez`).
- No SEO redirect-map work beyond the in-app `<Navigate>` (those handle SPA + crawler redirects fine for new pages with no existing backlinks).

## QA
- `/aileen` and `/aileen/partners` redirect to the new URLs.
- New URLs render the same standalone pages (no global header/footer).
- Profile page resource cards point to the new URLs.
- `?ref=` query param still works on the redirected paths (React Router preserves search by default with `Navigate`; verify with `/aileen?ref=NAHREP`).
