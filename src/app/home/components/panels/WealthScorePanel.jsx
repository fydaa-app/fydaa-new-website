import { WEALTH_SCORE } from '../../data/productPanels';

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TONE_COLOR = { good: 'var(--g)', warn: '#D97706' };

export default function WealthScorePanel() {
  const { score, max, pillars } = WEALTH_SCORE;
  const pct = score / max;
  const dashOffset = CIRCUMFERENCE * (1 - pct);

  return (
    <div className="prod-panel">
      <div className="prod-panel-header">
        <div className="prod-panel-dot" style={{ background: 'var(--g)' }} />
        <div className="prod-panel-title">Wealth Score</div>
      </div>
      <div className="prod-panel-body">
        <div className="score-ring-wrap">
          <div className="score-ring">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle className="score-ring-bg" cx="60" cy="60" r={RADIUS} />
              <circle
                className="score-ring-fill"
                cx="60"
                cy="60"
                r={RADIUS}
                strokeDasharray={CIRCUMFERENCE.toFixed(2)}
                strokeDashoffset={dashOffset.toFixed(2)}
              />
            </svg>
            <div className="score-ring-text">
              <div className="num">{score}</div>
              <div className="of">of {max}</div>
            </div>
          </div>
        </div>

        <div className="ppb-score-bars">
          {pillars.map((p) => (
            <div className="ppb-score-bar-item" key={p.key}>
              <div className="bar-top">
                <span className="k">{p.key}</span>
                <span className="v" style={{ color: TONE_COLOR[p.tone] }}>{p.value}</span>
              </div>
              <div className="ppb-bar">
                <span style={{ width: `${p.value}%`, background: TONE_COLOR[p.tone] }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
