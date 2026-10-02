# Send the client's checklist to the LDAs

## What the user sees
- The checklist panel on the Property step stays the same. Each item now has a tick box labeled "I have this / will provide".
- A new "Your checklist" section on the "Documents & pay" step, above "Anything else our LDA should know?":
  - It lists every checklist item from the panel, already ticked as the person left it, so they can change any tick there.
  - Each item gets an optional short note box (up to 200 characters), e.g. "APN 123-456-789" or "Death certificate coming Monday".
  - If no checklist was built, the section says "No checklist built — optional" with a link back to the Property step.
- The note under the panel changes to: "Items you tick on the review step are sent to our LDA team."

## What the LDAs get
- The request email and the PDF summary get a "Client checklist" section. Items are grouped as in the panel, each marked "Ready" or "Still needed", with the person's note if they left one.
- Their original description is included too, so the LDA has the context.

## Technical details
- `DeedChecklistAssistant` gains `value`/`onChange` props. Its state (description, groups, checked, notes) moves up into `DeedServices.tsx`, so it carries from the Property step to the review step.
- The submit payload adds `checklist: { description, items: [{ group, label, reason, ready, note }] }`. The items list is capped at 30 entries and each text is trimmed.
- `create-deed-checkout` validates the checklist with zod (optional; string lengths capped) and stores it in `form_data.checklist`. There is no database change: `form_data` is already a jsonb column.
- `_shared/deedNotify.ts` adds the checklist section to the email (HTML-escaped, like the other sections) and to the PDF.
- Redeploy `create-deed-checkout` and `verify-deed-payment`, which both send the email. Then send one labeled "TEST — please ignore" notary-only request with a checklist, confirm it is saved in `form_data`, and delete it.
