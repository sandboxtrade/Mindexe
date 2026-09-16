// MIND.EXE — Decision Lab chart screenshot persistence.
// One screenshot per Decision session. Cloud bytes stay outside the revisioned Decision JSON,
// while IndexedDB keeps an unsynced local draft recoverable on iPhone/PWA.

const MEMORY = new Map();
const DB_NAME = "mind-exe-decision-media";
const STORE_NAME = "media";
const DB_VERSION = 1;

export const DECISION_MEDIA_VERSION = 1;

function cleanDataUrl(value) {
  const text = typeof value === "string" ? value : "";
  return /^data:image\/(?:jpeg|png|webp);base64,/i.test(text) ? text : "";
}

export function normalizeDecisionMedia(raw) {
  if (!raw || typeof raw !== "object") return null;
  const dataUrl = cleanDataUrl(raw.dataUrl || raw.imageDataUrl);
  if (!dataUrl) return null;
  const mimeMatch = /^data:(image\/[a-z0-9.+-]+);base64,/i.exec(dataUrl);
  return {
    version: DECISION_MEDIA_VERSION,
    sessionId: String(raw.sessionId || ""),
    userId: raw.userId == null ? null : String(raw.userId),
    dataUrl,
    mimeType: String(raw.mimeType || mimeMatch?.[1] || "image/jpeg").slice(0, 80),
    width: Math.max(0, Math.round(Number(raw.width) || 0)),
    height: Math.max(0, Math.round(Number(raw.height) || 0)),
    createdAt: Number(raw.createdAt) || Date.now(),
    updatedAt: Number(raw.updatedAt) || Date.now(),
    cloudSynced: raw.cloudSynced === true
  };
}

function parseCloud(value, sessionId, userId) {
  if (!value) return null;
  try {
    const raw = typeof value === "string" ? JSON.parse(value) : value;
    const media = normalizeDecisionMedia({ ...raw, sessionId, userId, cloudSynced: true });
    return media?.sessionId === String(sessionId) ? media : null;
  } catch (_) {
    return null;
  }
}

export function createDecisionMediaStore({
  storageGet,
  storageSet,
  storageDelete,
  baseKey = "mind-exe-decision-media",
  indexedDBImpl = globalThis.indexedDB
} = {}) {
  if (typeof storageGet !== "function" || typeof storageSet !== "function" || typeof storageDelete !== "function") {
    throw new Error("decision_media_missing_dependency");
  }

  let dbPromise = null;
  const recordId = (userId, sessionId) => `${String(userId || "")}:${String(sessionId || "")}`;
  const cloudKey = (userId, sessionId) => `${baseKey}:${userId}:${sessionId}`;

  function openDb() {
    if (!indexedDBImpl) return Promise.resolve(null);
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDBImpl.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("userId", "userId", { unique: false });
          store.createIndex("sessionId", "sessionId", { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("decision_media_indexeddb_open_failed"));
    }).catch(() => null);
    return dbPromise;
  }

  async function saveLocal(userId, sessionId, raw) {
    const media = normalizeDecisionMedia({ ...raw, userId, sessionId });
    if (!media) throw new Error("decision_media_invalid");
    const row = { ...media, id: recordId(userId, sessionId) };
    const db = await openDb();
    if (!db) {
      MEMORY.set(row.id, row);
      return media;
    }
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(row);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("decision_media_local_save_failed"));
    });
    return media;
  }

  async function loadLocal(userId, sessionId) {
    const id = recordId(userId, sessionId);
    const db = await openDb();
    if (!db) return normalizeDecisionMedia(MEMORY.get(id));
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(id);
      req.onsuccess = () => resolve(normalizeDecisionMedia(req.result));
      req.onerror = () => reject(req.error || new Error("decision_media_local_read_failed"));
    });
  }

  async function clearLocal(userId, sessionId) {
    const id = recordId(userId, sessionId);
    MEMORY.delete(id);
    const db = await openDb();
    if (!db) return;
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("decision_media_local_delete_failed"));
    });
  }

  async function saveCloud(userId, sessionId, raw) {
    const media = normalizeDecisionMedia({ ...raw, userId, sessionId, cloudSynced: true });
    if (!userId || !sessionId || !media) throw new Error("decision_media_invalid");
    await storageSet(cloudKey(userId, sessionId), JSON.stringify({
      version: DECISION_MEDIA_VERSION,
      sessionId: String(sessionId),
      dataUrl: media.dataUrl,
      mimeType: media.mimeType,
      width: media.width,
      height: media.height,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt
    }), false);
    const synced = { ...media, cloudSynced: true };
    await saveLocal(userId, sessionId, synced).catch(() => {});
    return synced;
  }

  async function loadCloud(userId, sessionId) {
    if (!userId || !sessionId) return null;
    const res = await storageGet(cloudKey(userId, sessionId), false);
    return parseCloud(res?.value, sessionId, userId);
  }

  async function loadForSession(userId, sessionId) {
    if (!userId || !sessionId) return null;
    const local = await loadLocal(userId, sessionId).catch(() => null);
    let cloud = null;
    try { cloud = await loadCloud(userId, sessionId); } catch (_) {}
    if (local && (!cloud || local.updatedAt > cloud.updatedAt)) return local;
    if (cloud) {
      await saveLocal(userId, sessionId, cloud).catch(() => {});
      return cloud;
    }
    return local;
  }

  async function deleteForSession(userId, sessionId) {
    if (!userId || !sessionId) return;
    const results = await Promise.allSettled([
      storageDelete(cloudKey(userId, sessionId), false),
      clearLocal(userId, sessionId)
    ]);
    const rejected = results.find((row) => row.status === "rejected");
    if (rejected) throw rejected.reason;
  }

  async function exportSessions(userId, sessionIds = []) {
    const out = [];
    for (const sessionId of [...new Set((sessionIds || []).map(String).filter(Boolean))]) {
      const media = await loadForSession(userId, sessionId).catch(() => null);
      if (media) out.push({
        version: DECISION_MEDIA_VERSION,
        sessionId,
        dataUrl: media.dataUrl,
        mimeType: media.mimeType,
        width: media.width,
        height: media.height,
        createdAt: media.createdAt,
        updatedAt: media.updatedAt
      });
    }
    return out;
  }

  async function restoreSessions(userId, rows = []) {
    let restored = 0;
    let failed = 0;
    for (const row of Array.isArray(rows) ? rows : []) {
      const sessionId = String(row?.sessionId || "");
      if (!sessionId) { failed += 1; continue; }
      try {
        await saveCloud(userId, sessionId, row);
        restored += 1;
      } catch (_) {
        failed += 1;
      }
    }
    return { restored, failed };
  }

  async function clearUser(userId, sessionIds = []) {
    let failed = 0;
    for (const sessionId of [...new Set((sessionIds || []).map(String).filter(Boolean))]) {
      try { await deleteForSession(userId, sessionId); } catch (_) { failed += 1; }
    }
    return { failed };
  }

  return {
    saveLocal,
    loadLocal,
    clearLocal,
    saveCloud,
    loadCloud,
    loadForSession,
    deleteForSession,
    exportSessions,
    restoreSessions,
    clearUser
  };
}
