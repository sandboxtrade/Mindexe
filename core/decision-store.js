// MIND.EXE — Decision Lab cloud persistence v1.
// Per-session CAS + an atomically updated derived index. Locked pre-trade snapshots cannot mutate.
// v5.2 hardening removes the hidden 500-session cap and bounds bulk reads.

import {
  DECISION_INDEX_SCHEMA_VERSION,
  normalizeDecisionSession,
  buildDecisionIndexRow,
  assertDecisionMutationAllowed,
  setDecisionPostReview
} from "./decision-model.js";

function parseJson(value, code) {
  try {
    return JSON.parse(value);
  } catch (_) {
    throw new Error(code);
  }
}

function normalizeIndex(raw) {
  const rows = Array.isArray(raw?.sessions) ? raw.sessions : [];
  const dedupe = new Map();
  for (const row of rows) {
    if (!row?.id) continue;
    dedupe.set(String(row.id), {
      id: String(row.id),
      createdAt: Number(row.createdAt) || 0,
      updatedAt: Number(row.updatedAt) || 0,
      mode: row.mode === "entry" ? "entry" : "direction",
      symbol: row.symbol ? String(row.symbol).slice(0, 40) : null,
      consideredDirection: ["long", "short"].includes(row.consideredDirection) ? row.consideredDirection : null,
      finalDecision: row.finalDecision || null,
      linkedTradeId: row.linkedTradeId ? String(row.linkedTradeId) : null,
      status: row.status || "draft",
      lockedAt: row.lockedAt ?? null
    });
  }
  return {
    version: DECISION_INDEX_SCHEMA_VERSION,
    revision: Math.max(0, Number(raw?.revision) || 0),
    // Never silently discard older Decision sessions. The previous .slice(0, 500) made old
    // evidence disappear from history/backup/reset. A future store migration can shard the index,
    // but until then correctness is preferable to a hidden truncation limit.
    sessions: [...dedupe.values()].sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt))
  };
}

async function mapWithConcurrency(items, concurrency, worker) {
  const rows = Array.isArray(items) ? items : [];
  const out = new Array(rows.length);
  let cursor = 0;
  const count = Math.max(1, Math.min(rows.length || 1, Number(concurrency) || 8));
  const jobs = Array.from({ length: count }, async () => {
    while (true) {
      const index = cursor++;
      if (index >= rows.length) break;
      out[index] = await worker(rows[index], index);
    }
  });
  await Promise.all(jobs);
  return out;
}

