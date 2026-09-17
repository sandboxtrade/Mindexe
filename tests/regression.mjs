import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import vm from "node:vm";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const appPath = path.join(root, "app.js");
const indexPath = path.join(root, "index.html");
const tradeMathPath = path.join(root, "core", "trade-math.js");
const statsPath = path.join(root, "core", "stats.js");
const journalModelPath = path.join(root, "core", "journal-model.js");
const firestoreStoragePath = path.join(root, "core", "firestore-storage.js");
const journalMediaPath = path.join(root, "core", "journal-media.js");
const profileStorePath = path.join(root, "core", "profile-store.js");
const strategyStorePath = path.join(root, "core", "strategy-store.js");
const strategyMathPath = path.join(root, "core", "strategy-math.js");
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
const dashboardUiPath = path.join(root, "features", "dashboard", "dashboard-ui.js");
const dashboardDataPath = path.join(root, "features", "dashboard", "dashboard-data.js");
const packagePath = path.join(root, "package.json");
const viteConfigPath = path.join(root, "vite.config.js");
const stylesPath = path.join(root, "styles.css");
const serviceWorkerPath = path.join(root, "public", "sw.js");
const authUiPath = path.join(root, "features", "auth", "auth-ui.js");
const appShellPath = path.join(root, "ui", "app-shell.js");
const appSource = fs.readFileSync(appPath, "utf8");
const indexSource = fs.readFileSync(indexPath, "utf8");
const tradeMathSource = fs.readFileSync(tradeMathPath, "utf8");
const statsSource = fs.readFileSync(statsPath, "utf8");
const journalModelSource = fs.readFileSync(journalModelPath, "utf8");
const firestoreStorageSource = fs.readFileSync(firestoreStoragePath, "utf8");
const journalMediaSource = fs.readFileSync(journalMediaPath, "utf8");
const profileStoreSource = fs.readFileSync(profileStorePath, "utf8");
const strategyStoreSource = fs.readFileSync(strategyStorePath, "utf8");
const strategyMathSource = fs.readFileSync(strategyMathPath, "utf8");
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
const dashboardUiSource = fs.readFileSync(dashboardUiPath, "utf8");
const dashboardDataSource = fs.readFileSync(dashboardDataPath, "utf8");
const packageSource = fs.readFileSync(packagePath, "utf8");
const viteConfigSource = fs.readFileSync(viteConfigPath, "utf8");
const stylesSource = fs.readFileSync(stylesPath, "utf8");
const serviceWorkerSource = fs.readFileSync(serviceWorkerPath, "utf8");
const authUiSource = fs.readFileSync(authUiPath, "utf8");
const appShellSource = fs.readFileSync(appShellPath, "utf8");
const source = `${appSource}\n${tradeMathSource}\n${statsSource}\n${journalModelSource}\n${firestoreStorageSource}\n${journalMediaSource}\n${profileStoreSource}\n${strategyStoreSource}\n${strategyMathSource}\n${appConfigSource}\n${stringsSource}\n${traderAnalyticsSource}\n${uiPrimitivesSource}\n${calibrationReviewSource}\n${journalUiSource}\n${strategyLabSource}\n${mediaUtilsSource}\n${aiTradeToolsSource}\n${aiContextSource}\n${aiServiceSource}\n${brandUiSource}\n${settingsUiSource}\n${coachUiSource}\n${calibrationUiSource}\n${dashboardUiSource}\n${dashboardDataSource}\n${authUiSource}\n${appShellSource}`;

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

await test("TypeScript static audit finds no unresolved runtime identifiers when tsc is available", () => {
  const probe = spawnSync("tsc", ["--version"], { encoding: "utf8" });
  if (probe.error?.code === "ENOENT") return;
  ok(probe.status === 0, probe.stderr || probe.stdout || "tsc probe failed");
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name.startsWith(".") || entry.name === "tests") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".js")) files.push(full);
    }
  };
  walk(root);
  const r = spawnSync("tsc", [
    "--allowJs", "--checkJs", "--noEmit", "--target", "ES2022", "--module", "ESNext",
    "--moduleResolution", "Bundler", "--skipLibCheck", "--lib", "ES2022,DOM",
    "--noUnusedLocals", "--noUnusedParameters", ...files
  ], { encoding: "utf8", cwd: root, maxBuffer: 8 * 1024 * 1024 });
  const output = `${r.stdout || ""}\n${r.stderr || ""}`;
  const unresolved = output.split(/\r?\n/).filter((line) => /error TS(?:2304|2552):/.test(line));
  ok(unresolved.length === 0, `unresolved runtime identifiers:\n${unresolved.join("\n")}`);
  const unused = output.split(/\r?\n/).filter((line) => /error TS(?:6133|6192|6196|6198):/.test(line));
  ok(unused.length === 0, `unused runtime identifiers:\n${unused.join("\n")}`);
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
    'from "./features/journal/journal-ui.js"',
    'from "./core/strategy-math.js"',
    'from "./ai/ai-service.js"',
    'from "./ai/trade-tools.js"'
  ]) ok(appSource.includes(token), `feature module import missing: ${token}`);
  ok(fs.existsSync(aiContextPath), "AI context module was removed after extraction");
  ok(appSource.includes('lazy(() => import("./features/strategy/strategy-lab.js")'), "Strategy Lab is not code-split");
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

  ok(appSource.includes('from "./ui/brand.js"'), "brand module import missing");
  for (const feature of [
    "./features/settings/settings-ui.js",
    "./features/coach/coach-ui.js",
    "./features/calibration/calibration-ui.js"
  ]) ok(appSource.includes(`lazy(() => import("${feature}")`), `stage 8 lazy feature missing: ${feature}`);
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
  ok(strategy.includes('import { LogoSpinner }') && strategy.includes('from "../../core/strategy-math.js"'), "strategy module lost shared runtime helpers");
  ok(strategyMathSource.includes("export function normalizeStrategyResultByCloseType") && strategyMathSource.includes("export function strategyResultOutcome") && strategyMathSource.includes("export function calculateStrategyStats"), "strategy math extraction is incomplete");
  ok(calibration.includes("function useAnimatedNumber") && !calibration.includes("storageGet(HOME_ADVICE_KEY"), "calibration module contains unresolved app-level cache dependencies");
  ok(aiContext.includes("entriesWithRealizedRR") && aiContext.includes("st_median"), "AI context imports are incomplete");
  ok(review.includes("function emotionImpactStats") && review.includes("const EMOTION_IMPACT_HIGH"), "review module lost emotion-impact helpers");
  ok(strings.includes("function pluralRu"), "localized formatter dependency missing");
  ok(dashboardUiSource.includes("async function getHomeAdvice") && dashboardUiSource.includes("async function getMarketSnapshot") && dashboardUiSource.includes('from "./dashboard-data.js"'), "dashboard module lost Home cache helpers/storage bridge");
  ok(dashboardDataSource.includes("export function configureDashboardData") && dashboardDataSource.includes("export function dashboardStorageGet") && dashboardDataSource.includes("export function dashboardStorageSet"), "dashboard storage adapter extraction is incomplete");
  ok(appSource.includes("journalMediaStore.keys.entry(userId, id)"), "legacy media migration bypasses journal-media key adapter");
});

await test("stage 9-11 dashboard/auth/shell UI stays extracted from app.js", () => {
  for (const token of [
    "function Home(", "function Patterns(", "function Challenge(",
    "function AuthScreen(", "function LegacyMigratePrompt(", "function BootIntro(",
    "function BootLoading(", "function ProfileLoadErrorScreen(", "function DesktopSidebar(",
    "class AppErrorBoundary extends Component"
  ]) ok(!appSource.includes(token), `stage 9-11 implementation drifted back into app.js: ${token}`);

  ok(appSource.includes('lazy(() => import("./features/dashboard/dashboard-ui.js")'), "dashboard UI is not code-split");
  for (const token of [
    'from "./features/dashboard/dashboard-data.js"',
    'from "./features/auth/auth-ui.js"',
    'from "./ui/app-shell.js"'
  ]) ok(appSource.includes(token), `stage 9-11 module import missing: ${token}`);

  ok(appSource.includes("configureDashboardData({ storageGet, storageSet });"), "dashboard storage adapter is not configured");
});

