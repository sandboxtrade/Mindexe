import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const appPath = path.join(root, "app.js");
const tradeMathPath = path.join(root, "core", "trade-math.js");
const statsPath = path.join(root, "core", "stats.js");
const journalModelPath = path.join(root, "core", "journal-model.js");
const firestoreStoragePath = path.join(root, "core", "firestore-storage.js");
const journalMediaPath = path.join(root, "core", "journal-media.js");
const profileStorePath = path.join(root, "core", "profile-store.js");
const strategyStorePath = path.join(root, "core", "strategy-store.js");
const appConfigPath = path.join(root, "config", "app-config.js");
const stringsPath = path.join(root, "i18n", "strings.js");
const traderAnalyticsPath = path.join(root, "analytics", "trader-analytics.js");
const uiPrimitivesPath = path.join(root, "ui", "primitives.js");
const calibrationReviewPath = path.join(root, "analytics", "calibration-review.js");
const journalUiPath = path.join(root, "features", "journal", "journal-ui.js");
const strategyLabPath = path.join(root, "features", "strategy", "strategy-lab.js");
const mediaUtilsPath = path.join(root, "ui", "media-utils.js");
const aiTradeToolsPath = path.join(root, "ai", "trade-tools.js");
const aiContextPath = path.join(root, "ai", "context.js");
const aiServicePath = path.join(root, "ai", "ai-service.js");
const brandUiPath = path.join(root, "ui", "brand.js");
const settingsUiPath = path.join(root, "features", "settings", "settings-ui.js");
const coachUiPath = path.join(root, "features", "coach", "coach-ui.js");
const calibrationUiPath = path.join(root, "features", "calibration", "calibration-ui.js");
const appSource = fs.readFileSync(appPath, "utf8");
const tradeMathSource = fs.readFileSync(tradeMathPath, "utf8");
const statsSource = fs.readFileSync(statsPath, "utf8");
const journalModelSource = fs.readFileSync(journalModelPath, "utf8");
const firestoreStorageSource = fs.readFileSync(firestoreStoragePath, "utf8");
const journalMediaSource = fs.readFileSync(journalMediaPath, "utf8");
const profileStoreSource = fs.readFileSync(profileStorePath, "utf8");
const strategyStoreSource = fs.readFileSync(strategyStorePath, "utf8");
const appConfigSource = fs.readFileSync(appConfigPath, "utf8");
const stringsSource = fs.readFileSync(stringsPath, "utf8");
const traderAnalyticsSource = fs.readFileSync(traderAnalyticsPath, "utf8");
const uiPrimitivesSource = fs.readFileSync(uiPrimitivesPath, "utf8");
const calibrationReviewSource = fs.readFileSync(calibrationReviewPath, "utf8");
const journalUiSource = fs.readFileSync(journalUiPath, "utf8");
const strategyLabSource = fs.readFileSync(strategyLabPath, "utf8");
const mediaUtilsSource = fs.readFileSync(mediaUtilsPath, "utf8");
const aiTradeToolsSource = fs.readFileSync(aiTradeToolsPath, "utf8");
const aiContextSource = fs.readFileSync(aiContextPath, "utf8");
const aiServiceSource = fs.readFileSync(aiServicePath, "utf8");
const brandUiSource = fs.readFileSync(brandUiPath, "utf8");
const settingsUiSource = fs.readFileSync(settingsUiPath, "utf8");
const coachUiSource = fs.readFileSync(coachUiPath, "utf8");
const calibrationUiSource = fs.readFileSync(calibrationUiPath, "utf8");
const source = `${appSource}\n${tradeMathSource}\n${statsSource}\n${journalModelSource}\n${firestoreStorageSource}\n${journalMediaSource}\n${profileStoreSource}\n${strategyStoreSource}\n${appConfigSource}\n${stringsSource}\n${traderAnalyticsSource}\n${uiPrimitivesSource}\n${calibrationReviewSource}\n${journalUiSource}\n${strategyLabSource}\n${mediaUtilsSource}\n${aiTradeToolsSource}\n${aiContextSource}\n${aiServiceSource}\n${brandUiSource}\n${settingsUiSource}\n${coachUiSource}\n${calibrationUiSource}`;

let passed = 0;
const failures = [];

function ok(condition, message) {
  if (!condition) throw new Error(message);
}
function eq(actual, expected, message) {
  if (!Object.is(actual, expected)) {
    throw new Error(`${message}\n  expected: ${JSON.stringify(expected)}\n  actual:   ${JSON.stringify(actual)}`);
  }
}
function approx(actual, expected, eps, message) {
  if (typeof actual !== "number" || Math.abs(actual - expected) > eps) {
    throw new Error(`${message}\n  expected ~ ${expected}\n  actual:     ${actual}`);
  }
}
async function test(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`✓ ${name}`);
  } catch (err) {
    failures.push({ name, err });
    console.error(`✗ ${name}`);
    console.error(`  ${String(err?.message || err).replace(/\n/g, "\n  ")}`);
  }
}
function section(start, end) {
  const a = source.indexOf(start);
  ok(a >= 0, `missing section start: ${start}`);
  const b = source.indexOf(end, a + start.length);
  ok(b >= 0, `missing section end: ${end}`);
  return source.slice(a, b);
}
function extractFunction(name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?:async\\s+)?function\\s+${escapedName}\\s*\\(`);
  const m = re.exec(source);
  ok(m, `function not found: ${name}`);
  const start = m.index;
  const open = source.indexOf("{", start);
  ok(open >= 0, `opening brace not found: ${name}`);

  let depth = 0;
  let state = "code";
  let escaped = false;
  for (let i = open; i < source.length; i++) {
    const c = source[i], n = source[i + 1];
    if (state === "line") { if (c === "\n") state = "code"; continue; }
    if (state === "block") { if (c === "*" && n === "/") { state = "code"; i++; } continue; }
    if (state === "single") {
      if (escaped) { escaped = false; continue; }
      if (c === "\\") { escaped = true; continue; }
      if (c === "'") state = "code";
      continue;
    }
    if (state === "double") {
      if (escaped) { escaped = false; continue; }
      if (c === "\\") { escaped = true; continue; }
      if (c === '"') state = "code";
      continue;
    }
    if (state === "template") {
      if (escaped) { escaped = false; continue; }
      if (c === "\\") { escaped = true; continue; }
      if (c === "`") state = "code";
      continue;
    }
    if (c === "/" && n === "/") { state = "line"; i++; continue; }
    if (c === "/" && n === "*") { state = "block"; i++; continue; }
    if (c === "'") { state = "single"; continue; }
    if (c === '"') { state = "double"; continue; }
    if (c === "`") { state = "template"; continue; }
    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`unterminated function: ${name}`);
}
function createSandbox(extra = {}) {
  const sandbox = {
    console, Date, Math, JSON, Set, Map, Array, Object, Number, String, Boolean, RegExp,
    isFinite, isNaN, ...extra
  };
  vm.createContext(sandbox);
  return sandbox;
}
function loadFunctions(names, extraPrelude = "", extraSandbox = {}) {
  const sandbox = createSandbox(extraSandbox);
  vm.runInContext(
    `${extraPrelude}\n${names.map(extractFunction).join("\n")}`,
    sandbox,
    { filename: "extracted-app-functions.js" }
  );
  return sandbox;
}

await test("app.js passes Node syntax check", () => {
  const r = spawnSync(process.execPath, ["--check", appPath], { encoding: "utf8" });
  ok(r.status === 0, r.stderr || r.stdout || "node --check failed");
});

await test("all local JavaScript modules pass Node syntax check", () => {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".js")) files.push(full);
    }
  };
  walk(root);
  ok(files.length >= 10, "expected modular JS files to be discoverable");
  for (const file of files) {
    const r = spawnSync(process.execPath, ["--check", file], { encoding: "utf8" });
    ok(r.status === 0, `${path.relative(root, file)}: ${r.stderr || r.stdout || "node --check failed"}`);
  }
});

await test("all relative JavaScript imports resolve to local files", () => {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".js")) files.push(full);
    }
  };
  walk(root);
  const importRe = /(?:from\s+|import\s*\()(["'])(\.\.?\/[^"']+)\1/g;
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    let match;
    while ((match = importRe.exec(text))) {
      const specifier = match[2].split("?")[0].split("#")[0];
      const resolved = path.resolve(path.dirname(file), specifier);
      ok(fs.existsSync(resolved), `${path.relative(root, file)} imports missing local file: ${specifier}`);
    }
  }
});

