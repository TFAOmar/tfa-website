

## Plan: Fix Google Search Favicon (Lovable Heart Override)

### Problem

Google Search (and many browsers) specifically request `/favicon.ico` by default. While `index.html` correctly points to `/favicon.svg`, there is no `favicon.ico` file in the project. The Lovable hosting platform injects its own heart-logo `favicon.ico` when one doesn't exist, which is what Google indexes.

### Fix

Generate a proper `favicon.ico` file from the existing `favicon.svg` and place it in `public/`. This will override the platform-injected Lovable heart.

### Steps

1. **Generate `public/favicon.ico`** from `public/favicon.svg` using a build script (convert SVG → ICO with 16×16, 32×32, and 48×48 sizes embedded)
2. **Add an explicit ICO link** in `index.html` as the first favicon declaration:
   ```html
   <link rel="icon" type="image/x-icon" href="/favicon.ico" />
   ```

### Files Changed

| File | Change |
|------|--------|
| `public/favicon.ico` | New file — generated from favicon.svg |
| `index.html` | Add explicit `favicon.ico` link tag |

### Note
After deployment, Google may take days/weeks to re-crawl and update the cached favicon. You can request re-indexing via Google Search Console to speed this up.

