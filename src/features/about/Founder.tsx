export default function Founder() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-grey-50 font-inter">
      <div className="max-w-[1120px] 2xl:max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-[1fr_2fr] gap-8 md:gap-14 items-start">
          <div className="w-full max-w-[240px] sm:max-w-[280px] md:max-w-none aspect-[3/4] bg-grey-100 rounded-2xl overflow-hidden mx-auto md:mx-0">
            <img
              src="/about-us/Kuntalsir.png"
              alt="Kuntal Bhansali"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="text-center md:text-left">
            <div className="mb-2 text-[0.72rem] font-bold tracking-[0.08em] uppercase text-grey-500">
              Meet the Founder
            </div>
            <h2 className="mb-2 text-[clamp(1.5rem,3vw,2.05rem)] font-bold tracking-[-0.02em] text-ink">
              Kuntal Bhansali
            </h2>
            <div className="mb-6 text-sm text-grey-500">
              Founder &amp; CEO, Multistrato Capital Advisors Pvt. Ltd.
            </div>
            <p className="max-w-[560px] mx-auto md:mx-0 mb-4 text-grey-600 leading-[1.8] text-sm sm:text-base">
              Kuntal started his journey over 20 years ago as an Equity Research Analyst and went on to become a
              fund manager with Reliance Capital PMS, where he managed money for high-net-worth individuals early
              in his career.
            </p>
            <p className="max-w-[560px] mx-auto md:mx-0 mb-4 text-grey-600 leading-[1.8] text-sm sm:text-base">
              He launched his entrepreneurial journey almost 10 years ago, working in investment banking and fund
              management. That path led him into the world of tech startups, where he saw firsthand how technology
              can empower people at scale.
            </p>
            <p className="max-w-[560px] mx-auto md:mx-0 text-grey-600 leading-[1.8] text-sm sm:text-base">
              Fydaa was born from that combination: deep domain knowledge of managing money, and an understanding
              of how technology can make expert financial planning accessible to everyone, not just the wealthy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
