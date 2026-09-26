export default function ScoreCard({ score, streak, insight }) {
  return (
    <div className="score-row">
      <div className="score-card">
        <div className="score-label">SINEW Score</div>
        <div className="score-value">{score}</div>
        <div className="score-sub">Today's goal completion — not a health measure</div>
      </div>
      <div className="streak-card">
        <div className="streak-flame">🔥</div>
        <div className="streak-value">{streak}</div>
        <div className="streak-label">{streak === 1 ? "day streak" : "day streak"}</div>
      </div>
      <div className="insight-card">
        <div className="insight-label">💡 Insight</div>
        <div className="insight-text">{insight}</div>
      </div>
    </div>
  );
}
