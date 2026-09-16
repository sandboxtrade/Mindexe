# MIND.EXE — handoff

Current source release: **v5.4.1**.

## Architecture

- React 18 SPA bundled by Vite 7.1.5.
- Firebase Auth + Firestore + Firebase AI Logic (Gemini).
- Tailwind 4.1.10 is statically compiled into `styles.css`.
- Journal schema v2 with split revisioned profile storage and split screenshot documents.
- Strategy Store v1 with revisioned index and per-trade CAS.
- Decision Lab schema v1 with per-session CAS, local draft cache, IndexedDB audio recovery and locked pre-trade snapshots.
- Heavy screens are lazy-loaded; `app.js` remains orchestration rather than owning the feature implementations.

## v5.4.1 changes

1. Decision voice: hardened MediaRecorder → normalized mono WAV 16 kHz → Gemini transcription → guarded readability pass. No user-facing audio player/download.
2. Decision deletion: drafts, completed and old abandoned records can be deleted; linked Journal records are unlinked first and cloud deletion uses revision conflict protection. History can expand beyond the first eight rows.
3. Draft replacement: “start new” removes the unfinished draft instead of accumulating abandoned test rows; failed deletion cannot disable autosync.
4. Startup: the ~5.03 s splash plays to `ended` while profile/auth data loads in parallel. Broken/stalled playback has a fallback watchdog.
5. Journal screenshots: dedicated high-detail adaptive compression and actual-size fullscreen inspection. Strategy Lab deliberately remains on the compact image path.
6. Visual pass: darker true-black base, quieter cosmic treatment and cleaner Decision Lab typography/layout.

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

`npm test` → **127/127 checks passed**.
Local JS syntax/import/module-cycle audits pass.

A real Vite bundle could not be produced in this container because `registry.npmjs.org` is not resolvable. The deployment/CI environment must run `npm install && npm run verify:release`, then execute `TESTING.md` on desktop and installed iPhone PWA before production publish.
