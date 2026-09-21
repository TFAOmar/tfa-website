import { riseConfig } from "@/config/rise.config";
import RiseReveal from "./RiseReveal";

/** Renders nothing while the config testimonials array is empty. */
const RiseTestimonials = () => {
  const items = riseConfig.testimonials;
  if (!items.length) return null;

  return (
    <section className="px-5 py-12 sm:py-16">
      <RiseReveal className="mx-auto max-w-3xl">
        <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
          What homeowners say
        </h2>
        <div className="mt-6 space-y-6">
          {items.map((t) => (
            <figure key={t.quote} className="border-l-2 pl-5" style={{ borderColor: "var(--rise-accent)" }}>
              <blockquote className="text-base leading-relaxed text-foreground/85">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-2 text-sm text-muted-foreground">
                {t.name}
                {t.detail ? ` · ${t.detail}` : ""}
              </figcaption>
            </figure>
          ))}
        </div>
      </RiseReveal>
    </section>
  );
};

export default RiseTestimonials;
