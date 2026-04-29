# Add Elizabeth Rocha to Meet Our Advisors

Add Elizabeth Rocha as a new TFA Financial Architect, matching the same structure used for the most recent advisors (Cayla Dee Porter, Merriane McGuire).

## 1. Assets

Copy uploaded files into the project:
- `user-uploads://Elizabeth_Rocha_headshot.jpg` → `src/assets/advisors/elizabeth-rocha.jpg` (directory card + page header)
- `user-uploads://Elizabeth_Rocha_couple_landing_page.jpeg` → `src/assets/advisors/elizabeth-rocha-couple.jpg` (used as a feature image on her landing page)
- `user-uploads://Elizabeth_Rocha_Logo_2.png` → `src/assets/advisors/elizabeth-rocha-logo.png` (the version with her name + "Life Insurance Agent | The Financial Architects" — single logo since she said we don't have to use both, and this one is the most informative/branded)

## 2. Directory entry — `src/data/advisors.ts`

Append a new advisor object (alphabetical id slug `elizabeth-rocha`) with:
- name: Elizabeth Rocha
- title: Financial Strategist
- type: Advisor
- state: California, city: Southern California, region: West
- bio: Condensed from her about copy — focuses on family financial planning, income/mortgage protection, retirement strategies, faith-led/family-first/legacy-driven theme, serving SoCal since 2021.
- specialties: ["Family Financial Planning", "Income Protection", "Mortgage Protection", "Retirement Planning", "Life Insurance", "Business Solutions"]
- licenses: ["Life & Health (Lic# 4196019)"]
- image: `elizabethRochaImg`
- email: `elizabeth@tfainsuranceadvisors.com` (canonical leads-email pattern)
- phone: `626-622-8408`
- landingPage: `/advisors/elizabeth-rocha`

## 3. Landing page — `src/pages/AdvisorElizabethRocha.tsx`

New page modeled after `AdvisorCaylaDeePorter.tsx` (same sections, components, SEO schema, ScheduleModal + ContactModal). Content:
- **Hero**: headshot + name + title "Financial Strategist | The Financial Architects" + tagline "Faith-led planning. Family-first protection. Legacy-driven wealth." + CTAs (Schedule / Contact / tel: 626-622-8408).
- **About section**: full bio (4 paragraphs as provided), with the couple photo (`elizabeth-rocha-couple.jpg`) as a side image. Logo used once as a small badge near the title.
- **Areas of Expertise grid** (5 services with icons): Family Financial Planning, Income Protection, Mortgage Protection, Retirement Planning, Life Insurance + Business Solutions card.
- **Process steps**: standard 4 (Discovery → Analysis → Strategy → Implementation).
- **Connect section**: phone 626-622-8408, email elizabeth@tfainsuranceadvisors.com, Instagram @tfaelizabeth (https://instagram.com/tfaelizabeth), Facebook https://www.facebook.com/mrselizabethrocha.
- **License footer line**: "Licensed in California — LIC# 4196019".
- **SEO**: Person + LocalBusiness schemas (same helper functions).

## 4. Wire route — `src/App.tsx`

- Import: `import AdvisorElizabethRocha from "./pages/AdvisorElizabethRocha";`
- Route: `<Route path="/advisors/elizabeth-rocha" element={<AdvisorElizabethRocha />} />` (added next to other advisor routes around line 233).

## 5. Verification

- Build passes (`tsc --noEmit` + Vite build run automatically).
- `/advisors` directory shows her card with image and specialties.
- `/advisors/elizabeth-rocha` renders cleanly with hero, bio, services, schedule modal, contact modal, and SEO meta.

## Out of scope

- No DB migration, no edge functions, no Pipedrive/CRM custom routing (she'll inherit the standard leads inbox per core rule).
- Only one logo used (the branded "Elizabeth Rocha — Life Insurance Agent | The Financial Architects" version). The crescent-moon-only logo is skipped per your "don't have to use both" note. Easy to swap later if you'd prefer the icon version.
