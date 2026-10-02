import { useRef, useState } from "react";
import { Loader2, Sparkles, Square, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/deed-checklist`;
const MAX = 1500;

export type ChecklistItem = { group: string; label: string; reason: string; ready: boolean; note: string };
export type ChecklistState = { description: string; items: ChecklistItem[] };
export const emptyChecklist: ChecklistState = { description: "", items: [] };

function parse(md: string, prev: ChecklistItem[]): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  let group = "To gather";
  for (const raw of md.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("## ")) group = line.slice(3).trim();
    else if (line.startsWith("- ")) {
      const text = line.slice(2).replace(/\*\*/g, "");
      const [label, ...rest] = text.split(/\s[—–-]\s/);
      const i = items.length;
      items.push({ group, label: label.trim(), reason: rest.join(" — ").trim(), ready: prev[i]?.ready ?? false, note: prev[i]?.note ?? "" });
    }
  }
  return items.filter((i) => i.label);
}

const groupsOf = (items: ChecklistItem[]) => {
  const m = new Map<string, number[]>();
  items.forEach((it, i) => m.set(it.group, [...(m.get(it.group) ?? []), i]));
  return [...m.entries()];
};

function Tick({ checked, onChange, label, reason }: { checked: boolean; onChange: (v: boolean) => void; label: string; reason?: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer min-h-11">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-label={`I have this / will provide: ${label}`} />
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-navy peer-checked:bg-navy peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
        {checked && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
      </span>
      <span className="text-sm">
        <span className="font-medium text-navy">{label}</span>
        {reason && <span className="block text-muted-foreground">{reason}</span>}
        <span className="block text-xs text-muted-foreground mt-0.5">{checked ? "I have this / will provide" : "Tick if you have this or will provide it"}</span>
      </span>
    </label>
  );
}

type Props = { value: ChecklistState; onChange: (v: ChecklistState) => void };

export default function DeedChecklistAssistant({ value, onChange }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const abort = useRef<AbortController | null>(null);
  const latest = useRef(value); latest.current = value;

  const setItem = (i: number, patch: Partial<ChecklistItem>) =>
    onChange({ ...value, items: value.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) });

  const run = async () => {
    const description = value.description;
    if (description.trim().length < 10) { setError("Please add a little more detail (at least 10 characters)."); return; }
    setError(""); onChange({ description, items: [] }); setBusy(true);
    const ac = new AbortController(); abort.current = ac;
    try {
      const res = await fetch(URL, {
        method: "POST", signal: ac.signal,
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        body: JSON.stringify({ description }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "The checklist assistant is unavailable right now.");
        return;
      }
      const reader = res.body.getReader(); const dec = new TextDecoder(); let acc = "";
      for (;;) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        acc += dec.decode(chunk, { stream: true });
        if (acc.includes("[[ERROR]]")) { setError("The checklist couldn't be finished. Please try again."); acc = acc.replace("[[ERROR]]", ""); }
        onChange({ description, items: parse(acc, latest.current.items) });
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") setError("The checklist assistant is unavailable right now.");
    } finally { setBusy(false); abort.current = null; }
  };

  return (
    <section className="rounded-xl border border-gold/40 bg-gold/5 p-5 space-y-4">
      <div className="flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-navy mt-0.5 shrink-0" aria-hidden />
        <div>
          <h3 className="font-semibold text-navy">Not sure what you need? Get a personalized checklist</h3>
          <p className="text-sm text-muted-foreground">Optional. Items you tick on the review step are sent to our LDA team.</p>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="deed-ai-desc">Describe the property and what you want done</Label>
        <Textarea id="deed-ai-desc" rows={3} maxLength={MAX} value={value.description} onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="e.g. Duplex in Riverside, owned with my late husband, moving it into our family trust, also want a homestead." />
        <p className="text-xs text-muted-foreground text-right">{value.description.length}/{MAX}</p>
      </div>
      <div className="flex gap-2">
        <Button type="button" onClick={run} disabled={busy} className="min-h-11">
          {busy ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Building…</> : value.items.length ? "Rebuild checklist" : "Build my checklist"}
        </Button>
        {busy && <Button type="button" variant="outline" className="min-h-11" onClick={() => abort.current?.abort()}><Square className="h-4 w-4 mr-2" />Stop</Button>}
      </div>
      <div aria-live="polite">
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        {groupsOf(value.items).map(([g, idx]) => (
          <div key={g} className="mt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{g}</h4>
            <ul className="space-y-2">
              {idx.map((i) => (
                <li key={i} className="rounded-md bg-background border p-3">
                  <Tick checked={value.items[i].ready} onChange={(v) => setItem(i, { ready: v })} label={value.items[i].label} reason={value.items[i].reason} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">This is a guide only, not legal advice. Your LDA confirms final requirements.</p>
    </section>
  );
}

export function ChecklistReview({ value, onChange, onBack }: Props & { onBack: () => void }) {
  const setItem = (i: number, patch: Partial<ChecklistItem>) =>
    onChange({ ...value, items: value.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) });
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-navy">Your checklist</h3>
      {!value.items.length ? (
        <p className="text-sm text-muted-foreground">
          No checklist built — optional.{" "}
          <button type="button" onClick={onBack} className="text-navy underline underline-offset-2">Build one on the Property step</button>
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">Tick what you have or will provide. Add a short note if helpful. Our LDA team receives this list.</p>
          {groupsOf(value.items).map(([g, idx]) => (
            <div key={g}>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{g}</h4>
              <ul className="space-y-2">
                {idx.map((i) => (
                  <li key={i} className="rounded-md border p-3 space-y-2">
                    <Tick checked={value.items[i].ready} onChange={(v) => setItem(i, { ready: v })} label={value.items[i].label} />
                    <Input aria-label={`Note for ${value.items[i].label}`} maxLength={200} placeholder="Note (optional)" value={value.items[i].note}
                      onChange={(e) => setItem(i, { note: e.target.value })} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
