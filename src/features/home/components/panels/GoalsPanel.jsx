import { GOALS } from '../../data/productPanels';

export default function GoalsPanel() {
  return (
    <div className="prod-panel">
      <div className="prod-panel-header">
        <div className="prod-panel-dot" style={{ background: 'var(--g)' }} />
        <div className="prod-panel-title">My Goals</div>
      </div>
      <div className="prod-panel-body">
        <div className="ppb-goal-list">
          {GOALS.map((goal) => (
            <div
              className="ppb-goal-item"
              key={goal.name}
              style={goal.highlight ? { background: 'var(--g-light)' } : undefined}
            >
              <div className="ppb-goal-icon">{goal.emoji}</div>
              <div className="ppb-goal-info">
                <div className="ppb-goal-name">{goal.name}</div>
                <div className="ppb-goal-sub">{goal.current} of {goal.target}</div>
              </div>
              <div className="ppb-goal-pct" style={goal.highlight ? { color: 'var(--g)' } : undefined}>
                {goal.pct}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
