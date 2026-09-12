# MIND.EXE — handoff to next chat

Current release: **v4.8.5**

## Current architecture

- React SPA / iPhone-first web/PWA.
- Firebase Auth + Firestore.
- `SCHEMA_VERSION = 2`.
- Canonical public profile shape remains backwards-compatible.
- Main journal profile uses revisioned/chunked Profile Persistence v2.
- Journal screenshots use split per-image documents with manifest-last activation.
- Strategy Lab index uses revisioned Strategy Store with CAS.
- Direct Strategy Lab trades use per-trade CAS revisions.
- 67 zero-dependency Node regression checks.

## Core modules

- `core/trade-math.js`
- `core/stats.js`
- `core/journal-model.js`
- `core/firestore-storage.js`
- `core/journal-media.js`
- `core/profile-store.js`
- `core/strategy-store.js`
- `config/app-config.js`
- `i18n/strings.js`
- `analytics/trader-analytics.js`
- `analytics/calibration-review.js`
- `ui/primitives.js`
- `ui/media-utils.js`
- `ui/brand.js`
- `ai/context.js`
- `ai/ai-service.js`
- `ai/trade-tools.js`
- `features/journal/journal-ui.js`
- `features/strategy/strategy-lab.js`
- `features/settings/settings-ui.js`
- `features/coach/coach-ui.js`
- `features/calibration/calibration-ui.js`
- `features/dashboard/dashboard-ui.js`
- `features/auth/auth-ui.js`
- `ui/app-shell.js`

## Data-safety invariants

Do not casually change:

- `SCHEMA_VERSION = 2`
- `PROFILE_KEY = "mind-exe-journal-state"`
- `MEDIA_KEY = "mind-exe-journal-media"`
- `STRATEGY_SCHEMA_VERSION = 1`
- `STRATEGY_INDEX_KEY = "mind-exe-strategy-index"`
- `STRATEGY_TRADE_KEY = "mind-exe-strategy-trade"`
- `STRATEGY_MEDIA_KEY = "mind-exe-strategy-media"`
- Firestore path shape: `users/{uid}/data/{safeKey}`

Always run `npm test` before release.





## What v4.8.5 changed

Auth hardening after the v4.8.4 modular build passed the real two-device scenario. No profile/Strategy persistence schema or key changed.

- `useAuth()` now keeps a long-lived Firebase `onAuthStateChanged` subscription instead of relying on a mostly one-shot session lookup.
- Google auth stays popup-first in normal browsers; installed PWAs use redirect and popup-blocked/unsupported environments fall back to redirect.
- `getRedirectResult()` is consumed on startup so the returning OAuth flow is finalized explicitly.
- A pending legacy-local-data migration gate is stored in `sessionStorage` before Google redirect and restored before profile loading, preventing a redirect from bypassing the existing migration prompt.
- Registration no longer reports failure solely because `updateProfile(displayName)` failed after Firebase already created/authenticated the account; username fallback remains deterministic from the synthetic email.
- New pure `core/auth-runtime.js` contains environment/normalization/session helpers.
- Regression suite: **67 checks pass**.
- `index.html` app cache-buster is `?v=4.8.5`.

Real-device follow-up: smoke-test Google sign-in once in desktop browser and once from installed iPhone PWA. Firebase OAuth redirect behavior cannot be fully proven by the Node suite.

## What v4.8.4 changed

Continued modularization after real two-device smoke testing passed on v4.8.3.1. This stage intentionally did **not** alter profile persistence, Strategy persistence, CAS/recovery, auth service semantics or Firestore keys.

- Home, Patterns/Dynamics and Challenge UI moved to `features/dashboard/dashboard-ui.js`.
- Dashboard-owned Home advice/market cache helpers moved with the UI and receive the existing Firestore key/value adapter through `configureDashboardData({ storageGet, storageSet })`.
- Login/register/Google button UI, legacy-migration prompt and boot intro moved to `features/auth/auth-ui.js`; `authService`, Firebase provider creation and `useAuth()` remain in `app.js` unchanged.
- Splash, blocking profile-load/conflict screen, mobile/desktop navigation, wallet sheet and React ErrorBoundary moved to `ui/app-shell.js`.
- `app.js` dropped from about 5,381 to **3,470 lines**.
- Critical profile/Strategy persistence + auth-service section was compared against v4.8.3.1 and remains byte-for-byte unchanged.
- `npm test`: **64 checks pass**. New checks guard stage 9–11 module boundaries and required runtime dependencies.
- `index.html` app cache-buster is `?v=4.8.4`.

The next refactor should not chase a lower line count mechanically. The remaining `app.js` is now mostly `MindExe` orchestration, persistence/recovery/backup wiring and auth session logic. Prefer real browser/Firebase E2E coverage before splitting those pieces.

