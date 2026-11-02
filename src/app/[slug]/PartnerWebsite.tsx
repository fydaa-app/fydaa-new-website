import Link from 'next/link';
import type { PublicPartnerWebsite } from '../config/partnerWebsiteApi';
import FaqSection from '../home/components/FaqSection';
import Footer from '../layout/Footer';
import HashScroll from '../components/HashScroll';
import PartnerNavbar from './PartnerNavbar';
import PartnerFundSearch from './PartnerFundSearch';
import PartnerCalculator from './PartnerCalculator';
import './partner-website.css';
import '../home/styles/home.css';

const BOOK_URL = 'https://www.cal.eu/fydaa/30min?overlayCalendar=true';

type PartnerWebsiteProps = {
  data: PublicPartnerWebsite;
  slug: string;
};

function initials(name: string | null | undefined) {
  const parts = String(name || 'C')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return 'C';
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || '')
    .join('');
}

function starRow(stars: number | null | undefined) {
  const filled = Math.max(0, Math.min(5, Math.round(Number(stars) || 0)));
  return (
    <div className="pw-stars" aria-label={`${filled} out of 5 stars`}>
      {'★★★★★'.split('').map((s, i) => (
        <span key={i} className={i < filled ? undefined : 'empty'}>
          {s}
        </span>
      ))}
    </div>
  );
}

function aboutParagraphs(about: string | null, name: string | null) {
  const text = String(about || '').trim();
  if (text) {
    const chunks = text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (chunks.length > 1) return chunks;
    // Split long single blocks into readable paragraphs when possible.
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    if (sentences.length >= 3) {
      const mid = Math.ceil(sentences.length / 3);
      return [
        sentences.slice(0, mid).join(' ').trim(),
        sentences.slice(mid, mid * 2).join(' ').trim(),
        sentences.slice(mid * 2).join(' ').trim(),
      ].filter(Boolean);
    }
    return [text];
  }
  const display = name || 'your Fydaa partner';
  return [
    `${display} is a personal finance professional who helps individuals and families understand where they stand today and what it will take to get where they want to go.`,
    'The approach starts with listening — understanding what matters most to you — because good financial planning is never one-size-fits-all.',
    'The philosophy is simple: put the client first.',
  ];
}

