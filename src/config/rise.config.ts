/**
 * DRAFT COPY — pending compliance review.
 *
 * Single swappable config for the /rise landing page.
 * When real Rise assets, video, advisor details, or testimonials arrive,
 * this is the only file that needs editing.
 */

import tfaLogo from "@/assets/tfa-logo.png";
import riseLogoNavy from "@/assets/rise/rise-logo-navy.png.asset.json";
import riseHero from "@/assets/rise/rise-hero.jpg.asset.json";
import joshuaPhoto from "@/assets/rise/joshua-patrick.jpg.asset.json";
import mackenziePhoto from "@/assets/rise/mackenzie-alexander.jpg.asset.json";

export type RiseFormMode = "mock" | "live";

/** Controls how the contact step submits. "mock" logs to console only. */
export const RISE_FORM_MODE: RiseFormMode = "mock";

export interface RiseAdvisor {
  name: string;
  title: string;
  /** Firm the advisor works with. Rendered under the title. */
  company: string;
  /** Optional. Rendered under the company when present. */
  licenseNumber?: string;
  /** Card copy. */
  shortBio: string;
  /** Expanded copy behind the "More about …" toggle. */
  fullBio: string;
  /** Optional photo URL — initials placeholder renders while empty. */
  photo?: string;
  initials: string;
  phone: string;
  textPhone: string;
  /** Stored for routing only — never displayed or linked on the card. */
  email: string;
}

export interface RiseTestimonial {
  quote: string;
  name: string;
  /** e.g. "Realtor, Rise Real Estate". */
  role?: string;
  detail?: string;
  /** Optional headshot URL. */
  photo?: string;
}

