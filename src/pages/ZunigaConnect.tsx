import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Phone, Mail, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot, honeypotClassName } from "@/hooks/useHoneypot";
import { submitForm } from "@/lib/formSubmit";
import { SEOHead } from "@/components/seo";
import SmsConsentCheckbox, {
  SMS_CONSENT_TEXT_VERSION,
} from "@/components/forms/SmsConsentCheckbox";
import tfaLogo from "@/assets/tfa-logo.png";
import {
  NOT_SURE_SLUG,
  ZPS_PURPLE,
  zpsLogoUrl,
  zunigaAdvisors,
  zunigaServices,
} from "@/data/zunigaConfig";

const digits = (v: string) => v.replace(/\D/g, "");

const formatUsPhone = (raw: string) => {
  const d = digits(raw).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

const schema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120, "Name is too long"),
  phone: z
    .string()
    .refine((v) => digits(v).length === 10, "Enter a 10-digit mobile number"),
  email: z
    .string()
    .trim()
    .max(255)
    .refine((v) => v === "" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), "Enter a valid email"),
});

type Follow = "call" | "text";
type Errors = Partial<Record<"fullName" | "phone" | "email" | "services" | "sms", string>>;

const ZunigaConnect = () => {
  const { toast } = useToast();
  const { honeypotProps, isBot, honeypotValue } = useHoneypot();
  const [searchParams] = useSearchParams();
  const srcParam = searchParams.get("src") || "";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [preferredAdvisor, setPreferredAdvisor] = useState("none");
  const [follow, setFollow] = useState<Follow>("call");
  const [smsConsent, setSmsConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedName, setSubmittedName] = useState<string | null>(null);

  const chips = useMemo(
    () => [
      ...zunigaServices.map((s) => ({ slug: s.slug, label: s.label })),
      { slug: NOT_SURE_SLUG, label: "Not sure yet" },
    ],
    [],
  );

  const toggleService = (slug: string) =>
    setServices((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBot()) return;

    const parsed = schema.safeParse({ fullName, phone, email });
    const next: Errors = {};
    if (!parsed.success) {
      for (const issue of parsed.error.errors) {
        next[issue.path[0] as keyof Errors] = issue.message;
      }
    }
    if (services.length === 0) next.services = "Please choose at least one option";
    if (follow === "text" && !smsConsent)
      next.sms = "You chose text — please check the consent box so we can text you.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "—";
    const phoneDigits = digits(phone);
    const chosenAdvisor = zunigaAdvisors.find((a) => a.slug === preferredAdvisor);
    const serviceLabels = chips
      .filter((c) => services.includes(c.slug))
      .map((c) => c.label);

    const tags = [
      "zuniga-lead",
      ...(srcParam ? [`zuniga-${srcParam}`.slice(0, 50)] : []),
      ...services.map((s) => `zuniga-${s}`.slice(0, 50)),
    ].slice(0, 20);

    const metaLines = [
      `Source: zuniga${srcParam ? ` (src=${srcParam})` : ""}`,
      `Page: ${typeof window !== "undefined" ? window.location.pathname : "/zuniga"}`,
      `Submitted: ${new Date().toISOString()}`,
      `Preferred advisor: ${chosenAdvisor?.name ?? "No preference"}`,
    ];

    setSubmitting(true);
    try {
      const result = await submitForm({
        form_name: "zuniga-connect",
        first_name: firstName,
        last_name: lastName,
        email: email.trim() || `no-email.${phoneDigits}@zuniga.tfainsuranceadvisors.com`,
        phone,
        notes: metaLines.join("\n"),
        advisor_slug: chosenAdvisor?.slug ?? "zuniga",
        interest_category: serviceLabels.join(",").slice(0, 100),
        tags,
        sms_consent: smsConsent,
        sms_consent_text_version: SMS_CONSENT_TEXT_VERSION,
        honeypot: honeypotValue,
        path_label: `Preferred advisor: ${chosenAdvisor?.name ?? "No preference"}`,
        interests_label: serviceLabels.join(", ").slice(0, 500),
        preferred_follow_up: follow === "text" ? "Text" : "Call",
      });
      if (!result.ok) throw new Error(result.error || "Submission failed");
      setSubmittedName(firstName);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast({
        title: "Something went wrong",
        description: `Please try again, or call ${zunigaAdvisors[0].phone}.`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="TFA × Zuniga Professional Services"
        description="Financial planning and insurance services for Zuniga Professional Services clients."
        noIndex
      />

      <div className="min-h-screen bg-white">
        {/* Co-branded header */}
        <header className="border-b border-border bg-white">
          <div className="container mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-5">
            <img
              src={tfaLogo}
              alt="The Financial Architects"
              className="h-10 w-auto sm:h-12"
            />
            <span
              aria-hidden="true"
              className="h-10 w-px shrink-0 sm:h-12"
              style={{ backgroundColor: ZPS_PURPLE }}
            />
            <img
              src={zpsLogoUrl}
              alt="Zuniga Professional Services, Inc."
              className="h-10 w-auto sm:h-12"
            />
          </div>
          <p className="container mx-auto max-w-4xl px-5 pb-5 text-center text-sm text-muted-foreground">
            Financial planning and insurance services for Zuniga Professional Services clients.
          </p>
        </header>

        {/* Intro + form */}
        <section className="container mx-auto max-w-2xl px-5 py-8">
          {submittedName ? (
            <div className="rounded-xl border border-border bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                <Check className="h-6 w-6 text-navy" aria-hidden="true" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-navy">
                Thanks, {submittedName} — Richard or Mariah will reach out within one
                business day.
              </h1>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {zunigaAdvisors.map((a) => (
                  <a
                    key={a.slug}
                    href={`tel:+1${digits(a.phone)}`}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 font-semibold text-white"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call {a.name.split(" ")[0]}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold leading-tight text-navy sm:text-4xl">
                A second set of eyes on your financial picture.
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Tell us what you'd like to talk about and a licensed TFA advisor will follow
                up — no cost, no obligation.
              </p>

              <form
                onSubmit={handleSubmit}
                noValidate
                className="mt-7 rounded-xl border border-border bg-white p-6 shadow-sm sm:p-7"
              >
                <div className={honeypotClassName}>
                  <input type="text" name="website" {...honeypotProps} />
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      autoComplete="name"
                      className="mt-1"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    />
                    {errors.fullName && (
                      <p id="fullName-error" className="mt-1 text-sm text-destructive">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Mobile phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="(555) 555-5555"
                      className="mt-1"
                      value={phone}
                      onChange={(e) => setPhone(formatUsPhone(e.target.value))}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="mt-1 text-sm text-destructive">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className="mt-1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1 text-sm text-destructive">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <fieldset className="mt-6">
                  <legend className="font-semibold text-navy">I'm interested in</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {chips.map((c) => {
                      const active = services.includes(c.slug);
                      return (
                        <button
                          key={c.slug}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleService(c.slug)}
                          className={`min-h-[44px] rounded-full border-2 px-4 text-sm font-medium transition ${
                            active
                              ? "text-white"
                              : "border-border bg-white text-navy hover:border-navy/50"
                          }`}
                          style={
                            active
                              ? { backgroundColor: ZPS_PURPLE, borderColor: ZPS_PURPLE }
                              : undefined
                          }
                        >
                          {active ? "✓ " : ""}
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.services && (
                    <p className="mt-2 text-sm text-destructive">{errors.services}</p>
                  )}
                </fieldset>

                <div className="mt-6">
                  <Label htmlFor="preferredAdvisor">Preferred advisor (optional)</Label>
                  <select
                    id="preferredAdvisor"
                    value={preferredAdvisor}
                    onChange={(e) => setPreferredAdvisor(e.target.value)}
                    className="mt-1 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="none">No preference</option>
                    {zunigaAdvisors.map((a) => (
                      <option key={a.slug} value={a.slug}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6">
                  <span className="font-semibold text-navy">Preferred follow-up</span>
                  <div className="mt-2 flex gap-3">
                    {(["call", "text"] as Follow[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        aria-pressed={follow === f}
                        onClick={() => setFollow(f)}
                        className={`min-h-[44px] flex-1 rounded-lg border-2 px-4 font-medium capitalize transition ${
                          follow === f
                            ? "border-navy bg-navy/5 text-navy"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {follow === "text" && (
                  <div className="mt-6">
                    <SmsConsentCheckbox
                      checked={smsConsent}
                      onChange={setSmsConsent}
                      required
                    />
                    {errors.sms && (
                      <p className="mt-2 text-sm text-destructive">{errors.sms}</p>
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-7 w-full py-6 text-base font-semibold text-white hover:opacity-90"
                  style={{ backgroundColor: ZPS_PURPLE }}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Request a Free Consultation"
                  )}
                </Button>
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  Free consultation. No obligations.
                </p>
              </form>
            </>
          )}
        </section>

        {/* Services */}
        <section className="border-t border-border bg-secondary/30 py-10">
          <div className="container mx-auto max-w-4xl px-5">
            <h2 className="text-2xl font-bold text-navy animate-fade-in motion-reduce:animate-none">
              How we can help
            </h2>
            <ul className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {zunigaServices.map((s) => (
                <li key={s.slug} className="border-b border-border/60 pb-4">
                  <p className="font-semibold text-navy">{s.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Advisors */}
        <section className="container mx-auto max-w-4xl px-5 py-12">
          <h2 className="text-2xl font-bold text-navy animate-fade-in motion-reduce:animate-none">
            Your TFA advisors
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {zunigaAdvisors.map((a) => (
              <div
                key={a.slug}
                className="flex flex-col rounded-xl border border-border bg-white p-6 shadow-sm"
              >
                <img
                  src={a.photo}
                  alt={a.name}
                  className="h-40 w-40 self-center rounded-full object-cover object-top"
                />
                <p className="mt-4 text-center text-lg font-bold text-navy">{a.name}</p>
                <p className="text-center text-sm text-muted-foreground">{a.title}</p>
                <p className="text-center text-sm text-muted-foreground">{a.license}</p>
                <div className="mt-5 grid gap-2">
                  <a
                    href={`tel:+1${digits(a.phone)}`}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2 font-semibold text-white"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call {a.phone}
                  </a>
                  <a
                    href={`mailto:${a.email}`}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border-2 border-navy/30 px-4 py-2 font-semibold text-navy hover:border-navy"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Compliance footer */}
        <footer className="border-t border-border bg-white py-8">
          <div className="container mx-auto max-w-3xl space-y-3 px-5 text-center text-xs leading-relaxed text-muted-foreground">
            <p>
              The Financial Architects · In partnership with Zuniga Professional Services,
              Inc.
            </p>
            <p>
              By submitting a form on this page you agree to be contacted by The Financial
              Architects by phone or email. SMS messages are sent only if you opt in via the
              consent checkbox. Message frequency varies. Message and data rates may apply.
              Reply STOP to opt out or HELP for help.
            </p>
            <p className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <Link to="/privacy-policy" className="underline">
                Privacy Policy
              </Link>
              <Link to="/sms-terms" className="underline">
                SMS Terms
              </Link>
              <Link to="/terms-of-service" className="underline">
                Terms
              </Link>
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default ZunigaConnect;