await test("stage 9-11 moved modules keep their runtime dependencies explicit", () => {
  for (const token of [
    'import { useState, useMemo, useEffect, useRef } from "react"',
    'from "../../core/trade-math.js"',
    'from "../../core/journal-model.js"',
    'from "../../analytics/trader-analytics.js"',
    'from "../../ai/ai-service.js"',
    'from "../../ai/context.js"',
    'from "../journal/journal-ui.js"',
    "function calculateCalendarStats",
    "function useAnimatedNumber",
    "const outcomeColor",
    "const pluralRu"
  ]) ok(dashboardUiSource.includes(token), `dashboard dependency missing: ${token}`);

  for (const token of [
    'import { Component, useState, useRef, useEffect } from "react"',
    'from "../core/trade-math.js"',
    'from "./brand.js"',
    'from "./primitives.js"',
    "const relTime",
    "var SPLASH_POSTER_IMG",
    "function WalletSheet",
    "class AppErrorBoundary extends Component"
  ]) ok(appShellSource.includes(token), `app-shell dependency missing: ${token}`);

  for (const token of [
    'import { useState, useEffect } from "react"',
    'from "../../ui/brand.js"',
    "function AuthScreen",
    "function LegacyMigratePrompt",
    "function BootIntro"
  ]) ok(authUiSource.includes(token), `auth-ui dependency missing: ${token}`);
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
  eq(saved.profile.journal.entries.length, entries.length, "save() returned a chunk-stripped journal shadow");
  eq(saved.profile.wallet.coinLedger.length, coinLedger.length, "save() returned a chunk-stripped ledger shadow");
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

await test("close-trade header tolerates legacy entries without stored plannedRR", () => {
  ok(journalUiSource.includes("planRR.toFixed(2)"), "close-trade header does not use the safe planned-RR fallback");
  ok(!journalUiSource.includes("entry.plannedRR.toFixed(2)"), "legacy trade close can still crash on a missing plannedRR field");
});

await test("legacy merge respects an intentional journal reset boundary", () => {
  const f = loadFunctions(["migrateProfile", "mergeProfiles"], "var SCHEMA_VERSION = 2;");
  const cloud = {
    version: 2,
    user: { name: "cloud" }, settings: {}, progress: {}, wallet: {},
    meta: { intentionalJournalReset: true, journalResetAt: "2026-09-01T00:00:00.000Z" },
    journal: { entries: [] }
  };
  const legacy = {
    version: 2,
    user: { name: "old" }, settings: {}, progress: {}, wallet: {},
    journal: { entries: [{ id: "old-trade" }] }
  };
  const merged = f.mergeProfiles(cloud, legacy);
  eq(merged.journal.entries.length, 0, "old journal entry resurrected across reset boundary");
  eq(merged.user.name, "cloud", "cloud profile must still win ordinary merge conflicts");
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
  ok(appSource.includes('from "./core/strategy-store.js"'), "strategy-store import missing");
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
  const sidebar = appShellSource.slice(appShellSource.indexOf("function DesktopSidebar"), appShellSource.indexOf("class AppErrorBoundary"));
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

await test("cached profile bootstrap stays read-only until cloud revision is verified", () => {
  ok(appSource.includes("readDirectProfileShadow(userId, { requireConfirmed: true })"), "fast local profile bootstrap does not require a cloud-confirmed shadow");
  ok(appSource.includes('setProfileBootstrapSource("shadow")'), "local shadow is not identified as a bootstrap source");
  ok(appSource.includes("canPersistRef.current = false;"), "profile writes are not disabled before cloud verification");
  ok(appSource.includes("setCloudProfileReady(true)"), "cloud verification never unlocks the profile");
  ok(appSource.includes('setProfileDataError({ kind: "load"') && appSource.includes("cached: bootstrapLoaded"), "cloud failure does not preserve a verified cached read-only view");
  ok(appSource.includes("cachedReadOnly") && appSource.includes('className: "fixed inset-0 z-[110]"'), "cached profile has no interaction blocker");
  ok(appSource.includes("!cloudProfileReady") && appSource.includes('profileBootstrapSource === "shadow"'), "read-only state is not tied to cloud readiness");
  ok(appShellSource.includes("function ProfileLoadErrorScreen"), "blocking load-error screen missing for users without a shadow");
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
  ok(appShellSource.includes("class AppErrorBoundary extends Component"), "AppErrorBoundary removed");
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
  ok(appSource.includes('from "./core/trade-math.js"'), "trade-math import missing");
  ok(fs.existsSync(statsPath), "stats module was removed after extraction");
  ok(appSource.includes('from "./core/journal-model.js"'), "journal-model import missing");
  ok(appSource.includes('from "./core/firestore-storage.js"'), "firestore-storage import missing");
  ok(appSource.includes('from "./core/journal-media.js"'), "journal-media import missing");
  ok(appSource.includes('from "./core/profile-store.js"'), "profile-store import missing");
  ok(appSource.includes('from "./core/strategy-store.js"'), "strategy-store import missing");
  ok(!appSource.includes("async function loadMedia("), "journal media loader drifted back into app.js");
  ok(!appSource.includes("async function saveMedia("), "journal media writer drifted back into app.js");
  ok(!/^(?!\s*\/\/).*__mediaReadyIds/m.test(appSource), "journal media private cache leaked back into app.js");
});

await test("final runtime extraction dependencies are explicit", () => {
  ok(!appSource.includes("SPLASH_BLACKHOLE_MASK"), "dead splash mask reference returned to app.js");
  ok(!appShellSource.includes("SPLASH_BLACKHOLE_MASK"), "dead splash mask payload returned to app shell");
  ok(authUiSource.includes('import { Fragment, jsx, jsxs } from "react/jsx-runtime"'), "auth Fragment import missing");
  ok(authUiSource.includes('import { Card } from "../../ui/primitives.js"'), "auth Card import missing");
  ok(dashboardUiSource.includes('import { JournalReview } from "../calibration/calibration-ui.js"'), "dashboard JournalReview import missing");
});

await test("final typography and static production CSS stay consolidated", () => {
  ok(appSource.includes("--font-display: 'Inter'"), "UI font stack lost Inter/system fallback");
  ok(appSource.includes("--font-mono: 'IBM Plex Mono'"), "numeric font stack lost IBM Plex Mono/system fallback");
  ok(indexSource.includes('rel="stylesheet" href="./styles.css"'), "compiled stylesheet is not loaded by the app shell");
  ok(!indexSource.includes("fonts.googleapis.com"), "startup still blocks on Google Fonts");
  ok(!indexSource.includes("cdn.tailwindcss.com"), "runtime Tailwind CDN returned");
  const localImports = source.match(/(?:from\s+|import\()\s*["'](?:\.\.?\/)[^"']+\.js(?:\?[^"']+)?["']/g) || [];
  const versioned = localImports.filter((spec) => spec.includes("?v="));
  ok(versioned.length === 0, `local module imports still depend on manual cache-buster versions: ${versioned.slice(0, 8).join(", ")}`);
  ok(stylesSource.length > 20000 && stylesSource.length < 250000, "compiled Tailwind CSS size is implausible");
});

await test("final startup shell fails visibly and splash assets stay external", () => {
  ok(indexSource.includes('id="boot-fallback"'), "pre-React boot fallback missing");
  ok(indexSource.includes('__mindExeBootTimer'), "boot failure timer missing");
  ok(appSource.includes('window.__mindExeStarted = true'), "React startup acknowledgement missing");
  ok(indexSource.includes('rel="manifest" href="%BASE_URL%manifest.json"'), "manifest link missing");
  ok(appShellSource.includes('var SPLASH_POSTER_IMG = "./splash-poster.jpg";'), "splash poster is not an external release asset");
  ok(appShellSource.includes('var SPLASH_VIDEO_SRC = "./splash.mp4";'), "splash video is not an external release asset");
  ok(!appShellSource.includes('data:image/jpeg;base64,'), "large splash poster drifted back into JavaScript");
});

await test("Decision Lab model keeps logical weight and emotion independent and locks the pre-trade snapshot", async () => {
  const mod = await import(new URL("../core/decision-model.js?v=test", import.meta.url));
  let s = mod.createDecisionSession({ id: "d1", mode: "direction", now: 1000, clarityBefore: 20 });
  s = mod.setDecisionArguments(s, [{
    id: "a1", rawText: "старший тф вниз", normalizedText: "Старший ТФ вниз",
    side: "short", factorGroup: "market_structure", factorId: "higher_timeframe_trend",
    weight: 90, weightRated: true, emotionIntensity: 15, emotionRated: true, emotionTag: "calm", isDecisive: true
  }], 1100);
  s = { ...s, preDecisionState: { ...s.preDecisionState, clarityAfter: 80, clarityAfterRated: true, decisionConfidence: 70, decisionConfidenceRated: true }, finalDecision: "short" };
  const locked = mod.lockDecisionSession(s, 1200);
  eq(locked.arguments[0].weight, 90, "logical weight changed while locking");
  eq(locked.arguments[0].emotionIntensity, 15, "emotion intensity changed while locking");
  eq(mod.decisionClarityDelta(locked), 60, "clarity delta is wrong");
  let threw = false;
  try {
    mod.assertDecisionMutationAllowed(locked, { ...locked, arguments: [{ ...locked.arguments[0], weight: 10 }] });
  } catch (e) {
    threw = e?.message === "decision_locked_snapshot_mutation";
  }
  ok(threw, "locked decision snapshot can be rewritten after the fact");
});

await test("Decision Lab cloud store uses per-session CAS and atomically updates its index", async () => {
  const { createDecisionStore } = await import(new URL("../core/decision-store.js?v=test", import.meta.url));
  const { createDecisionSession } = await import(new URL("../core/decision-model.js?v=test", import.meta.url));
  const docs = new Map();
  const ref = (key) => ({ key });
  const snap = (key) => ({ exists: () => docs.has(key), data: () => docs.get(key) });
  const store = createDecisionStore({
    storageGet: async (key) => docs.has(key) ? { value: docs.get(key).value, updatedAt: docs.get(key).updatedAt } : null,
    storageDelete: async (key) => { docs.delete(key); },
    getDocRef: (key) => ref(key),
    runTransaction: async (_db, fn) => fn({
      get: async (r) => snap(r.key),
      set: (r, value) => docs.set(r.key, value),
      delete: (r) => docs.delete(r.key)
    }),
    db: {},
    now: (() => { let t = 1000; return () => ++t; })()
  });
  const created = await store.saveSession("u1", createDecisionSession({ id: "d1", mode: "direction", now: 500 }));
  eq(created.persistenceRevision, 1, "first Decision revision is not 1");
  const stale = structuredClone(created);
  const newer = await store.saveSession("u1", { ...created, symbol: "BTCUSDT" });
  eq(newer.persistenceRevision, 2, "Decision revision did not increment");
  let conflict = false;
  try { await store.saveSession("u1", { ...stale, symbol: "ETHUSDT" }); }
  catch (e) { conflict = e?.message === "decision_revision_conflict"; }
  ok(conflict, "stale Decision client overwrote a newer session");
  const index = await store.loadIndex("u1");
  eq(index.sessions.length, 1, "Decision index did not receive session row");
  eq(index.sessions[0].symbol, "BTCUSDT", "Decision index does not reflect committed session");
  let deleteConflict = false;
  try { await store.deleteSession("u1", "d1", { expectedRevision: stale.persistenceRevision }); }
  catch (e) { deleteConflict = e?.message === "decision_revision_conflict"; }
  ok(deleteConflict, "stale Decision delete removed a newer session");
  ok(await store.loadSession("u1", "d1"), "stale Decision delete removed the session despite a revision conflict");
  eq((await store.loadIndex("u1")).sessions.length, 1, "stale Decision delete removed the index row");
  const deleted = await store.deleteSession("u1", "d1", { expectedRevision: newer.persistenceRevision });
  eq(deleted.id, "d1", "Decision delete did not return the removed session");
  eq(await store.loadSession("u1", "d1"), null, "Decision session survived delete");
  eq((await store.loadIndex("u1")).sessions.length, 0, "Decision index kept a deleted session row");
});

await test("Decision organizer validator cannot invent taxonomy ids, weights or emotions", async () => {
  const { validateDecisionOrganizerResponse } = await import(new URL("../core/decision-organizer-model.js?v=test", import.meta.url));
  const rows = validateDecisionOrganizerResponse({ arguments: [{
    rawText: "глобально вниз",
    normalizedText: "Глобальный тренд вниз",
    side: "short",
    factorGroup: "made_up_group",
    factorId: "made_up_factor",
    weight: 100, weightRated: true, emotionIntensity: 99, emotionRated: true
  }] }, "direction", "voice");
  eq(rows.length, 1, "valid organizer row disappeared");
  eq(rows[0].factorId, "other", "unknown AI factor id escaped taxonomy");
  eq(rows[0].factorGroup, "other", "unknown AI factor group escaped taxonomy");
  eq(rows[0].weight, null, "AI was allowed to assign logical weight");
  eq(rows[0].weightRated, false, "AI marked logical weight as user-rated");
  eq(rows[0].emotionIntensity, null, "AI was allowed to assign emotion intensity");
  eq(rows[0].emotionRated, false, "AI marked emotion as user-rated");
});

await test("Decision analytics separates factor performance by emotional intensity without mixing non-R results", async () => {
  const model = await import(new URL("../core/decision-model.js?v=test", import.meta.url));
  const analyticsMod = await import(new URL("../core/decision-analytics.js?v=test", import.meta.url));
  const sessions = [];
  const trades = [];
  for (let i = 0; i < 10; i++) {
    let s = model.createDecisionSession({ id: `d${i}`, mode: "direction", now: 1000 + i, clarityBefore: 30 });
    s = model.setDecisionArguments(s, [{
      id: `a${i}`, rawText: "старший тф вниз", normalizedText: "Старший ТФ вниз",
      side: "short", factorGroup: "market_structure", factorId: "higher_timeframe_trend",
      weight: 90, weightRated: true, emotionIntensity: i < 5 ? 10 : 90, emotionRated: true, emotionTag: i < 5 ? "calm" : "fear",
      isDecisive: true
    }]);
    s = model.lockDecisionSession({ ...s, preDecisionState: { clarityBefore: 30, clarityBeforeRated: true, clarityAfter: 80, clarityAfterRated: true, decisionConfidence: 70 , decisionConfidenceRated: true }, finalDecision: "short" });
    sessions.push({ ...s, linkedTradeId: `t${i}`, status: "linked" });
    trades.push({ id: `t${i}`, status: "closed", outcome: i < 5 ? "Win" : "Loss", realizedRR: i < 5 ? 1 : -1, resultMode: "R", r: i < 5 ? 1 : -1 });
  }
  const result = analyticsMod.buildDecisionAnalytics(sessions, trades, "ru");
  const factor = result.factors.find((f) => f.factorId === "higher_timeframe_trend");
  ok(factor, "factor analytics missing");
  eq(factor.emotionBands.low.sample, 5, "low-emotion sample wrong");
  eq(factor.emotionBands.high.sample, 5, "high-emotion sample wrong");
  eq(factor.emotionBands.low.averageR, 1, "low-emotion R wrong");
  eq(factor.emotionBands.high.averageR, -1, "high-emotion R wrong");
  ok(analyticsMod.buildDecisionInsights(result, "ru").length >= 1, "emotion/factor gap was not surfaced after sufficient sample");
});

await test("Decision Lab stays modular and links to Journal with only decisionSessionId", () => {
  ok(appSource.includes('lazy(() => import("./features/decision-lab/decision-lab-ui.js")'), "Decision Lab UI is not lazy-loaded as a feature module");
  ok(appSource.includes('from "./core/decision-store.js"'), "Decision store is not isolated in core");
  ok(appSource.includes("decisionStore.linkTrade"), "Decision-to-Journal link is missing");
  ok(journalUiSource.includes("decisionSessionId: prefill?.decisionSessionId || null"), "Journal entry does not preserve Decision link id");
  ok(!appSource.includes("function DecisionLab("), "Decision Lab implementation drifted into app.js");
});


await test("Decision post-review reweights arguments without rewriting the locked pre-trade snapshot", async () => {
  const model = await import(new URL("../core/decision-model.js?v=post-review-test", import.meta.url));
  let s = model.createDecisionSession({ id: "post1", mode: "direction", now: 1000, clarityBefore: 25 });
  s = model.setDecisionArguments(s, [{
    id: "a1", rawText: "старший тф вниз", normalizedText: "Старший ТФ вниз",
    side: "short", factorGroup: "market_structure", factorId: "higher_timeframe_trend",
    weight: 90, weightRated: true, emotionIntensity: 80, emotionRated: true, emotionTag: "fear", isDecisive: true
  }], 1100);
  s = model.lockDecisionSession({ ...s, preDecisionState: { clarityBefore: 25, clarityBeforeRated: true, clarityAfter: 75, clarityAfterRated: true, decisionConfidence: 70 , decisionConfidenceRated: true }, finalDecision: "short" }, 1200);
  s = { ...s, status: "linked", linkedTradeId: "t1" };
  const reviewed = model.setDecisionPostReview(s, {
    outcomeAssessment: "logic_invalid",
    note: "Переоценил старший ТФ",
    argumentReviews: [{ argumentId: "a1", weightAfter: 55, emotionAfter: 25, assessment: "overestimated" }]
  }, 1300);
  eq(reviewed.status, "reviewed", "post-review did not move session to reviewed status");
  eq(reviewed.arguments[0].weight, 90, "post-review rewrote original weight");
  eq(reviewed.arguments[0].emotionIntensity, 80, "post-review rewrote original emotion");
  eq(reviewed.postReview.argumentReviews[0].weightAfter, 55, "post-review weightAfter missing");
  model.assertDecisionMutationAllowed(s, reviewed);
});

await test("Decision analytics tracks post-review over/under-weighting separately from pre-trade data", async () => {
  const model = await import(new URL("../core/decision-model.js?v=review-analytics-test", import.meta.url));
  const analyticsMod = await import(new URL("../core/decision-analytics.js?v=review-analytics-test", import.meta.url));
  const sessions = [];
  const trades = [];
  for (let i = 0; i < 5; i++) {
    let s = model.createDecisionSession({ id: `r${i}`, mode: "direction", now: 2000 + i, clarityBefore: 30 });
    s = model.setDecisionArguments(s, [{
      id: `a${i}`, rawText: "уровень", normalizedText: "Уровень поддержки",
      side: "long", factorGroup: "price_level", factorId: "support",
      weight: 85, weightRated: true, emotionIntensity: 20, emotionRated: true, emotionTag: "calm", isDecisive: true
    }]);
    s = model.lockDecisionSession({ ...s, preDecisionState: { clarityBefore: 30, clarityBeforeRated: true, clarityAfter: 70, clarityAfterRated: true, decisionConfidence: 65 , decisionConfidenceRated: true }, finalDecision: "long" });
    s = { ...s, status: "linked", linkedTradeId: `tr${i}` };
    s = model.setDecisionPostReview(s, {
      outcomeAssessment: "logic_invalid",
      argumentReviews: [{ argumentId: `a${i}`, weightAfter: 55, emotionAfter: 10, assessment: "overestimated" }]
    });
    sessions.push(s);
    trades.push({ id: `tr${i}`, status: "closed", outcome: "Loss", realizedRR: -1, resultMode: "R", r: -1 });
  }
  const analytics = analyticsMod.buildDecisionAnalytics(sessions, trades, "ru");
  const support = analytics.factors.find((f) => f.factorId === "support");
  eq(support.postReview.sample, 5, "post-review sample missing from factor analytics");
  eq(support.postReview.averageWeightDelta, -30, "post-review weight delta is wrong");
  ok(analyticsMod.buildDecisionInsights(analytics, "ru").some((x) => x.type === "post_review_weight_gap"), "repeated post-review reweighting was not surfaced");
});

await test("Decision store can load all sessions, save post-review and restore missing backup sessions non-destructively", async () => {
  const { createDecisionStore } = await import(new URL("../core/decision-store.js?v=stage2-store-test", import.meta.url));
  const model = await import(new URL("../core/decision-model.js?v=stage2-store-test", import.meta.url));
  const docs = new Map();
  const ref = (key) => ({ key });
  const snap = (key) => ({ exists: () => docs.has(key), data: () => docs.get(key) });
  const store = createDecisionStore({
    storageGet: async (key) => docs.has(key) ? { value: docs.get(key).value, updatedAt: docs.get(key).updatedAt } : null,
    storageDelete: async (key) => { docs.delete(key); },
    getDocRef: (key) => ref(key),
    runTransaction: async (_db, fn) => fn({ get: async (r) => snap(r.key), set: (r, value) => docs.set(r.key, value) }),
    db: {},
    now: (() => { let t = 3000; return () => ++t; })()
  });
  let s = model.createDecisionSession({ id: "restore1", mode: "direction", now: 1000 });
  s = model.setDecisionArguments(s, [{ id: "a1", rawText: "btc слабый", normalizedText: "BTC слабый", side: "short", factorGroup: "market_context", factorId: "btc_weakness", weight: 80, weightRated: true, emotionIntensity: 10 , emotionRated: true}]);
  s = model.lockDecisionSession({ ...s, preDecisionState: { clarityBefore: 40, clarityBeforeRated: true, clarityAfter: 75, clarityAfterRated: true, decisionConfidence: 65 , decisionConfidenceRated: true }, finalDecision: "short" });
  const saved = await store.saveSession("u1", s);
  const linked = await store.linkTrade("u1", saved.id, "trade1");
  const reviewed = await store.savePostReview("u1", linked.id, { outcomeAssessment: "logic_valid", argumentReviews: [{ argumentId: "a1", weightAfter: 80, emotionAfter: 5, assessment: "accurate" }] });
  const all = await store.loadAllSessions("u1", { strict: true });
  eq(all.length, 1, "loadAllSessions lost session");
  eq(all[0].status, "reviewed", "saved post-review not readable");
  const restore = await store.restoreSessions("u2", [reviewed]);
  eq(restore.created, 1, "backup restore did not create missing decision session");
  const restoreAgain = await store.restoreSessions("u2", [{ ...reviewed, symbol: "MUTATED" }]);
  eq(restoreAgain.skipped, 1, "existing decision snapshot was not protected during restore");
  const existing = await store.loadSession("u2", reviewed.id);
  ok(existing.symbol !== "MUTATED", "restore rewrote an existing immutable decision snapshot");
});

await test("Journal renders linked Decision snapshot and post-review through isolated Decision feature UI", () => {
  const panelSource = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-trade-panel.js"), "utf8");
  const analyticsUiSource = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-analytics-ui.js"), "utf8");
  ok(journalUiSource.includes('from "../decision-lab/decision-trade-panel.js"'), "Journal does not use isolated Decision trade panel");
  ok(journalUiSource.includes("e.decisionSessionId && decisionStore && decisionUserId"), "linked Decision panel is not rendered in Journal");
  ok(panelSource.includes("store.savePostReview"), "post-review save path missing from Decision trade panel");
  ok(panelSource.includes("store.linkTrade"), "Decision trade panel cannot retry a failed trade link");
  ok(analyticsUiSource.includes("buildDecisionAnalytics") && analyticsUiSource.includes("buildDecisionInsights"), "Decision analytics UI is not backed by pure analytics engine");
});

await test("full backup exports/restores Decision Lab and journal import preserves decisionSessionId", () => {
  const exportSection = appSource.slice(appSource.indexOf("const exportFullBackup"), appSource.indexOf("const importFullBackup"));
  const importSection = appSource.slice(appSource.indexOf("const importFullBackup"), appSource.indexOf("const resetJournal"));
  const sanitizeFn = extractFunction("sanitizeImportedEntry");
  ok(exportSection.includes("payload.decisionLab"), "full backup does not export Decision Lab");
  ok(exportSection.includes("decisionStore.loadAllSessions"), "Decision backup export does not load full session records");
  ok(importSection.includes("decisionStore.restoreSessions"), "full backup restore ignores Decision Lab");
  ok(sanitizeFn.includes("decisionSessionId"), "journal import drops Decision-to-trade link");
});

await test("Decision Lab Stage 2 stays modular and exposes analytics without growing app.js", () => {
  const decisionUi = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-lab-ui.js"), "utf8");
  ok(decisionUi.includes('from "./decision-analytics-ui.js"'), "Decision analytics UI is not modularized");
  ok(decisionUi.includes("store.loadAllSessions"), "Decision analytics cannot load persisted sessions");
  ok(appSource.includes("trades: entries"), "Decision analytics does not receive Journal outcomes");
  ok(appSource.split(/\r?\n/).length < 3100, "app.js grew back beyond the intended orchestration range");
});


await test("Decision voice pipeline normalizes audio for Gemini and keeps retry UI free of playback controls", () => {
  const transcription = fs.readFileSync(path.join(root, "ai", "transcription-service.js"), "utf8");
  const decisionUi = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-lab-ui.js"), "utf8");
  ok(transcription.includes("audioBufferToMonoWav"), "voice audio is not normalized to PCM WAV");
  ok(transcription.includes("targetRate = 16000"), "voice audio is not normalized to 16 kHz");
  ok(transcription.includes("decision_transcript_polish"), "successful transcript is not cleaned for readability");
  ok(transcription.includes('mimeType: "audio/wav"'), "Gemini still receives browser-specific recorder containers");
  ok(!decisionUi.includes('jsx("audio"'), "Decision Lab still renders an audio playback control");
  ok(!decisionUi.includes("Download recording"), "Decision Lab still exposes recording download UI");
});

await test("Decision deletion cleans local state and asks app to unlink Journal first", () => {
  const decisionUi = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-lab-ui.js"), "utf8");
  const decisionStore = fs.readFileSync(path.join(root, "core", "decision-store.js"), "utf8");
  ok(decisionStore.includes("async function deleteSession"), "Decision store has no atomic delete API");
  ok(decisionStore.includes("tx.delete(sessionRef)"), "Decision session document is not deleted transactionally");
  ok(decisionUi.includes("onBeforeDeleteSession"), "Decision UI can delete a linked session before Journal unlinking");
  ok(decisionUi.includes("audioStore.clearForSession(id)"), "Decision delete leaves local audio behind");
  ok(decisionUi.includes("draftCache.remove(userId, id)"), "Decision delete leaves the local draft behind");
  ok(decisionUi.includes("statusAbandoned") && decisionUi.includes("showAllHistory"), "abandoned/older Decision records are still unreachable from deletion UI");
  ok(!decisionUi.includes('filter((row) => row.status !== "abandoned").slice(0, 8)'), "Decision history still hides abandoned records behind the old eight-row filter");
  ok(appSource.includes("decisionSessionId: null"), "Journal link is not cleared before Decision deletion");
});

await test("Decision destructive actions use the in-app confirm host instead of native browser dialogs", () => {
  const decisionUi = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-lab-ui.js"), "utf8");
  const primitives = fs.readFileSync(path.join(root, "ui", "primitives.js"), "utf8");
  ok(!decisionUi.includes("window.confirm"), "Decision deletion still opens the native browser confirm dialog");
  ok(decisionUi.includes("requestAppConfirm"), "Decision deletion is not routed through the shared in-app confirm host");
  ok(primitives.includes("export function AppConfirmHost"), "shared styled confirm host is missing");
  ok(appSource.includes("jsx(AppConfirmHost"), "confirm host is not mounted at app level");
});

await test("Decision chart screenshot is stored outside the revisioned session and is deleted atomically", async () => {
  const mediaSource = fs.readFileSync(path.join(root, "core", "decision-media.js"), "utf8");
  const storeSource = fs.readFileSync(path.join(root, "core", "decision-store.js"), "utf8");
  ok(mediaSource.includes('baseKey = "mind-exe-decision-media"'), "Decision media does not use a dedicated cloud keyspace");
  ok(mediaSource.includes("saveLocal") && mediaSource.includes("saveCloud") && mediaSource.includes("loadForSession"), "Decision media lacks local-first/cloud persistence");
  ok(storeSource.includes("mediaBaseKey") && storeSource.includes("tx.delete(mediaRef)"), "Decision delete does not atomically delete the cloud screenshot");

  const { createDecisionMediaStore } = await import(new URL("../core/decision-media.js?v=decision-media-test", import.meta.url));
  const cloud = new Map();
  const mediaStore = createDecisionMediaStore({
    indexedDBImpl: null,
    storageGet: async (key) => cloud.has(key) ? { value: cloud.get(key) } : null,
    storageSet: async (key, value) => { cloud.set(key, value); },
    storageDelete: async (key) => { cloud.delete(key); }
  });
  const dataUrl = `data:image/jpeg;base64,${Buffer.from("chart").toString("base64")}`;
  await mediaStore.saveLocal("u1", "d1", { dataUrl, updatedAt: 10 });
  let loaded = await mediaStore.loadForSession("u1", "d1");
  eq(loaded.dataUrl, dataUrl, "local Decision screenshot is not recoverable");
  loaded = await mediaStore.saveCloud("u1", "d1", loaded);
  ok(loaded.cloudSynced, "cloud media save does not mark the record synced");
  await mediaStore.deleteForSession("u1", "d1");
  eq(await mediaStore.loadForSession("u1", "d1"), null, "Decision screenshot survives explicit deletion");
});

await test("Decision chart screenshot is immutable after the pre-trade snapshot is locked", async () => {
  const model = await import(new URL("../core/decision-model.js?v=decision-chart-lock-test", import.meta.url));
  const base = model.normalizeDecisionSession({ ...model.createDecisionSession({ id: "chart-lock" }), status: "locked", chartImageAttached: true, lockedAt: 10 });
  let threw = false;
  try {
    model.assertDecisionMutationAllowed(base, { ...base, chartImageAttached: false });
  } catch (e) {
    threw = e?.message === "decision_locked_snapshot_mutation";
  }
  ok(threw, "locked Decision can silently change whether a chart screenshot belonged to the original decision");
});

await test("Decision screenshot UI uses a dedicated high-detail pipeline and Gemini receives optional image context", () => {
  const decisionUi = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-lab-ui.js"), "utf8");
  const mediaUtils = fs.readFileSync(path.join(root, "ui", "media-utils.js"), "utf8");
  const organizer = fs.readFileSync(path.join(root, "ai", "decision-organizer.js"), "utf8");
  ok(mediaUtils.includes("compressDecisionImageFile") && mediaUtils.includes("compressImageFile(file, 2200, 0.9, 780000)"), "Decision screenshot compressor is missing or too low-detail");
  ok(decisionUi.includes('type: "file", accept: "image/*"'), "Decision input has no chart screenshot picker");
  ok(decisionUi.includes("ScreenshotImage") && decisionUi.includes("replaceChartShot") && decisionUi.includes("removeChartScreenshot"), "Decision screenshot preview/replace/remove controls are incomplete");
  ok(organizer.includes("chartImageDataUrl") && organizer.includes("inlineData"), "Decision organizer does not send the optional chart screenshot to Gemini");
  ok(organizer.includes("Never create a new argument from the screenshot alone"), "Gemini screenshot context can invent standalone trading arguments");
});

await test("Decision screenshot participates in backup, restore and full reset", () => {
  const exportSection = appSource.slice(appSource.indexOf("const exportFullBackup"), appSource.indexOf("const importFullBackup"));
  const importSection = appSource.slice(appSource.indexOf("const importFullBackup"), appSource.indexOf("const resetJournal"));
  ok(exportSection.includes("decisionMediaStore.exportSessions"), "full backup omits Decision screenshots");
  ok(importSection.includes("decisionMediaStore.restoreSessions"), "full backup restore omits Decision screenshots");
  ok(appSource.includes("decisionMediaStore.clearUser(userId, decisionSessionIds)"), "full reset leaves Decision screenshots behind");
});

await test("journal screenshots preserve substantially more detail without inflating Strategy Lab records", () => {
  const mediaUtils = fs.readFileSync(path.join(root, "ui", "media-utils.js"), "utf8");
  const journalUi = fs.readFileSync(path.join(root, "features", "journal", "journal-ui.js"), "utf8");
  const strategyUi = fs.readFileSync(path.join(root, "features", "strategy", "strategy-lab.js"), "utf8");
  const primitives = fs.readFileSync(path.join(root, "ui", "primitives.js"), "utf8");
  ok(mediaUtils.includes("compressJournalImageFile"), "journal has no dedicated high-detail image pipeline");
  ok(mediaUtils.includes("compressImageFile(file, 2560, 0.9, 850000)"), "journal image pipeline is not using the high-detail Firestore-safe target");
  ok(journalUi.includes("compressJournalImageFile(file)"), "Journal is not using its dedicated high-detail compressor");
  ok(strategyUi.includes("compressImageFile(file)"), "Strategy Lab unexpectedly switched to the large Journal image payload");
  ok(mediaUtils.includes("maxDim = 1280") && mediaUtils.includes("quality = 0.72"), "shared/Strategy image defaults are no longer compact");
  ok(primitives.includes("Maximize2") && primitives.includes("zoomed"), "screenshot preview has no actual-size inspection mode");
});

await test("Decision polish cannot silently rewrite critical numeric/directional content", () => {
  const transcription = fs.readFileSync(path.join(root, "ai", "transcription-service.js"), "utf8");
  ok(transcription.includes("polishPreservesCriticalContent"), "transcript polish has no critical-content guard");
  ok(transcription.includes("before.numbers !== after.numbers"), "transcript polish can silently alter numbers");
  ok(transcription.includes("before.directions !== after.directions"), "transcript polish can silently alter LONG/SHORT direction");
  ok(transcription.includes("before.negationCount !== after.negationCount"), "transcript polish can silently drop negation");
  ok(transcription.includes("polishedLength < rawLength * 0.72"), "transcript polish can silently summarize a long voice note");
  ok(transcription.includes("cleanModelText"), "transcript output is not normalized away from accidental markdown fences");
});

await test("failed Decision draft replacement restores autosync eligibility", () => {
  const decisionUi = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-lab-ui.js"), "utf8");
  ok(decisionUi.includes("deletedSessionIdsRef.current.delete(activeDraft.id)"), "failed start-new deletion can leave the draft permanently excluded from autosync");
});

await test("startup plays the complete splash while profile bootstrap runs behind it", () => {
  const shellSource = fs.readFileSync(path.join(root, "ui", "app-shell.js"), "utf8");
  ok(!appSource.includes("STARTUP_SPLASH_FADE_MS"), "fixed splash fade budget returned");
  ok(!appSource.includes("STARTUP_SPLASH_HIDE_MS"), "fixed splash hide budget returned");
  ok(appSource.includes("splashVideoEnded"), "app does not wait for the actual video end");
  ok(appSource.includes("startupDataReady"), "splash is not coordinated with startup data readiness");
  ok(shellSource.includes("onEnded: () => onVideoEnd?.()"), "splash video end event is not wired");
  ok(shellSource.includes("fallbackTimerRef"), "splash playback failure can permanently block startup");
  ok(shellSource.includes("finishFallback(12000)"), "started-but-stalled splash playback has no watchdog");
  ok(appSource.includes("showIntroAfterExplicitAuthRef"), "returning-session BootIntro gate missing");
  ok(appSource.includes("const PROFILE_LOAD_TIMEOUT_MS = 10000;"), "profile timeout is not bounded to 10s");
  ok(appSource.includes("const PROFILE_LOAD_MAX_RETRIES = 1;"), "profile load still retries too many times");
  ok(!indexSource.includes("esm.sh"), "runtime esm.sh dependency returned");
  ok(!indexSource.includes("www.gstatic.com/firebasejs"), "runtime Firebase CDN dependency returned");
  ok(!indexSource.includes('type="importmap"'), "runtime import map returned after Vite migration");
  ok(fs.statSync(path.join(root, "public", "splash.mp4")).size < 700 * 1024, "splash video is still too large for startup");
});

await test("profile-store reads immutable revision chunks concurrently without changing reconstruction", async () => {
  const { createProfileStore } = await import(new URL("../core/profile-store.js?v=parallel-load-test", import.meta.url));
  const docs = new Map();
  const uid = "u-par";
  const base = "mind-exe-journal-state";
  const rev = "r1";
  docs.set(`${base}:split:${uid}:manifest`, JSON.stringify({ version:1, activeRevision:rev, history:[], sequence:1, updatedAt:null, journalResetAt:null, fullResetAt:null }));
  docs.set(`${base}:split:${uid}:rev:${rev}:core`, JSON.stringify({
    version:1, revisionId:rev, schemaVersion:2, createdAt:"2026-01-01T00:00:00.000Z",
    journalChunkCount:3, ledgerChunkCount:2, entryCount:3, ledgerCount:2,
    profile:{ version:2, user:{name:"P"}, journal:{entries:[]}, settings:{}, progress:{}, wallet:{coinLedger:[]} }
  }));
  for (let i = 0; i < 3; i++) docs.set(`${base}:split:${uid}:rev:${rev}:journal:${i}`, JSON.stringify({version:1,revisionId:rev,kind:"journal",index:i,items:[{id:`e${i}`}]}));
  for (let i = 0; i < 2; i++) docs.set(`${base}:split:${uid}:rev:${rev}:ledger:${i}`, JSON.stringify({version:1,revisionId:rev,kind:"ledger",index:i,items:[{id:`c${i}`}]}));
  let inFlight = 0;
  let maxInFlight = 0;
  const storageGet = async (key) => {
    inFlight += 1;
    maxInFlight = Math.max(maxInFlight, inFlight);
    await new Promise((r) => setTimeout(r, 8));
    inFlight -= 1;
    return docs.has(key) ? { key, value: docs.get(key) } : null;
  };
  const store = createProfileStore({
    storageGet,
    storageSet: async () => {},
    storageDelete: async () => {},
    getDocRef: (key) => ({key}),
    runTransaction: async () => {},
    db: {},
    profileBaseKey: base,
    schemaVersion: 2,
    logger: {warn(){}}
  });
  const loaded = await store.load(uid);
  eq(loaded.profile.journal.entries.map((x) => x.id).join(","), "e0,e1,e2", "parallel journal read changed order");
  eq(loaded.profile.wallet.coinLedger.map((x) => x.id).join(","), "c0,c1", "parallel ledger read changed order");
  ok(maxInFlight >= 5, `revision chunks were not loaded concurrently (max=${maxInFlight})`);
});

await test("Decision-linked journal cards lazy-load cloud snapshots only when expanded", () => {
  const panelSource = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-trade-panel.js"), "utf8");
  ok(panelSource.includes("const [expanded, setExpanded] = useState(false)"), "Decision trade panel still expands eagerly");
  ok(!panelSource.includes("useEffect(() => { load(); }"), "Decision trade panel still fires a Firestore read on every Journal mount");
  ok(panelSource.includes("if (next && !session && !loading) load();"), "Decision snapshot is not loaded on demand");
});

await test("MediaRecorder failures always release microphone tracks", async () => {
  const { createAudioRecorder } = await import(new URL("../audio/audio-recorder.js?v=cleanup-test", import.meta.url));
  let stopped = 0;
  const stream = { getTracks: () => [{ stop: () => { stopped += 1; } }] };
  class FailingRecorder {
    static isTypeSupported() { return true; }
    constructor() { this.state = "inactive"; this.mimeType = "audio/mp4"; this.error = new Error("recorder_fail"); }
    start() { this.state = "recording"; }
    stop() { this.state = "inactive"; this.onerror?.(); }
  }
  const recorder = createAudioRecorder({
    navigatorObj: { mediaDevices: { getUserMedia: async () => stream } },
    MediaRecorderImpl: FailingRecorder,
    now: (() => { let n = 0; return () => ++n; })()
  });
  await recorder.start();
  let failed = false;
  try { await recorder.stop(); } catch (e) { failed = e.message === "recorder_fail"; }
  ok(failed, "failing recorder did not reject");
  eq(stopped, 1, "microphone track was not released after recorder failure");
});

await test("Decision Lab UI is code-split out of the initial local module graph", () => {
  ok(appSource.includes('lazy(() => import("./features/decision-lab/decision-lab-ui.js")'), "Decision Lab is not lazy-loaded");
  ok(appSource.includes("jsx(Suspense"), "lazy Decision Lab has no Suspense boundary");
});

await test("Decision analytics counts one canonical factor observation per decision", async () => {
  const model = await import(new URL("../core/decision-model.js?v=dedupe-factor-test", import.meta.url));
  const analyticsMod = await import(new URL("../core/decision-analytics.js?v=dedupe-factor-test", import.meta.url));
  let s = model.createDecisionSession({ id: "dup-factor", mode: "direction", now: 1000, clarityBefore: 40 });
  s = model.setDecisionArguments(s, [
    { id:"a1", rawText:"дневка вниз", normalizedText:"Дневка вниз", side:"short", factorGroup:"market_structure", factorId:"higher_timeframe_trend", weight: 60, weightRated: true, emotionIntensity: 20 , emotionRated: true},
    { id:"a2", rawText:"старший тф медвежий", normalizedText:"Старший ТФ медвежий", side:"short", factorGroup:"market_structure", factorId:"higher_timeframe_trend", weight: 90, weightRated: true, emotionIntensity: 10, emotionRated: true, isDecisive:true }
  ]);
  s = model.lockDecisionSession({ ...s, preDecisionState: { clarityBefore: 40, clarityBeforeRated: true, clarityAfter: 75, clarityAfterRated: true, decisionConfidence: 70 , decisionConfidenceRated: true }, finalDecision:"short" });
  s = { ...s, status:"linked", linkedTradeId:"t1" };
  const a = analyticsMod.buildDecisionAnalytics([s], [{ id:"t1", status:"closed", outcome:"Win", realizedRR:1, resultMode:"R", r:1 }], "ru");
  const f = a.factors.find((x) => x.factorId === "higher_timeframe_trend");
  eq(f.usageCount, 1, "canonical factor usage counted duplicate thoughts as separate decisions");
  eq(f.argumentCount, 2, "raw argument count should still preserve both thoughts");
  eq(f.performance.sample, 1, "one trade was counted multiple times in factor performance");
  eq(f.averageWeight, 90, "representative factor reading did not prefer decisive/highest-weight argument");
});



await test("AI request runtime rejects duplicate in-flight operations and records privacy-safe timings", async () => {
  const rt = await import(new URL("../core/ai-request-runtime.js?v=runtime-test", import.meta.url));
  let release;
  const gate = new Promise((r) => { release = r; });
  const first = rt.runAiRequest({ key:"dup", operation:"TEST_AI", timeoutMs:1000, execute:()=>gate });
  let duplicate = false;
  try { await rt.runAiRequest({ key:"dup", operation:"TEST_AI", execute:async()=>"x" }); } catch (e) { duplicate = e.message === "ai_operation_in_progress"; }
  ok(duplicate, "duplicate AI request was allowed");
  release("ok"); eq(await first, "ok", "original AI request failed after duplicate rejection");
});

await test("Vision recognition gates low-confidence fields", () => {
  const src = fs.readFileSync(path.join(root, "ai", "trade-tools.js"), "utf8");
  ok(src.includes("const CONFIDENT = 0.72"), "vision has no confidence threshold");
  ok(src.includes("uncertainFields"), "vision does not surface uncertain fields");
});

await test("Journal polish protects newer manual text and distinguishes unchanged output", () => {
  const src = fs.readFileSync(path.join(root, "features", "journal", "journal-ui.js"), "utf8");
  ok(src.includes("latestTextRef.current"), "polish can overwrite newer manual text");
  ok(src.includes("Текст уже выглядит нормально"), "unchanged polish result is indistinguishable from failure");
  ok(src.includes("ответ ИИ не применён"), "stale polish response has no safe user feedback");
});

await test("Settings exposes privacy-safe local performance diagnostics", () => {
  const src = fs.readFileSync(path.join(root, "features", "settings", "settings-ui.js"), "utf8");
  ok(src.includes("getPerformanceTrace"), "diagnostics trace is not exposed in settings");
  ok(src.includes("Только локальные тайминги"), "diagnostics privacy explanation missing");
});

await test("Home defers non-critical AI/network work after initial interaction", () => {
  const src = fs.readFileSync(path.join(root, "features", "dashboard", "dashboard-ui.js"), "utf8");
  ok(src.includes("}, 1400)"), "market snapshot still starts immediately on Home mount");
  ok(src.includes("}, 1800)"), "home advice still starts immediately on Home mount");
});



await test("Decision transcript corrections remain canonical when a later voice/text fragment is appended", async () => {
  const model = await import(new URL("../core/decision-model.js?v=transcript-hardening-test", import.meta.url));
  let s = model.createDecisionSession({ id:"transcript1", mode:"direction", now:1000 });
  s = model.addDecisionTranscriptSegment(s, "биткоин выглядит сильно", "voice", 1100);
  s = model.setDecisionTranscript(s, "BTC выглядит слабо", 1200);
  s = model.addDecisionTranscriptSegment(s, "Но старший ТФ направлен вниз", "voice", 1300);
  ok(s.rawInput.combinedTranscript.startsWith("BTC выглядит слабо"), "manual transcript correction was rebuilt from stale source segments");
  ok(s.rawInput.combinedTranscript.includes("Но старший ТФ направлен вниз"), "later transcript fragment was not appended");
  ok(!s.rawInput.combinedTranscript.includes("биткоин выглядит сильно"), "stale pre-correction transcript resurfaced");
  eq(s.rawInput.transcriptEdited, true, "manual transcript correction flag was lost");
});

await test("Decision lock refuses synthetic defaults and analytics excludes legacy unrated values", async () => {
  const model = await import(new URL("../core/decision-model.js?v=rating-provenance-test", import.meta.url));
  const analyticsMod = await import(new URL("../core/decision-analytics.js?v=rating-provenance-test", import.meta.url));
  let draft = model.createDecisionSession({ id:"unrated-lock", mode:"direction", now:1000 });
  draft = model.setDecisionArguments(draft, [{
    id:"a1", rawText:"уровень", normalizedText:"Уровень поддержки", side:"long",
    factorGroup:"price_level", factorId:"support", weight:null, emotionIntensity:null
  }]);
  draft = { ...draft, finalDecision:"long", preDecisionState:{
    ...draft.preDecisionState,
    clarityBefore:50, clarityBeforeRated:false,
    clarityAfter:50, clarityAfterRated:false,
    decisionConfidence:50, decisionConfidenceRated:false
  }};
  const checked = model.validateDecisionForLock(draft);
  ok(!checked.ok, "unrated Decision draft was allowed to lock");

  const legacy = model.normalizeDecisionSession({
    id:"legacy-unrated", schemaVersion:1, mode:"direction", status:"linked", flowStep:"summary",
    createdAt:1000, updatedAt:1100, lockedAt:1050, linkedTradeId:"t1", finalDecision:"long",
    rawInput:{combinedTranscript:"", transcriptSegments:[], inputMethod:"text"},
    preDecisionState:{clarityBefore:50, clarityAfter:80, decisionConfidence:90},
    arguments:[{id:"a1",rawText:"уровень",normalizedText:"Уровень поддержки",side:"long",factorGroup:"price_level",factorId:"support",weight:50,emotionIntensity:0,isDecisive:true}],
    conditions:{longBecomesValidIf:[],shortBecomesValidIf:[]}
  });
  eq(legacy.arguments[0].weight, 50, "legacy numeric weight was not preserved for backwards-readable data");
  eq(legacy.arguments[0].weightRated, false, "legacy synthetic weight was incorrectly marked as explicit");
  const analytics = analyticsMod.buildDecisionAnalytics([legacy], [{id:"t1",status:"closed",outcome:"Win",realizedRR:1}], "ru");
  const factor = analytics.factors.find((row) => row.factorId === "support");
  eq(factor.averageWeight, null, "legacy unrated weight polluted factor average");
  eq(factor.averageEmotionIntensity, null, "legacy unrated emotion polluted factor average");
  eq(analytics.averageClarityDelta, null, "legacy unrated clarity polluted clarity analytics");
  eq(analytics.confidenceBands.extreme.sample, 0, "legacy unrated confidence polluted confidence analytics");
});

await test("Decision local draft cache preserves unsynced text state with a cloud base revision", async () => {
  const { createDecisionDraftCache } = await import(new URL("../core/decision-draft-cache.js?v=draft-cache-test", import.meta.url));
  const { createDecisionSession, setDecisionTranscript } = await import(new URL("../core/decision-model.js?v=draft-cache-test", import.meta.url));
  const map = new Map();
  const storage = {
    setItem:(k,v)=>map.set(k,String(v)),
    getItem:(k)=>map.has(k)?map.get(k):null,
    removeItem:(k)=>map.delete(k)
  };
  const cache = createDecisionDraftCache(storage);
  let s = createDecisionSession({id:"local-draft",mode:"direction",now:1000});
  s = setDecisionTranscript(s,"Исправленный локальный текст",1100);
  const record = cache.save("u1", s, 7);
  eq(record.baseRevision, 7, "draft cache lost cloud base revision");
  const loaded = cache.load("u1","local-draft");
  eq(loaded.session.rawInput.combinedTranscript, "Исправленный локальный текст", "unsynced Decision transcript was not recovered locally");
  eq(loaded.baseRevision, 7, "recovered draft lost revision guard");
  eq(cache.list("u1").length, 1, "draft manifest did not index cached draft");
  cache.remove("u1","local-draft");
  eq(cache.load("u1","local-draft"), null, "removed local draft remained recoverable");
});

await test("Decision index no longer truncates history and bulk session reads are concurrency-bounded", async () => {
  const { createDecisionStore } = await import(new URL("../core/decision-store.js?v=bounded-read-test", import.meta.url));
  const uid = "bulk-user";
  const indexKey = `mind-exe-decision-index:${uid}`;
  const rows = Array.from({length:510}, (_,i)=>({id:`d${i}`,createdAt:i+1,updatedAt:i+1,mode:"direction",status:"draft"}));
  const values = new Map([[indexKey, JSON.stringify({version:1,revision:3,sessions:rows})]]);
  for (let i=0;i<12;i++) values.set(`mind-exe-decision-session:${uid}:d${i}`, JSON.stringify({id:`d${i}`,mode:"direction",status:"draft",createdAt:i+1,updatedAt:i+1}));
  let inFlight=0, maxInFlight=0;
  const store = createDecisionStore({
    storageGet: async (key) => {
      if (key.includes("mind-exe-decision-session")) {
        inFlight++; maxInFlight=Math.max(maxInFlight,inFlight);
        await new Promise((r)=>setTimeout(r,4));
        inFlight--;
      }
      return values.has(key) ? {value:values.get(key)} : null;
    },
    storageDelete:async()=>{}, getDocRef:(key)=>({key}), runTransaction:async()=>{}, db:{}
  });
  const index = await store.loadIndex(uid);
  eq(index.sessions.length, 510, "Decision index still silently drops sessions after 500");
  const page = await store.loadSessionsPage(uid,{offset:498,limit:12,concurrency:3});
  eq(page.sessions.length, 12, "paged Decision loader did not load the requested tail page");
  ok(maxInFlight <= 3, `Decision bulk loader exceeded configured concurrency (${maxInFlight})`);
  ok(maxInFlight >= 2, "Decision bulk loader did not use bounded parallelism");
});

await test("Decision-to-Journal reconciliation repairs missing links but never overwrites a conflicting trade link", async () => {
  const { createDecisionStore } = await import(new URL("../core/decision-store.js?v=reconcile-test", import.meta.url));
  const model = await import(new URL("../core/decision-model.js?v=reconcile-test", import.meta.url));
  const docs = new Map();
  const ref = (key)=>({key});
  const snap = (key)=>({exists:()=>docs.has(key),data:()=>docs.get(key)});
  const store = createDecisionStore({
    storageGet: async (key)=>docs.has(key)?{value:docs.get(key).value,updatedAt:docs.get(key).updatedAt}:null,
    storageDelete:async(key)=>docs.delete(key), getDocRef:ref,
    runTransaction:async(_db,fn)=>fn({get:async(r)=>snap(r.key),set:(r,v)=>docs.set(r.key,v)}), db:{},
    now:(()=>{let n=2000;return()=>++n;})()
  });
  let s = model.createDecisionSession({id:"reconcile1",mode:"direction",clarityBefore:30,now:1000});
  s = model.setDecisionArguments(s,[{id:"a1",rawText:"тренд",normalizedText:"Тренд вниз",side:"short",factorGroup:"market_structure",factorId:"higher_timeframe_trend",weight:80,weightRated:true,emotionIntensity:20,emotionRated:true,isDecisive:true}]);
  s = model.lockDecisionSession({...s,preDecisionState:{clarityBefore:30,clarityBeforeRated:true,clarityAfter:75,clarityAfterRated:true,decisionConfidence:70,decisionConfidenceRated:true},finalDecision:"short"});
  const saved = await store.saveSession("u1",s);
  const result = await store.reconcileTradeLinks("u1",[{id:"trade1",decisionSessionId:saved.id}],{concurrency:2});
  eq(result.linked,1,"Journal reconciliation did not repair missing Decision link");
  const linked = await store.loadSession("u1",saved.id);
  eq(linked.linkedTradeId,"trade1","reconciled Decision does not point at Journal trade");
  let conflict=false;
  try { await store.linkTrade("u1",saved.id,"trade2"); } catch(e) { conflict=e?.message==="decision_trade_link_conflict"; }
  ok(conflict,"Decision link was silently moved from one Journal trade to another");
});

await test("Decision audio recorder exposes checkpoint chunks for durable iPhone/PWA recovery", async () => {
  const { createAudioRecorder } = await import(new URL("../audio/audio-recorder.js?v=checkpoint-test", import.meta.url));
  let stopped=0;
  const stream={getTracks:()=>[{stop:()=>{stopped++;}}]};
  class ChunkRecorder {
    static isTypeSupported(){return true;}
    constructor(){this.state="inactive";this.mimeType="audio/mp4";}
    start(timeslice){
      this.timeslice=timeslice; this.state="recording";
      queueMicrotask(()=>this.ondataavailable?.({data:new Blob(["abc"],{type:"audio/mp4"})}));
    }
    requestData(){}
    stop(){this.state="inactive"; this.onstop?.();}
  }
  const chunks=[];
  let clock=1000;
  const recorder=createAudioRecorder({
    navigatorObj:{mediaDevices:{getUserMedia:async()=>stream}}, MediaRecorderImpl:ChunkRecorder,
    now:()=>{clock+=100;return clock;}, timesliceMs:2000,
    onChunk:(blob,meta)=>chunks.push({size:blob.size,count:meta.chunkCount,duration:meta.durationMs})
  });
  await recorder.start();
  await new Promise((r)=>setTimeout(r,0));
  const result=await recorder.stop();
  eq(chunks.length,1,"audio chunk checkpoint callback was not emitted");
  eq(chunks[0].count,1,"audio checkpoint chunk count is wrong");
  ok(result.blob.size>0,"final audio blob lost checkpointed data");
  eq(stopped,1,"microphone track was not released after successful recording");
});


await test("Decision condition editor preserves spaces while typing and normalizes only on commit", () => {
  const ui = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-lab-ui.js"), "utf8");
  ok(ui.includes('conditionDrafts') && ui.includes('setConditionDrafts'), "conditions have no raw UI draft state");
  ok(!ui.includes('[firstKey]: lines(e.target.value)') && !ui.includes('[secondKey]: lines(e.target.value)'), "condition textarea still trims on every keystroke");
  ok(ui.includes('onBlur: () => commitConditionDrafts("first")') && ui.includes('onBlur: () => commitConditionDrafts("second")'), "condition normalization is not deferred until commit/blur");
  ok(ui.includes("const committed = commitConditionDrafts()") && ui.includes("onClick: enterDecisionStep"), "condition drafts are not committed before leaving the step");
});

await test("Decision factor picker uses the in-app listbox instead of native select", () => {
  const ui = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-lab-ui.js"), "utf8");
  ok(ui.includes("function AppSelect"), "custom Decision listbox component is missing");
  ok(ui.includes("max-h-[280px] overflow-y-auto"), "custom listbox is not scroll-bounded");
  ok(!ui.includes('jsx("select"'), "native select still leaks browser styling into Decision Lab");
  ok(ui.includes('aria-expanded'), "custom listbox lacks expanded state semantics");
});
await test("Decision Lab hardening keeps drafts local-first and prevents stale taxonomy/rating data", () => {
  const ui = fs.readFileSync(path.join(root,"features","decision-lab","decision-lab-ui.js"),"utf8");
  const model = fs.readFileSync(path.join(root,"core","decision-model.js"),"utf8");
  const store = fs.readFileSync(path.join(root,"core","decision-store.js"),"utf8");
  const audioStore = fs.readFileSync(path.join(root,"audio","audio-draft-store.js"),"utf8");
  ok(ui.includes("createDecisionDraftCache"),"Decision drafts are not cached locally before cloud sync");
  ok(ui.includes("scheduleDraftSync(normalized, seq)"),"Decision local edits are not background-synced");
  ok(ui.includes("next >= 180"),"voice recording has no 3-minute safety limit");
  ok(ui.includes('factorId: "other", factorGroup: "other"'),"manual argument edits can leave stale AI taxonomy behind");
  ok(ui.includes("DECISION_FACTORS"),"user cannot correct the normalized factor taxonomy");
  ok(model.includes("weightRated") && model.includes("emotionRated") && model.includes("clarityBeforeRated"),"explicit Decision rating provenance is missing");
  ok(audioStore.includes("transcriptText"),"transcribed audio text is not durable before cloud sync");
  ok(store.includes("mapWithConcurrency"),"Decision history/analytics reads are still unbounded");
  ok(appSource.includes("reconcileTradeLinks"),"Journal does not background-reconcile Decision links");
});



await test("Decision reconciliation refuses ambiguous duplicate Journal ownership", async () => {
  const { createDecisionStore } = await import(new URL("../core/decision-store.js?v=duplicate-link-test", import.meta.url));
  const model = await import(new URL("../core/decision-model.js?v=duplicate-link-test", import.meta.url));
  const docs = new Map();
  const ref=(key)=>({key});
  const snap=(key)=>({exists:()=>docs.has(key),data:()=>docs.get(key)});
  const store=createDecisionStore({
    storageGet:async(key)=>docs.has(key)?{value:docs.get(key).value}:null,
    storageDelete:async()=>{},getDocRef:ref,
    runTransaction:async(_db,fn)=>fn({get:async(r)=>snap(r.key),set:(r,v)=>docs.set(r.key,v)}),db:{}
  });
  let d=model.createDecisionSession({id:"dup-owner",mode:"direction",clarityBefore:40,now:1000});
  d=model.setDecisionArguments(d,[{id:"a1",rawText:"тренд",normalizedText:"Тренд",side:"long",factorGroup:"market_structure",factorId:"local_trend",weight:80,weightRated:true,emotionIntensity:10,emotionRated:true}]);
  d=model.lockDecisionSession({...d,preDecisionState:{clarityBefore:40,clarityBeforeRated:true,clarityAfter:70,clarityAfterRated:true,decisionConfidence:65,decisionConfidenceRated:true},finalDecision:"long"});
  await store.saveSession("u1",d);
  const result=await store.reconcileTradeLinks("u1",[
    {id:"t1",decisionSessionId:"dup-owner"},
    {id:"t2",decisionSessionId:"dup-owner"}
  ]);
  eq(result.conflicts,1,"ambiguous duplicate Journal ownership was not reported");
  const unchanged=await store.loadSession("u1","dup-owner");
  eq(unchanged.linkedTradeId,null,"reconciliation guessed a Journal owner for an ambiguous Decision");
});

await test("Decision audio drafts can be cleared per user without touching another account", async () => {
  const { createAudioDraftStore } = await import(new URL("../audio/audio-draft-store.js?v=audio-user-clear-test", import.meta.url));
  const store=createAudioDraftStore(null);
  await store.save({id:"a-u1",sessionId:"s1",userId:"u1",blob:new Blob(["1"],{type:"audio/mp4"})});
  await store.save({id:"a-u2",sessionId:"s2",userId:"u2",blob:new Blob(["2"],{type:"audio/mp4"})});
  await store.clearUser("u1");
  eq(await store.get("a-u1"),null,"full reset left current user's audio draft behind");
  ok(await store.get("a-u2"),"clearing one user's Decision audio deleted another user's draft");
});

await test("Decision analytics cloud loading skips draft and abandoned sessions before document reads", async () => {
  const { createDecisionStore } = await import(new URL("../core/decision-store.js?v=status-filter-test", import.meta.url));
  const uid="filter-user";
  const indexKey=`mind-exe-decision-index:${uid}`;
  const rows=[
    {id:"draft1",createdAt:1,updatedAt:1,mode:"direction",status:"draft"},
    {id:"abandoned1",createdAt:2,updatedAt:2,mode:"direction",status:"abandoned"},
    {id:"locked1",createdAt:3,updatedAt:3,mode:"direction",status:"locked"},
    {id:"linked1",createdAt:4,updatedAt:4,mode:"direction",status:"linked"}
  ];
  const values=new Map([[indexKey,JSON.stringify({version:1,revision:1,sessions:rows})]]);
  for (const row of rows) values.set(`mind-exe-decision-session:${uid}:${row.id}`,JSON.stringify({...row,flowStep:"summary"}));
  const readIds=[];
  const store=createDecisionStore({
    storageGet:async(key)=>{ if(key.includes("mind-exe-decision-session")) readIds.push(key); return values.has(key)?{value:values.get(key)}:null; },
    storageDelete:async()=>{},getDocRef:(key)=>({key}),runTransaction:async()=>{},db:{}
  });
  const loaded=await store.loadAllSessions(uid,{statuses:["locked","linked","reviewed"],concurrency:2});
  eq(loaded.length,2,"analytics status filtering returned non-analytic drafts");
  eq(readIds.length,2,"analytics still fetched draft/abandoned session documents");
  ok(readIds.every((key)=>key.endsWith("locked1")||key.endsWith("linked1")),"analytics fetched an excluded Decision status");
});



await test("Journal headline insights suppress isolated small-sample discipline rates", async () => {
  const analytics = await import(new URL("../analytics/trader-analytics.js?v=insight-quality-small", import.meta.url));
  const base = Date.UTC(2026, 0, 1, 10, 0);
  const rows = Array.from({ length: 6 }, (_, i) => ({
    id: `small-${i}`,
    date: new Date(base + i * 20 * 60000),
    status: "closed",
    outcome: i % 2 ? "Win" : "Loss",
    realizedRR: i % 2 ? 1 : -1,
    r: i % 2 ? 1 : -1,
    resultMode: "R",
    x: 50,
    y: 50,
    pull: "—",
    lesson: "—",
    screenshots: []
  }));
  const result = analytics.calculateTraderAnalytics(rows, null, "ru");
  ok(result.discipline.violations.some((v) => v.id === "revenge_rate"), "test fixture did not create the raw discipline rate");
  ok(!result.insights.some((i) => i.id === "discipline_revenge_rate"), "isolated revenge frequency still leaks into headline insights");
  eq(result.insights.length, 0, "small sample fabricated a headline insight instead of staying quiet");
});

await test("Journal headline insight prefers a two-sided realized-RR comparison when evidence is repeated", async () => {
  const analytics = await import(new URL("../analytics/trader-analytics.js?v=insight-quality-comparison", import.meta.url));
  const rows = [];
  let id = 0;
  const add = (day, minute, outcome, rr) => rows.push({
    id: `cmp-${id++}`,
    date: new Date(Date.UTC(2026, 0, 1 + day, 10, 0) + minute * 60000),
    status: "closed", outcome, realizedRR: rr, r: rr, resultMode: "R",
    x: 50, y: 50, pull: "—", lesson: "—", screenshots: []
  });
  for (let d = 0; d < 5; d++) { add(d * 2, 0, "Loss", -1); add(d * 2, 10, "Win", 0.2); }
  for (let d = 0; d < 5; d++) { add(d * 2 + 1, 0, "Loss", -1); add(d * 2 + 1, 90, "Win", 1.5); }
  const result = analytics.calculateTraderAnalytics(rows, null, "ru");
  eq(result.insights[0]?.id, "compare_fast_after_loss", "useful comparison did not outrank generic headline candidates");
  ok(result.insights[0].text.includes("5 сделок") && result.insights[0].text.includes("+0.2R") && result.insights[0].text.includes("+1.5R"), "comparison insight lost its two real samples/results");
  ok(result.insights[0].text.includes("не доказательство"), "comparison insight presents observational journal data as causation");
});

await test("Home and Coach insight generation gate weak evidence and reject causal wording", () => {
  const service = fs.readFileSync(path.join(root, "ai", "ai-service.js"), "utf8");
  const dashboard = fs.readFileSync(path.join(root, "features", "dashboard", "dashboard-ui.js"), "utf8");
  ok(service.includes("aiHasUsefulJournalInsightEvidence") && service.includes("An isolated frequency"), "AI insight prompt still accepts isolated counts as useful analysis");
  ok(service.includes("aiAssertJournalInsightQuality") && service.includes("ai_insight_causal_overreach"), "AI insight output has no causal-overreach guard");
  ok(service.includes("2 of 6 trades were closed manually"), "home insight prompt lost the concrete rejected weak-example guard");
  ok(dashboard.includes('HOME_ADVICE_KEY = "home-advice-v2"'), "old cached weak home insight can survive the quality-gate release");
});

await test("Decision choice controls share display typography and neutral-only balance has an honest state", () => {
  const ui = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-lab-ui.js"), "utf8");
  ok(ui.includes("function DecisionChoiceButton") && ui.includes('fontFamily: "var(--font-display)"'), "Decision LONG/SHORT controls still use ad-hoc typography");
  ok(!ui.includes('className: "px-2 py-1 rounded-full text-[9px] uppercase tracking-wide"'), "old tiny uppercase side-chip style is still present");
  ok(ui.includes("neutralOnlyBalance") && ui.includes("neutralOnly ? l.neutralOnlyBalance"), "neutral-only reasoning still looks like missing ratings/broken balance");
});

await test("Decision psychology first-run path uses qualitative balance plus one automatic model-response retry", () => {
  const psychology = fs.readFileSync(path.join(root, "ai", "decision-psychology.js"), "utf8");
  ok(psychology.includes("psychologyBalanceForAi") && psychology.includes("qualitative only; the UI renders exact values"), "Gemini still receives the exact deterministic percentages it was forbidden to repeat");
  ok(psychology.includes("Do not quote or invent") && psychology.includes("Do not repeat numeric weights/intensities"), "psychology prompt does not explicitly prevent numeric echo on first generation");
  ok(psychology.includes("retries: 1") && psychology.includes("decision_psychology_model_response_rejected"), "malformed/guard-rejected psychology response still requires a manual second attempt");
});

await test("Decision psychological balance is deterministic and separates logic from emotion", async () => {
  const model = await import(new URL("../core/decision-model.js?v=psych-balance-model", import.meta.url));
  const psych = await import(new URL("../core/decision-psychology.js?v=psych-balance-core", import.meta.url));
  let session = model.createDecisionSession({ id: "psych-balance", mode: "direction", clarityBefore: 30, now: 1000 });
  session = model.setDecisionArguments(session, [
    { id: "l1", rawText: "long fact", normalizedText: "Long fact", side: "long", factorGroup: "other", factorId: "other", weight: 80, weightRated: true, emotionIntensity: 20, emotionRated: true },
    { id: "s1", rawText: "short fact", normalizedText: "Short fact", side: "short", factorGroup: "other", factorId: "other", weight: 20, weightRated: true, emotionIntensity: 80, emotionRated: true },
    { id: "n1", rawText: "unclear", normalizedText: "Unclear", side: "neutral", factorGroup: "other", factorId: "other", weight: 100, weightRated: true, emotionIntensity: 100, emotionRated: true }
  ], 1100);
  const balance = psych.calculateDecisionThoughtBalance(session);
  eq(balance.logical.leftPct, 80, "logical LONG share was not derived from user weights");
  eq(balance.logical.rightPct, 20, "logical SHORT share was not derived from user weights");
  eq(balance.logical.neutralSharePct, 50, "logical neutral share is wrong");
  eq(balance.emotional.leftPct, 20, "emotional LONG share was mixed with logical weight");
  eq(balance.emotional.rightPct, 80, "emotional SHORT share was mixed with logical weight");
  eq(balance.alignment, "conflict", "logic/emotion conflict was not detected");
});

await test("Decision psychology context excludes chart and instrument data from Gemini", async () => {
  const model = await import(new URL("../core/decision-model.js?v=psych-context-model", import.meta.url));
  const psych = await import(new URL("../core/decision-psychology.js?v=psych-context-core", import.meta.url));
  let session = model.createDecisionSession({ id: "psych-context", mode: "direction", symbol: "BTCUSDT", clarityBefore: 40, now: 1000 });
  session = { ...session, chartImageAttached: true };
  const context = psych.buildDecisionPsychologyContext(session);
  ok(!Object.prototype.hasOwnProperty.call(context, "symbol"), "psychological context leaks ticker/instrument data");
  ok(!Object.prototype.hasOwnProperty.call(context, "chartImageAttached"), "psychological context leaks chart metadata");
  const ai = fs.readFileSync(path.join(root, "ai", "decision-psychology.js"), "utf8");
  ok(!ai.includes("chartImageDataUrl") && !ai.includes("inlineData"), "psychological Gemini path can receive a chart image");
  ok(ai.includes("Do NOT decide whether any market statement is true") && ai.includes("Do NOT improve, correct or teach the trader's strategy"), "psychology prompt lacks hard market/strategy boundaries");
  ok(ai.includes("tradingQuestion") && ai.includes("decision_psychology_strategy_leak"), "psychology response guard does not reject prescriptive self-questions");
});

await test("Decision psychology fingerprint follows reasoning edits but ignores the eventual choice", async () => {
  const model = await import(new URL("../core/decision-model.js?v=psych-hash-model", import.meta.url));
  const psych = await import(new URL("../core/decision-psychology.js?v=psych-hash-core", import.meta.url));
  let session = model.createDecisionSession({ id: "psych-hash", mode: "direction", clarityBefore: 25, now: 1000 });
  session = model.setDecisionArguments(session, [{ id: "a", rawText: "one", normalizedText: "One", side: "long", factorGroup: "other", factorId: "other", weight: 60, weightRated: true, emotionIntensity: 30, emotionRated: true }], 1100);
  const h1 = psych.decisionPsychologyInputHash(session);
  const h2 = psych.decisionPsychologyInputHash({ ...session, finalDecision: "long", preDecisionState: { ...session.preDecisionState, clarityAfter: 80, clarityAfterRated: true } });
  eq(h2, h1, "post-synthesis clarity/final choice incorrectly changes psychology input fingerprint");
  const changed = { ...session, arguments: session.arguments.map((arg) => ({ ...arg, weight: 90 })) };
  ok(psych.decisionPsychologyInputHash(changed) !== h1, "argument weight edit does not invalidate psychological synthesis");
});

await test("Decision psychological synthesis is part of the immutable pre-trade snapshot", async () => {
  const model = await import(new URL("../core/decision-model.js?v=psych-lock-model", import.meta.url));
  const psych = await import(new URL("../core/decision-psychology.js?v=psych-lock-core", import.meta.url));
  let session = model.createDecisionSession({ id: "psych-lock", mode: "direction", clarityBefore: 30, now: 1000 });
  session = model.setDecisionArguments(session, [{ id: "a", rawText: "one", normalizedText: "One", side: "long", factorGroup: "other", factorId: "other", weight: 70, weightRated: true, emotionIntensity: 40, emotionRated: true }], 1100);
  const hash = psych.decisionPsychologyInputHash(session);
  session = model.setDecisionPsychologySynthesis(session, {
    sideASummary: "A", sideBSummary: "B", neutralSummary: "", strongPattern: "Strong", weakPattern: "Weak", mainConflict: "Conflict", selfQuestion: "Question?"
  }, hash, 1200);
  session = { ...session, preDecisionState: { ...session.preDecisionState, clarityAfter: 60, clarityAfterRated: true, decisionConfidence: 55, decisionConfidenceRated: true }, finalDecision: "long" };
  const locked = model.lockDecisionSession(session, 1300);
  ok(model.decisionLockedSnapshot(locked).psychologySynthesis?.inputHash === hash, "locked snapshot lost psychological synthesis");
  let blocked = false;
  try { model.assertDecisionMutationAllowed(locked, { ...locked, psychologySynthesis: { ...locked.psychologySynthesis, mainConflict: "Rewritten after result" } }); } catch (e) { blocked = e.message === "decision_locked_snapshot_mutation"; }
  ok(blocked, "locked psychological synthesis can be rewritten after the decision");
});

await test("Decision final clarity is collected after psychological synthesis or explicit skip", () => {
  const ui = fs.readFileSync(path.join(root, "features", "decision-lab", "decision-lab-ui.js"), "utf8");
  ok(ui.includes("psychologyReady && jsxs(Panel") && ui.includes("label: l.clarityAfter"), "clarity-after rating is not gated behind the psychology stage");
  ok(ui.includes("calculateDecisionThoughtBalance(active)"), "final screen does not show deterministic thought balance");
  ok(ui.includes("PsychologySynthesisCard"), "Gemini psychological synthesis is not rendered on the final screen");
  ok(ui.includes("psychologySynthesis: null") && ui.includes("decisionPsychologyInputHash"), "stale psychological synthesis is not invalidated/revalidated after reasoning changes");
});

await test("Approach 1 re-audit routes all major Gemini operations through the common AI runtime", () => {
  const service = fs.readFileSync(path.join(root,"ai","ai-service.js"),"utf8");
  const tools = fs.readFileSync(path.join(root,"ai","trade-tools.js"),"utf8");
  const organizer = fs.readFileSync(path.join(root,"ai","decision-organizer.js"),"utf8");
  const psychology = fs.readFileSync(path.join(root,"ai","decision-psychology.js"),"utf8");
  const transcription = fs.readFileSync(path.join(root,"ai","transcription-service.js"),"utf8");
  ok(service.includes('runAiRequest'),"general AI service bypasses the shared request runtime");
  ok(service.includes('AI_COACH_ANALYZE') && service.includes('AI_COACH_CHAT'),"Coach AI operations are not individually traceable");
  ok(service.includes('AI_HOME_ADVICE') && service.includes('AI_MARKET_GROUNDED') && service.includes('AI_CALIBRATION'),"background AI operations are not routed through the shared runtime");
  ok(!service.includes('caWithTimeout(model.generateContent'),"general AI service still has an untracked direct model timeout");
  ok(tools.includes('AI_STRATEGY_ANALYSIS'),"Strategy analysis bypasses shared AI diagnostics");
  ok(!tools.includes('caWithTimeout(model.generateContent'),"trade AI tools still bypass the shared runtime");
  ok(organizer.includes('runAiRequest') && psychology.includes('runAiRequest') && transcription.includes('runAiRequest'),"Decision AI operations bypass shared runtime");
  ok(psychology.includes('DECISION_PSYCHOLOGY_SYNTHESIS') && psychology.includes('decision_psychology_strategy_leak'),"Decision psychology synthesis lacks traceability/strategy-leak guard");
});

await test("AI runtime releases a timed-out operation and retries transient failures only once when configured", async () => {
  const rt = await import(new URL("../core/ai-request-runtime.js?v=runtime-reaudit-test", import.meta.url));
  let timedOut=false;
  try { await rt.runAiRequest({key:"timeout-release",operation:"TEST_TIMEOUT",timeoutMs:20,execute:()=>new Promise(()=>{})}); } catch(e) { timedOut=/timeout/i.test(e?.message||e?.code||""); }
  ok(timedOut,"AI runtime did not surface its timeout");
  eq(await rt.runAiRequest({key:"timeout-release",operation:"TEST_AFTER_TIMEOUT",timeoutMs:100,execute:async()=>"ok"}),"ok","timed-out AI key remained permanently locked");
  let calls=0;
  const value=await rt.runAiRequest({key:"retry-once",operation:"TEST_RETRY",timeoutMs:200,retries:1,retryDelayMs:1,execute:async()=>{ calls++; if(calls===1) throw new Error("temporary_network_failure"); return "recovered"; }});
  eq(value,"recovered","configured transient retry did not recover");
  eq(calls,2,"AI runtime retried an unexpected number of times");
});

await test("Screenshot compression avoids synchronous toDataURL and keeps an iOS-safe decode fallback", () => {
  const src = fs.readFileSync(path.join(root,"ui","media-utils.js"),"utf8");
  ok(src.includes('createImageBitmap'),"screenshot compression does not use asynchronous bitmap decode when available");
  ok(src.includes('canvas.toBlob'),"screenshot compression does not use asynchronous canvas encoding");
  ok(!src.includes('canvas.toDataURL'),"large screenshot compression still performs synchronous toDataURL encoding");
  ok(src.includes('new Image()'),"image compression lost its Safari/iOS fallback decoder");
});

await test("Vision recognition never overwrites fields edited while AI is running and exposes slow/error states", () => {
  const src = fs.readFileSync(path.join(root,"features","journal","journal-ui.js"),"utf8");
  ok(src.includes('recognitionFieldsRef.current'),"vision has no latest-field guard");
  ok(src.includes('ИИ их не перезаписал'),"vision does not tell the trader when manual edits were protected");
  ok(src.includes('Анализ занимает больше времени'),"vision has no slow-request UI state");
  ok(src.includes('/timeout/i.test(msg)'),"vision timeout is indistinguishable from a generic recognition error");
});

await test("Performance diagnostics cover auth, profile, module delay and interactive readiness", () => {
  const app = fs.readFileSync(path.join(root,"app.js"),"utf8");
  const trace = fs.readFileSync(path.join(root,"core","performance-trace.js"),"utf8");
  const settings = fs.readFileSync(path.join(root,"features","settings","settings-ui.js"),"utf8");
  ok(app.includes('AUTH_RESOLVE'),"auth resolution timing is absent from diagnostics");
  ok(app.includes('PROFILE_LOAD') && app.includes('retry_start'),"profile retries are not distinguishable in diagnostics");
  ok(app.includes('INTERACTIVE'),"time-to-interactive is absent from diagnostics");
  ok(app.includes('__mindExePageStartedAt'),"module timing is not navigation-relative");
  ok(trace.includes('replace(/https?:\\/\\/\\S+/gi, "url")'),"diagnostics error codes are not privacy-sanitized");
  ok(settings.includes('Скопировать журнал'),"diagnostic log cannot be copied from Settings");
});

await test("Home auto AI work is idle-scheduled and no longer wraps an AI call in a second timeout", () => {
  const src = fs.readFileSync(path.join(root,"features","dashboard","dashboard-ui.js"),"utf8");
  ok(src.includes('requestIdleCallback'),"Home background AI/network work is only delayed, not idle-scheduled");
  ok(src.includes('scheduleBackgroundTask'),"Home has no shared background scheduling helper");
  ok(!src.includes('caWithTimeout(aiGenerateHomeAdvice'),"Home advice is still double-wrapped by two independent timeouts");
});


await test("Approach 3 uses a Vite/npm production graph with no runtime dependency CDN", () => {
  const pkg = JSON.parse(packageSource);
  eq(pkg.version, "5.4.5", "package release version not bumped");
  ok(pkg.scripts?.build?.includes("vite build"), "production build does not use Vite");
  for (const dep of ["react", "react-dom", "firebase", "lucide-react", "recharts"]) {
    ok(pkg.dependencies?.[dep], `npm dependency missing: ${dep}`);
  }
  ok(pkg.devDependencies?.vite && pkg.devDependencies?.tailwindcss, "Vite/Tailwind build dependencies missing");
  ok(viteConfigSource.includes('base: "./"'), "relative deployment base is missing");
  ok(viteConfigSource.includes('vendor-firebase') && viteConfigSource.includes('vendor-charts'), "vendor chunk plan missing");
  ok(indexSource.includes('<script type="module" src="./app.js"></script>'), "Vite source entry is missing");
  for (const forbidden of ["type=\"importmap\"", "https://esm.sh", "cdn.tailwindcss.com", "www.gstatic.com/firebasejs"]) {
    ok(!indexSource.includes(forbidden), `runtime CDN/import-map dependency remains: ${forbidden}`);
  }
});

await test("Final dependency floor includes audited Firebase and Vite fixes", () => {
  const pkg = JSON.parse(packageSource);
  eq(pkg.dependencies?.firebase, "12.19.0", "Firebase dependency regressed below the audited release");
  eq(pkg.devDependencies?.vite, "7.3.5", "Vite dependency regressed below the audited security floor");
});

await test("Splash media has one canonical Vite source", () => {
  ok(fs.existsSync(path.join(root, "public", "splash.mp4")), "public splash video is missing");
  ok(fs.existsSync(path.join(root, "public", "splash-poster.jpg")), "public splash poster is missing");
  ok(!fs.existsSync(path.join(root, "splash.mp4")), "duplicate root splash video returned");
  ok(!fs.existsSync(path.join(root, "splash-poster.jpg")), "duplicate root splash poster returned");
});

await test("Approach 3 static Tailwind build contains critical responsive and arbitrary utilities", () => {
  for (const token of [
    ".flex", ".grid", ".rounded-\\[18px\\]", ".grid-cols-\\[1fr_auto_1fr\\]",
    ".z-\\[120\\]", ".max-w-\\[calc\\(100\\%-24px\\)\\]", ".md\\:ml-\\[232px\\]"
  ]) ok(stylesSource.includes(token), `compiled CSS lost utility: ${token}`);
  ok(stylesSource.includes("mind.exe production shell"), "custom production shell CSS missing");
  ok(!indexSource.includes("tailwind.config"), "runtime Tailwind configuration remains in index.html");
});

await test("Approach 3 code-splits heavy feature UI out of the startup module", () => {
  for (const feature of [
    "./features/dashboard/dashboard-ui.js",
    "./features/strategy/strategy-lab.js",
    "./features/settings/settings-ui.js",
    "./features/coach/coach-ui.js",
    "./features/calibration/calibration-ui.js",
    "./features/decision-lab/decision-lab-ui.js"
  ]) ok(appSource.includes(`lazy(() => import("${feature}")`), `heavy feature is eager: ${feature}`);
  ok(!appSource.includes('from "recharts"'), "Recharts returned to the initial app module");
  ok(!dashboardDataSource.includes("recharts"), "lightweight dashboard data bridge pulls chart code into startup");
  ok(appSource.includes("FeatureSuspense"), "lazy features have no shared Suspense boundary");
});

await test("Approach 3 fast profile bootstrap trusts only a cloud-confirmed full local snapshot", () => {
  ok(appSource.includes('PROFILE_SHADOW_CONFIRMED_VERSION = "full-v1"'), "confirmed-shadow format marker missing");
  ok(appSource.includes("requireConfirmed: true"), "startup accepts legacy/unconfirmed local shadows");
  ok(appSource.includes("removeItem(directShadowConfirmedKey(userId))"), "optimistic local writes do not invalidate confirmed-shadow status");
  ok(appSource.includes("writeDirectProfileShadow(userId, committedProfile, { confirmed: true })"), "committed saves do not re-confirm the local snapshot");
  ok(appSource.includes("if (profile) writeDirectProfileShadow(userId, profile, { confirmed: true })"), "successful cloud load does not refresh the full confirmed snapshot");
  ok(appSource.includes("canPersistRef.current = true") && appSource.includes("setCloudProfileReady(true)"), "writes are not unlocked after cloud verification");
  ok(appSource.indexOf("canPersistRef.current = false;") < appSource.indexOf("const shadow = readDirectProfileShadow"), "writes are not disabled before local bootstrap");
});

await test("profile-store writes immutable revision documents concurrently before manifest activation", async () => {
  const { createProfileStore } = await import(new URL("../core/profile-store.js?v=parallel-write-test", import.meta.url));
  let active = 0, maxActive = 0, writesFinished = 0, manifestObservedFinished = -1;
  const docs = new Map();
  let manifestValue = null;
  const store = createProfileStore({
    storageGet: async (key) => key.endsWith(":manifest") ? (manifestValue ? { value: manifestValue } : null) : (docs.has(key) ? { value: docs.get(key) } : null),
    storageSet: async (key, value) => {
      active += 1; maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 8));
      docs.set(key, value); writesFinished += 1; active -= 1;
    },
    storageDelete: async (key) => { docs.delete(key); },
    getDocRef: (key) => ({ key }),
    runTransaction: async (_db, fn) => {
      manifestObservedFinished = writesFinished;
      let pending = null;
      await fn({
        get: async () => ({ exists: () => manifestValue != null, data: () => ({ value: manifestValue }) }),
        set: (_ref, payload) => { pending = payload; }
      });
      if (pending) manifestValue = pending.value;
    },
    db: {}, profileBaseKey: "mind-exe-journal-state", schemaVersion: 2,
    revisionIdFactory: () => "parallel-r1", logger: { warn() {} }
  });
  await store.load("u-par-write");
  const entries = Array.from({ length: 240 }, (_, i) => ({ id: `e${i}`, note: "x".repeat(5000) }));
  const result = await store.save("u-par-write", { version:2,user:{},journal:{entries},settings:{},progress:{},wallet:{coinLedger:Array.from({length:210},(_,i)=>({id:`c${i}`,note:"y".repeat(3000)}))} });
  ok(result.journalChunkCount > 1 && result.ledgerChunkCount > 1, "parallel-write fixture did not create multiple chunks");
  ok(maxActive > 1, "immutable revision documents still write sequentially");
  eq(manifestObservedFinished, writesFinished, "manifest transaction began before all immutable writes completed");
});

await test("profile-store never activates a partially failed parallel revision and cleans its keys", async () => {
  const { createProfileStore } = await import(new URL("../core/profile-store.js?v=parallel-failure-test", import.meta.url));
  const deleted = [];
  let txCalls = 0;
  const store = createProfileStore({
    storageGet: async () => null,
    storageSet: async (key) => {
      if (key.includes(":journal:1")) throw new Error("simulated_chunk_failure");
      await new Promise((resolve) => setTimeout(resolve, 2));
    },
    storageDelete: async (key) => { deleted.push(key); },
    getDocRef: (key) => ({ key }),
    runTransaction: async () => { txCalls += 1; },
    db: {}, profileBaseKey: "mind-exe-journal-state", schemaVersion: 2,
    revisionIdFactory: () => "failed-r1", logger: { warn() {} }
  });
  await store.load("u-fail-write");
  let failed = false;
  try {
    await store.save("u-fail-write", { version:2,user:{},journal:{entries:Array.from({length:220},(_,i)=>({id:`e${i}`,note:"z".repeat(5000)}))},settings:{},progress:{},wallet:{coinLedger:[]} });
  } catch (e) { failed = e.message === "simulated_chunk_failure"; }
  ok(failed, "parallel chunk failure was swallowed");
  eq(txCalls, 0, "manifest transaction ran after an incomplete revision write");
  ok(deleted.some((key) => key.endsWith(":core")) && deleted.some((key) => key.includes(":journal:1")), "failed revision keys were not comprehensively cleaned");
});

await test("Approach 3 service worker is same-origin only, build-precache aware and deferred until cloud readiness", () => {
  ok(serviceWorkerSource.includes('CACHE_NAME = "mind-exe-shell-v5.4.5"'), "service-worker cache generation is stale");
  ok(!serviceWorkerSource.includes("skipWaiting"), "service worker still forces activation and can invalidate lazy chunks in an already-open old client");
  ok(serviceWorkerSource.includes('url.origin !== self.location.origin'), "service worker can intercept external Firebase/Gemini traffic");
  ok(serviceWorkerSource.includes("PRECACHE_URLS.map"), "service worker does not support build-generated shell precaching");
  ok(viteConfigSource.includes("service worker precache marker") && viteConfigSource.includes("PRECACHE_EXTENSIONS"), "Vite build does not inject hashed shell assets into the service worker");
  ok(appSource.includes('if (!cloudProfileReady || !import.meta.env?.PROD'), "service worker registration is not gated by cloud profile readiness/production");
  ok(appSource.includes('scheduleIdleTask(() =>') && appSource.includes('navigator.serviceWorker.register("./sw.js")'), "service worker registration competes directly with critical startup work");
});


await test("Final QA pins the Node runtime to versions supported by Vite 7", () => {
  const pkg = JSON.parse(packageSource);
  eq(pkg.engines?.node, "^20.19.0 || >=22.12.0", "Node engine range admits unsupported Vite 7 runtimes");
  ok(!viteConfigSource.includes('from "vite"'), "Vite config cannot be smoke-tested without installing the bundler");
});

await test("Final QA ships a complete installable PWA manifest and icon set", () => {
  const manifestPath = path.join(root, "manifest.json");
  ok(fs.existsSync(manifestPath), "manifest.json is missing from the source release");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  eq(manifest.start_url, "./", "PWA start_url is not subdirectory-safe");
  eq(manifest.scope, "./", "PWA scope is not subdirectory-safe");
  eq(manifest.display, "standalone", "PWA no longer installs as a standalone app");
  for (const size of [16, 32, 180, 192, 512]) {
    const iconPath = path.join(root, `icon-${size}.png`);
    ok(fs.existsSync(iconPath), `PWA icon missing: icon-${size}.png`);
    const png = fs.readFileSync(iconPath);
    ok(png.length > 24 && png.toString("hex", 1, 4) === "504e47", `PWA icon is not a PNG: icon-${size}.png`);
    eq(png.readUInt32BE(16), size, `PWA icon width mismatch: icon-${size}.png`);
    eq(png.readUInt32BE(20), size, `PWA icon height mismatch: icon-${size}.png`);
  }
  const manifestIconSizes = new Set((manifest.icons || []).map((row) => row.sizes));
  ok(manifestIconSizes.has("192x192") && manifestIconSizes.has("512x512"), "manifest lacks required install icons");
  ok(indexSource.includes('%BASE_URL%manifest.json') && indexSource.includes('%BASE_URL%icon-180.png'), "index.html no longer points at packaged PWA assets");
});

await test("Final QA build hook copies PWA assets and injects only real hashed shell files", async () => {
  const mod = await import(new URL(`../vite.config.js?qa=${Date.now()}`, import.meta.url));
  const config = mod.default;
  const plugin = (config.plugins || []).find((row) => row?.name === "mind-exe-copy-root-pwa-assets");
  ok(plugin && typeof plugin.closeBundle === "function", "PWA closeBundle hook is missing");
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "mindexe-build-hook-"));
  const previousCwd = process.cwd();
  try {
    fs.mkdirSync(path.join(tmp, "dist", "assets"), { recursive: true });
    fs.writeFileSync(path.join(tmp, "manifest.json"), fs.readFileSync(path.join(root, "manifest.json")));
    fs.writeFileSync(path.join(tmp, "icon-192.png"), fs.readFileSync(path.join(root, "icon-192.png")));
    fs.writeFileSync(path.join(tmp, "dist", "sw.js"), 'const PRECACHE_URLS = ["./"];\n');
    fs.writeFileSync(path.join(tmp, "dist", "index.html"), "<html></html>");
    fs.writeFileSync(path.join(tmp, "dist", "assets", "main-abc123.js"), "console.log(1)");
    fs.writeFileSync(path.join(tmp, "dist", "assets", "main-def456.css"), "body{}");
    fs.writeFileSync(path.join(tmp, "dist", "splash.mp4"), "video");
    process.chdir(tmp);
    await plugin.closeBundle();
    const sw = fs.readFileSync(path.join(tmp, "dist", "sw.js"), "utf8");
    ok(fs.existsSync(path.join(tmp, "dist", "manifest.json")), "build hook did not copy manifest.json");
    ok(fs.existsSync(path.join(tmp, "dist", "icon-192.png")), "build hook did not copy root icon");
    ok(sw.includes("./assets/main-abc123.js") && sw.includes("./assets/main-def456.css"), "hashed JS/CSS assets were not injected into precache");
    ok(sw.includes("./index.html") && sw.includes("./manifest.json"), "shell metadata was not injected into precache");
    ok(!sw.includes("./splash.mp4"), "large splash video was accidentally added to install-time precache");
  } finally {
    process.chdir(previousCwd);
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

await test("Final QA local module graph stays acyclic", () => {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (["node_modules", "dist", ".git"].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".js")) files.push(full);
    }
  };
  walk(root);
  const fileSet = new Set(files.map((file) => path.resolve(file)));
  const graph = new Map();
  const importRe = /(?:from\s*["']|import\s*\(\s*["'])(\.[^"']+)["']/g;
  for (const file of files) {
    const deps = [];
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(importRe)) {
      let target = path.resolve(path.dirname(file), match[1]);
      if (!path.extname(target)) target += ".js";
      if (fileSet.has(target)) deps.push(target);
    }
    graph.set(path.resolve(file), deps);
  }
  const state = new Map();
  const stack = [];
  const visit = (node) => {
    state.set(node, 1); stack.push(node);
    for (const dep of graph.get(node) || []) {
      if (!state.get(dep)) visit(dep);
      else if (state.get(dep) === 1) {
        const i = stack.indexOf(dep);
        throw new Error(`local import cycle: ${[...stack.slice(i), dep].map((x) => path.relative(root, x)).join(" -> ")}`);
      }
    }
    stack.pop(); state.set(node, 2);
  };
  for (const file of graph.keys()) if (!state.get(file)) visit(file);
});

await test("Approach 3 defers Strategy and Decision reconciliation until the cloud profile is ready", () => {
  ok(appSource.includes('if (authStatus !== "authenticated" || !cloudProfileReady || !userId || migrateFor'), "Strategy load is not gated by cloud profile readiness");
  ok(appSource.includes('scheduleIdleTask(() => load(), tab === "strategies" ? 100 : 1200)'), "Strategy background load is not idle-scheduled");
  ok(appSource.includes('if (!loaded || !cloudProfileReady || authStatus !== "authenticated" || !userId || !decisionStore?.reconcileTradeLinks) return;'), "Decision reconciliation still competes with initial profile verification");
});



await test("legacy migration is only retired after a verifiably complete cloud merge", () => {
  const mergeBlock = section("async function mergeLegacyIntoCloud", "async function migrateLocalAccountIfNeeded");
  const claimBlock = section("async function claimLegacyData", "async function skipLegacyData");
  ok(mergeBlock.includes('throw error;') && mergeBlock.includes('legacy_cloud_read_failed'), "cloud read failure can still look like migration success");
  ok(mergeBlock.includes('existing = await loadProfile(userId)') && mergeBlock.includes('await saveProfile(userId, merged)'), "legacy migration still bypasses the revisioned profile store");
  ok(!mergeBlock.includes('storageGet(profileKey(userId)'), "legacy migration still reads only the obsolete canonical profile document");
  ok(mergeBlock.includes('legacy_media_migration_failed'), "partial media migration does not fail the overall migration");
  const mergeAt = claimBlock.indexOf("await mergeLegacyIntoCloud");
  const markerAt = claimBlock.indexOf('await legacyStorageSet(LEGACY_CLAIMED_KEY, "1", false)');
  ok(mergeAt >= 0 && markerAt > mergeAt, "legacy claimed marker can be written before the cloud merge completes");
  ok(!claimBlock.includes("} finally {"), "legacy claimed marker is still written from a finally block");
  ok(!claimBlock.includes("legacyStorageGet(PROFILE_KEY, false).catch"), "legacy source read failure can still be converted into an empty successful migration");
  const accountMigration = section("async function migrateLocalAccountIfNeeded", "function createFirebaseAuthProvider");
  ok(!accountMigration.includes("legacyStorageGet(profileKey(legacyUser.id), false).catch"), "local-account migration can still retire unread source data");
  ok(authUiSource.includes("Локальная копия сохранена"), "migration failure is not surfaced to the user");
});

await test("image compression never returns a payload above its configured safe limit", () => {
  ok(mediaUtilsSource.includes('if (smallest.dataUrl.length > limit) throw new Error("image_too_complex")'), "oversized image fallback can still escape the compressor");
  ok(mediaUtilsSource.includes("canvas.width = 1") && mediaUtilsSource.includes("canvas.height = 1"), "large canvas backing buffers are not explicitly released");
  ok(mediaUtilsSource.includes("for (let pass = 0; pass < 7 && dim > minDim; pass += 1)"), "oversized screenshots do not get bounded dimension-reduction retries");
});

await test("MediaRecorder error callbacks preserve the browser event error", () => {
  const audioSource = fs.readFileSync(path.join(root, "audio", "audio-recorder.js"), "utf8");
  ok(audioSource.includes("current.onerror = (event) =>"), "recording error handler ignores the MediaRecorder error event");
  ok(audioSource.includes('event?.error || /** @type {any} */ (current).error || new Error("audio_recording_failed")'), "recording errors lose their real browser cause");
  ok(audioSource.includes("const fail = (event) => reject(event?.error"), "stop-time recorder failures ignore the event error");
});

await test("runtime modules contain no unused named imports after the cleanup", () => {
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (["node_modules", "dist", ".git", "tests"].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".js")) files.push(full);
    }
  };
  walk(root);
  const importRe = /import\s*\{([^}]+)\}\s*from\s*["'][^"']+["'];?/gs;
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(importRe)) {
      const body = text.slice(0, match.index) + text.slice(match.index + match[0].length);
      for (const rawPart of match[1].split(",")) {
        const part = rawPart.trim();
        if (!part) continue;
        const pieces = part.split(/\s+as\s+/);
        const local = pieces[pieces.length - 1]?.trim();
        if (!/^[A-Za-z_$][\w$]*$/.test(local || "")) continue;
        const escaped = local.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        ok(new RegExp(`\\b${escaped}\\b`).test(body), `unused named import: ${path.relative(root, file)} -> ${local}`);
      }
    }
  }
});

