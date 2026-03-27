

## Plan: Fix Estate Guru Registration Before Payment

### Problem

The registration form appears in two places:
1. On the main `/estate-guru` landing page (scroll down to `#register` section)
2. On the `/estate-guru/success` page (after Stripe payment)

Anyone can scroll to the bottom of the landing page and submit the registration form **without paying**. This triggers the confirmation email and Pipedrive lead creation prematurely.

### Fix

**Remove the registration form from the main `/estate-guru` landing page.** It should only exist on the `/estate-guru/success` page, which users reach after completing Stripe checkout.

### Changes — `src/pages/EstateGuru.tsx`

1. Remove the `#register` section that wraps `<EstateGuruRegistrationForm />`
2. Remove the import of `EstateGuruRegistrationForm`
3. Update the header nav items to remove the "Register" link (currently not in nav, but the `#register` anchor becomes dead)

### Changes — `src/components/estate-guru/EstateGuruHero.tsx` (if applicable)

Check if the hero CTA links to `#register` — if so, redirect it to `#pricing` instead, since the correct flow is: choose plan → Stripe checkout → success page → register.

### Result

The only way to reach the registration form is through the Stripe checkout success redirect, ensuring payment always happens before registration and confirmation emails.

### Files Changed

| File | Change |
|------|--------|
| `src/pages/EstateGuru.tsx` | Remove `#register` section and `EstateGuruRegistrationForm` import |
| Hero/CTA components | Update any `#register` links to point to `#pricing` instead |

