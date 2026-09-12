# MIND.EXE regression tests — v4.8.5

Перед крупными правками запускай:

```bash
npm test
```

Никакие пакеты устанавливать не нужно. Тесты используют только встроенный Node.js.

Проверяется: синтаксис, Firebase/profile/media ключи, legacy migrations, SL/TP, RR, result units, Strategy Lab, RR/risk/Pattern Engine, split-media, progressive media loader, cloud-first save, load-error gate, uncertain-write freeze и ключевые runtime-защиты.

Если финальная строка не `MIND.EXE regression suite: OK`, релиз не выкладывать.

Дополнительно v4.8.0 фиксирует отсутствие production demo-data и недостижимого Simulator.

## Cross-device smoke regressions — v4.8.1

Добавлены проверки, что:

- passive second device не подменяет сохранённый cloud `anonId` своим локальным ID и не создаёт ложную profile revision;
- desktop route новой сделки подписан явно как `Добавить сделку` / `Add trade`.

Текущий suite: **67 regression checks**.



## Modular refactor — v4.8.2

Добавлены проверки, что:

- все локальные `.js`-модули проходят `node --check`;
- `config/app-config.js` и `i18n/strings.js` импортируются отдельно;
- `analytics/trader-analytics.js` импортируется и экспортирует публичный analytics API;
- `analytics/calibration-review.js` импортируется отдельно и содержит calibration/review scoring;
- вынесенные STRINGS / Pattern Engine / analytics / calibration-review / UI primitives не дрейфуют обратно в `app.js`.

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

## Modular refactor — v4.8.3

Дополнительно проверяется, что:

- Journal и Strategy Lab остаются вынесены из `app.js`;
- AI context/service/trade-tools остаются отдельными модулями;
- Settings, Coach, Calibration/Journal Review и brand UI не дрейфуют обратно в `app.js`;
- общий `emotionConflict` остаётся в `core/journal-model.js`;
- `calculateTraderLevel` остаётся в analytics-модуле;
- все локальные JavaScript-модули продолжают проходить синтаксическую проверку;
- все относительные JavaScript-импорты после разбиения реально указывают на существующие локальные файлы.

Persistence/Auth/CAS semantics этим этапом не менялись.


## Modular startup hotfix — v4.8.3.1

Добавлена проверка, что вынесенные feature/AI/calibration модули не теряют runtime-зависимости при переносе из `app.js`.

Перед релизом дополнительно выполнен статический TypeScript-аудит JavaScript-кода на несуществующие идентификаторы (`TS2304` / `TS2552`): ошибок нет. Это отдельная release-проверка; основной `npm test` остаётся zero-dependency.

Для изменённых модулей увеличены `?v=` cache-busters. Это критично для iOS/Safari после v4.8.3, потому что иначе браузер может продолжать использовать старые сломанные тела модулей даже после замены файлов на сервере.


## Modular refactor — v4.8.4

Этапы 9–11 вынесли из `app.js` только presentation/runtime UI, не меняя persistence/auth semantics:

- Home + Dynamics/Patterns + Challenge → `features/dashboard/dashboard-ui.js`;
- Auth/Login/legacy prompt/boot intro UI → `features/auth/auth-ui.js`;
- splash, mobile/desktop navigation, wallet sheet, blocking load-error screen и React ErrorBoundary → `ui/app-shell.js`;
- dashboard получает `storageGet/storageSet` через явный `configureDashboardData(...)`;
- `app.js` уменьшен примерно с 5,381 до 3,470 строк;
- критический блок profile/Strategy persistence + auth service/useAuth проверен побайтовым сравнением с v4.8.3.1 и не менялся;
- regression suite расширен до **64 checks** и отдельно охраняет новые границы модулей и их runtime-зависимости.

`SCHEMA_VERSION`, canonical keys, CAS/revision logic и Firestore path shape не менялись.


## Auth hardening — v4.8.5

Добавлены проверки, что:

- `useAuth()` использует долгоживущий Firebase `onAuthStateChanged`, а не только one-shot чтение сессии;
- auth observer корректно отписывается при unmount;
- Google popup остаётся основным desktop-путём, а установленный PWA и popup-blocked окружение переходят на redirect;
- redirect result явно завершается через Firebase после возврата в приложение;
- legacy migration gate переживает redirect и не позволяет profile loader стартовать раньше времени;
- transient `updateProfile(displayName)` после уже успешного `createUser` больше не превращает регистрацию в ложную ошибку.

Перед релизом Google redirect всё равно требует реального smoke-test на iPhone/PWA: Node-suite проверяет wiring и инварианты, но не может эмулировать браузерный Firebase OAuth redirect.
