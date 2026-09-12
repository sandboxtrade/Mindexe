# MIND.EXE regression tests — v4.8.0

Перед крупными правками запускай:

```bash
npm test
```

Никакие пакеты устанавливать не нужно. Тесты используют только встроенный Node.js.

Проверяется: синтаксис, Firebase/profile/media ключи, legacy migrations, SL/TP, RR, result units, Strategy Lab, RR/risk/Pattern Engine, split-media, progressive media loader, cloud-first save, load-error gate, uncertain-write freeze и ключевые runtime-защиты.

Если финальная строка не `MIND.EXE regression suite: OK`, релиз не выкладывать.

Дополнительно v4.8.0 фиксирует отсутствие production demo-data и недостижимого Simulator.


## Modular boundaries v4.8.0
Regression suite also verifies that trade math, stats and journal migration stay in `core/` and are not silently copied back into `app.js`.


## Persistence boundaries v4.8.0
- `core/firestore-storage.js` owns low-level Firestore key/value access.
- `core/journal-media.js` owns journal screenshot cache/readiness/load/save logic.
- `app.js` still owns profile recovery, auth orchestration and `MindExe`.
- Regression tests verify exact Firestore paths, media keys and preflight ordering.

## Profile Persistence v2 — v4.8.0

Additional regression coverage verifies:

- large journals are split into multiple Firestore documents;
- `coinLedger` is split separately;
- reconstructed public profile shape is unchanged;
- no normal save writes the old whole-profile canonical document;
- manifest activation happens only after revision documents exist;
- stale second clients fail with `profile_revision_conflict`;
- old canonical profile documents remain readable recovery sources;
- revision conflicts freeze further cloud writes until reload.

## Recovery / reset semantics — v4.8.0

Additional checks cover:

- newest timestamped recovery candidate wins over an older fuller snapshot;
- five immutable rollback revisions are retained;
- a broken active revision falls back to the newest valid history revision;
- durable journal/full-reset tombstones survive manifest loss;
- old recovery data cannot resurrect a reset journal/profile;
- journal reset is cloud-first;
- full reset is cloud-first and clears Strategy Lab, AI Coach and calibration history;
- a profile commit followed by media failure cannot leave stale journal state ready to auto-save back.

## Strategy Lab persistence — v4.8.0

New coverage verifies:

- Strategy index immutable revisions + 5-version history;
- Strategy index CAS blocks stale tabs/devices;
- old canonical Strategy index and old backup are real read fallbacks;
- direct Strategy trades use per-trade CAS revisions;
- legacy Strategy trades begin at persistence revision 0;
- full reset activates an empty Strategy revision with no rollback history;
- Strategy save timeouts freeze further writes until reload;
- journal import and full-backup profile restore are cloud-first;
- Strategy backup restore rolls back previously existing trade records if index activation fails.
