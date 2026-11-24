import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { routes } from "@/config/routes";

/** The last word before the footer: the tagline, a free call, or the app. */
export default function AboutCta() {
  return (
    <section aria-labelledby="about-cta-title" className="section">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold text-emerald" lang="hi-Latn">
            Bharosa humara, Fydaa aapka
          </p>
          <h2 id="about-cta-title" className="max-w-[16ch] text-heading text-ink">
            Start with a free call
          </h2>
          <p className="max-w-[46ch] text-lead text-grey-600">
            Leave your number and a relationship manager will call you back. Or get the app and set up your first
            goal yourself.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/#book-a-call" size="lg" data-ph-event="Book a Free Call">
            Book a free call
          </ButtonLink>
          <ButtonLink
            href={routes.download.path}
            prefetch={false}
            size="lg"
            variant="secondary"
            data-ph-event="Download App"
          >
            Download the app
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
