# Add Rosie Nuño to Meet Our Advisors

Add Rosie Nuño as a new advisor, matching the same structure used for recent advisors (Elizabeth Rocha, Cayla Dee Porter, Merriane McGuire).

## 1. Asset

Copy uploaded headshot into the project:
- Uploaded headshot → `src/assets/advisors/rosie-nuno.jpg`

(Only a headshot was provided — no landing page photo or logo, so the landing page will use the standard layout without a feature photo, matching advisors like Cayla Dee Porter who use just the headshot.)

## 2. Directory entry — `src/data/advisors.ts`

Append a new advisor entry with:
- id: `rosie-nuno`
- name: Rosie Nuño
- title: Financial & Estate Planning Strategist
- type: Advisor
- state: California, city: Brea, region: West
- bio: Condensed from her copy — "Protecting What You've Built. Preserving What Matters Most." theme; specializes in living trusts, asset protection, and foundational financial strategies; has guided hundreds of clients through the estate planning process; straightforward, personalized approach focused on clarity, security, and peace of mind.
- specialties: ["Estate Planning & Living Trusts", "Asset Protection Strategies", "Legacy & Wealth Transfer Planning", "Financial Protection Strategies", "Integrated Financial Planning"]
- licenses: ["CA Life License #0I43845"]
- image: `rosieNunoImg`
- email: `rosie@tfainsuranceadvisors.com`
- phone: `(209) 204-9672`
- landingPage: `/advisors/rosie-nuno`

## 3. Landing page — `src/pages/AdvisorRosieNuno.tsx`

New page modeled after `AdvisorCaylaDeePorter.tsx` (same sections, components, SEO schema, ScheduleModal + ContactModal). Content:
- **Hero**: headshot + name + title "Financial & Estate Planning Strategist" + tagline "Protecting What You've Built. Preserving What Matters Most." + CTAs (Schedule / Contact / tel: (209) 204-9672).
- **About**: full bio (2 paragraphs as provided).
- **Areas of Expertise grid** (5 services with icons): Estate Planning & Living Trusts, Asset Protection Strategies, Legacy & Wealth Transfer Planning, Financial Protection Strategies, Integrated Financial Planning.
- **Process steps**: standard 4 (Discovery → Analysis → Strategy → Implementation).
- **Connect**: phone (209) 204-9672, office (888) 350-5396, fax (909) 579-2164, email rosie@tfainsuranceadvisors.com, location Brea, CA.
- **License footer**: "Licensed in California — CA Life License #0I43845".
- **SEO**: Person + LocalBusiness schemas.

## 4. Route — `src/App.tsx`

- Import: `import AdvisorRosieNuno from "./pages/AdvisorRosieNuno";`
- Route: `<Route path="/advisors/rosie-nuno" element={<AdvisorRosieNuno />} />` (added next to other advisor routes).

## 5. Verification

- Build passes.
- `/advisors` directory shows her card with image and specialties (alphabetical order will place her between Ruben/Ruth or near Sean — sorted automatically).
- `/advisors/rosie-nuno` renders cleanly with hero, bio, services, schedule modal, contact modal, and SEO.

## Out of scope

- No DB, edge functions, or custom Pipedrive routing — inherits standard leads inbox per core rule.
- No social links provided, so the Connect section uses phone/email/office/fax only.