await test("config and i18n modules import cleanly", async () => {
  const config = await import("../config/app-config.js");
  const strings = await import("../i18n/strings.js");
  ok(config.BASE?.bg === "#000000", "BASE config export missing");
  ok(Array.isArray(config.INSTRUMENTS) && config.INSTRUMENTS.length > 0, "instrument config export missing");
  ok(strings.STRINGS?.ru?.nav && strings.STRINGS?.en?.nav, "localized strings export missing");
});

await test("analytics engine imports cleanly and exposes public API", async () => {
  const analytics = await import("../analytics/trader-analytics.js");
  for (const name of ["analyzeTraderPatterns", "patternEngineV2", "calculateTraderAnalytics"]) {
    ok(typeof analytics[name] === "function", `missing analytics export: ${name}`);
  }
  ok(typeof analytics.TREND_ARROW === "object", "TREND_ARROW export missing");
});

await test("calibration/review engine imports cleanly and exposes public API", async () => {
  const review = await import("../analytics/calibration-review.js");
  for (const name of ["caWithTimeout", "caScaleSet", "scoreCalibrationDynamic", "buildReviewQuiz", "scoreJournalReview"]) {
    ok(typeof review[name] === "function", `missing calibration/review export: ${name}`);
  }
  ok(Array.isArray(review.CALIBRATION_QUESTIONS) && review.CALIBRATION_QUESTIONS.length > 0, "calibration questions missing");
});

await test("newly modularized logic stays out of app.js", () => {
  for (const token of [
    "var STRINGS = {",
    "var TA_CONFIDENCE_THRESHOLDS",
    "function calculateTraderAnalytics(",
    "function patternEngineV2(",
    "function Card(",
    "function ScreenshotPreviewHost(",
    "var CALIBRATION_QUESTIONS =",
    "function scoreJournalReview("
  ]) ok(!appSource.includes(token), `modular implementation drifted back into app.js: ${token}`);
});

await test("stage 5-7 feature modules stay extracted from app.js", () => {
  for (const token of [
    "function NewEntry(",
    "function CloseTrade(",
    "function EditTrade(",
    "function Log(",
    "function StrategyLab(",
    "function calculateStrategyStats(",
    "function aiBuildContext(",
    "var AI_SYSTEM_INSTRUCTION =",
    "async function aiRecognizeTradeFromImage("
  ]) ok(!appSource.includes(token), `feature implementation drifted back into app.js: ${token}`);

  for (const token of [
    'from "./features/journal/journal-ui.js?v=2"',
    'from "./features/strategy/strategy-lab.js?v=2"',
    'from "./ai/context.js?v=2"',
    'from "./ai/ai-service.js?v=1"',
    'from "./ai/trade-tools.js?v=1"'
  ]) ok(appSource.includes(token), `feature module import missing: ${token}`);
});

await test("stage 8 feature UI stays extracted from app.js", () => {
  for (const token of [
    "function Settings(",
    "function Coach(",
    "function Calibration(",
    "function JournalReview(",
    "function LogoMark(",
    "function DecodeText("
  ]) ok(!appSource.includes(token), `stage 8 implementation drifted back into app.js: ${token}`);

  for (const token of [
    'from "./ui/brand.js?v=1"',
    'from "./features/settings/settings-ui.js?v=1"',
    'from "./features/coach/coach-ui.js?v=1"',
    'from "./features/calibration/calibration-ui.js?v=2"'
  ]) ok(appSource.includes(token), `stage 8 module import missing: ${token}`);
});


await test("modular extraction keeps every moved runtime dependency local or imported", () => {
  const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
  const journal = read("features/journal/journal-ui.js");
  const strategy = read("features/strategy/strategy-lab.js");
  const calibration = read("features/calibration/calibration-ui.js");
  const aiContext = read("ai/context.js");
  const review = read("analytics/calibration-review.js");
  const strings = read("i18n/strings.js");

  ok(journal.includes("useEffect") && journal.includes("const softLift") && journal.includes("function relTime"), "journal module lost extracted helpers");
  ok(journal.includes("export function pointToEmotions"), "pointToEmotions is not exported for analytics UI");
  ok(strategy.includes('import { LogoSpinner }') && strategy.includes("export function normalizeStrategyResultByCloseType") && strategy.includes("export function strategyResultOutcome"), "strategy module lost shared runtime helpers");
  ok(calibration.includes("function useAnimatedNumber") && !calibration.includes("storageGet(HOME_ADVICE_KEY"), "calibration module contains unresolved app-level cache dependencies");
  ok(aiContext.includes("entriesWithRealizedRR") && aiContext.includes("st_median"), "AI context imports are incomplete");
  ok(review.includes("function emotionImpactStats") && review.includes("const EMOTION_IMPACT_HIGH"), "review module lost emotion-impact helpers");
  ok(strings.includes("function pluralRu"), "localized formatter dependency missing");
  ok(appSource.includes("async function getHomeAdvice") && appSource.includes("async function getMarketSnapshot"), "Home cache helpers disappeared from app orchestration");
  ok(appSource.includes("journalMediaStore.keys.entry(userId, id)"), "legacy media migration bypasses journal-media key adapter");
});

await test("shared emotion-conflict logic is pure and reusable", async () => {
  const model = await import("../core/journal-model.js");
  ok(typeof model.emotionConflict === "function", "emotionConflict export missing");
  const mixed = model.emotionConflict({confidence:80,fear:70,calm:20,tension:10}, "entry");
  eq(mixed.x, 70, "opposing entry emotion conflict changed");
  eq(mixed.max, 70, "entry conflict max changed");
  ok(mixed.has, "strong mixed state no longer flagged");
});

await test("trader-level calculation lives in analytics module", async () => {
  const analytics = await import("../analytics/trader-analytics.js");
  ok(typeof analytics.calculateTraderLevel === "function", "calculateTraderLevel export missing");
  eq(analytics.calculateTraderLevel([], {}), 1, "empty journal trader level must stay 1");
});

await test("trade-math module imports cleanly and exposes pure API", async () => {
  const mod = await import("../core/trade-math.js");
  for (const name of [
    "computePlannedRR","computeRealizedRR","normalizeResultByCloseType","outcomeFromResult",
    "resultEntriesForUnit","formatResult","hasRealizedRR","entriesWithRealizedRR"
  ]) ok(typeof mod[name] === "function", `missing trade-math export: ${name}`);
  ok(Array.isArray(mod.CURRENCIES) && mod.CURRENCIES.length >= 6, "currency table missing");
});

await test("stats module imports cleanly and preserves core math API", async () => {
  const mod = await import("../core/stats.js");
  for (const name of ["st_mean","st_median","st_stdev","st_round2","computeRRWinRateStats"]) {
    ok(typeof mod[name] === "function", `missing stats export: ${name}`);
  }
  eq(mod.st_mean([1,2,3]), 2, "stats mean");
  eq(mod.st_median([9,1,5]), 5, "stats median");
  eq(mod.st_round2(1.236), 1.24, "stats round2");
});

await test("journal-model module imports cleanly and normalizes legacy data", async () => {
  const mod = await import("../core/journal-model.js");
  for (const name of ["migrateEntry","normalizeEmotions","emotionClampPct","emotionScaleKeys","deriveEntryStatus"]) {
    ok(typeof mod[name] === "function", `missing journal-model export: ${name}`);
  }
  eq(mod.emotionClampPct(127), 100, "emotion upper clamp");
  eq(mod.emotionClampPct(-9), 0, "emotion lower clamp");
  const old = mod.migrateEntry({id:"legacy",outcome:"Loss",closeType:"sl",r:30,emotions:{fear:120}});
  eq(old.status, "closed", "legacy status inference");
  eq(old.r, -30, "legacy result repair");
  eq(old.emotions.fear, 100, "legacy emotion normalization");
});

await test("Firestore adapter preserves exact paths and value document payload", async () => {
  const { createFirestoreStorage } = await import("../core/firestore-storage.js");
  const calls = [];
  const auth = { currentUser: { uid: "u1" } };
  const fakeDoc = (...parts) => ({ parts });
  const store = createFirestoreStorage({
    db: "DB",
    auth,
    doc: fakeDoc,
    getDoc: async () => ({ exists: () => true, data: () => ({ value: "v", updatedAt: 777 }) }),
    setDoc: async (ref, payload) => calls.push(["set", ref.parts, payload]),
    deleteDoc: async (ref) => calls.push(["delete", ref.parts]),
    now: () => 12345
  });
  eq(store.sanitizeKey("a/b"), "a_b", "sanitize key");
  const got = await store.get("profile/key");
  eq(got.value, "v", "get value");
  eq(got.updatedAt, 777, "get updatedAt metadata");
  await store.set("profile/key", "x");
  await store.delete("public/key", true);
  eq(JSON.stringify(calls[0][1]), JSON.stringify(["DB","users","u1","data","profile_key"]), "user path");
  eq(JSON.stringify(calls[0][2]), JSON.stringify({value:"x",updatedAt:12345}), "value payload");
  eq(JSON.stringify(calls[1][1]), JSON.stringify(["DB","shared","public_key"]), "shared path");
});

