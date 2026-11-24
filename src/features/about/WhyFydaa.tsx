const ITEMS = [
  {
    title: "SEBI-registered",
    body: "Regulated by the Securities and Exchange Board of India. Advice you can trust from certified professionals.",
  },
  {
    title: "No hidden commissions",
    body: "We work for you, not for banks or fund houses. Transparent fee structure with no embedded costs.",
  },
  {
    title: "Accessible to everyone",
    body: "Start a SIP from ₹1,000/month, or ₹100/day. Designed for first-time investors and experienced ones alike.",
  },
  {
    title: "Tech + human guidance",
    body: "An app-first experience powered by AI, backed by human advisors when you need them.",
  },
];

export default function WhyFydaa() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-grey-50 font-inter">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-heading mb-8 md:mb-10 font-bold text-ink">
          Why people choose Fydaa
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {ITEMS.map((it) => (
            <div
              key={it.title}
              className="px-6 py-7 border border-grey-200 rounded-2xl bg-white shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
            >
              <h3 className="mb-2 text-base font-bold text-ink">{it.title}</h3>
              <p className="text-sm text-grey-600 leading-[1.5]">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
