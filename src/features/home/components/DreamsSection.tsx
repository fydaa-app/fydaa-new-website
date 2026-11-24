import Image from "next/image";
import { Container } from "@/components/layout/container";
import { SectionHeader } from "@/components/layout/section-header";
import { ButtonLink } from "@/components/ui/button";

const GOALS = [
  {
    id: "short-term",
    title: "Consume mindfully",
    tagline: "Fulfil dreams without draining your future",
    body: "Plan for your car, wedding or that solo trip without falling into high-interest EMIs. Set the goal, build a plan and reach it on your terms.",
    image: "/dreams/goals/01-Vacation.png",
  },
  {
    id: "medium-term",
    title: "Save strategically",
    tagline: "Be ready for life’s curveballs",
    body: "From emergency funds to marriage funds, create savings pockets that keep you stress-free. Small, consistent action beats last-minute panic.",
    image: "/dreams/goals/05-Emergency-Fund.png",
  },
  {
    id: "long-term",
    title: "Invest to build wealth",
    tagline: "Your money should work while you sleep",
    body: "Investing isn’t just for the rich. Start small, start smart and let compounding do the work, with expert-backed plans for your goals.",
    image: "/dreams/goals/10-Home-Purchase.png",
  },
];

/** "For your dreams and aspirations": three goal horizons and one call to action. */
export default function DreamsSection() {
  return (
    <section aria-labelledby="dreams-title" className="bg-white py-12 sm:py-20 lg:py-24">
      <Container className="flex flex-col gap-10 sm:gap-12">
        <SectionHeader
          align="center"
          title={<span id="dreams-title">For your dreams and aspirations</span>}
          description="Direct every rupee with purpose, whether you’re spending today, saving for tomorrow or investing for the future."
        />
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {GOALS.map((goal) => (
            <li
              key={goal.id}
              id={goal.id}
              className="flex gap-4 rounded-card border border-grey-200 bg-grey-50 p-4 sm:flex-col sm:gap-3 sm:p-6 sm:last:col-span-2 lg:last:col-span-1"
            >
              <Image
                src={goal.image}
                alt=""
                width={56}
                height={56}
                className="size-11 shrink-0 object-contain sm:size-14"
              />
              <div className="flex flex-col gap-1 sm:gap-2">
                <h3 className="text-title font-bold text-ink">{goal.title}</h3>
                <p className="text-sm font-medium text-jade">{goal.tagline}</p>
                <p className="text-sm leading-relaxed text-grey-600 sm:text-base">{goal.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <ButtonLink href="/#book-a-call" size="lg" data-ph-event="Book a Free Call">
            Book a free call
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
