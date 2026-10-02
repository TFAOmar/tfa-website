import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FileText, Home, Stamp, Check, Minus, Plus, Upload, X, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SEOHead } from "@/components/seo";
import SmsConsentCheckbox from "@/components/forms/SmsConsentCheckbox";
import { useHoneypot, honeypotClassName } from "@/hooks/useHoneypot";
import { generateUUID } from "@/lib/uuid";
import { supabase } from "@/integrations/supabase/client";
import tfaLogo from "@/assets/tfa-logo.png";

const PRICE = 199;
const TRANSFER_TYPES = ["Transfer to/from trust", "Gift", "Family transfer", "Sale", "Other"];
const DOC_KINDS = [
  { key: "recorded_deed", label: "Most recent recorded deed" },
  { key: "trust_entity", label: "Trust or entity documents" },
  { key: "id", label: "Government-issued ID (optional)" },
  { key: "other", label: "Other documents" },
] as const;

type Property = Record<string, string>;
const emptyProperty = (): Property => ({
  grantorName: "", grantorDeedName: "", granteeName: "", titleHeld: "", address: "", cityStateZip: "", apn: "",
  recordingDate: "", instrumentNo: "", county: "", transferType: "Transfer to/from trust", transferOther: "", consideration: "",
  granteeMailing: "", returnAddress: "", otherOwners: "", entityHeld: "No", entityDetails: "", primaryResidence: "",
});
type Doc = { file: File; kind: string };

const STEPS = ["Services", "Contact", "Property", "Documents & pay"];

