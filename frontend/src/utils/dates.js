// logged_at comes back from Postgres as an ISO date string like "2026-09-25".
// These helpers turn that into human-friendly labels without pulling in a date library.

function toLocalDate(isoDateStr) {
  const [year, month, day] = isoDateStr.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function dayLabel(isoDateStr) {
  const date = toLocalDate(isoDateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export function fullDateLabel(date = new Date()) {
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}
