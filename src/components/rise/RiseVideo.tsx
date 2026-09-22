import { useState } from "react";
import { Play } from "lucide-react";
import { riseConfig, youTubeIdFrom } from "@/config/rise.config";
import RiseReveal from "./RiseReveal";

/** Click-to-load YouTube facade (youtube-nocookie, no autoplay on page load). */
const RiseVideo = () => {
  const [loaded, setLoaded] = useState(false);
  const id = youTubeIdFrom(riseConfig.videoUrl);

  return (
    <section id="rise-video" className="scroll-mt-20 bg-secondary/40 px-5 py-12 sm:py-16">
      <RiseReveal className="mx-auto max-w-3xl lg:max-w-[960px]">
        <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">
          {riseConfig.videoTitle}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {riseConfig.videoReason}
        </p>

        <div className="mt-6 overflow-hidden rounded-2xl border border-navy/10 bg-navy shadow-sm">
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
                <img
                  src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                  alt=""
                  className="h-full w-full object-cover opacity-80"
                  loading="lazy"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition group-hover:scale-105 motion-reduce:transition-none"
                    style={{
                      backgroundColor: "var(--rise-accent)",
                      color: "var(--rise-accent-contrast)",
                    }}
                  >
                    <Play className="ml-0.5 h-7 w-7" aria-hidden />
                  </span>
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
      </RiseReveal>
    </section>
  );
};

export default RiseVideo;
