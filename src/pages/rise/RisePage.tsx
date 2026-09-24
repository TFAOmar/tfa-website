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
  useLayoutEffect(() => {
    setJsReady(true);
    // Preload the hero photo so its reveal isn't waiting on the network.
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = riseConfig.heroImage;
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  return (
  <>
    <SEOHead
      title="Rise × The Financial Architects | Planning for New Homeowners"
      description="A short, plain-language guide for new Rise homeowners on living trusts, estate planning, and protecting the people in the home."
      canonical="https://tfawealthplanning.com/rise"
    />
    <div
      className={`min-h-screen bg-[var(--rise-bg)] ${jsReady ? "rise-js" : ""}`}
      style={
        {
          "--rise-accent": riseConfig.accentColor,
          "--rise-accent-strong": riseConfig.accentStrongColor,

          "--rise-accent-contrast": riseConfig.accentContrastColor,
          "--rise-accent-soft": `${riseConfig.accentColor}1A`,
          "--rise-btn": riseConfig.buttonBg,
          "--rise-btn-text": riseConfig.buttonText,
          "--rise-btn-hover": riseConfig.buttonBgHover,
          "--rise-btn-dark": riseConfig.buttonOnDarkBg,
          "--rise-btn-dark-text": riseConfig.buttonOnDarkText,
          "--rise-btn-dark-hover": riseConfig.buttonOnDarkHover,
          "--rise-bg": riseConfig.bgColor,
          "--rise-bg-alt": riseConfig.bgAltColor,
          "--rise-card": riseConfig.cardColor,
          "--rise-card-border": riseConfig.cardBorderColor,
          "--rise-video-bg": riseConfig.videoBandColor,
          "--rise-video-text": riseConfig.videoTextColor,
          "--rise-video-muted": riseConfig.videoMutedTextColor,
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
