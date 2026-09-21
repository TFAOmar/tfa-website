/**
 * Mocked lead submission for the /rise concept page.
 *
 * TODO (backend, not wired in this concept):
 *  1. POST this payload to Joshua + Makenzie's GoHighLevel inbound webhook.
 *  2. Send an email notification to Makenzie with the assessment summary.
 * No credentials, external APIs, or Supabase calls are used here.
 */

export interface RiseLeadPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: "phone" | "text" | "email";
  interests: string[];
  notes?: string;
  consent: boolean;
  assessment: Record<string, string>;
  source: string;
  submittedAt: string;
}

export interface SubmitLeadResult {
  ok: boolean;
  id: string;
}

export async function submitLead(payload: RiseLeadPayload): Promise<SubmitLeadResult> {
  // Simulated network latency so the UI success state is exercised realistically.
  await new Promise((resolve) => setTimeout(resolve, 700));

  // eslint-disable-next-line no-console
  console.info("[rise] submitLead (mock) →", payload);

  return { ok: true, id: `rise-${Date.now()}` };
}
