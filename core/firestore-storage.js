// MIND.EXE — low-level Firestore key/value adapter.
// Owns no Firebase singleton: every dependency is injected by app.js.

export function createFirestoreStorage({
  db,
  auth,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  now = () => Date.now()
}) {
  if (!db || !auth || typeof doc !== "function" || typeof getDoc !== "function" ||
      typeof setDoc !== "function" || typeof deleteDoc !== "function") {
    throw new Error("firestore_storage_missing_dependency");
  }

  function sanitizeKey(key) {
    return String(key).replace(/[\/]/g, "_");
  }

  function docRef(key, shared = false) {
    const safeKey = sanitizeKey(key);
    if (shared) return doc(db, "shared", safeKey);
    const uid = auth.currentUser?.uid;
    if (!uid) return null;
    return doc(db, "users", uid, "data", safeKey);
  }

  async function get(key, shared = false) {
    const ref = docRef(key, shared);
    if (!ref) return null;
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() || {};
    return {
      key,
      value: data.value,
      updatedAt: data.updatedAt ?? null,
      shared: !!shared
    };
  }

  async function set(key, value, shared = false) {
    const ref = docRef(key, shared);
    if (!ref) return null;
    await setDoc(ref, { value, updatedAt: now() });
    return { key, value, shared: !!shared };
  }

  async function remove(key, shared = false) {
    const ref = docRef(key, shared);
    if (!ref) return null;
    await deleteDoc(ref);
    return { key, deleted: true, shared: !!shared };
  }

  return { sanitizeKey, docRef, get, set, delete: remove };
}
