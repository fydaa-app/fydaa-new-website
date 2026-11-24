import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/routes";

/** The FYIAEP brochure, also linked from the programme page. */
const BROCHURE_PDF = "/brochure/fyiaep.pdf";

/** The programme in order (a real sequence, so the periods lead each row). Facts match /programme. */
const STAGES = [
  {
    period: "Months 1–2",
    title: "NISM certification",
    body: "Training for the NISM Series X-A and X-B exams, with live doubt-clearing sessions.",
  },
  {
    period: "Month 3",
    title: "Advisory training",
    body: "On-field training in client meetings, onboarding, the CRM and the advisory process.",
  },
  {
    period: "Month 4",
    title: "Live client work",
    body: "Meet real clients, build their financial plans and record the work in the CRM.",
  },
];

/** FYIAEP: the way in for people new to advisory, from certification to a performance-based role. */
export default function ProgrammeSection() {
  return (
    <section aria-labelledby="programme-title" className="section bg-mist">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-emerald">
              FYIAEP, the Young Investment Advisor Entrepreneurship Programme
            </p>
            <h2 id="programme-title" className="max-w-[16ch] text-heading text-ink">
              Start a career in investment advice
            </h2>
            <p className="max-w-[52ch] text-lead text-grey-600">
              Four months that take you from NISM certification to meetings with real clients, with hands-on
              mentorship from SEBI-registered investment advisers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={routes.programme.path} size="lg" data-ph-event="Apply now">
              Apply for FYIAEP
            </ButtonLink>
            <a
              href={BROCHURE_PDF}
              target="_blank"
              rel="noopener noreferrer"
              data-ph-event="Learn more"
              className="btn btn-secondary btn-lg"
            >
              Read the brochure
            </a>
          </div>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="figure text-3xl font-semibold text-ink">₹35,000</span>
            <span className="text-sm text-grey-500">one-time programme fee, plus applicable taxes</span>
          </p>
        </div>

        <ol aria-label="How the programme runs" className="flex flex-col lg:pt-2">
          {STAGES.map((stage) => (
            <li
              key={stage.period}
              className="grid gap-x-6 gap-y-1 border-t border-line py-5 sm:grid-cols-[7rem_minmax(0,1fr)]"
            >
              <p className="figure text-sm font-semibold text-jade sm:pt-1">{stage.period}</p>
              <div>
                <h3 className="text-title text-ink">{stage.title}</h3>
                <p className="mt-1 text-base leading-relaxed text-grey-600">{stage.body}</p>
              </div>
            </li>
          ))}
          <li className="grid gap-x-6 gap-y-1 border-y border-line py-5 sm:grid-cols-[7rem_minmax(0,1fr)]">
            <p className="flex items-center gap-2 self-start text-sm font-semibold text-jade sm:pt-1">
              <i
                aria-hidden="true"
                className="ml-0.5 block h-3.5 w-1.5 -rotate-[38deg] rounded-full bg-marigold"
              />
              Then
            </p>
            <div>
              <h3 className="text-title text-ink">A permanent role</h3>
              <p className="mt-1 text-base leading-relaxed text-grey-600">
                A performance-based path to a permanent role at Fydaa, with a starting CTC of ₹4 lakh a year.
              </p>
            </div>
          </li>
        </ol>
      </Container>
    </section>
  );
}
