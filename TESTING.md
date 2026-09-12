# MIND.EXE regression tests — v4.6.13

Перед крупными правками запускай:

```bash
npm test
```

Никакие пакеты устанавливать не нужно. Тесты используют только встроенный Node.js.

Проверяется: синтаксис, Firebase/profile/media ключи, legacy migrations, SL/TP, RR, result units, Strategy Lab, RR/risk/Pattern Engine, split-media, progressive media loader, cloud-first save, load-error gate, uncertain-write freeze и ключевые runtime-защиты.

Если финальная строка не `MIND.EXE regression suite: OK`, релиз не выкладывать.

Дополнительно v4.6.13 фиксирует отсутствие production demo-data и недостижимого Simulator.


## Modular boundaries v4.6.13
Regression suite also verifies that trade math, stats and journal migration stay in `core/` and are not silently copied back into `app.js`.


## Persistence boundaries v4.6.13
- `core/firestore-storage.js` owns low-level Firestore key/value access.
- `core/journal-media.js` owns journal screenshot cache/readiness/load/save logic.
- `app.js` still owns profile recovery, auth orchestration and `MindExe`.
- Regression tests verify exact Firestore paths, media keys and preflight ordering.


## Splash asset update v4.6.13
- Background splash video replaced with the newly uploaded clip.
- Poster fallback updated to the first frame of that same clip.
- Splash overlay/logo logic intentionally preserved.
