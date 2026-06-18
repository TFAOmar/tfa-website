## What happened

Omar's Non-Medical Term Life test submission (`f0c5f0ba-8067-4e41-832e-396baa59badb`, submitted 2026-06-18 00:04 UTC) was saved correctly, but the advisor/admin/applicant emails never went out.

Edge function logs for `send-life-insurance-notification` for that submission show only:

```
function invoked
... (1 second of silence)
shutdown
```

No "Received notification request", no validation error, no email send attempts. The function was killed before it could even read the request body.

## Root cause

In `src/components/life-insurance-application/ApplicationWizard.tsx` (around line 1017) the wizard fires the notification as **fire-and-forget** and then immediately calls `navigate("/thank-you")`:

```ts
supabase.functions.invoke("send-life-insurance-notification", { body: {...} })
  .then(...).catch(...);
// no await
...
navigate("/thank-you");
```

Browser navigation aborts the in-flight `fetch` before the request body finishes streaming to the edge function. The edge function logs `function invoked` (top of handler), then `await req.json()` never resolves because the client closed the connection, and the runtime kills the worker. `EdgeRuntime.waitUntil` can't save us — it only runs **after** we've parsed the body and queued the background work.

The 48-hour retry cron (`retry-missed-life-insurance-notifications`) didn't pick it up yet because it last ran before this submission.

## Fix

### 1. Make the invoke call survive navigation (`ApplicationWizard.tsx`)

Two small changes around the notification call:

- `await` the `supabase.functions.invoke(...)` call. The edge function returns `202` as soon as it has parsed the body and queued the background work (PDF + emails happen inside `EdgeRuntime.waitUntil`), so the await is short (typically <500 ms) and the user still sees the thank-you page almost immediately.
- Wrap it in `try/catch` so a slow/failing invoke never blocks the success flow; on error we just log and continue (the retry cron will catch it).

Result: the request body is fully transmitted before `navigate("/thank-you")` runs, so the edge function can actually do its job. No change to the edge function is needed.

### 2. Manually resend the missed notification

For the already-submitted Omar Sanchez application that never sent, invoke the existing `resend-life-insurance-pdf` edge function once with `{ applicationId: "f0c5f0ba-8067-4e41-832e-396baa59badb" }` so Omar and the leads inbox get the application and PDF now.

### 3. (Optional, recommended) Verify

- Re-check `life_insurance_applications` row `f0c5f0ba…` — `advisor_notification_sent_at` should be populated after the manual resend.
- Submit one test non-medical application end-to-end and confirm the function logs show `Received notification request → Sending advisor notification → Advisor email sent successfully`, and that the email arrives.

## Files changed

- `src/components/life-insurance-application/ApplicationWizard.tsx` — `await` the notification invoke inside try/catch.

No database, no edge function, no schema changes.
