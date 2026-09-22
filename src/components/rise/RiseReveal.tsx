import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
}

/**
 * Brief fade + small upward translate, once per element.
 * Content is visible by default: the hidden starting state is applied only
 * after the script confirms it is running (before first paint), so the page
 * stays fully readable if the script never runs.
 */
const RiseReveal = ({ children, className = "", delay = 0 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useLayoutEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed || shown || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          window.setTimeout(() => setShown(true), delay);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed, shown, delay]);

  const hidden = armed && !shown;

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-300 ease-out md:duration-[380ms] motion-reduce:transition-none ${
        hidden ? "translate-y-1.5 opacity-0 md:translate-y-3" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default RiseReveal;
