import { riseConfig } from "@/config/rise.config";

/** Rise-only footer. Not the shared site footer. */
const RiseFooter = () => (
  <footer className="border-t border-navy/10 bg-background px-5 py-10">
    <div className="mx-auto max-w-3xl space-y-4 text-center">
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm font-semibold tracking-[0.22em] text-navy">
          {riseConfig.riseWordmark}
        </span>
        <span aria-hidden className="h-4 w-px bg-navy/20" />
        <span className="text-sm font-medium text-navy">{riseConfig.tfaName}</span>
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
    </div>
  </footer>
);

export default RiseFooter;
