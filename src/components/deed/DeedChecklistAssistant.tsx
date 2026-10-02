import { useRef, useState } from "react";
import { Loader2, Sparkles, Square, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/deed-checklist`;
const MAX = 1500;

type Group = { title: string; items: { label: string; reason: string }[] };

function parse(md: string): Group[] {
  const groups: Group[] = [];
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("## ")) groups.push({ title: line.slice(3).trim(), items: [] });
    else if (line.startsWith("- ")) {
      if (!groups.length) groups.push({ title: "To gather", items: [] });
      const text = line.slice(2).replace(/\*\*/g, "");
      const [label, ...rest] = text.split(/\s[—–-]\s/);
      groups[groups.length - 1].items.push({ label: label.trim(), reason: rest.join(" — ").trim() });
    }
  }
  return groups.filter((g) => g.items.length);
}

export default function DeedChecklistAssistant() {
  const [text, setText] = useState("");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});
  const abort = useRef<AbortController | null>(null);

  const run = async () => {
    if (text.trim().length < 10) { setError("Please add a little more detail (at least 10 characters)."); return; }
    setError(""); setOut(""); setDone({}); setBusy(true);
    const ac = new AbortController(); abort.current = ac;
    try {
      const res = await fetch(URL, {
        method: "POST",
        signal: ac.signal,
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify({ description: text }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "The checklist assistant is unavailable right now.");
        return;
      }
      const reader = res.body.getReader(); const dec = new TextDecoder(); let acc = "";
      for (;;) {
        const { value, done: d } = await reader.read();
        if (d) break;
        acc += dec.decode(value, { stream: true });
        if (acc.includes("[[ERROR]]")) { setError("The checklist couldn't be finished. Please try again."); acc = acc.replace("[[ERROR]]", ""); }
        setOut(acc);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError("The checklist assistant is unavailable right now.");
    } finally { setBusy(false); abort.current = null; }
  };

  const groups = parse(out);

  return (
    <section className="rounded-xl border border-gold/40 bg-gold/5 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-navy mt-0.5 shrink-0" aria-hidden />
        <div>
          <h3 className="font-semibold text-navy">Not sure what you need? Get a personalized checklist</h3>
          <p className="text-sm text-muted-foreground">Optional. Nothing you type here is saved or sent to our team.</p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="deed-ai-desc">Describe the property and what you want done</Label>
        <Textarea id="deed-ai-desc" rows={3} maxLength={MAX} value={text} onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Duplex in Riverside, owned with my late husband, moving it into our family trust, also want a homestead." />
        <p className="text-xs text-muted-foreground text-right">{text.length}/{MAX}</p>
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={run} disabled={busy} className="min-h-11">
          {busy ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Building…</> : "Build my checklist"}
        </Button>
        {busy && <Button type="button" variant="outline" className="min-h-11" onClick={() => abort.current?.abort()}><Square className="h-4 w-4 mr-2" />Stop</Button>}
      </div>
      <div aria-live="polite">
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {groups.map((g) => (
          <div key={g.title} className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{g.title}</h4>
            <ul className="space-y-2">
              {g.items.map((it, j) => {
                const k = `${g.title}-${j}`;
                return (
                  <li key={k}>
                    <label className="flex items-start gap-3 rounded-md bg-background border p-3 cursor-pointer min-h-11">
                      <input type="checkbox" className="sr-only peer" checked={!!done[k]} onChange={(e) => setDone((d) => ({ ...d, [k]: e.target.checked }))} />
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-navy peer-checked:bg-navy peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
                        {done[k] && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                      </span>
                      <span className="text-sm"><span className={`font-medium text-navy ${done[k] ? "line-through opacity-60" : ""}`}>{it.label}</span>{it.reason && <span className="block text-muted-foreground">{it.reason}</span>}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">This is a guide only, not legal advice. Your LDA confirms final requirements.</p>
    </section>
  );
}
