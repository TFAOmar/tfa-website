import { useLayoutEffect, useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { riseConfig } from "@/config/rise.config";
import RiseHeader from "@/components/rise/RiseHeader";
import RiseHero from "@/components/rise/RiseHero";
import RiseVideo from "@/components/rise/RiseVideo";
import RiseWhyNow from "@/components/rise/RiseWhyNow";
import RiseQuestionnaire from "@/components/rise/RiseQuestionnaire";
import RiseAdvisors from "@/components/rise/RiseAdvisors";
import RiseTestimonials from "@/components/rise/RiseTestimonials";
import RiseFooter from "@/components/rise/RiseFooter";

/** DRAFT COPY — pending compliance review. Standalone /rise landing page. */
const RisePage = () => {
  // Marks that scripts are running; reveal states only apply once set.
  const [jsReady, setJsReady] = useState(false);
  useLayoutEffect(() => setJsReady(true), []);

  return (
  <>
    <SEOHead
      title="Rise × The Financial Architects | Planning for New Homeowners"
      description="A short, plain-language guide for new Rise homeowners on living trusts, estate planning, and protecting the people in the home."
      canonical="https://tfawealthplanning.com/rise"
      noIndex
    />
    <div
      className={`min-h-screen bg-[var(--rise-bg)] ${jsReady ? "rise-js" : ""}`}
      style={
        {
          "--rise-accent": riseConfig.accentColor,
          "--rise-accent-strong": riseConfig.accentStrongColor,

          "--rise-accent-contrast": riseConfig.accentContrastColor,
          "--rise-accent-soft": `${riseConfig.accentColor}1A`,
          "--rise-bg": riseConfig.bgColor,
          "--rise-bg-alt": riseConfig.bgAltColor,
          "--rise-card": riseConfig.cardColor,
          "--rise-card-border": riseConfig.cardBorderColor,
          "--muted-foreground": riseConfig.mutedTextHsl,
        } as React.CSSProperties
      }
    >

      <RiseHeader />
      <main>
        <RiseHero />
        <RiseVideo />
        <RiseWhyNow />
        <RiseQuestionnaire />
        <RiseAdvisors />
        <RiseTestimonials />
      </main>
      <RiseFooter />
    </div>
  </>
  );
};

export default RisePage;
