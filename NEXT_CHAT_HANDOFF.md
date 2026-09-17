# MIND.EXE — handoff

Current source release: **v5.4.5**.

## Architecture

- React 18 SPA bundled by Vite 7.1.5.
- Firebase Auth + Firestore + Firebase AI Logic (Gemini).
- Tailwind 4.1.10 is statically compiled into `styles.css`.
- Journal schema v2 with split revisioned profile storage and split screenshot documents.
- Strategy Store v1 with revisioned index and per-trade CAS.
- Decision Lab schema v1 with per-session CAS, local draft cache, IndexedDB audio recovery and locked pre-trade snapshots.
- Heavy screens are lazy-loaded; `app.js` remains orchestration rather than owning the feature implementations.

## v5.4.5 changes

### Full-source audit cleanup (17.09.2026)
- Removed unused imports/helpers/props and obsolete store logger arguments detected by the static no-unused audit.
- Fixed legacy migration so it uses the current revisioned profile store and never marks a failed/partial migration as complete.
- Intentional journal/full-reset boundaries now block resurrection of old local trades during migration.
- Fixed Close Trade crash path for legacy records without a stored `plannedRR`.
- Hardened screenshot size limits/iOS canvas cleanup and MediaRecorder error propagation.
- Removed duplicate root splash media; canonical splash assets live in `public/`.

1. Home/Patterns headline insights now require useful repeated evidence; isolated percentages are no longer promoted as “insights”.
2. Comparative journal insight path can contrast repeated behaviors only when both sides have enough realized-RR samples and a material difference.
3. Gemini Home/Coach prompts + output guard prohibit causal claims from observational journal data; weak evidence returns an honest insufficient-data state.
4. Home insight cache bumped to `home-advice-v2` to invalidate old low-quality cached text.
5. Decision LONG/SHORT/uncertainty controls share one Inter/display-font component with cleaner sizing/spacing across all Decision Lab choice states.
6. Neutral-only rated reasoning has an explicit “no side balance yet” state.
7. Psychology synthesis now sends Gemini qualitative deterministic balance instead of exact percentages and automatically retries one malformed/guard-rejected response.

## v5.4.4 changes

1. Decision voice remains MediaRecorder → normalized mono WAV 16 kHz → Gemini transcription → guarded readability pass.
2. Decision deletion uses in-app confirmation and supports drafts/completed/abandoned sessions with Journal unlink and CAS protection.
3. Decision screenshots are separately persisted, high-detail, recoverable locally, backed up/restored, and immutable after lock.
4. Native factor selects were replaced by in-app dark listboxes; condition inputs preserve spaces while typing.
5. New Decision psychological synthesis: code calculates logical and emotional LONG/SHORT (or FOR/AGAINST entry) balance from the user's own ratings; Gemini explains strong/weak reasoning patterns, internal conflict and one self-question.
6. Psychology synthesis never receives chart imagery, ticker/symbol, price feed or external market facts and is explicitly forbidden from strategy correction or trading advice.
7. Final clarity/confidence are rated only after synthesis (or explicit skip). Synthesis is fingerprinted against reasoning inputs and becomes part of the immutable locked snapshot.
8. GitHub Pages deployment remains Vite-built through `.github/workflows/pages.yml`.

## Data invariants

Unchanged:
- `SCHEMA_VERSION = 2`
- `PROFILE_KEY = mind-exe-journal-state`
- `MEDIA_KEY = mind-exe-journal-media`
- `STRATEGY_SCHEMA_VERSION = 1`
- `STRATEGY_INDEX_KEY = mind-exe-strategy-index`
- `STRATEGY_TRADE_KEY = mind-exe-strategy-trade`
- Firestore canonical path: `users/{uid}/data/{safeKey}`
- Decision locked-snapshot semantics

The repository includes `firebase.json` and owner-only `firestore.rules` for the canonical user data path.

## Verification state

`npm test` → **153/153 checks passed**.
Local JS syntax/import/module-cycle audits pass.

A real Vite bundle could not be produced in this container because `registry.npmjs.org` is not resolvable. The deployment/CI environment must run `npm install && npm run verify:release`, then execute `TESTING.md` on desktop and installed iPhone PWA before production publish.
