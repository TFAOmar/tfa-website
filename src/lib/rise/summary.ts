/** DRAFT COPY — pending compliance review. Summary rules for /rise. */

import type { RiseAnswers } from "./questions";

export interface RiseSummaryItem {
  id: string;
  heading: string;
  body: string;
}

const arr = (v: string | string[] | undefined): string[] =>
  Array.isArray(v) ? v : v ? [v] : [];

export function buildRiseSummary(a: RiseAnswers): RiseSummaryItem[] {
  const items: RiseSummaryItem[] = [];

  // Estate plan / living trust always appears first, with adaptive wording.
  const plan = a.plan as string | undefined;
  const titled = a.titled as string | undefined;
  if (plan === "no" || plan === "unsure" || !plan) {
    items.push({
      id: "estate",
      heading: "Starting an estate plan",
      body: "Worth talking through what a living trust does and how families usually begin one after buying a home.",
    });
  } else if (titled === "no" || titled === "unsure" || plan === "old") {
    items.push({
      id: "estate",
      heading: "Making sure the new home is included",
      body: "An existing plan doesn't automatically cover a new home, so it's worth confirming how this one is titled.",
    });
  } else {
    items.push({
      id: "estate",
      heading: "A quick review now that you own this home",
      body: "Worth a short look at your existing plan to confirm it still reflects your household today.",
    });
  }

  if (arr(a.dependents).includes("minor") && (a.guardian === "no" || a.guardian === "unsure")) {
    items.push({
      id: "guardian",
      heading: "Guardianship for your children",
      body: "Worth discussing how families formally name who would care for their children.",
    });
  }

  if (a.authority === "no" || a.authority === "unsure") {
    items.push({
      id: "authority",
      heading: "Who can act for you",
      body: "Worth reviewing how financial and medical decision-making authority is usually documented.",
    });
  }

  if (a.mortgage && a.mortgage !== "comfortably") {
    items.push({
      id: "mortgage",
      heading: "Keeping up with the mortgage",
      body: "Worth exploring what options households consider so the home stays affordable for the people in it.",
    });
  }

  if (a.life && a.life !== "yes") {
    items.push({
      id: "life",
      heading: "Life insurance outside of work",
      body: "Worth looking at what coverage you already have and how workplace coverage behaves if the job changes.",
    });
  }

  if (a.retirement && a.retirement !== "on_track") {
    items.push({
      id: "retirement",
      heading: "Retirement savings",
      body: "Worth a conversation about savings and income strategies as your household grows.",
    });
  }

  return items;
}
