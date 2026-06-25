# Add Kristin Romo to Meet Our Advisors

Add Kristin Romo as a new entry on the `/advisors` page, matching the format of existing advisors.

## Steps

1. **Upload headshot as a project asset**
   - Save the uploaded `Kristin Romo.jpg` to `src/assets/advisors/kristin-romo.jpg`.

2. **Add advisor entry to `src/data/advisors.ts`**
   - Import the new headshot.
   - Append a new `Advisor` object with:
     - `id`: `"kristin-romo"`
     - `name`: "Kristin Romo"
     - `title`: "Director of Agent Development & Operations"
     - `type`: `"Advisor"`
     - `state`: "California"
     - `city`: "Los Angeles" (covers LA, OC, IE)
     - `region`: "West"
     - `bio`: Condensed 1–2 sentence summary derived from the provided bio (full bio reserved for a future profile page, matching how other directory entries store a short bio).
     - `specialties`: ["Leadership Development", "Agent Training & Mentorship", "Operations", "Business Development"]
     - `licenses`: ["Life & Health (Lic# 4334059)"]
     - `image`: imported headshot
     - `yearsOfExperience`: 7

3. **No new profile page** is being created (user asked for the advisors listing only). The card will appear in the directory alphabetically (or per admin custom order if configured).

## Notes / Questions handled by defaults

- Only the headshot was provided in this message (no separate full-body photo attachment was received) — using the headshot for the card.
- Title kept as "Director of Agent Development & Operations" even though `type` is `"Advisor"`, since that drives card styling/filtering and she is part of the advisor directory.
- No dedicated `/advisors/kristin-romo` landing page is added. If you want a full profile page like Manuel Soto's, say the word and I'll add it as a follow-up.
