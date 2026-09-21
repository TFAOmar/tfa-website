import { riseConfig } from "@/config/rise.config";
import RiseReveal from "./RiseReveal";

const RiseHero = () => (
  <section className="px-5 pb-12 pt-10 sm:pt-16">
    <RiseReveal className="mx-auto max-w-3xl">
      <p className="text-sm leading-relaxed text-muted-foreground">
        {riseConfig.partnershipLine}
      </p>
      <span
        aria-hidden
        className="mt-6 block h-1 w-14 rounded-full"
        style={{ backgroundColor: "var(--rise-accent)" }}
      />
      <h1 className="mt-5 font-serif text-[2rem] font-bold leading-[1.15] text-navy sm:text-5xl">
        You bought the home. Now protect what you're building.
      </h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
        A short, unhurried way to make sure the home — and the people in it — are actually covered.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href="#rise-questionnaire"
          className="inline-flex min-h-[52px] items-center justify-center rounded-xl px-6 text-base font-semibold transition hover:opacity-90 motion-reduce:transition-none"
          style={{ backgroundColor: "var(--rise-accent)", color: "var(--rise-accent-contrast)" }}
        >
          See where you stand
        </a>
        <a
          href="#rise-video"
          className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-navy/20 px-6 text-base font-medium text-navy transition hover:border-navy/40 motion-reduce:transition-none"
        >
          Watch the 5-minute video
        </a>
      </div>
    </RiseReveal>
  </section>
);

export default RiseHero;
