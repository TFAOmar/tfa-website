import zpsLogo from "@/assets/zuniga/zps-logo.png.asset.json";
import richardPhoto from "@/assets/zuniga/richard-morales.jpg.asset.json";
import mariahPhoto from "@/assets/zuniga/mariah-lorenzen.jpg.asset.json";

export const zpsLogoUrl = zpsLogo.url;

/** ZPS brand purple — used only as a small accent on this page. */
export const ZPS_PURPLE = "#5B2D9E";

export interface ZunigaAdvisor {
  slug: string;
  name: string;
  title: string;
  license: string;
  phone: string;
  email: string;
  photo: string;
}

export const zunigaAdvisors: ZunigaAdvisor[] = [
  {
    slug: "richard-morales",
    name: "Richard Morales",
    title: "Advisor",
    license: "CA Lic# 0D94958",
    phone: "(562) 395-2922",
    email: "Richardmorales54@gmail.com",
    photo: richardPhoto.url,
  },
  {
    slug: "mariah-lorenzen",
    name: "Mariah Lorenzen",
    title: "Advisor",
    license: "CA Lic# 0F93770",
    phone: "(949) 514-5296",
    email: "Mariah@tfainsuranceadvisors.com",
    photo: mariahPhoto.url,
  },
];

export interface ZunigaService {
  slug: string;
  label: string;
  blurb: string;
}

/** Same services shown on the main TFA site, plus Living Trusts. */
export const zunigaServices: ZunigaService[] = [
  {
    slug: "income-planning",
    label: "Income Planning",
    blurb: "Reliable income streams designed to last throughout retirement.",
  },
  {
    slug: "investment-management",
    label: "Investment Management",
    blurb: "A diversified portfolio aligned with your goals.",
  },
  {
    slug: "living-trusts",
    label: "Living Trusts",
    blurb:
      "Trust-based strategies coordinated with your own attorney, who prepares every legal document.",
  },
  {
    slug: "estate-legacy-planning",
    label: "Estate & Legacy Planning",
    blurb: "Help your wealth transfer efficiently to the people you love.",
  },
  {
    slug: "tax-planning",
    label: "Tax Planning",
    blurb: "Strategies that work alongside the tax work Zuniga already does for you.",
  },
  {
    slug: "health-care-planning",
    label: "Health Care Planning",
    blurb: "Medicare guidance and healthcare cost projections.",
  },
  {
    slug: "annuities",
    label: "Annuities",
    blurb: "Guaranteed income and principal protection options.",
  },
  {
    slug: "401k-rollovers",
    label: "401(k) Rollovers",
    blurb: "Consolidate old retirement accounts with more options.",
  },
  {
    slug: "insurance",
    label: "Insurance",
    blurb: "Life, disability, and long-term care coverage for your family.",
  },
  {
    slug: "group-retirement-plans",
    label: "Group Retirement Plans",
    blurb: "Employer-sponsored retirement benefits for your team.",
  },
  {
    slug: "business-insurance",
    label: "Business Insurance",
    blurb: "Commercial coverage tailored to your business.",
  },
];

export const NOT_SURE_SLUG = "not-sure-yet";

/** Grouped display of the same services, names only. */
export interface ZunigaServiceGroup {
  title: string;
  slugs: string[];
}

export const zunigaServiceGroups: ZunigaServiceGroup[] = [
  {
    title: "Retirement & Income",
    slugs: [
      "income-planning",
      "investment-management",
      "annuities",
      "401k-rollovers",
      "group-retirement-plans",
    ],
  },
  {
    title: "Protection",
    slugs: ["insurance", "business-insurance", "health-care-planning"],
  },
  {
    title: "Estate & Tax",
    slugs: ["living-trusts", "estate-legacy-planning", "tax-planning"],
  },
];