await test("Release hardening ships owner-only Firestore rules", () => {
  const rules = fs.readFileSync(path.join(root, "firestore.rules"), "utf8");
  const firebaseJson = JSON.parse(fs.readFileSync(path.join(root, "firebase.json"), "utf8"));
  eq(firebaseJson.firestore?.rules, "firestore.rules", "firebase.json does not deploy the checked-in rules");
  ok(rules.includes("match /users/{userId}/data/{document=**}"), "canonical user data path is not covered");
  ok(rules.includes("request.auth != null") && rules.includes("request.auth.uid == userId"), "owner-only UID guard is missing");
  ok(rules.includes("allow read, write: if false"), "default-deny fallback is missing");
  ok(rules.includes("market-snapshot:crypto") && rules.includes("market-snapshot:forex") && rules.includes("market-snapshot:stocks"), "intended shared market cache is not narrowly allowlisted");
  ok(rules.includes("value.size() <= 20000") && rules.includes("allow delete: if false"), "shared market cache validation is too broad");
});

await test("Release hardening keeps a long-lived Firebase auth listener", () => {
  ok(appSource.includes("const unsubscribe = onAuthStateChanged("), "useAuth no longer owns a persistent auth subscription");
  ok(appSource.includes("return unsubscribe;"), "auth subscription is not cleaned up on unmount");
  ok(appSource.includes('"AUTH_STATE_CHANGE"'), "long-lived auth changes are not traced");
});

