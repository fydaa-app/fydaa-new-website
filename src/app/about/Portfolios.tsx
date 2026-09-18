const PORTFOLIOS = [
  { label: "Conservative", dash: "30,70" },
  { label: "Balanced", dash: "55,45" },
  { label: "Aggressive", dash: "80,20" },
];

export default function Portfolios() {
  return (
    <section className="py-20 bg-grey-50 font-inter">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div>
            <h2 className="mb-3.5 text-[clamp(1.5rem,3vw,2.05rem)] font-bold tracking-[-0.02em] text-ink">
              Different People, Different Portfolios
            </h2>
            <p className="max-w-[440px] mb-6 text-grey-600 leading-[1.75]">
              Fydaa is an investment app that adapts to your appetite for investing, whether you play it safe, stay
              balanced, or chase growth.
            </p>
            <a
              href="/start-investing"
              className="inline-flex bg-jade text-white px-7 py-[13px] rounded-[10px] font-bold text-sm hover:bg-jade-hover transition-colors"
            >
              Start Investing Now
            </a>
          </div>

          <div className="flex justify-center gap-6 mt-2 md:mt-0">
            {PORTFOLIOS.map((p) => (
              <div key={p.label} className="flex flex-col items-center gap-2.5">
                <svg viewBox="0 0 36 36" className="w-[76px] h-[76px] -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#A7F3D0" strokeWidth="3.5" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#0C4A3E"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={p.dash}
                    strokeDashoffset="25"
                  />
                </svg>
                <div className="text-xs font-medium text-grey-500">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
