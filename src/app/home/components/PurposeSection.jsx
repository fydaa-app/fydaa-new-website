const POINTS = [
  'Link existing SIP',
  'Create SIP with a goal',
  'Track progress',
];

function PurposePhone() {
  return (
    <div className="purpose-phone" aria-hidden="true">
      <img
        src="/home/purpose/goal-phone-mock.png"
        alt=""
        className="purpose-phone-img"
      />
      <img
        src="/home/purpose/emergency-fund-card.png"
        alt="Emergency Fund goal linked to SIP"
        className="purpose-fund-overlay"
      />
    </div>
  );
}

export default function PurposeSection() {
  return (
    <section className="purpose-section">
      <div className="container">
        <div className="purpose-grid">
          <div className="purpose-copy">
            <h2>
              Give your savings a <span className="serif">purpose</span>
            </h2>
            <p className="purpose-sub">
              <span className="purpose-sub-line">
                Every SIP should be connected to something meaningful. With Fydaa, you can link an
              </span>
              <span className="purpose-sub-line">
                existing SIP to a financial goal or start a new SIP with the goal assigned from day one.
              </span>
            </p>
          </div>

          <div className="purpose-sip-track" aria-hidden="true">
            <span className="purpose-sip-dot">SIP</span>
            <span className="purpose-sip-line" />
          </div>

          <div className="purpose-points">
            {POINTS.map((text) => (
              <div className="purpose-point" key={text}>
                <span className="purpose-check" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="purpose-visual">
            <PurposePhone />
          </div>
        </div>
      </div>
    </section>
  );
}
