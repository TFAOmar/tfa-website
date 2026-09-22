import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
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

const inputClass =
  "min-h-[48px] w-full rounded-xl border border-input bg-background px-4 text-base text-foreground outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/20";

const RiseSummaryContact = ({ answers, summary, onRestart }: Props) => {
  const { honeypotProps, isBot } = useHoneypot();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "" });
  const [preferredContact, setPreferredContact] = useState<Contact>("call");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (isBot()) return;
    if (!validate()) return;
    setSubmitting(true);
    const ref = new URLSearchParams(window.location.search).get("ref");
    await submitRiseLead({
      ...form,
      preferredContact,
      answers,
      summary: summary.map((s) => ({ id: s.id, heading: s.heading })),
      ref,
      source: "/rise",
      submittedAt: new Date().toISOString(),
    });
    setSubmitting(false);
    setSuccess(true);
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
        <div className="mt-8 rounded-xl border border-navy/10 bg-secondary/50 p-6 text-center">
          <CheckCircle2 className="mx-auto h-11 w-11" style={{ color: "var(--rise-accent)" }} aria-hidden />
          <h3 className="mt-3 font-serif text-xl font-bold text-navy">
            Thank you, {form.firstName}.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            {riseConfig.followUpLine}
          </p>
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

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold transition hover:opacity-90 disabled:opacity-60 motion-reduce:transition-none"
            style={{ backgroundColor: "var(--rise-accent)", color: "var(--rise-accent-contrast)" }}
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />}
            {submitting ? "Sending…" : "Have Joshua or Makenzie reach out."}
          </button>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            {riseConfig.disclosures.contactConsent}
          </p>

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
