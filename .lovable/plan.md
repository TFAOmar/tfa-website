

# Fix: Think Tax Solutions Submissions Using Brandon Drew Group Labels

## Root Cause

The `vanessa-pipedrive-submit` edge function treats ALL `living_trust_landing` submissions identically, hardcoding "Brandon Drew Group" as the source in four places:

- **Line 439**: Note content says `Source: The Brandon Drew Group`
- **Line 462**: Lead title says `Living Trust Inquiry - {name} (Brandon Drew Group)`
- **Line 477**: Email subject says `(Brandon Drew Group)`
- **Line 484**: Email body says `from The Brandon Drew Group landing page`

The Think Tax Solutions form (`ThinkTaxLivingTrustForm.tsx`) calls this function with `submission_type: "living_trust_landing"` -- the same type as the Brandon Drew page -- so it gets the wrong labels.

## Fix

### 1. Add `partner_name` field to the edge function request interface

Add an optional `partner_name` field to `PipedriveSubmitRequest` so each landing page can identify itself.

### 2. Update `vanessa-pipedrive-submit/index.ts` to use `partner_name`

Replace all four hardcoded "Brandon Drew Group" references with `requestData.partner_name || "Unknown Partner"`:

- Note: `Source: ${partnerName}`
- Lead title: `Living Trust Inquiry - ${name} (${partnerName})`
- Email subject: `(${partnerName})`
- Email body: `from the ${partnerName} landing page`

### 3. Update `ThinkTaxLivingTrustForm.tsx` to pass `partner_name: "Think Tax Solutions"`

In the `supabase.functions.invoke("vanessa-pipedrive-submit", ...)` call (line 160), add `partner_name: "Think Tax Solutions"` to the body.

### 4. Update the Brandon Drew landing page form to pass `partner_name: "The Brandon Drew Group"`

Find the Brandon Drew form component and add the same field for backward compatibility.

## Files Changed

| File | Change |
|------|--------|
| `supabase/functions/vanessa-pipedrive-submit/index.ts` | Add `partner_name` to interface; replace 4 hardcoded "Brandon Drew Group" references with dynamic partner name |
| `src/components/living-trust/ThinkTaxLivingTrustForm.tsx` | Add `partner_name: "Think Tax Solutions"` to edge function call body |
| Brandon Drew landing page form component | Add `partner_name: "The Brandon Drew Group"` to edge function call body |

