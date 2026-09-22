import { riseConfig } from "@/config/rise.config";
import RiseReveal from "./RiseReveal";

/** Rise-only footer. Not the shared site footer. */
const RiseFooter = () => (
  <footer className="border-t border-[var(--rise-card-border)] bg-[var(--rise-bg-alt)] px-5 py-10">
    <RiseReveal className="mx-auto max-w-3xl space-y-4 text-center">
      <div className="flex items-center justify-center gap-3">
        <span className="flex h-10 items-center text-[15px] font-semibold leading-none tracking-[0.22em] text-navy sm:h-12 sm:text-[18px]">
          {riseConfig.riseWordmark}
        </span>
        <span aria-hidden className="h-8 w-px bg-navy/20 sm:h-10" />
        <img src={riseConfig.tfaLogoSrc} alt={riseConfig.tfaName} className="h-10 w-auto sm:h-12" />
      </div>

      <p className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <a href="/privacy-policy" className="underline hover:text-navy">
          Privacy Policy
        </a>
        <a href="/sms-terms" className="underline hover:text-navy">
          SMS Terms
        </a>
        <a href="/terms-of-service" className="underline hover:text-navy">
          Terms
        </a>
      </p>

      {/* ── TFA LEGAL & DISCLOSURE SLOT ─────────────────────────────────────
          Replace riseConfig.disclosures.tfaLegalSlot with approved TFA copy. */}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {riseConfig.disclosures.tfaLegalSlot}
      </p>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {riseConfig.disclosures.educational} {riseConfig.disclosures.attorney}
      </p>
    </RiseReveal>
  </footer>
);

export default RiseFooter;
