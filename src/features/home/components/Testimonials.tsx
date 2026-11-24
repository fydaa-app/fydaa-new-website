"use client";

import { useRef, useState } from "react";
import { Container } from "@/components/layout/container";
import { TESTIMONIALS } from "../data/content";

/** Customers in their own words: one video story and three quotes, set as text, not cards. */
export default function Testimonials() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function play() {
    setStarted(true);
    videoRef.current?.play().catch(() => {});
  }

  return (
    <section aria-labelledby="stories-title" className="section">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="flex flex-col gap-6">
          <h2 id="stories-title" className="max-w-[14ch] text-heading text-ink">
            What people investing with Fydaa say
          </h2>
          <div
            className="relative aspect-[16/10] w-full max-w-sm overflow-hidden rounded-4xl bg-ink sm:aspect-[4/5]"
            data-allow-clip
          >
            <video
              ref={videoRef}
              className="size-full object-cover"
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
                onClick={play}
                data-ph-event="Play testimonial video"
                className="group absolute inset-0 flex flex-col items-start justify-end gap-4 bg-[radial-gradient(120%_80%_at_20%_0%,#0C4A3E_0%,#0E2721_70%)] p-6 text-left text-white"
              >
                <span
                  aria-hidden="true"
                  className="flex size-14 items-center justify-center rounded-full bg-white text-jade transition-transform duration-fast ease-smooth-out group-hover:scale-105"
                >
                  <svg viewBox="0 0 24 24" className="ml-0.5 size-6" fill="currentColor">
                    <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.86-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14z" />
                  </svg>
                </span>
                <span className="text-title text-white">Watch a customer story</span>
              </button>
            )}
          </div>
        </div>

        <ul className="flex flex-col lg:pt-2">
          {TESTIMONIALS.map((t) => (
            <li
              key={t.name}
              className="border-t border-line py-8 first:border-t-0 first:pt-0 lg:first:border-t lg:first:pt-8 max-sm:[&:nth-child(3)]:hidden"
            >
              <figure className="flex flex-col gap-5">
                <blockquote className="text-lead leading-relaxed text-ink">
                  <p>&ldquo;{t.text}&rdquo;</p>
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-10 items-center justify-center rounded-full bg-jade-tint text-sm font-semibold text-jade"
                  >
                    {t.initials}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-ink">{t.name}</span>
                    <span className="text-sm text-grey-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
