

## Plan: Make Sales Contest Page and PDF More Exciting

### What changes

Transform the current minimal sales contest page into a high-energy, visually rich experience with leadership headshots, the company logo, edifying bios, confetti animation, and a more dynamic layout. The PDF flyer will also be enhanced with the TFA logo embedded as an image.

### Landing Page — `src/pages/SalesContest.tsx`

**New imports**: Leadership headshots (`@/assets/leadership/manny-soto.jpg`, `@/assets/leadership/omar-sanchez.jpg`), TFA logo (`@/assets/tfa-logo.png`), `useConfetti` hook, additional icons (`Flame`, `Crown`, `Sparkles`, `Target`)

**Hero section enhancements**:
- Add TFA logo at top of hero
- Add confetti effect that fires on page load (gold-themed particles)
- Add animated gradient background with gold sparkle accents
- More impactful typography with glow effects

**New "Meet Your Hosts" section** (between Prize and Contest Period):
- Side-by-side cards for Manny Soto and Omar Sanchez
- Each card includes their headshot (circular with gold border), name, title
- Short edifying blurb for each:
  - Manny: "Nearly two decades of experience. Built a client base of 2,000 households. Trained thousands of advisors nationwide. The architect behind TFA's mission."
  - Omar: "COO & Managing Partner leading TFA's national expansion. Founded InsuranceLatino.com. Known for blending high-level strategy with real-world execution."

**Category cards upgrade**:
- Add `Flame` / `Crown` icons for more energy
- Add "YOU COULD BE HERE" motivational subtext
- Slightly larger, more dramatic styling

**Additional energy elements**:
- Pulsing gold glow on the Download Flyer button
- "DON'T JUST WATCH. COMPETE." call-to-action line
- Countdown-style urgency text: "The clock is ticking — April is YOUR month"

### PDF Flyer — `src/lib/salesContestPdf.ts`

**Add TFA logo**: Load `tfa-logo.png` as a base64-encoded image and embed it at the top center of the PDF flyer above the headline. Since jsPDF supports `addImage`, we'll convert the logo to a base64 data URL at build time by importing it as a URL and using a canvas to convert, or embed a pre-converted base64 string.

**Enhanced layout**: Add the logo between the top gold bar and the headline, centered. Adjust spacing to accommodate.

### Files Changed

| File | Change |
|------|--------|
| `src/pages/SalesContest.tsx` | Major overhaul — logo, headshots, confetti, "Meet Your Hosts" section, energized copy |
| `src/lib/salesContestPdf.ts` | Add TFA logo image to PDF, adjust layout |

