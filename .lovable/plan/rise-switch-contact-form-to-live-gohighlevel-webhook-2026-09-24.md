# /rise: switch contact form to live GoHighLevel webhook

Only three files change. Nothing visual changes except the new failure message, which reuses existing styles.

## 1. src/config/rise.config.ts
- `RISE_FORM_MODE` becomes `"live"`.
- Add the `RISE_GHL_WEBHOOK_URL` export with its doc comment directly below it, word for word as specified.
- The DRAFT COPY comment stays as it is.

## 2. src/lib/rise/submitRiseLead.ts
- Leave the mock branch as it is. Update the header comment so it describes live mode.
- Add `buildGhlBody(payload)`, which produces these keys:
  - `firstName`, `lastName`, `email`, `agentName`: trimmed.
  - `phone`: reformatted to +1 as specified. Anything else falls back to the trimmed input.
  - `preferredContact`: Call, Text, or Email (capitalized).
  - `ref`: the ?ref= value, or `""` when absent.
  - `answers`: q1, q1b, q2, q2b, q3, q4, q5, q6 mapped from plan, titled, dependents, guardian, authority, mortgage, life, retirement. Each value is the visitor-facing label from `RISE_QUESTIONS`. q2 labels are joined with "; ". Skipped questions are `""`.
  - `summaryItems`: headings joined with "; ".
  - `source`: `"tfawealthplanning.com/rise"`.
- Live branch:
  - POST JSON with `Content-Type: application/json`.
  - 15-second AbortController timeout.
  - Success means `res.ok` is true and the body is not JSON whose string `status` starts with "Error". A 2xx with a non-JSON body counts as success.
  - Every failure returns `{ ok:false, id:"" }` and logs `console.error("[rise] submit failed:", reason)` with the status and reason only, never visitor data.
  - Never throws. No retry.

## 3. src/components/rise/RiseSummaryContact.tsx
- `handleSubmit`:
  - Clear the error, then call `submitRiseLead` inside try/finally so `submitting` always resets.
  - Set success only when `result.ok` is true. Otherwise set `failed` and keep everything the visitor typed.
- Failure block, directly above the submit button:
  - It has `role="alert"` and `tabIndex={-1}`, and gets focus when it appears.
  - First line uses `text-sm text-destructive`. Second line uses `text-sm text-muted-foreground`.
  - For each advisor: their name, plus Call and Text links copied exactly from the RiseAdvisors markup (same classes, Phone and MessageSquare icons, same tel/sms format). There is no import from RiseAdvisors.
- Both "Preview" notices keep their `RISE_FORM_MODE === "mock"` conditions, so they hide automatically in live mode.
- The honeypot is unchanged.

## Verification
- Typecheck, then check the three-file diff.
- Confirm RisePage.tsx is untouched and still passes `noIndex`.
- Confirm package.json is unchanged.
- No live test submission, because it would create a real lead. Failure handling will be checked with network requests blocked in the browser.
- No publishing.
