import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const hits = new Map<string, number[]>();

const Body = z.object({
  requestId: z.string().uuid(),
  fileName: z.string().min(1).max(200),
  kind: z.enum(["recorded_deed", "trust_entity", "id", "other"]),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "x";
    const now = Date.now();
    const list = (hits.get(ip) ?? []).filter((t) => now - t < 600_000);
    if (list.length >= 40) return json({ error: "Too many uploads, try again later." }, 429);
    hits.set(ip, [...list, now]);

    const p = Body.safeParse(await req.json());
    if (!p.success) return json({ error: "Invalid upload request" }, 400);
    const safe = p.data.fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100);
    const path = `${p.data.requestId}/${p.data.kind}-${crypto.randomUUID().slice(0, 8)}-${safe}`;

    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data, error } = await sb.storage.from("deed-documents").createSignedUploadUrl(path);
    if (error) throw error;
    return json({ path, token: data.token });
  } catch (e) {
    console.error("[deed-upload-url]", e);
    return json({ error: "Upload unavailable" }, 500);
  }
});
