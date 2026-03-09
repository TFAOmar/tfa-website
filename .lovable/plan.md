

## Plan: Skip Pipedrive CRM for Kevin Walters' Landing Page

### What Changes

Kevin's "Book a Consultation" and "Contact Me" forms will send email notifications only (to `walterssrkevinb@gmail.com` + `leads@tfainsuranceadvisors.com`) without creating any Pipedrive leads.

### How

**1. Add `skipPipedrive` prop to `ScheduleModal` and `ContactModal`**

Both modals get a new optional `skipPipedrive?: boolean` prop. When `true`, the `handleSubmit` function calls `supabase.functions.invoke("send-form-notification", ...)` directly instead of `submitForm()` (which routes to `pipedrive-submit`). The `send-form-notification` edge function already supports `book-consultation` and `contact-inquiry` form types, sends team + advisor email notifications, and stores submissions in `form_submissions`.

**2. Pass `skipPipedrive={true}` on Kevin's landing page**

In `src/pages/AdvisorKevinWalters.tsx`, add `skipPipedrive` to both modal instances. No other advisor pages are affected.

### Files Changed
| File | Change |
|------|--------|
| `src/components/advisors/ScheduleModal.tsx` | Add `skipPipedrive` prop; when true, invoke `send-form-notification` instead of `submitForm` |
| `src/components/advisors/ContactModal.tsx` | Same — add `skipPipedrive` prop with alternate submission path |
| `src/pages/AdvisorKevinWalters.tsx` | Add `skipPipedrive={true}` to both `ScheduleModal` and `ContactModal` |

