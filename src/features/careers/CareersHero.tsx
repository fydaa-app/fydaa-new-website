import type { CSSProperties } from "react";
import { Container } from "@/components/layout/container";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

type Props = {
  /** Null when the list could not be loaded: never show a misleading "0". */
  jobCount: number | null;
  onRegisterCv: () => void;
};

/** Careers hero: what the work is for, the two ways in, and how many roles are open today. */
export default function CareersHero({ jobCount, onRegisterCv }: Props) {
  return (
    <section aria-labelledby="careers-title" className="pb-8 pt-28 sm:pt-32 lg:pt-36" data-enter>
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,13rem)] lg:items-end lg:gap-16">
        <div className="flex flex-col gap-6">
          <h1 id="careers-title" className="max-w-[16ch] text-display text-ink" data-enter-item style={step(0)}>
            Help people across India invest for their goals
          </h1>
          <p className="max-w-[56ch] text-lead text-grey-600" data-enter-item style={step(1)}>
            Fydaa matches a mutual fund SIP to each thing people are saving for, like a home or a child&apos;s
            education, and backs it with advice from a SEBI-registered adviser. Find a role below, or register your CV
            and we&apos;ll get in touch when one fits.
          </p>
          <div className="flex flex-wrap gap-3" data-enter-item style={step(2)}>
            <a href="#open-roles" data-ph-event="See open roles" className="btn btn-primary btn-lg">
              See open roles
            </a>
            <button type="button" onClick={onRegisterCv} data-ph-event="Register your CV" className="btn btn-secondary btn-lg">
              Register your CV
            </button>
          </div>
        </div>
        <p
          className="flex flex-col gap-2 border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pb-2 lg:pl-8 lg:pt-0"
          data-enter-item
          style={step(3)}
        >
          <span className="figure text-figure text-ink">{jobCount ?? "—"}</span>
          <span className="text-sm text-grey-500">{jobCount === 1 ? "Open role right now" : "Open roles right now"}</span>
        </p>
      </Container>
    </section>
  );
}
