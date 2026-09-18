const POINTS = [
  'Link an existing SIP to a goal like a home, education, or retirement',
  'Set up a new SIP and assign a goal from the start',
  'Track how each SIP is contributing to its goal in real time',
];

export default function PurposeSection() {
  return (
    <section className="purpose-section">
      <div className="container">
        <div className="purpose-inner">
          <div className="purpose-icon-row">
            <div className="purpose-icon-item">
              <span className="purpose-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <text x="12" y="12.5" textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="700" fontFamily="Inter,Arial,sans-serif" fill="currentColor" stroke="none">₹</text>
                </svg>
              </span>
              <span className="purpose-arrow">→</span>
              <span className="purpose-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
                </svg>
              </span>
            </div>
          </div>

          <h2>
            Give your savings a <span className="serif">purpose</span>
          </h2>
          <p className="purpose-sub">
            Every SIP you run should be working toward something real. With Fydaa, you can link
            any existing SIP to a goal — or create a new SIP with a goal already assigned. No more
            nameless investments sitting idle without direction.
          </p>

          <div className="purpose-points">
            {POINTS.map((text) => (
              <div className="purpose-point" key={text}>
                <span className="purpose-check">✓</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <a href="/start-investing" className="btn-invest" style={{ marginTop: 8 }}>
            Start Investing →
          </a>
        </div>
      </div>
    </section>
  );
}
