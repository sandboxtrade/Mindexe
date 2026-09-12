// mind.exe — V4.0
//
// V4.0 — Strategy Lab: отдельный модуль тестирования технических торговых стратегий.
//        - несколько стратегий с названием, описанием и версией;
//        - отдельные strategy-trades без обязательной психологической части;
//        - обычная запись журнала может ссылаться на strategyId и автоматически
//          учитывается в статистике стратегии без физического дублирования сделки;
//        - отдельные Firebase documents для strategy index / trades / media;
//        - Gemini анализирует описание + рассчитанную приложением статистику;
//        - существующие journal/profile/media keys и schema не менялись.
//
// mind.exe — V4.8.5
//
// V4.8.5 — auth hardening after real two-device smoke testing.
//          - useAuth now follows Firebase through a long-lived onAuthStateChanged subscription;
//          - installed PWA Google auth uses redirect, popup-blocked browsers fall back to redirect;
//          - redirect completion is explicitly consumed after startup;
//          - legacy local-data migration gate survives a Google redirect via sessionStorage;
//          - post-registration displayName failure no longer reports the already-created account as failed;
//          - persistence/CAS schemas, keys and Firestore paths remain unchanged.
//
// mind.exe — V4.8.4
//
// V4.8.4 — modular refactor, stages 9–11.
//          - Home / Analytics / Challenge presentation moved into dashboard feature module;
//          - auth presentation moved out without changing auth/session behavior;
//          - splash/navigation/error-boundary chrome moved into ui/app-shell;
//          - profile persistence, CAS, recovery and Firestore schemas remain unchanged.
//
// mind.exe — V4.8.3.1
//
// V4.8.3.1 — modular startup hotfix.
//            - restores dependencies accidentally left behind by stages 5–8 extraction;
//            - fixes Home market/advice helpers, Journal/Strategy/Calibration module helpers;
//            - keeps Profile/Strategy persistence schemas and keys unchanged;
//            - bumps changed module URLs so iOS/Safari cannot reuse the broken v4.8.3 modules.
//
// mind.exe — V4.8.3
//
// V4.8.3 — modular refactor, stages 5–8.
//          - Journal and Strategy Lab UI moved into feature modules;
//          - Gemini context/network/trade tools split into dedicated ai modules;
//          - Settings, Coach and Calibration/Journal Review moved into feature modules;
//          - brand UI and browser media helpers moved out of app.js;
//          - shared trader-level/emotion-conflict logic moved to pure reusable modules;
//          - persistence, auth orchestration, CAS keys and Firestore schemas are unchanged.
//
// mind.exe — V4.8.2
//
// V4.8.2 — modular refactor, stages 1–4.
//          - localized STRINGS moved to i18n/strings.js;
//          - palette/instrument/setup constants moved to config/app-config.js;
//          - behavioral analytics + Pattern Engine moved to analytics/trader-analytics.js;
//          - shared Card/Pill/Toast + screenshot viewer moved to ui/primitives.js;
//          - calibration + journal-review engine moved to analytics/calibration-review.js;
//          - regression suite now syntax-checks every local JavaScript module.
//          Persistence/auth/Firestore schemas and canonical keys are unchanged.
//
// V4.8.1 — production smoke-test fixes.
//          - authenticated profile autosave preserves the existing cloud anonId, so simply opening
//            the same account on a second device does not manufacture a new profile revision;
//          - desktop navigation names the trade-entry action explicitly as “Добавить сделку”.
//
// V4.8.0 — Strategy Lab persistence hardening / final build of this chat.
//          - Strategy index uses immutable revisions + transactional CAS + 5-revision history;
//          - old Strategy index and backup are now real read fallbacks;
//          - direct Strategy Lab trade records use per-trade CAS revisions;
//          - stale device/tab writes are rejected instead of silently overwriting newer data;
//          - Strategy deletion reports incomplete physical cleanup;
//          - full reset clears the revisioned Strategy index as well as trade/media documents.
//
// mind.exe — V4.7.1
//
// V4.7.1 — Recovery / Backup / Reset semantics.
//          - recovery prefers newest valid candidates instead of the fullest old snapshot;
//          - durable journal/full reset tombstones prevent old backups from resurrecting deleted data;
//          - journal reset and full reset are cloud-first;
//          - full reset also clears Strategy Lab, AI Coach and calibration-history cloud data;
//          - split profile revisions now carry savedAt/sequence metadata and retain 5 rollback revisions.
//
// mind.exe — V4.7.0
//
// V4.7.0 — Profile Persistence v2.
//          - profile/journal data uses immutable split revisions instead of one growing Firestore JSON doc;
//          - journal entries and coin ledger are chunked below Firestore document limits;
//          - a tiny manifest is activated LAST through a Firestore transaction;
//          - compare-and-swap revision checks prevent stale/late saves and cross-device overwrites;
//          - legacy PROFILE_KEY documents/backups/device shadow remain readable recovery fallbacks;
//          - public profile schema remains SCHEMA_VERSION=2.
//
// mind.exe — V4.6.13
//
// V4.6.13 — Splash background video replaced with the new uploaded clip.
//           Logo, overlay animation and timing logic are preserved.
//           Poster fallback updated to the first frame of the new video.
//
// mind.exe — V4.6.12
//
// V4.6.12 — Modularization / Approach 5C.4.
//           Low-level Firestore storage and journal-media persistence moved behind explicit adapters.
//           Profile recovery/auth/MindExe orchestration intentionally stay in app.js.
//           Existing Firestore keys and document formats remain unchanged.
//
// mind.exe — V4.6.11
//
// V4.6.11 — Modularization / Approach 5C.3.
//           Journal data migration + emotion normalization moved to core/journal-model.js.
//           UI/auth/persistence behavior remains unchanged.
//
// mind.exe — V4.6.10
//
// V4.6.10 — Modularization / Approach 5C.2.
//           Pure statistics + RR summary moved to core/stats.js.
//           Runtime behavior and persistence formats are intentionally unchanged.
//
// mind.exe — V4.6.9
//
// V4.6.9 — Modularization / Approach 5C.1.
//          Pure trade/result/RR math moved to core/trade-math.js.
//          Runtime behavior and persistence formats are intentionally unchanged.
//
// mind.exe — V4.6.8
//
// V4.6.8 — Dead Code Cleanup / Approach 5B.
//          Cleanup only; no persistence schema/key migrations.
//
// mind.exe — V4.6.7
//
// V4.6.7 — Regression Harness / Approach 5A.
//          Runtime behavior intentionally unchanged from V4.6.6.
//          Adds zero-dependency Node regression tests for syntax, migrations, result semantics,
//          unit isolation, RR analytics, persistence guards and journal media safety.
//
// mind.exe — V4.6.6
//
// V4.6.6 — Progressive Journal Media / Approach 4B.
//          - journal screenshots load with bounded concurrency (3 entries at once);
//          - newest journal entries are checked first;
//          - media is merged progressively in small batches instead of one huge Promise.all;
//          - write-safety is tracked per entry, so a ready trade can be edited before the whole journal finishes;
//          - failed/timed-out media entries remain write-protected and destructive cleanup stays disabled;
//          - storage keys/formats from V4.6.5 remain unchanged.
//
// mind.exe — V4.6.5
//
// V4.6.5 — Journal Media Split / Approach 4A.
//          - ordinary journal screenshots are stored one image per Firestore document;
//          - a tiny manifest activates a new immutable media generation only after every image write succeeds;
//          - old global MEDIA_KEY and per-entry media documents remain readable fallbacks;
//          - old media is NOT auto-migrated merely by opening/saving unrelated settings;
//          - existing-entry screenshot writes are blocked while its old media is still loading;
//          - canonical profile/media key names and SCHEMA_VERSION remain unchanged.
//
// mind.exe — V4.6.4
//
// V4.6.4 — Analytics RR Guard / Approach 3B.
//          - behavioral/risk analytics use realizedRR for true R-based calculations;
//          - Pattern Engine no longer treats generic money result `r` as R;
//          - pattern confidence is based on actual RR sample;
//          - risk/streak/calibration/quiz AI metrics use realizedRR only;
//          - persistence/auth/media/Firestore layout remain unchanged.
//
// mind.exe — V4.6.3
//
// V4.6.3 — Result Units / Approach 3A.
//          - newly closed trades store resultMode + resultCurrency;
//          - editing preserves the unit stored on the trade;
//          - individual results use their stored unit, not the current global setting;
//          - incompatible R / currencies are never added in the main aggregates;
//          - legacy trades without metadata are not guessed or auto-rewritten;
//          - Firestore keys/schema/document layout remain unchanged (additive fields only).
//
// mind.exe — V4.6.2
//
// V4.6.2 — Save/Auth Reliability / Approach 2.
//          - journal mutations await confirmed cloud save before UI success;
//          - add/edit/close/delete expose real saving states;
//          - failed profile load is BLOCKING instead of rendering an empty journal;
//          - retry profile load without logout;
//          - uncertain/hung cloud write blocks further writes until reload, preventing stale overwrite races;
//          - canonical Firestore keys/schema/media format remain unchanged.
//
// mind.exe — V4.6.1
//
// V4.6.1 — Correctness Guard / Approach 1.
//          - one shared SL/TP/manual result semantic for journal + Strategy Lab;
//          - old contradictory journal records are normalized in memory only;
//          - RR/expectancy analytics now use realizedRR, never money PnL masquerading as R;
//          - no auth/persistence/media/Firestore layout changes in this release.
//
// mind.exe — V4.6
//
// V4.6 — Strategy Lab result semantics + global visual polish / QA.
//        - SL result always becomes negative automatically; TP always positive;
//        - Manual close preserves the user-entered sign;
//        - closed direct Strategy trades can edit close reason + result amount;
//        - legacy direct SL/TP trades are normalized in memory on read (no auto-write migration);
//        - visual system tightened: calmer surfaces, smaller radii/shadows, better iOS controls;
//        - canonical Firestore keys, SCHEMA_VERSION and journal persistence are unchanged.
//
// mind.exe — V4.5
//
// V4.5 — Strategy Lab: редактирование direct-сделок + точные итоговые суммы;
//        Screenshot Viewer: кнопка скачивания изображения.
//        - существующий Strategy Trade редактируется по тому же id, без создания копии;
//        - linked journal trades остаются source-of-truth в обычном журнале;
//        - RESULT QUALITY: Long total / Short total / gross profit / gross loss вместо средних;
//        - Firestore keys/schema и старые journal/media документы не менялись.
//
// mind.exe — V4.4.2
//
// V4.4.2 — полноэкранный просмотр сохранённых скриншотов.
//          Тап по thumbnail открывает изображение поверх приложения; закрытие по X/фону/Escape.
//          Формат screenshot data, Firestore keys/schema и persistence НЕ менялись.
//
// mind.exe — V4.4.1
//
// V4.4.1 — финальный QA guard: local shadow пишется только после разрешённой cloud-load gate,
//          добавлен React Error Boundary вместо чёрного экрана при render crash.
//
// mind.exe — V4.4
//
// V4.4 — полный QA/stability pass.
//        - Strategy close: single-submit + saving state + только exit-media при закрытии;
//        - Strategy delete media cleanup параллельный;
//        - регистрация нового аккаунта не делает лишний cloud migration-check;
//        - fresh account пропускает аварийный recovery scan, если canonical профиля ещё нет;
//        - BootIntro ускорен;
//        - branding больше не вспыхивает старым зелёным до загрузки профиля;
//        - direct local shadow сохраняет последний профиль перед cloud write как страховку.
//        Canonical Firestore keys/schema и journal entry model не менялись.
//
// mind.exe — V4.3.1
//
// V4.3.1 — исправлен startup regression из v4.3.
//          После handleLogout случайно оказался вложенный useEffect внутри useEffect,
//          из-за чего React падал до splash screen. Persistence v4.3 не менялся.
//
// mind.exe — V4.3
//
// V4.3 — аварийный аудит сохранений + PWA.
//        Сериализация cloud-save, flush перед logout, recovery из backup/legacy/shadow.
//        Canonical Firestore keys и SCHEMA_VERSION не менялись.
//
// mind.exe — V4.2.4
//
// V4.2.4 — исправлен чёрный экран при открытии формы тестовой сделки.
//          Причина: StrategyTradeForm использовал saving/setSaving, но локальный
//          useState для них отсутствовал после предыдущего патча.
//          Изменение только в локальном React-state формы; Firestore/persistence не менялись.
//
// mind.exe — V4.2.3
//
// V4.2.3 — в Strategy Lab добавлено безопасное удаление стратегии.
//          - удаляется сама стратегия, её прямые Strategy Lab-сделки и их media;
//          - обычные сделки журнала и их скриншоты НЕ удаляются;
//          - перед удалением показывается отдельное подтверждение.
//          Journal/Firestore schema и старые media keys не менялись.
//
// mind.exe — V4.2.2
//
// V4.2.2 — исправлено сохранение новых сделок Strategy Lab и уменьшена нижняя панель.
//          - новая тестовая сделка больше не делает до 8 лишних deleteDoc для пустых media-слотов;
//          - media-запросы выполняются параллельно, а не последовательно;
//          - кнопка показывает состояние «Сохраняю…» и защищена от двойного нажатия;
//          - нижний mobile nav приведён к стандартной компактной высоте iPhone.
//          Схема Firestore, ключи документов и старый journal/media persistence не менялись.
//
// mind.exe — V4.2.1
//
// V4.2.1 — Gemini Vision распознавание добавлено в создание сделки Strategy Lab.
//          Используется тот же aiRecognizeTradeFromImage(), что и в обычном журнале:
//          скрин добавляется в сделку и заполняет instrument / direction / Entry / SL / TP.
//          Firebase / journal / media / strategy persistence не менялись.
//
// mind.exe — V4.2
//
// V4.2 — полная полировка нижней мобильной навигации.
//        Центральная кнопка теперь сидит в отдельном центральном слоте,
//        боковые табы выровнены по одинаковым оптическим слотам, active-state
//        стал чище, а сам бар собраннее и визуально дороже.
//        Изменения только в mobile nav / UI, persistence не затрагивается.
//
// mind.exe — V4.1.1
//
// V4.1.1 — выравнивание нижней мобильной навигации: центральная кнопка теперь
//          стоит ровно по центру, а остальные пункты симметрично распределены по бокам.
//          Изменение только в mobile nav layout; persistence не затрагивается.
//
// mind.exe — V4.1
//
// V4.1 — кнопка настроек вынесена из нижней навигации в правую часть верхней шапки
//        и переименована в «Профиль». Это только навигационный/UI-апдейт:
//        storage / Firestore / journal / media / strategy persistence не менялись.
//
// mind.exe — V3.4
//
// V3.4 — системный polish UI без изменения логики хранения данных.
//        Фокус: сделать интерфейс более собранным, тёмным и «доделанным», чтобы
//        приложение выглядело как продукт, а не как сырая вайбкодерская сборка.
//        Что обновлено:
//        - подтянута базовая палитра: поверхности темнее и ближе друг к другу,
//          вторичный текст чище, зелёный/красный читаются увереннее;
//        - унифицированы Card / StatCard / Pill / mobile nav / badge styles;
//        - уменьшена визуальная «коробочность», добавлены мягкие слои и тени;
//        - уточнены микротипографика и трекинг служебных подписей.
//        Storage / Firestore / media / journal persistence не менялись.
//
// mind.exe — V3.3
//
// V3.3 — переработан дизайн вкладки «Аналитика» → «Динамика».
//        - кривая доходности теперь строится по дням, а не искусственно сглаженным
//          точкам отдельных сделок, поэтому график выглядит спокойнее и чище;
//        - график помещён в полноценную карточку с более аккуратной сеткой и tooltip;
//        - блок «Результат по типу сетапа» переделан из тонких progress-баров в более
//          плотные карточки с итогом, средним результатом и количеством сделок;
//        - storage / Firestore / media / journal persistence не менялись.
//
// mind.exe — V3.2.1
//
// V3.2.1 — аудит надёжности после V3.2. Формат Firestore и ключи документов не менялись.
//          Исправлено только поведение вокруг медиа и новый дефолт регулярности:
//          - legacy-профиль без weeklyGoal теперь получает новый дефолт 7, а не старый 5;
//          - новый аккаунт без записей помечает медиа как успешно загруженные, чтобы добавленный
//            и затем удалённый в той же сессии скриншот не возвращался после перезапуска;
//          - ошибка сохранения скриншота больше не проглатывается молча: persistNow получает
//            ошибку, показывает тост и сможет повторить запись при следующем сохранении;
//          - при неудачном удалении media-документа его hash остаётся в кэше, поэтому удаление
//            повторится позже вместо того, чтобы старый скриншот внезапно вернулся.
//
// mind.exe — V3.2
//
// V3.2 — точечная правка главного экрана и настроек.
//        - мини-график капитала закреплён рядом с числом, больше не висит отдельно в правом верхнем углу;
//        - убран быстрый пункт «Игра» с главной (сама вкладка/симулятор не удалены);
//        - из настроек убран выбор недельной цели регулярности; рабочая цель интерфейса = 7 дней;
//        - у недельных отметок оставлены только кружки без подписей дней недели;
//        - Firebase/Auth/Firestore/media/autosave/profile schema не менялись.
//
// mind.exe — V3.1
//
// V3.1 — стартовый splash переведён с чёрной дыры на пользовательскую анимацию глаза.
//        Видео остаётся отдельным splash.mp4 для нормального браузерного кэша; первый кадр
//        встроен в app.js как poster/fallback, чтобы на iOS не было вспышки старого splash.
//        Логика Firebase, загрузки профиля, аналитики и Gemini не менялась.
//
// mind.exe — V3.0
//
// V3.0 — редизайн по референсам, этап 1: основание.
//
//        Изменены только центральные токены и примитивы — поэтому новый вид
//        получают все экраны сразу, без правки каждого из них по отдельности.
//
//        ПАЛИТРА: фон #000 (был #0A0A0B), поверхность #0C0C0D, линия #1B1B1E.
//        Линия теперь почти не читается глазом — это снимает рамки сразу в 41
//        месте без правки этих мест. Прибыль/убыток переведены на чистые
//        терминальные #22DD7F / #F0524D.
//
//        ШРИФТ: один моноширинный на всё (IBM Plex Mono). Смешение гротеска для
//        текста и моноширинного для цифр было самым заметным признаком
//        сборки из шаблонов. Sora больше не загружается.
//
//        ПРИМИТИВЫ: Card — без рамки, без внутреннего блика, радиус 22px;
//        glowing больше не рисует свечение по периметру. Pill — без рамки.
//
//        НАВИГАЦИЯ: плавающая карточка с подписями заменена краем экрана:
//        прозрачный фон, волосяная линия сверху, только иконки. Подписи при семи
//        вкладках всё равно обрезались многоточием.
//
//        ГЛАВНАЯ: убраны приветствие и пояснительный подзаголовок; баланс поднят на
//        их место и больше не лежит в карточке. Шапка выровнена по левому краю,
//        декоративная градиентная черта под логотипом убрана.
//
//        Логика, расчёты, Firebase и Gemini не тронуты.
//
// mind.exe — V2.1
//
// V2.1 — дизайн-проход, этап 3 из 3: скелетоны и плавная загрузка.
//
//        Добавлены Skeleton и SkeletonLines: полосы с медленным бликом (1.6s — быстрый
//        мигающий скелетон читается как ошибка, а не как ожидание). Блик идёт по градиенту
//        фона, а не отдельным слоем, поэтому не добавляет элементов в разметку и не
//        перехватывает нажатия. При prefers-reduced-motion анимации отключаются.
//
//        ГДЕ ПРИМЕНЕНО:
//        - Блок совета на главной. Скелетон показывается ТОЛЬКО когда показать нечего:
//          нет ни ответа Gemini, ни локального инсайта, ни записей. Если локальный инсайт
//          посчитан, он выводится сразу — прятать готовую информацию ради анимации
//          означало бы сделать приложение медленнее ради вида, что оно быстрое. Подмена
//          локального текста ответом модели идёт через fade, а не скачком: смена ключа
//          элемента перемонтирует его и запускает .content-in.
//        - Список журнала. Карточки проявляются с шагом 60ms вместо одновременного
//          возникновения. Класс .stagger уже был в бандле, но к журналу применён не был.
//
//        ГДЕ СОЗНАТЕЛЬНО НЕ ПРИМЕНЕНО:
//        - Скриншоты в карточках сделок (догружаются фоном с V1.0). Скелетон там был бы
//          враньём: приложение не знает заранее, есть ли у записи скриншот вообще, и
//          показывало бы заглушку под картинку, которой нет.
//        - BootLoading. Скелетон главной там неуместен: этот же экран показывается при
//          проверке авторизации, когда следующим может быть логин, а не главная.
//
//        Логика и расчёты не тронуты.
//
// V2.0 — дизайн-проход, этап 2 из 3: пустые состояния.
//
//        Их не существовало как сущности. Там, где данных нет, стояла одинокая серая
//        строка или не было ничего — а это ровно то, что видит новый пользователь в
//        первую минуту. Хуже всего вела себя аналитика: без закрытых сделок она рисовала
//        вкладки, нулевые метрики и пустые графики, то есть выглядела как сломанная,
//        хотя данных просто ещё не было.
//
//        Добавлен компонент EmptyState: иконка в круге, заголовок, одно поясняющее
//        предложение и опциональная кнопка. Тексты передаются вызывающим — компонент
//        ничего не придумывает сам. Применён в трёх местах:
//        - Журнал. Раньше на ДВА разных случая показывался один текст «Ничего не найдено,
//          попробуй другой фильтр». Новому пользователю с пустым журналом он сообщал
//          ерунду: фильтровать нечего. Теперь случаи разделены.
//        - Аналитика. Ранний выход при отсутствии закрытых сделок, с разными текстами для
//          «журнал пуст» и «сделки есть, но ни одна не закрыта» — второе неочевидно, все
//          расчёты идут только по закрытым.
//        - Кошелёк. Строка про начисления переехала в общую форму.
//
//        Логика и расчёты не тронуты: добавлены только ветки рендера при отсутствии
//        данных и новые строки переводов.
//
// V1.9 — дизайн-проход, этап 1 из 3: типографика и скругления.
//
//        Было 18 разных размеров шрифта, включая дробные (8.5, 9.5, 10.5, 11.5, 12.5px) —
//        размеры подбирались по месту, шкалы не существовало. Несогласованность такого
//        рода читается глазом как самоделка даже тогда, когда её не могут назвать.
//
//        ШКАЛА ТИПОГРАФИКИ (девять ступеней, других быть не должно):
//          9px   — микроподписи над значениями, uppercase + tracking
//          10px  — подписи осей, счётчики, служебные пометки
//          11px  — вторичный текст, пояснения под блоками
//          12px  — подписи полей, элементы списков
//          13px  — основной текст в карточках
//          17px  — значения в карточках, подзаголовки
//          24px  — заголовки экранов
//          28px  — крупные числа на главной
//          40px  — единственное главное число
//        Дробные ступени сведены к ближайшей целой, 18->17, 22 и 26->24, 30->28.
//
//        СКРУГЛЕНИЯ: было 7 радиусов, включая два одноразовых (rounded-[22px] и
//        rounded-[20px] из V1.0/V1.5 — мои же). Осталось четыре уровня:
//          rounded-full — пилюли, кружки, полосы прогресса
//          rounded-lg   — мелкие элементы: чипы, поля ввода
//          rounded-xl   — кнопки, вложенные блоки
//          rounded-2xl  — карточки и крупные контейнеры
//        rounded-md убран, одноразовые пиксельные радиусы убраны.
//
//        Правка чисто визуальная: ни одна строка логики, расчётов или работы с данными
//        не тронута. Следующие этапы — пустые состояния, затем скелетоны загрузки.
//
// V1.8 — блок «Как состояние влияет на результат» показывал «Нужно минимум 6 закрытых
//        сделок... Сейчас 6» — сообщение противоречило само себе.
//
//        Причина: у emotionImpactStats ДВА разных условия недоступности, а текст был один.
//        Первое — сделок меньше 6. Второе — сделок хватает, но ни по одной шкале не
//        набралось по 3 сделки с высокой И с низкой эмоцией одновременно, и группы
//        «смешанное/однозначное» тоже не разделились. Второй случай возвращал объект без
//        поля needed, UI подставлял значение по умолчанию и печатал текст про нехватку
//        сделок, хотя сделок хватало. Это и наблюдалось: все записи сделаны примерно в
//        одном состоянии, разброса для сравнения нет.
//
//        Исправлено: stats несёт reason ("few_trades" / "no_groups"), и второй случай
//        объясняется по-настоящему — сколько сделок попало в каждую группу по каждой
//        шкале, почему середина 41-59% не считается и при каких данных блок заработает.
//        Пороги не тронуты: занижать их — значит строить сравнение на двух сделках и
//        выдавать шум за вывод.
//
// V1.7 — подпись под шкалами эмоций. Раньше она перечисляла проценты, которые и так видны
//        на самих ползунках, и не давала никакой оценки: «Уверенность 75% · Напряжение 66%
//        · Страх 61% — смешанное» ничего не сообщает сверх того, что уже на экране. Теперь
//        правила читают проценты и называют состояние словами плюс что с ним делать:
//        «Решение ведёт страх», «Сильный внутренний конфликт», «Уверенность без сомнений»
//        и т.д. Порядок проверок — от самого тревожного к самому спокойному, поэтому
//        сильный страх не может быть перекрыт формулировкой про ровное состояние. Пороги
//        те же, что в аналитике (60 — выражено, 40 — слабо), чтобы подпись и статистика не
//        противоречили друг другу. Рекомендации говорят только про проверку решения, не
//        про рынок: приложение психологическое, а не торговый советник. В журнале
//        показывается один вердикт без рекомендации — она уместна в момент заполнения.
//
// V1.6 — ИСПРАВЛЕНА ПОТЕРЯ СКРИНШОТОВ. Регрессия V1.0: там медиа перестали блокировать
//        старт и стали грузиться фоном, но кэш хешей при этом заполнялся раньше, чем
//        картинки попадали в entries.
//
//        Как терялось. loadMedia проставляла __mediaHashes[id] сразу при чтении документа.
//        Вызывающий код обёрнут в caWithTimeout(20s): на медленной связи обёртка отклоняет
//        промис, .then не выполняется, мержа в entries НЕ происходит — а сама загрузка
//        дотекает следом и всё равно заполняет __mediaHashes. Получалось расхождение:
//        в хешах id есть, в entries скриншотов нет. Дальше любой автосейв строил mediaMap
//        из entries (пустой по картинкам), а цикл очистки в saveMedia проходил по
//        __mediaHashes и удалял документы из Firestore как «лишние». Тот же результат
//        давала гонка «хеши уже проставлены — мерж ещё не выполнен».
//
//        Исправлено в первопричине, а не защитным условием поверх:
//        1) loadMedia больше не трогает __mediaHashes. Она возвращает { map, raw }, и хеши
//           проставляет тот, кто фактически положил данные в state — одной операцией
//           вместе с setEntries. Состояние кэша больше не может опережать состояние entries.
//        2) Введён флаг __mediaLoaded. Пока медиа не доставлены в память, saveMedia не
//           удаляет НИ ОДНОГО документа: отсутствие картинки в entries в этот момент
//           означает «ещё не загрузили», а не «пользователь удалил». Запись при этом
//           работает как раньше, так что новые скриншоты сохраняются и до загрузки старых.
//
// V1.5 — две правки.
//  1) РЫНОЧНЫЙ БЛОК на главной. Три равные колонки не помещались на телефоне: «Волатильный»
//     ломался посреди слова, пилюля с настроением уезжала в две строки. Значения там разной
//     природы — число, число с текстовой меткой и слово — и узкие равные колонки им не
//     подходят. Стал списком строк: слева иконка и подпись, справа значение. Данные и их
//     источник прежние.
//  2) «РАЗБОР». Что было не так: экран обещал «вопросы по тому, что уже видно в твоём
//     журнале», но при малом числе сделок молча подставлял общие вопросы из зашитого
//     списка — обещание расходилось с содержанием. Вопросы строились только на паттернах
//     (которым нужно много сделок) и вообще не знали про процентные шкалы эмоций из V1.2.
//     Сделано:
//     - вопросы из эмоциональных шкал: сравнение среднего результата при эмоции от 60%
//       против до 40% и отдельно смешанные состояния; порог 3 сделки на группу, поэтому
//       они появляются намного раньше паттернов. Вопрос ставится только там, где эмоция
//       связана с ХУДШИМ результатом — спрашивать про то, что и так работает, значит
//       навязывать проблему;
//     - интро называет состав честно: сколько вопросов из журнала, сколько общих;
//     - вопросы из паттернов и из эмоций складываются, а не заменяют друг друга (раньше
//       при недоступном движке паттернов эмоциональная часть терялась целиком);
//     - подключён Gemini по схеме калибровки: приложение считает факты и хранит
//       рекомендации, модель только переформулирует вопрос под конкретные числа и пишет
//       финальный вывод по ответам. Числа ей не отдаются на генерацию — evidence всегда
//       наш, а id, которых мы не отдавали, отбрасываются. Оба вызова необязательные:
//       запрос на вопросы уходит фоном, пока читается интро, и не блокирует «Начать»;
//       на экране результата сразу показывается локальный вывод, а версия от ИИ
//       подменяет его по приходе. При таймауте или ошибке разбор работает как раньше.
//
// V1.4 — вкладка «Эмоции» в аналитике. Вместо скаттера (каждая сделка точкой в
//        координатах страх→уверенность / нервы→спокойствие) теперь прямое сравнение
//        среднего результата: сделки, где эмоция отмечена от 60%, против тех, где до 40%,
//        по каждой из четырёх шкал плюс отдельная строка «смешанное состояние». Скаттер
//        удалён потому, что из него не следовал никакой вывод: точки не подписаны, форма
//        облака ничего не сообщает, а сами оси после V1.2 стали производной величиной, а
//        не исходными данными. Записи, созданные до появления шкал, участвуют: их состояние
//        восстанавливается из осей приблизительно, и их доля показывается под блоком.
//        Строка метрик (осознанность / дисциплина / стабильность риска / рефлексия),
//        которая на телефоне переносилась посреди подписи, стала сеткой 2x2 с полосой
//        заполнения. Удалён ChartTooltip — он обслуживал только скаттер.
//
// V1.3 — вид ползунков шкал эмоций. В V1.2 дорожка рисовалась background-image на самом
//        input: в WebKit нативный трек перекрывает фон элемента, поэтому на iOS вместо
//        тонкой линии выводилась сплошная белая «таблетка» во всю высоту контрола.
//        Дорожка, заполнение и бегунок теперь обычные div, а input лежит поверх полностью
//        прозрачным — перетаскивание, шаг 1% и доступность остаются нативными. Ширина
//        невидимого нативного бегунка приравнена к нарисованному, иначе кружок отстаёт
//        от пальца у краёв. Логика состояния (V1.2) не менялась.
//
// V1.2 — исправлена ЛОГИКА, а не только оболочка. В V1.1 шкалы были новым интерфейсом
//        поверх старой модели: четыре процента сводились в две оси x/y, и всё приложение
//        читало только их. Из-за этого «уверенность 70% + страх 100%» превращалось в
//        x=35, y=85 и подписывалось как «Спокойно и ровно» — прямо противоположное тому,
//        что отметил трейдер. Теперь исходные данные — сами проценты:
//        1) Подпись состояния (в форме и в журнале) собирается из процентов и называет
//           конкретные эмоции с числами, а при одновременно набранных противоположных
//           полюсах помечает состояние как смешанное (emotionValuesText / emotionConflict).
//        2) Gemini получает проценты по каждой эмоции плюс conflict, а не две усреднённые
//           оси; в системный промпт добавлено, что эмоции независимы и усреднять
//           противоположные нельзя (aiEmotionState).
//        3) Психологический движок: pd_confidenceTension, pd_fear и pd_tooCalm проверяют
//           проценты напрямую. «Слишком спокойный» больше не срабатывает, если рядом
//           высокий страх или напряжение.
//        x/y сохраняются и считаются из процентов по-прежнему — на них построены зоны и
//        скаттер паттернов, и на них же держатся все записи, созданные до появления шкал:
//        у них процентов нет, и для них везде оставлен прежний путь через оси.
//        Шаг ползунка 1% вместо 5%, дорожка показывает заполнение.
//
// V1.1 — карта эмоций при открытии и закрытии сделки переделана с квадрата (нужно было
//        ставить точку) на набор процентных шкал: уверенность 70%, страх 10% и т.д.
//        Модель данных НЕ менялась: x/y остаются двумя осями 0-100 и по-прежнему
//        единственное, что читают аналитика, психологический движок и Gemini. Проценты
//        сводятся в те же x/y (emotionsToPoint) и дополнительно сохраняются в
//        entry.emotions / entry.exitEmotions — только чтобы редактирование записи
//        открывалось с теми же ползунками. Записи, созданные раньше, читаются как есть:
//        процентов у них нет, ползунки восстанавливаются из x/y приближённо
//        (pointToEmotions), сама точка при этом не смещается.
//
// V1.0 — две правки:
//  1) ДОЛГАЯ СТАРТОВАЯ ЗАГРУЗКА. tryLoad ждал loadMedia ДО setLoaded(true). loadMedia делает
//     по одному getDoc на каждую запись журнала, и в каждом лежат base64-скриншоты
//     (~150-300 КБ). При 20-30 записях это несколько мегабайт, которые на LTE качаются
//     десятки секунд — всё это время висел BootLoading. Скриншоты не нужны для первого
//     рендера: теперь профиль применяется сразу, setLoaded(true) вызывается без ожидания
//     медиа, а сами скриншоты догружаются фоном и домерживаются в entries. Сохранение не
//     страдает: saveMedia удаляет только те документы, чьи id уже есть в __mediaHashes,
//     а он пуст до конца фоновой загрузки, поэтому ранний автосейв ничего не сотрёт.
//  2) Рыночный блок на главной перерисован в отдельную карточку: круглая иконка + подпись +
//     крупное значение, колонки разделены вертикальными линиями. У BTC.D — полоса прогресса
//     по значению доминации, у F&G — пилюля с текстовой меткой настроения.
//
// V0.9 — чёрный экран после сплэша. Причин было две, обе исправлены:
//  1) ГЛАВНАЯ: loadProfile/loadMedia идут через getDoc, у которого нет собственного таймаута.
//     Если запрос повисает (типично для iOS PWA на плохой сети), промис не резолвится и не
//     отклоняется — catch в tryLoad не срабатывает, setLoaded(true) не вызывается никогда,
//     и приложение остаётся в состоянии «загружается» навсегда. Обе загрузки обёрнуты в
//     caWithTimeout (15с профиль, 20с медиа): зависание превращается в обычную ошибку,
//     срабатывает существующий retry, затем штатный путь с тостом и отключённым автосейвом
//     (canPersistRef остаётся false, поэтому пустой стейт не перезапишет облако).
//  2) Между «сплэш закончился» и «профиль загрузился» не рендерилось НИЧЕГО: при
//     authStatus === "checking" и при authenticated с loaded === false ни одна ветка не
//     подходила, экран был просто чёрным. Добавлен компонент BootLoading — теперь любое
//     промежуточное состояние показывает индикатор, а не пустоту.
//
// V0.8: safe-area для шапки (регрессия V0.5); сетка рыночных метрик; сглаженный Sparkline
//       с заливкой.
// V0.7: таймауты на все вызовы Gemini (aiCallGemini 30с, vision 45с, polish 20с, market 30с).
// V0.6: сохранение черновика стратегии при уходе с экрана; висящие запятые в children.
// V0.5: прозрачная шапка; локализованы Stop Loss/Take Profit/ENTRY/EXIT/W-L-BE; настройки
//       сгруппированы (Профиль / Торговля / Приложение / Данные и сброс).
// V0.4: блок «Инсайт» — совет по собственному журналу; поле «Твоя стратегия» во всех
//       AI-контекстах; правило «стиль торговли — не ошибка».
// V0.3: промпт рыночной сводки требует конкретику, снапшот помечается grounded.
// V0.2: скрыты полосы прокрутки; withR в Patterns; caWithTimeout в калибровке; 6 новых шкал.
//
import { createRoot } from "react-dom/client";

// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  runTransaction
} from "firebase/firestore";
import { getAI, GoogleAIBackend } from "firebase/ai";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
var firebaseConfig = {
  apiKey: "AIzaSyAPSGcQOPS09ytLKi8dk0WOh0U3WfLm4_E",
  authDomain: "mindexe-29adf.firebaseapp.com",
  projectId: "mindexe-29adf",
  storageBucket: "mindexe-29adf.firebasestorage.app",
  messagingSenderId: "448455109935",
  appId: "1:448455109935:web:46862c8d072ea6cb7505da",
  measurementId: "G-NJFS3KLKFN"
};
var firebaseApp = initializeApp(firebaseConfig);
var fbAuth = getAuth(firebaseApp);
var fbDb = getFirestore(firebaseApp);
// ai/config.js — single place that controls which Gemini model is used everywhere in the app.
// Gemini 2.0/2.5 Flash and Flash-Lite are being retired in 2026 (2.0 already shut down June 1,
// 2.5 shuts down Oct 16) — 3.1 Flash-Lite is the current cheap/fast free-tier model recommended
// as their replacement, so that's what's wired in by default. Swap the model by changing this one
// constant; nothing else in the file should hardcode a model name.
var AI_MODEL = "gemini-3.1-flash-lite";
// reCAPTCHA v3 site key for Firebase App Check (Web). Firebase AI Logic doesn't require App Check
// yet, but Google has announced enforcement starting Nov 2, 2026 — create a reCAPTCHA v3 key in the
// Firebase console (App Check section) and paste it here before that date. Left blank, App Check is
// simply skipped and the app (including AI features) keeps working exactly as it does today.
var AI_APP_CHECK_SITE_KEY = "6LebzJQtAAAAAAWWewd3EI6SbiY-xoTeAjRrmrNa";
if (AI_APP_CHECK_SITE_KEY) {
  try {
    initializeAppCheck(firebaseApp, {
      provider: new ReCaptchaV3Provider(AI_APP_CHECK_SITE_KEY),
      isTokenAutoRefreshEnabled: true
    });
  } catch (_) {
  }
}
var aiLogic = getAI(firebaseApp, { backend: new GoogleAIBackend() });
configureAiService({ aiLogic, modelName: AI_MODEL });
configureTradeAi({ aiLogic, modelName: AI_MODEL, getBaseModel: aiGetModel });
var firestoreStorage = createFirestoreStorage({
  db: fbDb,
  auth: fbAuth,
  doc,
  getDoc,
  setDoc,
  deleteDoc
});
var fsSanitizeKey = firestoreStorage.sanitizeKey;
var fsDocRef = firestoreStorage.docRef;
var storageGet = firestoreStorage.get;
var storageSet = firestoreStorage.set;
var storageDelete = firestoreStorage.delete;
configureDashboardData({ storageGet, storageSet });

// mind-exe.tsx
import { Component, useState, useMemo, useRef, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
  AreaChart,
  Area
} from "recharts";
import {
  Sparkles,
  BookOpen,
  NotebookText,
  LineChart as LineChartIcon,
  Flame,
  Search,
  Trash2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  X as XIcon,
  CalendarCheck,
  ShieldCheck,
  PenLine,
  TrendingUp,
  Volume2,
  VolumeX,
  Download,
  AlertTriangle,
  Plus,
  ImagePlus,
  Gauge,
  Upload,
  Coins,
  User,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  Bot,
  Send,
  Brain,
  Star,
  TrendingDown,
  Target,
  RotateCcw,
  Zap,
  Info,
  Camera,
  Bitcoin,
  Activity
} from "lucide-react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import {
  CURRENCIES,
  computePlannedRR,
  computeRealizedRR,
  countExcludedResultEntries,
  entriesWithRealizedRR,
  findCurrency,
  formatBalance,
  formatPriceValue,
  formatResult,
  formatStoredResult,
  formatStrategyTotal,
  getStoredResultMeta,
  groupThousands,
  hasRealizedRR,
  normalizeResultByCloseType,
  normalizeResultCurrency,
  normalizeResultMode,
  outcomeFromResult,
  resultEntriesForUnit,
  resultMatchesUnit,
  unitSymbol
} from "./core/trade-math.js?v=1";
import {
  computeRRWinRateStats,
  st_mean,
  st_median,
  st_round2,
  st_stdev
} from "./core/stats.js?v=1";
import {
  EMOTION_SCALE_KEYS,
  deriveEntryStatus,
  emotionClampPct,
  emotionScaleKeys,
  emotionConflict,
  isEntryClosed,
  migrateEntry,
  normalizeEmotions
} from "./core/journal-model.js?v=2";
import { createFirestoreStorage } from "./core/firestore-storage.js?v=2";
import { createJournalMediaStore } from "./core/journal-media.js?v=1";
import { createProfileStore } from "./core/profile-store.js?v=2";
import { createStrategyStore } from "./core/strategy-store.js?v=1";
import {
  GOOGLE_REDIRECT_LEGACY_KEY, normalizeFirebaseUser, shouldPreferGoogleRedirect,
  isGooglePopupFallbackError, safeSessionGet, safeSessionSet, safeSessionRemove
} from "./core/auth-runtime.js?v=1";
import { BASE, WIN, LOSS, FLAT, WARN, ACCENTS, INSTRUMENTS, SETUP_TAGS, DIRECTION_LABEL } from "./config/app-config.js?v=1";
import { STRINGS } from "./i18n/strings.js?v=2";
import { TREND_ARROW, analyzeTraderPatterns, calculateTraderAnalytics, calculateTraderLevel } from "./analytics/trader-analytics.js?v=3";
import {
  CALIBRATION_QUESTIONS, CALIBRATION_QUESTIONS_EN, CALIBRATION_SCALE_SETS, CALIBRATION_SCALE_TYPES,
  caWithTimeout, caScaleSet, scoreCalibrationDynamic, REVIEW_LIKERT, REVIEW_LIKERT_EN,
  buildReviewQuiz, scoreJournalReview
} from "./analytics/calibration-review.js?v=2";
import { Pill, Card, Toast, ScreenshotPreviewHost, Skeleton, SkeletonLines, EmptyState, StatCard } from "./ui/primitives.js?v=2";
import { LogoMark, Wordmark } from "./ui/brand.js?v=1";
import { configureTradeAi } from "./ai/trade-tools.js?v=1";
import {
  configureAiService, aiGetModel, aiGenerateInsight, aiChatReply, aiReviewQuestions,
  aiReviewSummary, aiFetchMarketSnapshot, aiGenerateHomeAdvice, aiGenerateCalibrationQuestions
} from "./ai/ai-service.js?v=1";
import { aiBuildContext, aiHashContext, aiCompactRecentEntries, caComputeAdaptiveFactors, caBuildContext } from "./ai/context.js?v=2";
import {
  emotionStateText, emotionVerdict, emotionValuesText, emotionValuesColor,
  entryStateText, entryStateColor, EmotionScales,
  pointToEmotions, NewEntry, CloseTrade, EditTrade, Log
} from "./features/journal/journal-ui.js?v=2";
import { strategyAllTrades, calculateStrategyStats, normalizeStrategyResultByCloseType, strategyResultOutcome, StrategyLab } from "./features/strategy/strategy-lab.js?v=2";
import { Settings } from "./features/settings/settings-ui.js?v=1";
import { Coach } from "./features/coach/coach-ui.js?v=1";
import { Calibration, JournalReview } from "./features/calibration/calibration-ui.js?v=2";
import { configureDashboardData, Home, Patterns, Challenge } from "./features/dashboard/dashboard-ui.js?v=1";
import { AuthScreen, LegacyMigratePrompt, BootIntro } from "./features/auth/auth-ui.js?v=1";
import { BootLoading, ProfileLoadErrorScreen, Splash, WalletBadge, ProfileBadge, MobileNavItem, MobileNavPrimaryButton, WalletSheet, DesktopSidebar, AppErrorBoundary } from "./ui/app-shell.js?v=1";
// V3.0 — палитра переведена на референс: чистый чёрный фон, поверхности почти сливаются
// с ним, линии существуют, но не читаются как рамки. Раньше фон был #0A0A0B, а карточка
// #131315 с видимой границей #25252A — на OLED это выглядит как набор коробок, а не как
// один экран. Теперь разделение делается только сдвигом яркости поверхности.
var ring = (accent) => `0 0 0 1px ${accent}35`;
var softLift = (accent) => `0 0 0 1px ${accent}35, 0 6px 20px ${accent}1F`;
var isToday = (isoDate) => !!isoDate && new Date(isoDate).toDateString() === (/* @__PURE__ */ new Date()).toDateString();
function calibHistoryKey(userId) {
  return `mind-exe-calib-history:${userId}`;
}
async function caLoadCalibrationHistory(userId) {
  if (!fbAuth.currentUser || !userId) return [];
  try {
    // V0.1 — второй возможный источник вечной загрузки: чтение из Firestore при потере сети
    // может не завершиться. Без истории калибровка работает корректно (просто нет кэша и
    // recentQuestions), поэтому по таймауту возвращаем пустую историю, а не зависаем.
    const res = await caWithTimeout(storageGet(calibHistoryKey(userId), false), 1e4, "calib_history_timeout");
    return res?.value ? JSON.parse(res.value) : [];
  } catch (_) {
    return [];
  }
}
async function caSaveCalibrationHistory(userId, history) {
  if (!fbAuth.currentUser || !userId) return;
  try {
    await storageSet(calibHistoryKey(userId), JSON.stringify(history.slice(0, 14)), false);
  } catch (_) {
  }
}

