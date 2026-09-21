/**
 * Isolated content/config for the /rise landing page (Rise x TFA — Homeowner Legacy Path).
 * Everything page-specific lives here so copy, team, and media can be swapped
 * without touching components.
 */

/** ── CONFIG POINT ──────────────────────────────────────────────────────────
 *  Paste the final YouTube URL (watch or youtu.be link) here. While it is
 *  empty the page renders the premium placeholder card instead of an embed.
 *  Example: "https://www.youtube.com/watch?v=XXXXXXXXXXX"
 */
export const RISE_VIDEO_URL = "";
export const RISE_VIDEO_LENGTH_LABEL = "About 5 minutes";
export const RISE_VIDEO_TITLE = "Why a living trust matters after you buy a home";
export const RISE_VIDEO_SPEAKER = "Manny Soto · The Financial Architects";
export const RISE_VIDEO_INTRO =
  "Manny walks through what a living trust actually does, how it differs from a will, and why buying a home is the moment most families start paying attention.";

/** Extracts a YouTube video id from common URL shapes. */
export function youTubeIdFrom(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

export interface RiseTeamMember {
  name: string;
  role: string;
  bio: string;
  /** Optional image URL. When absent an elegant initials placeholder renders. */
  photo?: string;
  initials: string;
}

export const RISE_TEAM: RiseTeamMember[] = [
  {
    name: "Joshua",
    role: "Rise · Client Guide",
    initials: "J",
    bio: "Placeholder bio — Joshua works with recent homebuyers to organize the next steps after closing, from household protection to long-term planning conversations.",
  },
  {
    name: "Makenzie",
    role: "Rise · Client Guide",
    initials: "M",
    bio: "Placeholder bio — Makenzie helps families put their plans in plain language, coordinates introductions, and keeps every conversation unhurried and clear.",
  },
];

export interface RiseService {
  id: string;
  title: string;
  description: string;
  primary?: boolean;
}

export const RISE_SERVICES: RiseService[] = [
  {
    id: "estate",
    title: "Living Trust & Estate Planning",
    description:
      "Education and coordination around trusts, wills, and how a home is titled. Documents are prepared by independent licensed attorneys.",
    primary: true,
  },
  {
    id: "life",
    title: "Life Insurance",
    description:
      "A look at what coverage is already in place through work or personal policies, and what a family income plan could look like.",
  },
  {
    id: "mortgage",
    title: "Mortgage Protection",
    description:
      "Options families consider so a mortgage does not become a burden for the people who stay in the home.",
  },
  {
    id: "retirement",
    title: "Retirement Planning",
    description:
      "Strategies and education on savings, rollovers, and income planning as your household grows.",
  },
];

export interface RiseQuestion {
  id: string;
  question: string;
  helper?: string;
  options: { value: string; label: string }[];
  /** Interest topic ids added when the given answers are selected. */
  interestOn?: { value: string; interest: string }[];
  /** Skip this question when a previous answer matches. */
  skipIf?: (answers: Record<string, string>) => boolean;
}

const YES_NO_UNSURE = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

export const RISE_QUESTIONS: RiseQuestion[] = [
  {
    id: "owns_home",
    question: "Do you currently own a home?",
    helper: "Recently closed counts.",
    options: [
      { value: "yes", label: "Yes" },
      { value: "recent", label: "Yes — closed in the last year" },
      { value: "no", label: "Not yet" },
    ],
  },
  {
    id: "has_plan",
    question: "Do you already have a living trust or estate plan?",
    options: [
      { value: "trust", label: "Yes, a living trust" },
      { value: "will", label: "A will only" },
      { value: "no", label: "Nothing yet" },
      { value: "unsure", label: "Not sure" },
    ],
    interestOn: [
      { value: "no", interest: "estate" },
      { value: "will", interest: "estate" },
      { value: "unsure", interest: "estate" },
    ],
  },
  {
    id: "plan_reviewed",
    question: "Has that plan been reviewed in the last 3–5 years?",
    helper: "Homes, births, and moves are the usual reasons to revisit it.",
    options: YES_NO_UNSURE,
    skipIf: (a) => a.has_plan === "no" || a.has_plan === "unsure",
    interestOn: [
      { value: "no", interest: "estate" },
      { value: "unsure", interest: "estate" },
    ],
  },
  {
    id: "home_in_trust",
    question: "Is your home titled in the name of your trust?",
    options: YES_NO_UNSURE,
    skipIf: (a) => a.has_plan !== "trust",
    interestOn: [
      { value: "no", interest: "estate" },
      { value: "unsure", interest: "estate" },
    ],
  },
  {
    id: "dependents",
    question: "Do you have children or others who depend on you?",
    options: [
      { value: "minor", label: "Yes — minor children" },
      { value: "adult", label: "Yes — adult children or family" },
      { value: "no", label: "No" },
    ],
    interestOn: [
      { value: "minor", interest: "life" },
      { value: "adult", interest: "estate" },
    ],
  },
  {
    id: "decision_maker",
    question: "Would someone know who should manage your affairs if you could not?",
    options: YES_NO_UNSURE,
    interestOn: [
      { value: "no", interest: "estate" },
      { value: "unsure", interest: "estate" },
    ],
  },
  {
    id: "coverage",
    question: "Do you currently have life insurance or mortgage protection?",
    options: [
      { value: "both", label: "Both" },
      { value: "life_only", label: "Life insurance only" },
      { value: "work_only", label: "Only through work" },
      { value: "none", label: "Neither" },
    ],
    interestOn: [
      { value: "life_only", interest: "mortgage" },
      { value: "work_only", interest: "life" },
      { value: "none", interest: "life" },
    ],
  },
  {
    id: "mortgage_balance",
    question: "Would your household be able to cover the mortgage on one income?",
    options: YES_NO_UNSURE,
    skipIf: (a) => a.owns_home === "no",
    interestOn: [
      { value: "no", interest: "mortgage" },
      { value: "unsure", interest: "mortgage" },
    ],
  },
  {
    id: "retirement",
    question: "Are you interested in retirement-planning guidance?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "later", label: "Maybe later" },
      { value: "no", label: "Not right now" },
    ],
    interestOn: [{ value: "yes", interest: "retirement" }],
  },
];

