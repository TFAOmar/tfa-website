/**
 * Single submission entry point for the /rise contact step.
 *
 * Controlled by RISE_FORM_MODE in src/config/rise.config.ts.
 *  - "mock": validates, logs the payload, returns success. Nothing is sent.
 *  - "live": TODO — POST the same payload to Joshua + Mackenzie's GoHighLevel
 *    inbound webhook (and email notification to Mackenzie). No other TFA form
 *    handler, Supabase table, or external service is involved.
 */

import { RISE_FORM_MODE } from "@/config/rise.config";
import type { RiseAnswers } from "./questions";
import type { RiseSummaryItem } from "./summary";

export interface RiseLeadPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  /** "Who is your real estate agent?" — required on the contact step. */
  agentName: string;
  preferredContact: "call" | "text" | "email";
  answers: RiseAnswers;
  summary: { id: string; heading: string }[];
  /** Referring Rise agent from ?ref= — captured silently. */
  ref: string | null;
  source: "/rise";
  submittedAt: string;
}

export interface RiseSubmitResult {
  ok: boolean;
  id: string;
}

export async function submitRiseLead(payload: RiseLeadPayload): Promise<RiseSubmitResult> {
  if (RISE_FORM_MODE === "mock") {
    await new Promise((r) => setTimeout(r, 650));
    // eslint-disable-next-line no-console
    console.info("[rise] submitRiseLead (mock — not sent) →", payload);
    return { ok: true, id: `rise-mock-${Date.now()}` };
  }

  // TODO (live): send `payload` to the GoHighLevel inbound webhook.
  throw new Error("RISE_FORM_MODE is 'live' but no destination is configured yet.");
}
