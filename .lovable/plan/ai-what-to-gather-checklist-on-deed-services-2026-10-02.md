# AI "What to gather" checklist on Deed Services

## What the user sees
On /deed-services, a new optional panel at the top of the Property step, titled "Not sure what you need? Get a personalized checklist":
- One text box: "Describe the property and what you want done", e.g. "Duplex in Riverside, owned with my late husband, moving it into our family trust, also want a homestead."
- A "Build my checklist" button. The checklist then appears as it's written: grouped items (Documents to find, Owner and title details, Trust details, Homestead and notary items), each with a short reason and a tick box.
- Ticking items is just for their own tracking. Nothing is sent to the LDAs, and the panel doesn't change the form or prices.
- A note under the panel: "This is a guide only, not legal advice. Your LDA confirms final requirements."
- Clear messages if it's busy ("Too many requests, try again in a minute") or unavailable. A Stop button cancels while it's writing.

## Guardrails
- Up to 1,500 characters. Rate-limited per visitor in the same way as the other deed functions.
- The prompt tells the AI to follow California deed, homestead and notary practice, to use our existing checklist questions as the baseline, and never to give legal advice or quote prices.
- Nothing typed in the panel is saved.

## Technical details
- New edge function `deed-checklist` (Supabase, Deno) that calls the Lovable AI Gateway Responses API with `openai/gpt-6-astra`, through the AI SDK (`npm:ai`, `npm:@ai-sdk/openai` `.responses`), and streams the reply. Settings: forceReasoning, reasoningEffort "low", reasoningSummary "auto", store false, include encrypted reasoning. A per-request run-ID fetch helper is copied from the gateway skill.
- The AI returns markdown with fixed `##` group headings and `- ` items. The client parses the stream into tick-box rows. It doesn't use a structured-output schema, which keeps responses fast and robust.
- Uses the existing IP rate-limit helper (about 6 per minute). Input is validated (length, non-empty). Gateway errors pass their 402/403/429 status and message through, with no automatic retries. Stop works through an AbortController, and a cancelled request returns status 499.
- New component `src/components/deed/DeedChecklistAssistant.tsx`, mounted in `DeedServices.tsx` on the Property step. Its own state only, with no change to form data, validation or checkout.
- If needed: enable Lovable AI / LOVABLE_API_KEY, then deploy the function and check it with a real sample description before calling it done.
