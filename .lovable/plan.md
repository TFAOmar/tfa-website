

## Plan: Add Cayla Dee Porter — Advisor Profile + Landing Page

### Details Gathered

- **Name**: Cayla Dee Porter
- **Title**: Certified Financial Fiduciary®
- **Tagline**: "Protection and Prosperity for All"
- **Location**: Brea, CA
- **Email**: cayladee@tfainsuranceadvisors.com
- **Phone**: (707) 320-3087
- **License**: Licensed Life, Health and Accident Agent — CA#4197988
- **Specialties**: Indexed Strategies, Retirement Planning, Tax Strategies, Financial Literacy
- **Calendly**: https://calendly.com/cayladee (from the link provided)
- **Bio**: Full bio as provided

---

### 1. Copy uploaded headshot
Copy `user-uploads://Cayla_Dee_Porter.jpg` → `src/assets/advisors/cayla-dee-porter.jpg`

### 2. Add to advisor directory — `src/data/advisors.ts`
- Import `caylaDeePorterImg`
- Add entry with id `37`, name "Cayla Dee Porter", title "Certified Financial Fiduciary®", type "Advisor", city "Brea", state "CA", region "Southern California", specialties including Indexed Strategies, Retirement Planning, Tax Strategies, Financial Literacy, and license CA#4197988
- Include `landingPage: "/advisors/cayla-dee-porter"` and `schedulingLink` pointing to her Calendly

### 3. Create landing page — `src/pages/AdvisorCaylaDeePorter.tsx`
Following the same pattern as `AdvisorJosephGuzman.tsx`:
- Hero with headshot, name, title, tagline, location, contact info
- Services section: Indexed Strategies, Retirement Planning, Tax Strategies, Financial Literacy/Education
- Full bio section with the personal details about cooking, nieces, outdoors
- Quote callout: "Building financially independent individuals..."
- Schedule and contact modals
- SEO metadata and JSON-LD schema
- CTA section at bottom

### 4. Register route — `src/App.tsx`
- Import `AdvisorCaylaDeePorter`
- Add route: `/advisors/cayla-dee-porter`

### Files Changed

| File | Change |
|------|--------|
| `src/assets/advisors/cayla-dee-porter.jpg` | New — uploaded headshot |
| `src/data/advisors.ts` | Add Cayla Dee Porter entry (id 37) |
| `src/pages/AdvisorCaylaDeePorter.tsx` | New — full advisor landing page |
| `src/App.tsx` | Import + route for `/advisors/cayla-dee-porter` |

