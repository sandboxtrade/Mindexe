// MIND.EXE — journal screenshot persistence store.
// Owns media caches/readiness internally. Firestore/storage/auth/timeout dependencies are injected.

export const JOURNAL_MEDIA_SPLIT_VERSION = 1;
export const JOURNAL_MEDIA_MAX_SHOTS = 4;

export function normalizeJournalMedia(value) {
  const rawEntry = Array.isArray(value)
    ? value
    : Array.isArray(value?.entry)
      ? value.entry
      : [];
  const rawExit = Array.isArray(value?.exit) ? value.exit : [];
  const clean = (arr) => arr
    .filter((v) => typeof v === "string" && v.startsWith("data:image/"))
    .slice(0, JOURNAL_MEDIA_MAX_SHOTS);
  return { entry: clean(rawEntry), exit: clean(rawExit) };
}

export function journalMediaJson(value) {
  return JSON.stringify(normalizeJournalMedia(value));
}

export function parseJournalMediaManifest(value) {
  if (!value) return null;
  try {
    const raw = typeof value === "string" ? JSON.parse(value) : value;
    if (!raw || raw.version !== JOURNAL_MEDIA_SPLIT_VERSION) return null;
    const entryCount = Math.max(0, Math.min(JOURNAL_MEDIA_MAX_SHOTS, Number(raw.entryCount) || 0));
    const exitCount = Math.max(0, Math.min(JOURNAL_MEDIA_MAX_SHOTS, Number(raw.exitCount) || 0));
    const generation = typeof raw.generation === "string" && raw.generation ? raw.generation : null;
    if ((entryCount > 0 || exitCount > 0) && !generation) return null;
    return {
      version: JOURNAL_MEDIA_SPLIT_VERSION,
      generation,
      entryCount,
      exitCount,
      tombstone: raw.tombstone === true || entryCount + exitCount === 0
    };
  } catch (_) {
    return null;
  }
}

