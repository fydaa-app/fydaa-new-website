import Link from "next/link";

export default function AboutCta() {
  return (
    <section className="py-12 sm:py-16 md:py-20 text-center text-white font-inter bg-jade">
      <div className="max-w-[1120px] 2xl:max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="mb-2.5 text-base sm:text-xl font-medium text-white/85">Bharosa Humara, Fydaa Aapka</div>
        <h2 className="text-heading mb-3 font-bold text-white">
          Your financial journey starts here
        </h2>
        <p className="max-w-[560px] mx-auto mb-8 text-sm sm:text-base text-white/70">
          Let&apos;s embark on this journey together, towards a tomorrow filled with financial freedom and growth.
          Welcome to Fydaa, where your money is managed for tomorrow, today.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3">
          <Link
            href="/#book-a-call"
            className="btn btn-inverse btn-lg"
            data-ph-event="Book a Free Call"
          >
            Book a free call
          </Link>
          <Link
            href="/download"
            prefetch={false}
            data-ph-event="Download App"
            className="btn btn-outline-inverse btn-lg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download app
          </Link>
        </div>
      </div>
    </section>
  );
}
