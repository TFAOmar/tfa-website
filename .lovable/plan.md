

## Plan: Replace Logo with Heiner & Natalia Photo

Copy the uploaded image to `src/assets/partners/escobar-heiner-natalia.png`, then update the personal touch section in `src/pages/EscobarRealtyLivingTrust.tsx` to display their photo instead of the Escobar Realty logo. The image container will be resized and styled as a rounded portrait (e.g., `rounded-xl object-cover`) to present the photo professionally.

### Changes

1. **Copy asset**: `user-uploads://image-23.png` → `src/assets/partners/escobar-heiner-natalia.png`

2. **Edit `src/pages/EscobarRealtyLivingTrust.tsx`**:
   - Import the new photo
   - Replace the logo `<div>` + `<img>` in the personal touch section (~line 134-138) with the Heiner & Natalia photo, styled as a portrait thumbnail (`w-28 h-28 md:w-32 md:h-32 rounded-xl object-cover`)

