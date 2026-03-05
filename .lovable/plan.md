

# Add Brea Office Location & Second Home Office

## Overview
Add the new Brea, CA office at 200 W Imperial Hwy to the locations directory and designate it as a second home office alongside Chino Hills. Update location counts across the site to reflect 21 offices.

## Changes

### 1. `src/data/locations.ts` — Add Brea location
Add new entry with id 21:
```ts
{ id: 21, name: "Brea (Home Office)", city: "Brea", state: "CA", address: "200 W Imperial Hwy, Brea, CA 92821", phone: "(888) 350-5396", hours: "Mon-Fri: 9am-5pm", coordinates: [-117.9006, 33.9167], region: "Southern California" }
```
Also rename id 1 Chino Hills/Claremont or add a "(Home Office)" designation — need clarification on whether Chino Hills (13890 Peyton Dr) should be marked as a home office in the locations list too, or if only the ContactInfo headquarters reference covers that.

### 2. Update location counts site-wide
The site currently has mixed references (some say 19, some say 29). With 21 actual locations, update all to **21**:

| File | What to update |
|------|---------------|
| `src/lib/seo/siteConfig.ts` | `numberOfLocations: 21` |
| `src/components/locations/LocationsHero.tsx` | "21 offices across..." |
| `src/pages/Locations.tsx` | SEO description, comment |
| `src/pages/Contact.tsx` | SEO description "21 office locations" |
| `src/pages/Index.tsx` | SEO description "21 locations" |
| `src/lib/seo/schemas.ts` | Contact page description |
| `src/components/Hero.tsx` | "21 locations" |
| `src/components/Locations.tsx` | "21 locations" |
| `src/components/locations/LocationsMap.tsx` | "21 locations" |
| `src/components/advisors/AdvisorsHero.tsx` | "21 locations" |
| `src/components/contact/ContactInfo.tsx` | "View all 21 office locations →", update stats card from 29 to 21 |

### 3. `src/components/contact/ContactInfo.tsx` — Add Brea as second HQ
Update the Headquarters section to show both home offices:
- Chino Hills: 13890 Peyton Dr, Chino Hills, CA 91709
- Brea: 200 W Imperial Hwy, Brea, CA 92821

### 4. `src/lib/seo/siteConfig.ts` — Add Brea address
Add a second address entry or note for schema generation.

## Note on count inconsistency
The site currently shows "29" in several places (Hero, Locations map, Advisors hero, ContactInfo) but "19" in others (Locations page, Contact SEO). The actual data file has 20 entries. With Brea added, the true count is **21**. All references will be unified to 21.

