import { riseConfig } from "@/config/rise.config";

/** Standalone minimal header for /rise only. Not the shared site header. */
const RiseHeader = () => (
  <header className="sticky top-0 z-40 border-b border-navy/10 bg-background/95 backdrop-blur">
    <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-3">
      <div className="flex items-center gap-3">
        {riseConfig.riseLogoSrc ? (
          <img src={riseConfig.riseLogoSrc} alt="Rise" className="h-7 w-auto" />
        ) : (
          <span className="text-[19px] font-semibold leading-none tracking-[0.22em] text-navy">
            {riseConfig.riseWordmark}
          </span>
        )}
        <span aria-hidden className="h-6 w-px bg-navy/20" />
        <img
          src={riseConfig.tfaLogoSrc}
          alt={riseConfig.tfaName}
          className="h-7 w-auto"
        />
      </div>
      <a
        href="#rise-questionnaire"
        className="inline-flex min-h-[40px] items-center rounded-full px-4 text-sm font-semibold"
        style={{ backgroundColor: "var(--rise-accent)", color: "var(--rise-accent-contrast)" }}
      >
        Get started
      </a>
    </div>
  </header>
);

export default RiseHeader;
