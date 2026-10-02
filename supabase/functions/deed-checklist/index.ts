import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

const hits = new Map<string, number[]>();
const Body = z.object({ description: z.string().trim().min(10).max(1500) });
const RUN = "X-Lovable-AIG-Run-ID";

const SYSTEM = `You help California clients and insurance agents prepare a living-trust deed transfer, homestead declaration, and/or mobile notary request handled by TFA's Legal Document Assistants.
Produce a personalized checklist of details and documents to GATHER before submitting. Baseline items: current recorded deed (copy), APN, full property address and county, exact names of current owners as on deed, how title is held (vesting), trust name and date and trustee names, new grantee vesting, reason for transfer / documentary transfer tax exemption, mailing address for tax statements, government ID for signers, for homestead: confirmation it is the owner's primary residence; for notary: who signs, location, availability. Add items specific to the description (e.g. death certificate for deceased co-owner, entity documents for LLC, lender info, multiple parcels).
Output ONLY markdown in exactly this shape, omitting empty groups:
## Documents to find
- **Item** — one short reason
## Owner and title details
## Trust details
## Homestead and notary items
Keep each item under 25 words, 4–20 items total. Never give legal advice, tax advice, or prices.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const json = (b: unknown, s: number) =>
    new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "x";
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (list.length >= 6) return json({ error: "Too many requests, try again in a minute." }, 429);
  hits.set(ip, [...list, now]);

  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }
  const p = Body.safeParse(body);
  if (!p.success) return json({ error: "Please describe the property in 10–1,500 characters." }, 400);

  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return json({ error: "Checklist assistant is not configured." }, 500);

  let upstream: Response;
  try {
    upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      signal: req.signal,
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low", summary: "auto" },
        include: ["reasoning.encrypted_content"],
        input: [
          { role: "system", content: SYSTEM },
          { role: "user", content: p.data.description },
        ],
      }),
    });
  } catch (e) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    console.error("[deed-checklist] fetch", e);
    return json({ error: "Checklist assistant is unavailable right now." }, 502);
  }

  if (!upstream.ok || !upstream.body) {
    const t = await upstream.text();
    console.error(`[deed-checklist] gateway ${upstream.status}: ${t}`);
    let msg = "Checklist assistant is unavailable right now.";
    if (upstream.status === 429) msg = "Too many requests, try again in a minute.";
    try { const j = JSON.parse(t); if (upstream.status !== 500 && (j?.message || j?.error?.message)) msg = j.message ?? j.error.message; } catch { /* keep */ }
    return json({ error: msg }, upstream.status);
  }

  // Convert SSE into a plain-text stream of answer deltas.
  const dec = new TextDecoder(), enc = new TextEncoder();
  let buf = "";
  const out = upstream.body.pipeThrough(new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, ctrl) {
      buf += dec.decode(chunk, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const l of lines) {
        if (!l.startsWith("data:")) continue;
        const d = l.slice(5).trim();
        if (!d || d === "[DONE]") continue;
        try {
          const ev = JSON.parse(d);
          if (ev.type === "response.output_text.delta" && ev.delta) ctrl.enqueue(enc.encode(ev.delta));
          if (ev.type === "response.failed" || ev.type === "error") ctrl.enqueue(enc.encode("\n\n[[ERROR]]"));
        } catch { /* partial */ }
      }
    },
  }));
  const headers = new Headers({ ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" });
  const run = upstream.headers.get(RUN);
  if (run) headers.set(RUN, run);
  return new Response(out, { status: 200, headers });
});
