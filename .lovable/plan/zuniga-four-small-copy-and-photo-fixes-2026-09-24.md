# /zuniga — four small copy and photo fixes

Only the Zuniga page and its own data file change.

1. **Richard's headshot** — keep the same square frame and crop (no photo editing), but zoom his photo in about 1.4x centered on his face so his head and shoulders fill the square like Mariah's. Mariah's photo stays as is.
2. **Header button** — text changes from "Get started" to "Free Consultation"; it still scrolls to the form.
3. **Hero line** — "from TFA advisors Richard Morales and Mariah Lorenzen" becomes "from Richard Morales and Mariah Lorenzen of The Financial Architects". Rest of the sentence unchanged.
4. **Service name** — "Tax Planning" becomes "Tax-Efficient Retirement Planning" in both "What we help with" and the form's interest chips.

Everything else (layout, colors, form fields, consent, tracking) stays exactly the same.

## Technical notes
- `src/pages/ZunigaConnect.tsx`: advisor image gets a per-advisor style — for Richard `transform: scale(1.4)` with face-centered `transform-origin`, inside the existing frame (add `overflow-hidden` to the frame wrapper). Button label and hero copy edited in place.
- `src/data/zunigaConfig.ts`: only the `label` of the `tax-planning` entry changes. The slug stays `tax-planning`, so submitted tags (`zuniga-tax-planning`) and tracking are unchanged; the notification email will show the new label text.
- QA: screenshot of the advisor card at 390px and 1440px.