## What v4.8.3.1 fixed

Hotfix for the modular stages 5–8 release after real desktop/iPhone smoke testing exposed startup/runtime failures.

- Restored Home advice/market cache helpers that were accidentally moved into the Calibration UI module while Home still referenced them.
- Restored missing module-local dependencies after extraction: Journal hooks/style/time helpers, Strategy spinner/result helpers, Calibration animated-number hook, AI context math imports, review emotion-impact helpers and pluralization helpers.
- Legacy journal-media migration now reuses `journalMediaStore.keys.entry(...)` instead of referencing a removed local key helper.
- Changed-module URLs were bumped (`?v=`) so Safari/iOS cannot keep serving the broken v4.8.3 module bodies from cache.
- Added a dedicated regression check for modular dependency closure.
- `npm test`: 62 checks pass.
- Additional TypeScript static audit found no unresolved runtime identifiers (`TS2304` / `TS2552`) across app/local modules.
- Persistence/Auth/CAS keys, schemas and Firestore path shape remain unchanged.

## What v4.8.3 changed

Continued safe modularization. Persistence/auth behavior and public data shape were intentionally left in place.

- Journal screens/forms and emotion UI moved to `features/journal/journal-ui.js`.
- Strategy Lab UI, forms and local strategy statistics moved to `features/strategy/strategy-lab.js`.
- browser image compression moved to `ui/media-utils.js`.
- logo/wordmark/decode UI moved to `ui/brand.js`.
- pure AI context/adaptive-calibration builders moved to `ai/context.js`.
- Gemini network/service calls moved to `ai/ai-service.js`.
- screenshot recognition, text polish and Strategy AI tools moved to `ai/trade-tools.js`.
- Settings moved to `features/settings/settings-ui.js`.
- Coach moved to `features/coach/coach-ui.js`; AI state persistence remains injected from `app.js`.
- Calibration and Journal Review moved to `features/calibration/calibration-ui.js`; calibration-history persistence remains injected from `app.js`.
- `calculateTraderLevel` now lives with the analytics engine; shared `emotionConflict` lives in `core/journal-model.js`.
- `app.js` dropped from ~9,978 to ~5,297 lines in this release, and from ~12,802 to ~5,297 across the modular refactor (~59% smaller).
- regression coverage increased to 61 checks, including module-boundary drift guards.
- no schema/key/path migration; `SCHEMA_VERSION` remains 2.

The remaining large block is mostly `MindExe` orchestration plus auth/profile/recovery/backup wiring. Do not split persistence or auth state casually before real browser/Firebase E2E coverage exists.

## What v4.8.2 changed

Safe modularization only; persistence behavior was intentionally untouched.

- `STRINGS` moved out of `app.js` to `i18n/strings.js`.
- shared palette/instrument/setup constants moved to `config/app-config.js`.
- behavioral analytics, risk/emotion analysis and Pattern Engine moved to `analytics/trader-analytics.js`.
- calibration questions, dynamic scoring and journal-review quiz/scoring moved to `analytics/calibration-review.js`.
- `Card`, `Pill`, `Toast` and screenshot preview UI moved to `ui/primitives.js`.
- `app.js` dropped from ~12,802 to ~9,978 lines.
- regression harness now syntax-checks every local JS module.
- At that stage, 56 regression checks passed.
- no schema/key/path migration; `SCHEMA_VERSION` remains 2.

The Journal/Strategy/AI modularization recommended at v4.8.2 was completed in v4.8.3.

## What v4.8.1 fixed from the first real two-device smoke test

- Opening the same authenticated account on a second device no longer rewrites `user.anonId` with that device's local anonymous ID.
- This removes a false profile revision bump that could make an actively editing device hit `profile_revision_conflict` even while the second device was otherwise idle.
- The existing cloud `anonId` is preserved; a new profile still gets one when none exists.
- Desktop navigation now labels the trade-entry route explicitly as `Добавить сделку` / `Add trade` instead of the ambiguous `Запись` / `Entry`.
- Real cross-device smoke result so far: cloud data reloads correctly between desktop and phone; realtime propagation is still intentionally absent until revision watching/onSnapshot is added.

## What v4.8.0 completed

- Strategy index immutable revisions.
- Five Strategy index rollback revisions.
- Strategy index stale-client CAS.
- Old Strategy index + backup are readable migration/recovery fallbacks.
- Direct Strategy trades have additive `persistenceRevision` / `persistenceUpdatedAt`.
- Stale direct-trade edits are rejected.
- Strategy timeout uncertainty freezes writes until reload.
- Full reset clears revisioned Strategy index and known trade/media records.
- Strategy deletion surfaces incomplete physical cleanup.
- Journal JSON import is cloud-first.
- Full-backup profile restore is cloud-first.
- Strategy backup restore rolls back pre-existing trade records if index activation fails.

