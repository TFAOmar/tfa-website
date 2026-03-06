

# Showcase Vanessa's Partnerships on Her Profile

## Overview
Add a new "Trusted Partnerships" section to Vanessa's profile page (`src/pages/AdvisorVanessaSanchez.tsx`) between the Services and Process sections. It will display her three referral partners with their logos and links to their co-branded landing pages.

## Partnerships to Display

| Partner | Logo | Link |
|---------|------|------|
| THE BRANDON DREW GROUP | `src/assets/partners/the-brandon-group.png` | `/advisors/vanessa-sanchez/living-trust` |
| Think Tax Solutions | `src/assets/partners/think-tax-solutions.png` | `/advisors/vanessa-sanchez/think-tax-solutions` |
| Cardenas & Company Real Estate Group | `src/assets/partners/cardenas-and-company.jpg` | `/advisors/vanessa-sanchez/cardenas-and-company` |

## Changes

### `src/pages/AdvisorVanessaSanchez.tsx`
- Import the three partner logos and `Handshake` icon from lucide-react
- Add a new "Trusted Partnerships" section after the Services grid
- Each partner rendered as a Card with: logo (white background), partner name, brief description of the partnership focus (e.g. "Living Trust Services", "Living Trust & Mortgage Protection", "Living Trust for Real Estate Clients"), and a Link button to the co-branded page
- Style: consistent with existing sections — centered heading with gold divider, 3-column grid on desktop

No other files need changes.

