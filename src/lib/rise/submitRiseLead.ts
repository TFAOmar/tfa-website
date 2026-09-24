/**
 * Single submission entry point for the /rise contact step.
 *
 * Controlled by RISE_FORM_MODE in src/config/rise.config.ts.
 *  - "mock": validates, logs the payload, returns success. Nothing is sent.
 *  - "live": POSTs a reshaped JSON body (see buildGhlBody) to Joshua +
 *    Mackenzie's GoHighLevel inbound webhook. No other TFA form handler,
 *    Supabase table, or external service is involved.
 */

import { RISE_FORM_MODE, RISE_GHL_WEBHOOK_URL } from "@/config/rise.config";
import { RISE_QUESTIONS, type RiseAnswers } from "./questions";

export interface RiseLeadPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  /** "Who is your real estate agent?" — required on the contact step. */
  agentName: string;
  preferredContact: "call" | "text" | "email";
  contactConsent: boolean;
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

const ANSWER_KEYS: Record<string, string> = {
  plan: "q1",
  titled: "q1b",
  dependents: "q2",
  guardian: "q2b",
  authority: "q3",
  mortgage: "q4",
  life: "q5",
  retirement: "q6",
};

const formatPhone = (raw: string): string => {
  const d = raw.replace(/\D/g, "");
  if (d.length === 10) return `+1${d}`;
  if (d.length === 11 && d.startsWith("1")) return `+${d}`;
  return raw.trim();
};

const CONTACT_LABEL = { call: "Call", text: "Text", email: "Email" } as const;

export function buildGhlBody(payload: RiseLeadPayload) {
  const answers: Record<string, string> = {};
  for (const [id, key] of Object.entries(ANSWER_KEYS)) {
    const q = RISE_QUESTIONS.find((x) => x.id === id);
    const v = payload.answers[id];
    const vals = Array.isArray(v) ? v : v ? [v] : [];
    answers[key] = vals
      .map((val) => q?.options.find((o) => o.value === val)?.label ?? val)
      .join("; ");
  }
  return {
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim(),
    phone: formatPhone(payload.phone),
    preferredContact: CONTACT_LABEL[payload.preferredContact],
    agentName: payload.agentName.trim(),
    ref: payload.ref ?? "",
    answers,
    summaryItems: payload.summary.map((s) => s.heading).join("; "),
    source: "tfawealthplanning.com/rise",
    contactConsent: payload.contactConsent ? "Yes" : "No",
  };
}

export async function submitRiseLead(payload: RiseLeadPayload): Promise<RiseSubmitResult> {
  if (RISE_FORM_MODE === "mock") {
    await new Promise((r) => setTimeout(r, 650));
    // eslint-disable-next-line no-console
    console.info("[rise] submitRiseLead (mock — not sent) →", payload);
    return { ok: true, id: `rise-mock-${Date.now()}` };
  }

  const fail = (reason: string): RiseSubmitResult => {
    // eslint-disable-next-line no-console
    console.error("[rise] submit failed:", reason);
    return { ok: false, id: "" };
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(RISE_GHL_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildGhlBody(payload)),
      signal: controller.signal,
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) return fail(`HTTP ${res.status}`);
    try {
      const json = JSON.parse(text);
      if (json && typeof json.status === "string" && json.status.startsWith("Error")) {
        return fail(`HTTP ${res.status} — ${json.status}`);
      }
    } catch {
      // Non-JSON 2xx counts as success.
    }
    return { ok: true, id: `rise-${Date.now()}` };
  } catch (err) {
    const aborted = (err as Error)?.name === "AbortError";
    return fail(aborted ? "timeout after 15s" : `network error: ${(err as Error)?.message ?? "unknown"}`);
  } finally {
    clearTimeout(timer);
  }
}
