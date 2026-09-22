export default function FinalCta() {
  return (
    <section className="final-cta">
      <div className="container">
        <h2>
          Start your wealth-building <span className="serif">journey</span> today
        </h2>
        <p>Pick a goal, set a SIP, and let your money start working — from the web or the app.</p>
        <div className="final-cta-buttons">
          <a
            href="https://www.cal.eu/fydaa/30min?overlayCalendar=true"
            className="btn-invest"
            target="_blank"
            rel="noopener noreferrer"
          >
            Start Investing
          </a>
          <a
            href="https://apps.apple.com/in/app/fydaa-your-money-for-tomorrow/id1622175190"
            className="btn-download"
            target="_blank"
            rel="noopener noreferrer"
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
