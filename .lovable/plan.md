

## Plan: Force Google to Pick Up TFA Favicon

### Root Cause

The favicon files themselves are correct (TFA branded). The problem is twofold:

1. **No web manifest** — Google heavily relies on `site.webmanifest` to determine the correct favicon. Without it, Google may fall back to a cached or platform-injected `/favicon.ico`.
2. **Google's aggressive caching** — Google's favicon cache can persist for weeks/months. A web manifest gives Google a stronger, more explicit signal.

### Changes

**1. Create `public/site.webmanifest`**

A standard web manifest file pointing to the TFA icons:

```json
{
  "name": "The Financial Architects",
  "short_name": "TFA",
  "icons": [
    { "src": "/favicon-32x32.png", "sizes": "32x32", "type": "image/png" },
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" },
    { "src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml" }
  ],
  "theme_color": "#1a365d",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

**2. Update `index.html`**

Add the manifest link in the `<head>` alongside the existing favicon tags:

```html
<link rel="manifest" href="/site.webmanifest" />
```

**3. Generate a 192×192 and 512×512 PNG** (recommended by Google)

Convert the SVG to these sizes and add them to the manifest — Google specifically looks for 192×192 or larger icons in the manifest.

### Post-Deployment

After publishing, request re-indexing via Google Search Console for the homepage. The favicon update in Google results typically takes 1-2 weeks after re-crawling.

### Files Changed

| File | Change |
|------|--------|
| `public/site.webmanifest` | New — web manifest with icon declarations |
| `public/favicon-192x192.png` | New — generated from SVG |
| `public/favicon-512x512.png` | New — generated from SVG |
| `index.html` | Add `<link rel="manifest">` tag |

