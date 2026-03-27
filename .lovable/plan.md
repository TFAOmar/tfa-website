

## Plan: Fix Event Cards Looking Greyed Out / Unavailable

### Root Cause

The code logic is correct — future events are NOT getting `opacity-60`. The problem is purely visual design. The current card styling makes available events look inactive:

1. **Outline button** (`variant="outline"`) looks like a disabled/secondary action — very low contrast
2. **Card background** (`bg-card`) on the `bg-muted/30` section creates minimal contrast
3. **No visual energy** — cards lack any strong color indicator that they're open for sponsorship
4. **Kick Off still shows** as `is_active: true` in the DB (should be `false` since it's past)

### Changes

**1. `src/components/sponsorship/EventsShowcase.tsx`**

For available/active events:
- Change the "Sponsor This Event" button from `variant="outline"` to `variant="default"` (solid primary background) so it looks like a real CTA
- Add a subtle left border accent or ring to active cards: `border-l-4 border-l-primary` to visually distinguish them from past/disabled cards
- For `selling-fast` and `few-spots` statuses, make the button even more prominent (e.g., destructive variant)
- Keep past/sold-out cards with `opacity-60` and disabled outline button as-is

**2. Database: Deactivate Kick Off**

Run a migration to set `is_active = false` for the Kick Off event (slug `kickoff`) since it's a past event. This removes it from the public query but keeps it visible in admin. Actually — per user preference to "show as past" — keep `is_active = true` but ensure it renders at the end of the grid after active events.

**3. Sort events: future first, past last**

In the component, sort the events array so future/available events appear first and past events appear at the end, regardless of `display_order`.

### Technical Details

```tsx
// Button change for active events (line 115-123)
<Button 
  onClick={() => onSelectEvent(event.slug)}
  className="w-full"
  variant={isDisabled ? 'outline' : 'default'}
  disabled={isDisabled}
>

// Card border accent for active events (line 74)
className={`group relative bg-card rounded-2xl border overflow-hidden transition-all duration-300 ${
  isDisabled 
    ? 'opacity-60 border-border' 
    : 'border-primary/30 hover:border-primary hover:shadow-xl shadow-md'
}`}
```

### Files Changed

| File | Change |
|------|--------|
| `src/components/sponsorship/EventsShowcase.tsx` | Active cards get solid CTA button, stronger border, sorted future-first |
| Migration | Set Kick Off `is_active = false` OR reorder past events to end |