await test("profile-store chunks journal + coin ledger and reconstructs the exact public profile shape", async () => {
  const { createProfileStore } = await import("../core/profile-store.js");
  const docs = new Map();
  let manifestValue = null;
  let revSeq = 0;

  const storageGet = async (key) => {
    if (key.endsWith(":manifest")) return manifestValue == null ? null : { key, value: manifestValue };
    return docs.has(key) ? { key, value: docs.get(key) } : null;
  };
  const storageSet = async (key, value) => { docs.set(key, value); return { key, value }; };
  const storageDelete = async (key) => { docs.delete(key); return { key, deleted: true }; };
  const runTx = async (_db, fn) => {
    let pending = null;
    await fn({
      get: async () => ({
        exists: () => manifestValue != null,
        data: () => ({ value: manifestValue })
      }),
      set: (_ref, payload) => { pending = payload; }
    });
    if (pending) manifestValue = pending.value;
  };

  const makeStore = () => createProfileStore({
    storageGet, storageSet, storageDelete,
    getDocRef: (key) => ({ key }),
    runTransaction: runTx,
    db: {},
    profileBaseKey: "mind-exe-journal-state",
    schemaVersion: 2,
    now: () => 1000 + revSeq,
    revisionIdFactory: () => `rev_${++revSeq}`,
    logger: { warn() {} }
  });

  const store = makeStore();
  await store.load("u1");

  const entries = Array.from({ length: 260 }, (_, i) => ({
    id: `e${i}`,
    date: "2026-01-01T00:00:00.000Z",
    note: "x".repeat(5000),
    r: i % 2 ? -1 : 1
  }));
  const coinLedger = Array.from({ length: 900 }, (_, i) => ({ id: `c${i}`, delta: 1, note: "y".repeat(800) }));
  const profile = {
    version: 2,
    user: { name: "Trader" },
    journal: { entries },
    settings: { currency: "USD" },
    progress: {},
    wallet: { mindCoins: 900, coinLedger }
  };

  const saved = await store.save("u1", profile);
  ok(saved.journalChunkCount > 1, "large journal was not chunked");
  ok(saved.ledgerChunkCount > 1, "large coin ledger was not chunked");
  ok(!docs.has("mind-exe-journal-state:u1"), "legacy whole-profile document was written");
  for (const [key, value] of docs) {
    const bytes = Buffer.byteLength(value, "utf8");
    ok(bytes < 800 * 1024, `profile revision document too large: ${key} (${bytes} bytes)`);
  }

  const reader = makeStore();
  const loaded = await reader.load("u1");
  eq(loaded.profile.journal.entries.length, entries.length, "journal reconstruction count");
  eq(loaded.profile.wallet.coinLedger.length, coinLedger.length, "coin ledger reconstruction count");
  eq(loaded.profile.journal.entries[259].id, "e259", "journal ordering changed");
  eq(loaded.profile.wallet.coinLedger[899].id, "c899", "ledger ordering changed");
  eq(loaded.profile.user.name, "Trader", "profile core changed");
});

await test("profile-store CAS prevents a stale second client from overwriting a newer revision", async () => {
  const { createProfileStore } = await import("../core/profile-store.js");
  const docs = new Map();
  let manifestValue = null;
  let id = 0;

  const storageGet = async (key) => {
    if (key.endsWith(":manifest")) return manifestValue == null ? null : { key, value: manifestValue };
    return docs.has(key) ? { key, value: docs.get(key) } : null;
  };
  const storageSet = async (key, value) => { docs.set(key, value); return { key, value }; };
  const storageDelete = async (key) => { docs.delete(key); return { key, deleted: true }; };
  const runTx = async (_db, fn) => {
    let pending = null;
    await fn({
      get: async () => ({
        exists: () => manifestValue != null,
        data: () => ({ value: manifestValue })
      }),
      set: (_ref, payload) => { pending = payload; }
    });
    if (pending) manifestValue = pending.value;
  };
  const makeStore = (prefix) => createProfileStore({
    storageGet, storageSet, storageDelete,
    getDocRef: (key) => ({ key }),
    runTransaction: runTx,
    db: {},
    profileBaseKey: "mind-exe-journal-state",
    schemaVersion: 2,
    revisionIdFactory: () => `${prefix}_${++id}`,
    logger: { warn() {} }
  });

  const a = makeStore("A");
  const b = makeStore("B");
  await a.load("u1");
  await b.load("u1");

  const baseProfile = {
    version: 2, user: { name: "A" }, journal: { entries: [] },
    settings: {}, progress: {}, wallet: { mindCoins: 0, coinLedger: [] }
  };
  await a.save("u1", baseProfile);

  let conflict = false;
  try {
    await b.save("u1", { ...baseProfile, user: { name: "B" } });
  } catch (e) {
    conflict = e.message === "profile_revision_conflict";
  }
  ok(conflict, "stale client was allowed to overwrite a newer manifest");

  const verifier = makeStore("V");
  const current = await verifier.load("u1");
  eq(current.profile.user.name, "A", "stale client changed active profile");
});

await test("profile-store activates manifest after revision documents and keeps exact key layout", async () => {
  const { createProfileStore } = await import("../core/profile-store.js");
  const order = [];
  const docs = new Map();
  let manifestValue = null;

  const store = createProfileStore({
    storageGet: async (key) => {
      if (key.endsWith(":manifest")) return manifestValue == null ? null : {key,value:manifestValue};
      return docs.has(key) ? {key,value:docs.get(key)} : null;
    },
    storageSet: async (key, value) => { order.push(`doc:${key}`); docs.set(key,value); },
    storageDelete: async () => {},
    getDocRef: (key) => ({key}),
    runTransaction: async (_db, fn) => {
      let pending = null;
      await fn({
        get: async () => ({exists:()=>manifestValue!=null,data:()=>({value:manifestValue})}),
        set: (_ref,payload) => { pending = payload; order.push("manifest"); }
      });
      if (pending) manifestValue = pending.value;
    },
    db: {},
    profileBaseKey: "mind-exe-journal-state",
    schemaVersion: 2,
    revisionIdFactory: () => "r1",
    logger: {warn(){}}
  });

  await store.load("u7");
  await store.save("u7", {
    version:2,user:{},journal:{entries:[{id:"x"}]},settings:{},progress:{},wallet:{coinLedger:[]}
  });

  eq(store.keys.manifest("u7"), "mind-exe-journal-state:split:u7:manifest", "manifest key");
  eq(store.keys.core("u7","r1"), "mind-exe-journal-state:split:u7:rev:r1:core", "core key");
  eq(store.keys.journal("u7","r1",0), "mind-exe-journal-state:split:u7:rev:r1:journal:0", "journal chunk key");
  ok(order.indexOf("manifest") > order.findIndex((v) => v.includes(":core")), "manifest activated before core write");
  ok(order.indexOf("manifest") > order.findIndex((v) => v.includes(":journal:0")), "manifest activated before journal chunk");
});

await test("profile-store keeps five rollback revisions and falls back to the newest valid history revision", async () => {
  const { createProfileStore } = await import("../core/profile-store.js");
  const docs = new Map();
  let manifestValue = null;
  let resetValue = null;
  let revNo = 0;

  const storageGet = async (key) => {
    if (key.endsWith(":manifest")) return manifestValue == null ? null : {key,value:manifestValue};
    if (key.endsWith(":reset")) return resetValue == null ? null : {key,value:resetValue};
    return docs.has(key) ? {key,value:docs.get(key)} : null;
  };
  const storageSet = async (key,value) => { docs.set(key,value); };
  const storageDelete = async (key) => { docs.delete(key); };
  const runTx = async (_db, fn) => {
    const pending = [];
    await fn({
      get: async (ref) => ({
        exists: () => ref.key.endsWith(":manifest") ? manifestValue != null : resetValue != null,
        data: () => ({value: ref.key.endsWith(":manifest") ? manifestValue : resetValue})
      }),
      set: (ref,payload) => pending.push([ref.key,payload.value])
    });
    for (const [key,value] of pending) {
      if (key.endsWith(":manifest")) manifestValue = value;
      if (key.endsWith(":reset")) resetValue = value;
    }
  };

  const makeStore = () => createProfileStore({
    storageGet, storageSet, storageDelete,
    getDocRef: (key) => ({key}),
    runTransaction: runTx,
    db: {},
    profileBaseKey: "mind-exe-journal-state",
    schemaVersion: 2,
    now: () => Date.parse(`2026-04-${String(revNo + 1).padStart(2,"0")}T00:00:00.000Z`),
    revisionIdFactory: () => `r${++revNo}`,
    logger: {warn(){}}
  });

  const writer = makeStore();
  await writer.load("u1");
  for (let i = 1; i <= 7; i++) {
    await writer.save("u1", {
      version:2,
      user:{name:`v${i}`},
      journal:{entries:[]},
      settings:{},progress:{},wallet:{coinLedger:[]}
    });
  }

  const manifest = JSON.parse(manifestValue);
  eq(manifest.history.length, 5, "rollback history length");
  const active = manifest.activeRevision;
  docs.set(
    `mind-exe-journal-state:split:u1:rev:${active}:core`,
    "{broken-json"
  );

  const reader = makeStore();
  const loaded = await reader.load("u1");
  eq(loaded.source, "history", "broken active revision did not fall back to history");
  eq(loaded.profile.user.name, "v6", "did not choose newest valid history revision");
});

