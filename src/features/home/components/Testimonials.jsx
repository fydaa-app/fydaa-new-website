'use client';

import { TESTIMONIALS } from '../data/content';

const FEATURED = TESTIMONIALS.slice(0, 2);

export default function Testimonials() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="testi-layout">
          <div className="testi-video-col">
            <div className="testi-video-frame">
              <video
                className="testi-video"
                controls
                playsInline
                preload="metadata"
              >
                <source
                  src="https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/IMG_2372.mp4"
                  type="video/mp4"
                />
              </video>
            </div>
          </div>

          <div className="testi-content-col">
            <h2 className="testi-heading">People who invest with Fydaa</h2>
            <div className="testi-grid">
              {FEATURED.map((t) => (
                <div className="testi-card" key={t.name}>
                  <div className="testi-stars" aria-label="5 out of 5 stars">
                    ★★★★★
                  </div>
                  <p className="testi-text">
                    {t.mobileText ? (
                      <>
                        <span className="copy-desktop">{t.text}</span>
                        <span className="copy-mobile">{t.mobileText}</span>
                      </>
                    ) : (
                      t.text
                    )}
                  </p>
                  <div className="testi-author">
                    <div className="testi-avatar" aria-hidden="true">
                      {t.initials}
                    </div>
                    <div>
                      <div className="testi-name">{t.name}</div>
                      <div className="testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
