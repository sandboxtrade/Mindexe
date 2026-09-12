// MIND.EXE — revisioned/chunked profile persistence.
// The public profile shape remains unchanged; only the Firestore storage layout changes.
//
// Safety model:
// 1) write immutable revision docs first;
// 2) atomically activate the revision through a tiny manifest transaction;
// 3) compare the manifest's active revision with the revision observed on load;
// 4) a stale/late writer therefore cannot overwrite a newer committed revision.

export const PROFILE_STORE_VERSION = 1;
export const PROFILE_CHUNK_TARGET_BYTES = 420 * 1024;
export const PROFILE_CORE_MAX_BYTES = 640 * 1024;
export const PROFILE_ITEM_MAX_BYTES = 700 * 1024;
export const PROFILE_HISTORY_LIMIT = 5;

function byteLength(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  if (typeof TextEncoder !== "undefined") return new TextEncoder().encode(text).length;
  return unescape(encodeURIComponent(text)).length;
}

function makeRevisionId() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function parseJson(value, errorCode) {
  try {
    return JSON.parse(value);
  } catch (_) {
    throw new Error(errorCode);
  }
}

export function createProfileStore({
  storageGet,
  storageSet,
  storageDelete,
  getDocRef,
  runTransaction,
  db,
  profileBaseKey,
  schemaVersion,
  now = () => Date.now(),
  revisionIdFactory = makeRevisionId,
  logger = console
}) {
  if (typeof storageGet !== "function" || typeof storageSet !== "function" ||
      typeof storageDelete !== "function" || typeof getDocRef !== "function" ||
      typeof runTransaction !== "function" || !db || !profileBaseKey) {
    throw new Error("profile_store_missing_dependency");
  }

  let expectedActiveRevision = null;
  let expectedSequence = 0;
  let manifestSeen = false;
  let lastManifest = null;
  let lastResetState = null;

  const manifestKey = (userId) => `${profileBaseKey}:split:${userId}:manifest`;
  const revisionCoreKey = (userId, revisionId) => `${profileBaseKey}:split:${userId}:rev:${revisionId}:core`;
  const journalChunkKey = (userId, revisionId, index) => `${profileBaseKey}:split:${userId}:rev:${revisionId}:journal:${index}`;
  const ledgerChunkKey = (userId, revisionId, index) => `${profileBaseKey}:split:${userId}:rev:${revisionId}:ledger:${index}`;

  const resetStateKey = (userId) => `${profileBaseKey}:split:${userId}:reset`;

  const isoMs = (value) => {
    if (!value) return 0;
    const n = typeof value === "number" ? value : Date.parse(value);
    return Number.isFinite(n) ? n : 0;
  };

  const laterIso = (a, b) => {
    const am = isoMs(a), bm = isoMs(b);
    if (!am) return b || null;
    if (!bm) return a || null;
    return bm > am ? b : a;
  };

  const parseResetState = (value) => {
    if (!value) return null;
    const raw = parseJson(value, "profile_reset_state_unreadable");
    if (!raw || raw.version !== PROFILE_STORE_VERSION) {
      throw new Error("profile_reset_state_unreadable");
    }
    return {
      version: PROFILE_STORE_VERSION,
      journalResetAt: raw.journalResetAt || null,
      fullResetAt: raw.fullResetAt || null,
      updatedAt: raw.updatedAt || raw.fullResetAt || raw.journalResetAt || null
    };
  };

  function reset() {
    expectedActiveRevision = null;
    expectedSequence = 0;
    manifestSeen = false;
    lastManifest = null;
    lastResetState = null;
  }

  function parseManifest(value) {
    if (!value) return null;
    const raw = parseJson(value, "profile_manifest_unreadable");
    if (!raw || raw.version !== PROFILE_STORE_VERSION || typeof raw.activeRevision !== "string" || !raw.activeRevision) {
      throw new Error("profile_manifest_unreadable");
    }
    return {
      version: PROFILE_STORE_VERSION,
      activeRevision: raw.activeRevision,
      history: Array.isArray(raw.history)
        ? [...new Set(raw.history.filter((v) => typeof v === "string" && v && v !== raw.activeRevision))].slice(0, PROFILE_HISTORY_LIMIT)
        : [],
      sequence: Number.isFinite(Number(raw.sequence)) ? Number(raw.sequence) : 0,
      updatedAt: raw.updatedAt || null,
      journalResetAt: raw.journalResetAt || null,
      fullResetAt: raw.fullResetAt || null
    };
  }

  function packItems(items, kind) {
    const chunks = [];
    let current = [];
    let currentBytes = 2;

    for (const item of items || []) {
      const itemBytes = byteLength(item) + 2;
      if (itemBytes > PROFILE_ITEM_MAX_BYTES) {
        const err = new Error("profile_item_too_large");
        err.kind = kind;
        throw err;
      }

      const shouldFlush = current.length > 0 &&
        (currentBytes + itemBytes > PROFILE_CHUNK_TARGET_BYTES || current.length >= 100);

      if (shouldFlush) {
        chunks.push(current);
        current = [];
        currentBytes = 2;
      }

      current.push(item);
      currentBytes += itemBytes;
    }

    if (current.length) chunks.push(current);
    return chunks;
  }

  function buildRevision(profile, revisionId, savedAt, sequence) {
    const normalized = {
      ...profile,
      version: schemaVersion,
      meta: {
        ...(profile?.meta || {}),
        updatedAt: savedAt,
        persistence: {
          ...(profile?.meta?.persistence || {}),
          revisionId,
          sequence,
          savedAt
        }
      }
    };
    const journal = normalized.journal && typeof normalized.journal === "object" ? normalized.journal : {};
    const wallet = normalized.wallet && typeof normalized.wallet === "object" ? normalized.wallet : {};
    const entries = Array.isArray(journal.entries) ? journal.entries : [];
    const ledger = Array.isArray(wallet.coinLedger) ? wallet.coinLedger : [];

    const journalChunks = packItems(entries, "journal");
    const ledgerChunks = packItems(ledger, "coinLedger");

    const coreProfile = {
      ...normalized,
      journal: { ...journal, entries: [] },
      wallet: { ...wallet, coinLedger: [] }
    };

    const core = {
      version: PROFILE_STORE_VERSION,
      revisionId,
      schemaVersion,
      createdAt: new Date(now()).toISOString(),
      journalChunkCount: journalChunks.length,
      ledgerChunkCount: ledgerChunks.length,
      entryCount: entries.length,
      ledgerCount: ledger.length,
      profile: coreProfile
    };

    if (byteLength(core) > PROFILE_CORE_MAX_BYTES) {
      throw new Error("profile_core_too_large");
    }

    return { core, journalChunks, ledgerChunks };
  }

  async function writeRevision(userId, revisionId, profile, savedAt, sequence) {
    const built = buildRevision(profile, revisionId, savedAt, sequence);
    const writtenKeys = [];

    const write = async (key, value) => {
      await storageSet(key, JSON.stringify(value), false);
      writtenKeys.push(key);
    };

    await write(revisionCoreKey(userId, revisionId), built.core);

    for (let i = 0; i < built.journalChunks.length; i++) {
      await write(journalChunkKey(userId, revisionId, i), {
        version: PROFILE_STORE_VERSION,
        revisionId,
        kind: "journal",
        index: i,
        items: built.journalChunks[i]
      });
    }

    for (let i = 0; i < built.ledgerChunks.length; i++) {
      await write(ledgerChunkKey(userId, revisionId, i), {
        version: PROFILE_STORE_VERSION,
        revisionId,
        kind: "ledger",
        index: i,
        items: built.ledgerChunks[i]
      });
    }

    return { ...built, writtenKeys };
  }

  async function loadChunk(key, revisionId, kind, index) {
    const res = await storageGet(key, false);
    if (!res?.value) throw new Error("profile_revision_incomplete");
    const raw = parseJson(res.value, "profile_revision_unreadable");
    if (!raw || raw.version !== PROFILE_STORE_VERSION || raw.revisionId !== revisionId ||
        raw.kind !== kind || Number(raw.index) !== index || !Array.isArray(raw.items)) {
      throw new Error("profile_revision_unreadable");
    }
    return raw.items;
  }

  async function loadRevision(userId, revisionId) {
    const coreRes = await storageGet(revisionCoreKey(userId, revisionId), false);
    if (!coreRes?.value) throw new Error("profile_revision_incomplete");

    const core = parseJson(coreRes.value, "profile_revision_unreadable");
    if (!core || core.version !== PROFILE_STORE_VERSION || core.revisionId !== revisionId ||
        !core.profile || typeof core.profile !== "object") {
      throw new Error("profile_revision_unreadable");
    }

    const journalCount = Math.max(0, Number(core.journalChunkCount) || 0);
    const ledgerCount = Math.max(0, Number(core.ledgerChunkCount) || 0);
    const entries = [];
    const ledger = [];

    for (let i = 0; i < journalCount; i++) {
      entries.push(...await loadChunk(journalChunkKey(userId, revisionId, i), revisionId, "journal", i));
    }
    for (let i = 0; i < ledgerCount; i++) {
      ledger.push(...await loadChunk(ledgerChunkKey(userId, revisionId, i), revisionId, "ledger", i));
    }

    if (Number.isFinite(Number(core.entryCount)) && entries.length !== Number(core.entryCount)) {
      throw new Error("profile_revision_incomplete");
    }
    if (Number.isFinite(Number(core.ledgerCount)) && ledger.length !== Number(core.ledgerCount)) {
      throw new Error("profile_revision_incomplete");
    }

    const profile = {
      ...core.profile,
      version: schemaVersion,
      journal: { ...(core.profile.journal || {}), entries },
      wallet: { ...(core.profile.wallet || {}), coinLedger: ledger }
    };

    return { profile, core };
  }

  async function load(userId) {
    const resetRes = await storageGet(resetStateKey(userId), false);
    const resetState = resetRes?.value ? parseResetState(resetRes.value) : null;

    const manifestRes = await storageGet(manifestKey(userId), false);
    if (!manifestRes?.value) {
      reset();
      lastResetState = resetState;
      return {
        profile: null,
        manifestExists: false,
        source: null,
        activeRevision: null,
        resetState
      };
    }

    const manifest = parseManifest(manifestRes.value);
    manifestSeen = true;
    lastManifest = manifest;
    expectedActiveRevision = manifest.activeRevision;
    expectedSequence = manifest.sequence;
    lastResetState = resetState || {
      version: PROFILE_STORE_VERSION,
      journalResetAt: manifest.journalResetAt || null,
      fullResetAt: manifest.fullResetAt || null,
      updatedAt: manifest.updatedAt || null
    };

    const candidates = [manifest.activeRevision, ...manifest.history];
    const errors = [];

    for (let i = 0; i < candidates.length; i++) {
      const revisionId = candidates[i];
      try {
        const loaded = await loadRevision(userId, revisionId);
        return {
          profile: loaded.profile,
          manifestExists: true,
          source: i === 0 ? "active" : "history",
          activeRevision: manifest.activeRevision,
          loadedRevision: revisionId,
          loadedRevisionAt: loaded.core?.createdAt || null,
          sequence: manifest.sequence,
          resetState: lastResetState,
          errors
        };
      } catch (e) {
        errors.push({ revisionId, error: e?.message || String(e) });
      }
    }

    return {
      profile: null,
      manifestExists: true,
      source: "broken",
      activeRevision: manifest.activeRevision,
      loadedRevision: null,
      sequence: manifest.sequence,
      resetState: lastResetState,
      errors
    };
  }

  async function cleanupRevision(userId, revisionId) {
    if (!revisionId) return;
    try {
      const coreRes = await storageGet(revisionCoreKey(userId, revisionId), false);
      if (!coreRes?.value) return;
      const core = parseJson(coreRes.value, "profile_revision_unreadable");
      const jobs = [storageDelete(revisionCoreKey(userId, revisionId), false)];
      const journalCount = Math.max(0, Number(core.journalChunkCount) || 0);
      const ledgerCount = Math.max(0, Number(core.ledgerChunkCount) || 0);
      for (let i = 0; i < journalCount; i++) jobs.push(storageDelete(journalChunkKey(userId, revisionId, i), false));
      for (let i = 0; i < ledgerCount; i++) jobs.push(storageDelete(ledgerChunkKey(userId, revisionId, i), false));
      await Promise.allSettled(jobs);
    } catch (_) {
    }
  }

  async function save(userId, profile) {
    const baseRevision = expectedActiveRevision;
    const baseSequence = expectedSequence;
    const revisionId = revisionIdFactory();
    const savedAt = new Date(now()).toISOString();
    const proposedSequence = baseSequence + 1;
    const built = await writeRevision(userId, revisionId, profile, savedAt, proposedSequence);
    const manifestRef = getDocRef(manifestKey(userId), false);
    const resetRef = getDocRef(resetStateKey(userId), false);
    if (!manifestRef || !resetRef) {
      await cleanupRevision(userId, revisionId);
      throw new Error("profile_auth_uid_mismatch");
    }

    let committedManifest = null;
    let committedResetState = lastResetState ? { ...lastResetState } : null;
    let droppedHistory = [];

    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(manifestRef);
        let current = null;
        if (snap.exists()) {
          current = parseManifest(snap.data().value);
        }

        const currentActive = current?.activeRevision || null;
        const currentSequence = current?.sequence || 0;
        if (currentActive !== baseRevision || currentSequence !== baseSequence) {
          throw new Error("profile_revision_conflict");
        }

        const allHistory = current
          ? [current.activeRevision, ...(current.history || [])].filter(Boolean)
          : [];
        const history = [...new Set(allHistory.filter((id) => id !== revisionId))].slice(0, PROFILE_HISTORY_LIMIT);
        droppedHistory = [...new Set(allHistory)].filter((id) => !history.includes(id));

        const profileMeta = built.core?.profile?.meta || {};
        const nextResetState = {
          version: PROFILE_STORE_VERSION,
          journalResetAt: laterIso(lastResetState?.journalResetAt, profileMeta.journalResetAt),
          fullResetAt: laterIso(lastResetState?.fullResetAt, profileMeta.fullResetAt),
          updatedAt: savedAt
        };

        committedManifest = {
          version: PROFILE_STORE_VERSION,
          activeRevision: revisionId,
          history,
          sequence: proposedSequence,
          updatedAt: savedAt,
          journalResetAt: nextResetState.journalResetAt,
          fullResetAt: nextResetState.fullResetAt
        };

        tx.set(manifestRef, {
          value: JSON.stringify(committedManifest),
          updatedAt: now()
        });

        if (nextResetState.journalResetAt || nextResetState.fullResetAt) {
          tx.set(resetRef, {
            value: JSON.stringify(nextResetState),
            updatedAt: now()
          });
          committedResetState = nextResetState;
        }
      });
    } catch (e) {
      await Promise.allSettled(
        built.writtenKeys.map((key) => storageDelete(key, false))
      );
      throw e;
    }

    expectedActiveRevision = revisionId;
    expectedSequence = committedManifest.sequence;
    manifestSeen = true;
    lastManifest = committedManifest;
    lastResetState = committedResetState;

    // Once the manifest points elsewhere, old revisions are safe to remove.
    // Keep active + the last PROFILE_HISTORY_LIMIT revisions.
    for (const oldRevision of droppedHistory) {
      cleanupRevision(userId, oldRevision).catch(() => {});
    }

    return {
      revisionId,
      sequence: committedManifest.sequence,
      manifest: committedManifest,
      profile: built.core.profile,
      resetState: lastResetState,
      journalChunkCount: built.journalChunks.length,
      ledgerChunkCount: built.ledgerChunks.length
    };
  }

  return {
    reset,
    load,
    save,
    hasManifest: () => manifestSeen,
    getState: () => ({
      expectedActiveRevision,
      expectedSequence,
      manifestSeen,
      resetState: lastResetState ? { ...lastResetState } : null,
      manifest: lastManifest ? { ...lastManifest, history: [...lastManifest.history] } : null
    }),
    keys: {
      manifest: manifestKey,
      reset: resetStateKey,
      core: revisionCoreKey,
      journal: journalChunkKey,
      ledger: ledgerChunkKey
    },
    _test: {
      buildRevision,
      packItems,
      parseManifest,
      parseResetState,
      byteLength
    }
  };
}
