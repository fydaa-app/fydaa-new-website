import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";

const SERVICES = [
  { title: "Investment planning", body: "Goal-based portfolios matched to your risk profile and timeline." },
  {
    title: "Portfolio management",
    body: "Ongoing rebalancing so your portfolio stays aligned to your goals.",
  },
  { title: "Financial health monitoring", body: "Track your Wealth Score and net worth in one place." },
  { title: "Debt management", body: "A clear payoff plan so loans stop working against your goals." },
  { title: "Smart budgeting", body: "Set spending limits by category and stay on track." },
  { title: "Expense management", body: "Every transaction tracked and categorised across your accounts." },
  {
    title: "Emergency fund",
    body: "Set up a safety net sized to your life, with guidance on where to keep it.",
  },
  { title: "Tax consulting", body: "Plan investments and declarations to keep more of what you earn." },
  { title: "Insurance", body: "Right-sized life and health cover, reviewed as your needs change." },
];

/** Everything Fydaa helps with beyond investing: a hairline list, not a card grid. */
export default function Services() {
  return (
    <section aria-labelledby="services-title" className="section">
      <Container className="flex flex-col gap-10 lg:gap-12">
        <SectionHeader
          title={<span id="services-title">What Fydaa helps you with</span>}
          description="Investing is one part of it. We also help with the rest of your money: budgets, debt, tax and insurance."
          className="max-w-3xl"
        />
        <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <li key={service.title} className="border-t border-line py-5 sm:py-6">
              <h3 className="text-title text-ink">{service.title}</h3>
              <p className="mt-2 max-w-[40ch] text-base leading-relaxed text-grey-600">{service.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
