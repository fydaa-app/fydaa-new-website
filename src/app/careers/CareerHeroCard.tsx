type Props = {
  jobCount?: number;
};

export default function CareerHeroCard({ jobCount = 0 }: Props) {
  return (
    <section className="px-6 pb-16 pt-28 font-inter">
      <div className="mx-auto max-w-5xl">
        <span className="inline-block rounded-full bg-jade-tint px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-jade-deep">
          Careers at Fydaa
        </span>
        <h1 className="mt-5 max-w-[16ch] text-[clamp(34px,5.4vw,54px)] font-extrabold leading-[1.06] tracking-[-0.035em] text-ink">
          Build the future of wealth for <span className="text-jade">every Indian</span>
        </h1>
        <p className="mb-9 mt-5 max-w-[52ch] text-[17px] leading-relaxed text-grey-600">
          Join a SEBI-registered fintech making smart investing accessible to millions, regardless of income or background.
        </p>

        <div className="mt-2 flex flex-wrap justify-between gap-8 rounded-2xl bg-jade-tint px-9 py-7">
          <div className="min-w-[140px] flex-1">
            <div className="text-[22px] font-extrabold tracking-tight text-jade">{jobCount}</div>
            <div className="mt-1 text-[13px] font-medium text-grey-500">
              {jobCount === 1 ? "Open role right now" : "Open roles right now"}
            </div>
          </div>
          <div className="min-w-[140px] flex-1">
            <div className="text-[22px] font-extrabold tracking-tight text-jade">SEBI</div>
            <div className="mt-1 text-[13px] font-medium text-grey-500">Registered &amp; regulated</div>
          </div>
          <div className="min-w-[140px] flex-1">
            <div className="text-[22px] font-extrabold tracking-tight text-jade">20yrs</div>
            <div className="mt-1 text-[13px] font-medium text-grey-500">Industry experience</div>
          </div>
        </div>
      </div>
    </section>
  );
}
