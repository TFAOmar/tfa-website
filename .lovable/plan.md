

## Plan: Update Estate Guru Registration Notification Email

**Change**: In `supabase/functions/send-estate-guru-registration/index.ts`, replace `leads@tfainsuranceadvisors.com` with `livingtrusts@tfainsuranceadvisors.com` on line 143.

This only affects the Estate Guru registration notification — all other edge functions will continue using `leads@`.

After the code change, the edge function will be redeployed automatically.

