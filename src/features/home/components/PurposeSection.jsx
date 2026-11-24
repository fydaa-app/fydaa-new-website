'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const POINTS = [
  'Link existing SIP',
  'Create SIP with a goal',
  'Track progress',
];

const TARGET_AMOUNT = 64273;
const DURATION_MONTHS = 24;
const MONTHLY_EMI = Math.round(TARGET_AMOUNT / DURATION_MONTHS);
const RING_R = 33;
const RING_C = 2 * Math.PI * RING_R;

function formatInr(value) {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function EmergencyFundCard({ progress, amount }) {
  const pct = Math.min(100, Math.max(0, progress * 100));
  const pctLabel = pct >= 99.5 ? '100' : pct.toFixed(1);
  const invested = amount;
  const current = Math.round(amount * 1.05);

  const stats = [
    { label: 'Invested', value: formatInr(invested) },
    { label: 'Current', value: formatInr(current) },
    { label: 'Monthly', value: formatInr(MONTHLY_EMI) },
    { label: 'Duration', value: `${DURATION_MONTHS} Months` },
  ];

  return (
    <div className="purpose-fund-card" aria-hidden="true">
      <div className="purpose-fund-card-inner">
        <div className="purpose-fund-card-head">
          <div className="purpose-fund-title">Emergency Fund</div>
          <div className="purpose-fund-fund">
            HDFC GILT FUND - DIRECT PLAN - GROWTH OPTION
          </div>
          <div className="purpose-fund-target">
            Target: {formatInr(TARGET_AMOUNT)} · by December 2027
          </div>
        </div>

        <div className="purpose-fund-card-body">
          <div className="purpose-fund-progress">
            <svg viewBox="0 0 90 90" className="purpose-fund-ring-svg" aria-hidden="true">
              <circle cx="45" cy="45" r={RING_R} className="purpose-fund-ring-bg" />
              <circle
                cx="45"
                cy="45"
                r={RING_R}
                className="purpose-fund-ring-fg"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - (pct >= 99.5 ? 1 : progress))}
                transform="rotate(-90 45 45)"
              />
            </svg>
            <div className="purpose-fund-pct">
              <strong>{pctLabel}%</strong>
              <span>COMPLETE</span>
            </div>
          </div>

          <div className="purpose-fund-stats">
            {stats.map((stat) => (
              <div className="purpose-fund-stat" key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PurposePhone({ progress, amount }) {
  return (
    <div className="purpose-phone" aria-hidden="true">
      <img
        src="/home/purpose/goal-phone-mock.png"
        alt=""
        className="purpose-phone-img"
      />
      <EmergencyFundCard progress={progress} amount={amount} />
    </div>
  );
}

function SipSlider({ progress, onChange, onDragStart, onDragEnd }) {
  const trackRef = useRef(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback(
    (clientX) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const thumb = el.offsetHeight || 48;
      const min = thumb / 2;
      const max = Math.max(min, rect.width - thumb / 2);
      const x = Math.min(Math.max(clientX - rect.left, min), max);
      let next = max === min ? 0 : (x - min) / (max - min);
      if (next > 0.98) next = 1;
      if (next < 0.02) next = 0;
      onChange(next);
    },
    [onChange],
  );

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      if (e.cancelable) e.preventDefault();
      const point = e.touches ? e.touches[0] : e;
      setFromClientX(point.clientX);
    };
    const onUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      onDragEnd?.();
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [setFromClientX, onDragEnd]);

  const startDrag = (e) => {
    dragging.current = true;
    onDragStart?.();
    if (e.cancelable) e.preventDefault();
    const point = e.touches ? e.touches[0] : e;
    setFromClientX(point.clientX);
  };

  const amount = Math.round(progress * TARGET_AMOUNT);

  return (
    <div className="purpose-sip-track">
      <div
        ref={trackRef}
        className="purpose-sip-rail"
        onPointerDown={startDrag}
        onTouchStart={startDrag}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={TARGET_AMOUNT}
        aria-valuenow={amount}
        aria-label="SIP progress toward Emergency Fund target"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            onChange(Math.min(1, progress + 0.02));
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            onChange(Math.max(0, progress - 0.02));
          } else if (e.key === 'Home') {
            e.preventDefault();
            onChange(0);
          } else if (e.key === 'End') {
            e.preventDefault();
            onChange(1);
          }
        }}
      >
        <span className="purpose-sip-line" />
        <span
          className="purpose-sip-fill"
          style={{
            width: `calc((100% - var(--sip-thumb)) * ${progress} + (var(--sip-thumb) * 0.5))`,
          }}
        />
        <button
          type="button"
          className="purpose-sip-dot"
          style={{
            left: `calc(var(--sip-thumb) * 0.5 + (100% - var(--sip-thumb)) * ${progress})`,
          }}
          aria-hidden="true"
          tabIndex={-1}
          onPointerDown={startDrag}
          onTouchStart={startDrag}
        >
          SIP
        </button>
      </div>
    </div>
  );
}

export default function PurposeSection() {
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);
  const draggingRef = useRef(false);
  const isVisibleRef = useRef(false);
  const amount = progress * TARGET_AMOUNT;

  const updateFromScroll = useCallback(() => {
    if (draggingRef.current) return;
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    // 0% when Purpose section first lands mid-viewport (as in the trigger screenshot),
    // then scrub to 100% as the section continues scrolling upward.
    // Wider start→end span = slower fill (ends less abruptly).
    const start = vh * 0.48;
    const end = -vh * 0.08;

    if (rect.bottom <= 0) {
      setProgress((prev) => (prev === 1 ? prev : 1));
      return;
    }
    if (rect.top >= vh || !isVisibleRef.current || rect.top > start) {
      setProgress((prev) => (prev === 0 ? prev : 0));
      return;
    }

    const raw = (start - rect.top) / (start - end);
    const next = Math.min(1, Math.max(0, raw));
    setProgress((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Fire as soon as a meaningful portion of the section is on screen.
        isVisibleRef.current = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        updateFromScroll();
      },
      { threshold: [0, 0.25, 0.4, 0.6, 0.8, 1] },
    );
    observer.observe(section);

    let ticking = false;
    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        updateFromScroll();
      });
    };

    updateFromScroll();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [updateFromScroll]);

  return (
    <section className="purpose-section" ref={sectionRef}>
      <div className="container">
        <div className="purpose-grid">
          <div className="purpose-copy">
            <h2>
              Give your savings a <span className="serif">purpose</span>
            </h2>
            <p className="purpose-sub">
              Every SIP should be connected to something meaningful. With Fydaa, you can link an existing SIP to a financial goal or start a new SIP with the goal assigned from day one.
            </p>
          </div>

          <SipSlider
            progress={progress}
            onChange={setProgress}
            onDragStart={() => {
              draggingRef.current = true;
            }}
            onDragEnd={() => {
              draggingRef.current = false;
            }}
          />

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
            <PurposePhone progress={progress} amount={amount} />
          </div>
        </div>
      </div>
    </section>
  );
}
