

## Plan: Enhance Admin Sponsorship Page Editability

The admin page at `/admin/sponsorship` already supports editing events (name, slug, timing, date, status, attendees, icon, gradient, order, active) and basic tier fields (price, Stripe ID, popular, active). But several fields are missing or use poor input types.

### Changes to `src/pages/AdminSponsorshipEvents.tsx`

**1. Event edit dialog improvements:**
- Change Description from single-line `Input` to `Textarea` for longer text
- Add an `Atmosphere` field (text input — currently in the DB but not editable)

**2. Tier cards — add missing editable fields:**
- **Name** — editable text input (currently just a static heading)
- **Tier ID** — editable text input (currently just a badge)
- **Price Note** — editable text input (e.g. "per event")
- **Highlight** — editable text input (e.g. "Best Value")
- **Features** — editable textarea where each line = one feature, saved as a string array
- **Display Order** — number input

This makes every column in both `sponsorship_events` and `sponsorship_tiers` fully editable from the admin panel. No database or schema changes needed.

### Technical Details

- Import `Textarea` from `@/components/ui/textarea`
- For tier features editing: use a `Textarea` with `defaultValue={tier.features.join('\n')}`, on blur split by newlines and save as array
- All tier fields use the existing `handleTierFieldUpdate` pattern (inline onBlur saves)
- Reorganize tier cards into a more complete grid layout with all fields visible

