import { useState } from "react";
import { Play, Home, Users, FileText, ShieldCheck, ArrowRight, Quote } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import RiseAssessment from "@/components/rise/RiseAssessment";
import RiseIntakeForm from "@/components/rise/RiseIntakeForm";
import {
  RISE_VIDEO_URL,
  RISE_VIDEO_TITLE,
  RISE_VIDEO_INTRO,
  RISE_VIDEO_LENGTH_LABEL,
  RISE_VIDEO_SPEAKER,
  youTubeIdFrom,
  RISE_TEAM,
  RISE_SERVICES,
  RISE_ORGANIZE_CARDS,
  RISE_TESTIMONIALS,
  RISE_DISCLOSURES,
} from "@/data/riseLandingContent";

const ORGANIZE_ICONS = [Home, Users, FileText, ShieldCheck];

const Rise = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [interests, setInterests] = useState<string[]>([]);
  const videoId = youTubeIdFrom(RISE_VIDEO_URL);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <SEOHead
        title="Rise × The Financial Architects — Homeowner Legacy Path"
        description="You protected the home. Now protect what you're building. Estate planning education and a guided assessment for recent homebuyers, with Joshua and Makenzie."
        canonical="https://tfawealthplanning.com/rise"
        noIndex
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-navy/10 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-xl font-bold tracking-[0.22em] text-navy">RISE</span>
            <span className="text-gold" aria-hidden>
              ×
            </span>
            <span className="text-[11px] font-semibold uppercase leading-tight tracking-[0.12em] text-muted-foreground sm:text-xs">
              The Financial
              <br className="hidden sm:block" /> Architects
            </span>
          </div>
          <button
            type="button"
            onClick={() => scrollTo("rise-intake")}
            className="inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full bg-navy px-5 text-sm font-semibold text-primary-foreground transition hover:bg-navy-light motion-reduce:transition-none"
          >
            Talk with us
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-primary-foreground">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "radial-gradient(60% 60% at 80% 10%, hsl(var(--gold)) 0%, transparent 60%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            For recent homeowners
          </p>
          <h1 className="mt-4 max-w-2xl font-serif text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            You protected the home.
            <span className="block text-gold">Now protect what you're building.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Closing was the beginning. A home ties together the people you love, the plans you're
            making, and the decisions someone may need to make on your behalf one day. This page walks
            you through what that means — at your own pace, with no pressure.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => scrollTo("rise-video")}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-gold px-7 font-semibold text-navy transition hover:bg-gold-light motion-reduce:transition-none"
            >
              <Play className="h-4 w-4" aria-hidden /> Watch the 5-minute overview
            </button>
            <button
              type="button"
              onClick={() => scrollTo("rise-assessment")}
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-primary-foreground/30 px-7 font-semibold text-primary-foreground transition hover:border-gold hover:text-gold motion-reduce:transition-none"
            >
              Start the short assessment
            </button>
          </div>
        </div>
      </section>

      {/* Educational bridge */}
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Why now</p>
        <h2 className="mt-3 font-serif text-2xl font-bold text-navy sm:text-3xl">
          Buying a home changes the estate-planning conversation
        </h2>
        <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
          <p>
            For most families, a home is the first asset that has a title, a loan, and a long list of
            people affected by it. That's usually the moment questions come up: who inherits it, who
            can make decisions about it, and what happens if something changes unexpectedly.
          </p>
          <p>
            A plan isn't about expecting the worst. It's about writing down what you already intend, so
            the people you care about aren't left guessing — and so the home you just bought stays part
            of the story you meant it to be.
          </p>
        </div>
        <p className="mt-6 rounded-xl bg-secondary/60 p-4 text-sm text-muted-foreground">
          {RISE_DISCLOSURES.educational}
        </p>
      </section>

      {/* Video */}
      <section id="rise-video" className="bg-secondary/40 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Why this matters
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold text-navy sm:text-3xl">
              {RISE_VIDEO_TITLE}
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{RISE_VIDEO_INTRO}</p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-navy/10 bg-card shadow-sm">
            <div className="relative aspect-video bg-navy">
              {videoId ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={RISE_VIDEO_TITLE}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
                  <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(50% 60% at 50% 40%, hsl(var(--gold)) 0%, transparent 70%)",
                    }}
                    aria-hidden
                  />
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-gold/60 bg-gold/10">
                    <Play className="h-6 w-6 text-gold" aria-hidden />
                  </span>
                  <p className="relative text-sm font-medium text-primary-foreground/80">
                    Video coming soon — the final recording will appear here.
                  </p>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-navy/10 px-5 py-4">
              <span className="text-sm font-medium text-navy">{RISE_VIDEO_SPEAKER}</span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
                {RISE_VIDEO_LENGTH_LABEL}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* What a plan helps organize */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
          What a plan helps organize
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {RISE_ORGANIZE_CARDS.map((card, i) => {
            const Icon = ORGANIZE_ICONS[i % ORGANIZE_ICONS.length];
            return (
              <div
                key={card.title}
                className="rounded-2xl border border-navy/10 bg-card p-6 transition hover:border-gold/60 motion-reduce:transition-none"
              >
                <Icon className="h-6 w-6 text-gold" aria-hidden />
                <h3 className="mt-4 font-semibold text-navy">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{RISE_DISCLOSURES.educational}</p>
      </section>

      {/* Assessment */}
      <section id="rise-assessment" className="bg-secondary/40 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
              See what may be missing in your plan
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              A few short questions, one at a time. No email required to see your summary — skip
              anything you'd rather not answer.
            </p>
          </div>
          <RiseAssessment
            answers={answers}
            setAnswers={setAnswers}
            interests={interests}
            setInterests={setInterests}
            onFinish={() => undefined}
          />
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">What we can cover</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {RISE_SERVICES.map((s) => (
            <div
              key={s.id}
              className={`rounded-2xl border p-6 ${
                s.primary ? "border-gold/60 bg-navy text-primary-foreground" : "border-navy/10 bg-card"
              }`}
            >
              {s.primary && (
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                  Where most families start
                </span>
              )}
              <h3
                className={`mt-2 font-serif text-lg font-bold ${s.primary ? "text-primary-foreground" : "text-navy"}`}
              >
                {s.title}
              </h3>
              <p
                className={`mt-2 text-sm leading-relaxed ${
                  s.primary ? "text-primary-foreground/80" : "text-muted-foreground"
                }`}
              >
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-secondary/40 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
            Who you'll be talking with
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {RISE_TEAM.map((m) => (
              <div key={m.name} className="rounded-2xl border border-navy/10 bg-card p-6">
                <div className="flex items-center gap-4">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      className="h-16 w-16 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-navy font-serif text-xl font-bold text-gold">
                      {m.initials}
                    </span>
                  )}
                  <div>
                    <p className="font-serif text-lg font-bold text-navy">{m.name}</p>
                    <p className="text-sm text-muted-foreground">{m.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">{RISE_DISCLOSURES.attorney}</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">What clients say</h2>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            Placeholder content
          </span>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {RISE_TESTIMONIALS.map((t, i) => (
            <figure key={i} className="rounded-2xl border border-navy/10 bg-card p-6">
              <Quote className="h-5 w-5 text-gold" aria-hidden />
              <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-navy">{t.name}</span>
                <span className="block text-xs text-muted-foreground">{t.detail}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Intake */}
      <section id="rise-intake" className="bg-secondary/40 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
              Start the conversation
            </h2>
            <p className="mt-3 text-muted-foreground">
              Tell Joshua and Makenzie how to reach you and what you'd like to talk about. No cost, no
              obligation.
            </p>
          </div>
          <RiseIntakeForm interests={interests} setInterests={setInterests} answers={answers} />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-10 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold tracking-[0.22em]">RISE</span>
            <span className="text-gold" aria-hidden>
              ×
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-foreground/70">
              The Financial Architects
            </span>
          </div>
          <p className="mt-5 max-w-3xl text-xs leading-relaxed text-primary-foreground/60">
            {RISE_DISCLOSURES.footer}
          </p>
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-primary-foreground/60">
            {RISE_DISCLOSURES.educational} {RISE_DISCLOSURES.attorney}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-primary-foreground/70">
            <a href="/privacy-policy" className="underline underline-offset-4 hover:text-gold">
              Privacy Policy
            </a>
            <a href="/sms-terms" className="underline underline-offset-4 hover:text-gold">
              SMS Terms
            </a>
            <a href="/terms-of-service" className="underline underline-offset-4 hover:text-gold">
              Terms
            </a>
          </div>
          <p className="mt-6 text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} The Financial Architects. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Mobile sticky CTA */}
      <div className="sticky bottom-0 z-30 border-t border-navy/10 bg-background/95 p-3 backdrop-blur sm:hidden">
        <button
          type="button"
          onClick={() => scrollTo("rise-intake")}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gold font-semibold text-navy"
        >
          Talk with Joshua & Makenzie <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
};

export default Rise;
