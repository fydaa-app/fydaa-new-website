import type { CSSProperties } from "react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import {
  AUDIENCES,
  CURRICULUM,
  FYIAEP_BROCHURE_PDF,
  HIGHLIGHTS,
  JOURNEY,
  PROGRAMME_CONTACTS,
  PROGRAMME_OPTIONS,
} from "../data";
import { Stroke } from "./stroke";

const step = (i: number) => ({ "--i": i }) as CSSProperties;
const MONTHS = [1, 2, 3, 4] as const;
const { adviser, distributor } = siteConfig.entities;

type ApplyProps = { onApply: () => void };

/** The page title, set large, with the one entrance on the page. */
function Hero({ onApply }: ApplyProps) {
  return (
    <section
      aria-labelledby="programme-title"
      className="pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36"
      data-enter
    >
      <Container className="flex flex-col gap-6">
        <h1
          id="programme-title"
          className="max-w-[16ch] text-display text-ink"
          data-enter-item
          style={step(0)}
        >
          Become an <span className="whitespace-nowrap">industry-ready</span> investment adviser in 4 months
        </h1>
        <p className="max-w-[56ch] text-lead text-grey-600" data-enter-item style={step(1)}>
          Prepare for the NISM X-A and X-B exams, train on the field in Mumbai and work with real clients
          under a mentor. The programme is run by Fydaa, a SEBI-registered investment adviser.
        </p>
        <div className="flex flex-wrap gap-3" data-enter-item style={step(2)}>
          <button
            type="button"
            onClick={onApply}
            data-ph-event="Apply Now"
            className="btn btn-primary btn-lg"
          >
            Apply now
          </button>
          <a
            href={FYIAEP_BROCHURE_PDF}
            target="_blank"
            rel="noopener noreferrer"
            data-ph-event="Learn more"
            className="btn btn-secondary btn-lg"
          >
            Read the brochure
            <span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
        </div>
        <p className="text-sm text-grey-500" data-enter-item style={step(3)}>
          Already NISM X-A and X-B certified?{" "}
          <a href="#programmes" className="link">
            See the 2-month on-field programme
          </a>
          .
        </p>
      </Container>
    </section>
  );
}

