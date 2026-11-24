import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { ProductWindow } from "@/components/ui/product-window";
import { cn } from "@/lib/utils/cn";

/** The three risk profiles, with how much of the ups and downs each accepts (relative, illustrative). */
const PROFILES = [
  { name: "Conservative", body: "Fewer ups and downs", risk: 30 },
  { name: "Balanced", body: "A mix of steady and growth", risk: 55, current: true },
  { name: "Aggressive", body: "Aims for more growth, with bigger swings", risk: 80 },
];

/** Different people, different portfolios: the copy beside a risk-profile window from the app. */
export default function Portfolios() {
  return (
    <section aria-labelledby="portfolios-title" className="section bg-mist">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 id="portfolios-title" className="max-w-[14ch] text-heading text-ink">
              Different people, different portfolios
            </h2>
            <p className="max-w-[46ch] text-pretty text-lead text-grey-600">
              After KYC, a risk assessment shows how comfortable you are with ups and downs. Your portfolio
              follows from it, whether you want a steadier ride, a balance, or more growth.
            </p>
          </div>
          <ButtonLink href="/#book-a-call" size="lg" data-ph-event="Book a Free Call" className="self-start">
            Book a free call
          </ButtonLink>
        </div>

        <ProductWindow title="Risk profile" meta="Example" bodyClassName="p-0 sm:p-0">
          <div
            aria-hidden="true"
            className="flex items-center justify-between gap-4 border-b border-line px-4 py-3 text-xs font-medium text-grey-500 sm:px-6"
          >
            <span>Profile</span>
            <span className="w-24 sm:w-36">Ups and downs</span>
          </div>
          <ul aria-label="Example risk profiles" className="divide-y divide-line">
            {PROFILES.map((profile) => (
              <li
                key={profile.name}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_6rem] items-center gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_9rem] sm:px-6 sm:py-5",
                  profile.current && "bg-jade-tint/50",
                )}
              >
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-base font-semibold text-ink">
                    {profile.name}
                    {profile.current ? (
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-emerald ring-1 ring-line">
                        Your profile
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-0.5 text-sm text-grey-500">{profile.body}</p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true">
                  <div
                    className={cn("h-full rounded-full", profile.current ? "bg-jade" : "bg-sprout")}
                    style={{ width: `${profile.risk}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </ProductWindow>
      </Container>
    </section>
  );
}
