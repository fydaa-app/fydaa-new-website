import "@/features/home/styles/home.css";
import { Container } from "@/components/layout/container";
import { ProofBand } from "@/components/layout/proof-band";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/routes";
import GoalsSection from "@/features/home/components/GoalsSection";
import MoneySection from "@/features/home/components/MoneySection";
import AdviceSection from "@/features/home/components/AdviceSection";
import ClosingCta from "@/features/home/components/ClosingCta";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Features",
  description:
    "Goal-based SIPs, a money vault for every rupee, one view of all your finances and a single financial-health score. See what you can do with Fydaa.",
  path: "/features",
});

const CONTENTS = [
  { href: "#products", label: "Goal investing" },
  { href: "#money-title", label: "Money Vault and Wealth Score" },
  { href: "#book-a-call", label: "Fydaa Direct Plan" },
];

export default function FeaturesPage() {
  return (
    <main className="relative m-0 w-full bg-white">
      <section aria-labelledby="features-title" className="pb-8 pt-28 sm:pt-32 lg:pt-36" data-enter>
        <Container className="flex flex-col gap-6">
          <h1 id="features-title" className="max-w-[14ch] text-display text-ink" data-enter-item>
            What you can do with Fydaa
          </h1>
          <p
            className="max-w-[56ch] text-lead text-grey-600"
            data-enter-item
            style={{ ["--i" as string]: 1 }}
          >
            Invest for each goal, see everything you own and owe in one place, know how healthy your finances
            are, and get a written plan from a SEBI-registered adviser.
          </p>
          <nav aria-label="On this page" data-enter-item style={{ ["--i" as string]: 2 }}>
            <ul className="flex flex-wrap gap-2">
              {CONTENTS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-11 items-center rounded-full border border-line px-4 text-sm font-semibold text-ink transition-colors duration-quick hover:border-grey-300 hover:bg-mist"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-wrap gap-3 pt-2" data-enter-item style={{ ["--i" as string]: 3 }}>
            <ButtonLink href={routes.signup.path} size="lg" data-ph-event="Start Investing">
              Start investing
            </ButtonLink>
          </div>
        </Container>
      </section>
      <GoalsSection />
      <MoneySection />
      <AdviceSection />
      <ProofBand />
      <ClosingCta />
    </main>
  );
}
