# Kristin phone fix, reusable advisor connect page, and /aimee

## 1. Kristin's contact numbers

- The "Text" button changes to (949) 312-8331, matching the Call button.
- The plain-text line below the buttons shows "Office (888) 305-5396" and "Mobile (626) 824-4939", plus her email as it is today.

## 2. Reusable connect page

Kristin's page becomes one shared page design driven by a small settings entry per advisor. The settings hold: name, title, license, address, photo, call number, text number, office number, mobile number, email, advisor slug, form name, and the wording of the "join" card.

Kristin's version keeps exactly the same look and behavior at /kristin — no visual or wording changes beyond item 1.

## 3. New page at /aimee for Aimee Johnson

Same design, with her details. Differences from Kristin's page:

- Join card title: "Join the Team / Let's Partner", subtitle "Explore a career or a referral partnership with The Financial Architects."
- Inside the join path, a required choice: "I'm interested in: Joining the team / Partnering". Submitting the join path without picking one shows an inline explanation.
- Her requests go to ajohnson@tfainsuranceadvisors.com.
- /advisors/aimee-johnson/connect sends visitors to /aimee; /aimee is added to the site map and shows without the global header/footer.

### Placeholder fields (she is not in the advisor directory today)

Aimee has no existing record or headshot in the site, so these are placeholders until her card and full-length photo arrive:

- Title: "Financial Strategist"
- License number: omitted until supplied (the license line is hidden when empty)
- Address: the Chino Hills office, 13890 Peyton Dr. #A, Chino Hills, CA 91709
- Call / Text / Office numbers: the TFA office number (888) 305-5396; no mobile shown
- Photo: a neutral placeholder image until her full-length photo is provided

Email, slug, form name, and join-card copy are final as given.

## Technical notes

- New `src/components/advisors/AdvisorConnectPage.tsx` holding the current KristinMartinConnect markup, taking an `AdvisorConnectConfig` prop (contact fields, `advisorSlug`, `formName`, `joinTitle`, `joinSubtitle`, optional `joinInterestOptions`).
- Configs in `src/data/advisorConnectConfigs.ts`; `src/pages/KristinMartinConnect.tsx` and a new `src/pages/AimeeJohnsonConnect.tsx` each render the component with their config.
- Join-interest radio only renders when `joinInterestOptions` is present; validated on submit for the join path. Sent as `join_interest` in form_data and as tag `interest:recruit` / `interest:partner`; path tag stays `path:join`.
- `src/App.tsx`: add `/aimee` route, `/advisors/aimee-johnson/connect` redirect, `/aimee` in `standalonePages`; add `/aimee` to `public/sitemap.xml`.
- SEO title/description/canonical and Person schema built from the config.