function Audience() {
  return (
    <section aria-labelledby="audience-title" className="section pt-0">
      <Container>
        <div className="grid gap-8 border-t border-line pt-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:pt-16">
          <h2 id="audience-title" className="max-w-[14ch] text-heading text-ink">
            Who the programme is for
          </h2>
          <ul className="flex flex-col gap-4 lg:pt-2">
            {AUDIENCES.map((a) => (
              <li key={a} className="flex items-start gap-3 text-lead text-ink">
                <Stroke />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/**
 * The page's one moment: the three phases drawn to scale on a 4-month line, with round-capped
 * bars (the logo's stroke) and a marigold flag where the programme ends.
 */
function Journey() {
  return (
    <section id="journey" aria-labelledby="journey-title" className="section scroll-mt-16">
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-3xl flex-col gap-4">
          <h2 id="journey-title" className="max-w-[16ch] text-heading text-ink">
            What you&apos;ll do each month
          </h2>
          <p className="max-w-[52ch] text-lead text-grey-600">
            Each phase builds on the last, from theory to certification to real-world practice.
          </p>
        </div>
        <ol className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-0">
          {JOURNEY.map((phase, i) => {
            const isLast = i === JOURNEY.length - 1;
            const wide = phase.months > 1;
            return (
              <li key={phase.title} className="flex min-w-0 flex-col lg:pr-8">
                {/* Phones and tablets: where the phase sits in the four months. */}
                <span aria-hidden="true" className="grid grid-cols-4 gap-1 lg:hidden">
                  {MONTHS.map((m) => (
                    <i
                      key={m}
                      className={cn(
                        "block h-2 rounded-full",
                        m >= phase.start && m < phase.start + phase.months ? "bg-sprout" : "bg-mist",
                      )}
                    />
                  ))}
                </span>
                {/* Desktop: the columns are to scale, so one bar spans the phase. */}
                <span aria-hidden="true" className="relative hidden h-2 rounded-full bg-sprout lg:block">
                  {isLast ? (
                    <i className="absolute -right-1 -top-3 block h-7 w-2 -rotate-[38deg] rounded-full bg-marigold" />
                  ) : null}
                </span>
                <p className="mt-6 text-sm font-semibold text-emerald">{phase.period}</p>
                <h3 className="mt-1 text-title text-ink">{phase.title}</h3>
                <ul className={cn("mt-4 grid gap-3", wide && "lg:grid-cols-2 lg:gap-x-8")}>
                  {phase.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-base leading-relaxed text-grey-600">
                      <Stroke className="h-3 w-1" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}

function Curriculum({ onApply }: ApplyProps) {
  return (
    <section id="curriculum" aria-labelledby="curriculum-title" className="section bg-mist">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="flex flex-col items-start gap-4">
          <h2 id="curriculum-title" className="max-w-[14ch] text-heading text-ink">
            What the curriculum covers
          </h2>
          <p className="max-w-[44ch] text-lead text-grey-600">
            An industry-integrated curriculum designed by SEBI-registered advisers, taught through live
            sessions and recorded modules.
          </p>
          <button
            type="button"
            onClick={onApply}
            data-ph-event="Start your application"
            className="btn btn-primary btn-lg mt-4"
          >
            Start your application
          </button>
        </div>
        <ul className="grid content-start gap-x-8 sm:grid-cols-2">
          {CURRICULUM.map((c) => (
            <li
              key={c}
              className="flex items-start gap-3 border-t border-grey-300/70 py-4 text-base font-medium text-ink"
            >
              <Stroke />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Highlights() {
  return (
    <section aria-labelledby="highlights-title" className="section">
      <Container className="flex flex-col gap-12">
        <h2 id="highlights-title" className="max-w-[18ch] text-heading text-ink">
          What the programme includes
        </h2>
        <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="border-t border-line pt-5">
              <dt className="text-title text-ink">{h.title}</dt>
              <dd className="mt-2 max-w-[40ch] text-base leading-relaxed text-grey-600">{h.body}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

function AboutFydaa() {
  return (
    <section aria-labelledby="about-title" className="section bg-mist">
      <Container className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
        <div className="flex flex-col gap-6">
          <h2 id="about-title" className="max-w-[16ch] text-heading text-ink">
            Learn from a SEBI-registered investment adviser
          </h2>
          <p className="max-w-[52ch] text-lead text-grey-600">
            Fydaa makes financial planning accessible through technology and expert guidance.
          </p>
          <dl className="grid gap-x-8 sm:grid-cols-2">
            <div className="border-t border-grey-300/70 py-4">
              <dt className="text-sm text-grey-600">SEBI-registered investment adviser</dt>
              <dd className="mt-1">
                <span className="block text-title text-ink">{adviser.sebiRegistrationNumber}</span>
                <span className="mt-1 block text-sm text-grey-500">{adviser.legalName}</span>
              </dd>
            </div>
            <div className="border-t border-grey-300/70 py-4">
              <dt className="text-sm text-grey-600">AMFI-registered mutual fund distributor</dt>
              <dd className="mt-1">
                <span className="block text-title text-ink">{distributor.arn}</span>
                <span className="mt-1 block text-sm text-grey-500">{distributor.legalName}</span>
              </dd>
            </div>
          </dl>
        </div>
        <figure className="w-full max-w-xs">
          <Image
            src="/programme/course1.jpg"
            alt="Prof. Sheetal Kunder"
            width={2197}
            height={2185}
            sizes="(min-width: 1024px) 320px, 80vw"
            className="aspect-square h-auto w-full rounded-4xl object-cover"
          />
          <figcaption className="mt-4">
            <span className="block text-title text-ink">Prof. Sheetal Kunder</span>
            <span className="mt-1 block text-sm text-grey-600">
              19 years in finance. Has mentored 11,000+ students.
            </span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}

/** The two programmes, their fees and the way in. `#programmes` is linked from the hero. */
function Programmes({ onApply }: ApplyProps) {
  return (
    <section id="programmes" aria-labelledby="programmes-title" className="section scroll-mt-16">
      <Container className="flex flex-col gap-12">
        <div className="flex max-w-3xl flex-col gap-4">
          <h2 id="programmes-title" className="max-w-[18ch] text-heading text-ink">
            Two programmes, one application
          </h2>
          <p className="max-w-[56ch] text-lead text-grey-600">
            Submit your application and choose your programme in its last step. Our admissions team will
            review it and get back to you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {PROGRAMME_OPTIONS.map((o) => (
            <article
              key={o.id}
              aria-labelledby={`programme-${o.id}`}
              className="flex flex-col rounded-card border border-line p-6 sm:p-8"
            >
              <p className="text-sm font-semibold text-emerald">{o.pageBadge}</p>
              <h3 id={`programme-${o.id}`} className="mt-2 text-title text-ink">
                {o.pageTitle}
              </h3>
              <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-grey-600">{o.pageDescription}</p>
              <div className="mt-auto pt-8">
                <div className="border-t border-line pt-6">
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <span className="figure text-figure text-ink">{o.feeLabel}</span>
                    <span className="text-base text-grey-500">+ taxes</span>
                  </p>
                  <p className="mt-2 text-sm text-grey-500">One-time programme fee</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onApply}
                    data-ph-event="Apply Now"
                    className="btn btn-primary btn-md"
                  >
                    Apply now
                  </button>
                  <a
                    href={o.detailsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-ph-event="Details"
                    className="btn btn-secondary btn-md"
                  >
                    Read the brochure
                    <span className="sr-only"> for the {o.pageTitle} (PDF, opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-line pt-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-title text-ink">Questions before you apply?</h3>
            <p className="mt-1 text-base text-grey-600">Call a counsellor, or our support team.</p>
          </div>
          <dl className="flex flex-wrap gap-x-10 gap-y-1">
            {PROGRAMME_CONTACTS.map((c) => (
              <div key={c.href} className="flex items-baseline gap-3">
                <dt className="text-sm text-grey-500">{c.label}</dt>
                <dd>
                  <a href={c.href} className="link inline-flex min-h-11 items-center text-lg tabular-nums">
                    {c.display}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

/** The programme page before anyone applies. */
export function ProgrammeLanding({ onApply }: ApplyProps) {
  return (
    <>
      <Hero onApply={onApply} />
      <Audience />
      <Journey />
      <Curriculum onApply={onApply} />
      <Highlights />
      <AboutFydaa />
      <Programmes onApply={onApply} />
    </>
  );
}
