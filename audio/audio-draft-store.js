// MIND.EXE — temporary local audio persistence for Decision Lab.
// Audio stays in IndexedDB only until transcription succeeds; it is not uploaded to Firestore.

const MEMORY = new Map();
const DB_NAME = "mind-exe-decision-audio";
const STORE_NAME = "drafts";
const DB_VERSION = 1;

export function createAudioDraftStore(indexedDBImpl = globalThis.indexedDB) {
  let dbPromise = null;

  function openDb() {
    if (!indexedDBImpl) return Promise.resolve(null);
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDBImpl.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("sessionId", "sessionId", { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("audio_indexeddb_open_failed"));
    }).catch(() => null);
    return dbPromise;
  }

  async function save(record) {
    if (!record?.id || !record?.blob) throw new Error("audio_draft_invalid");
    const clean = {
      id: String(record.id),
      sessionId: String(record.sessionId || ""),
      userId: record.userId == null ? null : String(record.userId),
      blob: record.blob,
      mimeType: String(record.mimeType || record.blob.type || "application/octet-stream"),
      durationMs: Math.max(0, Number(record.durationMs) || 0),
      createdAt: Number(record.createdAt) || Date.now(),
      status: String(record.status || "pending"),
      transcriptText: record.transcriptText == null ? null : String(record.transcriptText).slice(0, 30000),
      updatedAt: Number(record.updatedAt) || Date.now()
    };
    const db = await openDb();
    if (!db) {
      MEMORY.set(clean.id, clean);
      return clean;
    }
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(clean);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("audio_draft_save_failed"));
    });
    return clean;
  }

  async function get(id) {
    const key = String(id || "");
    if (!key) return null;
    const db = await openDb();
    if (!db) return MEMORY.get(key) || null;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error || new Error("audio_draft_read_failed"));
    });
  }

  async function remove(id) {
    const key = String(id || "");
    if (!key) return;
    MEMORY.delete(key);
    const db = await openDb();
    if (!db) return;
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("audio_draft_delete_failed"));
    });
  }

  async function listForSession(sessionId) {
    const sid = String(sessionId || "");
    const db = await openDb();
    if (!db) return [...MEMORY.values()].filter((row) => row.sessionId === sid);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const idx = tx.objectStore(STORE_NAME).index("sessionId");
      const req = idx.getAll(sid);
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => reject(req.error || new Error("audio_draft_list_failed"));
    });
  }

  async function clearForSession(sessionId) {
    const sid = String(sessionId || "");
    if (!sid) return 0;
    let removed = 0;
    for (const [id, row] of [...MEMORY.entries()]) {
      if (row?.sessionId === sid) { MEMORY.delete(id); removed += 1; }
    }
    const db = await openDb();
    if (!db) return removed;
    const rows = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const idx = tx.objectStore(STORE_NAME).index("sessionId");
      const req = idx.getAll(sid);
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => reject(req.error || new Error("audio_draft_list_failed"));
    });
    if (!rows.length) return removed;
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      for (const row of rows) if (row?.id) store.delete(row.id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("audio_draft_clear_failed"));
    });
    return removed + rows.length;
  }

  async function clearSessions(sessionIds = []) {
    let removed = 0;
    for (const sid of [...new Set((Array.isArray(sessionIds) ? sessionIds : []).map(String).filter(Boolean))]) {
      removed += await clearForSession(sid);
    }
    return removed;
  }

  async function clearUser(userId, legacySessionIds = []) {
    const uid = String(userId || "");
    if (!uid) return 0;
    const legacy = new Set((Array.isArray(legacySessionIds) ? legacySessionIds : []).map(String).filter(Boolean));
    let removed = 0;
    for (const [id, row] of [...MEMORY.entries()]) {
      if (row?.userId === uid || (!row?.userId && legacy.has(String(row?.sessionId || "")))) {
        MEMORY.delete(id); removed += 1;
      }
    }
    const db = await openDb();
    if (!db) return removed;
    const rows = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => reject(req.error || new Error("audio_draft_list_failed"));
    });
    const matches = rows.filter((row) => row?.userId === uid || (!row?.userId && legacy.has(String(row?.sessionId || ""))));
    if (!matches.length) return removed;
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      for (const row of matches) if (row?.id) store.delete(row.id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("audio_draft_clear_failed"));
    });
    return removed + matches.length;
  }

  return { save, get, remove, listForSession, clearForSession, clearSessions, clearUser };
}