function sanitizeImportedEntry(e, fallbackIndex) {
  if (!e || typeof e !== "object") return null;
  const date = new Date(e.date);
  if (isNaN(date.getTime())) return null;
  const exitDate = e.exitDate ? new Date(e.exitDate) : null;
  const clampCoord = (v) => typeof v === "number" && !isNaN(v) ? Math.max(0, Math.min(100, v)) : null;
  const outcome = ["Win", "Loss", "Breakeven"].includes(e.outcome) ? e.outcome : null;
  return migrateEntry({
    id: e.id != null ? String(e.id) : `imported_${Date.now()}_${fallbackIndex}_${Math.random().toString(36).slice(2, 6)}`,
    status: e.status === "open" || e.status === "closed" ? e.status : void 0,
    instrument: typeof e.instrument === "string" && e.instrument ? e.instrument : "\u2014",
    direction: e.direction === "Short" ? "Short" : "Long",
    outcome,
    r: typeof e.r === "number" && !isNaN(e.r) ? e.r : null,
    resultMode: normalizeResultMode(e.resultMode),
    resultCurrency: normalizeResultCurrency(e.resultCurrency),
    tag: typeof e.tag === "string" && e.tag ? e.tag : "\u041E\u0431\u0449\u0435\u0435",
    strategyId: typeof e.strategyId === "string" && e.strategyId ? e.strategyId : null,
    x: clampCoord(e.x),
    y: clampCoord(e.y),
    exitX: clampCoord(e.exitX),
    exitY: clampCoord(e.exitY),
    pull: typeof e.pull === "string" && e.pull ? e.pull : "\u2014",
    lesson: typeof e.lesson === "string" && e.lesson ? e.lesson : "\u2014",
    date,
    exitDate: !isNaN(exitDate?.getTime()) ? exitDate : null,
    screenshots: Array.isArray(e.screenshots) ? e.screenshots.filter((s) => typeof s === "string").slice(0, 4) : [],
    exitScreenshots: Array.isArray(e.exitScreenshots) ? e.exitScreenshots.filter((s) => typeof s === "string").slice(0, 4) : [],
    entryPrice: typeof e.entryPrice === "number" && !isNaN(e.entryPrice) ? e.entryPrice : null,
    exitPrice: typeof e.exitPrice === "number" && !isNaN(e.exitPrice) ? e.exitPrice : null,
    stopLoss: e.stopLoss,
    takeProfit: e.takeProfit,
    plannedRR: e.plannedRR,
    closeType: e.closeType,
    realizedRR: e.realizedRR,
    rr: typeof e.rr === "number" && !isNaN(e.rr) ? e.rr : null
  });
}
var SCHEMA_VERSION = 2;
var PROFILE_KEY = "mind-exe-journal-state";
var MEDIA_KEY = "mind-exe-journal-media";
var PROFILE_SHADOW_KEY = "mind-exe-cloud-shadow";
var ANON_ID_KEY = "mind-exe-anon-id";
var __lastProfileRecoverySource = null;
function directShadowKey(userId) {
  return `${PROFILE_SHADOW_KEY}:${userId}`;
}
function readDirectProfileShadow(userId) {
  try {
    const value = window.localStorage?.getItem(directShadowKey(userId));
    if (!value) return null;
    const profile = parseStoredProfileValue(value);
    return {
      key: directShadowKey(userId),
      profile,
      updatedAt: profile?.meta?.updatedAt ?? null,
      local: true
    };
  } catch (_) {
    return null;
  }
}
function writeDirectProfileShadow(userId, profile) {
  if (!userId || !profile) return;
  try {
    window.localStorage?.setItem(directShadowKey(userId), JSON.stringify({ ...profile, version: SCHEMA_VERSION }));
  } catch (_) {
  }
}
function getOrCreateAnonId() {
  try {
    let id = window.localStorage?.getItem(ANON_ID_KEY);
    if (!id) {
      id = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage?.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch (_) {
    return "anon_local";
  }
}
function migrateProfile(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (raw.version === SCHEMA_VERSION) return raw;
  if (!raw.version) {
    return {
      version: 2,
      user: { name: typeof raw.name === "string" ? raw.name : "" },
      journal: { entries: Array.isArray(raw.entries) ? raw.entries : [] },
      settings: {
        accentIndex: typeof raw.accentIndex === "number" ? raw.accentIndex : void 0,
        soundOn: typeof raw.soundOn === "boolean" ? raw.soundOn : true,
        weeklyGoal: typeof raw.weeklyGoal === "number" ? raw.weeklyGoal : 7,
        measureMode: raw.measureMode || "R",
        currency: raw.currency || "USD",
        startingCapital: typeof raw.startingCapital === "number" ? raw.startingCapital : 1e3,
        customInstruments: Array.isArray(raw.customInstruments) ? raw.customInstruments : [],
        customTags: Array.isArray(raw.customTags) ? raw.customTags : []
      },
      progress: { lastCalibration: raw.lastCalibration ?? null },
      wallet: {
        mindCoins: typeof raw.mindCoins === "number" ? raw.mindCoins : 0,
        coinLedger: Array.isArray(raw.coinLedger) ? raw.coinLedger : [],
        lastDailyReward: raw.lastDailyReward ?? null
      }
    };
  }
  return raw;
}
var __storageChain = Promise.resolve();
function queueStorage(fn) {
  const run = __storageChain.then(fn, fn);
  __storageChain = run.then(() => {
  }, () => {
  });
  return run;
}
async function withStorageRetry(fn, attempts = 4, delayMs = 150) {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      const isBridgeGlitch = /unexpected response/i.test(String(e?.message || e || ""));
      if (i === attempts - 1 || !isBridgeGlitch) throw e;
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
}
var storageDegraded = false;
function markStorageDegraded(e) {
  if (/unexpected response/i.test(String(e?.message || e || ""))) storageDegraded = true;
}
async function legacyStorageGet(key, shared = false) {
  if (!window.storage || storageDegraded) return null;
  try {
    return await queueStorage(() => withStorageRetry(() => window.storage.get(key, shared)));
  } catch (e) {
    markStorageDegraded(e);
    throw e;
  }
}
async function legacyStorageSet(key, value, shared = false) {
  if (!window.storage || storageDegraded) return null;
  try {
    return await queueStorage(() => withStorageRetry(() => window.storage.set(key, value, shared)));
  } catch (e) {
    markStorageDegraded(e);
    throw e;
  }
}
function profileKey(userId) {
  return `${PROFILE_KEY}:${userId}`;
}
function mediaKey(userId) {
  return `${MEDIA_KEY}:${userId}`;
}
function aiKey(userId) {
  return `mind-exe-ai:${userId}`;
}
var profileStore = createProfileStore({
  storageGet,
  storageSet,
  storageDelete,
  getDocRef: fsDocRef,
  runTransaction,
  db: fbDb,
  profileBaseKey: PROFILE_KEY,
  schemaVersion: SCHEMA_VERSION,
  logger: console
});
async function loadAiState(userId) {
  if (!fbAuth.currentUser || !userId) return { analysis: "", chatMessages: [] };
  try {
    const res = await storageGet(aiKey(userId), false);
    return res?.value ? JSON.parse(res.value) : { analysis: "", chatMessages: [] };
  } catch (_) {
    return { analysis: "", chatMessages: [] };
  }
}
async function saveAiState(userId, aiState) {
  if (!fbAuth.currentUser || !userId) return;
  try {
    await storageSet(aiKey(userId), JSON.stringify(aiState), false);
  } catch (_) {
  }
}
function assertProfileAuthUser(userId) {
  const uid = fbAuth.currentUser?.uid;
  if (!uid || !userId || uid !== userId) throw new Error("profile_auth_uid_mismatch");
}
function parseStoredProfileValue(value) {
  if (!value) return null;
  const parsed = migrateProfile(JSON.parse(value));
  if (!parsed) throw new Error("profile_unreadable");
  return parsed;
}
function profileEntryCount(profile) {
  return Array.isArray(profile?.journal?.entries) ? profile.journal.entries.filter((e) => e && e.id).length : 0;
}
function profileMeaningScore(profile) {
  if (!profile) return -1;
  let score = profileEntryCount(profile) * 100;
  if (profile?.user?.name) score += 10;
  if (profile?.settings?.strategyNote) score += 8;
  if (profile?.settings?.tradingAsset) score += 4;
  if (Array.isArray(profile?.settings?.customInstruments)) score += Math.min(10, profile.settings.customInstruments.length);
  if (Array.isArray(profile?.settings?.customTags)) score += Math.min(10, profile.settings.customTags.length);
  if (profile?.progress?.lastCalibration) score += 5;
  if (typeof profile?.wallet?.mindCoins === "number" && profile.wallet.mindCoins !== 0) score += 3;
  if (Array.isArray(profile?.wallet?.coinLedger)) score += Math.min(10, profile.wallet.coinLedger.length);
  return score;
}
function profileIsEffectivelyBlank(profile) {
  if (!profile) return true;
  return profileEntryCount(profile) === 0
    && !profile?.user?.name
    && !profile?.settings?.strategyNote
    && !profile?.settings?.tradingAsset
    && (!Array.isArray(profile?.settings?.customInstruments) || profile.settings.customInstruments.length === 0)
    && (!Array.isArray(profile?.settings?.customTags) || profile.settings.customTags.length === 0)
    && !profile?.progress?.lastCalibration
    && !(typeof profile?.wallet?.mindCoins === "number" && profile.wallet.mindCoins !== 0)
    && (!Array.isArray(profile?.wallet?.coinLedger) || profile.wallet.coinLedger.length === 0);
}
function profileTimestampMs(value) {
  if (value == null) return 0;
  const n = typeof value === "number" ? value : Date.parse(value);
  return Number.isFinite(n) ? n : 0;
}
function profileRecoveryUpdatedAt(profile, fallbackUpdatedAt = null) {
  return Math.max(
    profileTimestampMs(profile?.meta?.updatedAt),
    profileTimestampMs(profile?.meta?.persistence?.savedAt),
    profileTimestampMs(fallbackUpdatedAt)
  );
}
function profileOwnResetMs(profile, key) {
  return profileTimestampMs(profile?.meta?.[key]);
}
function applyProfileResetBoundaries(profile, resetState, fallbackUpdatedAt = null) {
  if (!profile) return null;
  const candidateMs = profileRecoveryUpdatedAt(profile, fallbackUpdatedAt);
  const fullResetMs = profileTimestampMs(resetState?.fullResetAt);
  const journalResetMs = profileTimestampMs(resetState?.journalResetAt);
  const ownsFullBoundary = fullResetMs > 0 && profileOwnResetMs(profile, "fullResetAt") >= fullResetMs;
  const ownsJournalBoundary = journalResetMs > 0 && profileOwnResetMs(profile, "journalResetAt") >= journalResetMs;

  // A durable full-reset tombstone is stronger than any older/undated recovery snapshot.
  if (fullResetMs > 0 && !ownsFullBoundary && (!candidateMs || candidateMs <= fullResetMs)) {
    return null;
  }

  // Journal reset is narrower: an older profile may still recover settings/wallet, but its trades
  // must never come back. Preserve the tombstone in meta so future saves keep the same boundary.
  if (journalResetMs > 0 && !ownsJournalBoundary && (!candidateMs || candidateMs <= journalResetMs)) {
    return {
      ...profile,
      meta: {
        ...(profile.meta || {}),
        journalResetAt: resetState.journalResetAt,
        intentionalJournalReset: true
      },
      journal: {
        ...(profile.journal || {}),
        entries: []
      }
    };
  }
  return profile;
}
function compareRecoveryCandidates(a, b) {
  const at = profileRecoveryUpdatedAt(a?.profile, a?.updatedAt);
  const bt = profileRecoveryUpdatedAt(b?.profile, b?.updatedAt);
  if (at && bt && at !== bt) return bt - at;
  if (at && !bt) return -1;
  if (!at && bt) return 1;
  return profileMeaningScore(b?.profile) - profileMeaningScore(a?.profile);
}
async function readProfileCandidateCloud(key) {
  try {
    const res = await storageGet(key, false);
    if (!res?.value) return null;
    const profile = parseStoredProfileValue(res.value);
    return {
      key,
      profile,
      updatedAt: res.updatedAt ?? profile?.meta?.updatedAt ?? null,
      local: false
    };
  } catch (_) {
    return null;
  }
}
async function readProfileShadow(userId) {
  const direct = readDirectProfileShadow(userId);
  if (direct) return direct;
  try {
    const res = await legacyStorageGet(`${PROFILE_SHADOW_KEY}:${userId}`, false);
    if (!res?.value) return null;
    const profile = parseStoredProfileValue(res.value);
    return {
      key: `${PROFILE_SHADOW_KEY}:${userId}`,
      profile,
      updatedAt: res.updatedAt ?? profile?.meta?.updatedAt ?? null,
      local: true
    };
  } catch (_) {
    return null;
  }
}
async function saveProfile(userId, profile) {
  assertProfileAuthUser(userId);
  const normalized = { ...profile, version: SCHEMA_VERSION };
  const saved = await profileStore.save(userId, normalized);
  const committedProfile = saved?.profile || normalized;
  writeDirectProfileShadow(userId, committedProfile);
  try {
    await legacyStorageSet(`${PROFILE_SHADOW_KEY}:${userId}`, JSON.stringify(committedProfile), false);
  } catch (_) {
  }
  return committedProfile;
}
async function saveProfileBackupIfSafer(userId, candidateProfile) {
  assertProfileAuthUser(userId);
  if (!candidateProfile) return;

  // V4.7: split persistence already keeps immutable previous revisions.
  // During the first migration the untouched legacy canonical document itself is the rollback copy,
  // so do not create another potentially >1 MiB backup document.
  if (profileStore.hasManifest()) return;
  try {
    const legacyCanonical = await storageGet(profileKey(userId), false);
    if (legacyCanonical?.value) return;
  } catch (_) {
  }

  // Very old accounts without a canonical document may still have the historic backup slot.
  const backupKey = `${PROFILE_KEY}:backup:${userId}`;
  let existing = null;
  try {
    const res = await storageGet(backupKey, false);
    existing = res?.value ? parseStoredProfileValue(res.value) : null;
  } catch (_) {
  }
  if (existing && profileMeaningScore(existing) > profileMeaningScore(candidateProfile)) return;
  await storageSet(backupKey, JSON.stringify({ ...candidateProfile, version: SCHEMA_VERSION }), false);
}
async function loadProfile(userId) {
  assertProfileAuthUser(userId);
  __lastProfileRecoverySource = null;

  const split = await profileStore.load(userId);
  const resetState = split?.resetState || null;
  let canonical = split?.profile
    ? applyProfileResetBoundaries(
        parseStoredProfileValue(JSON.stringify(split.profile)),
        resetState,
        split.loadedRevisionAt
      )
    : null;
  let canonicalExists = split?.manifestExists === true;

  if (split?.source === "history" && canonical) {
    __lastProfileRecoverySource = `profile-revision:${split.loadedRevision}`;
  }

  // A full-reset tombstone survives even if the manifest/revisions are later damaged or removed.
  // In that case returning null/defaults is safer than ever reviving a pre-reset cloud/shadow copy.
  const fullResetAt = profileTimestampMs(resetState?.fullResetAt);
  if (!canonical && fullResetAt > 0) {
    __lastProfileRecoverySource = "full-reset-tombstone";
    return null;
  }

  // No usable split revision: the old canonical document is still a read-only fallback.
  if (!canonical) {
    try {
      const legacyPrimary = await storageGet(profileKey(userId), false);
      if (legacyPrimary?.value) {
        const rawLegacy = parseStoredProfileValue(legacyPrimary.value);
        const boundedLegacy = applyProfileResetBoundaries(rawLegacy, resetState, legacyPrimary.updatedAt);
        if (boundedLegacy) {
          canonical = boundedLegacy;
          canonicalExists = true;
          if (split?.manifestExists) __lastProfileRecoverySource = "legacy-canonical";
        }
      }
    } catch (_) {
    }
  }

  if (!canonicalExists && __freshAccountUids.has(userId)) {
    __freshAccountUids.delete(userId);
    return null;
  }

  const hasIntentionalBoundary = !!(
    canonical?.meta?.intentionalFullReset === true ||
    canonical?.meta?.intentionalJournalReset === true ||
    profileTimestampMs(canonical?.meta?.fullResetAt) > 0 ||
    profileTimestampMs(canonical?.meta?.journalResetAt) > 0
  );

  const shouldRecover = !canonicalExists || (profileIsEffectivelyBlank(canonical) && !hasIntentionalBoundary);
  if (!shouldRecover) return canonical;

  const rawCandidates = (await Promise.all([
    readProfileCandidateCloud(`${PROFILE_KEY}:backup:${userId}`),
    readProfileCandidateCloud(profileKey(userId)),
    readProfileCandidateCloud(PROFILE_KEY),
    readProfileShadow(userId)
  ])).filter(Boolean);

  const candidates = rawCandidates
    .map((candidate) => {
      const bounded = applyProfileResetBoundaries(candidate.profile, resetState, candidate.updatedAt);
      return bounded ? { ...candidate, profile: bounded } : null;
    })
    .filter(Boolean)
    .sort(compareRecoveryCandidates);

  const best = candidates[0] || null;
  if (best) {
    const currentTime = profileRecoveryUpdatedAt(canonical);
    const bestTime = profileRecoveryUpdatedAt(best.profile, best.updatedAt);
    const bestIsNewer = bestTime > 0 && (currentTime === 0 || bestTime > currentTime);
    const unknownTimeButRicher = bestTime === 0 && currentTime === 0 &&
      profileMeaningScore(best.profile) > profileMeaningScore(canonical);

    if (!canonical || bestIsNewer || unknownTimeButRicher) {
      const recovered = await saveProfile(userId, best.profile);
      canonical = recovered || best.profile;
      __lastProfileRecoverySource = best.local ? "device-shadow" : best.key;
    }
  }

  return canonical;
}
// Journal screenshot persistence is isolated in core/journal-media.js.
// app.js supplies storage/auth/timeout dependencies; the module owns its media caches/readiness.
var journalMediaStore = createJournalMediaStore({
  storageGet,
  storageSet,
  storageDelete,
  isAuthenticated: () => !!fbAuth.currentUser,
  withTimeout: caWithTimeout,
  mediaBaseKey: MEDIA_KEY,
  legacyMapKey: mediaKey,
  logger: console
});
// ---- Strategy Lab persistence -------------------------------------------------
// Kept completely separate from PROFILE_KEY / MEDIA_KEY. Journal entries only store an optional
// strategyId reference; direct Strategy Lab trades live in their own documents and have their own
// media documents. This avoids both profile bloat and duplicated journal screenshots.
var STRATEGY_SCHEMA_VERSION = 1;
var STRATEGY_INDEX_KEY = "mind-exe-strategy-index";
var STRATEGY_TRADE_KEY = "mind-exe-strategy-trade";
var STRATEGY_MEDIA_KEY = "mind-exe-strategy-media";
function strategyIndexKey(userId) {
  return `${STRATEGY_INDEX_KEY}:${userId}`;
}
function strategyTradeKey(userId, tradeId) {
  return `${STRATEGY_TRADE_KEY}:${userId}:${tradeId}`;
}
function strategyMediaKey(userId, tradeId, phase, index) {
  return `${STRATEGY_MEDIA_KEY}:${userId}:${tradeId}:${phase}:${index}`;
}
var strategyStore = createStrategyStore({
  storageGet,
  storageSet,
  storageDelete,
  getDocRef: fsDocRef,
  runTransaction,
  db: fbDb,
  indexBaseKey: STRATEGY_INDEX_KEY,
  tradeBaseKey: STRATEGY_TRADE_KEY,
  indexSchemaVersion: STRATEGY_SCHEMA_VERSION,
  logger: console
});
function normalizeStrategy(raw) {
  if (!raw || typeof raw !== "object" || !raw.id) return null;
  return {
    ...raw,
    name: typeof raw.name === "string" ? raw.name : "Strategy",
    description: typeof raw.description === "string" ? raw.description : "",
    version: typeof raw.version === "number" && raw.version > 0 ? raw.version : 1,
    status: raw.status === "archived" ? "archived" : "active",
    tradeIds: Array.isArray(raw.tradeIds) ? [...new Set(raw.tradeIds.filter(Boolean))] : [],
    createdAt: raw.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: raw.updatedAt || raw.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
    aiReview: typeof raw.aiReview === "string" ? raw.aiReview : "",
    aiReviewedAt: raw.aiReviewedAt || null
  };
}
function migrateStrategyTrade(raw) {
  if (!raw || typeof raw !== "object" || !raw.id || !raw.strategyId) return null;
  const status = raw.status === "closed" ? "closed" : "open";
  const closeType = ["tp", "sl", "manual"].includes(raw.closeType) ? raw.closeType : null;
  const rawResult = typeof raw.r === "number" && isFinite(raw.r) ? raw.r : null;
  const normalizedResult = status === "closed" && rawResult != null
    ? normalizeStrategyResultByCloseType(closeType, rawResult)
    : rawResult;
  const resultMode = normalizeResultMode(raw.resultMode);
  const resultCurrency = resultMode === "currency" ? normalizeResultCurrency(raw.resultCurrency) : null;
  return {
    ...raw,
    status,
    closeType,
    resultMode,
    resultCurrency,
    date: raw.date instanceof Date ? raw.date : new Date(raw.date || Date.now()),
    exitDate: raw.exitDate ? raw.exitDate instanceof Date ? raw.exitDate : new Date(raw.exitDate) : null,
    screenshots: Array.isArray(raw.screenshots) ? raw.screenshots : [],
    exitScreenshots: Array.isArray(raw.exitScreenshots) ? raw.exitScreenshots : [],
    entryPrice: typeof raw.entryPrice === "number" && isFinite(raw.entryPrice) ? raw.entryPrice : null,
    stopLoss: typeof raw.stopLoss === "number" && isFinite(raw.stopLoss) ? raw.stopLoss : null,
    takeProfit: typeof raw.takeProfit === "number" && isFinite(raw.takeProfit) ? raw.takeProfit : null,
    plannedRR: typeof raw.plannedRR === "number" && isFinite(raw.plannedRR) ? raw.plannedRR : null,
    exitPrice: typeof raw.exitPrice === "number" && isFinite(raw.exitPrice) ? raw.exitPrice : null,
    realizedRR: typeof raw.realizedRR === "number" && isFinite(raw.realizedRR) ? raw.realizedRR : null,
    r: normalizedResult,
    outcome: normalizedResult == null ? raw.outcome || null : strategyResultOutcome(normalizedResult),
    rulesFollowed: typeof raw.rulesFollowed === "boolean" ? raw.rulesFollowed : null,
    rulesNote: typeof raw.rulesNote === "string" ? raw.rulesNote : ""
  };
}
async function loadStrategyLabState(userId) {
  if (!fbAuth.currentUser || !userId) {
    return { strategies: [], trades: [], rawIndex: null, indexSource: "empty" };
  }

  const indexState = await strategyStore.loadIndex(userId);
  const parsed = indexState?.payload || { version: STRATEGY_SCHEMA_VERSION, strategies: [] };
  const strategies = (Array.isArray(parsed.strategies) ? parsed.strategies : [])
    .map(normalizeStrategy)
    .filter(Boolean);
  const tradeIds = [...new Set(strategies.flatMap((s) => s.tradeIds || []))];

  const rows = await Promise.all(tradeIds.map(async (id) => {
    try {
      const tradeRes = await storageGet(strategyTradeKey(userId, id), false);
      if (!tradeRes?.value) return null;
      const tradeRaw = JSON.parse(tradeRes.value);
      const trade = migrateStrategyTrade(tradeRaw);
      if (!trade) return null;
      const entryCount = Math.max(0, Math.min(4, Number(tradeRaw.entryShotCount) || 0));
      const exitCount = Math.max(0, Math.min(4, Number(tradeRaw.exitShotCount) || 0));
      const readShots = async (phase, count) => {
        const shots = await Promise.all(
          Array.from({ length: count }, (_, i) => (
            storageGet(strategyMediaKey(userId, id, phase, i), false)
              .then((r) => r?.value || null)
              .catch(() => null)
          ))
        );
        return shots.filter((v) => typeof v === "string" && v.startsWith("data:image/"));
      };
      trade.screenshots = await readShots("entry", entryCount);
      trade.exitScreenshots = await readShots("exit", exitCount);
      return trade;
    } catch (_) {
      return null;
    }
  }));

  return {
    strategies,
    trades: rows.filter(Boolean),
    rawIndex: parsed,
    indexSource: indexState?.source || "empty",
    strategyManifest: indexState?.manifest || null
  };
}
async function saveStrategyIndex(userId, strategies, options = {}) {
  if (!fbAuth.currentUser || !userId) return null;
  const payload = {
    version: STRATEGY_SCHEMA_VERSION,
    strategies: (strategies || []).map((s) => ({
      ...s,
      tradeIds: Array.isArray(s.tradeIds) ? [...new Set(s.tradeIds.filter(Boolean))] : []
    }))
  };
  const saved = options.reset === true
    ? await strategyStore.resetIndex(userId)
    : await strategyStore.saveIndex(userId, payload);
  return options.reset === true ? saved.payload : saved.payload;
}
async function saveStrategyTradeRecord(userId, trade, options = {}) {
  if (!fbAuth.currentUser || !userId || !trade?.id) return { mediaErrors: [] };
  const cleanupStale = options.cleanupStale !== false;
  const mediaPhases = Array.isArray(options.mediaPhases) && options.mediaPhases.length
    ? new Set(options.mediaPhases)
    : new Set(["entry", "exit"]);
  const clean = { ...trade };
  const entryShots = Array.isArray(clean.screenshots) ? clean.screenshots.slice(0, 4) : [];
  const exitShots = Array.isArray(clean.exitScreenshots) ? clean.exitScreenshots.slice(0, 4) : [];
  delete clean.screenshots;
  delete clean.exitScreenshots;
  clean.entryShotCount = entryShots.length;
  clean.exitShotCount = exitShots.length;
  clean.date = clean.date instanceof Date ? clean.date.toISOString() : clean.date;
  clean.exitDate = clean.exitDate instanceof Date ? clean.exitDate.toISOString() : clean.exitDate;
  // Structured record is committed transactionally before media. New fields are additive and
  // older Strategy Lab records without persistenceRevision are treated as revision 0.
  const committedClean = await strategyStore.saveTrade(userId, clean, {
    createOnly: options.createOnly === true,
    upsert: options.upsert === true,
    expectedRevision: options.expectedRevision
  });
  const mediaErrors = [];
  const saveOne = async (phase, index, value) => {
    let lastError = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await storageSet(strategyMediaKey(userId, trade.id, phase, index), value, false);
        return;
      } catch (e) {
        lastError = e;
        if (attempt < 2) await new Promise((r) => setTimeout(r, 180 * (attempt + 1)));
      }
    }
    mediaErrors.push({ phase, index, error: lastError });
  };
  const savePhase = async (phase, shots) => {
    const writes = shots.map((value, i) => saveOne(phase, i, value));
    const cleanup = [];
    // A brand-new trade cannot have stale screenshot slots, so creation explicitly skips these
    // network calls. Updates/closing trades still clean removed screenshots exactly as before.
    if (cleanupStale) {
      for (let i = shots.length; i < 4; i++) {
        cleanup.push(
          storageDelete(strategyMediaKey(userId, trade.id, phase, i), false).catch(() => null)
        );
      }
    }
    await Promise.all([...writes, ...cleanup]);
  };
  const phaseJobs = [];
  if (mediaPhases.has("entry")) phaseJobs.push(savePhase("entry", entryShots));
  if (mediaPhases.has("exit")) phaseJobs.push(savePhase("exit", exitShots));
  await Promise.all(phaseJobs);
  const committedTrade = migrateStrategyTrade({
    ...committedClean,
    screenshots: entryShots,
    exitScreenshots: exitShots
  });
  return { mediaErrors, committedTrade };
}
async function deleteStrategyTradeRecord(userId, tradeId) {
  if (!fbAuth.currentUser || !userId || !tradeId) return { failed: 0 };
  const jobs = [storageDelete(strategyTradeKey(userId, tradeId), false)];
  for (const phase of ["entry", "exit"]) {
    for (let i = 0; i < 4; i++) {
      jobs.push(storageDelete(strategyMediaKey(userId, tradeId, phase, i), false));
    }
  }
  const settled = await Promise.allSettled(jobs);
  return { failed: settled.filter((r) => r.status === "rejected").length };
}
async function clearAuxiliaryUserDataForFullReset(userId, knownTradeIds = []) {
  if (!fbAuth.currentUser || !userId) throw new Error("full_reset_auth_missing");

  // Make Strategy Lab unreachable FIRST. Physical trade/media cleanup can then be best-effort
  // without ever bringing deleted strategies back into the UI.
  let tradeIds = [...new Set((knownTradeIds || []).filter(Boolean))];

  // Prefer the revisioned index, but also inspect the old canonical index for pre-v4.8 leftovers.
  try {
    const state = await strategyStore.loadIndex(userId);
    const splitStrategies = Array.isArray(state?.payload?.strategies) ? state.payload.strategies : [];
    tradeIds = [...new Set([
      ...tradeIds,
      ...splitStrategies.flatMap((s) => Array.isArray(s?.tradeIds) ? s.tradeIds : [])
    ].filter(Boolean))];
  } catch (_) {
  }
  try {
    const res = await storageGet(strategyIndexKey(userId), false);
    if (res?.value) {
      const parsed = JSON.parse(res.value);
      const legacyStrategies = Array.isArray(parsed?.strategies) ? parsed.strategies : [];
      tradeIds = [...new Set([
        ...tradeIds,
        ...legacyStrategies.flatMap((s) => Array.isArray(s?.tradeIds) ? s.tradeIds : [])
      ].filter(Boolean))];
    }
  } catch (_) {
  }

  const resetIndexResult = await strategyStore.resetIndex(userId);
  const emptyStrategyIndex = resetIndexResult?.payload || { version: STRATEGY_SCHEMA_VERSION, strategies: [] };

  const tradeCleanup = await Promise.all(
    tradeIds.map((tradeId) => deleteStrategyTradeRecord(userId, tradeId))
  );
  const tradeCleanupFailed = tradeCleanup.reduce((sum, row) => sum + (row?.failed || 0), 0);

  const jobs = [
    storageDelete(`${STRATEGY_INDEX_KEY}:backup:${userId}`, false),
    storageDelete(aiKey(userId), false),
    storageDelete(calibHistoryKey(userId), false),
    // Pre-v4.7 profile snapshots contain data that a full reset explicitly supersedes.
    storageDelete(`${PROFILE_KEY}:backup:${userId}`, false),
    storageDelete(profileKey(userId), false),
    storageDelete(PROFILE_KEY, false)
  ];

  const settled = await Promise.allSettled(jobs);
  const failed = settled.filter((r) => r.status === "rejected");
  return {
    strategyIndex: emptyStrategyIndex,
    tradeIds,
    cleanupFailed: failed.length + tradeCleanupFailed
  };
}

