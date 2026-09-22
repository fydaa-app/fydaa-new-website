import BookCallForm from './BookCallForm';

export default function AdvisorySection() {
  return (
    <section className="advisory" id="book-a-call">
      <div className="container">
        <div className="advisory-grid">
          <div className="advisory-text">
            <div className="label">Tech + Human</div>
            <h2>
              Not just an app.
              <br />
              <span className="serif">Real people</span> behind your money.
            </h2>
            <p>
              Fydaa combines smart technology with real human guidance. Our relationship managers
              understand your goals, answer your questions, and help you make confident decisions
              — because some conversations are better with a person.
            </p>

            <div className="advisory-points">
              <div className="advisory-point">
                <div className="advisory-point-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="9" width="16" height="11" rx="3" />
                    <path d="M12 9V5" />
                    <circle cx="12" cy="3.5" r="1.5" fill="currentColor" stroke="none" />
                    <circle cx="9" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
                    <circle cx="15" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
                    <path d="M2 13h2M20 13h2" />
                  </svg>
                </div>
                <div>
                  <div className="advisory-point-title">Available tools</div>
                  <div className="advisory-point-desc">
                    Goal planning, wealth score, portfolio tracking — available 24/7 in the app and on the web.
                  </div>
                </div>
              </div>

              <div className="advisory-point">
                <div className="advisory-point-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20a8 8 0 0116 0" />
                  </svg>
                </div>
                <div>
                  <div className="advisory-point-title">Dedicated relationship manager</div>
                  <div className="advisory-point-desc">
                    A real person who knows your financial picture and is a call away when you need guidance.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="advisory-form-wrap">
            <div className="advisory-form-card">
              <BookCallForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
