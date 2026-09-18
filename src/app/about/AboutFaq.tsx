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
    q: "What is the advisory fee of Fydaa?",
    a: "Fees vary by plan and are shown upfront before you subscribe, with no hidden costs. Get in touch with our team for a quote tailored to your goals.",
  },
];

export default function AboutFaq() {
  return (
    <section className="py-20 bg-white font-inter">
      <div className="max-w-[1120px] mx-auto px-6">
        <h2 className="mb-2 text-[clamp(1.5rem,3vw,2.05rem)] font-bold tracking-[-0.02em] text-ink">FAQs</h2>
        <p className="mb-8 text-grey-600">Feel free to reach out if you have any other questions.</p>
        <div className="max-w-[760px]">
          {FAQS.map((f) => (
            <details key={f.q} className="group border-b border-grey-200 py-[18px]">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-ink text-[0.98rem] [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-jade text-xl font-normal shrink-0 group-open:hidden">+</span>
                <span className="text-jade text-xl font-normal shrink-0 hidden group-open:inline">−</span>
              </summary>
              <p className="mt-3 text-[0.92rem] text-grey-600 leading-[1.7]">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
