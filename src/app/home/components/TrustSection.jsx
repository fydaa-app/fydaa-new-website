import { TRUST_CARDS } from '../data/content';

// One icon per card, in the same order as TRUST_CARDS.
const ICONS = [
  // SEBI Regulated — shield
  <svg key="shield" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>,
  // Direct to AMC — shield with check
  <svg key="shield-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7v6.5c0 5.25 4.27 10.14 10 11.5 5.73-1.36 10-6.25 10-11.5V7L12 2z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>,
  // Bank-Grade Security — padlock
  <svg key="lock" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>,
  // Withdraw Anytime — clock
  <svg key="clock" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>,
];

export default function TrustSection() {
  return (
    <section className="trust-section">
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: 12 }}>Your money is always safe</h2>
        <p style={{ textAlign: 'center', color: 'var(--ink2)', marginBottom: 48, maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
          Every investment flows directly to the AMC. Fydaa never touches your money.
        </p>
        <div className="trust-grid">
          {TRUST_CARDS.map((card, i) => (
            <div className="trust-card" key={card.title}>
              <div className="trust-card-icon">{ICONS[i]}</div>
              <h3>{card.title}</h3>
              <p>
                {card.mobileDesc ? (
                  <>
                    <span className="copy-desktop">{card.desc}</span>
                    <span className="copy-mobile">{card.mobileDesc}</span>
                  </>
                ) : (
                  card.desc
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
