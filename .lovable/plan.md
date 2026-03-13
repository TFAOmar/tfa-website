

## Plan: Create Michelle Martinez Advisor Profile Page

Add a dedicated landing page at `/advisors/michelle-martinez` following the established advisor page pattern.

### Profile Details

- **Name:** Michelle Martinez
- **Title:** Lead Agent
- **Location:** Los Angeles, CA
- **Email:** mmartinez@tfainsuranceadvisors.com
- **Phone:** (619) 571-2274
- **Experience:** 13+ years (since 2011)
- **Bilingual:** Yes — gold "Bilingual · Bilingüe" badge
- **Tagline:** "Protecting What Matters Most — Your Legacy."

### Services (6 cards)
1. Mortgage Protection
2. Whole Life Insurance
3. Tax-Free Retirement Strategies
4. Rich Man's Roth
5. Living Benefits
6. Legacy Planning

### Files to Create/Edit

1. **Copy uploaded image** → `src/assets/advisors/michelle-martinez.jpg`

2. **Create `src/pages/AdvisorMichelleMartinez.tsx`** — Full landing page:
   - Hero with "Lead Agent" badge, bilingual badge, name, tagline, bio summary, location/license badges
   - About section with full bio (career timeline from 2011, CEO's Interim Assistant role, solo-agent transition)
   - 6 service cards tailored to her specialties
   - 4-step process section
   - CTA with phone (619) 571-2274
   - ScheduleModal + ContactModal routing to mmartinez@tfainsuranceadvisors.com

3. **Edit `src/data/advisors.ts`** — Add Michelle Martinez entry with bilingual badge, image import, and `landingPage: "/advisors/michelle-martinez"`

4. **Edit `src/App.tsx`** — Add route `/advisors/michelle-martinez` → `AdvisorMichelleMartinez`

### Lead Routing
- Email notifications to mmartinez@tfainsuranceadvisors.com and leads@tfainsuranceadvisors.com

