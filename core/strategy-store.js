// MIND.EXE — revisioned Strategy Lab persistence.
// Strategy index uses immutable revisions + transactional CAS.
// Direct Strategy Lab trade documents keep their historical key, but updates use per-trade CAS.

export const STRATEGY_STORE_VERSION = 1;
export const STRATEGY_HISTORY_LIMIT = 5;

function parseJson(value, code) {
  try {
    return JSON.parse(value);
  } catch (_) {
    throw new Error(code);
  }
}

function makeRevisionId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createStrategyStore({
  storageGet,
  storageSet,
  storageDelete,
  getDocRef,
  runTransaction,
  db,
  indexBaseKey,
  tradeBaseKey,
  indexSchemaVersion,
  now = () => Date.now(),
  revisionIdFactory = makeRevisionId,
  logger = console
}) {
  if (typeof storageGet !== "function" || typeof storageSet !== "function" ||
      typeof storageDelete !== "function" || typeof getDocRef !== "function" ||
      typeof runTransaction !== "function" || !db || !indexBaseKey || !tradeBaseKey) {
    throw new Error("strategy_store_missing_dependency");
  }

  let expectedActiveRevision = null;
  let expectedSequence = 0;
  let manifestSeen = false;
  let lastManifest = null;

  const legacyIndexKey = (uid) => `${indexBaseKey}:${uid}`;
  const legacyBackupKey = (uid) => `${indexBaseKey}:backup:${uid}`;
  const manifestKey = (uid) => `${indexBaseKey}:split:${uid}:manifest`;
  const revisionKey = (uid, rev) => `${indexBaseKey}:split:${uid}:rev:${rev}`;
  const tradeKey = (uid, tradeId) => `${tradeBaseKey}:${uid}:${tradeId}`;

  function reset() {
    expectedActiveRevision = null;
    expectedSequence = 0;
    manifestSeen = false;
    lastManifest = null;
  }

  function normalizeIndexPayload(payload) {
    return {
      version: indexSchemaVersion,
      strategies: Array.isArray(payload?.strategies) ? payload.strategies : []
    };
  }

  function parseManifest(value) {
    const raw = parseJson(value, "strategy_manifest_unreadable");
    if (!raw || raw.version !== STRATEGY_STORE_VERSION ||
        typeof raw.activeRevision !== "string" || !raw.activeRevision) {
      throw new Error("strategy_manifest_unreadable");
    }
    return {
      version: STRATEGY_STORE_VERSION,
      activeRevision: raw.activeRevision,
      history: Array.isArray(raw.history)
        ? [...new Set(raw.history.filter((id) => typeof id === "string" && id && id !== raw.activeRevision))]
            .slice(0, STRATEGY_HISTORY_LIMIT)
        : [],
      sequence: Number.isFinite(Number(raw.sequence)) ? Number(raw.sequence) : 0,
      updatedAt: raw.updatedAt || null
    };
  }

  async function loadRevision(uid, rev) {
    const res = await storageGet(revisionKey(uid, rev), false);
    if (!res?.value) throw new Error("strategy_revision_missing");
    const raw = parseJson(res.value, "strategy_revision_unreadable");
    if (!raw || raw.storeVersion !== STRATEGY_STORE_VERSION || raw.revisionId !== rev || !raw.payload) {
      throw new Error("strategy_revision_unreadable");
    }
    return {
      payload: normalizeIndexPayload(raw.payload),
      createdAt: raw.createdAt || null
    };
  }

  async function readLegacyCandidate(key, source) {
    try {
      const res = await storageGet(key, false);
      if (!res?.value) return null;
      const raw = parseJson(res.value, "strategy_index_unreadable");
      if (!raw || typeof raw !== "object") return null;
      return {
        payload: normalizeIndexPayload(raw),
        source,
        updatedAt: res.updatedAt || null
      };
    } catch (_) {
      return null;
    }
  }

  async function loadIndex(uid) {
    const manifestRes = await storageGet(manifestKey(uid), false);
    if (manifestRes?.value) {
      const manifest = parseManifest(manifestRes.value);
      manifestSeen = true;
      lastManifest = manifest;
      expectedActiveRevision = manifest.activeRevision;
      expectedSequence = manifest.sequence;

      const candidates = [manifest.activeRevision, ...manifest.history];
      const errors = [];
      for (let i = 0; i < candidates.length; i++) {
        try {
          const loaded = await loadRevision(uid, candidates[i]);
          return {
            payload: loaded.payload,
            source: i === 0 ? "active" : "history",
            loadedRevision: candidates[i],
            loadedRevisionAt: loaded.createdAt,
            manifest,
            errors
          };
        } catch (e) {
          errors.push({ revisionId: candidates[i], error: e?.message || String(e) });
        }
      }

      // A broken split store may still be recovered from the untouched pre-split index/backup.
      const legacy = await readLegacyCandidate(legacyIndexKey(uid), "legacy");
      if (legacy) return { ...legacy, manifest, errors };
      const backup = await readLegacyCandidate(legacyBackupKey(uid), "backup");
      if (backup) return { ...backup, manifest, errors };

      return { payload: null, source: "broken", manifest, errors };
    }

    reset();
    const legacy = await readLegacyCandidate(legacyIndexKey(uid), "legacy");
    if (legacy) return legacy;
    const backup = await readLegacyCandidate(legacyBackupKey(uid), "backup");
    if (backup) return backup;
    return {
      payload: { version: indexSchemaVersion, strategies: [] },
      source: "empty",
      updatedAt: null
    };
  }

  async function cleanupRevision(uid, rev) {
    if (!rev) return;
    try {
      await storageDelete(revisionKey(uid, rev), false);
    } catch (_) {
    }
  }

  async function saveIndex(uid, payload, options = {}) {
    const normalized = normalizeIndexPayload(payload);
    const baseRevision = expectedActiveRevision;
    const baseSequence = expectedSequence;
    const revisionId = revisionIdFactory();
    const savedAt = new Date(now()).toISOString();
    const revisionDoc = {
      storeVersion: STRATEGY_STORE_VERSION,
      revisionId,
      schemaVersion: indexSchemaVersion,
      createdAt: savedAt,
      payload: normalized
    };

    await storageSet(revisionKey(uid, revisionId), JSON.stringify(revisionDoc), false);

    const manifestRef = getDocRef(manifestKey(uid), false);
    if (!manifestRef) {
      await cleanupRevision(uid, revisionId);
      throw new Error("strategy_auth_uid_mismatch");
    }

    let committed = null;
    let dropped = [];
    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(manifestRef);
        let current = null;
        if (snap.exists()) current = parseManifest(snap.data().value);

        const currentActive = current?.activeRevision || null;
        const currentSequence = current?.sequence || 0;
        if (currentActive !== baseRevision || currentSequence !== baseSequence) {
          throw new Error("strategy_revision_conflict");
        }

        const oldRevisions = current
          ? [current.activeRevision, ...(current.history || [])].filter(Boolean)
          : [];
        const history = options.clearHistory
          ? []
          : [...new Set(oldRevisions.filter((id) => id !== revisionId))].slice(0, STRATEGY_HISTORY_LIMIT);
        dropped = options.clearHistory
          ? [...new Set(oldRevisions)]
          : [...new Set(oldRevisions)].filter((id) => !history.includes(id));

        committed = {
          version: STRATEGY_STORE_VERSION,
          activeRevision: revisionId,
          history,
          sequence: baseSequence + 1,
          updatedAt: savedAt
        };
        tx.set(manifestRef, {
          value: JSON.stringify(committed),
          updatedAt: now()
        });
      });
    } catch (e) {
      await cleanupRevision(uid, revisionId);
      throw e;
    }

    expectedActiveRevision = revisionId;
    expectedSequence = committed.sequence;
    manifestSeen = true;
    lastManifest = committed;

    for (const oldRev of dropped) cleanupRevision(uid, oldRev).catch(() => {});

    // Once split storage exists, legacy index/backup are compatibility fallbacks only.
    return {
      payload: normalized,
      revisionId,
      sequence: committed.sequence,
      manifest: committed
    };
  }

  async function resetIndex(uid) {
    const empty = { version: indexSchemaVersion, strategies: [] };
    const revisionId = revisionIdFactory();
    const savedAt = new Date(now()).toISOString();
    const revisionDoc = {
      storeVersion: STRATEGY_STORE_VERSION,
      revisionId,
      schemaVersion: indexSchemaVersion,
      createdAt: savedAt,
      payload: empty
    };
    await storageSet(revisionKey(uid, revisionId), JSON.stringify(revisionDoc), false);

    const manifestRef = getDocRef(manifestKey(uid), false);
    if (!manifestRef) {
      await cleanupRevision(uid, revisionId);
      throw new Error("strategy_auth_uid_mismatch");
    }

    let oldRevisions = [];
    let committed = null;
    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(manifestRef);
        let current = null;
        if (snap.exists()) current = parseManifest(snap.data().value);
        oldRevisions = current
          ? [current.activeRevision, ...(current.history || [])].filter(Boolean)
          : [];
        committed = {
          version: STRATEGY_STORE_VERSION,
          activeRevision: revisionId,
          history: [],
          sequence: (current?.sequence || 0) + 1,
          updatedAt: savedAt,
          resetAt: savedAt
        };
        tx.set(manifestRef, {
          value: JSON.stringify(committed),
          updatedAt: now()
        });
      });
    } catch (e) {
      await cleanupRevision(uid, revisionId);
      throw e;
    }

    expectedActiveRevision = revisionId;
    expectedSequence = committed.sequence;
    manifestSeen = true;
    lastManifest = committed;

    await Promise.allSettled([
      ...oldRevisions.map((rev) => cleanupRevision(uid, rev)),
      storageDelete(legacyIndexKey(uid), false),
      storageDelete(legacyBackupKey(uid), false)
    ]);

    return { payload: empty, revisionId, sequence: committed.sequence, manifest: committed };
  }

  async function saveTrade(uid, tradeRecord, options = {}) {
    if (!tradeRecord?.id) throw new Error("strategy_trade_invalid");
    const ref = getDocRef(tradeKey(uid, tradeRecord.id), false);
    if (!ref) throw new Error("strategy_auth_uid_mismatch");

    const createOnly = options.createOnly === true;
    const upsert = options.upsert === true;
    const expectedRevision = createOnly
      ? null
      : Number.isFinite(Number(options.expectedRevision))
        ? Number(options.expectedRevision)
        : Number.isFinite(Number(tradeRecord.persistenceRevision))
          ? Number(tradeRecord.persistenceRevision)
          : 0;

    let committedRecord = null;
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      const exists = snap.exists();
      let existing = null;
      if (exists) {
        existing = parseJson(snap.data().value, "strategy_trade_unreadable");
      }
      const currentRevision = exists && Number.isFinite(Number(existing?.persistenceRevision))
        ? Number(existing.persistenceRevision)
        : exists ? 0 : null;

      if (createOnly) {
        if (exists) throw new Error("strategy_trade_exists");
      } else if (upsert) {
        if (exists && currentRevision !== expectedRevision) {
          throw new Error("strategy_trade_revision_conflict");
        }
      } else if (!exists || currentRevision !== expectedRevision) {
        throw new Error("strategy_trade_revision_conflict");
      }

      const nextRevision = (currentRevision == null ? 0 : currentRevision) + 1;
      committedRecord = {
        ...tradeRecord,
        persistenceRevision: nextRevision,
        persistenceUpdatedAt: new Date(now()).toISOString()
      };
      tx.set(ref, {
        value: JSON.stringify(committedRecord),
        updatedAt: now()
      });
    });
    return committedRecord;
  }

  async function deleteTrade(uid, tradeId) {
    await storageDelete(tradeKey(uid, tradeId), false);
  }

  return {
    reset,
    loadIndex,
    saveIndex,
    resetIndex,
    saveTrade,
    deleteTrade,
    getState: () => ({
      expectedActiveRevision,
      expectedSequence,
      manifestSeen,
      manifest: lastManifest ? { ...lastManifest, history: [...lastManifest.history] } : null
    }),
    keys: {
      legacy: legacyIndexKey,
      backup: legacyBackupKey,
      manifest: manifestKey,
      revision: revisionKey,
      trade: tradeKey
    },
    _test: { parseManifest, normalizeIndexPayload }
  };
}
