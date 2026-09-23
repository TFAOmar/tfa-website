import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { z } from "zod";
import {
  Phone,
  Mail,
  Loader2,
  Check,
  TrendingUp,
  ShieldCheck,
  Landmark,
} from "lucide-react";
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
import heroLarge from "@/assets/zuniga/hero-1600.webp";
import heroSmall from "@/assets/zuniga/hero-800.webp";
import {
  NOT_SURE_SLUG,
  zpsLogoUrl,
  zunigaAdvisors,
  zunigaServiceGroups,
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

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Brief fade + rise. Content is visible by default and with reduced motion. */
const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => {
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed) return;
    const t = window.setTimeout(() => setShown(true), 60 + delay);
    return () => window.clearTimeout(t);
  }, [armed, delay]);

  const hidden = armed && !shown;
  return (
    <div
      className={`transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
        hidden ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const groupIcons = [TrendingUp, ShieldCheck, Landmark];

/** Shared content container so every section's left edge lines up. */
const SHELL = "mx-auto w-full max-w-[1200px] px-5 sm:px-8";

const ZunigaConnect = () => {
  const { toast } = useToast();
  const { honeypotProps, isBot, honeypotValue } = useHoneypot();
  const [searchParams] = useSearchParams();
  const srcParam = searchParams.get("src") || "";

  const formRef = useRef<HTMLDivElement>(null);
  const callBandRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLElement>) =>
    ref.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });

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

  const labelFor = (slug: string) =>
    zunigaServices.find((s) => s.slug === slug)?.label ?? slug;

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
      scrollTo(formRef);
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

  const advisorCard = (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_18px_40px_-20px_rgba(20,35,60,0.45)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Your advisors
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {zunigaAdvisors.map((a) => (
          <div key={a.slug} className="flex items-center gap-3">
            <img
              src={a.photo}
              alt={a.name}
              width={72}
              height={72}
              className="h-[72px] w-[72px] shrink-0 rounded-xl bg-[#EFEBE4] object-cover object-[50%_18%]"
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-navy">{a.name}</p>
              <p className="text-xs text-muted-foreground">
                {a.title} · {a.license}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <SEOHead
        title="TFA × Zuniga Professional Services"
        description="Financial planning and insurance services for Zuniga Professional Services clients."
        noIndex
      />

      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-white">
          <div className={`${SHELL} flex items-center justify-between gap-3 py-3`}>
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={tfaLogo}
                alt="The Financial Architects"
                className="h-[26px] w-auto sm:h-[34px]"
              />
              <span
                aria-hidden="true"
                className="h-[26px] w-px shrink-0 bg-border sm:h-[34px]"
              />
              <img
                src={zpsLogoUrl}
                alt="Zuniga Professional Services, Inc."
                className="h-[26px] w-auto sm:h-[34px]"
              />
            </div>
            <button
              type="button"
              onClick={() => scrollTo(formRef)}
              className="min-h-[38px] shrink-0 whitespace-nowrap rounded-full bg-navy px-4 text-[13px] font-semibold text-white transition hover:opacity-90 sm:min-h-[40px] sm:px-5 sm:text-sm"
            >
              Get started
            </button>
          </div>
        </header>

        {/* Hero */}
        <section className="relative">
          <div className="grid lg:min-h-[80vh] lg:grid-cols-2">
            <div className="flex items-center bg-navy py-12 lg:py-20">
              <div className="mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:ml-auto lg:mr-0 lg:max-w-[600px] lg:pb-16">
                <Reveal>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    <span className="sm:hidden">For Zuniga clients</span>
                    <span className="hidden sm:inline">
                      For Zuniga Professional Services clients
                    </span>
                  </p>
                  <h1 className="mt-4 text-[32px] font-bold leading-[1.08] text-white sm:text-[42px] lg:text-[52px]">
                    Your taxes are in good hands. Now let's plan what comes next.
                  </h1>
                </Reveal>
                <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
                  Retirement, insurance, and estate planning from TFA advisors Richard
                  Morales and Mariah Lorenzen. Free, no obligation.
                </p>
                <div className="mt-8 flex flex-col items-start gap-4">
                  <button
                    type="button"
                    onClick={() => scrollTo(formRef)}
                    className="min-h-[52px] w-full rounded-lg bg-accent px-7 text-base font-semibold text-navy transition hover:opacity-90 sm:w-auto"
                  >
                    Request a Free Consultation
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo(callBandRef)}
                    className="text-sm font-medium text-white underline underline-offset-4 hover:text-accent"
                  >
                    Or call us directly ↓
                  </button>
                </div>
              </div>
            </div>

            <div className="relative h-[220px] lg:h-auto">
              <img
                src={heroLarge}
                srcSet={`${heroSmall} 800w, ${heroLarge} 1600w`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                width={1600}
                height={1200}
                alt="A couple reviewing their financial paperwork at home"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Advisor card overlapping the seam */}
          <div className={SHELL}>
            <Reveal delay={140} className="-mt-10 lg:-mt-16">
              <div className="lg:max-w-2xl">{advisorCard}</div>
            </Reveal>
          </div>
        </section>

        {/* What we help with */}
        <section className="mt-12 bg-[#F6F4F0] py-14">
          <div className={SHELL}>
            <h2 className="text-2xl font-bold text-navy sm:text-3xl">What we help with</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {zunigaServiceGroups.map((group, i) => {
                const Icon = groupIcons[i % groupIcons.length];
                return (
                  <div key={group.title}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-accent" aria-hidden="true" strokeWidth={1.75} />
                      <h3 className="font-semibold text-navy">{group.title}</h3>
                    </div>
                    <ul className="mt-4 space-y-2 border-t border-border pt-4">
                      {group.slugs.map((slug) => (
                        <li key={slug} className="text-sm text-foreground/80">
                          {labelFor(slug)}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Form */}
        <section ref={formRef} id="zuniga-form" className="scroll-mt-20 bg-white py-16">
          <div className="container mx-auto max-w-2xl px-5">
            {submittedName ? (
              <div className="mx-auto max-w-[520px] rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                  <Check className="h-6 w-6 text-navy" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-navy">
                  Thanks, {submittedName} — Richard or Mariah will reach out within one
                  business day.
                </h2>
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
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-navy sm:text-3xl">
                    Tell us what you'd like to talk about.
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    Richard or Mariah will reach out within one business day.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mx-auto mt-8 max-w-[520px] rounded-2xl border border-border bg-white p-6 shadow-[0_18px_40px_-28px_rgba(20,35,60,0.5)] sm:p-7"
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
                    <legend className="text-sm font-semibold text-navy">
                      I'm interested in
                    </legend>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {chips.map((c) => {
                        const active = services.includes(c.slug);
                        return (
                          <button
                            key={c.slug}
                            type="button"
                            aria-pressed={active}
                            onClick={() => toggleService(c.slug)}
                            className={`min-h-[34px] rounded-full border px-3 text-[13px] font-medium transition ${
                              active
                                ? "border-navy bg-navy text-white"
                                : "border-border bg-white text-navy hover:border-navy/50"
                            }`}
                          >
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
                    <span className="text-sm font-semibold text-navy">Preferred follow-up</span>
                    <div className="mt-2 grid grid-cols-2 gap-1 rounded-lg border border-border bg-secondary p-1">
                      {(["call", "text"] as Follow[]).map((f) => (
                        <button
                          key={f}
                          type="button"
                          aria-pressed={follow === f}
                          onClick={() => setFollow(f)}
                          className={`min-h-[40px] rounded-md text-sm font-semibold capitalize transition ${
                            follow === f
                              ? "bg-white text-navy shadow-sm"
                              : "text-muted-foreground hover:text-navy"
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
                    className="mt-7 w-full bg-navy py-6 text-base font-semibold text-white hover:bg-navy/90"
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
          </div>
        </section>

        {/* Closing call band */}
        <section ref={callBandRef} className="scroll-mt-20 bg-navy py-12">
          <div className={`${SHELL} flex flex-col items-center gap-6 text-center`}>
            <h2 className="text-2xl font-bold text-white">Prefer to talk now?</h2>
            <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2">
              {zunigaAdvisors.map((a) => (
                <a
                  key={a.slug}
                  href={`tel:+1${digits(a.phone)}`}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-accent px-6 font-semibold text-navy transition hover:opacity-90"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {a.name.split(" ")[0]} · {a.phone}
                </a>
              ))}
            </div>
            <a
              href={`mailto:${zunigaAdvisors[0].email}`}
              className="inline-flex items-center gap-2 text-sm text-white/80 underline underline-offset-4 hover:text-white"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Or email us
            </a>
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
