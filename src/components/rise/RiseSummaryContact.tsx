import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Phone, MessageSquare } from "lucide-react";
import { useHoneypot, honeypotClassName } from "@/hooks/useHoneypot";
import { riseConfig, RISE_FORM_MODE } from "@/config/rise.config";
import type { RiseAnswers } from "@/lib/rise/questions";
import type { RiseSummaryItem } from "@/lib/rise/summary";
import { submitRiseLead } from "@/lib/rise/submitRiseLead";
import RiseReveal from "./RiseReveal";


interface Props {
  answers: RiseAnswers;
  summary: RiseSummaryItem[];
  onRestart: () => void;
}

type Contact = "call" | "text" | "email";

const telHref = (n: string) => `tel:+1${n.replace(/\D/g, "")}`;
const smsHref = (n: string) => `sms:+1${n.replace(/\D/g, "")}`;

const inputClass =
  "min-h-[48px] w-full rounded-xl border border-[var(--rise-card-border)] bg-[var(--rise-card)] px-4 text-base text-foreground outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/20";

const RiseSummaryContact = ({ answers, summary, onRestart }: Props) => {
  const { honeypotProps, isBot } = useHoneypot();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    agentName: "",
  });
  const [preferredContact, setPreferredContact] = useState<Contact>("call");
  const [contactConsent, setContactConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // The thank-you card is shorter than the form, so bring it back into view.
  useEffect(() => {
    if (!success) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    successRef.current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    successHeadingRef.current?.focus({ preventScroll: true });
  }, [success]);

  useEffect(() => {
    if (failed) errorRef.current?.focus();
  }, [failed]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.agentName.trim()) e.agentName = "Let us know who your real estate agent is.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (isBot()) return;
    setFailed(false);
    if (!validate()) return;
    setSubmitting(true);
    try {
      const ref = new URLSearchParams(window.location.search).get("ref");
      const result = await submitRiseLead({
        ...form,
        preferredContact,
        contactConsent,
        answers,
        summary: summary.map((s) => ({ id: s.id, heading: s.heading })),
        ref,
        source: "/rise",
        submittedAt: new Date().toISOString(),
      });
      if (result.ok) setSuccess(true);
      else setFailed(true);
    } catch {
      setFailed(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RiseReveal className="rounded-2xl border border-[var(--rise-card-border)] bg-[var(--rise-card)] p-6 shadow-[0_8px_24px_-12px_rgba(28,43,69,0.25)] sm:p-8">
      <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
        Areas worth a conversation
      </h2>
      <ul className="mt-5 space-y-4">
        {summary.map((s) => (
          <li key={s.id} className="border-l-2 pl-4" style={{ borderColor: "var(--rise-accent)" }}>
            <p className="font-semibold text-navy">{s.heading}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-muted-foreground">{riseConfig.disclosures.attorney}</p>

      {success ? (
        <div
          ref={successRef}
          className="mt-8 scroll-mt-24 rounded-xl border border-[var(--rise-card-border)] bg-[var(--rise-bg)] p-6 text-center"
        >
          <CheckCircle2 className="mx-auto h-11 w-11" style={{ color: "var(--rise-accent)" }} aria-hidden />
          <h3
            ref={successHeadingRef}
            tabIndex={-1}
            className="mt-3 font-serif text-xl font-bold text-navy outline-none"
          >
            Thank you, {form.firstName}.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {riseConfig.followUpLine}
          </p>
          <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-muted-foreground">
            {riseConfig.credibilityLine}
          </p>
          {riseConfig.tfaReviewsUrl && (
            <a
              href={riseConfig.tfaReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-semibold text-navy underline underline-offset-4 hover:opacity-80"
            >
              See our Google reviews
            </a>
          )}
          {RISE_FORM_MODE === "mock" && (
            <p className="mt-3 text-xs text-muted-foreground">
              Preview — submissions are not sent.
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-8 border-t border-navy/10 pt-6">
          <input type="text" name="company_website" className={honeypotClassName} {...honeypotProps} />

          <h3 className="font-serif text-xl font-bold text-navy">
            Want to talk any of this through?
          </h3>
          {RISE_FORM_MODE === "mock" && (
            <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              Preview — submissions are not sent.
            </p>
          )}

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rise-first" className="mb-1.5 block text-sm font-medium text-navy">
                First name
              </label>
              <input
                id="rise-first"
                className={inputClass}
                autoComplete="given-name"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
              />
              {errors.firstName && <p className="mt-1 text-sm text-destructive">{errors.firstName}</p>}
            </div>
            <div>
              <label htmlFor="rise-last" className="mb-1.5 block text-sm font-medium text-navy">
                Last name
              </label>
              <input
                id="rise-last"
                className={inputClass}
                autoComplete="family-name"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
              />
              {errors.lastName && <p className="mt-1 text-sm text-destructive">{errors.lastName}</p>}
            </div>
            <div>
              <label htmlFor="rise-phone" className="mb-1.5 block text-sm font-medium text-navy">
                Phone
              </label>
              <input
                id="rise-phone"
                type="tel"
                inputMode="tel"
                className={inputClass}
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
              {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone}</p>}
            </div>
            <div>
              <label htmlFor="rise-email" className="mb-1.5 block text-sm font-medium text-navy">
                Email
              </label>
              <input
                id="rise-email"
                type="email"
                inputMode="email"
                className={inputClass}
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
              />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="rise-agent" className="mb-1.5 block text-sm font-medium text-navy">
                Who is your real estate agent?
              </label>
              <input
                id="rise-agent"
                className={inputClass}
                placeholder="Agent's name"
                value={form.agentName}
                onChange={(e) => set("agentName", e.target.value)}
              />
              {errors.agentName && (
                <p className="mt-1 text-sm text-destructive">{errors.agentName}</p>
              )}
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="mb-2 text-sm font-medium text-navy">Preferred contact method</legend>
            <div className="flex flex-wrap gap-2">
              {(["call", "text", "email"] as Contact[]).map((c) => {
                const on = preferredContact === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPreferredContact(c)}
                    aria-pressed={on}
                    className="min-h-[44px] rounded-full border-2 px-5 text-sm font-medium capitalize text-navy transition motion-reduce:transition-none"
                    style={{
                      borderColor: on ? "var(--rise-accent)" : "hsl(var(--border))",
                      backgroundColor: on ? "var(--rise-accent-soft)" : "transparent",
                    }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="mt-6 flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={contactConsent}
              onChange={(e) => setContactConsent(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ accentColor: "var(--rise-btn)" }}
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              {riseConfig.disclosures.contactConsent}
            </span>
          </label>

          {failed && (
            <div ref={errorRef} role="alert" tabIndex={-1} className="mt-6 outline-none">
              <p className="text-sm text-destructive">We couldn't send your information just now.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                You can try again, or reach Joshua or Mackenzie directly:
              </p>
              <div className="mt-3 space-y-3">
                {riseConfig.advisors.map((a) => (
                  <div key={a.name}>
                    <p className="text-sm font-semibold text-navy">{a.name}</p>
                    <div className="mt-2 flex gap-3">
                      <a
                        href={telHref(a.phone)}
                        className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--rise-btn)] text-sm font-semibold transition-colors hover:bg-[var(--rise-btn-hover)] motion-reduce:transition-none"
                        style={{ color: "var(--rise-btn-text)" }}
                      >
                        <Phone className="h-4 w-4" aria-hidden /> Call
                      </a>
                      <a
                        href={smsHref(a.textPhone)}
                        className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-navy/20 text-sm font-semibold text-navy transition hover:border-navy/40 motion-reduce:transition-none"
                      >
                        <MessageSquare className="h-4 w-4" aria-hidden /> Text
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--rise-btn)] px-6 text-base font-semibold transition-colors hover:bg-[var(--rise-btn-hover)] disabled:opacity-60 motion-reduce:transition-none"
            style={{ color: "var(--rise-btn-text)" }}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />}
            {submitting ? "Sending…" : "Have Joshua or Mackenzie reach out."}
          </button>

          <button
            type="button"
            onClick={onRestart}
            className="mt-4 min-h-[44px] text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-navy"
          >
            Start the questions over
          </button>
        </form>
      )}
    </RiseReveal>

  );
};

export default RiseSummaryContact;
