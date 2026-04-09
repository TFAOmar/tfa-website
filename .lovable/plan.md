

## Plan: Fix Missing Categories Section + Formatting

### Problem

The "Two Categories. Four Winners." section, Prize section, and Meet Your Hosts section exist in the DOM but are completely invisible on the rendered page. The page jumps from the Hero directly to the Countdown timer.

This is caused by the hero section's absolutely-positioned gradient overlays (lines 64-66) creating a stacking context that visually covers subsequent sections. The categories and other middle sections have no `position: relative` or `z-index`, so they render behind the hero's gradient layers.

### Fix

Add `relative z-10` to the Categories, Prize, and Meet Your Hosts sections so they render above any stacking context artifacts. Also ensure proper section ordering and visibility.

### Files Changed

| File | Change |
|------|--------|
| `src/pages/SalesContest.tsx` | Add `relative z-10` to Categories section (line 110), Prize section (line 183), and Meet Your Hosts section (line 204) to ensure they render visibly above background layers |

