// MIND.EXE — local Decision Lab draft cache.
// Stores text/state only; never stores audio blobs. Used to keep edits responsive and recoverable
// while Firestore sync happens in the background.

import { normalizeDecisionSession } from "./decision-model.js";

const MEMORY = new Map();
const PREFIX = "mind-exe-decision-draft-cache";
const MANIFEST_SUFFIX = ":manifest";

function safeStorage(storage) {
  try {
    if (!storage) return null;
    const key = `${PREFIX}:probe`;
    storage.setItem(key, "1");
    storage.removeItem(key);
    return storage;
  } catch (_) {
    return null;
  }
}

export function createDecisionDraftCache(storageImpl = globalThis.localStorage) {
  const storage = safeStorage(storageImpl);
  const keyFor = (uid, id) => `${PREFIX}:${String(uid || "")}:${String(id || "")}`;
  const manifestKey = (uid) => `${PREFIX}:${String(uid || "")}${MANIFEST_SUFFIX}`;

  function readManifest(uid) {
    const key = manifestKey(uid);
    try {
      const raw = storage ? storage.getItem(key) : MEMORY.get(key);
      const ids = raw ? JSON.parse(raw) : [];
      return Array.isArray(ids) ? ids.map(String).filter(Boolean) : [];
    } catch (_) {
      return [];
    }
  }

  function writeManifest(uid, ids) {
    const key = manifestKey(uid);
    const value = JSON.stringify([...new Set(ids.map(String).filter(Boolean))].slice(-64));
    try {
      if (storage) storage.setItem(key, value);
      else MEMORY.set(key, value);
    } catch (_) {
    }
  }

  function save(uid, session, baseRevision = null) {
    const normalized = normalizeDecisionSession(session);
    if (!uid || !normalized?.id || normalized.status !== "draft") return null;
    const record = {
      version: 1,
      baseRevision: baseRevision == null ? normalized.persistenceRevision : Math.max(0, Number(baseRevision) || 0),
      savedAt: Date.now(),
      session: normalized
    };
    const key = keyFor(uid, normalized.id);
    const value = JSON.stringify(record);
    try {
      if (storage) storage.setItem(key, value);
      else MEMORY.set(key, value);
      const ids = readManifest(uid).filter((id) => id !== normalized.id);
      ids.push(normalized.id);
      writeManifest(uid, ids);
    } catch (_) {
      return null;
    }
    return record;
  }

  function load(uid, id) {
    if (!uid || !id) return null;
    const key = keyFor(uid, id);
    try {
      const raw = storage ? storage.getItem(key) : MEMORY.get(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const session = normalizeDecisionSession(parsed?.session);
      if (!session || session.id !== String(id) || session.status !== "draft") return null;
      return {
        version: 1,
        baseRevision: Math.max(0, Number(parsed?.baseRevision) || 0),
        savedAt: Number(parsed?.savedAt) || 0,
        session
      };
    } catch (_) {
      return null;
    }
  }

  function remove(uid, id) {
    if (!uid || !id) return;
    const key = keyFor(uid, id);
    try {
      if (storage) storage.removeItem(key);
      else MEMORY.delete(key);
    } catch (_) {
    }
    writeManifest(uid, readManifest(uid).filter((row) => row !== String(id)));
  }

  function list(uid) {
    return readManifest(uid).map((id) => load(uid, id)).filter(Boolean).sort((a, b) => b.savedAt - a.savedAt);
  }

  function clearUser(uid) {
    const ids = readManifest(uid);
    for (const id of ids) remove(uid, id);
    try {
      if (storage) storage.removeItem(manifestKey(uid));
      else MEMORY.delete(manifestKey(uid));
    } catch (_) {
    }
  }

  return { save, load, remove, list, clearUser };
}
