

## Plan: Dynamic "Next Event" Badge + Fix Events Display

### Issues

1. **Hero badge** — Line 44 in `GeneralSponsorshipHero.tsx` is hardcoded: `"Next Event: Kick Off — January 2026"`. It needs to dynamically show the next upcoming event based on `event_date` from the DB.

2. **Events grayed out** — The `useSponsorshipEvents` hook filters `is_active = true`, which correctly hides Kick Off (`is_active: false`). But the remaining 4 events all have `event_date = null`. The cards likely look "grayed out" because the `status` field is `'available'` for all, which uses muted styling (`bg-muted text-muted-foreground`). Also, only events with status `selling-fast` or `few-spots` show a badge — `available` events show no status indicator, making them look inactive.

### Changes

**1. `src/components/sponsorship/GeneralSponsorshipHero.tsx`**
- Import `useSponsorshipEvents` hook
- Compute the next upcoming event: find the first event with `event_date >= today`, sorted by date. If none found, show "Events Coming Soon"
- Replace hardcoded badge text with dynamic: `"Next Event: {name} — {formatted date}"`

**2. `src/components/sponsorship/EventsShowcase.tsx`**
- Auto-determine visual status from `event_date`: if `event_date` is in the past, treat as `'past'` visually regardless of DB status (gray it out + disable button)
- For events with `event_date = null` or future dates, respect the DB `status` field
- Show the event date on each card when available (currently only shows `timing` like "Q1 2026")
- Give `available` status a more active visual treatment — use a subtle green/primary badge instead of muted gray so cards don't look disabled

**3. Database: Set event dates** (migration)
- Update the 4 active events with approximate 2026 dates so the "Next Event" logic works:
  - Crash Courses: `2026-04-15`
  - Leadership Summit: `2026-06-20`  
  - Summer Sizzler: `2026-08-15`
  - Christmas Party: `2026-12-12`
- These can be adjusted later via the admin panel

### Technical Details

**Next event computation** (in Hero):
```typescript
const { data: events = [] } = useSponsorshipEvents();
const today = new Date().toISOString().split('T')[0];
const nextEvent = events
  .filter(e => e.event_date && e.event_date >= today)
  .sort((a, b) => a.event_date!.localeCompare(b.event_date!))[0];
```

**Status visual fix** (in EventsShowcase):
```typescript
// Change 'available' styling from muted to active
'available': { label: '✅ Available', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
```
And always show the status badge for `available` events (remove the filter that hides it).

