import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Rocket, Lightbulb, Users, ArrowRight } from "lucide-react";
import LandingHeader from "@/components/LandingHeader";
import SmsConsentCheckbox, { SMS_CONSENT_TEXT_VERSION } from "@/components/forms/SmsConsentCheckbox";
import { SEOHead } from "@/components/seo";
import { siteConfig } from "@/lib/seo/siteConfig";
import { submitForm } from "@/lib/formSubmit";
import { useHoneypot, honeypotClassName } from "@/hooks/useHoneypot";
import mannyPhoto from "@/assets/leadership/manny-soto.jpg.asset.json";

const REASONS = [
  { value: "speaking", label: "Speak at my event" },
  { value: "mentorship", label: "Business mentorship" },
  { value: "financial-planning", label: "Financial planning" },
  { value: "other", label: "Other" },
];

// Placeholder copy — pending client review
const POINTS = [
  { icon: Rocket, title: "How it started", text: "From a single office and a big idea to a firm serving families nationwide." },
  { icon: Lightbulb, title: "Lessons learned", text: "The wins, setbacks, and decisions that shaped The Financial Architects." },
  { icon: Users, title: "What it means for you", text: "Practical takeaways for business owners and families building their own future." },
];

const scrollToForm = () => document.getElementById("request")?.scrollIntoView({ behavior: "smooth" });