export function createJournalMediaStore({
  storageGet,
  storageSet,
  storageDelete,
  isAuthenticated,
  withTimeout,
  mediaBaseKey,
  legacyMapKey,
  logger = console
}) {
  if (typeof storageGet !== "function" || typeof storageSet !== "function" ||
      typeof storageDelete !== "function" || typeof isAuthenticated !== "function" ||
      typeof withTimeout !== "function" || !mediaBaseKey || typeof legacyMapKey !== "function") {
    throw new Error("journal_media_missing_dependency");
  }

  let mediaHashes = {};
  let mediaManifests = {};
  let mediaReadyIds = new Set();
  let mediaFailedIds = new Set();
  let mediaLoaded = false;

  function mediaEntryKey(userId, entryId) {
    return `${mediaBaseKey}:${userId}:${entryId}`;
  }

  function mediaManifestKey(userId, entryId) {
    return `${mediaBaseKey}:${userId}:${entryId}:manifest`;
  }

  function mediaImageKey(userId, entryId, generation, phase, index) {
    return `${mediaBaseKey}:${userId}:${entryId}:g:${generation}:${phase}:${index}`;
  }

  function makeJournalMediaGeneration() {
    return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function resetMediaCache() {
    mediaHashes = {};
    mediaManifests = {};
    mediaReadyIds = new Set();
    mediaFailedIds = new Set();
    mediaLoaded = false;
  }

  function markAllLoaded(value = true) {
    mediaLoaded = value === true;
  }

  function acceptLoadBatch(rows) {
    const batchMedia = {};
    for (const row of rows || []) {
      const id = String(row.id);
      if (row.ready) {
        mediaReadyIds.add(id);
        mediaFailedIds.delete(id);
        if (row.raw != null) mediaHashes[id] = row.raw;
        if (row.manifest) mediaManifests[id] = row.manifest;
        if (row.media) batchMedia[id] = row.media;
      } else {
        mediaFailedIds.add(id);
      }
    }
    return batchMedia;
  }

  function finishLoad(result) {
    mediaLoaded = result?.complete === true;
    for (const id of result?.failedIds || []) mediaFailedIds.add(String(id));
    return mediaLoaded;
  }

  function debugState() {
    return {
      loaded: mediaLoaded,
      readyIds: [...mediaReadyIds],
      failedIds: [...mediaFailedIds],
      hashes: { ...mediaHashes },
      manifests: { ...mediaManifests }
    };
  }

  async function readSplitJournalMedia(userId, entryId, manifest) {
    if (!manifest) return null;
    if (manifest.entryCount === 0 && manifest.exitCount === 0) {
      return { media: { entry: [], exit: [] }, complete: true };
    }
    const readPhase = async (phase, count) => {
      const rows = await Promise.all(
        Array.from({ length: count }, (_, i) => (
          storageGet(mediaImageKey(userId, entryId, manifest.generation, phase, i), false)
            .then((r) => r?.value || null)
            .catch(() => null)
        ))
      );
      const complete = rows.every((v) => typeof v === "string" && v.startsWith("data:image/"));
      return { values: complete ? rows : [], complete };
    };
    const [entry, exit] = await Promise.all([
      readPhase("entry", manifest.entryCount),
      readPhase("exit", manifest.exitCount)
    ]);
    if (!entry.complete || !exit.complete) return { media: null, complete: false };
    return { media: { entry: entry.values, exit: exit.values }, complete: true };
  }

  async function loadMedia(userId, entryIds = [], options = {}) {
    if (!isAuthenticated() || !userId) {
      return { map: null, raw: {}, manifests: {}, readyIds: [], failedIds: [], complete: false };
    }

    const concurrency = Math.max(1, Math.min(5, Number(options.concurrency) || 3));
    const batchSize = Math.max(1, Math.min(10, Number(options.batchSize) || 4));
    const onBatch = typeof options.onBatch === "function" ? options.onBatch : null;
    const ids = [...new Set((entryIds || []).filter(Boolean).map((id) => String(id)))];

    let legacyMap = {};
    try {
      const legacy = await withTimeout(storageGet(legacyMapKey(userId), false), 12e3, "legacy_media_map_timeout");
      if (legacy?.value) {
        const parsed = JSON.parse(legacy.value);
        if (parsed && typeof parsed === "object") legacyMap = parsed;
      }
    } catch (e) {
      logger.warn("mind.exe: legacy media map unavailable", e);
    }

    const loadOne = async (id) => {
      try {
        const manifestRes = await storageGet(mediaManifestKey(userId, id), false);
        const manifest = parseJournalMediaManifest(manifestRes?.value || null);
        if (manifest) {
          const split = await readSplitJournalMedia(userId, id, manifest);
          if (split?.complete && split.media) {
            const normalized = normalizeJournalMedia(split.media);
            return { id, media: normalized, raw: journalMediaJson(normalized), manifest };
          }
          logger.warn("mind.exe: journal media split generation incomplete; using legacy fallback if available", id);
        }
      } catch (_) {
      }

      try {
        const perEntry = await storageGet(mediaEntryKey(userId, id), false);
        if (perEntry?.value) {
          const normalized = normalizeJournalMedia(JSON.parse(perEntry.value));
          return { id, media: normalized, raw: journalMediaJson(normalized), manifest: null };
        }
      } catch (_) {
      }

      if (Object.prototype.hasOwnProperty.call(legacyMap, id)) {
        const normalized = normalizeJournalMedia(legacyMap[id]);
        return { id, media: normalized, raw: journalMediaJson(normalized), manifest: null };
      }

      const empty = { entry: [], exit: [] };
      return { id, media: empty, raw: journalMediaJson(empty), manifest: null };
    };

    const map = {};
    const raw = {};
    const manifests = {};
    const readyIds = [];
    const failedIds = [];
    let cursor = 0;
    let pendingBatch = [];

    const flushBatch = async () => {
      if (!pendingBatch.length) return;
      const rows = pendingBatch;
      pendingBatch = [];
      if (onBatch) await onBatch(rows);
    };

    const worker = async () => {
      while (true) {
        const idx = cursor++;
        if (idx >= ids.length) return;
        const id = ids[idx];
        try {
          const row = await withTimeout(loadOne(id), 14e3, `journal_media_entry_timeout:${id}`);
          readyIds.push(id);
          map[id] = row.media;
          raw[id] = row.raw;
          if (row.manifest) manifests[id] = row.manifest;
          pendingBatch.push({ ...row, ready: true });
        } catch (e) {
          failedIds.push(id);
          pendingBatch.push({
            id,
            media: null,
            raw: null,
            manifest: null,
            ready: false,
            error: e?.message || String(e)
          });
          logger.warn("mind.exe: journal media entry load failed", id, e);
        }
        if (pendingBatch.length >= batchSize) await flushBatch();
      }
    };

    await Promise.all(Array.from({ length: Math.min(concurrency, ids.length || 1) }, () => worker()));
    await flushBatch();

    return { map, raw, manifests, readyIds, failedIds, complete: failedIds.length === 0 };
  }

  async function deleteJournalMediaGeneration(userId, entryId, manifest) {
    if (!manifest?.generation) return;
    const jobs = [];
    for (const phase of ["entry", "exit"]) {
      const count = phase === "entry" ? manifest.entryCount : manifest.exitCount;
      for (let i = 0; i < count; i++) {
        jobs.push(storageDelete(mediaImageKey(userId, entryId, manifest.generation, phase, i), false));
      }
    }
    if (jobs.length) await Promise.allSettled(jobs);
  }

  async function writeJournalMediaSplit(userId, entryId, media) {
    const normalized = normalizeJournalMedia(media);
    const previousManifest = mediaManifests[entryId] || null;
    const generation = normalized.entry.length || normalized.exit.length ? makeJournalMediaGeneration() : null;

    if (generation) {
      const jobs = [];
      normalized.entry.forEach((value, index) => {
        jobs.push(storageSet(mediaImageKey(userId, entryId, generation, "entry", index), value, false));
      });
      normalized.exit.forEach((value, index) => {
        jobs.push(storageSet(mediaImageKey(userId, entryId, generation, "exit", index), value, false));
      });
      await Promise.all(jobs);
    }

    const manifest = {
      version: JOURNAL_MEDIA_SPLIT_VERSION,
      generation,
      entryCount: normalized.entry.length,
      exitCount: normalized.exit.length,
      tombstone: normalized.entry.length + normalized.exit.length === 0
    };
    await storageSet(mediaManifestKey(userId, entryId), JSON.stringify(manifest), false);

    mediaManifests[entryId] = manifest;
    mediaHashes[entryId] = journalMediaJson(normalized);

    await Promise.allSettled([
      previousManifest ? deleteJournalMediaGeneration(userId, entryId, previousManifest) : Promise.resolve(),
      storageDelete(mediaEntryKey(userId, entryId), false)
    ]);
  }

  function assertJournalMediaWriteSafe(mediaMap, existingCloudEntryIds) {
    if (mediaLoaded) return;
    const existing = existingCloudEntryIds instanceof Set ? existingCloudEntryIds : new Set();
    for (const [id, media] of Object.entries(mediaMap || {})) {
      const normalized = normalizeJournalMedia(media);
      if (normalized.entry.length + normalized.exit.length === 0) continue;
      const sid = String(id);
      if (existing.has(sid) && !mediaReadyIds.has(sid)) {
        const err = new Error(mediaFailedIds.has(sid) ? "journal_media_load_failed" : "journal_media_pending_load");
        err.entryId = sid;
        throw err;
      }
    }
  }

  async function saveMedia(userId, mediaMap, options = {}) {
    if (!isAuthenticated() || !userId) return;
    const activeEntryIds = new Set((options.activeEntryIds || []).map((id) => String(id)));
    const existingCloudEntryIds = options.existingCloudEntryIds instanceof Set
      ? options.existingCloudEntryIds
      : new Set((options.existingCloudEntryIds || []).map((id) => String(id)));

    assertJournalMediaWriteSafe(mediaMap, existingCloudEntryIds);
    let firstError = null;

    for (const id of activeEntryIds) {
      const media = Object.prototype.hasOwnProperty.call(mediaMap, id)
        ? normalizeJournalMedia(mediaMap[id])
        : { entry: [], exit: [] };
      const json = journalMediaJson(media);
      const hadKnownMedia = Object.prototype.hasOwnProperty.call(mediaHashes, id)
        || Object.prototype.hasOwnProperty.call(mediaManifests, id);

      if (!hadKnownMedia && media.entry.length + media.exit.length === 0) continue;
      if (mediaHashes[id] === json) continue;

      try {
        await writeJournalMediaSplit(userId, id, media);
      } catch (e) {
        logger.warn("mind.exe: could not save split screenshots for entry", id, e);
        if (!firstError) firstError = e;
      }
    }

    if (mediaLoaded) {
      const knownIds = new Set([...Object.keys(mediaHashes), ...Object.keys(mediaManifests)]);
      for (const id of knownIds) {
        if (activeEntryIds.has(String(id))) continue;
        const manifest = mediaManifests[id] || null;
        try {
          if (manifest) await deleteJournalMediaGeneration(userId, id, manifest);
          await Promise.allSettled([
            storageDelete(mediaManifestKey(userId, id), false),
            storageDelete(mediaEntryKey(userId, id), false)
          ]);
          delete mediaHashes[id];
          delete mediaManifests[id];
        } catch (e) {
          logger.warn("mind.exe: could not clean removed entry screenshots", id, e);
          if (!firstError) firstError = e;
        }
      }
    }

    if (firstError) throw firstError;
  }

  return {
    reset: resetMediaCache,
    markAllLoaded,
    acceptLoadBatch,
    finishLoad,
    load: loadMedia,
    save: saveMedia,
    assertWriteSafe: assertJournalMediaWriteSafe,
    debugState,
    keys: {
      entry: mediaEntryKey,
      manifest: mediaManifestKey,
      image: mediaImageKey
    }
  };
}
