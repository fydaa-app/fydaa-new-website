"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/*
 * "For Your Dreams And Aspirations", as on fydaa.com: a white road with a mint glow snakes down the
 * section and a car drives along it as you scroll, lighting up each goal it reaches. The live site
 * drew this with a Lottie file; here it is one SVG path and a few lines of script.
 */

const GOALS = [
  {
    title: "Consume Mindfully",
    tagline: "Fulfil dreams without draining your future",
    body: "Plan for your car, wedding, or that solo trip without falling into high-interest EMIs. With Fydaa, you set the goal, build a plan, and reach it on your terms.",
    /** Scroll progress at which the car reaches this goal. */
    at: 0.04,
    /** Position inside the road's bends, in viewBox units (1200 × 1580). */
    box: { left: 90, top: 10, width: 560 },
  },
  {
    title: "Strategic Saving",
    tagline: "Be ready for life’s curveballs",
    body: "From emergency funds to marriage funds - we help you create savings pockets that keep you stress-free. Small, consistent action beats last-minute panic.",
    at: 0.42,
    box: { left: 330, top: 520, width: 560 },
  },
  {
    title: "Invest to Build Wealth",
    tagline: "Your money should work while you sleep",
    body: "Investing isn’t just for the rich. Start small, start smart — and compound your way to financial freedom. Fydaa gives you expert-backed plans for your goals and profile.",
    at: 0.78,
    box: { left: 130, top: 1050, width: 600 },
  },
] as const;

const VIEW_W = 1200;
const VIEW_H = 1580;
const ROAD = 170;
const R = 150;
const ROW1 = 390;
const ROW2 = 920;
const ROW3 = 1450;

/** The road's centre line: down from the top right, then back and forth across the section. */
const ROAD_PATH = [
  `M 1020 -40 V ${ROW1 - R}`,
  `Q 1020 ${ROW1} ${1020 - R} ${ROW1} H ${170 + R}`,
  `Q 170 ${ROW1} 170 ${ROW1 + R} V ${ROW2 - R}`,
  `Q 170 ${ROW2} ${170 + R} ${ROW2} H ${1020 - R}`,
  `Q 1020 ${ROW2} 1020 ${ROW2 + R} V ${ROW3 - R}`,
  `Q 1020 ${ROW3} ${1020 - R} ${ROW3} H 360`,
].join(" ");

/** A line-drawn car, facing right, centred on the road's centre line when placed at (0, 0). */
function Car() {
  return (
    <svg
      x={-80}
      y={-46}
      width={160}
      height={80}
      viewBox="0 0 96 48"
      fill="none"
      stroke="#0A0A0A"
      strokeWidth="3.2"
      strokeLinejoin="round"
    >
      <path d="M8 34v-8c0-3 2-5 5-6l13-3 10-9c2-2 4-3 7-3h17c3 0 5 1 7 3l8 9 9 2c3 1 5 3 5 6v9c0 2-1 3-3 3h-6" />
      <path d="M33 37h28M8 37h5" strokeLinecap="round" />
      <path d="M38 17l7-8h11v8zM60 9h7l7 8H60z" />
      <circle cx="23" cy="37" r="7" fill="#fff" />
      <circle cx="71" cy="37" r="7" fill="#fff" />
      <path d="M88 26h-6" strokeLinecap="round" />
    </svg>
  );
}

function GoalCopy({ goal, active }: { goal: (typeof GOALS)[number]; active: boolean }) {
  return (
    <div className={`dreams-goal ${active ? "is-active" : ""}`}>
      <h3 className="dreams-goal-title">{goal.title}</h3>
      <p className="dreams-goal-tagline">{goal.tagline}</p>
      <p className="dreams-goal-body">{goal.body}</p>
      <Link href="/#book-a-call" className="dreams-goal-cta" data-ph-event="Book a Free Call">
        Book a Free Call
      </Link>
    </div>
  );
}

export default function DreamsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const roadRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  // null until the script runs: the server and no-JS render show every goal at full strength.
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const road = roadRef.current;
    const car = carRef.current;
    if (!section || !road || !car) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const length = road.getTotalLength();
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const span = rect.height + window.innerHeight * 0.2;
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - rect.top) / span));
      const at = Math.max(1, Math.min(length - 1, p * length));
      const here = road.getPointAtLength(at);
      const ahead = road.getPointAtLength(Math.min(length, at + 2));
      const back = road.getPointAtLength(Math.max(0, at - 2));
      const angle = (Math.atan2(ahead.y - back.y, ahead.x - back.x) * 180) / Math.PI;
      const leftwards = angle > 90 || angle < -90;
      car.setAttribute(
        "transform",
        `translate(${here.x} ${here.y}) rotate(${angle})${leftwards ? " scale(1 -1)" : ""}`,
      );
      setProgress(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) window.addEventListener("scroll", onScroll, { passive: true });
      else window.removeEventListener("scroll", onScroll);
    });
    observer.observe(section);
    update();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const isActive = (at: number) => progress === null || progress >= at;

  return (
    <section ref={sectionRef} className="dreams" aria-labelledby="dreams-title">
      <div className="container">
        <div className="dreams-head">
          <h2 id="dreams-title">For Your Dreams And Aspirations</h2>
          <p>
            At Fydaa, we help you direct every rupee with purpose - whether you&apos;re spending on today,
            saving for tomorrow, or investing for the future.
          </p>
        </div>

        {/* Desktop: the road. */}
        <div className="dreams-road" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="dreams-road-svg" aria-hidden="true">
            <defs>
              <filter id="dreams-glow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="9" />
              </filter>
            </defs>
            <path
              d={ROAD_PATH}
              fill="none"
              stroke="#A7F3D0"
              strokeWidth={ROAD + 18}
              filter="url(#dreams-glow)"
            />
            <path ref={roadRef} d={ROAD_PATH} fill="none" stroke="#fff" strokeWidth={ROAD} />
            <path
              d={`M 300 ${ROW3} H 420`}
              stroke="#0C4A3E"
              strokeWidth="10"
              strokeLinecap="round"
              opacity=".9"
            />
            <g ref={carRef} transform="translate(1020 0) rotate(90)">
              <Car />
            </g>
          </svg>
          {GOALS.map((goal) => (
            <div
              key={goal.title}
              className="dreams-road-item"
              style={{
                left: `${(goal.box.left / VIEW_W) * 100}%`,
                top: `${(goal.box.top / VIEW_H) * 100}%`,
                width: `${(goal.box.width / VIEW_W) * 100}%`,
              }}
            >
              <GoalCopy goal={goal} active={isActive(goal.at)} />
            </div>
          ))}
        </div>

        {/* Phones and tablets: the same goals along a straight road. */}
        <ol className="dreams-list">
          {GOALS.map((goal) => (
            <li key={goal.title}>
              <GoalCopy goal={goal} active />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
