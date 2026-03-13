

## Plan: Create Ruben Davis Advisor Profile Page

Add a dedicated landing page for Ruben Davis at `/advisors/ruben-davis`, following the established advisor page pattern (Hero → About → Services → Process → CTA).

### Profile Details

- **Name:** Ruben Davis, Franchise Owner
- **Title:** Franchise Owner — Income Protection & Retirement Planning
- **Location:** Los Angeles, CA
- **License:** Lic# 0F77548
- **Phone:** (818) 381-6770
- **Experience:** 17+ years (real estate/mortgage) + wealth planning
- **Tagline:** "Veteran. Strategist. Wealth Builder."
- **Bio:** UCLA graduate, U.S. Air Force Reservist, built one of SoCal's fastest-growing brokerages. Now partners with TFA for retirement planning, mortgage protection, life insurance with living benefits, annuities.
- **Specialties:** Retirement Planning, Mortgage Protection, Life Insurance with Living Benefits, Annuities, Income Protection, Wealth Building
- **Services (6 cards):** Retirement Planning, Mortgage Protection, Life Insurance with Living Benefits, Annuities & Growth, Income Protection, Wealth Building Strategy

### Files to Create/Edit

1. **Copy uploaded image** → `src/assets/advisors/ruben-davis.jpg`

2. **Create `src/pages/AdvisorRubenDavis.tsx`** — Full landing page following the Neil Clark pattern:
   - Hero with badge "Franchise Owner", name, tagline quote, bio summary, location badge + "U.S. Air Force Reservist" badge + license badge
   - Experience badge showing "17+" years
   - Buttons: Book a Consultation, Contact Me
   - About section with full bio text provided
   - 6 service cards tailored to his specialties
   - 4-step process section
   - CTA section with phone (818) 381-6770
   - ScheduleModal + ContactModal (email TBD — will use placeholder)

3. **Edit `src/data/advisors.ts`** — Add Ruben Davis to the advisors array for directory listing

4. **Edit `src/App.tsx`** — Add route `/advisors/ruben-davis` → `AdvisorRubenDavis`

### Lead Routing

- ScheduleModal and ContactModal will route to leads@tfainsuranceadvisors.com (no personal email provided — can be updated later)
- SEO metadata and JSON-LD structured data included

