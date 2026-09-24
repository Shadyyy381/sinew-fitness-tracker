import { useEffect, useState, useCallback } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext.jsx";
import StatCard from "../components/StatCard.jsx";
import QuickLog from "../components/QuickLog.jsx";
import WeeklyChart from "../components/WeeklyChart.jsx";

const METRICS = ["walk", "water", "sleep"];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [today, setToday] = useState({});
  const [history, setHistory] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [activeMetric, setActiveMetric] = useState("walk");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [summaryRes, logsRes] = await Promise.all([
      api.get("/logs/summary/weekly?days=7"),
      api.get("/logs?days=14"),
    ]);
    const todayMap = {};
    summaryRes.data.today.forEach((row) => (todayMap[row.type] = row.total));
    setToday(todayMap);
    setHistory(summaryRes.data.history);
    setRecentLogs(logsRes.data.logs.slice(0, 8));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleLog(type, value) {
    await api.post("/logs", { type, value });
    await refresh();
  }

  async function handleDelete(id) {
    await api.delete(`/logs/${id}`);
    await refresh();
  }

  if (loading) return <div className="page-loading">Loading Sinew…</div>;

  const metricHistory = history.filter((h) => h.type === activeMetric);

  return (
    <div className="dashboard">
      <aside className="rail">
        <div className="rail-mark">SINEW</div>
        <div className="rail-user">
          <div className="rail-user-name">{user?.name}</div>
          <div className="rail-user-email">{user?.email}</div>
        </div>
        <button className="btn-ghost" onClick={logout}>
          Log out
        </button>
      </aside>

      <main className="main">
        <header className="main-header">
          <h1>Today</h1>
          <p className="main-sub">Log an entry, watch the week take shape.</p>
        </header>

        <QuickLog onLog={handleLog} />

        <section className="stat-grid">
          <StatCard
            label="Steps"
            value={today.walk || 0}
            unit="steps"
            goal={user?.daily_steps_goal}
            accent="#FF6B35"
          />
          <StatCard
            label="Water"
            value={today.water || 0}
            unit="ml"
            goal={user?.daily_water_goal_ml}
            accent="#2DD4BF"
          />
          <StatCard
            label="Sleep"
            value={today.sleep || 0}
            unit="hrs"
            goal={Number(user?.daily_sleep_goal_hours)}
            accent="#C9A5FF"
          />
        </section>

        <section className="chart-section">
          <div className="metric-tabs">
            {METRICS.map((m) => (
              <button
                key={m}
                className={`metric-tab ${activeMetric === m ? "is-active" : ""}`}
                onClick={() => setActiveMetric(m)}
              >
                {m}
              </button>
            ))}
          </div>
          <WeeklyChart metric={activeMetric} data={metricHistory} />
        </section>

        <section className="recent-section">
          <span className="stat-label">Recent entries</span>
          <ul className="recent-list">
            {recentLogs.length === 0 && (
              <li className="recent-empty">Nothing logged yet — add your first entry above.</li>
            )}
            {recentLogs.map((log) => (
              <li key={log.id} className="recent-item">
                <span className={`recent-dot dot-${log.type}`} />
                <span className="recent-type">{log.type}</span>
                <span className="recent-value">
                  {log.value} {log.type === "walk" ? "steps" : log.type === "water" ? "ml" : "hrs"}
                </span>
                <span className="recent-date">{log.logged_at}</span>
                <button className="recent-delete" onClick={() => handleDelete(log.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
