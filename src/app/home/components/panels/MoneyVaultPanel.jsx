import { MONEY_VAULT } from '../../data/productPanels';

const TONE_COLOR = {
  green: 'var(--g)',
  error: '#DC2626',
  default: undefined,
};

export default function MoneyVaultPanel() {
  return (
    <div className="prod-panel">
      <div className="prod-panel-header">
        <div className="prod-panel-dot" style={{ background: 'var(--g)' }} />
        <div className="prod-panel-title">Money Vault</div>
      </div>
      <div className="prod-panel-body">
        <div className="ppb-metric">
          <div className="value">{MONEY_VAULT.netWorth}</div>
          <div className="sublabel">Net Worth</div>
          <div className="badge">{MONEY_VAULT.monthChange}</div>
        </div>
        {MONEY_VAULT.rows.map((row) => (
          <div className="ppb-row" key={row.key}>
            <span className="k">{row.key}</span>
            <span className="v" style={{ color: TONE_COLOR[row.tone] }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
