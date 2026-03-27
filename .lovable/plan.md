

## Plan: Fix Favicon for Bookmarks

### Problem
Browsers default to requesting `/favicon.ico`, and the Lovable build platform may inject its own heart-logo `favicon.ico` that overrides yours. The current `apple-touch-icon` also points to `/favicon.ico`, so bookmarks on mobile show the Lovable heart too.

### Fix — `index.html`

1. **Delete `public/favicon.ico`** — remove it so the Lovable default doesn't conflict
2. **Convert `favicon.svg` to a 180×180 PNG** (`public/apple-touch-icon.png`) for Apple devices
3. **Update `<head>` tags**:
   - Keep `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />` as primary
   - Remove the `.ico` icon link entirely
   - Change `apple-touch-icon` to point to the new PNG: `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`
   - Add a 32×32 PNG fallback for older browsers: `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />`

### Files Changed

| File | Change |
|------|--------|
| `index.html` | Update favicon link tags |
| `public/favicon.ico` | Delete |
| `public/apple-touch-icon.png` | Generate 180×180 PNG from SVG |
| `public/favicon-32x32.png` | Generate 32×32 PNG from SVG |

This ensures browsers and bookmark managers use TFA's actual logo instead of the Lovable heart.

