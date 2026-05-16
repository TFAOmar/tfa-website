# Ruben Davis — Contact Info Update + Booking Link

## What Ruben sent
- Business: (213) 444-5479
- Mobile: (818) 381-6770 ✅ already on file
- Email: Ruben@TFAInsuranceAdvisors.com ✅ already on file
- Scheduling: wants to use his TFA Google Calendar, but doesn't know how to get the link

## Code changes

### 1. `src/data/advisors.ts` — Ruben's record
- Add `businessPhone: "(213) 444-5479"` field (new optional property on `Advisor` type)
- Keep `phone: "(818) 381-6770"` as mobile
- Once Ruben sends his Google Calendar booking URL, add `schedulingLink: "<url>"`

### 2. `src/data/advisors.ts` — Advisor type
- Add optional `businessPhone?: string` to the interface (near existing `phone?`)

### 3. `src/pages/AdvisorRubenDavis.tsx` — Contact card
- Display both numbers: "Business (213) 444-5479" and "Mobile (818) 381-6770", each as `tel:` links

No other files need changes. The `schedulingLink` is already wired through `ScheduleModal` / `AdvisorCard` for any advisor that has one.

## What I need from Ruben (Google Calendar booking link)

Google Calendar's free booking feature is **Appointment Schedules** (Workspace) or **Appointment Slots** (personal). Send him these steps:

**If his TFA Google account is Google Workspace (most likely):**
1. Open Google Calendar on desktop
2. Click **Create** → **Appointment schedule**
3. Name it "Consultation with Ruben Davis", set duration (e.g. 30 min), availability windows, buffer, and where (Google Meet / phone)
4. Click **Save**
5. Open the saved schedule → click **Open booking page** → copy the URL from the browser (looks like `https://calendar.app.google/<id>`)
6. Send that URL to us — we'll paste it into `schedulingLink`

**Verification step:** ask Ruben to open the link in an incognito window and confirm it shows his availability before sending it.

## Deliverable order
1. Push code changes #1–#3 now (so business phone appears immediately)
2. Wait for Ruben's booking URL, then add `schedulingLink` in a one-line follow-up edit
