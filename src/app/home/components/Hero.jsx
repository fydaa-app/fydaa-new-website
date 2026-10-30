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
              <div className="hero-cta">
                <span className="hero-cta-label">New users</span>
                <a href="/signup" className="btn-invest">
                  Start Investing
                </a>
              </div>
              <div className="hero-cta">
                <span className="hero-cta-label">Existing user</span>
                <a href="/login" className="btn-download">
                  Login
                </a>
              </div>
            </div>
            <div className="hero-trust">
              <span className="hero-trust-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                AMFI regulated
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