await test("GitHub Pages build forwards the Enterprise App Check key when configured", () => {
  const workflow = fs.readFileSync(path.join(root, ".github", "workflows", "pages.yml"), "utf8");
  ok(workflow.includes("VITE_RECAPTCHA_ENTERPRISE_SITE_KEY: ${{ secrets.VITE_RECAPTCHA_ENTERPRISE_SITE_KEY }}"), "Pages build does not expose the configured Enterprise App Check key to Vite");
});

await test("Release hardening prefers Enterprise App Check without breaking legacy deployments", () => {
  ok(appSource.includes("ReCaptchaEnterpriseProvider"), "Enterprise App Check provider is not imported");
  ok(appSource.includes("VITE_RECAPTCHA_ENTERPRISE_SITE_KEY"), "Enterprise key is not deployment-configurable");
  ok(appSource.includes("ReCaptchaV3Provider(APP_CHECK_LEGACY_V3_SITE_KEY)"), "safe legacy fallback was removed before Enterprise provisioning");
});

await test("Release hardening uses the current stable Flash-Lite model", () => {
  ok(appSource.includes('AI_MODEL = "gemini-3.5-flash-lite"'), "AI model was not updated to Gemini 3.5 Flash-Lite");
});

console.log(`\n${passed} regression checks passed.`);
if (failures.length) {
  console.error(`\n${failures.length} regression check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log("MIND.EXE regression suite: OK");
}