export default function PartnerWebsite({ data, slug }: PartnerWebsiteProps) {
  const name = data.name?.trim() || 'Your Fydaa partner';
  const photo = data.photoUrl || '/images/hero.jpg';
  const phone = data.mobileNumber ? String(data.mobileNumber).replace(/\D/g, '') : '';
  const telHref = phone ? `tel:+91${phone.slice(-10)}` : undefined;
  const signupHref = `/signup?ref=${encodeURIComponent(slug)}`;
  const loginHref = `/login?ref=${encodeURIComponent(slug)}`;
  const paragraphs = aboutParagraphs(data.about, data.name);
  const reviews = Array.isArray(data.reviews) ? data.reviews : [];
  const certifications = Array.isArray(data.certifications) ? data.certifications : [];

  return (
    <div className="partner-site fydaa-home">
      <HashScroll />
      <PartnerNavbar slug={slug} />

      {/* 1. Hero */}
      <section className="pw-hero" id="overview">
        <div className="pw-container pw-hero-grid">
          <figure className="pw-hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={name} />
          </figure>
          <div className="pw-hero-copy">
            <h1>
              <span className="pw-hero-line">Your financial future deserves</span>
              <br />
              a <span className="pw-accent">personal</span> approach.
            </h1>
            <p className="pw-lead">
              <span className="pw-lead-line">
                Meet {name}, your Fydaa partner advisor in Mumbai, helping individuals and
              </span>
              <br />
              <span className="pw-lead-line">
                families make informed financial decisions through personalised financial planning.
              </span>
            </p>
            <p className="pw-support">
              <span className="pw-support-line">Personal guidance for your financial</span>
              <br />
              <span className="pw-support-line">goals, backed by the Fydaa ecosystem.</span>
            </p>
            <a
              href={BOOK_URL}
              className="pw-btn pw-btn-primary pw-hero-cta"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a Consultation
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Invest + calculator */}
      <section className="pw-invest" id="calculator">
        <div className="pw-container pw-invest-grid">
          <div>
            <h2 className="pw-invest-title">
              <span className="pw-invest-title-line">Your financial life,</span>
              <br />
              <span className="pw-accent">all in one place.</span>
            </h2>
            <p className="pw-invest-copy">
              Invest across asset classes, plan around your goals and keep track of your wealth,
              with everything you need to build, manage and grow your money over time.
            </p>
            <div className="pw-invest-actions">
              <Link href={signupHref} className="pw-btn pw-btn-primary pw-invest-cta">
                Start Investing
                <span className="pw-invest-cta-chevron" aria-hidden="true">
                  ›
                </span>
              </Link>
              <Link href={loginHref} className="pw-btn pw-btn-secondary pw-invest-login">
                Log In
              </Link>
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
          <PartnerCalculator signupHref={signupHref} />
        </div>
      </section>

      {/* 3. Fund search + AMC logos */}
      <PartnerFundSearch />

      {/* 4. About */}
      <section className="pw-about" id="about">
        <div className="pw-container">
          <span className="pw-about-badge">ABOUT</span>
          <div className="pw-quote-mark" aria-hidden="true">
            “
          </div>
          <div className="pw-about-body">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 48)}>{p}</p>
            ))}
            {certifications[0] ? (
              <div className="pw-about-pill">{certifications[0]}</div>
            ) : (
              <div className="pw-about-pill">Personal guidance, backed by Fydaa</div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Reviews */}
      <section className="pw-reviews" id="reviews">
        <div className="pw-container">
          <div className="pw-reviews-label">TESTIMONIALS</div>
          <h2>Client Success Stories.</h2>
          {reviews.length > 0 ? (
            <div className="pw-reviews-grid">
              {reviews.slice(0, 8).map((review) => (
                <article className="pw-review-card" key={review.id}>
                  {starRow(review.stars ?? 5)}
                  <p className="pw-review-text">
                    {review.customerTestimonial || 'A great experience with personalised financial guidance.'}
                  </p>
                  <div className="pw-review-footer">
                    <div className="pw-review-author">
                      <div className="pw-review-name">{review.customerName || 'Client'}</div>
                      {review.customerProfession ? (
                        <div className="pw-review-role">{review.customerProfession}</div>
                      ) : null}
                    </div>
                  </div>
                  <span className="pw-avatar" aria-hidden="true">
                    {initials(review.customerName)}
                  </span>
                </article>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#525252' }}>
              Client stories from {name} will appear here soon.
            </p>
          )}
        </div>
      </section>

      {/* 6. Getting started */}
      <section className="pw-start">
        <div className="pw-container pw-start-grid">
          <div className="pw-start-copy">
            <h2>
              Getting started is
              <br />
              <span className="pw-accent">simpler</span> than you think.
            </h2>
            <ol className="pw-steps">
              <li>
                <span className="pw-step-num">01</span>
                <span className="pw-step-text">Start with a conversation</span>
              </li>
              <li>
                <span className="pw-step-num">02</span>
                <span className="pw-step-text">Understand your financial picture</span>
              </li>
              <li>
                <span className="pw-step-num">03</span>
                <span className="pw-step-text">Explore your next steps</span>
              </li>
            </ol>
          </div>
          <div className="pw-start-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/partner/getting-started.png"
              alt="Video call with your Fydaa relationship manager"
            />
          </div>
        </div>
      </section>

      {/* 7. Contact CTA */}
      <section className="pw-cta" id="contact">
        <div className="pw-cta-shell">
          <div className="pw-cta-banner">
            <h2>
              Your goals deserve a plan. Let&apos;s start with a{' '}
              <span className="pw-mint">conversation.</span>
            </h2>
            <p>
              Take the first step towards understanding your finances and planning for what matters
              to you.
            </p>
            <div className="pw-cta-actions">
              <a href={BOOK_URL} className="pw-btn pw-btn-light" target="_blank" rel="noopener noreferrer">
                Book a Consultation
              </a>
              {telHref ? (
                <a href={telHref} className="pw-btn pw-btn-call">
                  Call Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </a>
              ) : (
                <a href={BOOK_URL} className="pw-btn pw-btn-call" target="_blank" rel="noopener noreferrer">
                  Call Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ (same as main site) */}
      <FaqSection />

      {/* 9. Footer (same as main site) */}
      <Footer />
    </div>
  );
}
