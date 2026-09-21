import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useHoneypot, honeypotClassName } from "@/hooks/useHoneypot";
import { RISE_SERVICES, RISE_DISCLOSURES } from "@/data/riseLandingContent";
import { submitLead } from "@/lib/rise/submitLead";

interface Props {
  interests: string[];
  setInterests: (i: string[]) => void;
  answers: Record<string, string>;
}

type Contact = "phone" | "text" | "email";

const inputClass =
  "min-h-[48px] w-full rounded-xl border border-input bg-background px-4 text-base text-foreground outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30";

const RiseIntakeForm = ({ interests, setInterests, answers }: Props) => {
  const { honeypotProps, isBot } = useHoneypot();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [preferredContact, setPreferredContact] = useState<Contact>("phone");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const toggleInterest = (id: string) =>
    setInterests(interests.includes(id) ? interests.filter((i) => i !== id) : [...interests, id]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a 10-digit phone number.";
    if (!consent) e.consent = "Please agree to be contacted so we can follow up.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (isBot()) return;
    if (!validate()) return;
    setSubmitting(true);
    await submitLead({
      ...form,
      preferredContact,
      interests,
      consent,
      assessment: answers,
      source: "/rise",
      submittedAt: new Date().toISOString(),
    });
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-gold" aria-hidden />
        <h3 className="mt-4 font-serif text-2xl font-bold text-navy">Thank you, {form.firstName}.</h3>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground leading-relaxed">
          Joshua and Makenzie have your request. They'll reach out by{" "}
          {preferredContact === "email" ? "email" : preferredContact === "text" ? "text" : "phone"} to
          set up a short, no-pressure conversation.
        </p>
        {interests.length > 0 && (
          <p className="mt-4 text-sm text-muted-foreground">
            Topics you selected:{" "}
            <span className="font-medium text-navy">
              {RISE_SERVICES.filter((s) => interests.includes(s.id))
                .map((s) => s.title)
                .join(", ")}
            </span>
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm"
    >
      <input type="text" name="company_website" className={honeypotClassName} {...honeypotProps} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rise-first" className="mb-1.5 block text-sm font-medium text-navy">
            First name
          </label>
          <input
            id="rise-first"
            className={inputClass}
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            autoComplete="given-name"
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
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            autoComplete="family-name"
          />
          {errors.lastName && <p className="mt-1 text-sm text-destructive">{errors.lastName}</p>}
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
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
          />
          {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
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
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            autoComplete="tel"
          />
          {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone}</p>}
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-navy">Preferred contact method</legend>
        <div className="flex flex-wrap gap-2">
          {(["phone", "text", "email"] as Contact[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setPreferredContact(c)}
              aria-pressed={preferredContact === c}
              className={`min-h-[44px] rounded-full border-2 px-5 text-sm font-medium capitalize transition motion-reduce:transition-none ${
                preferredContact === c
                  ? "border-gold bg-gold/10 text-navy"
                  : "border-border text-muted-foreground hover:border-gold/60"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-medium text-navy">
          Topics of interest{" "}
          <span className="font-normal text-muted-foreground">(from your assessment — editable)</span>
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {RISE_SERVICES.map((s) => {
            const on = interests.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleInterest(s.id)}
                aria-pressed={on}
                className={`min-h-[48px] rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition motion-reduce:transition-none ${
                  on ? "border-gold bg-gold/5 text-navy" : "border-border text-muted-foreground hover:border-gold/60"
                }`}
              >
                {on ? "✓ " : ""}
                {s.title}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-6">
        <label htmlFor="rise-notes" className="mb-1.5 block text-sm font-medium text-navy">
          Anything you'd like them to know? <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="rise-notes"
          rows={4}
          className={`${inputClass} py-3 min-h-[120px] resize-y`}
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
        />
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
        <input
          id="rise-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-input accent-navy"
        />
        <label htmlFor="rise-consent" className="cursor-pointer text-sm leading-relaxed text-foreground/80">
          {RISE_DISCLOSURES.consent}
        </label>
      </div>
      {errors.consent && <p className="mt-2 text-sm text-destructive">{errors.consent}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-navy px-6 text-base font-semibold text-primary-foreground transition hover:bg-navy-light disabled:opacity-60 motion-reduce:transition-none"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden />}
        {submitting ? "Sending…" : "Send my request"}
      </button>

      <p className="mt-4 text-xs text-muted-foreground">{RISE_DISCLOSURES.attorney}</p>
    </form>
  );
};

export default RiseIntakeForm;
