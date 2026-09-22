import { useState } from "react";
import { Phone, MessageSquare } from "lucide-react";
import { riseConfig, type RiseAdvisor } from "@/config/rise.config";
import RiseReveal from "./RiseReveal";

const telHref = (n: string) => `tel:+1${n.replace(/\D/g, "")}`;
const smsHref = (n: string) => `sms:+1${n.replace(/\D/g, "")}`;

const AdvisorCard = ({ a }: { a: RiseAdvisor }) => {
  const [expanded, setExpanded] = useState(false);
  const firstName = a.name.split(" ")[0];

  return (
    <div className="flex flex-col rounded-2xl border border-[var(--rise-card-border)] bg-[var(--rise-card)] p-5 shadow-[0_8px_24px_-12px_rgba(28,43,69,0.25)]">
      <div className="flex items-center gap-4">
        {a.photo ? (
          <img
            src={a.photo}
            alt={a.name}
            className="h-16 w-16 rounded-full object-cover object-top"
            loading="lazy"
          />
        ) : (
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full font-serif text-xl font-bold text-navy"
            style={{ backgroundColor: "var(--rise-accent-soft)" }}
            aria-hidden
          >
            {a.initials}
          </span>
        )}
        <div>
          <p className="font-serif text-lg font-bold text-navy">{a.name}</p>
          <p className="text-sm text-muted-foreground">{a.title}</p>
          <p className="text-sm text-muted-foreground">{a.company}</p>
          {a.licenseNumber && (
            <p className="mt-0.5 text-xs text-muted-foreground">CA Lic# {a.licenseNumber}</p>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {expanded ? a.fullBio : a.shortBio}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="mt-2 self-start text-sm font-semibold text-navy underline underline-offset-4 hover:opacity-80"
      >
        {expanded ? "Show less" : `More about ${firstName}`}
      </button>

      <div className="mt-auto flex gap-3 pt-5">
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
  );
};

const RiseAdvisors = () => (
  <section className="bg-[var(--rise-bg)] px-5 py-12 sm:py-16">
    <RiseReveal className="mx-auto max-w-3xl">
      <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
        Joshua &amp; Mackenzie
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        {riseConfig.followUpLine}
      </p>

      <div className="mt-7 grid items-stretch gap-5 sm:grid-cols-2">
        {riseConfig.advisors.map((a) => (
          <AdvisorCard key={a.name} a={a} />
        ))}
      </div>
    </RiseReveal>
  </section>
);

export default RiseAdvisors;
