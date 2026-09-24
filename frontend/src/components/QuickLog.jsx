import { useState } from "react";

const TYPES = [
  { key: "walk", label: "Walk", unit: "steps", placeholder: "e.g. 4500" },
  { key: "water", label: "Water", unit: "ml", placeholder: "e.g. 500" },
  { key: "sleep", label: "Sleep", unit: "hours", placeholder: "e.g. 7.5" },
];

export default function QuickLog({ onLog }) {
  const [active, setActive] = useState("walk");
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  const activeType = TYPES.find((t) => t.key === active);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!value || Number(value) <= 0) return;
    setBusy(true);
    try {
      await onLog(active, Number(value));
      setValue("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="quick-log" onSubmit={handleSubmit}>
      <div className="quick-log-tabs">
        {TYPES.map((t) => (
          <button
            type="button"
            key={t.key}
            className={`quick-log-tab ${active === t.key ? "is-active" : ""}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="quick-log-input-row">
        <input
          type="number"
          step="any"
          min="0"
          inputMode="decimal"
          placeholder={activeType.placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <span className="quick-log-unit">{activeType.unit}</span>
        <button className="btn-primary" type="submit" disabled={busy}>
          {busy ? "Logging…" : "Log it"}
        </button>
      </div>
    </form>
  );
}
