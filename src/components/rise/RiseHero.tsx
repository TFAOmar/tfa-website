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

  useLayoutEffect(() => {
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
      ? `opacity 500ms ease-out ${order * 120}ms, transform 500ms ease-out ${order * 120}ms`
      : undefined,
  });

  return (
    <section className="px-5 pb-12 pt-10 sm:pt-16">
      <div className="mx-auto max-w-3xl">
        <p
          className="text-sm leading-relaxed text-muted-foreground motion-reduce:!transition-none"
          style={step(0)}
        >
          {riseConfig.partnershipLine}
        </p>
        <span
          aria-hidden
          className="mt-6 block h-1 w-14 origin-left rounded-full motion-reduce:!transition-none"
          style={{
            backgroundColor: "var(--rise-accent)",
            transform: hidden ? "scaleX(0)" : "scaleX(1)",
            transition: armed ? "transform 500ms ease-out 120ms" : undefined,
          }}
        />
        <h1
          className="mt-5 font-serif text-[2rem] font-bold leading-[1.15] text-navy motion-reduce:!transition-none sm:text-5xl"
          style={step(2, 24)}
        >
          You bought the home. Now protect what you're building.
        </h1>
        <p
          className="mt-4 text-base leading-relaxed text-muted-foreground motion-reduce:!transition-none sm:text-lg"
          style={step(3)}
        >
          A short, unhurried way to make sure the home — and the people in it — are actually covered.
        </p>

        <div
          className="mt-8 flex flex-col items-start gap-3 motion-reduce:!transition-none sm:flex-row sm:items-center sm:gap-6"
          style={step(4)}
        >
          <a
            href="#rise-questionnaire"
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl px-6 text-base font-semibold transition hover:opacity-90 motion-reduce:transition-none"
            style={{ backgroundColor: "var(--rise-accent)", color: "var(--rise-accent-contrast)" }}
          >
            See where you stand
          </a>
          <a
            href="#rise-video"
            className="inline-flex min-h-[44px] items-center gap-2 text-base text-muted-foreground hover:underline"
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
