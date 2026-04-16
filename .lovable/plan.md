

## Plan: Add Savannah Recinos Headshot

### What
Copy the uploaded headshot image into the project and update all references to display it.

### Changes

| File | Change |
|------|--------|
| `user-uploads://Svannah_Recinos.jpg` → `src/assets/advisors/savannah-recinos.jpg` | Copy headshot into project |
| `src/data/advisors.ts` | Add `image` field to Savannah's entry importing the asset |
| `src/pages/RecinosBusinessInsurance.tsx` | Replace the placeholder `Users` icon with her actual headshot image |

### Technical Details
- The advisors data file at line ~316-329 has no `image` field for Savannah -- will add it
- The Recinos business insurance page (line ~197) currently shows a generic `Users` icon placeholder for Savannah -- will replace with the photo
- Will follow the same pattern used for other advisor images (import from `@/assets/advisors/`)

