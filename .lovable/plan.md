

## Plan: Fix Dynamic Gradient Colors on Event Cards

### Problem

Tailwind CSS purges unused classes at build time. The gradient classes (e.g. `from-blue-600 to-purple-600`) are stored in the database and injected dynamically via `${event.gradient}`, so Tailwind never detects them during the build scan. Result: the gradient classes are stripped out and the cards render as grey.

### Fix

Replace the Tailwind gradient class approach with inline `style` attributes using CSS gradients. This bypasses Tailwind's purge entirely.

### Change — `src/components/sponsorship/EventsShowcase.tsx`

**Line 92**: Replace the Tailwind gradient class with an inline style.

Convert DB values like `from-blue-600 to-purple-600` into actual CSS gradient strings. Add a helper function that maps Tailwind color names to hex values, or — simpler and more robust — store actual CSS gradient strings in the DB (e.g. `linear-gradient(to right, #2563eb, #9333ea)`).

**Recommended approach**: Use inline `style` with the gradient value directly, and update the DB gradient values to be valid CSS gradients instead of Tailwind classes.

```tsx
// Before
<div className={`h-32 bg-gradient-to-r ${event.gradient} relative overflow-hidden`}>

// After
<div className="h-32 relative overflow-hidden" style={{ background: event.gradient }}>
```

Then update the 5 event rows in `sponsorship_events` to store CSS gradients:

| Slug | New `gradient` value |
|------|---------------------|
| `kickoff` | `linear-gradient(to right, #2563eb, #7c3aed)` |
| `crash-courses` | `linear-gradient(to right, #059669, #0d9488)` |
| `leadership-summit` | `linear-gradient(to right, #d97706, #dc2626)` |
| `summer-sizzler` | `linear-gradient(to right, #f59e0b, #ef4444)` |
| `christmas-party` | `linear-gradient(to right, #dc2626, #16a34a)` |

Also update the admin panel's gradient input placeholder to indicate CSS gradient format.

### Files Changed

| File | Change |
|------|--------|
| `src/components/sponsorship/EventsShowcase.tsx` | Use inline `style={{ background: event.gradient }}` instead of Tailwind class |
| `src/pages/AdminSponsorshipEvents.tsx` | Update gradient field placeholder to show CSS gradient format |
| DB migration | Update gradient values from Tailwind classes to CSS gradient strings |

