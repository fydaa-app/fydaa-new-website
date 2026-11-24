const FAQS = [
  {
    q: "Is Fydaa registered with any financial regulators in India?",
    a: "Yes. Fydaa is offered by Multistrato Capital Advisors Pvt. Ltd., a SEBI-Registered Investment Adviser (INA000015969), and is also a member of BASL and NISM-certified.",
  },
  {
    q: "How is Fydaa different from a broker or mutual fund distributor?",
    a: "Brokers and distributors typically earn commissions from the products they sell, which can bias recommendations. As a Registered Investment Adviser, Fydaa charges a transparent fee directly to you and does not earn hidden commissions from fund houses.",
  },
  {
    q: "How does Fydaa make money?",
    a: "Fydaa earns through transparent advisory and subscription fees paid directly by clients, such as the Fydaa Direct Plan, rather than through commissions embedded in the products it recommends.",
  },
  {
    q: "What is the fee for Fydaa?",
    a: "Fees vary by plan and are shown upfront before you subscribe, with no hidden costs. Get in touch with our team for a quote tailored to your goals.",
  },
  {
    q: "Can I get a fee refund?",
    a: "Refunds follow Fydaa's published Refund Policy. Check that page for eligibility and timelines.",
  },
  {
    q: "Is there an account minimum to use Fydaa's services?",
    a: "SIPs can start from as little as 1,000 rupees/month or 100 rupees/day, so there is no large account minimum to get started.",
  },
  {
    q: "What if I don't have a broker or demat account?",
    a: "Fydaa can help you set one up as part of onboarding, so you don't need to arrive with one already.",
  },
  {
    q: "How do I add or withdraw investments from my Fydaa account?",
    a: "Deposits and withdrawals are managed directly from within the Fydaa app.",
  },
];

export default function CareersFaq() {
  return (
    <section className="bg-grey-100 px-6 py-16 font-inter">
      <div className="mx-auto max-w-5xl">
        <span className="inline-block rounded-full bg-jade-tint px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-jade-deep">
          FAQs
        </span>
        <h2 className="mt-3.5 text-[clamp(26px,3.4vw,32px)] font-bold tracking-tight text-ink">Common questions</h2>
        <p className="mt-2.5 max-w-[48ch] text-[15px] text-grey-600">
          Feel free to reach out if you have questions after reviewing these.
        </p>

        <div className="mt-11 grid gap-6 md:grid-cols-[0.85fr_1.5fr] md:gap-14">
          <div />
          <div className="flex flex-col gap-2.5">
            {FAQS.map((entry) => (
              <details
                key={entry.q}
                className="group rounded-2xl border border-grey-200 bg-white px-5 py-[18px] shadow-card open:border-jade-200"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left [&::-webkit-details-marker]:hidden">
                  <span className="text-[15.5px] font-semibold text-ink">{entry.q}</span>
                  <span className="relative h-5 w-5 shrink-0">
                    <span className="absolute left-1 top-[9px] h-0.5 w-3 bg-grey-500" />
                    <span className="absolute left-[9px] top-1 h-3 w-0.5 bg-grey-500 transition-transform group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="mt-3 max-w-[60ch] text-[14.5px] leading-relaxed text-grey-600">{entry.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
