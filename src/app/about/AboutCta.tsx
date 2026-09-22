export default function AboutCta() {
  return (
    <section className="py-20 text-center text-white font-inter bg-jade">
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="mb-2.5 text-[1.3rem] font-medium text-white/85">Bharosa Humara, Fydaa Aapka</div>
        <h2 className="mb-3 text-[clamp(1.5rem,3vw,2.05rem)] font-bold tracking-[-0.02em] text-white">
          Your financial journey starts here
        </h2>
        <p className="max-w-[560px] mx-auto mb-8 text-white/70">
          Let&apos;s embark on this journey together, towards a tomorrow filled with financial freedom and growth.
          Welcome to Fydaa, where your money is managed for tomorrow, today.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://www.cal.eu/fydaa/30min?overlayCalendar=true"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-jade px-8 py-3.5 rounded-[10px] font-bold text-[0.95rem] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all"
          >
            Talk to Us
          </a>
          <a
            href="https://apps.apple.com/in/app/fydaa-your-money-for-tomorrow/id1622175190"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 border border-white/[.18] text-white px-7 py-3.5 rounded-[10px] font-bold text-[0.95rem] hover:bg-white/[.18] transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download App
          </a>
        </div>
      </div>
    </section>
  );
}
