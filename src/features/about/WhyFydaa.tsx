import { ProofBand, type ProofItem } from "@/components/layout/proof-band";
import { siteConfig } from "@/config/site";
import { SIP_MINIMUMS } from "@/features/home/data/sipCategories";
import { formatInr } from "@/lib/format/money";

const { distributor, adviser } = siteConfig.entities;

/** Reasons to trust Fydaa, each one checkable. */
const ITEMS: ProofItem[] = [
  {
    title: "Registered on both sides",
    body: `Advice comes from ${adviser.legalName}, a SEBI-registered investment adviser (${adviser.sebiRegistrationNumber}). ${distributor.legalName} is an AMFI-registered mutual fund distributor (${distributor.arn}).`,
  },
  {
    title: "Straight to the fund house",
    body: (
      <>
        Your SIP is paid to the mutual fund (AMC) in your own name, and every holding shows up on{" "}
        <a
          href="https://www.mfcentral.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white"
        >
          MF Central
        </a>
        . Fydaa never holds your money.
      </>
    ),
  },
  {
    title: "Start small",
    body: `Start a SIP from ${formatInr(SIP_MINIMUMS.monthly)} a month or ${formatInr(SIP_MINIMUMS.daily)} a day. Made for first-time investors and experienced ones alike.`,
  },
  {
    title: "An app and an adviser",
    body: "Plan and track everything in the app, and talk to a human adviser when you need one.",
  },
];

/** The page's one jade band: why people choose Fydaa. */
export default function WhyFydaa() {
  return <ProofBand title="Why people choose Fydaa" items={ITEMS} />;
}
