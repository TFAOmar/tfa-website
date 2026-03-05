

# Co-Branded Living Trust Landing Page: Cardenas & Company Real Estate Group

## Overview
Create a new co-branded Living Trust landing page for Vanessa Sanchez in partnership with Cardenas & Company Real Estate Group, following the exact pattern established by Brandon Drew Group and Think Tax Solutions pages.

**URL:** `/advisors/vanessa-sanchez/cardenas-and-company`

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/assets/partners/cardenas-and-company.jpg` | Copy uploaded logo into project assets |
| `src/components/living-trust/CardenasLivingTrustForm.tsx` | New form component (clone of ThinkTaxLivingTrustForm with Cardenas branding, `partner_name: "Cardenas & Company Real Estate Group"`, tags updated) |
| `src/pages/VanessaCardenasAndCompany.tsx` | New page component (clone of VanessaThinkTaxSolutions with Cardenas logo, partner name, and partnership copy referencing real estate clients/agents) |
| `src/App.tsx` | Add route `/advisors/vanessa-sanchez/cardenas-and-company` and add path to `standalonePages` array |

## Key Customizations from Template

- **Partner name**: "Cardenas & Company Real Estate Group" everywhere
- **Logo**: Use uploaded `cardenas-and-company.jpg` in header, partnership section, and footer (white background sections)
- **Partnership copy**: Tailored to real estate — "Cardenas & Company Real Estate Group and The Financial Architects have partnered to bring you comprehensive Living Trust services. Vanessa Sanchez personally handles all Living Trust consultations for Cardenas & Company clients and their agents' clients..."
- **Benefits**: Standard Living Trust benefits (Avoid Probate, Protect Privacy, Maintain Control, Reduce Family Stress) — no Mortgage Protection since this is a real estate group, not tax/mortgage focused
- **Form tags**: `["Living Trust", "Vanessa Sanchez", "Cardenas & Company"]`
- **Form name**: `"Living Trust Inquiry - Vanessa (Cardenas & Company)"`
- **Pipedrive submission**: Routes to `vanessa-pipedrive-submit` with `partner_name: "Cardenas & Company Real Estate Group"`
- **SEO**: Title/description/canonical referencing Cardenas & Company

## No Edge Function Changes Needed
The `vanessa-pipedrive-submit` function already supports dynamic `partner_name`, so no backend changes are required.

