export default function StatCard({ label, value, unit, goal, accent }) {
  const pct = goal ? Math.min(100, Math.round((value / goal) * 100)) : null;

  return (
    <div className="stat-card" style={{ "--accent": accent }}>
      <div className="stat-card-top">
        <span className="stat-label">{label}</span>
        {pct !== null && <span className="stat-pct">{pct}%</span>}
      </div>
      <div className="stat-value">
        {value.toLocaleString()}
        <span className="stat-unit">{unit}</span>
      </div>
      {goal ? (
        <>
          <div className="stat-bar-track">
            <div className="stat-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="stat-goal">of {goal.toLocaleString()} {unit} goal</div>
        </>
      ) : (
        <div className="stat-goal">no entries yet today</div>
      )}
    </div>
  );
}
