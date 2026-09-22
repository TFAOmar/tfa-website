import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Play } from "lucide-react";
import { riseConfig } from "@/config/rise.config";

/**
 * Cold-load opening sequence: the hero starts as solid navy, the text steps in,
 * then the photo (with its gradient overlay) wipes down from the top.
 * Hidden starting states apply only once the script confirms it is running,
 * so with scripts off the hero renders fully visible. Reduced motion skips it.
 */
const RiseHero = () => {
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [photoIn, setPhotoIn] = useState(false);
  const [imgReady, setImgReady] = useState(false);
  const cueDone = useRef(false);

  useLayoutEffect(() => {
    setMobile(!window.matchMedia?.("(min-width: 768px)").matches);
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhotoIn(true);
      return;
    }
    setArmed(true);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  const hidden = armed && !shown;
  // Mobile holds 600ms instead of 700ms and shortens each duration by ~15%.
  const scale = mobile ? 0.85 : 1;
  const hold = mobile ? 600 : 700;
  const ms = (n: number) => Math.round(n * scale);
  /** Absolute desktop offset mapped onto the current hold + speed. */
  const at = (delay: number) => Math.round(hold + (delay - 700) * scale);

  // Photo cue at 2100ms (1790ms mobile) — but never before the image has decoded.
  useEffect(() => {
    if (!armed) return;
    const t = window.setTimeout(() => {
      cueDone.current = true;
      if (imgReady) setPhotoIn(true);
    }, at(2100));
    return () => window.clearTimeout(t);
  }, [armed, imgReady, mobile]);

  useEffect(() => {
    if (imgReady && cueDone.current) setPhotoIn(true);
  }, [imgReady]);

  /** Fade + rise step with an absolute start offset. */
  const step = (delay: number, duration: number, rise = 0): CSSProperties => ({
    opacity: hidden ? 0 : 1,
    transform: hidden ? `translateY(${rise}px)` : "translateY(0)",
    transition: armed
      ? `opacity ${ms(duration)}ms ease-out ${at(delay)}ms, transform ${ms(duration)}ms ease-out ${at(delay)}ms`
      : undefined,
  });

  const overlay = mobile
    ? "linear-gradient(to right, rgba(17,24,39,0.70) 0%, rgba(17,24,39,0.70) 100%)"
    : "linear-gradient(to right, rgba(17,24,39,0.78) 0%, rgba(17,24,39,0.15) 100%)";

  const photoHidden = armed && !photoIn;

  return (
    <section
      className="relative isolate flex min-h-[80vh] items-center overflow-hidden px-5 py-16 md:min-h-[88vh]"
      style={{ backgroundColor: riseConfig.videoBandColor }}
    >
      {/* Photo + overlay travel together so the text keeps its contrast. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 motion-reduce:!transition-none"
        style={{
          clipPath: photoHidden ? "inset(0 0 100% 0)" : "inset(0)",
          transition: armed
            ? `clip-path ${mobile ? 1300 : 1600}ms cubic-bezier(0.22, 1, 0.36, 1)`
            : undefined,
        }}
      >
        <img
          src={riseConfig.heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: mobile ? "72% center" : "65% center" }}
          fetchPriority="high"
          onLoad={() => setImgReady(true)}
          ref={(el) => {
            if (el?.complete) setImgReady(true);
          }}
        />
        <div className="absolute inset-0" style={{ backgroundImage: overlay }} />
      </div>

      <div className="mx-auto w-full max-w-3xl">
        <p
          className="text-sm leading-relaxed motion-reduce:!transition-none"
          style={{ ...step(700, 800), color: "rgba(247,243,236,0.92)" }}
        >
          {riseConfig.partnershipLine}
        </p>
        <span
          aria-hidden
          className="mt-6 block h-1 w-14 origin-left rounded-full motion-reduce:!transition-none"
          style={{
            backgroundColor: "var(--rise-accent)",
            transform: hidden ? "scaleX(0)" : "scaleX(1)",
            transition: armed ? `transform ${ms(800)}ms ease-out ${at(950)}ms` : undefined,
          }}
        />
        <h1
          className="mt-5 font-serif text-[2rem] font-bold leading-[1.15] motion-reduce:!transition-none sm:text-5xl"
          style={{ ...step(1200, 1000, 32), color: "#F7F3EC" }}
        >
          You bought the home. Now protect what you're building.
        </h1>
        <p
          className="mt-4 text-base leading-relaxed motion-reduce:!transition-none sm:text-lg"
          style={{ ...step(1450, 800), color: "rgba(247,243,236,0.92)" }}
        >
          A short, unhurried way to make sure the home — and the people in it — are actually covered.
        </p>

        <div
          className="mt-8 flex flex-col items-start gap-3 motion-reduce:!transition-none sm:flex-row sm:items-center sm:gap-6"
          style={step(1700, 800)}
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
