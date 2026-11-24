import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { Container } from "./container";

export interface ProofItem {
  title: string;
  body: ReactNode;
}

const { distributor, adviser } = siteConfig.entities;

/** The default facts: who holds your money and how to check it. All verifiable. */
const DEFAULT_ITEMS: ProofItem[] = [
  {
    title: "Straight to the fund house",
    body: "Your SIP is paid to the mutual fund (AMC) in your own name. Fydaa never holds your money.",
  },
  {
    title: "Check it yourself",
    body: (
      <>
        Every holding shows up on{" "}
        <a href="https://www.mfcentral.com/" target="_blank" rel="noopener noreferrer" className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
          MF Central
        </a>
        , the industry&apos;s official portal run by the registrars.
      </>
    ),
  },
  {
    title: "Registered on both sides",
    body: `${distributor.legalName} is an AMFI-registered mutual fund distributor (${distributor.arn}). Advice comes from ${adviser.legalName}, a SEBI-registered investment adviser (${adviser.sebiRegistrationNumber}).`,
  },
  {
    title: "No lock-in",
    body: "Pause, change or stop a SIP whenever you like. Tax-saving ELSS funds are the one exception, with a 3-year lock-in.",
  },
];

/**
 * The one jade band per page: where your money goes and how to verify it. Carries the logo's
 * two round-capped strokes as its only decoration.
 */
export function ProofBand({
  title = "Your money stays yours",
  items = DEFAULT_ITEMS,
  id,
}: {
  title?: ReactNode;
  items?: ProofItem[];
  id?: string;
}) {
  return (
    <section id={id} aria-labelledby="proof-title" className="section">
      <Container>
        <div className="relative isolate overflow-hidden rounded-section bg-jade px-6 py-12 text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20" data-allow-clip>
          <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-24 -z-10 hidden gap-10 sm:flex">
            <i className="block h-[26rem] w-24 -rotate-[38deg] rounded-full bg-white/[0.06]" />
            <i className="block h-[26rem] w-24 translate-y-16 -rotate-[38deg] rounded-full bg-white/[0.04]" />
          </span>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-16">
            <h2 id="proof-title" className="max-w-[14ch] text-heading text-white">
              {title}
            </h2>
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {items.map((item) => (
                <div key={item.title} className="border-t border-white/20 pt-5">
                  <dt className="text-title text-white">{item.title}</dt>
                  <dd className="mt-2 text-base leading-relaxed text-white/75">{item.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
