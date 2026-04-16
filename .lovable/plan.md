

## Plan: Remove Price from Estate Guru Notification Emails

### What
Remove the "Amount Paid" row from the checkout notification email sent to Heather and Nancy when someone signs up for Estate Guru.

### Changes

| File | Change |
|------|--------|
| `supabase/functions/send-estate-guru-checkout-notification/index.ts` | Remove the "Amount Paid" table row (lines 100-103) and the `amountTotal` variable |

### Details
- The checkout notification email currently includes a row showing "Amount Paid" with the dollar amount
- Will remove that row from the HTML table while keeping all other info (name, email, plan, payment time, session ID)
- Will redeploy the edge function after the change

