import { siteConfig } from "@/config/site";

export interface QuickAnswer {
  id: string;
  question: string;
  answer: string;
}

/** Curated answers shown in the Quick answers panel (static, not AI-generated). */
export const QUICK_ANSWERS: readonly QuickAnswer[] = [
  {
    id: "what-is-fydaa",
    question: "What is Fydaa?",
    answer: `Fydaa is an investment and financial-planning platform by ${siteConfig.entities.adviser.legalName}, a SEBI-registered investment adviser based in Mumbai. After KYC and a risk assessment, Fydaa builds a goal-based, multi-asset portfolio for you and tracks it over time.`,
  },
  {
    id: "what-is-sip",
    question: "What is a SIP?",
    answer:
      "A Systematic Investment Plan (SIP) is a disciplined way to invest in mutual funds: you invest a fixed amount at regular intervals, such as monthly, instead of a lump sum at once.",
  },
  {
    id: "what-is-mutual-fund",
    question: "What is a mutual fund?",
    answer:
      "A mutual fund pools money from many investors and invests it in a diversified portfolio of stocks, bonds, gold or other securities, managed by professional fund managers.",
  },
  {
    id: "what-does-fydaa-provide",
    question: "What does Fydaa provide?",
    answer:
      "Goal-based investing in direct mutual funds, a personalised financial plan, portfolio tracking and analytics, and access to human advisers when you need guidance.",
  },
];
