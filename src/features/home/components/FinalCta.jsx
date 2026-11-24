import Link from "next/link";

export default function FinalCta() {
  return (
    <section className="final-cta" id="final">
      <div className="final-cta-card">
        <h2>
          <span className="final-cta-line">Start your wealth building</span>
          <span className="final-cta-line">
            journey <span className="final-cta-accent">today</span>
          </span>
        </h2>
        <p>
          Pick a goal, set an SIP and let your money start working, from the web
          or the app.
        </p>
        <div className="final-cta-buttons">
          <a
            href="#book-a-call"
            className="final-cta-btn"
            data-ph-event="Book a Free Call"
          >
            Book a free call
          </a>
          <Link
            href="/download"
            prefetch={false}
            className="final-cta-btn"
            data-ph-event="Download App"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
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
