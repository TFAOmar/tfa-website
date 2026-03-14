

## Plan: Escobar Realty Group Co-Branded Living Trust Landing Page

Create a premium co-branded landing page at `/advisors/manuel-soto/escobar-realty` that positions TFA as a turnkey Living Trust partner for Heiner & Natalia Escobar's real estate clients. Design uses a premium hybrid approach: Escobar's elegant gold/black tones blended with TFA's navy/gold structure.

### Design Approach

Premium hybrid — darker, more luxurious feel than standard TFA co-branded pages. Use gold (#C9A84C and lighter gold accents inspired by the Escobar logo), black/dark navy backgrounds, and clean white typography. The Escobar logo gets prominent placement alongside TFA's logo. Include the Keller Williams and Fusion Growth Partners logos as smaller trust badges.

### Content

- Co-branded header (white bg): Escobar Realty Group logo + TFA logo + KW and Fusion logos as small badges
- Hero: "Protect Your Home & Legacy with a Living Trust" — positioned for real estate clients
- Light personal touch: Heiner & Natalia's names, title (REALTORS), license numbers, brief excerpt ("husband-wife team, stronger together, full transparency in every transaction")
- No family/personal photos embedded — only the Escobar Realty logo
- Benefits section (4 cards): Avoid Probate, Protect Privacy, Maintain Control, Reduce Family Stress
- Partnership section: explaining TFA handles everything — Escobar agents just refer clients
- "How It Works for Your Clients" section (3 steps): Client fills form → Manuel Soto contacts them → Free consultation
- Lead capture form (same fields as Cardenas pattern)
- Co-branded footer (white bg)

### Files to Create/Edit

1. **Copy assets:**
   - `user-uploads://image-15.png` → `src/assets/partners/escobar-realty-group.png` (logo)
   - `user-uploads://image-21.png` → `src/assets/partners/keller-williams.png`
   - `user-uploads://image-22.png` → `src/assets/partners/fusion-growth-partners.png`

2. **Create `src/components/living-trust/EscobarLivingTrustForm.tsx`** — Lead capture form based on CardenasLivingTrustForm pattern:
   - Routes to Manuel Soto (`advisor_slug: "manuel-soto"`, `advisor_email: "info@tfainsuranceadvisors.com"`)
   - Tags: `["Living Trust", "Escobar Realty Group"]`
   - Partner name: `"Escobar Realty Group"`
   - Standard `submitForm` call (no Pipedrive — routes to general leads + Manuel's email)
   - Email notifications to `leads@tfainsuranceadvisors.com`

3. **Create `src/pages/EscobarRealtyLivingTrust.tsx`** — Standalone co-branded page following VanessaCardenasAndCompany pattern but with premium hybrid styling

4. **Edit `src/App.tsx`** — Add route `/advisors/manuel-soto/escobar-realty` as standalone page

### Lead Routing

- Form submissions via `submitForm` to `leads@tfainsuranceadvisors.com` with Manuel Soto as advisor
- No Pipedrive integration initially (can be added later)
- Tags: Living Trust, Escobar Realty Group

