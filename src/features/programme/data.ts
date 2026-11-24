/**
 * Content for the FYIAEP (investment adviser programme) page. Facts here come from the programme
 * brochure; change them only when the programme changes.
 */

export const FYIAEP_BROCHURE_PDF = "/brochure/fyiaep.pdf";
export const TWO_MONTH_PROGRAMME_PDF = "/brochure/2monthpdf.pdf";

/** Admissions phone lines shown on the page. */
export const PROGRAMME_CONTACTS = [
  { label: "Counsellor", display: "+91 99873 08778", href: "tel:+919987308778" },
  { label: "Support", display: "+91 95033 59949", href: "tel:+919503359949" },
] as const;

/** The three phases. `start` and `months` place each phase on the 4-month timeline. */
export const JOURNEY = [
  {
    period: "Months 1 and 2",
    start: 1,
    months: 2,
    title: "Foundation and certification",
    points: [
      "Investment concepts, mutual funds, insurance and tax planning",
      "Financial planning and goal-based investing",
      "NISM X-A and X-B exam prep with 1000+ practice questions",
      "Daily doubt-clearing and live sessions",
    ],
  },
  {
    period: "Month 3",
    start: 3,
    months: 1,
    title: "On-field training",
    points: [
      "Client interaction and customer onboarding practice",
      "CRM orientation and meeting documentation",
      "Business development activities in live settings",
      "Professional conduct and advisory process training",
    ],
  },
  {
    period: "Month 4",
    start: 4,
    months: 1,
    title: "Live implementation",
    points: [
      "Manage real prospects and build financial plans",
      "Present investment solutions to actual clients",
      "Performance evaluation and mentorship reviews",
      "Complete documentation and CRM reporting",
    ],
  },
] as const;

export const CURRICULUM = [
  "Financial planning and goal-based investing",
  "Mutual funds and investment products",
  "Insurance and tax planning",
  "Portfolio construction",
  "Risk profiling and financial health check-ups",
  "Client advisory process",
  "CRM and professional documentation",
  "Business development and client acquisition",
] as const;

export const HIGHLIGHTS = [
  {
    title: "Hybrid learning",
    body: "Live sessions combined with recorded modules, so you learn at your pace and can still ask the experts.",
  },
  {
    title: "NISM dual certification",
    body: "Complete preparation for both the NISM Series X-A and X-B examinations.",
  },
  {
    title: "Real client exposure",
    body: "Interact with actual clients under guided mentorship.",
  },
  {
    title: "Business development",
    body: "Learn client acquisition, professional documentation and CRM tools.",
  },
  {
    title: "Expert mentorship",
    body: "Guidance from SEBI-registered investment advisers and industry practitioners.",
  },
  {
    title: "A start to your career",
    body: "Finish with real advisory experience on your CV, and an opportunity to build a career with Fydaa.",
  },
] as const;

export const AUDIENCES = [
  "Final-year students and graduates in commerce, finance or management",
  "Working professionals moving into financial advisory",
  "Finance enthusiasts who want a structured path into the industry",
  "Anyone who wants NISM certification with real client experience",
] as const;

/** The two programmes, as offered on the page and chosen in the last step of the application. */
export const PROGRAMME_OPTIONS = [
  {
    id: "full",
    badge: "Full programme",
    pageBadge: "Full programme",
    badgeTone: "neutral" as const,
    title: "4-month FYIAEP",
    pageTitle: "4-month FYIAEP programme",
    description:
      "Complete programme with NISM X-A & X-B preparation, on-field training, live client exposure and mentorship, including an opportunity to build a career with Fydaa.",
    pageDescription:
      "The complete programme: NISM X-A and X-B preparation, on-field training, live client exposure and mentorship, including an opportunity to build a career with Fydaa.",
    feeLabel: "₹35,000",
    feeAmount: 35000,
    selectionLabel: "4-month FYIAEP programme",
    detailsHref: FYIAEP_BROCHURE_PDF,
  },
  {
    id: "onfield",
    badge: "NISM certified",
    pageBadge: "Already NISM certified",
    badgeTone: "jade" as const,
    title: "2-month on-field",
    pageTitle: "2-month on-field programme",
    description:
      "For NISM Series X-A & X-B certified candidates. Focused hands-on advisory experience, client interactions and a hiring opportunity with Fydaa.",
    pageDescription:
      "For candidates already certified in NISM Series X-A and X-B: focused hands-on advisory experience, client interactions and a hiring opportunity with Fydaa.",
    feeLabel: "₹17,500",
    feeAmount: 17500,
    selectionLabel: "2-month on-field programme",
    detailsHref: TWO_MONTH_PROGRAMME_PDF,
  },
] as const;

export type ProgrammeOption = (typeof PROGRAMME_OPTIONS)[number];

export function getProgrammeOption(id: unknown): ProgrammeOption | null {
  return PROGRAMME_OPTIONS.find((p) => p.id === id) || null;
}
