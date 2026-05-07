## Plan: Condition-Specific Medical Follow-Up Questions

Replace the current "select condition" checkboxes with tailored follow-up questions that appear when a user selects a condition. Underwriters need specifics (diagnosis date, control status, treatment, A1C, last episode, etc.) — not just a yes/no.

### Approach

When a user selects a medical condition in Step 2, an inline detail panel expands beneath the condition with the follow-up questions specific to it. Data is stored as a structured object keyed by condition.

### Condition → Follow-up questions

| Condition | Follow-ups |
|---|---|
| **Diabetes** | Type (1 / 2 / Gestational); Year diagnosed; Most recent A1C; On insulin? (Y/N); Any complications (neuropathy, retinopathy, kidney)? |
| **Heart Disease** | Specific diagnosis (CAD, heart attack, bypass, stent, arrhythmia, other); Year of event/diagnosis; Treatment (medication / surgery / stent / pacemaker); Currently symptomatic? |
| **Cancer** | Type/site; Year diagnosed; Stage (I–IV / unknown); Treatment (surgery, chemo, radiation, immunotherapy); In remission? Year remission began |
| **Stroke / TIA** | Stroke or TIA?; Year; Any residual deficits?; On blood thinners? |
| **High Blood Pressure** | Year diagnosed; Controlled with medication? (Y/N); Most recent reading |
| **High Cholesterol** | Year diagnosed; On statin/medication?; Most recent total cholesterol/LDL if known |
| **Asthma / COPD** | Which one?; Severity (mild / moderate / severe); On daily controller medication?; ER visit or hospitalization in past 2 years? |
| **Mental Health** | Condition (depression, anxiety, bipolar, PTSD, other); On medication?; Any hospitalization or suicide attempt? Year if yes |
| **Autoimmune** | Specific condition (lupus, RA, MS, Crohn's, etc.); Year diagnosed; Currently on immunosuppressants/biologics?; Flare in past 12 months? |
| **Kidney Disease** | Stage (1–5 / unknown); On dialysis? (Y/N); Cause (diabetes, HBP, other) |

### Files to change

**`src/types/prequalificationApplication.ts`**
- Add a `conditionDetails` record on `step2Schema`: `z.record(z.string(), z.record(z.string(), z.string())).optional()` — keyed by condition name → `{ field: value }`.
- Export per-condition field definitions (label, type: `text | select | year | radio`, options) as a constant `CONDITION_FOLLOWUPS` so the UI is data-driven.

**`src/components/prequalification/steps/Step2HealthLifestyle.tsx`**
- After each checked condition, render an expandable card with that condition's follow-up fields driven by `CONDITION_FOLLOWUPS`.
- Read/write into `conditionDetails[condition][fieldKey]` via `setValue` / `watch`.
- When a condition is unchecked, clear its details.

**`src/components/prequalification/steps/Step4ReviewSubmit.tsx`**
- Under "Medical Conditions" in the review card, render a sub-list per selected condition showing each follow-up answer.

**`supabase/functions/send-prequalification-notification/index.ts`**
- Update the email template to render the condition-specific details (each condition as a sub-section with its Q&A) so advisors see underwriting-relevant data, not just a list of checkboxes.

### Notes
- All fields are optional at the schema level (we don't want to block submission if someone skips a follow-up), but the UI gently prompts for each. We can tighten validation later if needed.
- The data structure is forward-compatible: adding new conditions or questions only requires editing `CONDITION_FOLLOWUPS`.
- Existing drafts in `localStorage` remain compatible — `conditionDetails` simply starts empty.