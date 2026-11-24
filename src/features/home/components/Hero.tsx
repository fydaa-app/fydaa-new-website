import type { CSSProperties } from "react";
import { Container } from "@/components/layout/container";
import GoalPlanner from "./GoalPlanner";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * Home hero: the page title is the question the planner answers. Pick a goal, see the SIP, and the
 * plan appears in the app on the phone beside it.
 */
export default function Hero() {
  return (
    <section aria-labelledby="home-title" className="pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24" data-enter>
      <Container>
        <GoalPlanner
          intro={
            <>
              <h1
                id="home-title"
                className="max-w-[12ch] text-display text-ink"
                data-enter-item
                style={step(0)}
              >
                What are you saving for?
              </h1>
              <p className="max-w-[48ch] text-lead text-grey-600" data-enter-item style={step(1)}>
                Pick a goal and see the monthly SIP that gets you there. Start it in the Fydaa app, with your
                own relationship manager to keep you on track.
              </p>
            </>
          }
        />
      </Container>
    </section>
  );
}
