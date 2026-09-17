// MIND.EXE — common reliability wrapper for user-facing AI operations.
import { traceEvent } from "./performance-trace.js";

const active = new Map();
let seq = 0;

// These are deterministic/local problems. Retrying the same request cannot fix them.
const TERMINAL_NO_RETRY = /bad_json|bad_image|not_configured|permission|invalid|too_large|unsupported|empty_text|audio_empty|transcript_empty/i;

function safeCodeOf(err) {
  const raw = String(err?.code || err?.name || err?.message || "ai_request_failed");
  // Diagnostics must never accidentally persist prompts/URLs/server payloads. Keep only a
  // short machine-like token suitable for support/debugging.
  return raw
    .replace(/https?:\/\/\S+/gi, "url")
    .replace(/[^a-zA-Z0-9_:/.-]+/g, "_")
    .slice(0, 80) || "ai_request_failed";
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function timeoutError(operation) {
  return Object.assign(new Error(`${operation}_timeout`), { code: `${operation}_timeout` });
}


export async function runAiRequest({
  key,
  operation,
  execute,
  timeoutMs = 20000,
  retries = 0,
  retryDelayMs = 300,
  onSlow = null,
  slowMs = 5000
}) {
  if (typeof execute !== "function") throw new Error("ai_execute_missing");
  const opKey = String(key || operation || "");
  if (!opKey) throw new Error("ai_operation_missing");
  if (active.has(opKey)) throw new Error("ai_operation_in_progress");

  const token = ++seq;
  active.set(opKey, token);
  const started = Date.now();
  const opName = operation || opKey;
  traceEvent(opName, { status: "start" });

  let slowTimer = null;
  let slowSignaled = false;
  if (slowMs > 0) {
    slowTimer = setTimeout(() => {
      if (active.get(opKey) !== token) return;
      slowSignaled = true;
      traceEvent(opName, { durationMs: Date.now() - started, status: "slow" });
      try { onSlow?.(); } catch {}
    }, slowMs);
  }

  try {
    let attempt = 0;
    while (true) {
      let timer = null;
      try {
        // timeoutMs is an overall operation budget, not a fresh budget for every retry. This keeps
        // a one-retry action such as journal copyedit from turning a 12s timeout into ~24s of UI wait.
        const elapsed = Date.now() - started;
        const remainingMs = Math.max(0, timeoutMs - elapsed);
        if (remainingMs <= 0) throw timeoutError(opName);
        const timeout = new Promise((_, reject) => {
          timer = setTimeout(() => reject(timeoutError(opName)), remainingMs);
        });
        const value = await Promise.race([Promise.resolve().then(() => execute(attempt)), timeout]);
        clearTimeout(timer);
        if (active.get(opKey) !== token) throw new Error("ai_operation_superseded");
        traceEvent(opName, { durationMs: Date.now() - started, status: slowSignaled ? "success_after_slow" : "success" });
        return value;
      } catch (err) {
        clearTimeout(timer);
        const code = safeCodeOf(err);
        const isTimeout = /timeout/i.test(code);
        if (attempt >= retries || isTimeout || TERMINAL_NO_RETRY.test(code)) throw err;
        attempt += 1;
        traceEvent(opName, { durationMs: Date.now() - started, status: "retry", code });
        await sleep(retryDelayMs * attempt);
      }
    }
  } catch (err) {
    const code = safeCodeOf(err);
    traceEvent(opName, { durationMs: Date.now() - started, status: /timeout/i.test(code) ? "timeout" : "error", code });
    throw err;
  } finally {
    clearTimeout(slowTimer);
    if (active.get(opKey) === token) active.delete(opKey);
  }
}
