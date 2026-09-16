# MIND.EXE v5.4.1

## Product changes

- Decision Lab voice notes use the hardened iPhone/PWA recorder path, normalize browser audio to mono PCM WAV 16 kHz and send that normalized audio to Gemini.
- A second conservative Gemini pass improves punctuation/readability. If that pass changes numbers, LONG/SHORT direction, negation, the known ticker, or compresses/expands the transcript suspiciously, MIND.EXE falls back to the verbatim transcription.
- Decision voice UI no longer exposes playback/download controls. Failed processing keeps a temporary local audio draft so transcription can be retried without recording again.
- Any Decision Lab record can be permanently deleted. Linked Journal entries are cloud-unlinked first; the Decision document and index row are then deleted with revision conflict protection. Older abandoned records are visible for deletion and the history can be expanded beyond the first eight rows.
- Replacing an unfinished Decision draft removes the old draft instead of leaving an abandoned history row. Failed deletion now restores that draft's autosync eligibility.
- Splash waits for the actual ~5.03 s video `ended` event while auth/profile bootstrap runs behind it. A generous watchdog only handles broken/stalled media and does not shorten normal playback.
- Journal screenshots use a dedicated high-detail compressor (up to 2560 px, quality target 0.90, adaptive Firestore-safe cap). Strategy Lab remains on the compact shared image pipeline so multiple inline screenshots do not inherit Journal-sized payloads.
- Full-screen screenshot preview supports Fit and actual-size inspection with scrolling.
- Decision Lab/analytics typography and spacing were tightened and the application base is true black with subtler cosmic glow/stars.

## Second-pass hardening found during release review

- Fixed a failed “start new Decision” deletion path that could leave the old draft internally marked as deleted and therefore excluded from autosync until remount/reload.
- Isolated high-resolution Journal compression from Strategy Lab after auditing Firestore document-size behavior.
- Added transcript integrity guards around the readability pass and normalization of accidental markdown fences.
- Added a stalled-video watchdog in addition to autoplay/error fallback.
- Added stale-revision delete coverage to verify a second client cannot remove a newer Decision snapshot.

## Verification in this workspace

- `npm test`: 127/127 regression checks passed.
- All local JavaScript syntax checks pass.
- All relative JavaScript imports resolve and the local module graph remains acyclic.
- Decision delete CAS/index behavior is executed against the regression transaction mock, including stale-delete rejection.
- Splash asset was inspected with ffprobe: duration 5.033333 s, size 316,556 bytes.
- Static release audit confirms no Decision audio playback control remains.

## Build limitation

This execution environment still cannot resolve `registry.npmjs.org`, so the npm dependency graph cannot be installed here and a fresh Vite `dist/` cannot be truthfully marked as built/browser-smoked. In the deployment environment run:

```bash
npm install
npm run verify:release
```

Then deploy only `dist/` and execute `TESTING.md` on desktop and the installed iPhone PWA.
