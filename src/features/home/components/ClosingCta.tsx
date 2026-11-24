import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/routes";

/** The last word before the footer: one goal, two ways in. */
export default function ClosingCta() {
  return (
    <section aria-labelledby="closing-title" className="section">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4">
          <h2 id="closing-title" className="max-w-[14ch] text-heading text-ink">
            Start with one goal
          </h2>
          <p className="max-w-[46ch] text-lead text-grey-600">
            Set it up on the web in a few minutes, or in the app. You can change or stop the SIP whenever you like.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={routes.signup.path} size="lg" data-ph-event="Start Investing">
            Start investing
          </ButtonLink>
          <ButtonLink href={routes.download.path} prefetch={false} size="lg" variant="secondary" data-ph-event="Download App">
            Download the app
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
