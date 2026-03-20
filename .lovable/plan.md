

## Plan: Dynamic Sponsorship Dashboard for `/events/sponsorship`

Updating the existing `/events/sponsorship` page (EventSponsorship.tsx) to pull events and tiers from Supabase, adding an admin CRUD dashboard, and integrating Stripe checkout with updated pricing.

---

### 1. Database Migration — Two New Tables

**`sponsorship_events`** — stores the 5 annual events (admin-editable)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| name | text | e.g. "Kick Off" |
| slug | text UNIQUE | e.g. "kickoff" |
| description | text | |
| timing | text | e.g. "January 2026" |
| event_date | date | nullable for TBD |
| attendees | text | e.g. "200+" |
| status | text | 'selling-fast', 'few-spots', 'available', 'sold-out', 'past' |
| icon | text | icon name string |
| gradient | text | Tailwind gradient classes |
| display_order | integer | |
| is_active | boolean | default true |
| created_at / updated_at | timestamptz | |

**`sponsorship_tiers`** — stores pricing tiers (admin-editable)

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| tier_id | text UNIQUE | 'title', 'supporting', 'community' |
| name | text | |
| price | integer | cents or dollars |
| stripe_price_id | text | for checkout |
| features | text[] | |
| is_popular | boolean | |
| display_order | integer | |
| is_active | boolean | |

RLS: public SELECT for active rows; admin-only INSERT/UPDATE/DELETE via `has_role()`.

### 2. Seed Data

Insert the 5 events (Kick Off, Crash Courses, Leadership Summit, Summer Sizzler, Christmas Party) and 3 tiers with updated prices:
- Title Sponsor: **$5,000**
- Supporting Sponsor: **$2,500**
- Community Sponsor: **$1,000**

### 3. Create Stripe Products & Prices

Use Stripe tools to create 3 products/prices ($5,000, $2,500, $1,000 one-time). Store the resulting `price_xxx` IDs in `sponsorship_tiers.stripe_price_id`.

### 4. Admin Dashboard — `src/pages/AdminSponsorshipEvents.tsx`

- Table of events with inline edit (name, date, timing, status, active toggle, reorder)
- Add/delete events
- Tiers section with editable price and Stripe price ID fields
- Protected route at `/admin/sponsorship`

### 5. Frontend Data Hook — `src/hooks/useSponsorshipData.ts`

- `useSponsorshipEvents()` — fetches active events ordered by `display_order`
- `useSponsorshipTiers()` — fetches active tiers ordered by `display_order`

### 6. Update Existing Components

- **`EventsShowcase.tsx`** — replace hardcoded `events` array with DB query
- **`GeneralSponsorshipTiers.tsx`** — replace hardcoded tiers with DB query, show new prices
- **`GeneralSponsorshipForm.tsx`** — dynamic event checkboxes and tier labels from DB; add "Proceed to Payment" button after form submission

### 7. Update Edge Function — `create-sponsorship-checkout/index.ts`

- Accept `tier_id` in request body
- Fetch `stripe_price_id` from `sponsorship_tiers` table
- Keep `allow_promotion_codes: true` for Stripe discount codes
- No webhook needed — form submission + lead capture happens before checkout redirect

### 8. Route Registration — `src/App.tsx`

Add `/admin/sponsorship` route wrapped in `ProtectedRoute requireAdmin`.

---

### Files Changed/Created

| File | Action |
|------|--------|
| Migration SQL | Create 2 tables + RLS |
| Seed data (insert tool) | 5 events + 3 tiers |
| `src/hooks/useSponsorshipData.ts` | Create |
| `src/pages/AdminSponsorshipEvents.tsx` | Create |
| `src/components/sponsorship/EventsShowcase.tsx` | Edit — fetch from DB |
| `src/components/sponsorship/GeneralSponsorshipTiers.tsx` | Edit — fetch from DB |
| `src/components/sponsorship/GeneralSponsorshipForm.tsx` | Edit — dynamic data + pay button |
| `supabase/functions/create-sponsorship-checkout/index.ts` | Edit — dynamic price lookup |
| `src/App.tsx` | Add admin route |

### Stripe Discounts

Stripe's `allow_promotion_codes: true` lets you create coupon codes directly in the Stripe Dashboard — no extra code needed. Sponsors enter codes at checkout.

