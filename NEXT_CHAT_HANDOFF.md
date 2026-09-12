# MIND.EXE — handoff

Current release: **v4.9.0 FINAL QA**

## Architecture

React SPA / iPhone-first PWA using Firebase Auth + Firestore. The previous monolithic `app.js` has been split into feature/core modules; final `app.js` is ~2.8k lines and mainly owns application orchestration, persistence/recovery wiring and session state.

Main areas:

- `core/` — trade math, stats, journal migration/model, Firestore adapter, journal media, Profile Store v2, Strategy Store.
- `analytics/` — trader analytics/Pattern Engine and calibration/review scoring.
- `ai/` — context builders, Gemini service and trade-image/text tools.
- `features/` — journal, Strategy Lab, dashboard, auth UI, settings, coach, calibration.
- `ui/` — primitives, brand, media helpers and app shell/navigation/error boundary.
- `config/` + `i18n/` — shared visual/data constants and strings.

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

Before every release run `npm test`.

## What v4.9.0 fixed / changed

This release was made from the proven v4.8.5.1 auth/session base after the user confirmed cross-device persistence worked. It intentionally does not reintroduce the failed v4.8.5 Auth-hardening experiment.

### Startup/runtime crash fixes

- Removed stale `SPLASH_BLACKHOLE_MASK` references left after modular UI extraction. Those references could throw during the main React render and send desktop/iPhone directly to the ErrorBoundary.
- Restored explicit `Fragment` + `Card` dependencies in `features/auth/auth-ui.js`.
- Restored the `JournalReview` dependency in `features/dashboard/dashboard-ui.js`.
- Added static release coverage for unresolved runtime identifiers (`TS2304` / `TS2552` when `tsc` is available).
- ErrorBoundary now shows the concrete runtime error message instead of only a generic failure screen.
- Added a pre-React boot fallback in `index.html`; if the entry module/CDN graph fails entirely, the user no longer sees a silent permanent black screen.

### Visual / typography consolidation

- Inter is now the primary UI typeface.
- IBM Plex Mono is reserved for prices, balances, RR, tickers, dates and technical/status data.
- Reduced arbitrary display-font mixing and made headings/labels/control typography more consistent.
- Tightened card surfaces, borders, radii and shadows; primary form actions use a stricter 12px radius while pills/toggles keep pill geometry where semantically appropriate.
- Desktop sidebar/mobile navigation, auth controls, journal actions, Strategy Lab actions, calibration controls and load/conflict screens were visually normalized.
- Viewport no longer disables browser zoom.
- Mobile numeric/text fields retain a 16px input baseline to avoid unwanted iOS Safari zoom.

### Runtime/edge-case hardening

- Strategy `profitFactor` rendering no longer assumes a number and cannot call `.toFixed()` on the legacy `"Infinity"` sentinel/string.
- Strategy date sorting compares timestamps explicitly.
- Journal CloseTrade safely reconstructs/display planned RR if legacy data has Entry/SL/TP but lacks numeric `plannedRR`.
- JSON FileReader imports verify `reader.result` is a string before parsing.
- `playPing()` reuses one AudioContext instead of allocating a new context on every sound.
- Splash poster moved out of JS base64 and uses the existing `splash-poster.jpg`, reducing JS payload/memory. Splash/video cache versions are `4.9.0`.
- Historical release comments were removed from the runtime entry file; `app.js` is now ~2,787 lines / ~138 KB.

### Cache generation

- `index.html`: `app.js?v=4.9.0-final`
- every local JS import: `?v=4.9.0`
- splash assets: `?v=4.9.0`
- manifest URL: `manifest.json?v=4.9.0`

This prevents iOS/Safari from combining a new entry module with cached pre-final feature modules.

## Persistence status

The following final files were compared against the tested v4.8.5.1 base and remain byte-for-byte unchanged:

- `core/profile-store.js`
- `core/journal-media.js`
- `core/strategy-store.js`
- `core/firestore-storage.js`

No schema/key/path migration is part of v4.9.0.

## Regression state

`npm test` => **68/68 checks passed**.

The suite now covers syntax of all JS modules, relative imports, unresolved runtime identifiers when TypeScript is available, profile/Strategy CAS and rollback semantics, split media, cloud-first mutations, unit/RR correctness, modular dependency closure, final typography/cache generation, boot fallback and external splash assets.

## Real-device smoke status / next checks

Previous user smoke testing confirmed ordinary login/profile saves and the same account open on desktop + phone with reload-based cloud synchronization. Realtime `onSnapshot` UX is still not implemented.

After deploying v4.9.0, manually verify:

1. cold start on desktop and installed iPhone PWA;
2. login/logout/login;
3. create journal trade + screenshots;
4. edit/close/delete journal trade;
5. Analytics + Journal Review;
6. Strategy create/edit + direct trade + close/delete;
7. Settings/profile/balance/currency reload persistence;
8. backup export/import and reset flows on a disposable account;
9. same account on two devices;
10. brief airplane-mode/background/foreground checks.

## Known work intentionally NOT included in this final QA release

- Auth hardening (`onAuthStateChanged` lifecycle / Google redirect fallback) was rolled back after a startup regression and should only return incrementally with browser-level coverage.
- Firestore Security Rules still need to be versioned/audited before a public release.
- CDN/runtime dependency model remains; a proper Vite/bundled PWA/service-worker build is still the long-term reliability fix.
- Screenshots are still base64 in Firestore; Firebase Storage migration is future work.
- Realtime multi-device UX remains reload/conflict based.
