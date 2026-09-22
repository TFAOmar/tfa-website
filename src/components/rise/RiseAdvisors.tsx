import { Phone, MessageSquare } from "lucide-react";
import { riseConfig } from "@/config/rise.config";
import RiseReveal from "./RiseReveal";

const telHref = (n: string) => `tel:+1${n.replace(/\D/g, "")}`;
const smsHref = (n: string) => `sms:+1${n.replace(/\D/g, "")}`;

const RiseAdvisors = () => (
  <section className="bg-[var(--rise-bg)] px-5 py-12 sm:py-16">
    <RiseReveal className="mx-auto max-w-3xl">
      <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
        Joshua &amp; Makenzie
      </h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">
        {riseConfig.followUpLine}
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {riseConfig.advisors.map((a) => (
          <div key={a.name} className="rounded-2xl border border-navy/10 bg-card p-5 shadow-sm">
            <div className="flex items-center gap-4">
              {a.photo ? (
                <img
                  src={a.photo}
                  alt={a.name}
                  className="h-16 w-16 rounded-full object-cover"
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
                {a.licenseNumber && (
                  <p className="mt-0.5 text-xs text-muted-foreground">CA Lic# {a.licenseNumber}</p>
                )}
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{a.bio}</p>
            <div className="mt-5 flex gap-3">
              <a
                href={telHref(a.phone)}
                className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition hover:opacity-90 motion-reduce:transition-none"
                style={{
                  backgroundColor: "var(--rise-accent)",
                  color: "var(--rise-accent-contrast)",
                }}
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
    </RiseReveal>
  </section>
);

export default RiseAdvisors;
