import kristinFull from "@/assets/advisors/kristin-martin-full.png.asset.json";
import aimeeFull from "@/assets/advisors/aimee-johnson-full.jpg.asset.json";

export interface JoinInterestOption {
  value: string;
  label: string;
  tag: string;
}

export interface AdvisorConnectConfig {
  name: string;
  title: string;
  license?: string;
  address: string;
  /** Full-length photo URL. When omitted an initials placeholder is shown. */
  photo?: string;
  call: string;
  text: string;
  office: string;
  mobile?: string;
  email: string;
  advisorSlug: string;
  formName: string;
  canonicalPath: string;
  joinTitle: string;
  joinSubtitle: string;
  joinInterestOptions?: JoinInterestOption[];
  personDescription: string;
}

export const kristinMartinConnectConfig: AdvisorConnectConfig = {
  name: "Kristin Martin",
  title: "Director of Agents & Operations",
  license: "CA Lic# 4334059",
  address: "13890 Peyton Dr. #A, Chino Hills, CA 91709",
  photo: kristinFull.url,
  call: "(949) 312-8331",
  text: "(949) 312-8331",
  office: "(888) 305-5396",
  mobile: "(626) 824-4939",
  email: "kristin@tfainsuranceadvisors.com",
  advisorSlug: "kristin-martin",
  formName: "kristin-martin-connect",
  canonicalPath: "/kristin",
  joinTitle: "Join / Learn the Business",
  joinSubtitle: "Explore a career with The Financial Architects.",
  personDescription:
    "Director of Agents & Operations at The Financial Architects, serving clients and future agents across Southern California.",
};

export const aimeeJohnsonConnectConfig: AdvisorConnectConfig = {
  name: "Aimee Johnson",
  // Placeholder until her business card details arrive
  title: "Financial Strategist",
  license: "CA Lic# [PENDING]",
  address: "13890 Peyton Dr. #A, Chino Hills, CA 91709",
  photo: aimeeFull.url,
  call: "(909) 300-7475",
  text: "(909) 300-7475",
  office: "(888) 305-5396",
  email: "ajohnson@tfainsuranceadvisors.com",
  advisorSlug: "aimee-johnson",
  formName: "aimee-johnson-connect",
  canonicalPath: "/aimee",
  joinTitle: "Join the Team / Let's Partner",
  joinSubtitle:
    "Explore a career or a referral partnership with The Financial Architects.",
  joinInterestOptions: [
    { value: "recruit", label: "Joining the team", tag: "interest:recruit" },
    { value: "partner", label: "Partnering", tag: "interest:partner" },
  ],
  personDescription:
    "Financial Strategist at The Financial Architects, serving clients, future agents, and referral partners across Southern California.",
};
