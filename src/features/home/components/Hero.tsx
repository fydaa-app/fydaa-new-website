import type { CSSProperties } from "react";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import GoalPlanner from "./GoalPlanner";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/** Home hero: the promise on the left, the live goal planner on the right (below on phones). */
export default function Hero() {
  return (
    <section aria-labelledby="home-title" className="pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-28" data-enter>
      <Container className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:pt-10">
          <h1 id="home-title" className="max-w-[11ch] text-display text-ink" data-enter-item style={step(0)}>
            Give every rupee a goal
          </h1>
          <p className="max-w-[46ch] text-lead text-grey-600" data-enter-item style={step(1)}>
            Fydaa matches a mutual fund SIP to each thing you&apos;re saving for, like a home, your child&apos;s
            education or retirement, and shows how close you are. SIPs start at ₹1,000 a month.
          </p>
          <div className="flex flex-wrap gap-3" data-enter-item style={step(2)}>
            <ButtonLink href={routes.signup.path} size="lg" data-ph-event="Start Investing">
              Start investing
            </ButtonLink>
            <ButtonLink href={routes.login.path} size="lg" variant="secondary" data-ph-event="Login">
              Log in
            </ButtonLink>
          </div>
          <p className="text-sm text-grey-500" data-enter-item style={step(3)}>
            AMFI-registered mutual fund distributor,{" "}
            <span className="whitespace-nowrap">{siteConfig.entities.distributor.arn}</span>.
          </p>
        </div>
        <div data-enter-item style={step(2)}>
          <GoalPlanner />
        </div>
      </Container>
    </section>
  );
}
