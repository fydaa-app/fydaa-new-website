import Image from "next/image";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import BookCallForm from "./BookCallForm";

const PLAN_COVERS = [
  "Budget and cash flow",
  "Paying down debt",
  "Goals and investments",
  "Insurance cover",
];

/**
 * Human advice: the Fydaa Direct Plan (a written plan from a SEBI-registered adviser) and the
 * free call that starts it. `#book-a-call` is linked from across the site.
 */
export default function AdviceSection() {
  return (
    <section id="book-a-call" aria-labelledby="advice-title" className="section scroll-mt-16">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 id="advice-title" className="max-w-[18ch] text-heading text-ink">
              Talk it through with a SEBI-registered adviser
            </h2>
            <p className="max-w-[56ch] text-lead text-grey-600">
              The Fydaa Direct Plan puts your whole financial life into one written plan, built on direct mutual funds
              with no distributor commission. It costs ₹999 a year.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-4xl bg-mist" data-allow-clip>
            <Image
              src="/home/fydaa-direct-plan.jpg"
              alt="An investor on a video call with a Fydaa adviser, with his plan on screen"
              width={1024}
              height={698}
              sizes="(min-width: 1024px) 600px, 100vw"
              className="h-auto w-full"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink [font-stretch:104%]">The plan covers</h3>
            <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {PLAN_COVERS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-base text-grey-600">
                  <i aria-hidden="true" className="block h-3.5 w-1.5 shrink-0 -rotate-[38deg] rounded-full bg-sprout" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-grey-500">
              Advice by {siteConfig.entities.adviser.legalName}, SEBI RIA {siteConfig.entities.adviser.sebiRegistrationNumber}.
            </p>
          </div>
        </div>

        <div className="rounded-4xl border border-line bg-white p-6 shadow-window sm:p-8 lg:sticky lg:top-28">
          <BookCallForm />
        </div>
      </Container>
    </section>
  );
}
