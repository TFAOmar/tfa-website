import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { riseConfig, youTubeIdFrom } from "@/config/rise.config";

/** Click-to-load YouTube facade (youtube-nocookie, no autoplay on page load). */
const RiseVideo = () => {
  const [loaded, setLoaded] = useState(false);
  const [fallbackThumb, setFallbackThumb] = useState(false);
  const id = youTubeIdFrom(riseConfig.videoUrl);

  // Entrance: heading/intro fade-rise on their own observer, then the video block.
  const sectionRef = useRef<HTMLElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [headShown, setHeadShown] = useState(false);
  const [shown, setShown] = useState(false);
  const [mobile, setMobile] = useState(false);

  useLayoutEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;
    setMobile(!window.matchMedia?.("(min-width: 768px)").matches);
    setArmed(true);
  }, []);

  // Heading + intro: fires at 20% of the section.
  useEffect(() => {
    if (!armed || headShown || !sectionRef.current) return;
    const el = sectionRef.current;
    // Guard against sections taller than the viewport never reaching 20%.
    const threshold = Math.min(0.2, (window.innerHeight * 0.5) / Math.max(el.offsetHeight, 1));
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.intersectionRatio >= threshold)) {
          io.disconnect();
          setHeadShown(true);
        }
      },
      { threshold: [threshold] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed, headShown]);

  // Video block: separate observer at 35% of the static wrapper.
  useEffect(() => {
    if (!armed || shown || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.intersectionRatio >= 0.35)) {
          io.disconnect();
          setShown(true);
        }
      },
      { threshold: [0.35] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed, shown]);

  const headHidden = armed && !headShown;
  const hidden = armed && !shown;
  const rise = mobile ? 60 : 80;
  const blockDuration = mobile ? 1100 : 1400;
  const thumbSrc = id
    ? `https://i.ytimg.com/vi/${id}/${fallbackThumb ? "hqdefault" : "maxresdefault"}.jpg`
    : "";

  return (
    <section
      id="rise-video"
      ref={sectionRef}
      className="scroll-mt-20 px-5 py-12 sm:py-16"
      style={{ backgroundColor: "var(--rise-video-bg)" }}
    >
      <div className="mx-auto max-w-3xl lg:max-w-[960px]">
        <div
          className="transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none"
          style={{
            opacity: headHidden ? 0 : 1,
            transform: headHidden ? "translateY(24px)" : "none",
          }}
        >

          <h2
            className="font-serif text-2xl font-bold sm:text-3xl"
            style={{ color: "var(--rise-video-text)" }}
          >
            {riseConfig.videoTitle}
          </h2>
          <p
            className="mt-3 text-base leading-relaxed"
            style={{ color: "var(--rise-video-muted)" }}
          >
            {riseConfig.videoReason}
          </p>
        </div>

        {/* Static wrapper: reserves the 16:9 space and is what the observer measures. */}
        <div ref={ref} className="mt-6 aspect-video w-full">
          <div
            className="h-full w-full overflow-hidden rounded-2xl bg-navy shadow-sm motion-reduce:transition-none"
            style={{
              opacity: hidden ? 0 : 1,
              transform: hidden ? `translateY(${rise}px) scale(0.96)` : "none",
              transition: `opacity ${blockDuration}ms cubic-bezier(0.22, 1, 0.36, 1) 250ms, transform ${blockDuration}ms cubic-bezier(0.22, 1, 0.36, 1) 250ms`,
            }}
          >
            <div className="relative h-full w-full">
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
                  <img
                    src={thumbSrc}
                    onError={() => setFallbackThumb(true)}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                  <span
                    className="absolute bottom-4 left-4 inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 text-sm font-semibold shadow-lg transition-opacity duration-300 ease-out group-hover:scale-105 group-hover:transition-transform group-hover:duration-150 motion-reduce:transition-none sm:bottom-5 sm:left-5"
                    style={{
                      backgroundColor: "var(--rise-accent-strong)",
                      color: "var(--rise-accent-contrast)",
                      opacity: hidden ? 0 : 1,
                      transitionDelay: hidden ? "0ms" : `${250 + blockDuration}ms`,
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
                      backgroundColor: "var(--rise-accent-strong)",
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
      </div>
    </section>
  );
};


export default RiseVideo;
