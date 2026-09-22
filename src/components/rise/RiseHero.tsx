import { useLayoutEffect, useState, type CSSProperties } from "react";
import { Play } from "lucide-react";
import { riseConfig } from "@/config/rise.config";

/**
 * Staged entrance on mount (no scroll observer, no delay before it begins).
 * Hidden starting states apply only once the script confirms it is running,
 * so with scripts off the hero renders fully visible.
 */
const RiseHero = () => {
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);
  const [mobile, setMobile] = useState(false);

  useLayoutEffect(() => {
    setMobile(!window.matchMedia?.("(min-width: 768px)").matches);
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    setArmed(true);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  const hidden = armed && !shown;

  /** Fade + rise step. */
  const step = (order: number, rise = 0): CSSProperties => ({
    opacity: hidden ? 0 : 1,
    transform: hidden ? `translateY(${rise}px)` : "translateY(0)",
    transition: armed
      ? `opacity 900ms ease-out ${order * 200}ms, transform 900ms ease-out ${order * 200}ms`
      : undefined,
  });

  const overlay = mobile
    ? "linear-gradient(to right, rgba(17,24,39,0.70) 0%, rgba(17,24,39,0.70) 100%)"
    : "linear-gradient(to right, rgba(17,24,39,0.78) 0%, rgba(17,24,39,0.15) 100%)";

  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden px-5 py-16 md:min-h-[88vh]">
      <img
        src={riseConfig.heroImage}
        alt=""
        aria-hidden
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        style={{ objectPosition: mobile ? "72% center" : "65% center" }}
        fetchPriority="high"
      />
      <div aria-hidden className="absolute inset-0 -z-10" style={{ backgroundImage: overlay }} />

      <div className="mx-auto w-full max-w-3xl">
        <p
          className="text-sm leading-relaxed motion-reduce:!transition-none"
          style={{ ...step(0), color: "rgba(247,243,236,0.92)" }}
        >
          {riseConfig.partnershipLine}
        </p>
        <span
          aria-hidden
          className="mt-6 block h-1 w-14 origin-left rounded-full motion-reduce:!transition-none"
          style={{
            backgroundColor: "var(--rise-accent)",
            transform: hidden ? "scaleX(0)" : "scaleX(1)",
            transition: armed ? "transform 900ms ease-out 200ms" : undefined,
          }}
        />
        <h1
          className="mt-5 font-serif text-[2rem] font-bold leading-[1.15] motion-reduce:!transition-none sm:text-5xl"
          style={{ ...step(2, 32), color: "#F7F3EC" }}
        >
          You bought the home. Now protect what you're building.
        </h1>
        <p
          className="mt-4 text-base leading-relaxed motion-reduce:!transition-none sm:text-lg"
          style={{ ...step(3), color: "rgba(247,243,236,0.92)" }}
        >
          A short, unhurried way to make sure the home — and the people in it — are actually covered.
        </p>

        <div
          className="mt-8 flex flex-col items-start gap-3 motion-reduce:!transition-none sm:flex-row sm:items-center sm:gap-6"
          style={step(4)}
        >
          <a
            href="#rise-questionnaire"
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-[var(--rise-btn-dark)] px-6 text-base font-semibold transition-colors hover:bg-[var(--rise-btn-dark-hover)] motion-reduce:transition-none"
            style={{ color: "var(--rise-btn-dark-text)" }}
          >
            See where you stand
          </a>
          <a
            href="#rise-video"
            className="inline-flex min-h-[44px] items-center gap-2 text-base hover:underline"
            style={{ color: "rgba(247,243,236,0.92)" }}
          >
            <Play className="h-4 w-4" aria-hidden />
            Watch the 5-minute video
          </a>
        </div>
      </div>
    </section>
  );
};

export default RiseHero;
