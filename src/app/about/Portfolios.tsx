const PORTFOLIOS = [
  { label: "Conservative", dash: "30,70" },
  { label: "Balanced", dash: "55,45" },
  { label: "Aggressive", dash: "80,20" },
];

export default function Portfolios() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-grey-50 font-inter">
      <div className="max-w-[1120px] 2xl:max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 md:gap-14 items-center">
          <div className="text-center md:text-left">
            <h2 className="mb-3.5 text-[clamp(1.5rem,3vw,2.05rem)] font-bold tracking-[-0.02em] text-ink">
              Different People, Different Portfolios
            </h2>
            <p className="max-w-[440px] mx-auto md:mx-0 mb-6 text-grey-600 leading-[1.75] text-sm sm:text-base">
              Fydaa is an investment app that adapts to your appetite for investing, whether you play it safe, stay
              balanced, or chase growth.
            </p>
            <a
              href="/#book-a-call"
              className="inline-flex bg-jade text-white px-7 py-[13px] rounded-[10px] font-bold text-sm hover:bg-jade-hover transition-colors min-h-[44px] items-center"
            >
              Book a Free Call
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-2 md:mt-0">
            {PORTFOLIOS.map((p) => (
              <div key={p.label} className="flex flex-col items-center gap-2.5">
                <svg
                  viewBox="0 0 36 36"
                  className="w-14 h-14 sm:w-[76px] sm:h-[76px] -rotate-90"
                >
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
                <div className="text-[11px] sm:text-xs font-medium text-grey-500">{p.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
