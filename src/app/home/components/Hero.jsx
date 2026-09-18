import HeroCalculator from './HeroCalculator';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <h1>
              Your financial life,
              <br />
              <span className="serif">all in one place.</span>
            </h1>
            <p className="hero-sub">
              Invest across asset classes, plan around your goals and keep track of your wealth,
              with everything you need to build, manage and grow your money over time.
            </p>
            <div className="hero-ctas">
              <a href="/start-investing" className="btn-invest">Start Investing</a>
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
            <div className="hero-trust">
              <span className="hero-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                SEBI Regulated
              </span>
              <span className="hero-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Direct Plans
              </span>
              <span className="hero-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Withdraw Anytime
              </span>
            </div>
          </div>

          <HeroCalculator />
        </div>
      </div>
    </section>
  );
}
