import Link from "next/link";

const PROGRAMME_HIGHLIGHTS = [
  "NISM Series X-A & X-B certification training, with live doubt-clearing sessions",
  "4 months, from foundation and advisory training to real client exposure",
  "Hands-on mentorship from SEBI-registered investment advisers",
  "Real client meetings and CRM-based advisory practice from Month 4",
  "Performance-based path to a permanent role, starting CTC 4 LPA rupees*",
];

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
      <path
        d="M3.5 8.5L6.5 11.5L12.5 5.5"
        stroke="#0C4A3E"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FyiapProgramBoxes() {
  return (
    <div className="bg-grey-100 font-inter">
      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-jade-tint px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-jade-deep">
              FYIAEP: Young Investment Advisor Entrepreneurship Programme
            </span>
            <h2 className="mt-3.5 text-[clamp(24px,3vw,30px)] font-bold tracking-tight text-ink">
              From learning to live advisory exposure
            </h2>
            <p className="mt-2.5 text-[15px] leading-relaxed text-grey-600">
              A 4-month programme combining financial markets knowledge, NISM certification, practical advisory training and real
              client exposure.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/programme"
                className="inline-flex items-center gap-1.5 rounded-[10px] bg-jade px-6 py-3 text-sm font-bold text-white hover:bg-jade-hover"
              >
                Apply now
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href="/programme"
                className="rounded-[10px] border border-grey-300 px-6 py-3 text-sm font-bold text-ink hover:border-jade hover:text-jade"
              >
                Learn more
              </Link>
            </div>
            <p className="mt-4 text-[12.5px] text-grey-500">35,000 rupees one-time programme fee, plus applicable taxes.</p>
          </div>

          <div className="rounded-2xl border border-grey-200 bg-white p-6 shadow-card">
            <p className="mb-[18px] text-[12px] font-bold uppercase tracking-wide text-grey-500">Programme highlights</p>
            <ul className="flex flex-col gap-3.5">
              {PROGRAMME_HIGHLIGHTS.map((item, i) => (
                <li
                  key={item}
                  className={`flex items-start gap-2.5 text-[15px] font-medium leading-snug text-ink ${
                    i < PROGRAMME_HIGHLIGHTS.length - 1 ? "border-b border-grey-100 pb-3.5" : ""
                  }`}
                >
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
