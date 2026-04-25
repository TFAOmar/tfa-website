## Why Omar didn't get the notification

I dug into Ulysses Sanchez's submission (application `6eff6eaa...`, advisor Omar Sanchez, omar@tfainsuranceadvisors.com).

What I found:
- The application **was submitted successfully** and saved with the correct advisor email.
- The "Resend PDF" button you used today **worked perfectly** (advisor + leads both got it — confirmed in the network logs).
- The original notification at submission time most likely **never finished sending** because of a race condition in the submit flow.

The frontend currently:
1. Submits the application
2. Calls `send-life-insurance-notification` with a **15-second client-side timeout**
3. Immediately navigates to `/thank-you`

The notification function does a lot of work in one request: generate a multi-page PDF, then send **3 separate emails** (admin/leads, advisor, applicant) sequentially through Resend with retries. On a slow network or when Resend is rate-limited, this regularly exceeds 15s — the browser aborts, the function gets killed mid-send, and Omar never gets the email even though the app shows "Submitted!". This matches exactly what happened to Ulysses' submission.

## Fix

### 1. Resend Ulysses' notification right now
Use the existing resend flow to send the missed notification to Omar (and leads). I'll trigger it server-side so it doesn't depend on a browser tab being open.

### 2. Make submission notifications reliable (root cause fix)
Move the notification trigger off the browser's critical path so it can't be aborted by navigation or a 15s timeout.

| File | Change |
|------|--------|
| `supabase/functions/send-life-insurance-notification/index.ts` | Wrap the email work in `EdgeRuntime.waitUntil(...)` so the function returns 200 to the browser immediately, then keeps sending in the background (admin → advisor → applicant) without being killed when the browser navigates. |
| Same file | Send the **advisor email first**, then leads, then applicant — so the advisor always gets it even if a later email fails. |
| Same file | Add a small `setTimeout` delay (200ms) between Resend calls to avoid hitting Resend's rate limit, which is another silent-failure cause. |
| `src/components/life-insurance-application/ApplicationWizard.tsx` | Remove the 15-second timeout race; just fire-and-forget the invoke (we no longer need to wait, since the edge function now returns immediately and finishes work in the background). Keep the existing error logging. |

### 3. Add a safety net — automatic retry detection
| File | Change |
|------|--------|
| `supabase/functions/send-life-insurance-notification/index.ts` | After sending, write a row to a new `notification_log` table (or a `notifications_sent_at` column on `life_insurance_applications`) recording success per recipient. |
| New scheduled edge function `retry-missed-life-insurance-notifications` (runs every 15 min via cron) | Find any `submitted` application from the last 48h that has no `advisor_notification_sent_at` and call the resend function automatically. |

This guarantees that even if Resend has an outage or the function crashes, Omar (and every other advisor) gets their notification within 15 minutes — no human action required.

### 4. Optional: small UX improvement
Add a banner in `/admin/applications` showing "⚠️ Notification not yet confirmed sent" next to any application missing the new `advisor_notification_sent_at` timestamp, with a one-click resend button (already exists, just surface the status).

## Technical details

- `EdgeRuntime.waitUntil(promise)` is the Supabase/Deno Deploy mechanism that keeps async work alive after the response is returned. It's the standard fix for "function gets killed when client disconnects."
- The new `notification_log` column approach is non-breaking — defaults to `null` and is purely additive.
- Cron is set up via a new entry in `supabase/config.toml` under `[functions.retry-missed-life-insurance-notifications]` with `schedule = "*/15 * * * *"`.

## Summary of what you'll get
1. Omar receives Ulysses Sanchez's notification today.
2. Future submissions: notification can no longer be killed by the browser navigating away.
3. Even if Resend hiccups, the cron job catches and retries within 15 min.
4. Admin dashboard shows which applications haven't had their notification confirmed.