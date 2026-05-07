## Goal

Create a single admin page at `/admin/submissions` with three tabs:
1. **Life Insurance** (existing `life_insurance_applications`)
2. **Pre-Qualification** (existing `prequalification_applications`)
3. **Estate Planning / Living Trust** (existing `estate_planning_applications`)

Replace the current standalone `/admin/applications` link on the Admin Dashboard with a single link to the unified page (keep the old route as a redirect for safety).

## What to build

### 1. New hooks
- `src/hooks/usePrequalificationApplications.ts` — `useAdminPrequalifications()`, `useDeletePrequalification()`, `useUpdatePrequalificationStatus()` (status is plain text). Mirrors `useLifeInsuranceApplications.ts`.
- `src/hooks/useEstatePlanningApplications.ts` — same shape, against `estate_planning_applications`.

### 2. New shared table components
- `src/components/admin/PrequalificationTable.tsx` — list with ID, Applicant, Advisor, Status, Step, Submitted, actions (View, Delete).
- `src/components/admin/EstatePlanningTable.tsx` — same pattern.
- `src/components/admin/PrequalificationDetailModal.tsx` — read-only formatted view of `form_data` (sections: Personal Info, Health & Lifestyle incl. condition-specific details, Coverage, Review). Status dropdown (draft / submitted / reviewed).
- `src/components/admin/EstatePlanningDetailModal.tsx` — read-only formatted view of `form_data`.

### 3. New unified page
- `src/pages/AdminSubmissions.tsx` with three Radix Tabs:
  - Header: "Submissions" with back-to-dashboard button
  - Per-tab: stats cards, search input, status filter, results count, table, detail modal
  - Reuses existing `ApplicationsTable` + `ApplicationDetailModal` for the Life Insurance tab
- Tab state synced to URL via `?tab=life|prequal|estate` so links can deep-link.

### 4. Routing (`src/App.tsx`)
- Add route: `/admin/submissions` → `<AdminSubmissions/>` wrapped in `ProtectedRoute requireAdmin`.
- Add `/admin/submissions` to the `standalonePages` array (no header/footer).
- Keep `/admin/applications` working but render `<AdminSubmissions/>` defaulting to the Life Insurance tab (back-compat).

### 5. Admin Dashboard link
- In `src/pages/AdminDashboard.tsx`, replace the "Life Insurance Applications" button with a single "Submissions" button → `/admin/submissions`.

## Technical details

**Data model reuse**: All three tables already exist with admin RLS (`has_role(auth.uid(),'admin')`) for SELECT/UPDATE/DELETE. No DB migration needed.

**Status semantics**:
- Life Insurance: enum `application_status` (existing flow unchanged).
- Pre-Qualification: text column, values `draft` | `submitted` | `reviewed`.
- Estate Planning: enum `estate_planning_status` (read from supabase types).

**Detail modal rendering**: Both new modals render `form_data` JSON as labeled sections by reading the known keys from `src/types/prequalificationApplication.ts` and `src/types/estatePlanningApplication.ts`. Unknown extra keys fall through into a "Raw form data" collapsible at the bottom for safety.

**Search**: across `applicant_name`, `applicant_email`, `applicant_phone`, `id`.

**Out of scope**: PDF generation for prequal / estate (not currently implemented), bulk actions, CSV export. Can be added later.

## Files

New:
- `src/hooks/usePrequalificationApplications.ts`
- `src/hooks/useEstatePlanningApplications.ts`
- `src/components/admin/PrequalificationTable.tsx`
- `src/components/admin/PrequalificationDetailModal.tsx`
- `src/components/admin/EstatePlanningTable.tsx`
- `src/components/admin/EstatePlanningDetailModal.tsx`
- `src/pages/AdminSubmissions.tsx`

Edited:
- `src/App.tsx` (add route, add to standalonePages, alias `/admin/applications`)
- `src/pages/AdminDashboard.tsx` (single "Submissions" button)
