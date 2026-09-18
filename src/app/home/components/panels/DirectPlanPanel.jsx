import { DIRECT_PLAN } from '../../data/productPanels';

const TONE_COLOR = {
  green: 'var(--g)',
  warn: '#D97706',
  muted: 'var(--ink3)',
};

export default function DirectPlanPanel() {
  return (
    <div className="prod-panel">
      <div className="prod-panel-header">
        <div className="prod-panel-dot" style={{ background: 'var(--g)' }} />
        <div className="prod-panel-title">Fydaa Direct Plan</div>
      </div>
      <div className="prod-panel-body">
        <div className="ppb-metric" style={{ background: 'var(--g)', color: '#fff' }}>
          <div className="value" style={{ color: '#fff' }}>{DIRECT_PLAN.percentComplete}%</div>
          <div className="sublabel" style={{ color: 'rgba(255,255,255,.7)' }}>Plan Complete</div>
        </div>

        {DIRECT_PLAN.rows.map((row) => (
          <div className="ppb-row" key={row.key}>
            <span className="k">{row.key}</span>
            <span className="v" style={{ color: TONE_COLOR[row.tone] }}>{row.value}</span>
          </div>
        ))}

        <div
          style={{
            marginTop: 12,
            padding: '10px 12px',
            background: 'var(--g-pale)',
            borderRadius: 8,
            fontSize: '.72rem',
            color: 'var(--g)',
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          {DIRECT_PLAN.footnote}
        </div>
      </div>
    </div>
  );
}
