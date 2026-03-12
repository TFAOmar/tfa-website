

## Plan: Fix Brea Landing Page Syntax Errors

### Problem
Lines 6 and 9 of `src/pages/Brea.tsx` use JSX comment syntax `{/* REPLACE: ... */}` at the **module scope** (outside of any JSX return). This is invalid JavaScript and causes a build error, preventing the page from rendering.

### Fix
**File: `src/pages/Brea.tsx`** — Convert the two module-level JSX comments to standard JavaScript comments:

- Line 6: `{/* REPLACE: Update phone number... */}` → `// REPLACE: Update phone number...`
- Line 9: `{/* REPLACE: Update address... */}` → `// REPLACE: Update address...`

This is a two-line fix. No other changes needed — all six sections (Hero, Trust Bar, What to Expect, Booking, Location Strip, Footer) are already fully implemented.

