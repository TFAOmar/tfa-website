import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Loader2,
  Check,
  Briefcase,
  Home,
  Shield,
  PiggyBank,
  Landmark,
  LineChart,
  Baby,
  HeartPulse,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot, honeypotClassName } from "@/hooks/useHoneypot";
import { submitForm } from "@/lib/formSubmit";
import { SEOHead, JsonLd } from "@/components/seo";
import { generatePersonSchema } from "@/lib/seo/schemas";
import { siteConfig } from "@/lib/seo/siteConfig";
import SmsConsentCheckbox, {
  SMS_CONSENT_TEXT_VERSION,
} from "@/components/forms/SmsConsentCheckbox";
import tfaLogo from "@/assets/tfa-logo.png";
import type { AdvisorConnectConfig } from "@/data/advisorConnectConfigs";

type Path = "clarity" | "join";
type Follow = "email" | "text";

interface Topic {
  slug: string;
  label: string;
  icon: typeof Home;
  blurb: string;
}

const TOPICS: Topic[] = [
  {
    slug: "living-trust-estate-planning",
    label: "Living Trust & Estate Planning",
    icon: Home,
    blurb:
      "Coordinating trust-based estate strategies with your own attorney, who prepares and reviews every legal document.",
  },
  {
    slug: "mortgage-protection",
    label: "Mortgage Protection",
    icon: Shield,
    blurb:
      "Life insurance-based strategies designed to help keep the home in the family if the unexpected happens.",
  },
  {
    slug: "income-protection",
    label: "Income Protection",
    icon: Briefcase,
    blurb:
      "Options that help replace a paycheck if illness or injury keeps you from working.",
  },
  {
    slug: "401k-403b-roth",
    label: "How a 401k, 403b & Roth IRA Work",
    icon: Landmark,
    blurb:
      "Plain-language education on how these accounts work, so you can ask better questions about your own plan.",
  },
  {
    slug: "tax-free-retirement",
    label: "Tax-Free Retirement Plans",
    icon: PiggyBank,
    blurb:
      "Education on strategies people use to build retirement income with tax efficiency in mind.",
  },
  {
    slug: "index-annuities",
    label: "Index Annuities",
    icon: LineChart,
    blurb:
      "How index annuities work, what they're designed to do, and where they fit in a retirement picture.",
  },
  {
    slug: "childrens-trust-funds",
    label: "Children's Trust Funds",
    icon: Baby,
    blurb: "Ways families set money aside early for a child's future.",
  },
  {
    slug: "life-insurance",
    label: "Life Insurance",
    icon: HeartPulse,
    blurb: "Coverage that protects the people who depend on your income.",
  },
  {
    slug: "living-benefits",
    label: "Living Benefits",
    icon: Sparkles,
    blurb:
      "Policy features that can be accessed during your lifetime in the event of a qualifying illness.",
  },
];

const baseSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().min(1, "Last name is required").max(60),
  phone: z.string().trim().min(7, "Phone number is required").max(30),
  email: z.string().trim().email("A valid email is required").max(255),
  message: z.string().trim().max(600).optional(),
});

const digits = (v: string) => v.replace(/[^\d]/g, "");
const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

interface Props {
  config: AdvisorConnectConfig;
}

