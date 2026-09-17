# MIND.EXE Decision Lab — v5.4.5

Decision Lab is an independent pre-trade reasoning system. It does not produce trading advice or a market signal. It records the user's own reasoning before the result is known, locks that pre-trade snapshot, and later compares it with Journal outcomes.

## v5.4.5 reliability / choice typography

- LONG / SHORT / uncertainty and FOR / AGAINST selectors share one display-font choice component across the Decision flow.
- Neutral-only rated thoughts are shown as a valid uncertainty state, not as missing data.
- Gemini receives only qualitative deterministic side dominance/alignment; exact balance percentages remain code/UI-owned.
- A malformed, incomplete or guard-rejected psychology response gets one automatic retry before the UI asks the user to retry manually.

## v5.4.4 psychological synthesis

After arguments are structured, rated and conditioned, Decision Lab now adds a psychological synthesis before the user rates final clarity/confidence and chooses the final action.

The split is intentional:

- deterministic code calculates the distribution of the user's own logical weights between LONG/SHORT (or FOR/AGAINST entry);
- emotional pull is calculated separately from the user's own emotion-intensity ratings;
- neutral argument weight is exposed separately rather than being forced into a direction;
- Gemini summarizes how each side exists in the user's own reasoning, what is internally strong, what is unstable, the central conflict, and one introspective question.

The psychology path is not allowed to become a market analyst. It receives no chart image, ticker/symbol, market feed or external market facts. Every market-related sentence is treated as a subjective belief stated by the user. System/prompt rules prohibit validating the market thesis, technical analysis, strategy correction, entry/exit/confirmation advice, stops/targets, probabilities or an AI-selected direction. A response guard also rejects prescriptive trading language or model-generated percentages.

The synthesis is fingerprinted from transcript + argument sides + user ratings + conditions. If those reasoning inputs change, stale synthesis is invalidated and must be regenerated. Once the Decision is locked, the synthesis is part of the immutable pre-trade snapshot.


## Data-integrity changes in v5.2.1

### Explicit rating provenance

AI-created arguments no longer receive synthetic `50%` logical weight or `0%` emotion as if the user had chosen them. New values remain `null` until the user actually touches the control.

Decision fields now keep explicit provenance flags:

- `weightRated`
- `emotionRated`
- `clarityBeforeRated`
- `clarityAfterRated`
- `decisionConfidenceRated`

A Decision cannot be locked until the required ratings are explicitly supplied. Legacy numeric values remain readable in the stored object, but values created before rating provenance existed are excluded from weight/emotion/clarity/confidence analytics rather than being treated as conscious user ratings.

### Transcript integrity

`rawInput.combinedTranscript` is now the canonical editable transcript. If the user fixes a transcription and then records/adds another fragment, the new fragment is appended to the corrected text instead of rebuilding the transcript from stale source segments.

### Local-first drafts

Draft edits are now responsive and recoverable:

1. UI state updates immediately.
2. The normalized text/state draft is saved to a user-scoped local cache.
3. Firestore sync is debounced and serialized in the background.
4. The cloud revision remains the CAS authority.
5. Final lock remains cloud-confirmed.

A locally newer draft is recovered only when its `baseRevision` still matches the current cloud revision. If another device has advanced the cloud revision, MIND.EXE reports a conflict instead of silently overwriting it.

### Voice recovery

Voice uses `MediaRecorder`, not browser speech recognition.

- Recording is limited to 3 minutes.
- MediaRecorder emits ~2 second chunks.
- Cumulative audio checkpoints are written to IndexedDB while recording, reducing loss if an iPhone PWA is backgrounded/killed.
- `visibilitychange` / `pagehide` trigger a stop attempt.
- After transcription, the text itself is saved locally before cloud sync.
- Once the transcript is durable locally, the audio draft can be deleted without forcing another Gemini transcription if Firestore is temporarily unavailable.
- Audio drafts are user-scoped for reset cleanup and are never uploaded to Firestore.

### Async race protection

Decision draft saves are serialized. Organizer responses are generation-guarded and are discarded when the transcript/session changed while AI was working. Background draft commits only merge persistence metadata into newer local edits instead of replacing those edits with an older async result.

### Unfinished Decision UX

If a draft already exists and the user starts another Decision, the UI explicitly offers:

- continue the current draft;
- abandon it and start a new one;
- cancel.

Abandoned drafts are not presented as locked pre-trade snapshots in the recent list.

### Factor taxonomy integrity

If an AI-classified argument is manually rewritten, its old taxonomy is reset to `other` instead of silently keeping a now-stale factor id. The user can choose the correct factor from the fixed taxonomy selector.

## Journal linkage hardening

Journal entries still store only `decisionSessionId`; the immutable Decision snapshot remains separate.

A background reconciliation pass repairs a missing `Decision.linkedTradeId` from the Journal after profile load. It will not move a Decision from one trade to another. If two Journal trades claim the same Decision session, reconciliation reports an ambiguous conflict and leaves the Decision untouched rather than guessing ownership.

## Analytics / history scaling

- The previous hidden 500-session index truncation is removed. Older Decision sessions are no longer silently dropped from history, backup/reset or analytics.
- Bulk session document reads use bounded concurrency instead of one unbounded `Promise.all`.
- Analytics only fetches `locked`, `linked` and `reviewed` session documents; drafts and abandoned sessions are filtered at the index level before Firestore reads.
- Factor performance still counts at most one representative observation per factor per Decision, while preserving the raw argument count separately.
- Weight/emotion bands use only explicitly rated values.

The current canonical index is still a single derived index document. It no longer has the artificial 500-session cap, but a future large-scale migration can shard it if real usage grows toward Firestore document-size limits.

## Full reset / local cleanup

Full reset now also clears:

- user-scoped local Decision draft cache;
- known legacy Decision audio drafts;
- new user-scoped Decision audio drafts.

Cloud Decision sessions remain removed through `decisionStore.resetAll()` as before.

## Persistence invariants

Decision Lab remains separate from Profile Persistence v2:

- `mind-exe-decision-index:{uid}`
- `mind-exe-decision-session:{uid}:{decisionId}`

Firestore path remains `users/{uid}/data/{safeKey}`.

Main profile and existing persistence invariants are unchanged:

- `SCHEMA_VERSION = 2`
- existing Profile / Journal Media / Strategy key layouts unchanged
- per-session Decision CAS unchanged
- locked pre-trade snapshot immutability enforced in the model/store layer

## Real-device QA still required

Node/static regression checks cannot prove Safari/iPhone microphone lifecycle or real Firebase/Gemini latency. Before treating voice/local-first sync as production-stable, run the iPhone PWA and two-device scenarios listed in `TESTING.md`.

## v5.3.1 production/startup note

Approach 3 does not change Decision schema v1, per-session CAS, local-first draft semantics or locked pre-trade snapshots. The Decision UI remains lazy-loaded and Decision↔Journal reconciliation now waits until the main cloud profile is verified so it cannot compete with critical startup work. Production dependencies are bundled through Vite rather than runtime CDNs.