export default function DeedServices() {
  const [params] = useSearchParams();
  const [requestId] = useState(generateUUID);
  const [step, setStep] = useState(0);
  const [deeds, setDeeds] = useState(0);
  const [homesteads, setHomesteads] = useState(0);
  const [notary, setNotary] = useState(false);
  const [role, setRole] = useState<"agent" | "client">("agent");
  const [c, setC] = useState({ agentName: "", agentEmail: "", agentPhone: "", clientName: "", clientEmail: "", clientPhone: "" });
  const [props, setProps] = useState<Property[]>([emptyProperty()]);
  const [notaryInfo, setNotaryInfo] = useState({ signers: "", location: "", times: "", notes: "" });
  const [docs, setDocs] = useState<Doc[]>([]);
  const [notes, setNotes] = useState("");
  const [signature, setSignature] = useState("");
  const [sms, setSms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { honeypotProps, isBot } = useHoneypot();

  const propertyCount = Math.max(1, deeds, homesteads);
  const total = (deeds + homesteads) * PRICE;

  const syncProps = (n: number) =>
    setProps((p) => (p.length >= n ? p.slice(0, n) : [...p, ...Array.from({ length: n - p.length }, emptyProperty)]));

  const setProp = (i: number, k: string, v: string) =>
    setProps((p) => p.map((x, j) => (j === i ? { ...x, [k]: v } : x)));

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    const req = (k: string, v: string, msg = "Required") => { if (!v.trim()) e[k] = msg; };
    if (s === 0 && deeds + homesteads === 0 && !notary) e.services = "Choose at least one service.";
    if (s === 1) {
      if (role === "agent") { req("agentName", c.agentName); req("agentEmail", c.agentEmail); }
      req("clientName", c.clientName); req("clientPhone", c.clientPhone); req("clientEmail", c.clientEmail);
      for (const k of ["agentEmail", "clientEmail"] as const)
        if (c[k] && !/^\S+@\S+\.\S+$/.test(c[k])) e[k] = "Enter a valid email";
    }
    if (s === 2) {
      props.forEach((p, i) => {
        ["grantorName", "grantorDeedName", "address", "cityStateZip", "county"].forEach((k) => req(`${i}.${k}`, p[k]));
        if (deeds > i) { req(`${i}.granteeName`, p.granteeName); req(`${i}.titleHeld`, p.titleHeld); }
        if (homesteads > i && !p.primaryResidence) e[`${i}.primaryResidence`] = "Required";
      });
      if (notary) { req("n.signers", notaryInfo.signers); req("n.location", notaryInfo.location); req("n.times", notaryInfo.times); }
    }
    if (s === 3) {
      if (deeds > 0 && !docs.some((d) => d.kind === "recorded_deed")) e.docs = "Please upload the most recent recorded deed.";
      req("signature", signature, "Type your full name to confirm");
    }
    setErrors(e);
    if (Object.keys(e).length) {
      setTimeout(() => document.querySelector<HTMLElement>("[aria-invalid='true'], [data-error]")?.scrollIntoView({ block: "center", behavior: "smooth" }), 0);
    }
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate(step)) return;
    if (step === 0) syncProps(propertyCount);
    setStep(step + 1);
    window.scrollTo({ top: 0 });
  };

  const submit = async () => {
    if (!validate(3) || busy) return;
    if (isBot()) { window.location.href = "/deed-services/success"; return; }
    setBusy(true); setSubmitError("");
    try {
      const uploaded: { path: string; name: string; kind: string }[] = [];
      for (const d of docs) {
        const { data, error } = await supabase.functions.invoke("deed-upload-url", { body: { requestId, fileName: d.file.name, kind: d.kind } });
        if (error || !data?.token) throw new Error("upload");
        const up = await supabase.storage.from("deed-documents").uploadToSignedUrl(data.path, data.token, d.file);
        if (up.error) throw new Error("upload");
        uploaded.push({ path: data.path, name: d.file.name, kind: d.kind });
      }
      const { data, error } = await supabase.functions.invoke("create-deed-checkout", {
        body: {
          requestId, deedCount: deeds, homesteadCount: homesteads, notary, role, ...c,
          properties: props, notaryInfo: notary ? notaryInfo : undefined, notes, signature, smsConsent: sms, documents: uploaded,
        },
      });
      if (error || !data?.url) throw new Error("checkout");
      window.location.href = data.url; // same-tab (Safari-safe)
    } catch {
      setSubmitError("We couldn't send your request. Please check your connection and try again, or call (888) 350-5396.");
      setBusy(false);
    }
  };

  const F = ({ id, label, value, onChange, type = "text", optional, placeholder }: {
    id: string; label: string; value: string; onChange: (v: string) => void; type?: string; optional?: boolean; placeholder?: string;
  }) => (
    <div>
      <Label htmlFor={id} className="text-sm font-medium text-navy">{label}{optional && <span className="text-muted-foreground font-normal"> (optional)</span>}</Label>
      <Input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!errors[id]} className="mt-1 h-11" />
      {errors[id] && <p className="mt-1 text-sm text-destructive">{errors[id]}</p>}
    </div>
  );

  const Counter = ({ value, set, max = 10 }: { value: number; set: (n: number) => void; max?: number }) => (
    <div className="flex items-center gap-3">
      <Button type="button" variant="outline" size="icon" aria-label="Decrease" onClick={() => set(Math.max(0, value - 1))} disabled={value === 0}><Minus className="h-4 w-4" /></Button>
      <span className="w-6 text-center font-semibold text-navy" aria-live="polite">{value}</span>
      <Button type="button" variant="outline" size="icon" aria-label="Increase" onClick={() => set(Math.min(max, value + 1))}><Plus className="h-4 w-4" /></Button>
    </div>
  );

  const card = "rounded-2xl border bg-card p-5 md:p-6";

  return (
    <div className="min-h-screen bg-muted/40">
      <SEOHead title="Deed, Homestead & Notary Services | The Financial Architects" description="Request deed preparation, homestead declarations and mobile notary for your living trust." noIndex />
      <header className="bg-card border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/"><img src={tfaLogo} alt="The Financial Architects" className="h-9 w-auto" /></Link>
          <a href="tel:+18883505396" className="text-sm font-medium text-navy hover:underline">(888) 350-5396</a>
        </div>
      </header>

      <section className="bg-navy text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <p className="text-accent text-xs font-semibold tracking-widest uppercase mb-2">Living Trust Add-Ons</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3">Deed, Homestead & Notary Services</h1>
          <p className="opacity-90 max-w-xl">Answer a few questions, upload the current deed, and our in-house Legal Document Assistants take it from there — prepared remotely.</p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {params.get("canceled") && step === 0 && (
          <p className="mb-4 rounded-lg border bg-card p-3 text-sm">Payment was canceled. Your answers weren't charged — start again whenever you're ready.</p>
        )}
        <ol className="flex gap-2 mb-6" aria-label="Progress">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${i <= step ? "bg-accent" : "bg-border"}`} />
              <span className={`hidden sm:block mt-1 text-xs ${i === step ? "text-navy font-semibold" : "text-muted-foreground"}`}>{s}</span>
            </li>
          ))}
        </ol>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="mb-4 inline-flex items-center gap-1 text-sm text-navy hover:underline"><ArrowLeft className="h-4 w-4" />Back</button>
        )}

        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-navy">Which services do you need?</h2>
            {[
              { Icon: FileText, title: "Deed Preparation", desc: "Quitclaim / trust transfer deed, prepared by our LDA. One per property.", price: `$${PRICE} per deed`, v: deeds, set: setDeeds },
              { Icon: Home, title: "Homestead Declaration", desc: "Protects equity in the owner's primary residence.", price: `$${PRICE} per homestead`, v: homesteads, set: (n: number) => setHomesteads(Math.min(n, 1)), max: 1 },
            ].map(({ Icon, title, desc, price, v, set, max }) => (
              <div key={title} className={`${card} flex flex-col sm:flex-row sm:items-center gap-4 ${v ? "border-accent ring-1 ring-accent" : ""}`}>
                <Icon className="h-8 w-8 text-accent shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-navy text-lg">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                  <p className="text-sm font-semibold text-navy mt-1">{price}</p>
                </div>
                <Counter value={v} set={set} max={max} />
              </div>
            ))}
            <label className={`${card} flex items-start gap-4 cursor-pointer ${notary ? "border-accent ring-1 ring-accent" : ""}`}>
              <Stamp className="h-8 w-8 text-accent shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-navy text-lg">Mobile Notary</h3>
                <p className="text-sm text-muted-foreground">Quoted separately. Your notary sets the fee, including any travel. No charge today — our team will confirm the quote and schedule.</p>
              </div>
              <input type="checkbox" className="h-6 w-6 mt-1 accent-navy" checked={notary} onChange={(e) => setNotary(e.target.checked)} />
            </label>
            {errors.services && <p data-error className="text-sm text-destructive">{errors.services}</p>}
            <div className={`${card} flex items-center justify-between`}>
              <span className="text-navy">Due today</span>
              <span className="text-2xl font-bold text-navy">${total}</span>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-serif text-2xl font-bold text-navy">Who's filling this out?</h2>
            <div className="grid grid-cols-2 gap-3">
              {(["agent", "client"] as const).map((r) => (
                <button key={r} type="button" onClick={() => setRole(r)} aria-pressed={role === r}
                  className={`rounded-xl border-2 p-4 text-left font-semibold text-navy ${role === r ? "border-accent bg-accent/10" : "border-border bg-card"}`}>
                  {role === r && <Check className="inline h-4 w-4 mr-1" />}{r === "agent" ? "I'm a TFA agent" : "I'm the client"}
                </button>
              ))}
            </div>
            <div className={`${card} grid sm:grid-cols-2 gap-4`}>
              <h3 className="sm:col-span-2 font-semibold text-navy">{role === "agent" ? "Agent" : "Your TFA agent"}</h3>
              <F id="agentName" label="Agent name" optional={role === "client"} value={c.agentName} onChange={(v) => setC({ ...c, agentName: v })} />
              <F id="agentEmail" label="Agent email" type="email" optional={role === "client"} value={c.agentEmail} onChange={(v) => setC({ ...c, agentEmail: v })} />
              {role === "agent" && <F id="agentPhone" label="Agent phone" optional value={c.agentPhone} onChange={(v) => setC({ ...c, agentPhone: v })} />}
            </div>
            <div className={`${card} grid sm:grid-cols-2 gap-4`}>
              <h3 className="sm:col-span-2 font-semibold text-navy">Client</h3>
              <F id="clientName" label="Client full name" value={c.clientName} onChange={(v) => setC({ ...c, clientName: v })} />
              <F id="clientPhone" label="Client phone" type="tel" value={c.clientPhone} onChange={(v) => setC({ ...c, clientPhone: v })} />
              <div className="sm:col-span-2"><F id="clientEmail" label="Client email" type="email" value={c.clientEmail} onChange={(v) => setC({ ...c, clientEmail: v })} /></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-navy">Property & owner details</h2>
            <p className="text-sm text-muted-foreground -mt-4">Copy names exactly as they appear on the current recorded deed.</p>
            {props.map((p, i) => {
              const u = (k: string) => (v: string) => setProp(i, k, v);
              const isDeed = deeds > i, isHome = homesteads > i;
              return (
                <div key={i} className={`${card} space-y-5`}>
                  <h3 className="font-semibold text-navy text-lg">Property {props.length > 1 ? i + 1 : ""} <span className="text-sm font-normal text-muted-foreground">— {[isDeed && "Deed", isHome && "Homestead", notary && !isDeed && !isHome && "Notary"].filter(Boolean).join(" + ")}</span></h3>
                  <fieldset className="grid sm:grid-cols-2 gap-4">
                    <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">1. Current owner / grantor</legend>
                    <F id={`${i}.grantorName`} label="Full legal name" value={p.grantorName} onChange={u("grantorName")} />
                    <F id={`${i}.grantorDeedName`} label="Name exactly as on current deed" value={p.grantorDeedName} onChange={u("grantorDeedName")} />
                  </fieldset>
                  {isDeed && (
                    <fieldset className="grid sm:grid-cols-2 gap-4">
                      <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">2. New owner / grantee</legend>
                      <F id={`${i}.granteeName`} label="Full legal name (e.g. trustee & trust name)" value={p.granteeName} onChange={u("granteeName")} />
                      <F id={`${i}.titleHeld`} label="How title will be held" placeholder="e.g. Trustees of the Smith Family Trust" value={p.titleHeld} onChange={u("titleHeld")} />
                    </fieldset>
                  )}
                  <fieldset className="grid sm:grid-cols-2 gap-4">
                    <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">3. Property</legend>
                    <div className="sm:col-span-2"><F id={`${i}.address`} label="Property address" value={p.address} onChange={u("address")} /></div>
                    <F id={`${i}.cityStateZip`} label="City / State / ZIP" value={p.cityStateZip} onChange={u("cityStateZip")} />
                    <F id={`${i}.apn`} label="APN (Assessor's Parcel Number)" optional value={p.apn} onChange={u("apn")} />
                  </fieldset>
                  <fieldset className="grid sm:grid-cols-3 gap-4">
                    <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">4–5. Existing recorded deed</legend>
                    <F id={`${i}.county`} label="County" value={p.county} onChange={u("county")} />
                    <F id={`${i}.recordingDate`} label="Recording date" type="date" optional value={p.recordingDate} onChange={u("recordingDate")} />
                    <F id={`${i}.instrumentNo`} label="Document / instrument no." optional value={p.instrumentNo} onChange={u("instrumentNo")} />
                    <p className="sm:col-span-3 text-xs text-muted-foreground">The full legal description comes from the recorded deed you'll upload on the next step.</p>
                  </fieldset>
                  {isDeed && (
                    <>
                      <fieldset className="grid sm:grid-cols-2 gap-4">
                        <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">6. Transfer</legend>
                        <div>
                          <Label htmlFor={`${i}.transferType`} className="text-sm font-medium text-navy">Type of transfer</Label>
                          <select id={`${i}.transferType`} value={p.transferType} onChange={(e) => setProp(i, "transferType", e.target.value)} className="mt-1 h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
                            {TRANSFER_TYPES.map((t) => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        {p.transferType === "Other" ? <F id={`${i}.transferOther`} label="Describe" value={p.transferOther} onChange={u("transferOther")} />
                          : <F id={`${i}.consideration`} label="Consideration / price, if any" optional value={p.consideration} onChange={u("consideration")} />}
                      </fieldset>
                      <fieldset className="grid sm:grid-cols-2 gap-4">
                        <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">7. Mailing</legend>
                        <F id={`${i}.granteeMailing`} label="Grantee mailing address" optional value={p.granteeMailing} onChange={u("granteeMailing")} />
                        <F id={`${i}.returnAddress`} label="Return address for recorded document" optional value={p.returnAddress} onChange={u("returnAddress")} />
                      </fieldset>
                    </>
                  )}
                  <fieldset className="grid sm:grid-cols-2 gap-4">
                    <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">8. Additional</legend>
                    <F id={`${i}.otherOwners`} label="Other owners / interest holders" optional value={p.otherOwners} onChange={u("otherOwners")} />
                    <div>
                      <span className="text-sm font-medium text-navy">Currently held in a trust, LLC or other entity?</span>
                      <div className="mt-2 flex gap-2">
                        {["No", "Yes"].map((o) => (
                          <button key={o} type="button" aria-pressed={p.entityHeld === o} onClick={() => setProp(i, "entityHeld", o)}
                            className={`h-11 flex-1 rounded-md border-2 text-sm font-medium ${p.entityHeld === o ? "border-accent bg-accent/10 text-navy" : "border-border"}`}>{o}</button>
                        ))}
                      </div>
                    </div>
                    {p.entityHeld === "Yes" && <div className="sm:col-span-2"><F id={`${i}.entityDetails`} label="Entity name and details" value={p.entityDetails} onChange={u("entityDetails")} /></div>}
                    {isHome && (
                      <div className="sm:col-span-2" data-error={errors[`${i}.primaryResidence`] ? true : undefined}>
                        <span className="text-sm font-medium text-navy">Is this the owner's primary residence? (needed for homestead)</span>
                        <div className="mt-2 flex gap-2">
                          {["Yes", "No"].map((o) => (
                            <button key={o} type="button" aria-pressed={p.primaryResidence === o} onClick={() => setProp(i, "primaryResidence", o)}
                              className={`h-11 flex-1 rounded-md border-2 text-sm font-medium ${p.primaryResidence === o ? "border-accent bg-accent/10 text-navy" : "border-border"}`}>{o}</button>
                          ))}
                        </div>
                        {errors[`${i}.primaryResidence`] && <p className="mt-1 text-sm text-destructive">Please choose an answer</p>}
                      </div>
                    )}
                  </fieldset>
                </div>
              );
            })}
            {notary && (
              <div className={`${card} grid sm:grid-cols-2 gap-4`}>
                <h3 className="sm:col-span-2 font-semibold text-navy text-lg">Notary scheduling</h3>
                <F id="n.signers" label="Signer name(s)" value={notaryInfo.signers} onChange={(v) => setNotaryInfo({ ...notaryInfo, signers: v })} />
                <F id="n.location" label="Signing address" value={notaryInfo.location} onChange={(v) => setNotaryInfo({ ...notaryInfo, location: v })} />
                <div className="sm:col-span-2"><F id="n.times" label="Preferred dates & times" placeholder="e.g. Weekday evenings after 5pm" value={notaryInfo.times} onChange={(v) => setNotaryInfo({ ...notaryInfo, times: v })} /></div>
                <div className="sm:col-span-2">
                  <Label htmlFor="n.notes" className="text-sm font-medium text-navy">Notes for the notary <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Textarea id="n.notes" rows={2} maxLength={1000} value={notaryInfo.notes} onChange={(e) => setNotaryInfo({ ...notaryInfo, notes: e.target.value })} className="mt-1" />
                </div>
                <p className="sm:col-span-2 text-xs text-muted-foreground">Our team will contact you with the notary's fee (including any travel) before booking.</p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-serif text-2xl font-bold text-navy">Documents & review</h2>
            <div className={`${card} space-y-3`} data-error={errors.docs ? true : undefined}>
              {DOC_KINDS.map(({ key, label }) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">{label}{key === "recorded_deed" && deeds > 0 && <span className="text-destructive"> *</span>}</p>
                    {docs.filter((d) => d.kind === key).map((d) => (
                      <p key={d.file.name + d.file.size} className="text-xs text-muted-foreground flex items-center gap-1">
                        {d.file.name}
                        <button type="button" aria-label={`Remove ${d.file.name}`} onClick={() => setDocs(docs.filter((x) => x !== d))}><X className="h-3 w-3" /></button>
                      </p>
                    ))}
                  </div>
                  <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border px-3 text-sm font-medium text-navy hover:bg-muted">
                    <Upload className="h-4 w-4" />Add file
                    <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx" className="sr-only"
                      onChange={(e) => {
                        const files = Array.from(e.target.files ?? []).filter((f) => f.size <= 20 * 1024 * 1024);
                        setDocs([...docs, ...files.map((file) => ({ file, kind: key }))]);
                        e.target.value = "";
                      }} />
                  </label>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">PDF, photo or Word, up to 20MB each. Phone photos of the deed are fine if every page is readable.</p>
              {errors.docs && <p className="text-sm text-destructive">{errors.docs}</p>}
            </div>

            <div className={card}>
              <Label htmlFor="notes" className="text-sm font-medium text-navy">Anything else our LDA should know? <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Textarea id="notes" rows={3} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" />
            </div>

            <div className={`${card} space-y-2`}>
              <h3 className="font-semibold text-navy">Summary</h3>
              {deeds > 0 && <div className="flex justify-between text-sm"><span>Deed preparation × {deeds}</span><span>${deeds * PRICE}</span></div>}
              {homesteads > 0 && <div className="flex justify-between text-sm"><span>Homestead declaration × {homesteads}</span><span>${homesteads * PRICE}</span></div>}
              {notary && <div className="flex justify-between text-sm"><span>Mobile notary</span><span className="text-muted-foreground">Quoted separately</span></div>}
              <div className="flex justify-between border-t pt-2 font-bold text-navy"><span>Due today</span><span>${total}</span></div>
              <p className="text-xs text-muted-foreground">Client: {c.clientName} · {props.length} propert{props.length > 1 ? "ies" : "y"}</p>
            </div>

            <div className={`${card} space-y-4`}>
              <F id="signature" label="Type your full name to confirm this information is accurate" value={signature} onChange={setSignature} />
              <SmsConsentCheckbox checked={sms} onChange={setSms} />
              <input type="text" name="deed_hp_ref" className={honeypotClassName} {...honeypotProps} />
              <p className="text-xs text-muted-foreground">This form collects information for document preparation by a Legal Document Assistant. It is not legal advice. Recording requirements, transfer-tax issues, ownership changes, notarization and county-specific requirements are verified before filing.</p>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3" aria-live="polite">
          {submitError && <p role="alert" className="text-sm text-destructive">{submitError}</p>}
          {Object.keys(errors).length > 0 && step > 0 && <p className="text-sm text-destructive">Please check the highlighted fields above.</p>}
          {step < 3 ? (
            <Button onClick={next} className="btn-primary-cta w-full h-12 text-base">Continue</Button>
          ) : (
            <Button onClick={submit} disabled={busy} className="btn-primary-cta w-full h-12 text-base">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending…</> : total > 0 ? `Continue to payment — $${total}` : "Submit notary request"}
            </Button>
          )}
        </div>
      </main>

      <footer className="border-t bg-card mt-10">
        <div className="max-w-3xl mx-auto px-4 py-6 text-center text-xs text-muted-foreground space-y-1">
          <p>© {new Date().getFullYear()} The Financial Architects. All rights reserved.</p>
          <p>Document preparation services are not a substitute for legal advice from an attorney. <Link to="/privacy-policy" className="underline">Privacy Policy</Link></p>
        </div>
      </footer>
    </div>
  );
}