export const RISE_ORGANIZE_CARDS = [
  {
    title: "Property & ownership",
    body: "How the home is titled, what happens to it, and which documents reference it.",
  },
  {
    title: "Decision-makers",
    body: "Who can act for you on financial and healthcare matters if you are unable to.",
  },
  {
    title: "Family instructions",
    body: "Guardianship wishes, written intentions, and where your family can find them.",
  },
  {
    title: "Beneficiary coordination",
    body: "Making sure policies, retirement accounts, and documents point in the same direction.",
  },
];

export interface RiseTestimonial {
  quote: string;
  name: string;
  detail: string;
}

/** Placeholder testimonials — replace with reviewed, consented client quotes. */
export const RISE_TESTIMONIALS: RiseTestimonial[] = [
  {
    quote:
      "Placeholder testimonial. Sample copy describing a calm, unhurried first conversation after closing on a home.",
    name: "Placeholder Client",
    detail: "Sample homeowner · placeholder",
  },
  {
    quote:
      "Placeholder testimonial. Sample copy about finally understanding what a living trust does and what it does not do.",
    name: "Placeholder Client",
    detail: "Sample homeowner · placeholder",
  },
  {
    quote:
      "Placeholder testimonial. Sample copy about getting the household's documents and beneficiaries organized in one place.",
    name: "Placeholder Client",
    detail: "Sample family · placeholder",
  },
];

export const RISE_DISCLOSURES = {
  educational:
    "Educational information only — not legal, tax, or investment advice.",
  attorney:
    "Joshua and Makenzie are not attorneys and do not draft legal documents. Trust and estate documents are prepared by independent licensed attorneys.",
  consent:
    "Placeholder compliance copy — pending review. By submitting this form you agree that Rise and The Financial Architects may contact you by phone, text, or email about your request. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help.",
  footer:
    "Placeholder disclosures — pending compliance review. Rise and The Financial Architects are separate entities working together on client education. Insurance and financial products are offered through licensed professionals where applicable.",
};
