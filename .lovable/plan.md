

## Plan: Fix Safari/iPhone Checkout Blocked Popup

### Problem

The checkout button calls `window.open(data.url, "_blank")` inside an async `supabase.functions.invoke()` callback. Safari on iPhone treats this as a popup (not a direct user gesture) and blocks it silently. The user clicks "Get Started" and nothing happens.

### Fix — `src/components/estate-guru/EstateGuruPricing.tsx`

Replace `window.open(data.url, "_blank")` with `window.location.href = data.url` to navigate in the same tab instead of opening a new one. This is never blocked by popup blockers.

The Stripe success/cancel URLs already redirect back to the site, so same-tab navigation is the correct UX for mobile anyway.

### Single line change

```typescript
// Before
window.open(data.url, "_blank");

// After
window.location.href = data.url;
```

### Files Changed

| File | Change |
|------|--------|
| `src/components/estate-guru/EstateGuruPricing.tsx` | Replace `window.open` with `window.location.href` |