export function createDecisionStore({
  storageGet,
  storageDelete,
  getDocRef,
  runTransaction,
  db,
  indexBaseKey = "mind-exe-decision-index",
  sessionBaseKey = "mind-exe-decision-session",
  mediaBaseKey = null,
  now = () => Date.now()
}) {
  if (typeof storageGet !== "function" || typeof storageDelete !== "function" ||
      typeof getDocRef !== "function" || typeof runTransaction !== "function" || !db) {
    throw new Error("decision_store_missing_dependency");
  }

  const indexKey = (uid) => `${indexBaseKey}:${uid}`;
  const sessionKey = (uid, id) => `${sessionBaseKey}:${uid}:${id}`;

  async function loadIndex(uid) {
    if (!uid) throw new Error("decision_auth_missing");
    const res = await storageGet(indexKey(uid), false);
    if (!res?.value) return normalizeIndex(null);
    return normalizeIndex(parseJson(res.value, "decision_index_unreadable"));
  }

  async function loadSession(uid, id) {
    if (!uid || !id) throw new Error("decision_session_missing_id");
    const res = await storageGet(sessionKey(uid, id), false);
    if (!res?.value) return null;
    const parsed = parseJson(res.value, "decision_session_unreadable");
    const normalized = normalizeDecisionSession(parsed);
    if (!normalized || normalized.id !== id) throw new Error("decision_session_unreadable");
    return normalized;
  }

  async function saveSession(uid, candidate) {
    if (!uid) throw new Error("decision_auth_missing");
    const normalized = normalizeDecisionSession(candidate);
    if (!normalized?.id) throw new Error("decision_session_invalid");
    const sessionRef = getDocRef(sessionKey(uid, normalized.id), false);
    const indexRef = getDocRef(indexKey(uid), false);
    if (!sessionRef || !indexRef) throw new Error("decision_auth_uid_mismatch");

    let committed = null;
    await runTransaction(db, async (tx) => {
      const [sessionSnap, indexSnap] = await Promise.all([tx.get(sessionRef), tx.get(indexRef)]);
      let current = null;
      if (sessionSnap.exists()) {
        const raw = sessionSnap.data()?.value;
        if (typeof raw !== "string") throw new Error("decision_session_unreadable");
        current = normalizeDecisionSession(parseJson(raw, "decision_session_unreadable"));
      }

      const expectedRevision = Math.max(0, Number(normalized.persistenceRevision) || 0);
      const currentRevision = Math.max(0, Number(current?.persistenceRevision) || 0);
      if (!current && expectedRevision !== 0) throw new Error("decision_revision_conflict");
      if (current && currentRevision !== expectedRevision) throw new Error("decision_revision_conflict");
      if (current) assertDecisionMutationAllowed(current, normalized);

      const savedAt = now();
      committed = normalizeDecisionSession({
        ...normalized,
        updatedAt: savedAt,
        persistenceRevision: currentRevision + 1,
        persistenceUpdatedAt: savedAt
      });

      let index = normalizeIndex(null);
      if (indexSnap.exists()) {
        const raw = indexSnap.data()?.value;
        if (typeof raw === "string") index = normalizeIndex(parseJson(raw, "decision_index_unreadable"));
      }
      const row = buildDecisionIndexRow(committed);
      const rows = index.sessions.filter((item) => item.id !== row.id);
      rows.push(row);
      const nextIndex = normalizeIndex({
        version: DECISION_INDEX_SCHEMA_VERSION,
        revision: index.revision + 1,
        sessions: rows
      });

      tx.set(sessionRef, { value: JSON.stringify(committed), updatedAt: savedAt });
      tx.set(indexRef, { value: JSON.stringify(nextIndex), updatedAt: savedAt });
    });
    return committed;
  }

  async function abandonSession(uid, session) {
    const s = normalizeDecisionSession(session);
    if (!s) throw new Error("decision_session_invalid");
    if (s.status !== "draft") return s;
    return saveSession(uid, { ...s, status: "abandoned", updatedAt: now() });
  }

  async function deleteSession(uid, sessionId, { expectedRevision = null } = {}) {
    if (!uid || !sessionId) throw new Error("decision_session_missing_id");
    const id = String(sessionId);
    const sessionRef = getDocRef(sessionKey(uid, id), false);
    const indexRef = getDocRef(indexKey(uid), false);
    const mediaRef = mediaBaseKey ? getDocRef(`${mediaBaseKey}:${uid}:${id}`, false) : null;
    if (!sessionRef || !indexRef) throw new Error("decision_auth_uid_mismatch");

    let deleted = null;
    await runTransaction(db, async (tx) => {
      const [sessionSnap, indexSnap] = await Promise.all([tx.get(sessionRef), tx.get(indexRef)]);
      if (sessionSnap.exists()) {
        const raw = sessionSnap.data()?.value;
        if (typeof raw !== "string") throw new Error("decision_session_unreadable");
        deleted = normalizeDecisionSession(parseJson(raw, "decision_session_unreadable"));
        if (!deleted || deleted.id !== id) throw new Error("decision_session_unreadable");
        if (expectedRevision != null && Math.max(0, Number(expectedRevision) || 0) !== Math.max(0, Number(deleted.persistenceRevision) || 0)) {
          throw new Error("decision_revision_conflict");
        }
      }

      let index = normalizeIndex(null);
      if (indexSnap.exists()) {
        const raw = indexSnap.data()?.value;
        if (typeof raw === "string") index = normalizeIndex(parseJson(raw, "decision_index_unreadable"));
      }
      const nextRows = index.sessions.filter((row) => row.id !== id);
      const savedAt = now();
      if (nextRows.length !== index.sessions.length || !indexSnap.exists()) {
        const nextIndex = normalizeIndex({
          version: DECISION_INDEX_SCHEMA_VERSION,
          revision: index.revision + 1,
          sessions: nextRows
        });
        tx.set(indexRef, { value: JSON.stringify(nextIndex), updatedAt: savedAt });
      }
      if (mediaRef) tx.delete(mediaRef);
      if (sessionSnap.exists()) tx.delete(sessionRef);
    });
    return deleted;
  }


  async function linkTrade(uid, sessionId, tradeId) {
    const current = await loadSession(uid, sessionId);
    if (!current) throw new Error("decision_session_missing");
    if (current.status === "draft" || current.status === "abandoned") throw new Error("decision_not_locked");
    const nextTradeId = String(tradeId || "") || null;
    if (!nextTradeId) throw new Error("decision_trade_missing");
    if (current.linkedTradeId && current.linkedTradeId !== nextTradeId) {
      throw new Error("decision_trade_link_conflict");
    }
    if (current.linkedTradeId === nextTradeId && ["linked", "reviewed"].includes(current.status)) return current;
    return saveSession(uid, {
      ...current,
      linkedTradeId: nextTradeId,
      status: current.postReview ? "reviewed" : "linked",
      updatedAt: now()
    });
  }

  async function loadSessionsPage(uid, { offset = 0, limit = 50, strict = false, concurrency = 8 } = {}) {
    const index = await loadIndex(uid);
    const start = Math.max(0, Number(offset) || 0);
    const size = Math.max(1, Math.min(200, Number(limit) || 50));
    const page = index.sessions.slice(start, start + size);
    const rows = await mapWithConcurrency(page, concurrency, async (row) => {
      try {
        const session = await loadSession(uid, row.id);
        if (!session && strict) throw new Error("decision_session_missing");
        return session;
      } catch (e) {
        if (strict) throw e;
        return null;
      }
    });
    return {
      sessions: rows.filter(Boolean),
      total: index.sessions.length,
      offset: start,
      nextOffset: start + page.length < index.sessions.length ? start + page.length : null
    };
  }

  async function loadAllSessions(uid, options = {}) {
    const index = await loadIndex(uid);
    const allowedStatuses = Array.isArray(options.statuses) && options.statuses.length
      ? new Set(options.statuses.map(String))
      : null;
    const indexedRows = allowedStatuses
      ? index.sessions.filter((row) => allowedStatuses.has(row.status))
      : index.sessions;
    const rows = await mapWithConcurrency(indexedRows, options.concurrency || 8, async (row) => {
      try {
        const session = await loadSession(uid, row.id);
        if (!session && options.strict) throw new Error("decision_session_missing");
        options.onProgress?.(row);
        return session;
      } catch (e) {
        if (options.strict) throw e;
        return null;
      }
    });
    return rows.filter(Boolean);
  }

  async function savePostReview(uid, sessionId, review) {
    const current = await loadSession(uid, sessionId);
    if (!current) throw new Error("decision_session_missing");
    return saveSession(uid, setDecisionPostReview(current, review, now()));
  }

  async function reconcileTradeLinks(uid, trades = [], { concurrency = 3 } = {}) {
    if (!uid) throw new Error("decision_auth_missing");
    const bySession = new Map();
    const duplicateSessions = new Set();
    for (const trade of Array.isArray(trades) ? trades : []) {
      const sessionId = String(trade?.decisionSessionId || "");
      const tradeId = String(trade?.id || "");
      if (!sessionId || !tradeId) continue;
      const prior = bySession.get(sessionId);
      if (prior && prior !== tradeId) duplicateSessions.add(sessionId);
      else if (!prior) bySession.set(sessionId, tradeId);
    }
    // Never guess which Journal trade owns a Decision when corrupted/duplicated links exist.
    // Report a conflict and leave the cloud snapshot untouched for explicit recovery.
    const candidates = [...bySession.entries()]
      .filter(([sessionId]) => !duplicateSessions.has(sessionId))
      .map(([sessionId, tradeId]) => ({ sessionId, tradeId }));
    let linked = 0;
    let alreadyLinked = 0;
    let conflicts = duplicateSessions.size;
    let missing = 0;
    let failed = 0;
    await mapWithConcurrency(candidates, concurrency, async ({ sessionId, tradeId }) => {
      try {
        const current = await loadSession(uid, sessionId);
        if (!current) { missing += 1; return; }
        if (current.linkedTradeId === tradeId) { alreadyLinked += 1; return; }
        if (current.linkedTradeId && current.linkedTradeId !== tradeId) { conflicts += 1; return; }
        if (!["locked", "linked", "reviewed"].includes(current.status)) return;
        await linkTrade(uid, sessionId, tradeId);
        linked += 1;
      } catch (e) {
        if (e?.message === "decision_trade_link_conflict") conflicts += 1;
        else failed += 1;
      }
    });
    return { checked: candidates.length, linked, alreadyLinked, conflicts, missing, failed };
  }

  async function restoreSessions(uid, sessions = []) {
    if (!uid) throw new Error("decision_auth_missing");
    const imported = (Array.isArray(sessions) ? sessions : []).map(normalizeDecisionSession).filter(Boolean);
    let created = 0;
    let skipped = 0;
    let failed = 0;
    for (const candidate of imported) {
      try {
        const current = await loadSession(uid, candidate.id);
        if (current) {
          // Full-backup restore is non-destructive for existing Decision snapshots. The pre-trade
          // record is evidence of what the user thought before knowing the outcome, so an older
          // backup must never rewrite an already-present cloud snapshot.
          skipped += 1;
          continue;
        }
        await saveSession(uid, { ...candidate, persistenceRevision: 0, persistenceUpdatedAt: null });
        created += 1;
      } catch (_) {
        failed += 1;
      }
    }
    return { imported: imported.length, created, skipped, failed };
  }

  async function resetAll(uid) {
    if (!uid) throw new Error("decision_auth_missing");
    let index = normalizeIndex(null);
    try {
      index = await loadIndex(uid);
    } catch (_) {
    }
    const jobs = index.sessions.map((row) => storageDelete(sessionKey(uid, row.id), false));
    jobs.push(storageDelete(indexKey(uid), false));
    const settled = await Promise.allSettled(jobs);
    return {
      knownSessions: index.sessions.length,
      failed: settled.filter((row) => row.status === "rejected").length
    };
  }

  return {
    indexKey,
    sessionKey,
    loadIndex,
    loadSession,
    saveSession,
    abandonSession,
    deleteSession,
    linkTrade,
    loadSessionsPage,
    loadAllSessions,
    savePostReview,
    reconcileTradeLinks,
    restoreSessions,
    resetAll
  };
}
