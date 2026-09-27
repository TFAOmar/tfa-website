# Reusable giveaway entry page — /giveaway/:slug

## Pre-build report

**Files created (new only)**
- `src/config/giveaways.ts` — giveaway entries (first: `ca-trucking-show`, webhookUrl `""` until you supply it)
- `src/pages/giveaway/GiveawayPage.tsx` — the page (form, success screens, Official Rules overlay, ended screen)
- `src/pages/giveaway/giveawayQueue.ts` — page-local offline queue + send helper
- `src/pages/giveaway/giveawayValidation.ts` — email check + typo suggestions, phone normalizing

**File changed (one)**
- `src/App.tsx` — two small additions, both required:
  1. A lazy `<Route path="/giveaway/:slug">` (the page can't load without a route).
  2. Standalone registration. The `standalonePages` list matches exact paths only, so a slug path needs one extra pattern line next to the existing ones (`/^\/giveaway\/[^/]+\/?$/`), same style as the advisor patterns already there. Header, footer, and floating button stay hidden.

**Confirmed:** no tables, migrations, edge functions, secrets, or dependencies. Uses existing `SEOHead` (noIndex), `useHoneypot`, `generateUUID`, and `src/assets/tfa-logo.png` unchanged. No shared components or existing forms touched.

## Page behavior
- Fits one phone screen, centered card that also suits iPad. TFA logo, config headline/subline.
- Required First, Last, Email (`type=email`), Phone (`type=tel`, 10 digits, shown as (555) 555-5555).
- Email typo hint ("Did you mean ...@gmail.com?", tap to apply) for common misspellings of gmail, yahoo, hotmail, outlook, icloud, aol, and .com/.net.
- Optional consent checkbox, unchecked, exact wording from the brief.
- Footer: "No purchase necessary. One entry per person." + "Official Rules" overlay (rules + sponsor).
- Unknown slug, inactive, or past endsAt: "This giveaway has ended. Thanks for stopping by!" (never 404).

## Modes
- **Phone (default):** normal autocomplete; success "You're entered! Good luck." stays.
- **Booth (`?booth=1`):** `autocomplete="off"` on form and every field; full-screen success for 6 s, then blank form; discreet "X entries waiting to send, keep this page open." when queue is non-empty.

## Submission and queue
- UUID `entry_id` per entry; honeypot filled = success screen, nothing sent.
- POST form-urlencoded (no custom headers) with: entry_id, slug, sponsor, first_name, last_name, email, phone, consent (yes/no), mode, src, submitted_at_utc, submitted_at_pacific.
- Only 2xx counts as delivered. On failure/offline/empty webhook: save to localStorage queue (keyed per slug), still show success.
- Retry on page load, `online` event, and every 30 s; same entry_id reused; removed only after 2xx; queued entries still send after endsAt (cutoff blocks new entries only).
- Note: if the webhook doesn't return CORS headers, the browser can't read the status, so every entry would stay queued. The post-build test POST will confirm this.

## After build
Build report, preview link, and a test POST to the URL you provide reporting whether the status is readable or blocked by CORS.
