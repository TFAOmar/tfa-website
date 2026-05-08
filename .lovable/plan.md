## Add Estate Planning and Business Planning to Cayla Dee Porter

Update `src/pages/AdvisorCaylaDeePorter.tsx`:

1. Add `FileText` (already imported) and `Building2` icons to the lucide-react imports (Building2 is new).
2. Add two new entries to the `services` array (rendered in the "How I Can Help You" section as a 2-col grid — adding two keeps it balanced):
   - **Estate Planning** (icon: FileText) — "Protect your legacy and ensure your wealth transfers efficiently to your loved ones with proper estate planning strategies, including trusts, beneficiary designations, and legacy preservation."
   - **Business Planning** (icon: Building2) — "Strategic planning for business owners, including succession planning, key person protection, buy-sell agreements, and tax-efficient strategies to safeguard your business and its future."
3. Add "Estate Planning" and "Business Planning" to the `specialties` array so they appear as badges in the About section and in SEO keywords.
4. Update the SEO `description` and `keywords` in `SEOHead` and the hero subhead intro to reflect the expanded specialties.

No other files affected.