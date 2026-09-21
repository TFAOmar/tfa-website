/** DRAFT COPY — pending compliance review. Questionnaire data for /rise. */

export type RiseAnswers = Record<string, string | string[]>;

export interface RiseQuestion {
  id: string;
  question: string;
  helper?: string;
  multi?: boolean;
  options: { value: string; label: string }[];
  /** Return true to skip this question given current answers. */
  skipIf?: (a: RiseAnswers) => boolean;
}

const asArray = (v: string | string[] | undefined): string[] =>
  Array.isArray(v) ? v : v ? [v] : [];

export const RISE_QUESTIONS: RiseQuestion[] = [
  {
    id: "plan",
    question: "Do you currently have a living trust or estate plan?",
    options: [
      { value: "current", label: "Yes, and it's current" },
      { value: "old", label: "Yes, but it's from before this home" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "titled",
    question: "Has your new home been titled into your trust?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
    ],
    skipIf: (a) => a.plan !== "current" && a.plan !== "old",
  },
  {
    id: "dependents",
    question: "Who counts on you?",
    helper: "Select all that apply.",
    multi: true,
    options: [
      { value: "spouse", label: "Spouse or partner" },
      { value: "minor", label: "Children under 18" },
      { value: "adult_children", label: "Adult children" },
      { value: "other_family", label: "Other family" },
      { value: "just_me", label: "Just me" },
    ],
  },
  {
    id: "guardian",
    question: "Have you legally named a guardian for your children?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
    ],
    skipIf: (a) => !asArray(a.dependents).includes("minor"),
  },
  {
    id: "authority",
    question:
      "If you couldn't make decisions for yourself, is someone legally authorized to handle your finances and medical choices?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "mortgage",
    question:
      "If something happened to you, could the people in your home keep up with the mortgage?",
    options: [
      { value: "comfortably", label: "Yes, comfortably" },
      { value: "tight", label: "It would be tight" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "life",
    question: "Do you have life insurance outside of what your job provides?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "work", label: "Only through work" },
      { value: "no", label: "No" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "retirement",
    question: "How do you feel about your retirement savings?",
    options: [
      { value: "on_track", label: "On track" },
      { value: "behind", label: "Behind where I'd like" },
      { value: "not_started", label: "Haven't really started" },
      { value: "unsure", label: "Not sure" },
    ],
  },
];

export const visibleQuestions = (answers: RiseAnswers): RiseQuestion[] =>
  RISE_QUESTIONS.filter((q) => !q.skipIf || !q.skipIf(answers));

export const answerLabels = (q: RiseQuestion, answers: RiseAnswers): string =>
  asArray(answers[q.id])
    .map((v) => q.options.find((o) => o.value === v)?.label ?? v)
    .join(", ");
