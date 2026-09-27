export interface GiveawayRules {
  eligibility: string;
  entryDeadline: string;
  drawing: string;
  winnerNotice: string;
}

export interface Giveaway {
  slug: string;
  active: boolean;
  /** ISO datetime; new entries blocked after this. Queued entries still send. */
  endsAt: string;
  headline: string;
  subline: string;
  sponsor: string;
  webhookUrl: string;
  rules: GiveawayRules;
}

export const giveaways: Giveaway[] = [
  {
    slug: "ca-trucking-show",
    active: true,
    endsAt: "2026-10-05T00:00:00-07:00",
    headline: "Enter to Win a YETI Cooler",
    subline: "Winner drawn at the end of the show. You don't need to be present to win.",
    sponsor: "The Financial Architects",
    webhookUrl: "",
    rules: {
      eligibility: "Open to California Trucking Show attendees 18 or older.",
      entryDeadline: "Entries accepted through the close of the show on October 4, 2026.",
      drawing:
        "One winner will be selected at random from all eligible entries at the end of the show on October 4, 2026. You do not need to be present to win. Duplicate entries do not increase your chances.",
      winnerNotice: "The winner will be contacted by phone or email.",
    },
  },
];

export const getGiveaway = (slug?: string) => giveaways.find((g) => g.slug === slug);

export const isGiveawayOpen = (g?: Giveaway) =>
  !!g && g.active && Date.now() < new Date(g.endsAt).getTime();
