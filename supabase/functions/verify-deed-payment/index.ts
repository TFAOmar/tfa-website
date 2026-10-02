import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";
import { notifyLda } from "../_shared/deedNotify.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (b: unknown, st = 200) => new Response(JSON.stringify(b), { status: st, headers: { ...cors, "Content-Type": "application/json" } });
  try {
    const p = z.object({ sessionId: z.string().startsWith("cs_").max(300) }).safeParse(await req.json());
    if (!p.success) return json({ error: "Invalid session" }, 400);
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2025-08-27.basil" });
    const session = await stripe.checkout.sessions.retrieve(p.data.sessionId);
    const id = session.metadata?.deed_request_id;
    if (!id) return json({ error: "Unknown request" }, 404);
    if (session.payment_status !== "paid") return json({ paid: false, ref: id.slice(0, 8).toUpperCase() });

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    await sb.from("deed_service_requests").update({ status: "paid" }).eq("id", id).eq("stripe_session_id", session.id);
    await notifyLda(sb, id);
    return json({ paid: true, ref: id.slice(0, 8).toUpperCase() });
  } catch (e) {
    console.error("[verify-deed-payment]", e);
    return json({ error: "Could not verify payment" }, 500);
  }
});
