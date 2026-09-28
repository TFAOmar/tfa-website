import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SEOHead } from "@/components/seo";
import { useHoneypot, honeypotClassName } from "@/hooks/useHoneypot";
import { generateUUID } from "@/lib/uuid";
import tfaLogo from "@/assets/tfa-logo.png";
import { getGiveaway, isGiveawayOpen } from "@/config/giveaways";
import { EMAIL_RE, suggestEmail, phoneDigits, formatPhone } from "./giveawayValidation";
import { enqueue, flushQueue, readQueue, type GiveawayEntry } from "./giveawayQueue";

const CONSENT_TEXT =
  "I agree to be contacted by The Financial Architects by phone, text, and email. Consent is not a condition of entry. Msg & data rates may apply. Reply STOP to opt out.";

const empty = { first: "", last: "", email: "", phone: "" };
type Errors = Partial<Record<keyof typeof empty, string>>;

const pacificStamp = (d: Date) =>
  d.toLocaleString("en-US", { timeZone: "America/Los_Angeles", hour12: true });

const inputCls =
  "w-full h-11 rounded-md border border-input bg-background px-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="min-h-[100dvh] bg-background flex items-center justify-center px-4 py-4">
      <SEOHead title={title} noIndex />
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}

export default function GiveawayPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const booth = params.get("booth") === "1";
  const src = params.get("src") ?? "";
  const giveaway = getGiveaway(slug);
  const open = isGiveawayOpen(giveaway);
  const { honeypotProps, isBot } = useHoneypot();

  const [form, setForm] = useState(empty);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [pending, setPending] = useState(0);
  const resetTimer = useRef<number | undefined>(undefined);

  const ac = (v: string) => (booth ? "off" : v);

  const flush = useCallback(async () => {
    if (!giveaway) return;
    setPending(readQueue(giveaway.slug).length);
    setPending(await flushQueue(giveaway.slug, giveaway.webhookUrl));
  }, [giveaway]);

  // Retry on load, on "online", and every 30s — even after endsAt.
  useEffect(() => {
    if (!giveaway) return;
    flush();
    const onOnline = () => flush();
    window.addEventListener("online", onOnline);
    const iv = window.setInterval(flush, 30000);
    return () => {
      window.removeEventListener("online", onOnline);
      window.clearInterval(iv);
    };
  }, [giveaway, flush]);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: k === "phone" ? formatPhone(e.target.value) : e.target.value }));

  const emailSuggestion = suggestEmail(form.email);

  const showSuccess = () => {
    setSuccess(true);
    if (booth) {
      resetTimer.current = window.setTimeout(() => {
        setForm(empty);
        setConsent(false);
        setErrors({});
        setSuccess(false);
      }, 6000);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giveaway || !isGiveawayOpen(giveaway)) return;
    const errs: Errors = {};
    if (!form.first.trim()) errs.first = "Required";
    if (!form.last.trim()) errs.last = "Required";
    if (!EMAIL_RE.test(form.email.trim())) errs.email = "Enter a valid email";
    if (phoneDigits(form.phone).length !== 10) errs.phone = "Enter a 10-digit US phone";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (isBot()) {
      showSuccess();
      return;
    }

    const now = new Date();
    const entry: GiveawayEntry = {
      entry_id: generateUUID(),
      slug: giveaway.slug,
      sponsor: giveaway.sponsor,
      first_name: form.first.trim(),
      last_name: form.last.trim(),
      email: form.email.trim(),
      phone: formatPhone(form.phone),
      consent: consent ? "yes" : "no",
      mode: booth ? "booth" : "phone",
      src,
      submitted_at_utc: now.toISOString(),
      submitted_at_pacific: pacificStamp(now),
    };

    // Save first so nothing is lost if the tab closes mid-send.
    enqueue(giveaway.slug, entry);
    showSuccess();
    await flush();
  };

  if (!giveaway || !open) {
    return (
      <Shell title={giveaway?.headline ?? "Giveaway"}>
        <div className="text-center space-y-4">
          <img src={tfaLogo} alt="The Financial Architects" className="h-12 mx-auto" />
          <p className="text-xl font-semibold text-foreground">This giveaway has ended. Thanks for stopping by!</p>
        </div>
      </Shell>
    );
  }

  if (success) {
    return (
      <main
        className={`min-h-[100dvh] flex items-center justify-center px-6 text-center ${booth ? "bg-primary text-primary-foreground" : "bg-background text-foreground"}`}
        role="status"
      >
        <SEOHead title={giveaway.headline} noIndex />
        <div className="space-y-3">
          <p className="text-4xl md:text-5xl font-bold">You're entered!</p>
          <p className="text-2xl md:text-3xl">Good luck.</p>
        </div>
      </main>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? <p className="text-xs text-destructive mt-1">{errors[k]}</p> : null;

  return (
    <Shell title={giveaway?.headline ?? "Giveaway"}>
      <form onSubmit={submit} noValidate autoComplete={booth ? "off" : "on"} className="space-y-3">
        <div className="text-center space-y-1.5">
          <img src={tfaLogo} alt="The Financial Architects" className="h-10 md:h-12 mx-auto" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{giveaway.headline}</h1>
          <p className="text-sm text-muted-foreground">{giveaway.subline}</p>
        </div>

        <input type="text" name="gw_hp_field" className={honeypotClassName} {...honeypotProps} />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="gw-first" className="text-sm font-medium text-foreground">First Name</label>
            <input id="gw-first" name="first_name" required autoComplete={ac("given-name")} value={form.first} onChange={set("first")} className={inputCls} />
            {err("first")}
          </div>
          <div>
            <label htmlFor="gw-last" className="text-sm font-medium text-foreground">Last Name</label>
            <input id="gw-last" name="last_name" required autoComplete={ac("family-name")} value={form.last} onChange={set("last")} className={inputCls} />
            {err("last")}
          </div>
        </div>
        <div>
          <label htmlFor="gw-email" className="text-sm font-medium text-foreground">Email</label>
          <input id="gw-email" name="email" type="email" inputMode="email" required autoComplete={ac("email")} autoCapitalize="none" value={form.email} onChange={set("email")} className={inputCls} />
          {emailSuggestion && (
            <button type="button" onClick={() => setForm((f) => ({ ...f, email: emailSuggestion }))} className="text-xs text-primary underline mt-1">
              Did you mean {emailSuggestion}?
            </button>
          )}
          {err("email")}
        </div>
        <div>
          <label htmlFor="gw-phone" className="text-sm font-medium text-foreground">Phone</label>
          <input id="gw-phone" name="phone" type="tel" inputMode="tel" required autoComplete={ac("tel-national")} placeholder="(555) 555-5555" value={form.phone} onChange={set("phone")} className={inputCls} />
          {err("phone")}
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" name="consent" autoComplete="off" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-primary" />
          <span className="text-xs leading-snug text-muted-foreground">{CONSENT_TEXT}</span>
        </label>

        <button type="submit" className="w-full h-14 rounded-md bg-primary text-primary-foreground text-lg font-bold hover:opacity-90">
          Enter to Win
        </button>

        <p className="text-center text-xs text-muted-foreground">
          No purchase necessary. One entry per person.{" "}
          <button type="button" onClick={() => setRulesOpen(true)} className="underline">Official Rules</button>
        </p>
        {booth && pending > 0 && (
          <p className="text-center text-[11px] text-muted-foreground/80">
            {pending} {pending === 1 ? "entry" : "entries"} waiting to send, keep this page open.
          </p>
        )}
      </form>

      {rulesOpen && (
        <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4" onClick={() => setRulesOpen(false)}>
          <div role="dialog" aria-modal="true" aria-labelledby="gw-rules-title" className="bg-background text-foreground rounded-lg max-w-md w-full max-h-[85dvh] overflow-y-auto p-5 space-y-3 text-sm" onClick={(e) => e.stopPropagation()}>
            <h2 id="gw-rules-title" className="text-lg font-bold">Official Rules</h2>
            <p><strong>Sponsor:</strong> {giveaway.sponsor}</p>
            <p><strong>Eligibility:</strong> {giveaway.rules.eligibility}</p>
            <p><strong>Entry deadline:</strong> {giveaway.rules.entryDeadline}</p>
            <p><strong>Drawing:</strong> {giveaway.rules.drawing}</p>
            <p><strong>Winner notice:</strong> {giveaway.rules.winnerNotice}</p>
            <p>No purchase necessary. One entry per person.</p>
            <button type="button" autoFocus onClick={() => setRulesOpen(false)} className="w-full h-10 rounded-md bg-primary text-primary-foreground font-semibold">Close</button>
          </div>
        </div>
      )}
    </Shell>
  );
}