const EntrepreneurStory = () => {
  const { honeypotProps, honeypotValue, isBot } = useHoneypot();
  const [f, setF] = useState({ first: "", last: "", email: "", phone: "", reason: "", method: "Call", time: "", notes: "" });
  const [sms, setSms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!f.first.trim()) er.first = "Required";
    if (!f.last.trim()) er.last = "Required";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "Enter a valid email";
    if (f.phone.replace(/\D/g, "").length < 10) er.phone = "Enter a valid phone";
    if (!f.reason) er.reason = "Choose one";
    if (f.method === "Text" && !sms) er.sms = "Please agree to receive texts, or choose Call";
    setErrors(er);
    if (Object.keys(er).length) return;
    if (isBot()) { setDone(true); return; }
    setLoading(true);
    setSubmitError("");
    const reasonLabel = REASONS.find((r) => r.value === f.reason)?.label;
    const res = await submitForm({
      form_name: "entrepreneur-story",
      first_name: f.first.trim(),
      last_name: f.last.trim(),
      email: f.email.trim(),
      phone: f.phone.trim(),
      advisor_slug: "manuel-soto",
      interest_category: f.reason,
      interests_label: reasonLabel,
      preferred_follow_up: f.method,
      preferred_time: f.time || undefined,
      notes: `An Entrepreneur's Story — ${reasonLabel}${f.notes ? `\n${f.notes}` : ""}`,
      tags: ["entrepreneur-story", `interest:${f.reason}`],
      sms_consent: sms,
      sms_consent_text_version: sms ? SMS_CONSENT_TEXT_VERSION : undefined,
      honeypot: honeypotValue,
    });
    setLoading(false);
    if (res.ok) setDone(true);
    else setSubmitError("Something went wrong. Please try again or call (888) 305-5396.");
  };

  const err = (k: string) => errors[k] && <p className="text-sm text-destructive mt-1">{errors[k]}</p>;

  return (
    <>
      <SEOHead
        title="An Entrepreneur's Story with Manny Soto"
        description="Book time with Manny Soto, Founder & CEO of The Financial Architects, and hear An Entrepreneur's Story. Share your info and our team will schedule your time."
        canonical={`${siteConfig.url}/entrepreneur-story`}
      />
      <div className="min-h-screen bg-background">
        <header onClickCapture={(e) => { const a = (e.target as HTMLElement).closest("a[href='#request']"); if (a) { e.preventDefault(); scrollToForm(); } }}>
          <LandingHeader ctaLabel="Book time with Manny" ctaHref="#request" ctaExternal={false} />
        </header>

        <section className="bg-navy text-primary-foreground">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-14 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-gold uppercase tracking-widest text-sm font-semibold">An Entrepreneur's Story</p>
              <h1 className="text-4xl lg:text-[52px] font-bold leading-[1.1]">From one office to a national firm — hear Manny's story.</h1>
              <p className="text-lg text-primary-foreground/80 max-w-xl">
                Manny Soto, Founder & CEO of The Financial Architects, shares what it really takes to build a business. Request time with Manny and our team will reach out to schedule.
              </p>
              <Button size="lg" onClick={scrollToForm} className="bg-gold text-navy hover:bg-gold/90 font-semibold px-8 py-6 text-base">
                Book time with Manny <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img src={mannyPhoto.url} alt="Manny Soto, Founder & CEO of The Financial Architects" width={420} height={525}
                className="rounded-2xl shadow-2xl w-full max-w-sm aspect-[4/5] object-cover object-top" />
            </div>
          </div>
        </section>

        <section className="bg-muted py-14 lg:py-20">
          <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-10">About the story</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {POINTS.map((p) => (
                <div key={p.title} className="bg-card rounded-xl p-6 border border-border">
                  <p.icon className="h-7 w-7 text-gold mb-4" aria-hidden />
                  <h3 className="text-lg font-semibold text-foreground mb-2">{p.title}</h3>
                  <p className="text-muted-foreground">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="request" className="py-14 lg:py-20 scroll-mt-20">
          <div className="max-w-[560px] mx-auto px-5">
            <h2 className="text-3xl font-bold text-foreground text-center mb-2">Request time with Manny</h2>
            <p className="text-center text-muted-foreground mb-8">Share your info and our team will reach out to set a date and time.</p>
            {done ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
                <CheckCircle2 className="h-12 w-12 text-gold mx-auto mb-4" />
                <p className="text-lg text-foreground">Thanks — our team will reach out within one business day to schedule your time with Manny.</p>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg space-y-5">
                <input type="text" name="website" className={honeypotClassName} {...honeypotProps} />
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label htmlFor="first">First name</Label><Input id="first" value={f.first} onChange={(e) => set("first", e.target.value)} autoComplete="given-name" />{err("first")}</div>
                  <div><Label htmlFor="last">Last name</Label><Input id="last" value={f.last} onChange={(e) => set("last", e.target.value)} autoComplete="family-name" />{err("last")}</div>
                </div>
                <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />{err("email")}</div>
                <div><Label htmlFor="phone">Mobile phone</Label><Input id="phone" type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />{err("phone")}</div>
                <fieldset>
                  <legend className="text-sm font-medium mb-2">Reason for connecting</legend>
                  <div className="flex flex-wrap gap-2">
                    {REASONS.map((r) => (
                      <button type="button" key={r.value} aria-pressed={f.reason === r.value} onClick={() => set("reason", r.value)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${f.reason === r.value ? "bg-navy text-primary-foreground border-navy" : "border-border hover:border-navy"}`}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                  {err("reason")}
                </fieldset>
                <fieldset>
                  <legend className="text-sm font-medium mb-2">Preferred contact</legend>
                  <div className="inline-flex rounded-lg border border-border p-1">
                    {["Call", "Text"].map((m) => (
                      <button type="button" key={m} aria-pressed={f.method === m} onClick={() => set("method", m)}
                        className={`px-5 py-1.5 rounded-md text-sm ${f.method === m ? "bg-navy text-primary-foreground" : ""}`}>{m}</button>
                    ))}
                  </div>
                </fieldset>
                <div><Label htmlFor="time">Best time to reach you (optional)</Label><Input id="time" placeholder="e.g. Weekday mornings" value={f.time} onChange={(e) => set("time", e.target.value)} /></div>
                <div><Label htmlFor="notes">Notes (optional)</Label><Textarea id="notes" rows={3} value={f.notes} onChange={(e) => set("notes", e.target.value)} /></div>
                {f.method === "Text" && (<div><SmsConsentCheckbox checked={sms} onChange={setSms} required />{err("sms")}</div>)}
                {submitError && <p className="text-sm text-destructive">{submitError}</p>}
                <Button type="submit" disabled={loading} className="w-full bg-navy hover:bg-navy/90 text-primary-foreground py-6 text-base">
                  {loading ? "Sending..." : "Request my time with Manny"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">Our team will contact you to schedule. No obligations.</p>
              </form>
            )}
          </div>
        </section>

        <footer className="border-t border-border py-8 px-4 text-center text-xs text-muted-foreground space-y-2">
          <p className="flex justify-center gap-4">
            <a href="/privacy-policy" className="underline">Privacy Policy</a>
            <a href="/terms-of-service" className="underline">Terms</a>
            <a href="/sms-terms" className="underline">SMS Terms</a>
          </p>
          <p>© {new Date().getFullYear()} The Financial Architects · 13890 Peyton Dr. #A, Chino Hills, CA 91709 · (888) 305-5396</p>
        </footer>
      </div>
    </>
  );
};

export default EntrepreneurStory;
