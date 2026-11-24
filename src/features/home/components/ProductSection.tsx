import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface ProductSectionCta {
  label: string;
  href: string;
}

export interface ProductSectionProps {
  label: string;
  /** Heading as JSX so each section can place its accent word, e.g. `<>One <span className="serif">roadmap</span></>`. */
  heading: ReactNode;
  mobileHeading?: ReactNode;
  description: ReactNode;
  mobileDescription?: ReactNode;
  points: string[];
  mobilePoints?: string[];
  /** Optional call to action. Without one, no link is rendered at all. */
  cta?: ProductSectionCta;
  /** Extra content shown next to the CTA, e.g. a price label. */
  aside?: ReactNode;
  /** Put the visual on the left. */
  reverse?: boolean;
  className?: string;
  /** The visual panel, e.g. <GoalsPanel />. */
  children: ReactNode;
}

const CHECK = (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/** Analytics event name derived from the visible label, without arrow glyphs. */
function eventName(label: string): string {
  return label
    .replace(/[→←↑↓➜➝➞➡︎▶️]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function PointList({ points, className }: { points: string[]; className: string }) {
  return (
    <ul className={className} role="list">
      {points.map((point) => (
        <li className="prod-point" key={point}>
          {CHECK}
          {point}
        </li>
      ))}
    </ul>
  );
}

function Cta({ label, href }: ProductSectionCta) {
  const external = /^https?:\/\//.test(href);
  return (
    <Link
      href={href}
      className="prod-cta"
      data-ph-event={eventName(label)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </Link>
  );
}

/** Text on one side, a product visual on the other; used by the home and features pages. */
export default function ProductSection({
  label,
  heading,
  mobileHeading,
  description,
  mobileDescription,
  points,
  mobilePoints,
  cta,
  aside,
  reverse = false,
  className = "",
  children,
}: ProductSectionProps) {
  return (
    <section className={cn("prod-section", className)}>
      <div className="container">
        <div className={cn("prod-grid", reverse && "reverse")}>
          <div className="prod-text">
            <div className="label">{label}</div>
            <h2>
              <span className={mobileHeading ? "copy-desktop" : undefined}>{heading}</span>
              {mobileHeading ? <span className="copy-mobile">{mobileHeading}</span> : null}
            </h2>
            <p>
              <span className={mobileDescription ? "copy-desktop" : undefined}>{description}</span>
              {mobileDescription ? <span className="copy-mobile">{mobileDescription}</span> : null}
            </p>
            <PointList points={points} className={cn("prod-points", mobilePoints && "copy-desktop")} />
            {mobilePoints ? <PointList points={mobilePoints} className="prod-points copy-mobile" /> : null}
            {cta || aside ? (
              <div className="prod-cta-row">
                {cta ? <Cta {...cta} /> : null}
                {aside}
              </div>
            ) : null}
          </div>
          <div className="prod-visual">{children}</div>
        </div>
      </div>
    </section>
  );
}
