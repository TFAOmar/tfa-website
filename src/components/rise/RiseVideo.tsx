import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { riseConfig, youTubeIdFrom } from "@/config/rise.config";

/** Click-to-load YouTube facade (youtube-nocookie, no autoplay on page load). */
const RiseVideo = () => {
  const [loaded, setLoaded] = useState(false);
  const [fallbackThumb, setFallbackThumb] = useState(false);
  const id = youTubeIdFrom(riseConfig.videoUrl);

  // Entrance: clip-path wipe for the thumbnail, delayed fade/scale for the pill.
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
          setShown(true);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed, shown]);

  const hidden = armed && !shown;
  const thumbSrc = id
    ? `https://i.ytimg.com/vi/${id}/${fallbackThumb ? "hqdefault" : "maxresdefault"}.jpg`
    : "";

  return (
    <section id="rise-video" className="scroll-mt-20 bg-secondary/40 px-5 py-12 sm:py-16">
      <div ref={ref} className="mx-auto max-w-3xl lg:max-w-[960px]">
        <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
          {riseConfig.videoTitle}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {riseConfig.videoReason}
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl bg-navy shadow-sm">
          <div className="relative aspect-video w-full">
            {id && loaded ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
                title={riseConfig.videoTitle}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : id ? (
              <button
                type="button"
                onClick={() => setLoaded(true)}
                className="group absolute inset-0 h-full w-full"
                aria-label={`Play video: ${riseConfig.videoTitle}`}
              >
                {/* Color pass: navy, then accent, then the thumbnail — each wiping left to right. */}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-navy transition-[clip-path] duration-[350ms] ease-out md:duration-500 motion-reduce:transition-none"
                  style={{
                    clipPath: hidden ? "inset(0 100% 0 0)" : "inset(0 0 0 0)",
                    transitionDelay: "0ms",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute inset-0 transition-[clip-path] duration-[350ms] ease-out md:duration-500 motion-reduce:transition-none"
                  style={{
                    backgroundColor: "var(--rise-accent)",
                    clipPath: hidden ? "inset(0 100% 0 0)" : "inset(0 0 0 0)",
                    transitionDelay: hidden ? "0ms" : "120ms",
                  }}
                />
                <img
                  src={thumbSrc}
                  onError={() => setFallbackThumb(true)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-[clip-path] duration-[350ms] ease-out md:duration-500 motion-reduce:transition-none"
                  style={{
                    clipPath: hidden ? "inset(0 100% 0 0)" : "inset(0 0 0 0)",
                    transitionDelay: hidden ? "0ms" : "240ms",
                  }}
                  loading="lazy"
                />
                <span
                  className="absolute bottom-4 left-4 inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-semibold shadow-lg transition duration-300 ease-out group-hover:scale-105 group-hover:duration-150 motion-reduce:transition-none sm:bottom-5 sm:left-5"
                  style={{
                    backgroundColor: "var(--rise-accent)",
                    color: "var(--rise-accent-contrast)",
                    opacity: hidden ? 0 : 1,
                    transform: hidden ? "scale(0.9)" : "scale(1)",
                    transitionDelay: hidden ? "0ms" : "740ms",
                  }}
                >
                  <Play className="h-4 w-4" aria-hidden />
                  Play · {riseConfig.videoLengthLabel === "5 minutes" ? "5 min" : riseConfig.videoLengthLabel}
                </span>
              </button>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "var(--rise-accent)",
                    color: "var(--rise-accent-contrast)",
                  }}
                >
                  <Play className="ml-0.5 h-6 w-6" aria-hidden />
                </span>
                <p className="text-sm font-medium text-white/90">
                  Video coming soon · {riseConfig.videoLengthLabel}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RiseVideo;