const AdvisorConnectPage = ({ config }: Props) => {
  const { toast } = useToast();
  const { honeypotProps, isBot, honeypotValue } = useHoneypot();
  const formRef = useRef<HTMLDivElement>(null);

  const [path, setPath] = useState<Path>("clarity");
  const [interests, setInterests] = useState<string[]>([]);
  const [joinInterest, setJoinInterest] = useState("");
  const [follow, setFollow] = useState<Follow>("email");
  const [smsConsent, setSmsConsent] = useState(false);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });

  const scrollToForm = () => {
    setTimeout(
      () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      80,
    );
  };

  const choosePath = (p: Path) => {
    setPath(p);
    scrollToForm();
  };

  const toggleInterest = (slug: string) => {
    setInterests((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const toggleCard = (slug: string) => {
    if (interests.includes(slug)) {
      setInterests((prev) => prev.filter((s) => s !== slug));
      return;
    }
    tapCard(slug);
  };

  const tapCard = (slug: string) => {
    setPath("clarity");
    setInterests((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
    scrollToForm();
  };

  const smsRequiredMissing = follow === "text" && !smsConsent;
  const joinOptions = config.joinInterestOptions;
  const joinInterestMissing = path === "join" && !!joinOptions && !joinInterest;
  const todayISO = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBot()) return;

    const parsed = baseSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Please check your info",
        description: parsed.error.errors[0]?.message ?? "Some fields need attention.",
        variant: "destructive",
      });
      return;
    }
    if (joinInterestMissing) {
      toast({
        title: "One more choice",
        description: "Please let us know whether you're interested in joining the team or partnering.",
        variant: "destructive",
      });
      return;
    }
    if (smsRequiredMissing) {
      toast({
        title: "SMS consent needed",
        description:
          "You chose text as your follow-up method, so please check the box agreeing to receive text messages.",
        variant: "destructive",
      });
      return;
    }

    const interestLabels = TOPICS.filter((t) => interests.includes(t.slug)).map(
      (t) => t.label,
    );
    const joinOption = joinOptions?.find((o) => o.value === joinInterest);
    const pathLabel =
      path === "join" ? config.joinTitle : "Free Client Clarity Application";

    const tags = [
      `path:${path}`,
      ...(path === "clarity" ? interests.map((s) => `interest:${s}`) : []),
      ...(path === "join" && joinOption ? [joinOption.tag] : []),
    ];

    setSubmitting(true);
    try {
      const result = await submitForm({
        form_name: config.formName,
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        notes: parsed.data.message || undefined,
        advisor_slug: config.advisorSlug,
        advisor_email: config.email,
        interest_category:
          path === "clarity" && interestLabels.length
            ? interestLabels.join(",")
            : undefined,
        tags,
        sms_consent: smsConsent,
        sms_consent_text_version: SMS_CONSENT_TEXT_VERSION,
        honeypot: honeypotValue,
        path_label: pathLabel,
        interests_label:
          (path === "join" ? joinOption?.label : interestLabels.join(", ")) || undefined,
        join_interest: (path === "join" && joinOption?.value) || undefined,
        preferred_follow_up: follow === "text" ? "Text" : "Email",
        preferred_date: (path === "clarity" && preferredDate) || undefined,
        preferred_time: (path === "clarity" && preferredTime) || undefined,
      });

      if (!result.ok) throw new Error(result.error || "Submission failed");
      setSubmitted(true);
      scrollToForm();
    } catch {
      toast({
        title: "Something went wrong",
        description: `Please try again, or call ${config.name.split(" ")[0]} directly at ${config.call}.`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value })),
  });

  const firstName = config.name.split(" ")[0];
  const lastName = config.name.split(" ").slice(1).join(" ");

  return (
    <>
      <SEOHead
        title={`Connect with ${config.name} | ${config.title}`}
        description={`Request a free client clarity application or learn about a career with The Financial Architects. Call, text, or send ${config.name} your preferred day and time.`}
        canonical={`${siteConfig.url}${config.canonicalPath}`}
        ogType="profile"
      />
      <JsonLd
        data={generatePersonSchema(
          config.name,
          config.title,
          config.personDescription,
          config.photo ?? "",
          `${siteConfig.url}${config.canonicalPath}`,
          TOPICS.map((t) => t.label),
        )}
      />

      <div className="min-h-screen bg-white">
        {/* Hero — modeled on her business card */}
        <header className="bg-white">
          <div className="container mx-auto max-w-5xl px-5 pt-8">
            <img src={tfaLogo} alt="The Financial Architects" className="h-12 w-auto" />
          </div>
          <div className="container mx-auto max-w-5xl grid gap-6 px-5 py-8 md:grid-cols-[minmax(0,320px)_1fr] md:items-center">
            {config.photo ? (
              <img
                src={config.photo}
                alt={`${config.name}, ${config.title} at The Financial Architects`}
                className="mx-auto w-56 rounded-2xl object-cover md:w-full"
              />
            ) : (
              <div
                aria-hidden="true"
                className="mx-auto flex aspect-[3/4] w-56 items-center justify-center rounded-2xl bg-navy/10 text-5xl font-bold text-navy md:w-full"
              >
                {initials(config.name)}
              </div>
            )}
            <div className="text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-navy/70">
                The Financial Architects · Financial Services
              </p>
              <h1 className="mt-3 text-4xl font-bold uppercase tracking-tight text-navy md:text-5xl">
                <span className="text-accent">{firstName}</span> {lastName}
              </h1>
              <p className="mt-2 text-lg font-semibold uppercase tracking-wide text-navy/80">
                {config.title}
              </p>
              {config.license && (
                <p className="mt-1 text-sm text-muted-foreground">{config.license}</p>
              )}
              <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground md:justify-start">
                <MapPin className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                {config.address}
              </p>
            </div>
          </div>

          {/* Navy contact band */}
          <div className="bg-navy">
            <div className="container mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-5 sm:flex-row sm:justify-center">
              <a
                href={`tel:+1${digits(config.call)}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-navy sm:w-auto"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {config.call}
              </a>
              <a
                href={`sms:+1${digits(config.text)}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/40 px-6 py-3 font-semibold text-white sm:w-auto"
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Text {config.text}
              </a>
            </div>
            <div className="container mx-auto max-w-5xl px-5 pb-5 text-center text-sm text-white/80">
              <p>
                Office {config.office}
                {config.mobile ? ` · Mobile ${config.mobile}` : ""}
              </p>
              <p className="mt-1 flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {config.email}
              </p>
            </div>
          </div>
        </header>

        {/* Two paths */}
        <section className="container mx-auto max-w-5xl px-5 py-10">
          <h2 className="text-center text-2xl font-bold text-navy">
            Connect with {firstName}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
            Choose what you're here for and {firstName} will follow up personally.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => choosePath("join")}
              className={`rounded-xl border-2 p-6 text-left transition ${
                path === "join" ? "border-accent bg-accent/10" : "border-border bg-white"
              }`}
            >
              <span className="block text-lg font-semibold text-navy">
                {config.joinTitle}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {config.joinSubtitle}
              </span>
            </button>
            <button
              type="button"
              onClick={() => choosePath("clarity")}
              className={`rounded-xl border-2 p-6 text-left transition ${
                path === "clarity" ? "border-accent bg-accent/10" : "border-border bg-white"
              }`}
            >
              <span className="block text-lg font-semibold text-navy">
                Free Client Clarity Application
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Get free information on the topics that matter to you.
              </span>
            </button>
          </div>
        </section>

        {/* Form */}
        <section ref={formRef} className="bg-secondary/40 py-10">
          <div className="container mx-auto max-w-2xl px-5">
            {submitted ? (
              <div className="rounded-xl border border-border bg-white p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                  <Check className="h-6 w-6 text-navy" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-navy">Thank you!</h2>
                <p className="mt-2 text-muted-foreground">
                  {firstName} has your request and will reach out shortly. Need her sooner?
                  Call {config.call}.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="text-2xl font-bold text-navy">
                  {path === "join" ? config.joinTitle : "Free Client Clarity Application"}
                </h2>

                <div className={honeypotClassName}>
                  <input type="text" name="website" {...honeypotProps} />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" className="mt-1" {...field("firstName")} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" className="mt-1" {...field("lastName")} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" className="mt-1" {...field("phone")} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" className="mt-1" {...field("email")} />
                  </div>
                </div>

                {path === "join" && joinOptions && (
                  <fieldset className="mt-6">
                    <legend className="font-semibold text-navy">
                      I'm interested in: <span className="text-destructive">*</span>
                    </legend>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {joinOptions.map((o) => (
                        <label
                          key={o.value}
                          className={`flex cursor-pointer items-center gap-2 rounded-lg border-2 p-3 text-sm ${
                            joinInterest === o.value
                              ? "border-accent bg-accent/10"
                              : "border-border"
                          }`}
                        >
                          <input
                            type="radio"
                            name="joinInterest"
                            className="h-4 w-4 accent-navy"
                            value={o.value}
                            checked={joinInterest === o.value}
                            onChange={() => setJoinInterest(o.value)}
                          />
                          <span className="text-foreground">{o.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                {path === "clarity" && (
                  <fieldset className="mt-6">
                    <legend className="font-semibold text-navy">
                      I want free information on: (check all that apply)
                    </legend>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {TOPICS.map((t) => (
                        <label
                          key={t.slug}
                          className="flex cursor-pointer items-start gap-2 rounded-lg border border-border p-3 text-sm"
                        >
                          <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 accent-navy"
                            checked={interests.includes(t.slug)}
                            onChange={() => toggleInterest(t.slug)}
                          />
                          <span className="text-foreground">{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}

                <div className="mt-6">
                  <Label>Preferred follow-up method</Label>
                  <div className="mt-2 flex gap-3">
                    {(["email", "text"] as Follow[]).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFollow(f)}
                        className={`flex-1 rounded-lg border-2 px-4 py-2 font-medium capitalize ${
                          follow === f
                            ? "border-accent bg-accent/10 text-navy"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {path === "clarity" && (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="preferredDate">Preferred date</Label>
                      <Input
                        id="preferredDate"
                        type="date"
                        min={todayISO}
                        className="mt-1"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferredTime">Preferred time</Label>
                      <select
                        id="preferredTime"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      >
                        <option value="">No preference</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <Label htmlFor="message">Message (optional)</Label>
                  <Textarea id="message" className="mt-1" rows={3} {...field("message")} />
                </div>

                <div className="mt-6">
                  <SmsConsentCheckbox
                    checked={smsConsent}
                    onChange={setSmsConsent}
                    required={follow === "text"}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full bg-navy py-6 text-base font-semibold text-white hover:bg-navy/90"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    `Send to ${firstName}`
                  )}
                </Button>
                {joinInterestMissing && (
                  <p className="mt-2 text-center text-sm text-destructive">
                    Please choose whether you're interested in joining the team or partnering.
                  </p>
                )}
                {smsRequiredMissing && (
                  <p className="mt-2 text-center text-sm text-destructive">
                    You chose text as your follow-up method — please check the SMS consent box
                    above so {firstName} can text you.
                  </p>
                )}
                <p className="mt-3 text-center text-sm text-muted-foreground">
                  Free consultation. No obligations.
                </p>
              </form>
            )}
          </div>
        </section>

        {/* Services */}
        <section className="container mx-auto max-w-5xl px-5 py-12">
          <h2 className="text-center text-2xl font-bold text-navy">
            Services available for you
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
            Tap any topic to add it to your clarity application.
          </p>
          <div className="mt-8 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((t) => {
              const Icon = t.icon;
              const active = interests.includes(t.slug);
              return (
                <div
                  key={t.slug}
                  onClick={() => toggleCard(t.slug)}
                  className={`flex h-full cursor-pointer flex-col rounded-xl border-2 p-6 text-left shadow-sm transition hover:shadow-md ${
                    active ? "border-accent bg-accent/10" : "border-border bg-white"
                  }`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/10">
                    <Icon className="h-6 w-6 text-navy" aria-hidden="true" />
                  </span>
                  <span className="mt-4 block min-h-[3.5rem] text-lg font-semibold leading-snug text-navy">
                    {t.label}
                  </span>
                  <span className="mb-4 mt-2 block text-sm text-muted-foreground">{t.blurb}</span>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCard(t.slug);
                    }}
                    className={`mt-auto w-full rounded-lg border-2 px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "border-accent bg-accent text-navy"
                        : "border-navy/30 bg-white text-navy hover:border-navy"
                    }`}
                  >
                    {active ? "✓ Added" : "Add to my request"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Compliance footer */}
        <footer className="border-t border-border bg-white py-8">
          <div className="container mx-auto max-w-3xl space-y-3 px-5 text-center text-xs leading-relaxed text-muted-foreground">
            <p>
              {config.name}
              {config.license ? ` · ${config.license}` : ""} · The Financial Architects
            </p>
            <p>
              By submitting a form on this page you agree to be contacted by The Financial
              Architects by phone or email. SMS messages are sent only if you opt in via the
              consent checkbox. Message frequency varies. Message and data rates may apply. Reply
              STOP to opt out or HELP for help.
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

export default AdvisorConnectPage;
