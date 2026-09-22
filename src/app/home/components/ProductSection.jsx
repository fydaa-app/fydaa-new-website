const CHECK = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * Generic "text on one side, product panel on the other" layout used by all
 * four product sections. Pass `reverse` to flip which side the visual sits
 * on (alternates down the page in the reference HTML).
 *
 * `heading` is passed as a ready JSX node (not split into pieces) since each
 * section's accent word sits in a different spot in the sentence — easier
 * to just write the <h2> content directly than force one template to fit
 * every phrasing.
 *
 * `extraCta` is an optional node rendered next to the CTA link — used once,
 * by the Direct Plan section, to show its price alongside the link.
 */
export default function ProductSection({
  label,
  heading, // JSX, e.g. <>Every rupee has a <span className="serif">purpose</span></>
  description,
  points,
  ctaText,
  ctaHref = '#',
  reverse = false,
  extraCta = null,
  className = '',
  children, // the visual panel, e.g. <GoalsPanel />
}) {
  return (
    <section className={`prod-section${className ? ` ${className}` : ''}`}>
      <div className="container">
        <div className={`prod-grid${reverse ? ' reverse' : ''}`}>
          <div className="prod-text">
            <div className="label">{label}</div>
            <h2>{heading}</h2>
            <p>{description}</p>
            <div className="prod-points">
              {points.map((point) => (
                <div className="prod-point" key={point}>
                  {CHECK}
                  {point}
                </div>
              ))}
            </div>
            {extraCta ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <a
                  href={ctaHref}
                  className="prod-cta"
                  {...(ctaHref.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {ctaText}
                </a>
                {extraCta}
              </div>
            ) : (
              <a
                href={ctaHref}
                className="prod-cta"
                {...(ctaHref.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {ctaText}
              </a>
            )}
          </div>
          <div className="prod-visual">{children}</div>
        </div>
      </div>
    </section>
  );
}
