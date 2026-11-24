import type { ReactNode } from "react";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      {children}
    </svg>
  );
}

function IconRound({ children }: { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const SERVICES = [
  {
    title: "Investment planning",
    body: "Goal-based portfolios matched to your risk profile and timeline.",
    icon: (
      <Icon>
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 3 3 5-6" />
      </Icon>
    ),
  },
  {
    title: "Financial health monitoring",
    body: "Track your Wealth Score and net worth in one dashboard.",
    icon: (
      <Icon>
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </Icon>
    ),
  },
  {
    title: "Debt management",
    body: "A clear payoff plan so loans stop working against your goals.",
    icon: (
      <Icon>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </Icon>
    ),
  },
  {
    title: "Smart budgeting",
    body: "Set spending limits by category and stay on track automatically.",
    icon: (
      <Icon>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 4v3M16 4v3" />
      </Icon>
    ),
  },
  {
    title: "Expense management",
    body: "Every transaction auto-tracked and categorised across accounts.",
    icon: (
      <Icon>
        <path d="M20 12V8H6a2 2 0 010-4h12v4" />
        <path d="M4 6v12a2 2 0 002 2h14v-4" />
        <path d="M18 12a2 2 0 000 4h4v-4h-4z" />
      </Icon>
    ),
  },
  {
    title: "Emergency fund setup & guidance",
    body: "Build a safety net sized to your life, on autopilot.",
    icon: (
      <Icon>
        <path d="M12 22s8-4.5 8-11V5l-8-3-8 3v6c0 6.5 8 11 8 11z" />
      </Icon>
    ),
  },
  {
    title: "Tax consulting",
    body: "Plan investments and declarations to keep more of what you earn.",
    icon: (
      <Icon>
        <path d="M9 2v4M15 2v4M3 10h18" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
      </Icon>
    ),
  },
  {
    title: "Insurance",
    body: "Right-sized life and health cover, reviewed as your needs change.",
    icon: (
      <Icon>
        <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
      </Icon>
    ),
  },
  {
    title: "Portfolio management",
    body: "Ongoing rebalancing so your portfolio stays aligned to your goals.",
    icon: (
      <IconRound>
        <path d="M21 12a9 9 0 11-9-9" />
        <path d="M21 12a9 9 0 00-9-9v9h9z" />
        <circle cx="12" cy="12" r="3.5" />
      </IconRound>
    ),
  },
];

export default function Services() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white font-inter">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-[560px] mb-8 sm:mb-12">
          <h2 className="text-heading mb-3 font-bold text-ink">
            Your 360° personal finance partner
          </h2>
          <p className="text-grey-600 leading-[1.7]">
            We&apos;re not just about investing. Here&apos;s everything we help you with.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
          {SERVICES.map((s) => (
            <li
              key={s.title}
              className="rounded-card border border-grey-200 bg-white p-4 shadow-card sm:px-6 sm:py-7"
            >
              <div className="mb-3 flex size-9 items-center justify-center rounded-xl bg-jade-tint text-jade sm:size-10">
                {s.icon}
              </div>
              <h3 className="mb-1 text-sm font-bold text-ink sm:text-base">{s.title}</h3>
              <p className="text-sm leading-normal text-grey-600">{s.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