await test("Strategy index uses immutable revisions, five-version history and stale-client CAS", async () => {
  const { createStrategyStore } = await import("../core/strategy-store.js");
  const docs = new Map();
  let manifestValue = null;
  let seq = 0;

  const storageGet = async (key) => {
    if (key.endsWith(":manifest")) return manifestValue == null ? null : {key,value:manifestValue,updatedAt:100};
    return docs.has(key) ? {key,value:docs.get(key),updatedAt:100} : null;
  };
  const storageSet = async (key,value) => { docs.set(key,value); };
  const storageDelete = async (key) => { docs.delete(key); };
  const runTx = async (_db, fn) => {
    let pending = null;
    await fn({
      get: async () => ({
        exists: () => manifestValue != null,
        data: () => ({value:manifestValue})
      }),
      set: (_ref,payload) => { pending = payload.value; }
    });
    if (pending != null) manifestValue = pending;
  };

  const makeStore = (prefix) => createStrategyStore({
    storageGet, storageSet, storageDelete,
    getDocRef: (key) => ({key}),
    runTransaction: runTx,
    db: {},
    indexBaseKey: "mind-exe-strategy-index",
    tradeBaseKey: "mind-exe-strategy-trade",
    indexSchemaVersion: 1,
    revisionIdFactory: () => `${prefix}_${++seq}`,
    logger: {warn(){}}
  });

  const a = makeStore("a");
  const b = makeStore("b");
  await a.loadIndex("u1");
  await b.loadIndex("u1");

  await a.saveIndex("u1", {version:1,strategies:[{id:"s1",tradeIds:[]}]});
  let conflict = false;
  try {
    await b.saveIndex("u1", {version:1,strategies:[{id:"s2",tradeIds:[]}]});
  } catch (e) {
    conflict = e.message === "strategy_revision_conflict";
  }
  ok(conflict, "stale Strategy index overwrote a newer revision");

  for (let i = 2; i <= 7; i++) {
    await a.saveIndex("u1", {version:1,strategies:[{id:`s${i}`,tradeIds:[]}]});
  }
  const manifest = JSON.parse(manifestValue);
  eq(manifest.history.length, 5, "Strategy rollback history length");

  const reader = makeStore("r");
  const loaded = await reader.loadIndex("u1");
  eq(loaded.payload.strategies[0].id, "s7", "latest Strategy index not loaded");
});

await test("Strategy index actually reads the old canonical index and old backup as migration fallbacks", async () => {
  const { createStrategyStore } = await import("../core/strategy-store.js");
  const docs = new Map([
    ["mind-exe-strategy-index:backup:u2", JSON.stringify({version:1,strategies:[{id:"backup",tradeIds:[]}]})]
  ]);
  const store = createStrategyStore({
    storageGet: async (key) => docs.has(key) ? {key,value:docs.get(key),updatedAt:123} : null,
    storageSet: async (key,value) => { docs.set(key,value); },
    storageDelete: async (key) => { docs.delete(key); },
    getDocRef: (key) => ({key}),
    runTransaction: async () => {},
    db: {},
    indexBaseKey: "mind-exe-strategy-index",
    tradeBaseKey: "mind-exe-strategy-trade",
    indexSchemaVersion: 1,
    logger: {warn(){}}
  });

  const fromBackup = await store.loadIndex("u2");
  eq(fromBackup.source, "backup", "old Strategy backup is still write-only");
  eq(fromBackup.payload.strategies[0].id, "backup", "backup Strategy index not read");

  docs.set("mind-exe-strategy-index:u3", JSON.stringify({version:1,strategies:[{id:"legacy",tradeIds:[]}]}));
  const legacyStore = createStrategyStore({
    storageGet: async (key) => docs.has(key) ? {key,value:docs.get(key),updatedAt:456} : null,
    storageSet: async () => {},
    storageDelete: async () => {},
    getDocRef: (key) => ({key}),
    runTransaction: async () => {},
    db: {},
    indexBaseKey: "mind-exe-strategy-index",
    tradeBaseKey: "mind-exe-strategy-trade",
    indexSchemaVersion: 1,
    logger: {warn(){}}
  });
  const fromLegacy = await legacyStore.loadIndex("u3");
  eq(fromLegacy.source, "legacy", "legacy Strategy index not used");
  eq(fromLegacy.payload.strategies[0].id, "legacy", "legacy Strategy payload changed");
});

await test("Strategy trade CAS rejects stale edits while legacy trades begin at revision zero", async () => {
  const { createStrategyStore } = await import("../core/strategy-store.js");
  let tradeValue = JSON.stringify({id:"t1",strategyId:"s1",status:"open"});
  const store = createStrategyStore({
    storageGet: async () => null,
    storageSet: async () => {},
    storageDelete: async () => {},
    getDocRef: (key) => ({key}),
    runTransaction: async (_db, fn) => {
      let pending = null;
      await fn({
        get: async () => ({
          exists: () => tradeValue != null,
          data: () => ({value:tradeValue})
        }),
        set: (_ref,payload) => { pending = payload.value; }
      });
      if (pending != null) tradeValue = pending;
    },
    db: {},
    indexBaseKey: "mind-exe-strategy-index",
    tradeBaseKey: "mind-exe-strategy-trade",
    indexSchemaVersion: 1,
    now: () => Date.parse("2026-05-01T00:00:00.000Z"),
    logger: {warn(){}}
  });

  const first = await store.saveTrade("u1", {id:"t1",strategyId:"s1",status:"closed"}, {expectedRevision:0});
  eq(first.persistenceRevision, 1, "legacy Strategy trade did not migrate to revision 1");

  let conflict = false;
  try {
    await store.saveTrade("u1", {id:"t1",strategyId:"s1",status:"open"}, {expectedRevision:0});
  } catch (e) {
    conflict = e.message === "strategy_trade_revision_conflict";
  }
  ok(conflict, "stale Strategy trade edit overwrote newer record");
  eq(JSON.parse(tradeValue).status, "closed", "stale Strategy edit changed stored trade");
});

await test("Strategy full reset creates an empty revision with no rollback history", async () => {
  const { createStrategyStore } = await import("../core/strategy-store.js");
  const docs = new Map();
  let manifestValue = null;
  let n = 0;
  const store = createStrategyStore({
    storageGet: async (key) => {
      if (key.endsWith(":manifest")) return manifestValue == null ? null : {key,value:manifestValue};
      return docs.has(key) ? {key,value:docs.get(key)} : null;
    },
    storageSet: async (key,value) => { docs.set(key,value); },
    storageDelete: async (key) => { docs.delete(key); },
    getDocRef: (key) => ({key}),
    runTransaction: async (_db, fn) => {
      let pending = null;
      await fn({
        get: async () => ({exists:()=>manifestValue!=null,data:()=>({value:manifestValue})}),
        set: (_ref,payload) => { pending = payload.value; }
      });
      if (pending != null) manifestValue = pending;
    },
    db: {},
    indexBaseKey: "mind-exe-strategy-index",
    tradeBaseKey: "mind-exe-strategy-trade",
    indexSchemaVersion: 1,
    revisionIdFactory: () => `r${++n}`,
    logger: {warn(){}}
  });

  await store.loadIndex("u1");
  await store.saveIndex("u1", {version:1,strategies:[{id:"s1",tradeIds:[]}]});
  await store.saveIndex("u1", {version:1,strategies:[{id:"s2",tradeIds:[]}]});
  const reset = await store.resetIndex("u1");
  eq(reset.payload.strategies.length, 0, "Strategy reset did not activate empty index");
  eq(JSON.parse(manifestValue).history.length, 0, "Strategy reset can resurrect old history");
});