## Remaining technical work — priority order

### 1. Real Firebase / iPhone production smoke tests — highest priority

The current 61 tests are Node/static/in-memory transaction tests. They do **not** emulate:

- authenticated production Firestore;
- real network interruption;
- iOS WebKit / installed PWA;
- app backgrounding while a Firestore request is pending;
- two real devices writing simultaneously.

Create a disposable Firebase test account and run a real end-to-end matrix:
new account → create trade → screenshots → close trade → Strategy Lab → logout → login → verify everything; repeat with airplane-mode/network drops and two devices.

### 2. Auth hardening for iPhone/PWA

Still pending:

- long-lived `onAuthStateChanged` instead of the current mostly one-shot auth session flow;
- Google popup → redirect fallback on iOS/PWA;
- audit username synthetic-email password reset limitations;
- registration / `updateProfile` consistency;
- logout behavior during uncertain cloud state.

### 3. Firestore Security Rules

Rules are not versioned with the source in this project. Add and audit rules for:

- `users/{uid}/data/*`;
- shared cache docs;
- ownership isolation;
- denial of cross-user reads/writes;
- size/type constraints where practical.

This is required before a public release.

### 4. Browser E2E automation

Add Playwright/browser tests against a Firebase emulator or disposable project:

- auth;
- create/edit/close/delete journal trade;
- screenshot persistence;
- reload persistence;
- Strategy create/edit/trade/close/delete;
- backup restore;
- reset journal/full reset;
- conflict screen.

### 5. PWA / dependency reliability

Still pending:

- React/Recharts/Lucide/Tailwind/Firebase are CDN/runtime dependencies;
- no proper bundled production build;
- no service worker/offline shell;
- manifest/versioning cleanup;
- CDN failure can still black-screen before React ErrorBoundary;
- viewport/accessibility zoom review.

A proper Vite/build pipeline is the clean long-term fix.

### 6. Media storage scalability / cost

Journal screenshots no longer risk one giant Firestore document, but images are still base64 inside Firestore.

Long term:
- Firebase Storage for binary screenshots;
- Firestore only stores metadata/path;
- migration must remain backwards-compatible with existing base64 docs.

### 7. Strategy restore/orphan cleanup edge case

If a **brand-new imported Strategy trade** is written and Strategy backup activation then fails, v4.8.0 leaves that record as an unreachable orphan rather than risking deletion of a record another device may have touched.

Existing records are rolled back with CAS.

A future cleanup system needs discoverable trade ownership/indexing or a safe orphan-GC mechanism.

The same class of orphan can happen if a brand-new Strategy trade transaction finishes after the UI-side timeout but its index update never runs.

### 8. Realtime multi-device UX

CAS prevents silent overwrites, but the user currently has to reload after a conflict.

Future improvement:
- Firestore `onSnapshot` / revision watch;
- show “newer cloud version available” before editing;
- optional merge UX where safe.

### 9. Large backup / iPhone memory

Full backup still serializes a potentially large JSON blob in memory. On a very large journal with screenshots/Strategy data this can be uncomfortable on iPhone.

Consider streamed/export-lite backups and separating media backup.

### 10. Continue modular refactor

`app.js` is now ~5.3k lines, but `MindExe` still owns a large amount of orchestration.

Do only after E2E coverage:
- auth/session orchestration module;
- split `MindExe` state into narrowly scoped hooks/features;
- backup/import UI and orchestration;
- remaining home/analytics routing shell;
- remove remaining empty catches/dead helpers;
- introduce route/feature lazy loading after the bundled build exists.

Journal UI, Strategy Lab UI, AI, Settings, Coach, Calibration and most pure analytics are already extracted. Do not move persistence/CAS code again before browser/Firebase smoke coverage exists.

## Known product/UX technical debt

- open journal trades still have limited edit paths compared with closed trades;
- incomplete i18n remains in some screens/messages;
- screenshot viewer can be improved for native iPhone pinch/double-tap;
- download behavior in installed iOS PWA needs real-device verification;
- accessibility/ARIA consistency needs an audit;
- analytics still perform repeated filter/sort work that can be memoized later;
- `coinLedger` can grow indefinitely;
- `playPing` creates a new AudioContext each call.

## Recommended very next task in the new chat

**Do not refactor more first.**

Run the real Firebase/iPhone smoke matrix against v4.8.3 and fix anything it exposes. After that, harden Auth and Security Rules. Only then split `MindExe`/auth orchestration further and move toward a bundled PWA build.
