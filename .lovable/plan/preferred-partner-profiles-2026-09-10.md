# Preferred Partner Profiles

Turn `/preferred-partners` from a categories-only page into a real directory with partner profiles, each with contact details, a website link, and its own detail page — managed by your team from an admin screen.

## Launch partners (pulled from the advisor directory)

| Partner | Role / Category | Details we have | Missing |
|---|---|---|---|
| Jose Estrada | Senior Financial Advisor — San Dimas, CA | Jose@agefinancial.com, (909) 592-5481, photo, bio | website |
| Tamara Lee | Finance & Business Strategist — Claremont, CA | tlee@tfainsuranceadvisors.com, photo, bio | phone, website |
| Celeste Sierra | Mortgage Broker / Owner, LOAN BOX Loans — Claremont, CA | photo, bio, licenses | email, phone, website |
| Ruben Davis | Franchise Owner, real estate & mortgage — Los Angeles, CA | ruben@tfainsuranceadvisors.com, (818) 381-6770, (213) 444-5479, photo, bio | website |

Their existing photos and bios carry over. Missing emails, phones, and website links will be left blank so those buttons simply don't show — send them over and I'll fill them in, or your team can add them in the admin screen.

## What gets built

1. **Partner directory on `/preferred-partners`** — a card grid above the existing categories and application form. Each card: photo, name, company/role, category badge, city/state, short bio line, and a "View Profile" link. Category filter chips reuse the seven existing categories.
2. **Detail page at `/preferred-partners/<name>`** — photo, full bio, category, specialties, service area, contact block (phone / email / website buttons), and a "Work With Us" call to action back to the application form.
3. **Admin screen at `/admin/preferred-partners`** — add, edit, reorder, publish/unpublish, and delete partners. Fields: name, company, category, title, city/state, bio, specialties, phone, email, website, photo upload, display order, published toggle. Admin/staff only, matching the other admin pages.
4. **SEO** — each profile page gets its own title, description, canonical URL, and Person/Organization structured data; profiles added to the sitemap.

## Technical notes

- New table `public.preferred_partners` (slug, name, company, category, title, city, state, bio, specialties[], phone, email, website_url, photo_url, display_order, is_published, timestamps) with GRANTs; anon/authenticated read limited to published rows, full write restricted to `has_role(auth.uid(),'admin')` and staff.
- Seed the four partners with a data insert; photos reuse the existing advisor image assets uploaded to the existing public storage bucket used by advisor images.
- New files: `src/pages/PreferredPartnerProfile.tsx`, `src/pages/AdminPreferredPartners.tsx`, `src/components/preferred-partners/PartnerDirectory.tsx`, `PartnerCard.tsx`, `src/hooks/usePreferredPartners.ts`.
- Routes added in `src/App.tsx`; the admin route joins the `standalonePages` list and the protected-admin wrapper used by `/admin/resources`.
- `/preferred-partners` keeps its current categories section, application form, and homepage entry points.
