import { TESTIMONIALS } from '../data/content';

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: 48 }}>People who invest with Fydaa</h2>
        <div className="testi-grid">
          {TESTIMONIALS.map((t) => (
            <div className="testi-card" key={t.name}>
              <div className="testi-stars">★★★★★</div>
              <div className="testi-text">{t.text}</div>
              <div className="testi-author">
                <div className="testi-avatar">{t.initials}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
