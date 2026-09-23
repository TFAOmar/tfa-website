# /entrepreneur-story — "An Entrepreneur's Story" with Manny Soto

A standalone page where visitors ask for time with Manny Soto. They fill in their details, and staff contact them to set a date and time. There's no calendar on the page.

## Page sections
1. **Header**: Uses the existing co-branded landing header (white background, TFA logo). A "Book time with Manny" button scrolls down to the form.
2. **Hero**: Navy panel with a gold eyebrow reading "An Entrepreneur's Story". Headline: "From one office to a national firm — hear Manny's story." A short line of supporting text, a gold button that scrolls to the form, and Manny's existing photo (the leadership headshot).
3. **About the story**: Three short points: how Manny started, the lessons he learned building TFA, and what that means for business owners and families. The copy is placeholder text written for this page, and I'll mark it for your review.
4. **Request form** (the anchor the buttons scroll to):
   - First and last name, email, mobile phone (all required)
   - Reason for connecting: Speak at my event / Business mentorship / Financial planning / Other
   - Preferred contact method (Call/Text) and best time to reach you
   - Optional notes
   - SMS consent checkbox that appears when Text is chosen, the same as on the existing pages
   - Hidden bot-trap field (`useHoneypot`)
   - Success card: "Thanks — our team will reach out within one business day to schedule your time with Manny."
5. **Footer**: The minimal compliance footer. Standalone, so the site's main header, footer, and floating button are hidden.

## Where submissions go
- Submissions use the existing form handler, so they land in the Pipedrive Leads Inbox (no deal is created) and Manny gets the usual email notification. This is also the default routing already in place.
- Tags: `entrepreneur-story`, `interest:<reason>`.
- No backend changes.

## SEO
- Page title "An Entrepreneur's Story with Manny Soto", with a description and canonical URL on tfawealthplanning.com. The page is added to the sitemap.

## Technical details
- New file `src/pages/EntrepreneurStory.tsx`. Add a lazy route in `App.tsx` and add the path to `standalonePages`.
- Use `submitForm` with `form_name: "entrepreneur-story"`, `advisor_slug: "manuel-soto"`, `interest_category` set to the chosen reason, and `preferred_follow_up`/`preferred_time`.
- Uses the existing navy and gold tokens. No new dependencies.
- QA: check the layout at 390px and 1440px, run one test submission labeled "TEST — please ignore", then delete that test lead from the database and Pipedrive.