var AUTH_USERS_KEY = "mind-exe-auth-users";
var LEGACY_CLAIMED_KEY = "mind-exe-legacy-claimed";
var LOCAL_MIGRATED_KEY = "mind-exe-local-migrated";
var USERNAME_RE = /^[a-z0-9_.-]{3,32}$/;
var __freshAccountUids = /* @__PURE__ */ new Set();
function usernameToEmail(username) {
  return `${username.trim().toLowerCase()}@mindexe.local`;
}
function emailToUsername(email) {
  return (email || "").split("@")[0];
}
async function findLegacyLocalUser(username) {
  try {
    const res = await legacyStorageGet(AUTH_USERS_KEY, false);
    const users = res?.value ? JSON.parse(res.value) : {};
    return users[username.trim().toLowerCase()] || null;
  } catch (_) {
    return null;
  }
}
// Migration must never clobber an account that already has cloud data \u2014 both migration paths now
// MERGE: journal entries are unioned by id with the cloud copy winning on conflict (it is the newer,
// already-synced version), settings/wallet come from the cloud when present, and screenshots are only
// written for entries that don't already have a cloud document.
function mergeProfiles(cloudRaw, legacyRaw) {
  const cloud = migrateProfile(cloudRaw);
  const legacy = migrateProfile(legacyRaw);
  if (!cloud) return legacy;
  if (!legacy) return cloud;
  const byId = /* @__PURE__ */ new Map();
  for (const e of legacy.journal?.entries || []) if (e && e.id) byId.set(e.id, e);
  for (const e of cloud.journal?.entries || []) if (e && e.id) byId.set(e.id, e);
  return {
    ...cloud,
    user: { ...legacy.user, ...cloud.user },
    settings: { ...legacy.settings, ...cloud.settings },
    progress: { ...legacy.progress, ...cloud.progress },
    wallet: { ...legacy.wallet, ...cloud.wallet },
    journal: { entries: [...byId.values()] }
  };
}
async function mergeLegacyIntoCloud(userId, legacyProfileRaw, legacyMediaRaw) {
  if (legacyProfileRaw) {
    let existing = null;
    try {
      const res = await storageGet(profileKey(userId), false);
      existing = res?.value ? JSON.parse(res.value) : null;
    } catch (_) {
      // If we can't confirm what's already in the cloud, refuse to write \u2014 overwriting real data
      // is strictly worse than skipping a migration the user can retry.
      return;
    }
    const merged = mergeProfiles(existing, JSON.parse(legacyProfileRaw));
    if (merged) await storageSet(profileKey(userId), JSON.stringify({ ...merged, version: SCHEMA_VERSION }), false);
  }
  if (legacyMediaRaw) {
    let media = {};
    try {
      media = JSON.parse(legacyMediaRaw) || {};
    } catch (_) {
    }
    for (const [id, val] of Object.entries(media)) {
      try {
        const cur = await storageGet(journalMediaStore.keys.entry(userId, id), false);
        if (!cur?.value) await storageSet(journalMediaStore.keys.entry(userId, id), JSON.stringify(val), false);
      } catch (_) {
      }
    }
  }
}
async function migrateLocalAccountIfNeeded(uid, username) {
  try {
    // Local lookup first: the normal/new-account path now avoids a Firestore read entirely.
    const legacyUser = await findLegacyLocalUser(username);
    if (!legacyUser) return "none";
    const already = await storageGet(LOCAL_MIGRATED_KEY, false);
    if (already?.value) return "done";
    const [legacyProfile, legacyMedia] = await Promise.all([
      legacyStorageGet(profileKey(legacyUser.id), false).catch(() => null),
      legacyStorageGet(mediaKey(legacyUser.id), false).catch(() => null)
    ]);
    await mergeLegacyIntoCloud(uid, legacyProfile?.value || null, legacyMedia?.value || null);
    await storageSet(LOCAL_MIGRATED_KEY, "1", false);
    return "done";
  } catch (e) {
    console.warn("mind.exe: local\u2192Firebase account migration skipped", e);
    return "error";
  }
}
function createFirebaseAuthProvider() {
  const googleProvider = () => new GoogleAuthProvider();
  return {
    async register(username, password) {
      const uname = (username || "").trim();
      if (!USERNAME_RE.test(uname.toLowerCase())) {
        throw new Error("Логин: 3-32 символа, латиница/цифры/._-");
      }
      if ((password || "").length < 6) {
        throw new Error("Пароль должен быть от 6 символов");
      }
      const cred = await createUserWithEmailAndPassword(fbAuth, usernameToEmail(uname), password);
      // Account creation has already succeeded at this point. A transient updateProfile failure must
      // not make the UI report registration as failed while leaving a live Firebase account behind.
      // usernameToEmail gives us the same username fallback on every future session anyway.
      try {
        await firebaseUpdateProfile(cred.user, { displayName: uname });
      } catch (e) {
        console.warn("mind.exe: Firebase displayName update deferred", e);
      }
      const migration = await migrateLocalAccountIfNeeded(cred.user.uid, uname);
      if (migration === "none") __freshAccountUids.add(cred.user.uid);
      return { id: cred.user.uid, username: uname };
    },
    async login(username, password) {
      const uname = (username || "").trim();
      const cred = await signInWithEmailAndPassword(fbAuth, usernameToEmail(uname), password);
      await migrateLocalAccountIfNeeded(cred.user.uid, uname);
      return normalizeFirebaseUser(cred.user);
    },
    async logout() {
      await firebaseSignOut(fbAuth);
    },
    async loginWithGoogle() {
      const provider = googleProvider();
      // Installed PWAs are the environment where popup auth is least reliable. Go straight to the
      // redirect flow there; normal browsers keep the faster popup path and fall back only when the
      // browser explicitly tells us popup auth is unavailable.
      if (shouldPreferGoogleRedirect()) {
        await signInWithRedirect(fbAuth, provider);
        return { redirecting: true };
      }
      try {
        const cred = await signInWithPopup(fbAuth, provider);
        return normalizeFirebaseUser(cred.user);
      } catch (e) {
        if (!isGooglePopupFallbackError(e)) throw e;
        await signInWithRedirect(fbAuth, provider);
        return { redirecting: true };
      }
    },
    async completeRedirectLogin() {
      const cred = await getRedirectResult(fbAuth);
      return cred?.user ? normalizeFirebaseUser(cred.user) : null;
    },
    subscribe(listener, onError) {
      return onAuthStateChanged(
        fbAuth,
        (u) => listener(normalizeFirebaseUser(u)),
        onError
      );
    },
    async getSession() {
      return new Promise((resolve, reject) => {
        let unsub = null;
        unsub = onAuthStateChanged(
          fbAuth,
          (u) => {
            if (unsub) unsub();
            resolve(normalizeFirebaseUser(u));
          },
          (e) => {
            if (unsub) unsub();
            reject(e);
          }
        );
      });
    }
  };
}
function authProviderLabel() {
  const pid = fbAuth.currentUser?.providerData?.[0]?.providerId;
  if (pid === "google.com") return "google";
  if (pid === "password") return "email";
  return "\u2014";
}
var authProvider = createFirebaseAuthProvider();
var authService = {
  register: (username, password) => {
    const friendly = (e) => {
      const code = e?.code || "";
      if (code === "auth/email-already-in-use") return new Error("\u0422\u0430\u043A\u043E\u0439 \u043B\u043E\u0433\u0438\u043D \u0443\u0436\u0435 \u0437\u0430\u043D\u044F\u0442");
      if (code === "auth/weak-password") return new Error("\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043F\u0440\u043E\u0441\u0442\u043E\u0439 \u043F\u0430\u0440\u043E\u043B\u044C");
      return e;
    };
    return authProvider.register(username, password).catch((e) => { throw friendly(e); });
  },
  login: (username, password) => {
    const friendly = (e) => {
      const code = e?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        return new Error("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043B\u043E\u0433\u0438\u043D \u0438\u043B\u0438 \u043F\u0430\u0440\u043E\u043B\u044C");
      }
      return e;
    };
    return authProvider.login(username, password).catch((e) => { throw friendly(e); });
  },
  logout: () => authProvider.logout(),
  loginWithGoogle: () => {
    const friendly = (e) => {
      const code = e?.code || "";
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        return new Error("\u0412\u0445\u043E\u0434 \u043E\u0442\u043C\u0435\u043D\u0451\u043D");
      }
      if (code === "auth/popup-blocked") {
        return new Error("\u0411\u0440\u0430\u0443\u0437\u0435\u0440 \u0437\u0430\u0431\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u0430\u043B \u0432\u0441\u043F\u043B\u044B\u0432\u0430\u044E\u0449\u0435\u0435 \u043E\u043A\u043D\u043E \u2014 \u0440\u0430\u0437\u0440\u0435\u0448\u0438 \u0432\u0441\u043F\u043B\u044B\u0432\u0430\u044E\u0449\u0438\u0435 \u043E\u043A\u043D\u0430 \u0438 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0451 \u0440\u0430\u0437");
      }
      return e;
    };
    return authProvider.loginWithGoogle().catch((e) => { throw friendly(e); });
  },
  completeRedirectLogin: () => authProvider.completeRedirectLogin(),
  subscribe: (listener, onError) => authProvider.subscribe(listener, onError),
  getCurrentUser: () => authProvider.getSession()
};
async function checkLegacyDataAvailable() {
  if (!window.storage) return false;
  try {
    const claimed = await legacyStorageGet(LEGACY_CLAIMED_KEY, false);
    if (claimed?.value) return false;
    const legacy = await legacyStorageGet(PROFILE_KEY, false);
    return !!legacy?.value;
  } catch (_) {
    return false;
  }
}
async function claimLegacyData(userId) {
  if (!window.storage) return;
  try {
    const [legacyProfile, legacyMedia] = await Promise.all([
      legacyStorageGet(PROFILE_KEY, false).catch(() => null),
      legacyStorageGet(MEDIA_KEY, false).catch(() => null)
    ]);
    await mergeLegacyIntoCloud(userId, legacyProfile?.value || null, legacyMedia?.value || null);
  } finally {
    try {
      await legacyStorageSet(LEGACY_CLAIMED_KEY, "1", false);
    } catch (_) {
    }
  }
}
async function skipLegacyData() {
  if (!window.storage) return;
  try {
    await legacyStorageSet(LEGACY_CLAIMED_KEY, "1", false);
  } catch (_) {
  }
}
function useAuth() {
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const applyUser = (u) => {
      if (cancelled) return;
      setUser(u);
      setStatus(u ? "authenticated" : "unauthenticated");
    };
    const unsubscribe = authService.subscribe(
      applyUser,
      () => {
        if (!cancelled) {
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    );
    // Firebase resolves redirect auth asynchronously after returning to the app. Keep the normal
    // observer as the source of truth, but explicitly consume the redirect result so iOS/PWA Google
    // login is finalized and any redirect-only SDK errors are not left unobserved.
    authService.completeRedirectLogin().then((u) => {
      if (u) applyUser(u);
    }).catch((e) => {
      console.warn("mind.exe: Google redirect completion failed", e);
    });
    return () => {
      cancelled = true;
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);
  const register = async (username, password) => {
    const u = await authService.register(username, password);
    setUser(u);
    setStatus("authenticated");
    return u;
  };
  const login = async (username, password) => {
    const u = await authService.login(username, password);
    setUser(u);
    setStatus("authenticated");
    return u;
  };
  const loginWithGoogle = async () => {
    const result = await authService.loginWithGoogle();
    if (result?.redirecting) return result;
    setUser(result);
    setStatus("authenticated");
    return result;
  };
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setStatus("unauthenticated");
  };
  return { status, user, register, login, loginWithGoogle, logout };
}
function MindExe() {
  const [entries, setEntries] = useState([]);
  const [tab, setTab] = useState("home");
  const [closingId, setClosingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  // Startup must be neutral. Saved accentIndex replaces this after Firebase profile load.
  // Using terminal green here caused a visible green flash in logo/text before the profile arrived.
  const [accentPreset, setAccentPreset] = useState(ACCENTS.find((a) => a.cosmic) || ACCENTS[0]);
  const [name, setName] = useState("");
  const [toast, setToast] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [weeklyGoal, setWeeklyGoal] = useState(7);
  const [lang, setLang] = useState("ru");
  const [measureMode, setMeasureMode] = useState("R");
  const [currency, setCurrency] = useState("USD");
  const [tradingAsset, setTradingAsset] = useState(null);
  // V0.4 — описание собственной стратегии. Хранится в settings профиля (Firestore) и
  // передаётся во все AI-контексты, чтобы модель не предлагала ломать стиль торговли.
  const [strategyNote, setStrategyNote] = useState("");
  const [strategies, setStrategies] = useState([]);
  const [strategyTrades, setStrategyTrades] = useState([]);
  const [strategyLoaded, setStrategyLoaded] = useState(false);
  const [startingCapital, setStartingCapital] = useState(1e3);
  const [customInstruments, setCustomInstruments] = useState([]);
  const [customTags, setCustomTags] = useState([]);
  const [lastCalibration, setLastCalibration] = useState(null);
  const [mindCoins, setMindCoins] = useState(0);
  const [coinLedger, setCoinLedger] = useState([]);
  const [lastDailyReward, setLastDailyReward] = useState(null);
  const analytics = useMemo(() => calculateTraderAnalytics(entries, lastCalibration, lang), [entries, lastCalibration, lang]);
  const t = STRINGS[lang] || STRINGS.ru;
  const [walletOpen, setWalletOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [profileDataError, setProfileDataError] = useState(null);
  const [profileLoadRetryNonce, setProfileLoadRetryNonce] = useState(0);
  const [showBootIntro, setShowBootIntro] = useState(false);
  const [introResolved, setIntroResolved] = useState(false);
  const [anonId] = useState(getOrCreateAnonId);
  const toastTimer = useRef(null);
  const firstLoadRef = useRef(true);
  const firstDailyRewardRef = useRef(true);
  const canPersistRef = useRef(false);
  const profilePersistChainRef = useRef(Promise.resolve(true));
  // If a Firestore write hits our timeout, the original network request may still be alive.
  // Never start a newer write in that same session: an old request finishing late could overwrite it.
  const profileWriteUncertainRef = useRef(false);
  const authLegacyGateRef = useRef(safeSessionGet(GOOGLE_REDIRECT_LEGACY_KEY) === "1");
  const strategyCanPersistRef = useRef(false);
  const strategyRawIndexRef = useRef(null);
  const strategyBackupPendingRef = useRef(false);
  // Holds the profile document exactly as it was loaded. buildPayload merges its output ON TOP of
  // this, so any field written by a NEWER build of the app (or one this build simply doesn't know
  // about) survives a save instead of being silently dropped \u2014 which is what would otherwise make
  // an app update, or a browser still running a cached older app.js, erase settings.
  const rawProfileRef = useRef(null);
  // One snapshot of the pre-existing document per session, written just before this session's first
  // overwrite. Cheap insurance: even a catastrophic future bug leaves a recoverable copy in
  // users/{uid}/data/mind-exe-journal-state:backup.
  const backupPendingRef = useRef(false);
  const { status: authStatus, user: authUser, register: authRegister, login: authLogin, loginWithGoogle: authLoginWithGoogle, logout: authLogout } = useAuth();
  const userId = authUser?.id || null;
  const [migrateFor, setMigrateFor] = useState(null);
  const accent = accentPreset.value;
  const resetInMemoryState = () => {
    setEntries([]);
    setName("");
    setAccentPreset(ACCENTS.find((a) => a.cosmic) || ACCENTS[0]);
    setSoundOn(true);
    setWeeklyGoal(7);
    setLang("ru");
    setMeasureMode("R");
    setCurrency("USD");
    setTradingAsset(null);
    setStrategyNote("");
    setStrategies([]);
    setStrategyTrades([]);
    setStrategyLoaded(false);
    strategyCanPersistRef.current = false;
    strategyRawIndexRef.current = null;
    strategyBackupPendingRef.current = false;
    strategyStore.reset();
    setStartingCapital(1e3);
    setCustomInstruments([]);
    setCustomTags([]);
    setLastCalibration(null);
    setMindCoins(0);
    setCoinLedger([]);
    setLastDailyReward(null);
  };
  const handleRegister = async (username, password) => {
    const hasLegacy = await checkLegacyDataAvailable();
    authLegacyGateRef.current = hasLegacy;
    try {
      const newUser = await authRegister(username, password);
      if (hasLegacy) setMigrateFor(newUser.id);
      return newUser;
    } catch (e) {
      authLegacyGateRef.current = false;
      throw e;
    }
  };
  const handleLogin = async (username, password) => {
    await authLogin(username, password);
  };
  const handleGoogleLogin = async () => {
    const hasLegacy = await checkLegacyDataAvailable();
    authLegacyGateRef.current = hasLegacy;
    if (hasLegacy) safeSessionSet(GOOGLE_REDIRECT_LEGACY_KEY, "1");
    else safeSessionRemove(GOOGLE_REDIRECT_LEGACY_KEY);
    try {
      const newUser = await authLoginWithGoogle();
      if (newUser?.redirecting) return newUser;
      safeSessionRemove(GOOGLE_REDIRECT_LEGACY_KEY);
      if (hasLegacy && newUser?.id) setMigrateFor(newUser.id);
      return newUser;
    } catch (e) {
      safeSessionRemove(GOOGLE_REDIRECT_LEGACY_KEY);
      authLegacyGateRef.current = false;
      throw e;
    }
  };
  const handleMigrate = async () => {
    if (!migrateFor) return;
    await claimLegacyData(migrateFor);
    safeSessionRemove(GOOGLE_REDIRECT_LEGACY_KEY);
    authLegacyGateRef.current = false;
    setMigrateFor(null);
  };
  const handleSkipMigrate = async () => {
    await skipLegacyData();
    safeSessionRemove(GOOGLE_REDIRECT_LEGACY_KEY);
    authLegacyGateRef.current = false;
    setMigrateFor(null);
  };
  const handleLogout = async () => {
    // Keep Firebase Auth active until the newest queued profile/media state is confirmed saved.
    if (loaded && canPersistRef.current && fbAuth.currentUser && userId) {
      try {
        const saved = await caWithTimeout(persistNow(), 22e3, "logout_sync_timeout");
        if (!saved) {
          showToast(lang === "en" ? "Sync failed. Logout cancelled to protect your data." : "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435. \u0412\u044B\u0445\u043E\u0434 \u043E\u0442\u043C\u0435\u043D\u0451\u043D.");
          return;
        }
      } catch (e) {
        profileWriteUncertainRef.current = true;
        canPersistRef.current = false;
        setProfileDataError({ kind: "save", reason: e?.message || "logout_sync_timeout" });
        return;
      }
    }
    canPersistRef.current = false;
    strategyCanPersistRef.current = false;
    await authLogout();
    rawProfileRef.current = null;
    strategyRawIndexRef.current = null;
    backupPendingRef.current = false;
    profileWriteUncertainRef.current = false;
    setProfileDataError(null);
    journalMediaStore.reset();
    profileStore.reset();
    setLoaded(false);
    setIntroResolved(false);
    setShowBootIntro(false);
    resetInMemoryState();
    setTab("home");
  };
  useEffect(() => {
    const pendingLegacyAfterRedirect = safeSessionGet(GOOGLE_REDIRECT_LEGACY_KEY) === "1";
    if (!pendingLegacyAfterRedirect || authStatus === "checking") return;
    if (authStatus === "unauthenticated") {
      safeSessionRemove(GOOGLE_REDIRECT_LEGACY_KEY);
      authLegacyGateRef.current = false;
      return;
    }
    if (!userId || migrateFor) return;
    let cancelled = false;
    checkLegacyDataAvailable().then((hasLegacy) => {
      if (cancelled) return;
      safeSessionRemove(GOOGLE_REDIRECT_LEGACY_KEY);
      if (hasLegacy) {
        authLegacyGateRef.current = true;
        setMigrateFor(userId);
      } else {
        authLegacyGateRef.current = false;
        // Profile load may already have skipped once while the redirect migration gate was active.
        // Bump its existing retry nonce so it starts immediately after the gate is released.
        setProfileLoadRetryNonce((n) => n + 1);
      }
    }).catch(() => {
      if (cancelled) return;
      safeSessionRemove(GOOGLE_REDIRECT_LEGACY_KEY);
      authLegacyGateRef.current = false;
      setProfileLoadRetryNonce((n) => n + 1);
    });
    return () => {
      cancelled = true;
    };
  }, [authStatus, userId, migrateFor]);
  useEffect(() => {
    if (authStatus !== "authenticated" || !loaded || migrateFor || !userId || introResolved) return;
    setShowBootIntro(true);
    setIntroResolved(true);
  }, [authStatus, loaded, migrateFor, userId, introResolved]);
  useEffect(() => {
    const t1 = setTimeout(() => setSplashFading(true), 5500);
    const t2 = setTimeout(() => setShowSplash(false), 6400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);
  useEffect(() => {
    if (authStatus !== "authenticated" || !userId || migrateFor || authLegacyGateRef.current) return;
    let cancelled = false;
    setLoaded(false);
    setProfileDataError(null);
    canPersistRef.current = false;
    profileWriteUncertainRef.current = false;
    rawProfileRef.current = null;
    backupPendingRef.current = false;
    journalMediaStore.reset();
    profileStore.reset();
    resetInMemoryState();
    const tryLoad = async (attempt = 0) => {
      if (cancelled) return;
      if (!fbAuth.currentUser) {
        if (attempt < 20) {
          setTimeout(() => tryLoad(attempt + 1), 100);
          return;
        }
        firstLoadRef.current = false;
        if (!cancelled) {
          setProfileDataError({ kind: "load", reason: "auth_session_not_ready" });
          setLoaded(false);
        }
        return;
      }
      try {
        // V0.9 — getDoc не имеет собственного таймаута. Если запрос повисает (типичный случай
        // для iOS PWA при плохой сети), промис не резолвится и не отклоняется, catch ниже не
        // срабатывает, setLoaded(true) не вызывается никогда — и после сплэша остаётся чёрный
        // экран. Таймаут переводит зависание в обычную ошибку: сработает retry, а затем
        // штатный путь "загрузить не удалось" с тостом и отключённым автосейвом.
        const profile = await caWithTimeout(loadProfile(userId), 15e3, "profile_load_timeout");
        if (cancelled) return;
        const mediaIds = Array.isArray(profile?.journal?.entries) ? profile.journal.entries.map((e) => e?.id).filter(Boolean) : [];
        // V1.0 — медиа больше НЕ ждём здесь (см. шапку файла): скриншоты догружаются фоном
        // после setLoaded(true), иначе стартовый экран висит на время скачивания всех base64.
        if (profile) {
          const { user = {}, journal = {}, settings = {}, progress = {}, wallet = {} } = profile;
          const rawEntries = Array.isArray(journal.entries) ? journal.entries : [];
          const restoredEntries = rawEntries.map((e) => migrateEntry({
            ...e,
            date: new Date(e.date),
            exitDate: e.exitDate ? new Date(e.exitDate) : null,
            screenshots: [],
            exitScreenshots: []
          }));
          setEntries(restoredEntries);
          if (user.name !== void 0) setName(user.name);
          if (typeof settings.accentIndex === "number") setAccentPreset(ACCENTS[settings.accentIndex] || ACCENTS.find((a) => a.cosmic) || ACCENTS[0]);
          if (typeof settings.soundOn === "boolean") setSoundOn(settings.soundOn);
          if (typeof settings.weeklyGoal === "number") setWeeklyGoal(settings.weeklyGoal);
          if (settings.lang === "en" || settings.lang === "ru") setLang(settings.lang);
          if (settings.measureMode) setMeasureMode(settings.measureMode);
          if (settings.currency) setCurrency(settings.currency);
          if (settings.tradingAsset) setTradingAsset(settings.tradingAsset);
          if (typeof settings.strategyNote === "string") setStrategyNote(settings.strategyNote);
          if (typeof settings.startingCapital === "number") setStartingCapital(settings.startingCapital);
          if (Array.isArray(settings.customInstruments)) setCustomInstruments(settings.customInstruments);
          if (Array.isArray(settings.customTags)) setCustomTags(settings.customTags);
          if (progress.lastCalibration) setLastCalibration(progress.lastCalibration);
          if (typeof wallet.mindCoins === "number") setMindCoins(wallet.mindCoins);
          if (Array.isArray(wallet.coinLedger)) setCoinLedger(wallet.coinLedger);
          if (wallet.lastDailyReward) setLastDailyReward(wallet.lastDailyReward);
          if (restoredEntries.length > 0) {
            setTimeout(() => showToast("\u0414\u0430\u043D\u043D\u044B\u0435 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u044B"), firstLoadRef.current ? 6900 : 300);
          }
        }
        // Firestore answered (with or without an existing profile) without throwing \u2014 that's the
        // only condition under which we trust the in-memory state enough to let it overwrite the
        // cloud copy. A thrown error below deliberately does NOT reach this line.
        if (__lastProfileRecoverySource && profileEntryCount(profile) > 0) {
          setTimeout(() => showToast(lang === "en" ? "Cloud data recovered from backup" : "\u0414\u0430\u043D\u043D\u044B\u0435 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u044B \u0438\u0437 \u0440\u0435\u0437\u0435\u0440\u0432\u043D\u043E\u0439 \u043A\u043E\u043F\u0438\u0438"), 350);
        }
        rawProfileRef.current = profile || null;
        backupPendingRef.current = !!profile;
        profileWriteUncertainRef.current = false;
        setProfileDataError(null);
        canPersistRef.current = true;
        firstLoadRef.current = false;
        if (!cancelled) setLoaded(true);
        // Progressive screenshot loading: newest trades first, at most 3 entry chains in flight.
        // Small batches reach React state while older journal media keeps loading in the background.
        if (mediaIds.length === 0) {
          journalMediaStore.markAllLoaded(true);
        } else {
          const prioritizedMediaIds = [...mediaIds].reverse().map((id) => String(id));
          journalMediaStore.load(userId, prioritizedMediaIds, {
            concurrency: 3,
            batchSize: 4,
            onBatch: async (rows) => {
              if (cancelled || !rows?.length) return;
              const batchMedia = journalMediaStore.acceptLoadBatch(rows);
              if (Object.keys(batchMedia).length) {
                setEntries((prev) => prev.map((e) => {
                  const m = batchMedia[String(e.id)];
                  if (!m) return e;
                  const entryShots = Array.isArray(m.entry) ? m.entry : [];
                  const exitShots = Array.isArray(m.exit) ? m.exit : [];
                  return { ...e, screenshots: entryShots, exitScreenshots: exitShots };
                }));
              }
            }
          }).then((res) => {
            if (cancelled || !res) return;
            const fullyLoaded = journalMediaStore.finishLoad(res);
            if (!fullyLoaded && res.failedIds?.length) {
              console.warn("mind.exe: some journal screenshots could not be loaded; destructive media cleanup stays disabled", res.failedIds);
            }
          }).catch((err2) => {
            journalMediaStore.markAllLoaded(false);
            console.warn("mind.exe: progressive media load failed", err2);
          });
        }
      } catch (err) {
        // A network/permission hiccup here must never be allowed to fall through to the auto-save
        // effect with whatever's currently in memory (freshly reset to empty by resetInMemoryState
        // above) \u2014 that previously overwrote real cloud data with zeros. Retry a couple of times
        // first; only after retries are exhausted do we mark the app "loaded" for the UI, and even
        // then canPersistRef stays false so nothing auto-persists until a load actually succeeds.
        if (attempt < 2 && !cancelled) {
          setTimeout(() => tryLoad(attempt + 1), 800 * (attempt + 1));
          return;
        }
        console.error("mind.exe: failed to load cloud profile after retries \u2014 auto-save disabled for this session until it succeeds", err);
        firstLoadRef.current = false;
        if (!cancelled) {
          setLoaded(false);
          setProfileDataError({ kind: "load", reason: err?.message || "profile_load_failed" });
        }
      }
    };
    tryLoad();
    return () => {
      cancelled = true;
    };
  }, [authStatus, userId, migrateFor, profileLoadRetryNonce]);
  // Strategy Lab loads independently from the journal profile. A failure here never blocks the
  // journal, and — just like canPersistRef for the profile — strategyCanPersistRef stays false so an
  // empty in-memory Strategy Lab can never overwrite an existing cloud index after a failed read.
  useEffect(() => {
    if (authStatus !== "authenticated" || !userId || migrateFor || authLegacyGateRef.current) return;
    let cancelled = false;
    setStrategyLoaded(false);
    strategyCanPersistRef.current = false;
    strategyRawIndexRef.current = null;
    strategyBackupPendingRef.current = false;
    setStrategies([]);
    setStrategyTrades([]);
    const load = async (attempt = 0) => {
      if (cancelled) return;
      if (!fbAuth.currentUser) {
        if (attempt < 20) {
          setTimeout(() => load(attempt + 1), 100);
          return;
        }
        if (!cancelled) setStrategyLoaded(true);
        return;
      }
      try {
        const state = await caWithTimeout(loadStrategyLabState(userId), 18e3, "strategy_load_timeout");
        if (cancelled) return;
        setStrategies(state.strategies || []);
        setStrategyTrades(state.trades || []);
        strategyRawIndexRef.current = state.rawIndex || null;
        strategyBackupPendingRef.current = false;
        strategyCanPersistRef.current = true;
        setStrategyLoaded(true);
      } catch (e) {
        if (attempt < 2 && !cancelled) {
          setTimeout(() => load(attempt + 1), 700 * (attempt + 1));
          return;
        }
        console.error("mind.exe: Strategy Lab load failed — Strategy Lab writes disabled for session", e);
        if (!cancelled) {
          setStrategyLoaded(true);
          showToast(lang === "en" ? "Could not load Strategy Lab. Journal data is safe; reload before editing strategies." : "Не удалось загрузить стратегии. Журнал в безопасности; перезайди перед изменением стратегий.");
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [authStatus, userId, migrateFor]);

  const buildPayload = (overrides = {}) => {
    const prev = rawProfileRef.current || {};
    const src = { entries, name, accentIndex: ACCENTS.findIndex((a) => a.value === accentPreset.value), soundOn, weeklyGoal, lang, measureMode, currency, tradingAsset, strategyNote, startingCapital, customInstruments, customTags, lastCalibration, mindCoins, coinLedger, lastDailyReward, ...overrides };
    const nextMeta = { ...(prev.meta || {}) };
    const resetNowIso = overrides.__resetAt || (/* @__PURE__ */ new Date()).toISOString();
    if (overrides.__intentionalJournalReset === true) {
      nextMeta.journalResetAt = resetNowIso;
      nextMeta.intentionalJournalReset = true;
    }
    if (overrides.__intentionalFullReset === true) {
      nextMeta.fullResetAt = resetNowIso;
      nextMeta.journalResetAt = resetNowIso;
      nextMeta.intentionalFullReset = true;
      nextMeta.intentionalJournalReset = true;
    }
    if (Array.isArray(src.entries) && src.entries.length > 0) {
      nextMeta.intentionalFullReset = false;
      nextMeta.intentionalJournalReset = false;
    }
    return {
      // spread the previously stored document first so unknown / future top-level fields are kept;
      // every section below then overwrites only the keys this build actually owns.
      ...prev,
      version: SCHEMA_VERSION,
      meta: nextMeta,
      user: { ...prev.user, name: src.name, anonId: prev?.user?.anonId || anonId },
      journal: {
        entries: src.entries.map(({ screenshots, exitScreenshots, ...rest }) => ({ ...rest, date: rest.date instanceof Date ? rest.date.toISOString() : rest.date, exitDate: rest.exitDate instanceof Date ? rest.exitDate.toISOString() : rest.exitDate }))
      },
      settings: {
        ...prev.settings,
        accentIndex: src.accentIndex,
        soundOn: src.soundOn,
        weeklyGoal: src.weeklyGoal,
        lang: src.lang,
        measureMode: src.measureMode,
        currency: src.currency,
        tradingAsset: src.tradingAsset,
        strategyNote: src.strategyNote,
        startingCapital: src.startingCapital,
        customInstruments: src.customInstruments,
        customTags: src.customTags
      },
      progress: { ...prev.progress, lastCalibration: src.lastCalibration },
      wallet: { ...prev.wallet, mindCoins: src.mindCoins, coinLedger: src.coinLedger, lastDailyReward: src.lastDailyReward }
    };
  };
  const persistNow = (overrides = {}) => {
    // Capture this render's state before it enters the async queue.
    const capturedPayload = buildPayload(overrides);
    const capturedEntries = overrides.entries ?? entries;
    if (canPersistRef.current && fbAuth.currentUser && userId) writeDirectProfileShadow(userId, capturedPayload);

    const run = async () => {
      if (profileWriteUncertainRef.current) return false;
      if (!canPersistRef.current || !fbAuth.currentUser || !userId) return false;
      try {
        const payload = capturedPayload;
        const existingCloudEntryIds = new Set(
          (rawProfileRef.current?.journal?.entries || []).map((e) => String(e.id))
        );
        const mediaMap = {};
        for (const e of capturedEntries) {
          if ((Array.isArray(e.screenshots) && e.screenshots.length > 0) || (Array.isArray(e.exitScreenshots) && e.exitScreenshots.length > 0)) {
            mediaMap[String(e.id)] = { entry: e.screenshots || [], exit: e.exitScreenshots || [] };
          }
        }
        // Fail BEFORE changing the profile if an existing trade is trying to write screenshots while
        // its previous cloud media is still unconfirmed.
        journalMediaStore.assertWriteSafe(mediaMap, existingCloudEntryIds);

        let profileUnchanged = false;
        let profileCommitted = false;
        try {
          profileUnchanged = !!rawProfileRef.current && JSON.stringify(payload) === JSON.stringify(rawProfileRef.current);
        } catch (_) {
          profileUnchanged = false;
        }

        if (!profileUnchanged) {
          if (backupPendingRef.current && rawProfileRef.current) {
            backupPendingRef.current = false;
            try {
              await saveProfileBackupIfSafer(userId, rawProfileRef.current);
            } catch (_) {
            }
          }
          const committedProfile = await saveProfile(userId, payload);
          rawProfileRef.current = committedProfile || payload;
          profileCommitted = true;
        }

        try {
          await journalMediaStore.save(userId, mediaMap, {
            activeEntryIds: capturedEntries.map((e) => String(e.id)),
            existingCloudEntryIds
          });
        } catch (mediaError) {
          // Profile is the source of truth for the journal. Once its immutable revision is committed,
          // never leave the UI on the old journal merely because auxiliary screenshot persistence
          // failed afterwards; that old UI state could otherwise be auto-saved back into the cloud.
          if (profileCommitted) {
            console.warn("mind.exe: profile committed but journal media persistence is incomplete", mediaError);
            showToast(lang === "en"
              ? "Journal saved. Some screenshot sync is still pending."
              : "\u0416\u0443\u0440\u043D\u0430\u043B \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D. \u0427\u0430\u0441\u0442\u044C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u043E\u0432 \u0435\u0449\u0451 \u043D\u0435 \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D\u0430.");
            return true;
          }
          throw mediaError;
        }
        return true;
      } catch (e) {
        console.error("mind.exe: persist failed", e);
        if (e?.message === "journal_media_pending_load") {
          showToast(lang === "en"
            ? "This trade's screenshots are still loading. Wait a moment and save again."
            : "\u0421\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B \u044D\u0442\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438 \u0435\u0449\u0451 \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u044E\u0442\u0441\u044F. \u041F\u043E\u0434\u043E\u0436\u0434\u0438 \u043D\u0435\u043C\u043D\u043E\u0433\u043E \u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0438 \u0435\u0449\u0451 \u0440\u0430\u0437.");
        } else if (e?.message === "journal_media_load_failed") {
          showToast(lang === "en"
            ? "This trade's old screenshots could not be verified. Reload the app before changing its screenshots."
            : "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0441\u0442\u0430\u0440\u044B\u0435 \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B \u044D\u0442\u043E\u0439 \u0441\u0434\u0435\u043B\u043A\u0438. \u041F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u0434 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435\u043C \u0444\u043E\u0442\u043E.");
        } else if (e?.message === "profile_revision_conflict") {
          canPersistRef.current = false;
          setProfileDataError({ kind: "conflict", reason: "profile_revision_conflict" });
        } else {
          showToast("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u2014 \u043F\u0440\u043E\u0432\u0435\u0440\u044C \u0441\u0432\u044F\u0437\u044C");
        }
        return false;
      }
    };

    const queued = profilePersistChainRef.current.then(run, run);
    profilePersistChainRef.current = queued.catch(() => false);
    return queued;
  };
  const commitJournalEntries = async (nextEntries, successText, extraOverrides = {}) => {
    if (!canPersistRef.current || !fbAuth.currentUser || !userId || profileWriteUncertainRef.current) {
      showToast(lang === "en" ? "Cloud data is not ready. Retry the data load first." : "Облачные данные не готовы. Сначала повтори загрузку.");
      return false;
    }
    try {
      const ok = await caWithTimeout(
        persistNow({ entries: nextEntries, ...extraOverrides }),
        22e3,
        "journal_commit_timeout"
      );
      if (!ok) return false;
      setEntries(nextEntries);
      if (successText) showToast(successText);
      return true;
    } catch (e) {
      if (e?.message === "journal_commit_timeout") {
        // The original Firestore request cannot be cancelled. Freeze this session because the
        // commit status is unknown. Profile Persistence v2 also compare-and-swaps the manifest, so a
        // late stale revision cannot overwrite a newer revision after reload.
        profileWriteUncertainRef.current = true;
        canPersistRef.current = false;
        setProfileDataError({ kind: "save", reason: "journal_commit_timeout" });
      } else {
        showToast(lang === "en" ? "Could not confirm cloud save" : "Не удалось подтвердить сохранение");
      }
      return false;
    }
  };
  // V5.6 \u2014 duplicate Firestore write on every journal action. Each onSave handler already calls
  // persistNow({ entries: next }) explicitly; setEntries then changed `entries`, this effect fired,
  // and persistNow() ran a SECOND time with identical data \u2014 two full profile writes plus two
  // media writes (base64 screenshots) per saved trade. The de-duplication now lives inside
  // persistNow (where it can skip the profile write without ever skipping media); this effect just
  // debounces so rapid changes coalesce into one pass. The explicit calls in the handlers are
  // untouched and still write instantly, and the visibilitychange/pagehide flush below still
  // covers the app being backgrounded inside the debounce window.
  useEffect(() => {
    if (!loaded || !canPersistRef.current || authStatus !== "authenticated" || !userId) return;
    const timer = setTimeout(() => persistNow(), 900);
    return () => clearTimeout(timer);
  }, [entries, name, accentPreset, soundOn, weeklyGoal, lang, measureMode, currency, tradingAsset, strategyNote, startingCapital, customInstruments, customTags, lastCalibration, mindCoins, coinLedger, lastDailyReward, loaded, authStatus, userId]);
  useEffect(() => {
    if (!loaded || !canPersistRef.current || authStatus !== "authenticated" || !userId) return;
    const flush = () => {
      if (document.visibilityState === "hidden") persistNow();
    };
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("pagehide", flush);
    };
  }, [entries, name, accentPreset, soundOn, weeklyGoal, lang, measureMode, currency, tradingAsset, strategyNote, startingCapital, customInstruments, customTags, lastCalibration, mindCoins, coinLedger, lastDailyReward, loaded, authStatus, userId]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  const showToast = (text) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };
  const freezeStrategyWritesForConflict = (reason = "strategy_revision_conflict") => {
    strategyCanPersistRef.current = false;
    console.warn("mind.exe: Strategy Lab writes frozen until reload", reason);
    showToast(lang === "en"
      ? "Strategy Lab changed in another session. Reload before editing it again."
      : "Strategy Lab изменился в другой сессии. Перезагрузи приложение перед дальнейшим редактированием.");
  };
  const persistStrategyIndexNow = async (nextStrategies) => {
    if (!strategyCanPersistRef.current || !fbAuth.currentUser || !userId) {
      showToast(lang === "en" ? "Strategy Lab is not ready to save yet" : "Strategy Lab ещё не готов к сохранению");
      return false;
    }
    try {
      const payload = await caWithTimeout(
        saveStrategyIndex(userId, nextStrategies),
        18e3,
        "strategy_index_save_timeout"
      );
      strategyRawIndexRef.current = payload || { version: STRATEGY_SCHEMA_VERSION, strategies: nextStrategies };
      strategyBackupPendingRef.current = false;
      return true;
    } catch (e) {
      console.error("mind.exe: strategy index save failed", e);
      if (e?.message === "strategy_revision_conflict" || e?.message === "strategy_index_save_timeout") {
        freezeStrategyWritesForConflict(e.message);
      } else {
        showToast(lang === "en" ? "Could not save Strategy Lab — check connection" : "Не удалось сохранить стратегии — проверь связь");
      }
      return false;
    }
  };
  const handleCreateStrategy = async ({ name: strategyName, description }) => {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const strategy = normalizeStrategy({
      id: `st_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: strategyName,
      description,
      version: 1,
      status: "active",
      tradeIds: [],
      createdAt: now,
      updatedAt: now,
      aiReview: "",
      aiReviewedAt: null
    });
    const next = [...strategies, strategy];
    const ok = await persistStrategyIndexNow(next);
    if (!ok) return null;
    setStrategies(next);
    showToast(lang === "en" ? "Strategy created" : "Стратегия создана");
    return strategy;
  };
  const handleUpdateStrategy = async (strategyId, patch) => {
    const next = strategies.map((s) => s.id === strategyId ? normalizeStrategy({ ...s, ...patch, updatedAt: (/* @__PURE__ */ new Date()).toISOString() }) : s);
    const ok = await persistStrategyIndexNow(next);
    if (!ok) return false;
    setStrategies(next);
    return true;
  };
  const handleCreateStrategyTrade = async (draft) => {
    if (!strategyCanPersistRef.current || !userId) return false;
    const strategy = strategies.find((s) => s.id === draft.strategyId);
    if (!strategy) {
      showToast(lang === "en" ? "Strategy not found" : "Стратегия не найдена");
      return false;
    }
    const trade = migrateStrategyTrade({
      ...draft,
      id: `strade_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      source: "strategy"
    });
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const nextStrategies = strategies.map((s) => s.id === strategy.id ? {
      ...s,
      tradeIds: [...new Set([...(s.tradeIds || []), trade.id])],
      updatedAt: now
    } : s);
    try {
      // Write the trade first. If the index write then fails, remove the orphan so the cloud
      // cannot contain an invisible trade that the user has no way to reach.
      const saveResult = await caWithTimeout(
        saveStrategyTradeRecord(userId, trade, {
          cleanupStale: false,
          mediaPhases: ["entry"],
          createOnly: true
        }),
        15e3,
        "strategy_trade_save_timeout"
      );
      const committedTrade = saveResult?.committedTrade || trade;
      const indexOk = await persistStrategyIndexNow(nextStrategies);
      if (!indexOk) {
        await deleteStrategyTradeRecord(userId, trade.id);
        return false;
      }
      setStrategyTrades((prev) => [...prev, committedTrade]);
      setStrategies(nextStrategies);
      if (saveResult?.mediaErrors?.length) {
        showToast(lang === "en" ? "Trade saved, but one or more screenshots did not upload" : "Сделка сохранена, но часть скриншотов не загрузилась");
      } else {
        showToast(lang === "en" ? "Strategy trade added" : "Тестовая сделка добавлена");
      }
      return true;
    } catch (e) {
      console.error("mind.exe: strategy trade save failed", e);
      if (e?.message === "strategy_trade_save_timeout" || e?.message === "strategy_trade_revision_conflict") {
        freezeStrategyWritesForConflict(e.message);
      } else {
        showToast(lang === "en" ? "Could not save strategy trade" : "Не удалось сохранить тестовую сделку");
      }
      return false;
    }
  };
  const handleUpdateStrategyTrade = async (tradeId, patch) => {
    const current = strategyTrades.find((t) => t.id === tradeId);
    if (!current || !strategyCanPersistRef.current || !userId) return false;
    const nextTrade = migrateStrategyTrade({ ...current, ...patch, id: current.id, strategyId: current.strategyId, source: current.source || "strategy" });
    if (!nextTrade) return false;
    const phases = nextTrade.status === "closed" ? ["entry", "exit"] : ["entry"];
    try {
      const saveResult = await caWithTimeout(
        saveStrategyTradeRecord(userId, nextTrade, {
          mediaPhases: phases,
          expectedRevision: Number.isFinite(Number(current.persistenceRevision)) ? Number(current.persistenceRevision) : 0
        }),
        15e3,
        "strategy_trade_update_timeout"
      );
      const committedTrade = saveResult?.committedTrade || nextTrade;
      setStrategyTrades((prev) => prev.map((t) => t.id === tradeId ? committedTrade : t));
      if (saveResult?.mediaErrors?.length) {
        showToast(lang === "en" ? "Trade updated, but one or more screenshots did not upload" : "Сделка обновлена, но часть скриншотов не загрузилась");
      } else {
        showToast(lang === "en" ? "Strategy trade updated" : "Тестовая сделка обновлена");
      }
      return true;
    } catch (e) {
      console.error("mind.exe: strategy trade update failed", e);
      if (e?.message === "strategy_trade_revision_conflict" || e?.message === "strategy_trade_update_timeout") {
        freezeStrategyWritesForConflict(e.message);
      } else {
        showToast(lang === "en" ? "Could not update strategy trade" : "Не удалось обновить тестовую сделку");
      }
      return false;
    }
  };
  const handleCloseStrategyTrade = async (tradeId, patch) => {
    const current = strategyTrades.find((t) => t.id === tradeId);
    if (!current || !strategyCanPersistRef.current || !userId) return false;
    const nextTrade = migrateStrategyTrade({ ...current, ...patch });
    try {
      const saveResult = await caWithTimeout(
        saveStrategyTradeRecord(userId, nextTrade, {
          mediaPhases: ["exit"],
          expectedRevision: Number.isFinite(Number(current.persistenceRevision)) ? Number(current.persistenceRevision) : 0
        }),
        15e3,
        "strategy_close_save_timeout"
      );
      const committedTrade = saveResult?.committedTrade || nextTrade;
      setStrategyTrades((prev) => prev.map((t) => t.id === tradeId ? committedTrade : t));
      if (saveResult?.mediaErrors?.length) {
        showToast(lang === "en" ? "Trade closed, but one or more screenshots did not upload" : "Сделка закрыта, но часть скриншотов не загрузилась");
      } else {
        showToast(lang === "en" ? "Strategy trade closed" : "Тестовая сделка закрыта");
      }
      return true;
    } catch (e) {
      console.error("mind.exe: strategy trade close failed", e);
      if (e?.message === "strategy_trade_revision_conflict" || e?.message === "strategy_close_save_timeout") {
        freezeStrategyWritesForConflict(e.message);
      } else {
        showToast(lang === "en" ? "Could not save closing trade" : "Не удалось сохранить закрытие сделки");
      }
      return false;
    }
  };
  const handleDeleteStrategy = async (strategyId) => {
    if (!strategyCanPersistRef.current || !userId || !strategyId) return false;
    const strategy = strategies.find((s) => s.id === strategyId);
    if (!strategy) return false;
    // Only Strategy Lab's own trades are physically deleted. Journal trades may still contain
    // the old optional strategyId reference, but their journal record and media are deliberately
    // left untouched so deleting a strategy can never delete historical journal data.
    const directTradeIds = [...new Set([
      ...(Array.isArray(strategy.tradeIds) ? strategy.tradeIds : []),
      ...strategyTrades.filter((t) => t.strategyId === strategyId).map((t) => t.id)
    ].filter(Boolean))];
    const nextStrategies = strategies.filter((s) => s.id !== strategyId);
    try {
      // Persist the new index FIRST. If this fails, no trade/media document is deleted.
      const indexOk = await persistStrategyIndexNow(nextStrategies);
      if (!indexOk) return false;
      setStrategies(nextStrategies);
      setStrategyTrades((prev) => prev.filter((t) => t.strategyId !== strategyId));
      // Cleanup happens only after the strategy is safely removed from the index.
      // Failure here can leave an unreachable orphan document, but can never erase journal data.
      const cleanupRows = await Promise.all(directTradeIds.map((tradeId) => deleteStrategyTradeRecord(userId, tradeId)));
      const cleanupFailed = cleanupRows.reduce((sum, row) => sum + (row?.failed || 0), 0);
      if (cleanupFailed > 0) {
        showToast(lang === "en"
          ? "Strategy removed. Some orphan files could not be cleaned yet."
          : "Стратегия удалена. Часть недоступных файлов пока не удалось очистить.");
      } else {
        showToast(lang === "en" ? "Strategy deleted" : "Стратегия удалена");
      }
      return true;
    } catch (e) {
      console.error("mind.exe: strategy delete failed", e);
      showToast(lang === "en" ? "Could not delete strategy" : "Не удалось удалить стратегию");
      return false;
    }
  };
  const awardCoins = (amount, reason) => {
    const tx = { id: `mc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, amount, reason, date: (/* @__PURE__ */ new Date()).toISOString() };
    const nextCoins = mindCoins + amount;
    const nextLedger = [...coinLedger, tx];
    setMindCoins(nextCoins);
    setCoinLedger(nextLedger);
    if (canPersistRef.current) persistNow({ mindCoins: nextCoins, coinLedger: nextLedger });
    return tx;
  };
  useEffect(() => {
    if (!loaded || !canPersistRef.current || authStatus !== "authenticated" || !userId) return;
    if (isToday(lastDailyReward)) return;
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const tx = { id: `mc_daily_${Date.now()}`, amount: 10, reason: "\u0415\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u044B\u0439 \u0432\u0445\u043E\u0434", date: nowIso };
    const nextCoins = mindCoins + 10;
    const nextLedger = [...coinLedger, tx];
    setMindCoins(nextCoins);
    setCoinLedger(nextLedger);
    setLastDailyReward(nowIso);
    persistNow({ mindCoins: nextCoins, coinLedger: nextLedger, lastDailyReward: nowIso });
    // V5.6: this timer had no cleanup. On the intro path it waits 8.6s, so logging out (or any
    // unmount) inside that window still fired a toast for an account that is no longer open.
    const dailyToastTimer = setTimeout(() => showToast("+10 MindCoin \u2014 \u0432\u0445\u043E\u0434 \u0437\u0430 \u0434\u0435\u043D\u044C"), firstDailyRewardRef.current ? 8600 : 400);
    firstDailyRewardRef.current = false;
    return () => clearTimeout(dailyToastTimer);
  }, [loaded, authStatus, userId]);
  const playPing = () => {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.setValueAtTime(1e-4, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + 0.35);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.35);
    } catch (_) {
    }
  };
  const deleteEntry = async (id) => {
    const next = entries.filter((e) => e.id !== id);
    return commitJournalEntries(next, "\u0417\u0430\u043F\u0438\u0441\u044C \u0443\u0434\u0430\u043B\u0435\u043D\u0430");
  };
  const exportJournal = () => {
    try {
      const data = entries.map((e) => ({ ...e, date: e.date.toISOString(), exitDate: e.exitDate instanceof Date ? e.exitDate.toISOString() : e.exitDate }));
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mind-exe-journal.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("\u0416\u0443\u0440\u043D\u0430\u043B \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D");
    } catch (_) {
      showToast("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C");
    }
  };
  const importJournal = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const raw = JSON.parse(reader.result);
        if (!Array.isArray(raw)) throw new Error("not an array");
        const restored = raw.map(sanitizeImportedEntry).filter(Boolean);
        if (restored.length === 0 && raw.length > 0) throw new Error("nothing salvageable");
        const message = restored.length < raw.length
          ? `Импортировано ${restored.length} из ${raw.length} — часть записей повреждена`
          : `Импортировано записей: ${restored.length}`;
        const ok = await commitJournalEntries(restored, message);
        if (!ok) throw new Error("journal_import_save_failed");
      } catch (e) {
        if (e?.message !== "journal_import_save_failed") {
          showToast("Файл повреждён или неверный формат");
        }
      }
    };
    reader.readAsText(file);
  };
  const exportFullBackup = () => {
    try {
      const payload = buildPayload();
      payload.journal.entries = entries.map((e) => ({ ...e, date: e.date instanceof Date ? e.date.toISOString() : e.date, exitDate: e.exitDate instanceof Date ? e.exitDate.toISOString() : e.exitDate }));
      payload.strategyLab = {
        version: STRATEGY_SCHEMA_VERSION,
        strategies,
        trades: strategyTrades.map((trade) => ({
          ...trade,
          date: trade.date instanceof Date ? trade.date.toISOString() : trade.date,
          exitDate: trade.exitDate instanceof Date ? trade.exitDate.toISOString() : trade.exitDate
        }))
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mind-exe-backup.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("\u041F\u043E\u043B\u043D\u044B\u0439 \u0431\u044D\u043A\u0430\u043F \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D");
    } catch (_) {
      showToast("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0431\u044D\u043A\u0430\u043F");
    }
  };
  const importFullBackup = (file) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const raw = JSON.parse(reader.result);
        const profile = migrateProfile(raw);
        if (!profile) throw new Error("unrecognized backup format");
        const { user = {}, journal = {}, settings = {}, progress = {}, wallet = {} } = profile;
        const restoredEntries = (Array.isArray(journal.entries) ? journal.entries : []).map(sanitizeImportedEntry).filter(Boolean);
        const profileRestoreOk = await persistNow({
          entries: restoredEntries,
          name: user.name ?? name,
          accentIndex: typeof settings.accentIndex === "number" ? settings.accentIndex : ACCENTS.findIndex((a) => a.value === accentPreset.value),
          soundOn: settings.soundOn ?? soundOn,
          weeklyGoal: settings.weeklyGoal ?? weeklyGoal,
          lang: settings.lang ?? lang,
          measureMode: settings.measureMode ?? measureMode,
          currency: settings.currency ?? currency,
          tradingAsset: Object.prototype.hasOwnProperty.call(settings, "tradingAsset") ? settings.tradingAsset : tradingAsset,
          strategyNote: settings.strategyNote ?? strategyNote,
          startingCapital: settings.startingCapital ?? startingCapital,
          customInstruments: settings.customInstruments ?? customInstruments,
          customTags: settings.customTags ?? customTags,
          lastCalibration: progress.lastCalibration ?? lastCalibration,
          mindCoins: wallet.mindCoins ?? mindCoins,
          coinLedger: wallet.coinLedger ?? coinLedger,
          lastDailyReward: wallet.lastDailyReward ?? lastDailyReward
        });
        if (!profileRestoreOk) throw new Error("full_backup_profile_save_failed");

        // Cloud profile is confirmed; only now mirror it into React state.
        setEntries(restoredEntries);
        if (user.name !== void 0) setName(user.name);
        if (typeof settings.accentIndex === "number") setAccentPreset(ACCENTS[settings.accentIndex] || ACCENTS.find((a) => a.cosmic) || ACCENTS[0]);
        if (typeof settings.soundOn === "boolean") setSoundOn(settings.soundOn);
        if (typeof settings.weeklyGoal === "number") setWeeklyGoal(settings.weeklyGoal);
        if (settings.lang === "en" || settings.lang === "ru") setLang(settings.lang);
        if (settings.measureMode) setMeasureMode(settings.measureMode);
        if (settings.currency) setCurrency(settings.currency);
        if (settings.tradingAsset) setTradingAsset(settings.tradingAsset);
        if (typeof settings.strategyNote === "string") setStrategyNote(settings.strategyNote);
        if (typeof settings.startingCapital === "number") setStartingCapital(settings.startingCapital);
        if (Array.isArray(settings.customInstruments)) setCustomInstruments(settings.customInstruments);
        if (Array.isArray(settings.customTags)) setCustomTags(settings.customTags);
        if (progress.lastCalibration) setLastCalibration(progress.lastCalibration);
        if (typeof wallet.mindCoins === "number") setMindCoins(wallet.mindCoins);
        if (Array.isArray(wallet.coinLedger)) setCoinLedger(wallet.coinLedger);
        if (wallet.lastDailyReward) setLastDailyReward(wallet.lastDailyReward);
        let strategyRestoreFailed = false;
        if (raw.strategyLab && (!strategyCanPersistRef.current || !userId)) {
          strategyRestoreFailed = true;
        } else if (raw.strategyLab && strategyCanPersistRef.current && userId) {
          try {
            const importedStrategies = (Array.isArray(raw.strategyLab.strategies) ? raw.strategyLab.strategies : []).map(normalizeStrategy).filter(Boolean);
            const importedTrades = (Array.isArray(raw.strategyLab.trades) ? raw.strategyLab.trades : []).map(migrateStrategyTrade).filter(Boolean);
            const tradeIdsByStrategy = {};
            importedTrades.forEach((trade) => {
              (tradeIdsByStrategy[trade.strategyId] = tradeIdsByStrategy[trade.strategyId] || []).push(trade.id);
            });
            const fixedStrategies = importedStrategies.map((s) => ({
              ...s,
              tradeIds: [...new Set([...(s.tradeIds || []), ...(tradeIdsByStrategy[s.id] || [])])]
            }));

            const previousById = new Map(strategyTrades.map((trade) => [trade.id, trade]));
            const touched = [];
            const restoredTrades = [];
            try {
              for (const trade of importedTrades) {
                const previous = previousById.get(trade.id) || null;
                const expectedRevision = previous
                  ? (Number.isFinite(Number(previous.persistenceRevision)) ? Number(previous.persistenceRevision) : 0)
                  : (Number.isFinite(Number(trade.persistenceRevision)) ? Number(trade.persistenceRevision) : 0);

                const savedTrade = await saveStrategyTradeRecord(userId, trade, {
                  upsert: true,
                  expectedRevision
                });
                const committedTrade = savedTrade?.committedTrade || trade;
                touched.push({
                  id: trade.id,
                  previous,
                  committedRevision: Number.isFinite(Number(committedTrade.persistenceRevision))
                    ? Number(committedTrade.persistenceRevision)
                    : expectedRevision + 1
                });
                restoredTrades.push(committedTrade);
              }

              const indexOk = await persistStrategyIndexNow(fixedStrategies);
              if (!indexOk) throw new Error("strategy_restore_index_failed");
            } catch (restoreError) {
              // Existing trade records are rolled back with CAS. Newly-created failed-restore records
              // are deliberately left as unreachable orphans instead of risking deletion of a record
              // that another device may have modified after our write.
              for (const row of [...touched].reverse()) {
                if (!row.previous) continue;
                try {
                  await saveStrategyTradeRecord(userId, row.previous, {
                    expectedRevision: row.committedRevision,
                    mediaPhases: ["entry", "exit"]
                  });
                } catch (_) {
                }
              }
              throw restoreError;
            }

            strategyRawIndexRef.current = {
              version: STRATEGY_SCHEMA_VERSION,
              strategies: fixedStrategies
            };
            strategyBackupPendingRef.current = false;
            setStrategies(fixedStrategies);
            setStrategyTrades(restoredTrades);
          } catch (e) {
            console.error("mind.exe: Strategy Lab backup restore failed", e);
            strategyRestoreFailed = true;
          }
        }
        showToast(strategyRestoreFailed ? "\u0411\u044D\u043A\u0430\u043F \u0436\u0443\u0440\u043D\u0430\u043B\u0430 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D, \u043D\u043E Strategy Lab \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043B\u0441\u044F" : "\u0411\u044D\u043A\u0430\u043F \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D");
      } catch (e) {
        if (e?.message === "full_backup_profile_save_failed") {
          showToast(lang === "en"
            ? "Backup was read, but cloud restore could not be confirmed."
            : "\u0411\u044D\u043A\u0430\u043F \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D, \u043D\u043E \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0432 \u043E\u0431\u043B\u0430\u043A\u0435.");
        } else {
          showToast("\u0424\u0430\u0439\u043B \u043F\u043E\u0432\u0440\u0435\u0436\u0434\u0451\u043D \u0438\u043B\u0438 \u044D\u0442\u043E \u043D\u0435 \u0431\u044D\u043A\u0430\u043F mind.exe");
        }
      }
    };
    reader.readAsText(file);
  };
  const resetJournal = async () => {
    const resetAt = (/* @__PURE__ */ new Date()).toISOString();
    return commitJournalEntries(
      [],
      lang === "en" ? "Journal cleared" : "\u0416\u0443\u0440\u043D\u0430\u043B \u043E\u0447\u0438\u0449\u0435\u043D",
      { __intentionalJournalReset: true, __resetAt: resetAt }
    );
  };
  const resetEverything = async () => {
    if (!canPersistRef.current || !fbAuth.currentUser || !userId || profileWriteUncertainRef.current) {
      showToast(lang === "en" ? "Cloud data is not ready. Retry the data load first." : "\u041E\u0431\u043B\u0430\u0447\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u043D\u0435 \u0433\u043E\u0442\u043E\u0432\u044B. \u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u043E\u0432\u0442\u043E\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0443.");
      return false;
    }

    const cosmicIndex = ACCENTS.findIndex((a) => a.cosmic);
    const defaults = {
      entries: [],
      name: "",
      accentIndex: cosmicIndex >= 0 ? cosmicIndex : 0,
      soundOn: true,
      weeklyGoal: 7,
      lang: "ru",
      measureMode: "R",
      currency: "USD",
      tradingAsset: null,
      strategyNote: "",
      startingCapital: 1e3,
      customInstruments: [],
      customTags: [],
      lastCalibration: null,
      mindCoins: 0,
      coinLedger: [],
      lastDailyReward: null
    };
    const resetAt = (/* @__PURE__ */ new Date()).toISOString();

    try {
      const ok = await caWithTimeout(
        persistNow({ ...defaults, __intentionalFullReset: true, __resetAt: resetAt }),
        25e3,
        "full_reset_timeout"
      );
      if (!ok) return false;

      // Profile reset is now durably committed together with the full-reset tombstone.
      // Only after that do we update local UI state and remove auxiliary cloud stores.
      setEntries([]);
      setName("");
      setAccentPreset(ACCENTS.find((a) => a.cosmic) || ACCENTS[0]);
      setSoundOn(true);
      setWeeklyGoal(7);
      setLang("ru");
      setMeasureMode("R");
      setCurrency("USD");
      setTradingAsset(null);
      setStrategyNote("");
      setStartingCapital(1e3);
      setCustomInstruments([]);
      setCustomTags([]);
      setLastCalibration(null);
      setMindCoins(0);
      setCoinLedger([]);
      setLastDailyReward(null);
      setTab("home");

      let aux = null;
      try {
        aux = await caWithTimeout(
          clearAuxiliaryUserDataForFullReset(
            userId,
            [
              ...strategyTrades.map((t) => t.id),
              ...strategies.flatMap((s) => Array.isArray(s.tradeIds) ? s.tradeIds : [])
            ]
          ),
          22e3,
          "full_reset_aux_timeout"
        );
        setStrategies([]);
        setStrategyTrades([]);
        strategyRawIndexRef.current = aux.strategyIndex;
        strategyBackupPendingRef.current = false;
        strategyCanPersistRef.current = true;
      } catch (e) {
        console.error("mind.exe: full reset auxiliary cleanup incomplete", e);
      }

      if (aux && aux.cleanupFailed === 0) {
        showToast(lang === "en" ? "Application reset" : "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0441\u0431\u0440\u043E\u0448\u0435\u043D\u043E");
      } else {
        showToast(lang === "en"
          ? "Profile reset. Some auxiliary cloud data may need another cleanup attempt."
          : "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u0441\u0431\u0440\u043E\u0448\u0435\u043D. \u0427\u0430\u0441\u0442\u044C \u0434\u043E\u043F. \u0434\u0430\u043D\u043D\u044B\u0445 \u043C\u043E\u0436\u0435\u0442 \u043F\u043E\u0442\u0440\u0435\u0431\u043E\u0432\u0430\u0442\u044C \u043F\u043E\u0432\u0442\u043E\u0440\u043D\u043E\u0439 \u043E\u0447\u0438\u0441\u0442\u043A\u0438.");
      }
      return true;
    } catch (e) {
      if (e?.message === "full_reset_timeout") {
        profileWriteUncertainRef.current = true;
        canPersistRef.current = false;
        setProfileDataError({ kind: "save", reason: "full_reset_timeout" });
      } else {
        console.error("mind.exe: full reset failed", e);
        showToast(lang === "en" ? "Could not confirm full reset" : "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u043F\u043E\u043B\u043D\u044B\u0439 \u0441\u0431\u0440\u043E\u0441");
      }
      return false;
    }
  };
  const addCustomInstrument = (v) => setCustomInstruments((prev) => prev.some((x) => x.toLowerCase() === v.toLowerCase()) ? prev : [v, ...prev]);
  const addCustomTag = (v) => setCustomTags((prev) => prev.some((x) => x.toLowerCase() === v.toLowerCase()) ? prev : [v, ...prev]);
  const nav = [
    { id: "home", label: t.nav.home, icon: Sparkles },
    { id: "log", label: t.nav.log, icon: NotebookText },
    { id: "patterns", label: t.nav.patterns, icon: LineChartIcon },
    { id: "strategies", label: t.nav.strategies, icon: Target },
    { id: "new", label: t.nav.new, icon: BookOpen, primary: true },
    { id: "challenge", label: t.nav.challenge, icon: Flame },
    { id: "coach", label: t.nav.coach, icon: Bot },
    { id: "settings", label: t.nav.settings, icon: User }
  ];
  const mobileNav = nav.filter((n) => n.id !== "settings");
  const mobilePrimaryNav = mobileNav.find((n) => n.primary) || null;
  const mobileSideNav = mobileNav.filter((n) => !n.primary);
  const mobileLeftNav = mobileSideNav.slice(0, Math.ceil(mobileSideNav.length / 2));
  const mobileRightNav = mobileSideNav.slice(Math.ceil(mobileSideNav.length / 2));
  const wideTab = ["home", "log", "patterns", "strategies"].includes(tab);
  const formTab = ["new", "edit", "close"].includes(tab);
  const contentMaxWidth = wideTab ? "md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl" : formTab ? "md:max-w-3xl lg:max-w-4xl xl:max-w-5xl" : "md:max-w-2xl lg:max-w-4xl xl:max-w-5xl";
  return /* @__PURE__ */ jsxs("div", { className: `min-h-screen w-full relative theme-fade${accentPreset.cosmic ? " cosmic-theme" : ""}`, style: { background: accentPreset.cosmic ? "#040405" : BASE.bg, fontFamily: "var(--font-display)" }, children: [
    /* @__PURE__ */ jsx("style", { children: `
        /* V5.1 typography. Everything in the app now points at two CSS variables instead of naming
           families inline in 78 + 77 places, so a future type change is a one-line edit here.
           Display: Sora \u2014 geometric grotesk with a slightly astronomical, engineered feel; tighter
           apertures and a more distinctive lowercase g/a than Space Grotesk, which read generic at
           small sizes. Mono: IBM Plex Mono for figures \u2014 the digits have real character (open 4,
           flat-top 3, slashed 0 off by default) and it sits warmer against the dark UI than
           JetBrains Mono without losing tabular alignment. Both are variable-weight on Google Fonts.
           The <link> tags in index.html load these; this @import is the belt-and-braces fallback so
           the bundle is self-sufficient if index.html is ever served stale. */
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');
        /* V3.0 \u2014 моноширинный шрифт стал основным, а не только шрифтом цифр.
           Смешение гротеска для текста и моноширинного для чисел \u2014 самый заметный
           признак \"собрано из шаблонов\": два разных ритма букв на одном экране.
           Один моноширинный шрифт на всё даёт терминальный вид референса и убирает
           необходимость решать, что именно \"цифра\", а что \"текст\". IBM Plex Mono
           покрывает кириллицу, поэтому русские экраны не деградируют в подстановочный
           шрифт. --font-display и --font-mono теперь указывают на одно семейство:
           так все 155 мест, где они названы инлайн, меняются одной правкой, а
           различие display/mono остаётся доступным, если оно понадобится обратно. */
        :root {
          --font-display: 'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace;
          --font-mono: 'IBM Plex Mono', 'JetBrains Mono', ui-monospace, monospace;
        }
        body, #root {
          font-family: var(--font-display);
          letter-spacing: -0.012em;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        input, textarea, select, button { font: inherit; }
        * { -webkit-tap-highlight-color: transparent; }
        button { touch-action: manipulation; }
        input, textarea { caret-color: ${BASE.ink}; }
        ::selection { background: rgba(255,255,255,0.14); color: #fff; }
        /* Compact labels: technical, but without excessive dashboard-like spacing. */
        .sec-cap { text-transform: uppercase; letter-spacing: 0.15em; }
        .btn-cap { text-transform: uppercase; letter-spacing: 0.12em; }
        @media (max-width: 767px) {
          input, textarea, select { font-size: 16px !important; }
        }
        /* Sora runs a touch wider than Space Grotesk at the same size; a small negative tracking on
           headings and figures keeps existing layouts from re-wrapping. */
        h1, h2, h3 { letter-spacing: -0.02em; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        /* V2.1 — скелетоны. Блик идёт по градиенту фона, а не отдельным слоем: так он не
           создаёт нового элемента в разметке и не перехватывает нажатия. Пульсация
           намеренно медленная (1.6s) — быстрый мигающий скелетон читается как ошибка. */
        @keyframes skelShimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        .skel {
          background: linear-gradient(90deg, ${BASE.surface2} 25%, ${BASE.line} 50%, ${BASE.surface2} 75%);
          background-size: 200% 100%;
          animation: skelShimmer 1.6s ease-in-out infinite;
          border-radius: 6px;
        }
        /* Появление уже загруженного контента. 0.32s достаточно, чтобы переход читался как
           плавный, и мало, чтобы не воспринимался как дополнительная задержка. */
        .content-in { animation: fadeIn 0.32s ease-out both; }
        @media (prefers-reduced-motion: reduce) {
          .skel { animation: none; }
          .content-in { animation: none; }
        }
        /* V0.9 — для BootLoading: Tailwind-класс animate-spin здесь не используется, вращение задаётся инлайн. */
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes logoPulseFade { 0%, 100% { opacity: 0.35; transform: scale(0.94); } 50% { opacity: 1; transform: scale(1.04); } }
        @keyframes softReveal { from { opacity: 0; filter: blur(5px); transform: translateY(3px); } to { opacity: 1; filter: blur(0); transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translate(-50%, -6px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes ripple { from { width: 14px; height: 14px; opacity: 0.6; } to { width: 32px; height: 32px; opacity: 0; } }
        @keyframes drawMark { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes dotIn { from { opacity: 0; transform: scale(0.3); } to { opacity: 1; transform: scale(1); } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes flicker { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }

        /* ---------- Splash v3.1: swapped in the user's own black-hole-with-candlestick-chart photo
           (portrait, full-bleed) in place of the earlier landscape stock photo \u2014 per explicit
           instruction, the photo itself is used directly and unaltered, never redrawn or replaced.
           "Alive" still comes from cheap compositing layers only, same approach as before: a slow Ken
           Burns zoom (extra overscan margin so cover-cropping never shows a hard edge), and \u2014 the
           actual motion \u2014 a shimmer sweep gated by the photo's own brightness (SPLASH_BLACKHOLE_MASK,
           a luminance-derived alpha map computed from this exact image via PIL: grayscale, then a
           gamma/threshold curve that keeps only strongly bright pixels, so it isolates both the
           accretion disk ring AND the candlestick chart baked into the photo \u2014 the shimmer sweeps
           across both together, reinforcing the "chart is part of this living scene" read). Object/
           mask-position (47% 41%) was hand-measured against a 10% grid overlay on the source photo to
           find the event horizon's actual center; the scene is now full-height (was 62%) since this
           photo's own composition already carries the chart-flowing-into-the-hole story the full
           height of a phone screen. Rotating the whole photo is still avoided (perspective/lensing
           reasons carry over unchanged from the original photo). ---------- */
        /* V1.3 — сам input полностью прозрачен и служит только зоной захвата: вид дают
           div-ы под ним. Бегунок делается невидимым, но НЕ убирается — без него в
           WebKit перетаскивание не работает. height на всю строку, чтобы попадать пальцем. */
        .emotion-range {
          -webkit-appearance: none; appearance: none;
          background: transparent; margin: 0; height: 100%;
          touch-action: pan-y; cursor: pointer;
        }
        .emotion-range::-webkit-slider-runnable-track { height: 100%; background: transparent; border: none; }
        .emotion-range::-moz-range-track { height: 100%; background: transparent; border: none; }
        /* Ширина невидимого бегунка ДОЛЖНА совпадать с нарисованным (18px): именно от неё
           браузер считает ход ползунка, и при расхождении кружок отстаёт от пальца у краёв. */
        .emotion-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 18px; height: 18px; border-radius: 50%;
          background: transparent; border: none;
        }
        .emotion-range::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%;
          background: transparent; border: none;
        }
        .emotion-range:focus { outline: none; }
        .splash2-root { background: #000; overflow: hidden; }
        @keyframes splash2RiseFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes splash2RingExpand { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        @keyframes splash2KenBurns { from { transform: scale(1.0); } to { transform: scale(1.022); } }
        /* V4.8: the ring no longer just brightens \u2014 an offset conic sweep rotates *inside* a static
           brightness mask, so the light travels around the accretion disk (matter in orbit) while the
           mask keeps it pinned to the disk's real pixels. 46s per revolution: visible as motion, never
           as spin. Plus a very slow counter-cycle on intensity so it breathes rather than blinks. */
        @keyframes splash2HorizonSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes splash2SpinPulse { 0%, 100% { opacity: 0.30; } 50% { opacity: 0.62; } }
        @keyframes splash2ShimmerPulse { 0%, 100% { opacity: 0.18; } 50% { opacity: 0.6; } }
        @keyframes splash2Glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.85; } }

        .splash2-bh-scene { position: absolute; inset: 0; height: 100%; overflow: hidden; }
        .splash2-bh-img {
          width: 100%; height: 100%; object-fit: cover; object-position: 47% 41%; display: block;
          animation: splash2KenBurns 12s cubic-bezier(0.45,0,0.55,1) infinite alternate;
        }
        /* v2: the moving diagonal light-bar (bg-position sweep) read as a cheap "shine" effect once
           it was sped up to be visible \u2014 a recognizable CSS-shine cliche that clashed with the
           photo's tone. Replaced with a still highlight (no travel) whose OPACITY breathes instead,
           gated by the same brightness mask so it still only lights up the ring/candle pixels; the
           motion now reads as the ring itself glowing brighter and dimmer, not a bar sliding over it.
           Same Ken Burns transform as the photo keeps the mask in registration while zooming. */
        .splash2-bh-shimmer {
          position: absolute; inset: 0; pointer-events: none; mix-blend-mode: screen;
          background: radial-gradient(ellipse 60% 60% at 47% 41%, rgba(255,246,224,0.9) 0%, rgba(255,238,208,0.5) 45%, transparent 75%);
          -webkit-mask-image: url(${SPLASH_BLACKHOLE_MASK}); mask-image: url(${SPLASH_BLACKHOLE_MASK});
          -webkit-mask-size: cover; mask-size: cover;
          -webkit-mask-position: 47% 41%; mask-position: 47% 41%;
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          animation: splash2KenBurns 12s cubic-bezier(0.45,0,0.55,1) infinite alternate, splash2ShimmerPulse 4.5s ease-in-out infinite;
        }
        /* A second, slower, offset breathing cycle at the event horizon itself (measured center,
           47%/41%) so the hole's own light doesn't pulse in lockstep with the ring highlight above \u2014
           two overlapping slow cycles read as organic "alive" light rather than one obvious blink. */
        .splash2-bh-glow {
          position: absolute; inset: 0; pointer-events: none; mix-blend-mode: screen;
          background: radial-gradient(circle at 47% 41%, rgba(255,232,190,0.55) 0%, rgba(255,214,150,0.28) 14%, transparent 30%);
          animation: splash2KenBurns 12s cubic-bezier(0.45,0,0.55,1) infinite alternate, splash2Glow 6s ease-in-out infinite -1.5s;
        }
        /* single canvas: starfield + candlestick stream. Sits above the photo composite, below the
           vignette, so the vignette still swallows its edges into the void. */
        .splash2-video {
          width: 100%; height: 100%; object-fit: cover; object-position: 50% 50%; display: block;
          background: #000;
        }
        .splash2-bh-spin {
          position: absolute; inset: 0; pointer-events: none; mix-blend-mode: screen; overflow: hidden;
          -webkit-mask-image: url(${SPLASH_BLACKHOLE_MASK}); mask-image: url(${SPLASH_BLACKHOLE_MASK});
          -webkit-mask-size: cover; mask-size: cover;
          -webkit-mask-position: 47% 41%; mask-position: 47% 41%;
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          animation: splash2SpinPulse 11s ease-in-out infinite -3s;
        }
        .splash2-bh-spin-inner {
          position: absolute; inset: 0; transform-origin: 47% 41%;
          background: conic-gradient(from 0deg at 47% 41%,
            rgba(255,240,210,0.00) 0deg, rgba(255,240,210,0.55) 42deg, rgba(255,236,200,0.10) 105deg,
            rgba(255,236,200,0.00) 170deg, rgba(255,232,195,0.34) 232deg, rgba(255,232,195,0.06) 292deg,
            rgba(255,240,210,0.00) 360deg);
          animation: splash2HorizonSpin 46s linear infinite;
          will-change: transform;
        }
        /* final beat: as the last candles cross the horizon the surrounding light swells once, and the
           whole layer cross-fades into the app \u2014 one continuous action, not a screen swap. */
        .splash2-root.is-flare .splash2-bh-glow { opacity: 1; filter: brightness(1.5); transition: opacity 1.1s ease-out, filter 1.1s ease-out; }
        .splash2-root.is-flare .splash2-bh-shimmer { filter: brightness(1.35); transition: filter 1.1s ease-out; }
        .splash2-root.is-flare .splash2-vignette { transition: opacity 1.1s ease-out; opacity: 0.82; }
        .splash2-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background:
            linear-gradient(to right, rgba(0,0,0,0.22), transparent 10%, transparent 90%, rgba(0,0,0,0.22)),
            linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 20%, transparent 68%, rgba(0,0,0,0.46) 86%, #000 100%);
        }

        .splash2-content { position: absolute; left: 0; right: 0; bottom: 15%; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .splash2-radar { position: relative; width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; }
        .splash2-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(255,255,255,0.14); animation: splash2RingExpand 1.1s ease-out both; }
        .splash2-ring.ring-a { inset: 16%; animation-delay: 0.15s; }
        .splash2-ring.ring-b { inset: 0; border-color: rgba(255,255,255,0.07); animation-delay: 0.35s; }
        .splash2-crosshair { position: absolute; background: rgba(255,255,255,0.09); opacity: 0; animation: splash2RiseFade 0.6s ease-out 0.6s forwards; }
        .splash2-crosshair.ch-h { left: -12px; right: -12px; top: 50%; height: 1px; }
        .splash2-crosshair.ch-v { top: -12px; bottom: -12px; left: 50%; width: 1px; }
        .splash2-node { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.5); opacity: 0; animation: splash2RiseFade 0.5s ease-out forwards; }
        .splash2-node.node-1 { top: 8%; left: 20%; animation-delay: 0.75s; }
        .splash2-node.node-2 { top: 28%; right: 2%; animation-delay: 0.9s; }
        .splash2-node.node-3 { bottom: 12%; left: 6%; animation-delay: 1.05s; }
        .splash2-divider { width: 26px; height: 1px; background: rgba(255,255,255,0.25); opacity: 0; animation: splash2RiseFade 0.5s ease-out 2.1s forwards; }
        .splash2-tagline { font-size: 12px; letter-spacing: 0.05em; color: #6B6B70; opacity: 0; animation: splash2RiseFade 0.7s ease-out 2.35s forwards; }
        .splash2-dots { display: flex; align-items: center; gap: 6px; opacity: 0; animation: splash2RiseFade 0.6s ease-out 2.55s forwards; }
        .splash2-dots-line { width: 26px; height: 1px; background: rgba(255,255,255,0.14); }
        .splash2-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.25); }
        .splash2-dot.active { width: 7px; height: 7px; background: #FFFFFF; box-shadow: 0 0 6px rgba(255,255,255,0.55); }

        /* ---------- Cosmic theme: quiet dark atmosphere \u2014 soft ambient light and stars, not a literal black hole ---------- */
        @keyframes horizonBreathe { 0%, 100% { opacity: 0.7; transform: scale(1); } 50% { opacity: 1; transform: scale(1.03); } }
        @keyframes cosmicTwinkle { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.4; } }
        .cosmic-core {
          position: absolute; width: 100vw; height: 100vw; right: -40vw; bottom: -46vw; border-radius: 50%;
          background: radial-gradient(circle at 38% 38%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 32%, transparent 55%);
          filter: blur(8px);
          animation: horizonBreathe 12s ease-in-out infinite;
        }
        .cosmic-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 95% 75% at 0% 0%, rgba(0,0,0,0.5) 0%, transparent 55%);
        }
        .cosmic-stars {
          position: absolute; inset: -15%;
          background-image:
            radial-gradient(1.3px 1.3px at 8% 12%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 22% 38%, rgba(255,255,255,0.55), transparent),
            radial-gradient(1.2px 1.2px at 38% 8%, rgba(255,255,255,0.65), transparent),
            radial-gradient(1px 1px at 52% 52%, rgba(255,255,255,0.45), transparent),
            radial-gradient(1.3px 1.3px at 66% 24%, rgba(255,255,255,0.75), transparent),
            radial-gradient(1px 1px at 78% 62%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1.2px 1.2px at 88% 14%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 12% 78%, rgba(255,255,255,0.45), transparent),
            radial-gradient(1.3px 1.3px at 46% 86%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 94% 88%, rgba(255,255,255,0.5), transparent);
          background-repeat: repeat;
          background-size: 420px 420px;
        }
        .cosmic-stars-1 { opacity: 0.35; animation: cosmicTwinkle 6s ease-in-out infinite; }
        .cosmic-stars-2 { background-size: 560px 560px; opacity: 0.22; animation: cosmicTwinkle 9s ease-in-out infinite 1.4s; }
        /* buttons/cards read as a layer floating above the void, not flush with it */
        .cosmic-theme .rounded-2xl { box-shadow: 0 16px 36px -10px rgba(0,0,0,0.7), 0 2px 10px -2px rgba(0,0,0,0.5); }
        .cosmic-theme .rounded-xl { box-shadow: 0 10px 22px -8px rgba(0,0,0,0.6); }
        .cosmic-theme .rounded-full { box-shadow: 0 3px 10px -3px rgba(0,0,0,0.5); }
        .cosmic-theme button:active { transform: translateY(1px); }

        /* V0.1 — боковые полосы прокрутки. .hscroll/.vscroll закрывали только те контейнеры,
           которым классы были проставлены вручную; полоса самой страницы и любых прочих
           скролл-областей оставалась видимой. Скрываем трек глобально — прокрутка (включая
           touch) при этом продолжает работать, не рисуется только сам ползунок. */
        html, body, * { scrollbar-width: none; -ms-overflow-style: none; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        *::-webkit-scrollbar { width: 0; height: 0; display: none; }

        .tab-content { animation: fadeIn 0.25s ease-out; }
        /* V5.4 — horizontal strips (filter pills, screenshot rows, leverage/RR selectors).
           Per the CSS overflow spec, setting overflow-x to auto while overflow-y stays
           'visible' forces overflow-y to compute to 'auto' as well. Those rows are only a
           couple of pixels taller than their content, so they became their own tiny
           VERTICAL scroll container: holding a pill and dragging up/down scrolled that few
           pixels instead of the page, and the row visibly jumped. Pinning overflow-y to
           hidden removes the nested scroll area entirely; overscroll-behavior stops the
           horizontal swipe from chaining into the page/back-gesture, and the scrollbar is
           hidden without disabling scrolling itself. */
        .hscroll {
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-x: contain;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hscroll::-webkit-scrollbar { display: none; }
        /* keeps the 300ms tap delay off and stops the pressed-state transform from being
           held (and re-rendered) through a drag */
        .hscroll > * { touch-action: manipulation; }
        /* V5.7 \u2014 the visible vertical scrollbar on bottom-sheet pickers, the instrument/tag
           dropdown and the Coach chat panel ("\u0431\u043e\u043a\u043e\u0432\u044b\u0435 \u043f\u043e\u043b\u043e\u0441\u044b \u0441\u043a\u0440\u043e\u043b\u043b\u0438\u043d\u0433\u0430") \u2014
           same idea as .hscroll but for a vertical-only container: scrolling still works
           (including touch), the OS scrollbar track is just not drawn. */
        .vscroll {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-y: contain;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .vscroll::-webkit-scrollbar { display: none; }
        .toast-in { animation: toastIn 0.2s ease-out; }
        .emotion-ripple { animation: ripple 0.5s ease-out; }
        .flame-flicker { animation: flicker 1.8s ease-in-out infinite; display: inline-block; }
        .theme-fade, .theme-fade * { transition: background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease; }
        .stagger > * { animation: fadeIn 0.45s ease-out both; }
        .stagger > *:nth-child(1) { animation-delay: 0ms; }
        .stagger > *:nth-child(2) { animation-delay: 60ms; }
        .stagger > *:nth-child(3) { animation-delay: 120ms; }
        .stagger > *:nth-child(4) { animation-delay: 180ms; }
        .stagger > *:nth-child(5) { animation-delay: 240ms; }
        .stagger > *:nth-child(6) { animation-delay: 300ms; }
      ` }),
    showSplash && /* @__PURE__ */ jsx(Splash, { accent, fading: splashFading }),
    !showSplash && authStatus === "authenticated" && !migrateFor && profileDataError && /* @__PURE__ */ jsx(ProfileLoadErrorScreen, {
      accent,
      lang,
      kind: profileDataError.kind,
      onRetry: () => {
        profileWriteUncertainRef.current = false;
        canPersistRef.current = false;
        setProfileDataError(null);
        setIntroResolved(false);
        setShowBootIntro(false);
        setProfileLoadRetryNonce((n) => n + 1);
      },
      onLogout: handleLogout
    }),
    !showSplash && !profileDataError && (authStatus === "checking" || authStatus === "authenticated" && !migrateFor && !introResolved && !showBootIntro) && /* @__PURE__ */ jsx(BootLoading, { accent }),
    !showSplash && authStatus === "unauthenticated" && /* @__PURE__ */ jsx(AuthScreen, { accent, onRegister: handleRegister, onLogin: handleLogin, onGoogle: handleGoogleLogin }),
    !showSplash && authStatus === "authenticated" && migrateFor && /* @__PURE__ */ jsx(LegacyMigratePrompt, { accent, onMigrate: handleMigrate, onSkip: handleSkipMigrate }),
    !showSplash && authStatus === "authenticated" && !migrateFor && !profileDataError && showBootIntro && /* @__PURE__ */ jsx(BootIntro, { accent, name, lang, onDone: () => setShowBootIntro(false) }),
    !showSplash && authStatus === "authenticated" && !migrateFor && !profileDataError && introResolved && !showBootIntro && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "pointer-events-none fixed inset-0", style: { background: `radial-gradient(circle at 50% 0%, ${accent}0A 0%, transparent 55%)`, transition: "background 0.4s ease" } }),
      accentPreset.cosmic && /* @__PURE__ */ jsxs("div", { className: "pointer-events-none fixed inset-0 overflow-hidden", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("div", { className: "cosmic-core" }),
        /* @__PURE__ */ jsx("div", { className: "cosmic-stars cosmic-stars-1" }),
        /* @__PURE__ */ jsx("div", { className: "cosmic-stars cosmic-stars-2" }),
        /* @__PURE__ */ jsx("div", { className: "cosmic-vignette" })
      ] }),
      /* @__PURE__ */ jsx(Toast, { text: toast }),
      /* @__PURE__ */ jsx(ScreenshotPreviewHost, {}),
      /* @__PURE__ */ jsx(WalletSheet, { open: walletOpen, onClose: () => setWalletOpen(false), balance: mindCoins, ledger: coinLedger, accent }),
      /* @__PURE__ */ jsx(DesktopSidebar, { nav, tab, setTab, accent, mindCoins, onWalletClick: () => setWalletOpen(true) }),
      /* @__PURE__ */ jsx("div", { className: "md:ml-[232px] md:flex md:justify-center", children: /* @__PURE__ */ jsxs("div", { className: `max-w-md ${contentMaxWidth} w-full mx-auto md:mx-0 px-5 md:px-10 pt-0 md:pt-10 pb-24 md:pb-16 relative`, children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            // V0.5 — шапка больше не sticky и не имеет собственного фона. Раньше это была
            // залитая на 88% полоса с blur, которая при открытом приложении читалась как вторая
            // «чёлка» поверх системной. Теперь логотип просто стоит в начале страницы и уезжает
            // вместе с контентом; фон один на весь экран.
            // V0.8 — вместе с sticky в V0.5 пропал и учёт системной чёлки: логотип оказался
            // вплотную к статус-бару (viewport-fit=cover в index.html отдаёт весь экран, а
            // safe-area раньше компенсировалась запасом pt-8 у залитой панели).
            className: "-mx-5 px-5 pb-5 relative md:hidden",
            style: { background: "transparent", paddingTop: "calc(env(safe-area-inset-top, 0px) + 18px)" },
            children: [
              /* V3.0 — шапка по левому краю, как в референсе: знак, под ним словесный знак.
                 Центрированная композиция с пустой третью слева существовала только чтобы
                 уравновесить кошелёк справа. Декоративная градиентная черта под логотипом
                 убрана: она ничего не обозначала и была единственным чисто украшательным
                 элементом на экране. */
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-start gap-2", children: [
                  /* @__PURE__ */ jsx(LogoMark, { size: 28, accent }),
                  /* @__PURE__ */ jsx(Wordmark, { accent })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                  /* @__PURE__ */ jsx(ProfileBadge, { label: t.nav.settings, onClick: () => setTab("settings") }),
                  /* @__PURE__ */ jsx(WalletBadge, { balance: mindCoins, accent, onClick: () => setWalletOpen(true) })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
          tab === "home" && /* @__PURE__ */ jsx(Home, { entries, goTo: setTab, accent, name, measureMode, currency, startingCapital, lastCalibration, analytics, t, lang, tradingAsset, notify: showToast, strategyNote }),
          tab === "new" && /* @__PURE__ */ jsx(
            NewEntry,
            {
              accent,
              measureMode,
              currency,
              customInstruments,
              customTags,
              onAddCustomInstrument: addCustomInstrument,
              onAddCustomTag: addCustomTag,
              strategies: strategies.filter((s) => s.status !== "archived"),
              notify: showToast,
              t,
              lang,
              onSave: async (e) => {
                const next = [...entries, e];
                const ok = await commitJournalEntries(next, "\u0417\u0430\u043F\u0438\u0441\u044C \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0430");
                if (!ok) return false;
                playPing();
                setTab("log");
                return true;
              }
            }
          ),
          tab === "log" && /* @__PURE__ */ jsx(Log, { entries, accent, onDelete: deleteEntry, onCloseTrade: (id) => {
            setClosingId(id);
            setTab("close");
          }, onEditTrade: (id) => {
            setEditingId(id);
            setTab("edit");
          }, measureMode, currency, t }),
          tab === "close" && /* @__PURE__ */ jsx(CloseTrade, {
            entry: entries.find((e) => e.id === closingId) || null,
            accent,
            measureMode,
            currency,
            t,
            notify: showToast,
            onCancel: () => {
              setClosingId(null);
              setTab("log");
            },
            onSave: async (patch) => {
              const next = entries.map((e) => e.id === closingId ? { ...e, ...patch } : e);
              const ok = await commitJournalEntries(next, "\u0421\u0434\u0435\u043B\u043A\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u0430");
              if (!ok) return false;
              playPing();
              setClosingId(null);
              setTab("log");
              return true;
            }
          }),
          tab === "edit" && /* @__PURE__ */ jsx(EditTrade, {
            entry: entries.find((e) => e.id === editingId) || null,
            accent,
            measureMode,
            currency,
            customInstruments,
            customTags,
            onAddCustomInstrument: addCustomInstrument,
            onAddCustomTag: addCustomTag,
            strategies,
            notify: showToast,
            t,
            lang,
            onCancel: () => {
              setEditingId(null);
              setTab("log");
            },
            onSave: async (patch) => {
              const next = entries.map((e) => e.id === editingId ? { ...e, ...patch } : e);
              const ok = await commitJournalEntries(next, "\u0421\u0434\u0435\u043B\u043A\u0430 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430");
              if (!ok) return false;
              setEditingId(null);
              setTab("log");
              return true;
            }
          }),
          tab === "patterns" && /* @__PURE__ */ jsx(Patterns, { entries, accent, measureMode, currency, analytics, t, lang }),
          tab === "strategies" && /* @__PURE__ */ jsx(StrategyLab, {
            strategies,
            strategyTrades,
            journalEntries: entries,
            loaded: strategyLoaded,
            accent,
            measureMode,
            currency,
            customInstruments,
            onAddCustomInstrument: addCustomInstrument,
            notify: showToast,
            lang,
            onCreateStrategy: handleCreateStrategy,
            onUpdateStrategy: handleUpdateStrategy,
            onDeleteStrategy: handleDeleteStrategy,
            onCreateTrade: handleCreateStrategyTrade,
            onUpdateTrade: handleUpdateStrategyTrade,
            onCloseTrade: handleCloseStrategyTrade
          }),
          tab === "calibration" && /* @__PURE__ */ jsx(Calibration, { accent, onComplete: setLastCalibration, lang, t, entries, analytics, userId, strategyNote, loadHistory: caLoadCalibrationHistory, saveHistory: caSaveCalibrationHistory }),
          tab === "challenge" && /* @__PURE__ */ jsx(Challenge, { entries, accent, weeklyGoal, t, lang }),
          tab === "coach" && /* @__PURE__ */ jsx(Coach, { entries, analytics, accent, userId, lang, t, strategyNote, loadState: loadAiState, saveState: saveAiState }),
          tab === "settings" && /* @__PURE__ */ jsx(
            Settings,
            {
              accent,
              setAccent: setAccentPreset,
              name,
              setName,
              onThemeChange: (n) => showToast(`\u0422\u0435\u043C\u0430: ${n}`),
              soundOn,
              setSoundOn,
              weeklyGoal,
              setWeeklyGoal,
              onExport: exportJournal,
              onImport: importJournal,
              onExportBackup: exportFullBackup,
              onImportBackup: importFullBackup,
              onReset: resetJournal,
              onFullReset: resetEverything,
              measureMode,
              setMeasureMode,
              currency,
              setCurrency,
              tradingAsset,
              setTradingAsset,
              strategyNote,
              setStrategyNote,
              startingCapital,
              setStartingCapital,
              username: authUser?.username,
              accountProvider: authProviderLabel(),
              onLogout: handleLogout,
              lang,
              setLang,
              t
            }
          )
        ] }, tab)
      ] }) }),
      /* V3.0 — нижняя панель. Была плавающая карточка со своей рамкой, фоном и подписями
         под каждой из семи иконок; подписи при семи вкладках всё равно обрезались
         многоточием, то есть занимали место, ничего не сообщая. Теперь панель не
         отдельный объект, а край экрана: прозрачный фон, одна волосяная линия сверху,
         только иконки. Активная вкладка обозначена цветом и точкой под иконкой —
         подпись выводится лишь для неё, где на неё есть место.
         Подъём кнопки «Запись» и её свечение убраны: белый круг на чёрном сам по себе
         достаточный акцент, свечение было единственным местом в панели с тенью. */
      /* @__PURE__ */ jsx("div", { className: "fixed bottom-0 left-0 right-0 md:hidden", style: { background: "linear-gradient(180deg, rgba(8,8,9,0.94) 0%, rgba(0,0,0,0.985) 100%)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.045)", boxShadow: "0 -10px 28px rgba(0,0,0,0.28)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }, children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-md px-3 pt-1.5 pb-1", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-[1fr_auto_1fr] items-end gap-1", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 items-end justify-items-center", children: mobileLeftNav.map((n) => /* @__PURE__ */ jsx(MobileNavItem, { item: n, active: tab === n.id, accent, onClick: () => setTab(n.id) }, n.id)) }),
        /* @__PURE__ */ jsx("div", { className: "flex items-end justify-center px-1", children: mobilePrimaryNav && /* @__PURE__ */ jsx(MobileNavPrimaryButton, { item: mobilePrimaryNav, onClick: () => setTab(mobilePrimaryNav.id) }) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 items-end justify-items-center", children: mobileRightNav.map((n) => /* @__PURE__ */ jsx(MobileNavItem, { item: n, active: tab === n.id, accent, onClick: () => setTab(n.id) }, n.id)) })
      ] }) }) })
    ] })
  ] });
}

// entry.jsx
import { jsx as jsx2 } from "react/jsx-runtime";
createRoot(document.getElementById("root")).render(/* @__PURE__ */ jsx2(AppErrorBoundary, { children: /* @__PURE__ */ jsx2(MindExe, {}) }));
