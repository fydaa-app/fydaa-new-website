"use client";

import { useRef, useState } from "react";
import { TESTIMONIALS } from "../data/content";

const FEATURED = TESTIMONIALS.slice(0, 2);

export default function Testimonials() {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);

  function play() {
    setStarted(true);
    videoRef.current?.play().catch(() => {});
  }

  return (
    <section className="testimonials">
      <div className="container">
        <div className="testi-layout">
          <div className="testi-video-col">
            <div className="testi-video-frame">
              <video
                ref={videoRef}
                className="testi-video"
                controls={started}
                playsInline
                preload="none"
                aria-label="Customer story video"
              >
                <source
                  src="https://fydaa-v2.s3.ap-south-1.amazonaws.com/public/webVideos/IMG_2372.mp4"
                  type="video/mp4"
                />
              </video>
              {started ? null : (
                <button
                  type="button"
                  className="testi-video-cover"
                  onClick={play}
                  data-ph-event="Play testimonial video"
                >
                  <span className="testi-video-play" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.86-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" />
                    </svg>
                  </span>
                  <span className="testi-video-label">Watch a customer story</span>
                </button>
              )}
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
                  <p className="testi-text">{t.text}</p>
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