await test("canonical Firebase/profile keys and schema stay unchanged", () => {
  for (const token of [
    'var SCHEMA_VERSION = 2;',
    'var PROFILE_KEY = "mind-exe-journal-state";',
    'var MEDIA_KEY = "mind-exe-journal-media";',
    'var STRATEGY_SCHEMA_VERSION = 1;',
    'var STRATEGY_INDEX_KEY = "mind-exe-strategy-index";',
    'var STRATEGY_TRADE_KEY = "mind-exe-strategy-trade";',
    'var STRATEGY_MEDIA_KEY = "mind-exe-strategy-media";'
  ]) ok(source.includes(token), `missing invariant: ${token}`);
});

await test("critical functions are unique", () => {
  for (const name of [
    "migrateProfile", "migrateEntry", "CloseTrade", "EditTrade",
    "StrategyTradeEditForm", "StrategyCloseTrade", "loadMedia",
    "saveMedia", "computeRRWinRateStats", "riskAnalysis"
  ]) {
    const re = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\(`, "g");
    eq((source.match(re) || []).length, 1, `${name} declaration count`);
  }
});

await test("known nested-hook black-screen regression is absent", () => {
  ok(!/useEffect\(\(\)\s*=>\s*\{\s*useEffect\(/s.test(source), "nested useEffect regression found");
});

await test("SL / TP / manual result semantics are correct", () => {
  const s = loadFunctions(["normalizeResultByCloseType", "outcomeFromResult"]);
  const cases = [
    ["sl", 30, -30, "Loss"], ["sl", -30, -30, "Loss"],
    ["tp", 30, 30, "Win"], ["tp", -30, 30, "Win"],
    ["manual", 30, 30, "Win"], ["manual", -30, -30, "Loss"],
    ["sl", 0, 0, "Breakeven"]
  ];
  for (const [type, raw, expected, outcome] of cases) {
    const got = s.normalizeResultByCloseType(type, raw);
    eq(got, expected, `${type} ${raw}`);
    eq(s.outcomeFromResult(got), outcome, `${type} ${raw} outcome`);
  }
});

await test("planned and realized RR math is direction-safe", () => {
  const s = loadFunctions(["computePlannedRR", "computeRealizedRR"]);
  const lp = s.computePlannedRR("Long", 100, 90, 120);
  const sp = s.computePlannedRR("Short", 100, 110, 80);
  ok(lp.ok && sp.ok, "valid plan rejected");
  approx(lp.rr, 2, 1e-9, "long planned RR");
  approx(sp.rr, 2, 1e-9, "short planned RR");
  approx(s.computeRealizedRR("Long", 100, 90, 115), 1.5, 1e-9, "long realized RR");
  approx(s.computeRealizedRR("Short", 100, 110, 85), 1.5, 1e-9, "short realized RR");
  ok(!s.computePlannedRR("Long", 100, 110, 120).ok, "invalid long SL accepted");
});

await test("legacy profile migration preserves old data under version 2", () => {
  const s = loadFunctions(["migrateProfile"], "var SCHEMA_VERSION = 2;");
  const out = s.migrateProfile({
    name:"Trader", entries:[{id:"e1"}], accentIndex:3, soundOn:false,
    weeklyGoal:5, measureMode:"currency", currency:"USD", startingCapital:1250,
    customInstruments:["BTCUSDT"], customTags:["breakout"],
    mindCoins:7, coinLedger:[{delta:1}]
  });
  eq(out.version, 2, "version");
  eq(out.user.name, "Trader", "name");
  eq(out.journal.entries.length, 1, "entries");
  eq(out.settings.measureMode, "currency", "measureMode");
  eq(out.wallet.mindCoins, 7, "wallet");
});

await test("migrateEntry repairs contradictory legacy SL/TP without inventing units", () => {
  const prelude = `
    var CURRENCIES=[{code:"USD"},{code:"RUB"},{code:"EUR"},{code:"GBP"},{code:"CNY"},{code:"KZT"}];
  `;
  const s = loadFunctions([
    "emotionScaleKeys","emotionClampPct","normalizeEmotions",
    "deriveEntryStatus","normalizeResultByCloseType","outcomeFromResult",
    "normalizeResultMode","normalizeResultCurrency","migrateEntry"
  ], prelude);

  const sl = s.migrateEntry({id:"x",status:"closed",closeType:"sl",r:30,outcome:"Win"});
  eq(sl.r, -30, "SL sign");
  eq(sl.outcome, "Loss", "SL outcome");
  eq(sl.resultMode, null, "legacy unit guessed");

  const tp = s.migrateEntry({
    id:"y",status:"closed",closeType:"tp",r:-20,
    resultMode:"currency",resultCurrency:"USD"
  });
  eq(tp.r, 20, "TP sign");
  eq(tp.outcome, "Win", "TP outcome");
  eq(tp.resultCurrency, "USD", "currency lost");
});

await test("per-trade result units never mix metadata-aware USD / EUR / R", () => {
  const prelude = `var CURRENCIES=[{code:"USD"},{code:"RUB"},{code:"EUR"},{code:"GBP"},{code:"CNY"},{code:"KZT"}];`;
  const s = loadFunctions([
    "normalizeResultMode","normalizeResultCurrency","getStoredResultMeta",
    "resultMatchesUnit","resultEntriesForUnit","countExcludedResultEntries"
  ], prelude);
  const usd={r:30,resultMode:"currency",resultCurrency:"USD"};
  const eur={r:20,resultMode:"currency",resultCurrency:"EUR"};
  const rr={r:2,resultMode:"R",resultCurrency:null};
  const legacy={r:5};
  ok(s.resultMatchesUnit(usd,"currency","USD"), "USD excluded");
  ok(!s.resultMatchesUnit(usd,"R","USD"), "USD included in R");
  ok(!s.resultMatchesUnit(eur,"currency","USD"), "EUR included in USD");
  ok(s.resultMatchesUnit(rr,"R","USD"), "R excluded");
  ok(s.resultMatchesUnit(legacy,"R","USD"), "legacy fallback changed");
  eq(s.countExcludedResultEntries([usd,eur,rr],"currency","USD"), 2, "exclusion count");
});

await test("Strategy Lab migration shares SL/TP semantics and preserves unit metadata", () => {
  const prelude = `var CURRENCIES=[{code:"USD"},{code:"RUB"},{code:"EUR"},{code:"GBP"},{code:"CNY"},{code:"KZT"}];`;
  const s = loadFunctions([
    "normalizeResultByCloseType","outcomeFromResult","normalizeResultMode","normalizeResultCurrency",
    "normalizeStrategyResultByCloseType","strategyResultOutcome","migrateStrategyTrade"
  ], prelude);
  const t = s.migrateStrategyTrade({
    id:"t1",strategyId:"s1",status:"closed",closeType:"sl",
    r:30,outcome:"Win",resultMode:"currency",resultCurrency:"USD",
    date:"2026-01-01T00:00:00.000Z"
  });
  eq(t.r, -30, "strategy SL sign");
  eq(t.outcome, "Loss", "strategy SL outcome");
  eq(t.resultMode, "currency", "strategy unit lost");
  eq(t.resultCurrency, "USD", "strategy currency lost");
});

await test("RR statistics ignore money PnL and use realizedRR only", () => {
  const prelude = `
    function st_mean(a){return a.length?a.reduce((s,v)=>s+v,0)/a.length:0;}
    function st_round2(v){return Math.round(v*100)/100;}
  `;
  const s = loadFunctions(["computeRRWinRateStats"], prelude);
  const out = s.computeRRWinRateStats([
    {r:1000,realizedRR:1},{r:-500,realizedRR:-1},{r:999999,realizedRR:null}
  ]);
  eq(out.sampleSize, 2, "RR sample");
  eq(out.wins, 1, "wins");
  eq(out.losses, 1, "losses");
  approx(out.avgWinR, 1, 1e-9, "avg win R");
  approx(out.avgLossR, 1, 1e-9, "avg loss R");
});

await test("risk analytics cannot be contaminated by currency-sized r values", () => {
  const prelude = `
    function st_mean(a){return a.length?a.reduce((s,v)=>s+v,0)/a.length:0;}
    function st_stdev(a){if(a.length<2)return 0;const m=st_mean(a);return Math.sqrt(a.reduce((s,v)=>s+(v-m)*(v-m),0)/a.length);}
    function st_round2(v){return Math.round(v*100)/100;}
    function ta_metric(value,sample){return {value,sample};}
  `;
  const s = loadFunctions(["hasRealizedRR","entriesWithRealizedRR","riskAnalysis"], prelude);
  const out = s.riskAnalysis([
    {outcome:"Win",r:100000,realizedRR:1},
    {outcome:"Loss",r:-80000,realizedRR:-1},
    {outcome:"Win",r:500000,realizedRR:1.5},
    {outcome:"Loss",r:-900000,realizedRR:-0.5},
    {outcome:"Win",r:700000,realizedRR:1},
    {outcome:"Win",r:99999999,realizedRR:null}
  ]);
  ok(out.averageRisk < 2, "money contaminated risk");
  eq(out.stability.sample, 5, "risk sample");
});

await test("Pattern Engine avgR uses actual realizedRR sample", () => {
  const prelude = `
    function hasRealizedRR(e){return !!e&&typeof e.realizedRR==="number"&&isFinite(e.realizedRR);}
    function entriesWithRealizedRR(a){return (a||[]).filter(hasRealizedRR);}
  `;
  const s = loadFunctions(["pe_summarize"], prelude);
  const out = s.pe_summarize([
    {outcome:"Win",r:1000,realizedRR:1},
    {outcome:"Loss",r:-500,realizedRR:-1},
    {outcome:"Win",r:1000000,realizedRR:null}
  ]);
  eq(out.trades, 3, "trades");
  eq(out.rrSample, 2, "rrSample");
  approx(out.avgR, 0, 1e-9, "avgR");
});

await test("journal-media store encapsulates readiness and blocks unsafe existing-entry writes", async () => {
  const { createJournalMediaStore } = await import("../core/journal-media.js");
  const store = createJournalMediaStore({
    storageGet: async () => null,
    storageSet: async () => ({}),
    storageDelete: async () => ({}),
    isAuthenticated: () => true,
    withTimeout: async (p) => await p,
    mediaBaseKey: "mind-exe-journal-media",
    legacyMapKey: (uid) => `mind-exe-journal-media:${uid}`,
    logger: { warn() {} }
  });

  let blocked = false;
  try {
    store.assertWriteSafe(
      { oldTrade: { entry: ["data:image/png;base64,x"], exit: [] } },
      new Set(["oldTrade"])
    );
  } catch (e) {
    blocked = e.message === "journal_media_pending_load";
  }
  ok(blocked, "existing media write was not blocked before readiness");

  store.acceptLoadBatch([{
    id: "oldTrade",
    ready: true,
    media: { entry: [], exit: [] },
    raw: JSON.stringify({entry:[],exit:[]}),
    manifest: null
  }]);
  store.assertWriteSafe(
    { oldTrade: { entry: ["data:image/png;base64,x"], exit: [] } },
    new Set(["oldTrade"])
  );
  ok(store.debugState().readyIds.includes("oldTrade"), "per-entry readiness not encapsulated");
});

await test("journal-media keys remain byte-for-byte compatible with v4.6.5 format", async () => {
  const { createJournalMediaStore } = await import("../core/journal-media.js");
  const store = createJournalMediaStore({
    storageGet: async () => null,
    storageSet: async () => ({}),
    storageDelete: async () => ({}),
    isAuthenticated: () => true,
    withTimeout: async (p) => await p,
    mediaBaseKey: "mind-exe-journal-media",
    legacyMapKey: (uid) => `mind-exe-journal-media:${uid}`,
    logger: { warn() {} }
  });
  eq(store.keys.entry("u1","e1"), "mind-exe-journal-media:u1:e1", "legacy per-entry media key");
  eq(store.keys.manifest("u1","e1"), "mind-exe-journal-media:u1:e1:manifest", "split manifest key");
  eq(
    store.keys.image("u1","e1","g1","entry",2),
    "mind-exe-journal-media:u1:e1:g:g1:entry:2",
    "split image key"
  );
});

await test("journal persist keeps media safety preflight before profile write", () => {
  const start = appSource.indexOf("const persistNow =");
  const end = appSource.indexOf("const commitJournalEntries", start);
  ok(start >= 0 && end > start, "persistNow section missing");
  const block = appSource.slice(start, end);
  const preflight = block.indexOf("journalMediaStore.assertWriteSafe(mediaMap, existingCloudEntryIds);");
  const profileWrite = block.indexOf("await saveProfile(userId, payload);");
  const mediaWrite = block.indexOf("await journalMediaStore.save(userId, mediaMap");
  ok(preflight >= 0, "media preflight missing");
  ok(profileWrite >= 0, "profile write missing");
  ok(mediaWrite >= 0, "media write missing");
  ok(preflight < profileWrite, "profile may write before media safety is known");
  ok(profileWrite < mediaWrite, "journal media ordering changed unexpectedly");
});

await test("journal split-media normalization and manifest validation remain backward-safe", () => {
  const prelude = `var JOURNAL_MEDIA_SPLIT_VERSION=1;var JOURNAL_MEDIA_MAX_SHOTS=4;`;
  const s = loadFunctions(["normalizeJournalMedia","parseJournalMediaManifest"], prelude);
  const media = s.normalizeJournalMedia({
    entry:["data:image/jpeg;base64,a","bad","data:image/png;base64,b","data:image/png;base64,c","data:image/png;base64,d","data:image/png;base64,e"],
    exit:["data:image/png;base64,z"]
  });
  eq(media.entry.length, 4, "entry slot limit");
  eq(media.exit.length, 1, "exit media");
  eq(s.parseJournalMediaManifest(JSON.stringify({version:1,generation:null,entryCount:1,exitCount:0})), null, "invalid generation accepted");
  ok(s.parseJournalMediaManifest(JSON.stringify({version:1,generation:null,entryCount:0,exitCount:0,tombstone:true}))?.tombstone, "tombstone invalid");
});

await test("journal media writer keeps manifest-last atomic activation", () => {
  const block = section("async function writeJournalMediaSplit", "function assertJournalMediaWriteSafe");
  const a = block.indexOf("await Promise.all(jobs);");
  const b = block.indexOf("await storageSet(mediaManifestKey");
  ok(a >= 0 && b >= 0 && a < b, "manifest activates before image barrier");
  ok(!block.includes("JSON.stringify(normalized)"), "whole screenshot bundle returned");
});

await test("progressive media loader remains bounded and per-entry guarded", () => {
  const load = section("async function loadMedia(", "async function deleteJournalMediaGeneration");
  ok(load.includes("concurrency"), "concurrency setting missing");
  ok(load.includes("journal_media_entry_timeout"), "entry timeout missing");
  ok(!load.includes("Promise.all((entryIds || []).map"), "unbounded all-entry Promise.all returned");
  const gate = section("function assertJournalMediaWriteSafe", "async function saveMedia");
  ok(gate.includes("mediaReadyIds.has(sid)"), "ready guard missing");
  ok(gate.includes("mediaFailedIds.has(sid)"), "failed guard missing");
  ok(appSource.includes("journalMediaStore.acceptLoadBatch(rows)"), "app does not accept media batches through store");
  ok(appSource.includes("journalMediaStore.finishLoad(res)"), "app does not finalize media load through store");
});

await test("media failure after a committed profile cannot leave stale journal state ready to re-save", () => {
  const start = appSource.indexOf("const persistNow =");
  const end = appSource.indexOf("const commitJournalEntries", start);
  const block = appSource.slice(start, end);
  const commitFlag = block.indexOf("profileCommitted = true");
  const mediaTry = block.indexOf("await journalMediaStore.save");
  const safeReturn = block.indexOf("if (profileCommitted)");
  ok(commitFlag >= 0 && mediaTry > commitFlag && safeReturn > mediaTry, "post-profile media failure guard missing");
  ok(block.slice(safeReturn).includes("return true;"), "committed profile is treated as failed after media error");
});

await test("journal mutations remain cloud-first", () => {
  const block = section("const commitJournalEntries =", "// V5.6");
  const persist = block.indexOf("persistNow({ entries: nextEntries");
  const state = block.indexOf("setEntries(nextEntries)");
  ok(persist >= 0 && state >= 0 && persist < state, "state mutates before cloud confirmation");
  ok(block.includes("journal_commit_timeout"), "commit timeout missing");
});

await test("recovery prefers newer timestamped data over an older but fuller snapshot", () => {
  const s = loadFunctions([
    "profileEntryCount",
    "profileMeaningScore",
    "profileTimestampMs",
    "profileRecoveryUpdatedAt",
    "compareRecoveryCandidates"
  ]);
  const olderRich = {
    key: "old",
    profile: {
      meta: { updatedAt: "2026-01-01T00:00:00.000Z" },
      journal: { entries: Array.from({length: 50}, (_, i) => ({id:`o${i}`})) }
    }
  };
  const newerSparse = {
    key: "new",
    profile: {
      meta: { updatedAt: "2026-02-01T00:00:00.000Z" },
      journal: { entries: [{id:"n1"}] }
    }
  };
  const sorted = [olderRich, newerSparse].sort(s.compareRecoveryCandidates);
  eq(sorted[0].key, "new", "older fuller snapshot outranked newer recovery data");
});

await test("reset boundaries prevent old journal/full-reset data from resurrecting", () => {
  const s = loadFunctions([
    "profileTimestampMs",
    "profileRecoveryUpdatedAt",
    "profileOwnResetMs",
    "applyProfileResetBoundaries"
  ]);

  const old = {
    meta: { updatedAt: "2026-01-01T00:00:00.000Z" },
    user: { name: "Trader" },
    settings: { currency: "USD" },
    journal: { entries: [{id:"old-trade"}] },
    wallet: { mindCoins: 3, coinLedger: [] }
  };

  const journalBounded = s.applyProfileResetBoundaries(old, {
    journalResetAt: "2026-02-01T00:00:00.000Z",
    fullResetAt: null
  });
  eq(journalBounded.journal.entries.length, 0, "journal reset resurrected old trade");
  eq(journalBounded.user.name, "Trader", "journal reset incorrectly erased non-journal profile fields");

  const fullBounded = s.applyProfileResetBoundaries(old, {
    journalResetAt: "2026-02-01T00:00:00.000Z",
    fullResetAt: "2026-02-01T00:00:00.000Z"
  });
  eq(fullBounded, null, "full reset allowed old profile recovery");

  const resetRevision = {
    ...old,
    meta: {
      updatedAt: "2026-02-01T00:00:00.000Z",
      fullResetAt: "2026-02-01T00:00:00.000Z",
      journalResetAt: "2026-02-01T00:00:00.000Z"
    },
    journal: { entries: [] }
  };
  ok(s.applyProfileResetBoundaries(resetRevision, {
    journalResetAt: "2026-02-01T00:00:00.000Z",
    fullResetAt: "2026-02-01T00:00:00.000Z"
  }) !== null, "actual full-reset revision rejected by its own tombstone");
});

await test("profile-store reset tombstone is committed atomically and survives manifest loss", async () => {
  const { createProfileStore } = await import("../core/profile-store.js");
  const docs = new Map();
  let manifestValue = null;
  let resetValue = null;
  let rev = 0;

  const manifestSuffix = ":manifest";
  const resetSuffix = ":reset";
  const storageGet = async (key) => {
    if (key.endsWith(manifestSuffix)) return manifestValue == null ? null : {key,value:manifestValue};
    if (key.endsWith(resetSuffix)) return resetValue == null ? null : {key,value:resetValue};
    return docs.has(key) ? {key,value:docs.get(key)} : null;
  };
  const storageSet = async (key,value) => { docs.set(key,value); };
  const storageDelete = async (key) => { docs.delete(key); };

  const runTx = async (_db, fn) => {
    const pending = [];
    await fn({
      get: async (ref) => ({
        exists: () => ref.key.endsWith(manifestSuffix) ? manifestValue != null : resetValue != null,
        data: () => ({ value: ref.key.endsWith(manifestSuffix) ? manifestValue : resetValue })
      }),
      set: (ref,payload) => pending.push([ref.key,payload.value])
    });
    for (const [key,value] of pending) {
      if (key.endsWith(manifestSuffix)) manifestValue = value;
      if (key.endsWith(resetSuffix)) resetValue = value;
    }
  };

  const makeStore = () => createProfileStore({
    storageGet, storageSet, storageDelete,
    getDocRef: (key) => ({key}),
    runTransaction: runTx,
    db: {},
    profileBaseKey: "mind-exe-journal-state",
    schemaVersion: 2,
    now: () => Date.parse("2026-03-01T00:00:00.000Z"),
    revisionIdFactory: () => `r${++rev}`,
    logger: {warn(){}}
  });

  const writer = makeStore();
  await writer.load("u1");
  const saved = await writer.save("u1", {
    version:2,
    meta:{
      journalResetAt:"2026-03-01T00:00:00.000Z",
      intentionalJournalReset:true
    },
    user:{},journal:{entries:[]},settings:{},progress:{},wallet:{coinLedger:[]}
  });
  ok(resetValue != null, "durable reset document was not written");
  eq(saved.profile.meta.persistence.sequence, 1, "saved profile sequence metadata");
  eq(saved.profile.meta.persistence.savedAt, "2026-03-01T00:00:00.000Z", "saved profile timestamp metadata");

  manifestValue = null;
  const reader = makeStore();
  const loaded = await reader.load("u1");
  eq(loaded.manifestExists, false, "manifest unexpectedly exists");
  eq(loaded.resetState.journalResetAt, "2026-03-01T00:00:00.000Z", "reset tombstone disappeared with manifest");
});

await test("app uses split profile store instead of writing the whole canonical profile document", () => {
  const saveStart = appSource.indexOf("async function saveProfile(userId, profile)");
  const saveEnd = appSource.indexOf("async function saveProfileBackupIfSafer", saveStart);
  ok(saveStart >= 0 && saveEnd > saveStart, "saveProfile section missing");
  const block = appSource.slice(saveStart, saveEnd);
  ok(block.includes("await profileStore.save(userId, normalized);"), "saveProfile does not use revision store");
  ok(!block.includes("storageSet(profileKey(userId)"), "whole-profile canonical write returned");

  const loadStart = appSource.indexOf("async function loadProfile(userId)");
  const loadEnd = appSource.indexOf("// Journal screenshot persistence is isolated", loadStart);
  const loadBlock = appSource.slice(loadStart, loadEnd);
  ok(loadBlock.includes("await profileStore.load(userId)"), "split profile is not loaded first");
  ok(loadBlock.includes("storageGet(profileKey(userId), false)"), "legacy canonical fallback was removed");
  ok(loadBlock.includes("readProfileCandidateCloud(profileKey(userId))"), "legacy canonical recovery candidate was removed");
});

await test("journal/full reset handlers are cloud-first and full reset clears auxiliary stores", () => {
  const journalStart = appSource.indexOf("const resetJournal = async");
  const fullStart = appSource.indexOf("const resetEverything = async", journalStart);
  const end = appSource.indexOf("const addCustomInstrument", fullStart);
  ok(journalStart >= 0 && fullStart > journalStart && end > fullStart, "reset handlers missing");

  const journalBlock = appSource.slice(journalStart, fullStart);
  ok(journalBlock.includes("commitJournalEntries("), "journal reset bypasses cloud-first commit helper");
  ok(journalBlock.includes("__intentionalJournalReset: true"), "journal reset tombstone missing");
  ok(!journalBlock.includes("setEntries([])"), "journal UI clears before cloud confirmation");

  const fullBlock = appSource.slice(fullStart, end);
  const persist = fullBlock.indexOf("persistNow({ ...defaults");
  const localClear = fullBlock.indexOf("setEntries([])");
  const aux = fullBlock.indexOf("clearAuxiliaryUserDataForFullReset(");
  ok(persist >= 0 && localClear > persist, "full reset mutates UI before profile reset confirmation");
  ok(aux > persist, "auxiliary deletion starts before durable reset profile");
  ok(fullBlock.includes("__intentionalFullReset: true"), "full-reset tombstone missing");

  const auxStart = appSource.indexOf("async function clearAuxiliaryUserDataForFullReset");
  const auxEnd = appSource.indexOf("var AUTH_USERS_KEY =", auxStart);
  const auxBlock = appSource.slice(auxStart, auxEnd);
  ok(auxBlock.includes("knownTradeIds = []"), "full reset does not accept in-memory strategy trade ids");
  ok(auxBlock.includes("strategyStore.resetIndex(userId)"), "full reset does not clear revisioned Strategy index");
  for (const token of [
    "strategyIndexKey(userId)",
    "deleteStrategyTradeRecord(userId, tradeId)",
    "storageDelete(aiKey(userId)",
    "storageDelete(calibHistoryKey(userId)",
    "storageDelete(`${PROFILE_KEY}:backup:${userId}`",
    "storageDelete(profileKey(userId)"
  ]) ok(auxBlock.includes(token), `full reset auxiliary cleanup missing: ${token}`);
});

await test("app routes Strategy index and direct-trade writes through revisioned Strategy store", () => {
  ok(appSource.includes('from "./core/strategy-store.js?v=1"'), "strategy-store import missing");
  const loadStart = appSource.indexOf("async function loadStrategyLabState");
  const loadEnd = appSource.indexOf("async function saveStrategyTradeRecord", loadStart);
  const block = appSource.slice(loadStart, loadEnd);
  ok(block.includes("strategyStore.loadIndex(userId)"), "Strategy index does not load through revision store");
  ok(block.includes("strategyStore.saveIndex(userId, payload)"), "Strategy index does not save through revision store");

  const tradeStart = appSource.indexOf("async function saveStrategyTradeRecord");
  const tradeEnd = appSource.indexOf("async function deleteStrategyTradeRecord", tradeStart);
  const tradeBlock = appSource.slice(tradeStart, tradeEnd);
  ok(tradeBlock.includes("strategyStore.saveTrade(userId, clean"), "Strategy trade bypasses CAS store");

  ok(appSource.includes('e?.message === "strategy_trade_revision_conflict"'), "Strategy trade conflict UI handling missing");
  ok(appSource.includes('e?.message === "strategy_revision_conflict"'), "Strategy index conflict UI handling missing");
  ok(appSource.includes("strategyCanPersistRef.current = false;"), "Strategy conflict does not freeze further writes");
});

await test("Strategy timeout states freeze further writes until reload", () => {
  const start = appSource.indexOf("const freezeStrategyWritesForConflict");
  const end = appSource.indexOf("const handleDeleteStrategy", start);
  const block = appSource.slice(start, end);
  for (const token of [
    "strategy_index_save_timeout",
    "strategy_trade_save_timeout",
    "strategy_trade_update_timeout",
    "strategy_close_save_timeout"
  ]) ok(block.includes(token), `Strategy uncertainty guard missing: ${token}`);
  ok(block.includes("strategyCanPersistRef.current = false"), "Strategy uncertainty does not freeze writes");
});

await test("journal import and full-backup profile restore are cloud-first", () => {
  const journalStart = appSource.indexOf("const importJournal =");
  const journalEnd = appSource.indexOf("const exportFullBackup =", journalStart);
  const journalBlock = appSource.slice(journalStart, journalEnd);
  ok(journalBlock.includes("await commitJournalEntries(restored, message)"), "journal import bypasses cloud-first commit");
  ok(!journalBlock.includes("setEntries(restored)"), "journal import mutates UI before cloud confirmation");

  const fullStart = appSource.indexOf("const importFullBackup =");
  const fullEnd = appSource.indexOf("const resetJournal =", fullStart);
  const fullBlock = appSource.slice(fullStart, fullEnd);
  const persist = fullBlock.indexOf("const profileRestoreOk = await persistNow");
  const setEntries = fullBlock.indexOf("setEntries(restoredEntries)");
  ok(persist >= 0 && setEntries > persist, "full backup changes profile UI before cloud confirmation");
  ok(fullBlock.includes('if (!profileRestoreOk) throw new Error("full_backup_profile_save_failed")'), "full backup ignores failed profile save");
});

await test("Strategy backup restore uses revisioned index and rollback for already-existing trade records", () => {
  const fullStart = appSource.indexOf("const importFullBackup =");
  const fullEnd = appSource.indexOf("const resetJournal =", fullStart);
  const block = appSource.slice(fullStart, fullEnd);
  ok(block.includes("const touched = []"), "Strategy restore rollback tracking missing");
  ok(block.includes("previousById"), "Strategy restore does not preserve previous trades for rollback");
  ok(block.includes("await persistStrategyIndexNow(fixedStrategies)"), "Strategy restore bypasses revisioned index persister");
  ok(block.includes("expectedRevision: row.committedRevision"), "Strategy restore rollback is not CAS-protected");
});

await test("passive second device does not rewrite cloud profile just because its local anonId differs", () => {
  const block = section("const buildPayload =", "const persistNow =");
  ok(block.includes("anonId: prev?.user?.anonId || anonId"), "authenticated payload still replaces the cloud anonId with a device-local id");
  ok(!block.includes("user: { ...prev.user, name: src.name, anonId },"), "old device-local anonId overwrite returned");
});

await test("trade-entry navigation is explicit on desktop", () => {
  ok(stringsSource.includes('new: "\\u0414\\u043E\\u0431\\u0430\\u0432\\u0438\\u0442\\u044C \\u0441\\u0434\\u0435\\u043B\\u043A\\u0443"'), "Russian nav label is not \"Добавить сделку\"");
  ok(stringsSource.includes('new: "Add trade"'), "English nav label is not explicit");
  const sidebar = section("function DesktopSidebar", "class AppErrorBoundary");
  ok(sidebar.includes("nav.map"), "desktop sidebar no longer renders the shared navigation list");
});

await test("profile revision conflict freezes cloud writes and requires reload", () => {
  const start = appSource.indexOf("const persistNow =");
  const end = appSource.indexOf("const commitJournalEntries", start);
  const block = appSource.slice(start, end);
  ok(block.includes('e?.message === "profile_revision_conflict"'), "revision conflict handling missing");
  ok(block.includes('setProfileDataError({ kind: "conflict"'), "conflict does not enter blocking reload UI");
  ok(block.includes("canPersistRef.current = false;"), "conflict does not freeze further writes");
});

await test("profile load failure remains blocking instead of showing an empty journal", () => {
  ok(source.includes('setProfileDataError({ kind: "load"'), "load error state missing");
  ok(source.includes("!profileDataError && introResolved && !showBootIntro"), "main app not guarded");
  ok(source.includes("function ProfileLoadErrorScreen"), "load-error screen missing");
});

await test("uncertain cloud write still freezes newer writes in the session", () => {
  ok(source.includes("profileWriteUncertainRef.current = true;"), "uncertain flag missing");
  ok(source.includes("if (profileWriteUncertainRef.current) return false;"), "uncertain session still writable");
});

await test("R-specific analytics contain no direct generic trade.r access", () => {
  for (const [start,end] of [
    ["function ta_zoneStats","function emotionalAnalysis"],
    ["function riskAnalysis","function sequenceAnalysis"],
    ["function calibrationAnalysis","var PATTERN_MIN_SAMPLE"],
    ["function pe_summarize","function pe_scoreCandidate"],
    ["function pe_pickExamples","var PE_STOPWORDS"],
    ["function pd_unstableRisk","function pd_overtrading"],
    ["function pd_riskAfterWin","function pd_avoidLossReview"],
    ["function aiComputeAfterStreakBehavior","function aiComputeHoldTimes"]
  ]) {
    ok(!/\b(?:t|e|prev|cur)\.r\b/.test(section(start,end)), `generic .r in R-only block: ${start}`);
  }
});

await test("critical runtime safety markers from previous fixes remain present", () => {
  ok(source.includes("class AppErrorBoundary extends Component"), "AppErrorBoundary removed");
  ok(source.includes("profilePersistChainRef"), "profile save serialization removed");
  ok(source.includes('var PROFILE_SHADOW_KEY = "mind-exe-cloud-shadow";'), "emergency profile shadow removed");
  ok(source.includes("intentionalFullReset"), "intentional reset marker removed");
  ok(source.includes("ScreenshotPreviewHost"), "screenshot viewer removed");
});


await test("removed production demo and unreachable simulator stay absent", () => {
  ok(!source.includes("var seedEntries ="), "demo seedEntries returned");
  ok(!source.includes("function Simulator("), "unreachable Simulator returned");
  ok(!source.includes('tab === "simulator"'), "unreachable simulator route returned");
  ok(!source.includes("SIM_START_CAPITAL"), "simulator engine returned");
});


await test("core logic stays extracted instead of drifting back into app.js", () => {
  for (const token of [
    "function computePlannedRR(",
    "function normalizeResultByCloseType(",
    "function st_mean(",
    "function computeRRWinRateStats(",
    "function migrateEntry(",
    "function normalizeEmotions("
  ]) ok(!appSource.includes(token), `core implementation drifted back into app.js: ${token}`);
  ok(appSource.includes('from "./core/trade-math.js?v=1"'), "trade-math import missing");
  ok(appSource.includes('from "./core/stats.js?v=1"'), "stats import missing");
  ok(appSource.includes('from "./core/journal-model.js?v=2"'), "journal-model import missing");
  ok(appSource.includes('from "./core/firestore-storage.js?v=2"'), "firestore-storage import missing");
  ok(appSource.includes('from "./core/journal-media.js?v=1"'), "journal-media import missing");
  ok(appSource.includes('from "./core/profile-store.js?v=2"'), "profile-store import missing");
  ok(appSource.includes('from "./core/strategy-store.js?v=1"'), "strategy-store import missing");
  ok(!appSource.includes("async function loadMedia("), "journal media loader drifted back into app.js");
  ok(!appSource.includes("async function saveMedia("), "journal media writer drifted back into app.js");
  ok(!/^(?!\s*\/\/).*__mediaReadyIds/m.test(appSource), "journal media private cache leaked back into app.js");
});

console.log(`\n${passed} regression checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} regression check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log("MIND.EXE regression suite: OK");
}
