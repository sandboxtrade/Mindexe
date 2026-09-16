// MIND.EXE — privacy-safe local performance diagnostics.
// Stores operation names/timings/status only; never stores prompts, transcripts, images or journal data.
const TRACE_KEY = "mind-exe-performance-trace-v1";
const MAX_ROWS = 160;

function safeStorage() { try { return globalThis?.localStorage || null; } catch { return null; } }
function readRows() {
  const s = safeStorage(); if (!s) return [];
  try { const v = JSON.parse(s.getItem(TRACE_KEY) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}
function writeRows(rows) {
  const s = safeStorage(); if (!s) return;
  try { s.setItem(TRACE_KEY, JSON.stringify(rows.slice(-MAX_ROWS))); } catch {}
}
function safeToken(value, max = 80) {
  return String(value || "")
    .replace(/https?:\/\/\S+/gi, "url")
    .replace(/[^a-zA-Z0-9_:/.-]+/g, "_")
    .slice(0, max);
}
export function traceEvent(name, { durationMs = null, status = "event", code = null } = {}) {
  const row = {
    at: Date.now(),
    name: safeToken(name || "unknown", 48) || "unknown",
    status: safeToken(status || "event", 24) || "event"
  };
  if (Number.isFinite(durationMs)) row.durationMs = Math.max(0, Math.round(durationMs));
  if (code) row.code = safeToken(code, 80);
  const rows = readRows(); rows.push(row); writeRows(rows); return row;
}
export function getPerformanceTrace() { return readRows(); }
export function clearPerformanceTrace() { const s = safeStorage(); try { s?.removeItem(TRACE_KEY); } catch {} }
export function formatPerformanceTrace(rows = readRows()) {
  return rows.map((r) => `${new Date(r.at).toISOString()} ${r.name} ${r.status}${Number.isFinite(r.durationMs) ? ` ${r.durationMs}ms` : ""}${r.code ? ` ${r.code}` : ""}`).join("\n");
}
