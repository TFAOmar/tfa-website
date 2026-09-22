/**
 * DRAFT COPY — pending compliance review.
 *
 * Single swappable config for the /rise landing page.
 * When real Rise assets, video, advisor details, or testimonials arrive,
 * this is the only file that needs editing.
 */

import tfaLogo from "@/assets/tfa-logo.png";

export type RiseFormMode = "mock" | "live";

/** Controls how the contact step submits. "mock" logs to console only. */
export const RISE_FORM_MODE: RiseFormMode = "mock";

export interface RiseAdvisor {
  name: string;
  title: string;
  /** Optional. Rendered under the title when present. */
  licenseNumber?: string;
  /** Two-sentence placeholder bio. */
  bio: string;
  /** Optional photo URL — initials placeholder renders while empty. */
  photo?: string;
  initials: string;
  phone: string;
  textPhone: string;
}

export interface RiseTestimonial {
  quote: string;
  name: string;
  detail?: string;
}

export const riseConfig = {
  /** Rise brand accent. Placeholder until official Rise colors arrive. */
  accentColor: "#B8763E",
  accentContrastColor: "#FFFFFF",

  /** Warm two-tone surfaces, scoped to the /rise wrapper only. */
  bgColor: "#F7F3EC",
  bgAltColor: "#EDE7DC",
  cardColor: "#FFFFFF",
  cardBorderColor: "rgba(28, 43, 69, 0.08)",
  /** Muted text, darkened to keep 4.5:1 on both warm surfaces. */
  mutedTextHsl: "215 15% 40%",


  /** Logos. Leave empty to render the typographic placeholder wordmark. */
  riseLogoSrc: "",
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
      name: "Joshua",
      title: "Financial Professional, The Financial Architects",
      licenseNumber: "",
      bio: "Placeholder bio — Joshua works with new homeowners to organize what comes after closing. He walks families through their options and connects them with the right professionals.",
      initials: "J",
      phone: "(888) 305-5396",
      textPhone: "(888) 305-5396",
    },
    {
      name: "Makenzie",
      title: "Financial Professional, The Financial Architects",
      licenseNumber: "",
      bio: "Placeholder bio — Makenzie keeps every conversation unhurried and in plain language. She helps households see what they already have in place and what is still open.",
      initials: "M",
      phone: "(888) 305-5396",
      textPhone: "(888) 305-5396",
    },
  ] as RiseAdvisor[],

  followUpLine:
    "Joshua or Makenzie will reach out within one business day, at the time and method you choose.",

  /** Empty array hides the testimonials section entirely. Do not add invented quotes. */
  testimonials: [] as RiseTestimonial[],

  disclosures: {
    educational: "Educational information only — not legal, tax, or investment advice.",
    attorney:
      "Joshua and Makenzie are not attorneys and do not draft legal documents. We'll walk you through your options and connect you with the right professionals.",
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
