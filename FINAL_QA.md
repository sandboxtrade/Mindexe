# MIND.EXE v5.4.5 — FINAL QA report

## Verified in this source package

- 153/153 regression checks pass.
- Every local JavaScript file passes syntax checking.
- Firebase Web SDK is pinned to 12.19.0, which includes the current iOS/iPadOS authentication persistence fixes and newer AI Logic fixes.
- Vite is pinned to 7.3.5, the patched Vite 7 security floor used by this release.
- Every relative JavaScript import resolves and the local module graph remains acyclic.
- Runtime modules pass the no-unused-locals/no-unused-parameters audit; stale imports, dead helpers and obsolete logger arguments found in this pass were removed.
- Legacy local→cloud migration now writes through the active revisioned profile store, keeps retry available after read/write/partial-media failures, and respects intentional journal/full-reset boundaries.
- Closing an older trade no longer dereferences a missing `entry.plannedRR`; the already-computed safe RR fallback is used instead.
- Screenshot compression never returns a payload above its configured safe limit and releases large canvas buffers earlier on iOS.
- MediaRecorder errors preserve the browser error event and still release microphone tracks.
- Duplicate root splash assets were removed; `public/` is the single Vite source for splash media.
- Profile/Journal/Strategy persistence invariants remain covered by regression tests.
- Decision session CAS, stale-write rejection, stale-delete rejection and atomic session/index deletion are covered. Older abandoned records remain reachable from the full-history deletion UI.
- Headline journal insights now suppress isolated small-sample frequencies and prefer repeated two-sided comparisons with real outcome differences.
- Gemini journal insights reject causal overreach; weak evidence produces an explicit insufficient-data state rather than generic advice.
- Decision LONG/SHORT/uncertainty controls use one shared display-font component across argument, considered-direction and final-choice states.
- Psychological synthesis receives qualitative deterministic balance only and automatically retries one rejected/malformed model response before surfacing an error.
- Decision Lab psychological synthesis is deterministic where it matters: logical/emotional side balance is calculated from user ratings in code, while Gemini only explains the structure of the user's own reasoning.
- The psychology Gemini path receives no chart image, ticker/symbol, market feed or external market data. Prompt and response guards reject prescriptive trading language and AI-generated percentages.
- Final clarity/confidence are collected only after psychological synthesis succeeds or the user explicitly skips it. Saved synthesis is fingerprinted and locked into the immutable pre-trade snapshot.
- Failed replacement of an unfinished Decision draft restores autosync eligibility.
- Decision audio is normalized to mono PCM WAV 16 kHz before Gemini and temporary audio survives failed processing for retry.
- The transcript readability pass is rejected if it alters critical numbers, direction, negation, known ticker, or suspiciously changes transcript length.
- No user-facing Decision audio playback control remains.
- Journal screenshots use a dedicated high-detail path; Strategy Lab remains on the compact shared path to avoid multiplying large inline payloads.
- Screenshot preview has Fit/actual-size modes.
- Splash waits for video `ended`; autoplay/error and stalled-media watchdogs prevent a permanent startup trap.
- Splash file is 316,556 bytes and 5.033333 seconds.
- Root app background is `#000000`; cosmic layers are intentionally low-opacity.
- `firebase.json` and owner-only `firestore.rules` are present.

## Not verifiable in this container

`registry.npmjs.org` is not resolvable in this execution environment. npm dependencies therefore cannot be installed and a fresh Vite production `dist/` cannot be executed here.

Before deployment run:

```bash
npm install
npm run verify:release
```

Then execute `TESTING.md` against the real deployed bundle on desktop and an installed iPhone PWA.