export const riseConfig = {
  /** Rise brand gold. Used for the hero rule, progress bar, and outlines. */
  accentColor: "#CBB26B",
  /** Retained for reference only — no longer used as a button fill. */
  accentStrongColor: "#7A6528",
  accentContrastColor: "#FFFFFF",

  /** Filled buttons on light (ivory) surfaces: navy with white text (14.18:1). */
  buttonBg: "#1C2B45",
  buttonText: "#FFFFFF",
  buttonBgHover: "#2A3F63",
  /** Filled buttons on the hero photo and dark video band: ivory with navy text (12.05:1). */
  buttonOnDarkBg: "#F2ECE0",
  buttonOnDarkText: "#1C2B45",
  buttonOnDarkHover: "#FFFFFF",


  /** Warm two-tone surfaces, scoped to the /rise wrapper only. */
  bgColor: "#F2ECE0",
  bgAltColor: "#E6DDCD",
  cardColor: "#FFFFFF",
  cardBorderColor: "rgba(28, 43, 69, 0.08)",
  /** Muted text, darkened to keep 4.5:1 on both warm surfaces. */
  mutedTextHsl: "215 15% 38%",

  /** Deep navy-black band behind the video section. */
  videoBandColor: "#111827",
  /** Ivory text on the dark video band. */
  videoTextColor: "#F7F3EC",
  /** Slightly muted ivory for the intro line on the dark band. */
  videoMutedTextColor: "#CFCABF",

  /** Hero photograph. Swap this path to change the hero image. */
  heroImage: riseHero.url,


  /** Logos. Leave riseLogoSrc empty to render the typographic placeholder wordmark. */
  riseLogoSrc: riseLogoNavy.url,
  /** Light-on-dark variant. Empty until a light lockup is supplied. */
  riseLogoLight: "",
  riseLogoAlt: "Rise Real Estate",
  riseWordmark: "RISE",
  tfaName: "The Financial Architects",
  /** Same logo file the main site header uses. */
  tfaLogoSrc: tfaLogo,

  partnershipLine:
    "Estate and financial planning for Rise homeowners, provided by The Financial Architects.",

  /** Paste the final YouTube URL (watch, youtu.be, or embed form). */
  videoUrl: "https://www.youtube.com/watch?v=8QPqvnU_fWM",
  videoTitle: "Why a living trust matters once you own a home",
  videoLengthLabel: "5 minutes",
  videoReason:
    "Manny explains, in plain language, what a living trust does and why buying a home is usually the moment it starts to matter.",

  advisors: [
    {
      name: "Joshua Patrick",
      title: "Financial Strategist",
      company: "RISE ESTATE PLANNING",
      licenseNumber: "CA Lic# 4510565",
      shortBio:
        "Joshua is a U.S. Army veteran and Financial Strategist with Rise Estate Planning, with a background in real estate, mortgage lending, and financial services. He helps Rise clients understand their estate planning options and connects them with the right resources to protect their home and the people in it.",
      fullBio:
        "Joshua Patrick is a U.S. Army veteran and Estate Planning Specialist with Rise Real Estate, bringing a professional background spanning real estate, mortgage lending, and financial services. After more than a decade of service as an Army Combat Medic, Joshua has continued his commitment to serving others by helping individuals and families protect what they've worked hard to build. He works alongside Rise Real Estate clients to help them understand their estate planning options and connect them with the appropriate resources to protect their homes, assets, and legacy. Joshua's approach is centered on education and simplicity—making estate planning easier to understand and helping families take the next step toward having a clear plan in place for the people and property that matter most.",
      photo: joshuaPhoto.url,
      initials: "JP",
      phone: "(949) 377-7731",
      textPhone: "(949) 377-7731",
      email: "Josh@theFPgroup.com",
    },
    {
      name: "Mackenzie Alexander",
      title: "Financial Strategist",
      company: "The Financial Architects",
      licenseNumber: "CA Lic# 22051832",
      shortBio:
        "Mackenzie spent over 11 years in the mortgage industry and saw the same gap again and again: families building equity in their homes with little planning in place to protect it. She now helps families see how their mortgage, retirement, protection, and estate planning fit together.",
      fullBio:
        "Mackenzie has spent over 11 years in the mortgage industry, helping individuals and families navigate one of the largest financial decisions of their lives. Throughout her career, she began seeing the same issue time and time again: people were working hard to purchase and build equity in their homes, yet many had little to no protection or planning in place for what was often their most valuable asset. Seeing such a significant gap in education led Mackenzie to expand her work into retirement, estate, and legacy planning. She believes buying a home and obtaining a mortgage is only one piece of the financial puzzle. By taking a more holistic approach, she helps families understand how their mortgage, retirement, protection, and estate planning strategies work together so they can make informed decisions and create the best overall plan for their future.",
      photo: mackenziePhoto.url,
      initials: "MA",
      phone: "(714) 292-5488",
      textPhone: "(714) 292-5488",
      email: "MAlexander@tfainsuranceadvisors.com",
    },
  ] as RiseAdvisor[],

  followUpLine:
    "Joshua or Mackenzie will reach out within one business day, at the time and method you choose.",

  /** Credibility line on the thank-you card. */
  credibilityLine: "The Financial Architects · 300+ licensed advisors across 33 locations",
  /** Leave empty to hide the "See our Google reviews" link. */
  tfaReviewsUrl: "",

  /** Empty array hides the testimonials section entirely. Do not add invented quotes. */
  testimonials: [] as RiseTestimonial[],

  disclosures: {
    educational: "Educational information only — not legal, tax, or investment advice.",
    attorney:
      "Joshua and Mackenzie are not attorneys and do not draft legal documents. We'll walk you through your options and connect you with the right professionals.",
    /* TFA LEGAL / DISCLOSURE SLOT — replace with approved TFA footer language. */
    tfaLegalSlot:
      "This page is for educational and informational purposes only. It does not provide legal, tax, investment, or financial advice. Estate-planning and legal services are provided only by appropriately licensed legal professionals. Insurance and financial products are subject to eligibility, underwriting, suitability, availability, and applicable laws and regulations. No particular outcome is guaranteed. The Financial Architects and Rise are separate companies working together on client education.",
    contactConsent:
      "By submitting, you agree that The Financial Architects and its authorized partners may contact you by phone, text, or email about the information you requested. Consent is not a condition of purchasing any product or service. Message and data rates may apply.",
  },
} as const;

/** Extracts a YouTube video id from common URL shapes. */
export function youTubeIdFrom(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}
