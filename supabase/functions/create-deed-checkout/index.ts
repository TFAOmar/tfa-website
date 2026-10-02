import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { notifyLda } from "../_shared/deedNotify.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const DEED_PRICE = "price_1UMDanI5s9xwrb3e5p8sHuB9";
const HOMESTEAD_PRICE = "price_1UMDarI5s9xwrb3eTo0SUUnE";
const UNIT = 19900;
const ALLOWED = ["https://tfawealthplanning.com", "https://www.tfawealthplanning.com", "https://tfawealthplanning.lovable.app", "https://tfainsuranceadvisors.com", "https://www.tfainsuranceadvisors.com"];
const hits = new Map<string, number[]>();

const s = (max: number) => z.string().trim().max(max).optional().default("");
const Property = z.object({
  grantorName: z.string().trim().min(1).max(200), grantorDeedName: z.string().trim().min(1).max(300),
  granteeName: s(200), titleHeld: s(200),
  address: z.string().trim().min(1).max(300), cityStateZip: z.string().trim().min(1).max(200), apn: s(60),
  recordingDate: s(40), instrumentNo: s(80), county: z.string().trim().min(1).max(80),
  transferType: s(60), transferOther: s(200), consideration: s(100),
  granteeMailing: s(300), returnAddress: s(300), otherOwners: s(500),
  entityHeld: s(5), entityDetails: s(500), primaryResidence: s(5),
});
const Body = z.object({
  requestId: z.string().uuid(),
  deedCount: z.number().int().min(0).max(10),
  homesteadCount: z.number().int().min(0).max(10),
  notary: z.boolean(),
  role: z.enum(["agent", "client"]),
  agentName: s(120), agentEmail: z.string().trim().email().max(255).optional().or(z.literal("")),
  agentPhone: s(40),
  clientName: z.string().trim().min(1).max(120), clientEmail: z.string().trim().email().max(255),
  clientPhone: z.string().trim().min(7).max(40),
  properties: z.array(Property).min(1).max(10),
  notaryInfo: z.object({ signers: s(300), location: s(300), times: s(300), notes: s(1000) }).optional(),
  notes: s(2000),
  signature: z.string().trim().min(2).max(120),
  smsConsent: z.boolean(),
  documents: z.array(z.object({ path: z.string().max(400), name: z.string().max(200), kind: z.string().max(30) })).max(30),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (b: unknown, st = 200) => new Response(JSON.stringify(b), { status: st, headers: { ...cors, "Content-Type": "application/json" } });
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "x";
    const now = Date.now();
    const list = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
    if (list.length >= 8) return json({ error: "Too many requests, please try again later." }, 429);
    hits.set(ip, [...list, now]);

    const p = Body.safeParse(await req.json());
    if (!p.success) return json({ error: "Please check the form", details: p.error.flatten().fieldErrors }, 400);
    const b = p.data;
    if (b.deedCount + b.homesteadCount === 0 && !b.notary) return json({ error: "Choose at least one service" }, 400);
    if (b.documents.some((d) => !d.path.startsWith(`${b.requestId}/`))) return json({ error: "Invalid documents" }, 400);

    const services = [b.deedCount && "deed", b.homesteadCount && "homestead", b.notary && "notary"].filter(Boolean) as string[];
    const amount = (b.deedCount + b.homesteadCount) * UNIT;
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { error: insErr } = await sb.from("deed_service_requests").insert({
      id: b.requestId, services, deed_count: b.deedCount, homestead_count: b.homesteadCount, notary_requested: b.notary,
      submitter_role: b.role, agent_name: b.agentName || null, agent_email: b.agentEmail || null, agent_phone: b.agentPhone || null,
      client_name: b.clientName, client_email: b.clientEmail, client_phone: b.clientPhone,
      form_data: { properties: b.properties, notary: b.notary ? b.notaryInfo : null, notes: b.notes, signature: b.signature },
      documents: b.documents, amount_cents: amount, sms_consent: b.smsConsent,
      status: amount === 0 ? "submitted" : "pending",
    });
    if (insErr) throw insErr;

    const reqOrigin = req.headers.get("origin") ?? "";
    const origin = ALLOWED.includes(reqOrigin) || reqOrigin.endsWith(".lovable.app") ? reqOrigin : ALLOWED[0];

    if (amount === 0) {
      await notifyLda(sb, b.requestId);
      return json({ url: `${origin}/deed-services/success?request=${b.requestId}` });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2025-08-27.basil" });
    const line_items = [] as { price: string; quantity: number }[];
    if (b.deedCount) line_items.push({ price: DEED_PRICE, quantity: b.deedCount });
    if (b.homesteadCount) line_items.push({ price: HOMESTEAD_PRICE, quantity: b.homesteadCount });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: b.role === "agent" && b.agentEmail ? b.agentEmail : b.clientEmail,
      client_reference_id: b.requestId,
      metadata: { deed_request_id: b.requestId },
      success_url: `${origin}/deed-services/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/deed-services?canceled=1`,
    });
    await sb.from("deed_service_requests").update({ stripe_session_id: session.id }).eq("id", b.requestId);
    return json({ url: session.url });
  } catch (e) {
    console.error("[create-deed-checkout]", e);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
