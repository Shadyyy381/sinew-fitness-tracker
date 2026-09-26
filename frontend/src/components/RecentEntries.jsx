import { useState } from "react";
import { dayLabel } from "../utils/dates";

const UNITS = { walk: "steps", water: "ml", sleep: "hrs" };

function groupByDay(logs) {
  const groups = [];
  const byDate = new Map();
  logs.forEach((log) => {
    const key = log.logged_at.slice(0, 10);
    if (!byDate.has(key)) {
      const group = { key, label: dayLabel(log.logged_at), entries: [] };
      byDate.set(key, group);
      groups.push(group);
    }
    byDate.get(key).entries.push(log);
  });
  return groups;
}

export default function RecentEntries({ logs, onDelete, onEdit }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [savingId, setSavingId] = useState(null);

  function startEdit(log) {
    setEditingId(log.id);
    setEditValue(String(log.value));
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue("");
  }

  async function saveEdit(log) {
    setSavingId(log.id);
    try {
      await onEdit(log.id, Number(editValue));
      setEditingId(null);
    } finally {
      setSavingId(null);
    }
  }

  if (logs.length === 0) {
    return <p className="recent-empty">Nothing logged yet — add your first entry above.</p>;
  }

  const groups = groupByDay(logs);

  return (
    <div className="recent-groups">
      {groups.map((group) => (
        <div key={group.key} className="recent-group">
          <div className="recent-group-label">{group.label}</div>
          <ul className="recent-list">
            {group.entries.map((log) => (
              <li key={log.id} className="recent-item">
                <span className={`recent-dot dot-${log.type}`} />
                <span className="recent-type">{log.type}</span>
                {editingId === log.id ? (
                  <>
                    <input
                      className="recent-edit-input"
                      type="number"
                      step="any"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <button
                      className="recent-action"
                      onClick={() => saveEdit(log)}
                      disabled={savingId === log.id}
                    >
                      {savingId === log.id ? "Saving…" : "Save"}
                    </button>
                    <button className="recent-action" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="recent-value">
                      {log.value.toLocaleString()} {UNITS[log.type]}
                    </span>
                    <button className="recent-action" onClick={() => startEdit(log)}>
                      Edit
                    </button>
                    <button className="recent-action recent-delete" onClick={() => onDelete(log.id)}>
                      Remove
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
