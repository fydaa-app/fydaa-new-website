import { AMC_PARTNERS } from '../data/amcPartners';

export default function AmcStrip() {
  // Rendered twice back-to-back so the CSS translateX(-50%) loop is seamless.
  const logos = [...AMC_PARTNERS, ...AMC_PARTNERS];

  return (
    <div className="amc-strip">
      <div className="amc-label">Invest in funds from</div>
      <div className="amc-track-wrap">
        <div className="amc-track">
          {logos.map((amc, i) => (
            <span className="amc-logo" key={`${amc.name}-${i}`}>
              {amc.name} <em>{amc.suffix}</em>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
