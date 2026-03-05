

# Brand Book & Brand Guidelines

## Overview
Create a comprehensive brand guidelines page at `/brand-guidelines` and a downloadable PDF version. The page will serve as the single source of truth for TFA's visual identity, voice, and usage rules for both internal teams and external partners.

## Page Sections

### 1. Hero Section
Navy gradient hero with "Brand Guidelines" title and subtitle: "The official guide to representing The Financial Architects."

### 2. Logo Usage
- Display the TFA logo (`src/assets/tfa-logo.png`) in multiple contexts: light background, dark background, minimum size
- Usage rules: clear space, do's and don'ts
- Downloadable logo button (links to the asset)

### 3. Color Palette
Interactive color swatches with hex codes, HSL values, and copy-to-clipboard:
- **Primary Navy**: #1E3A5F (HSL 215 45% 25%) — headers, backgrounds, authority
- **Primary Gold**: #C9A84C (HSL 35 55% 60%) — accents, CTAs, highlights
- **Navy Light**: #3D5A80 (HSL 215 35% 35%) — secondary text, hover states
- **Gold Light**: #D4BC7A (HSL 35 65% 75%) — subtle accents
- **Background**: #FAFAFA (HSL 0 0% 98%)
- **Dark mode equivalents** shown in a toggle

### 4. Typography
- Primary font: Inter (sans-serif)
- Display scale examples: H1 through body text with sizes, weights, and line heights
- Usage guidance for headings vs body

### 5. Button & Component Styles
- Primary CTA: Gold with dark hover (`btn-primary-cta` class) — show live examples
- Glass/Neuro effects: `glass`, `neuro-button` utility classes
- Border radius: 0.75rem default

### 6. Brand Voice & Messaging
- Tone: Clear, empowering, family-focused, anti-jargon
- Key phrases and taglines: "Financial Guidance Built for Families", "Change what you're doing to change what you're getting"
- Do/Don't examples for copy

### 7. Photography & Imagery
- Style: warm, professional, family-oriented
- Guidelines for hero images, advisor headshots

### 8. Co-Branding Rules
- White background requirement for partner logos
- Logo placement and sizing rules for co-branded pages

### 9. Download PDF Button
Generate a branded PDF using jsPDF (pattern already exists in `calculatorPdfGenerator.ts`) containing all guidelines in a polished, shareable format.

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/pages/BrandGuidelines.tsx` | New page with all brand guideline sections |
| `src/lib/brandGuidelinesPdf.ts` | PDF generator for downloadable brand book |
| `src/App.tsx` | Add route `/brand-guidelines` |

## Technical Notes
- Reuses existing design tokens from `index.css` and `tailwind.config.ts` — no new dependencies
- PDF generation follows the existing `calculatorPdfGenerator.ts` pattern using jsPDF
- Color swatches will show actual rendered colors using inline styles from CSS variables
- Page will include the standard Header/Footer layout

