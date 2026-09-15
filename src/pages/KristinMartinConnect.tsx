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
  SMS_CONSENT_TEXT_EN,
} from "@/components/forms/SmsConsentCheckbox";
import tfaLogo from "@/assets/tfa-logo.png";
import kristinFull from "@/assets/advisors/kristin-martin-full.png.asset.json";

const KRISTIN = {
  name: "Kristin Martin",
  title: "Director of Agents & Operations",
  license: "CA Lic# 4334059",
  address: "13890 Peyton Dr. #A, Chino Hills, CA 91709",
  call: "(949) 312-8331",
  callHref: "tel:+19493128331",
  text: "(626) 824-4939",
  textHref: "sms:+16268244939",
  office: "(888) 305-5396",
  email: "kristin@tfainsuranceadvisors.com",
};

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

const KristinMartinConnect = () => {
  const { toast } = useToast();
  const { honeypotProps, isBot, honeypotValue } = useHoneypot();
  const formRef = useRef<HTMLDivElement>(null);

  const [path, setPath] = useState<Path>("clarity");
  const [interests, setInterests] = useState<string[]>([]);
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

  const tapCard = (slug: string) => {
    setPath("clarity");
    setInterests((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
    scrollToForm();
  };

  const smsRequiredMissing = follow === "text" && !smsConsent;

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
    const pathLabel =
      path === "join" ? "Join / Learn the Business" : "Free Client Clarity Application";

    const tags = [
      `path:${path}`,
      ...(path === "clarity" ? interests.map((s) => `interest:${s}`) : []),
    ];

    setSubmitting(true);
    try {
      const result = await submitForm({
        form_name: "kristin-martin-connect",
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        notes: parsed.data.message || undefined,
        advisor_slug: "kristin-martin",
        advisor_email: KRISTIN.email,
        interest_category:
          path === "clarity" && interestLabels.length
            ? interestLabels.join(",")
            : undefined,
        tags,
        sms_consent: smsConsent,
        sms_consent_text_version: SMS_CONSENT_TEXT_VERSION,
        honeypot: honeypotValue,
        path_label: pathLabel,
        interests_label: interestLabels.join(", ") || undefined,
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
        description: `Please try again, or call Kristin directly at ${KRISTIN.call}.`,
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

  return (
    <>
      <SEOHead
        title={`Connect with ${KRISTIN.name} | ${KRISTIN.title}`}
        description="Request a free client clarity application or learn about a career with The Financial Architects. Call, text, or send Kristin Martin your preferred day and time."
        canonical={`${siteConfig.url}/kristin`}
        ogType="profile"
      />
      <JsonLd
        data={generatePersonSchema(
          KRISTIN.name,
          KRISTIN.title,
          "Director of Agents & Operations at The Financial Architects, serving clients and future agents across Southern California.",
          kristinFull.url,
          `${siteConfig.url}/kristin`,
          TOPICS.map((t) => t.label),
        )}
      />

      <div className="min-h-screen bg-white">
        {/* Hero — modeled on her business card */}
        <header className="bg-white">
          <div className="container mx-auto max-w-5xl px-5 pt-8">
            <img src={tfaLogo} alt="The Financial Architects" className="h-12 w-auto" />
          </div>
          <div className="container mx-auto max-w-5xl grid gap-6 px-5 py-8 md:grid-cols-[minmax(0,320px)_1fr] md:items-end">
            <img
              src={kristinFull.url}
              alt={`${KRISTIN.name}, ${KRISTIN.title} at The Financial Architects`}
              className="mx-auto w-56 rounded-2xl object-cover md:w-full"
            />
            <div className="text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-navy/70">
                The Financial Architects · Financial Services
              </p>
              <h1 className="mt-3 text-4xl font-bold uppercase tracking-tight text-navy md:text-5xl">
                <span className="text-accent">Kristin</span> Martin
              </h1>
              <p className="mt-2 text-lg font-semibold uppercase tracking-wide text-navy/80">
                {KRISTIN.title}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{KRISTIN.license}</p>
              <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground md:justify-start">
                <MapPin className="h-4 w-4 shrink-0 text-navy" aria-hidden="true" />
                {KRISTIN.address}
              </p>
            </div>
          </div>

          {/* Navy contact band */}
          <div className="bg-navy">
            <div className="container mx-auto flex max-w-5xl flex-col items-center gap-3 px-5 py-5 sm:flex-row sm:justify-center">
              <a
                href={KRISTIN.callHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-semibold text-navy sm:w-auto"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {KRISTIN.call}
              </a>
              <a
                href={KRISTIN.textHref}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/40 px-6 py-3 font-semibold text-white sm:w-auto"
              >
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                Text {KRISTIN.text}
              </a>
            </div>
            <div className="container mx-auto max-w-5xl px-5 pb-5 text-center text-sm text-white/80">
              <p>Office {KRISTIN.office}</p>
              <p className="mt-1 flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" aria-hidden="true" />
                {KRISTIN.email}
              </p>
            </div>
          </div>
        </header>

        {/* Two paths */}
        <section className="container mx-auto max-w-5xl px-5 py-10">
          <h2 className="text-center text-2xl font-bold text-navy">Connect with Kristin</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
            Choose what you're here for and Kristin will follow up personally.
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
                Join / Learn the Business
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Explore a career with The Financial Architects.
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
                  Kristin has your request and will reach out shortly. Need her sooner? Call{" "}
                  {KRISTIN.call}.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="text-2xl font-bold text-navy">
                  {path === "join"
                    ? "Join / Learn the Business"
                    : "Free Client Clarity Application"}
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
                  <SmsConsentCheckbox checked={smsConsent} onChange={setSmsConsent} />
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
                    "Send to Kristin"
                  )}
                </Button>
                {smsRequiredMissing && (
                  <p className="mt-2 text-center text-sm text-destructive">
                    You chose text as your follow-up method — please check the SMS consent box
                    above so Kristin can text you.
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
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((t) => {
              const Icon = t.icon;
              const active = interests.includes(t.slug);
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => tapCard(t.slug)}
                  aria-pressed={active}
                  className={`rounded-xl border p-6 text-left shadow-sm transition hover:shadow-md ${
                    active ? "border-accent bg-accent/10" : "border-border bg-white"
                  }`}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/10">
                    <Icon className="h-6 w-6 text-navy" aria-hidden="true" />
                  </span>
                  <span className="mt-4 block text-lg font-semibold text-navy">{t.label}</span>
                  <span className="mt-2 block text-sm text-muted-foreground">{t.blurb}</span>
                  <span className="mt-3 block text-sm font-medium text-navy">
                    {active ? "Added to your request ✓" : "Add to my request"}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Compliance footer */}
        <footer className="border-t border-border bg-white py-8">
          <div className="container mx-auto max-w-3xl space-y-3 px-5 text-center text-xs leading-relaxed text-muted-foreground">
            <p>
              {KRISTIN.name} · {KRISTIN.license} · The Financial Architects
            </p>
            <p>{SMS_CONSENT_TEXT_EN}</p>
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

export default KristinMartinConnect;
