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
  signInWithPopup
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
import { BASE, WIN, LOSS, FLAT, WARN, ACCENTS, INSTRUMENTS, SETUP_TAGS, DIRECTION_LABEL } from "./config/app-config.js?v=1";
import { STRINGS } from "./i18n/strings.js?v=1";
import { TREND_ARROW, analyzeTraderPatterns, calculateTraderAnalytics, calculateTraderLevel } from "./analytics/trader-analytics.js?v=2";
import {
  CALIBRATION_QUESTIONS, CALIBRATION_QUESTIONS_EN, CALIBRATION_SCALE_SETS, CALIBRATION_SCALE_TYPES,
  caWithTimeout, caScaleSet, scoreCalibrationDynamic, REVIEW_LIKERT, REVIEW_LIKERT_EN,
  buildReviewQuiz, scoreJournalReview
} from "./analytics/calibration-review.js?v=1";
import { Pill, Card, Toast, ScreenshotPreviewHost, Skeleton, SkeletonLines, EmptyState, StatCard } from "./ui/primitives.js?v=2";
import { LogoMark, Wordmark } from "./ui/brand.js?v=1";
import { configureTradeAi } from "./ai/trade-tools.js?v=1";
import {
  configureAiService, aiGetModel, aiGenerateInsight, aiChatReply, aiReviewQuestions,
  aiReviewSummary, aiFetchMarketSnapshot, aiGenerateHomeAdvice, aiGenerateCalibrationQuestions
} from "./ai/ai-service.js?v=1";
import { aiBuildContext, aiHashContext, aiCompactRecentEntries, caComputeAdaptiveFactors, caBuildContext } from "./ai/context.js?v=1";
import {
  emotionStateText, emotionVerdict, emotionValuesText, emotionValuesColor,
  entryStateText, entryStateColor, EmotionScales,
  NewEntry, CloseTrade, EditTrade, Log
} from "./features/journal/journal-ui.js?v=1";
import { strategyAllTrades, calculateStrategyStats, StrategyLab } from "./features/strategy/strategy-lab.js?v=1";
import { Settings } from "./features/settings/settings-ui.js?v=1";
import { Coach } from "./features/coach/coach-ui.js?v=1";
import { Calibration, JournalReview } from "./features/calibration/calibration-ui.js?v=1";
// V3.0 — палитра переведена на референс: чистый чёрный фон, поверхности почти сливаются
// с ним, линии существуют, но не читаются как рамки. Раньше фон был #0A0A0B, а карточка
// #131315 с видимой границей #25252A — на OLED это выглядит как набор коробок, а не как
// один экран. Теперь разделение делается только сдвигом яркости поверхности.
var BTC_DOMINANCE = 54.6;
var FEAR_GREED = { score: 44, label: "\u041D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u043E" };
var ring = (accent) => `0 0 0 1px ${accent}35`;
var softLift = (accent) => `0 0 0 1px ${accent}35, 0 6px 20px ${accent}1F`;
var outcomeColor = (o) => o === "Win" ? WIN : o === "Loss" ? LOSS : FLAT;
var isToday = (isoDate) => !!isoDate && new Date(isoDate).toDateString() === (/* @__PURE__ */ new Date()).toDateString();
function useAnimatedNumber(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  useEffect(() => {
    const from = prevRef.current;
    const to = target;
    if (from === to) return;
    let start;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
      else prevRef.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return display;
}
// V5.4: the level used to be `3 + floor(entriesCount / 3)`, so a brand-new account with an empty
// journal already displayed level 3 and every third entry bumped it regardless of HOW the trader
// behaved. Level is now (a) hard-capped by how much real closed history exists — an empty account
// is level 1, always — and (b) inside that cap driven by a behavioural quality score, never by PnL.
// Signature changed from (entriesCount) to (entries, analytics); both call sites are updated.
function calculateCalendarStats(dayEntries, closedDayEntries, measureMode = "R", currency = "USD") {
  if (!dayEntries.length) return null;
  const closed = closedDayEntries || dayEntries.filter(isEntryClosed);
  const resultClosed = resultEntriesForUnit(closed, measureMode, currency);
  const wins = closed.filter((e) => e.outcome === "Win").length;
  const losses = closed.filter((e) => e.outcome === "Loss").length;
  const breakevens = closed.filter((e) => e.outcome === "Breakeven").length;
  const avgR = resultClosed.length ? resultClosed.reduce((s, e) => s + e.r, 0) / resultClosed.length : null;
  const countBy = (key) => {
    const counts = {};
    dayEntries.forEach((e) => {
      const v = e[key];
      if (v) counts[v] = (counts[v] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.length ? { value: sorted[0][0], count: sorted[0][1] } : null;
  };
  const topInstrument = countBy("instrument");
  const topTag = countBy("tag");
  const emoPoints = dayEntries.filter((e) => e.x != null && e.y != null);
  let mood = null, moodColor = BASE.inkFaint;
  if (emoPoints.length) {
    const avgX = emoPoints.reduce((s, e) => s + e.x, 0) / emoPoints.length;
    const avgY = emoPoints.reduce((s, e) => s + e.y, 0) / emoPoints.length;
    mood = avgX >= 50 && avgY >= 50 ? "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E \u0438 \u0441\u043F\u043E\u043A\u043E\u0439\u043D\u043E" : avgX >= 50 && avgY < 50 ? "\u0423\u0432\u0435\u0440\u0435\u043D\u043D\u043E, \u043D\u043E \u043D\u0430 \u0432\u0437\u0432\u043E\u0434\u0435" : avgX < 50 && avgY >= 50 ? "\u0421\u043F\u043E\u043A\u043E\u0439\u043D\u043E, \u043D\u043E \u043D\u0435\u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E" : "\u0421\u0442\u0440\u0430\u0448\u043D\u043E \u0438 \u043D\u0430 \u043D\u0435\u0440\u0432\u0430\u0445";
    moodColor = avgX >= 50 && avgY >= 50 ? WIN : avgX < 50 && avgY < 50 ? LOSS : BASE.inkDim;
  }
  return { wins, losses, breakevens, avgR, topInstrument, topTag, mood, moodColor };
}
var relTime = (date) => {
  const diff = Math.floor((Date.now() - date.getTime()) / 864e5);
  if (diff <= 0) return "\u0421\u0435\u0433\u043E\u0434\u043D\u044F";
  if (diff === 1) return "\u0412\u0447\u0435\u0440\u0430";
  if (diff < 7) return `${diff} \u0434\u043D. \u043D\u0430\u0437\u0430\u0434`;
  return `${Math.floor(diff / 7)} \u043D\u0435\u0434. \u043D\u0430\u0437\u0430\u0434`;
};
var pluralRu = (n, one, few, many) => {
  const mod10 = n % 10, mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
};
var SPLASH_POSTER_IMG = "data:image/jpeg;base64,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";
var SPLASH_BLACKHOLE_MASK = "data:image/png;base64,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";
// V4.6.13: новый splash-видеофон заменяет прежний «глаз». Сам каркас splash screen,
// логотип, оверлеи, fade-out и общая анимационная логика сохранены без изменений.
// Видео остаётся sibling-файлом рядом с index.html. Query string нужен как cache-buster:
// iOS PWA иначе может продолжать показывать старый splash.mp4.
// Встроенный SPLASH_POSTER_IMG — первый кадр этого же видео; если autoplay не сработает,
// экран всё равно остаётся в новой визуальной концепции.
var SPLASH_VIDEO_SRC = "./splash.mp4?v=4.6.13";
// V0.9 — раньше между «сплэш закончился» и «профиль загрузился» не рендерилось НИЧЕГО: при
// authStatus === "checking" (Firebase ещё не ответил, кто вошёл) или при authenticated с
// loaded === false экран оставался просто чёрным. Теперь эти состояния показывают
// нейтральный индикатор, поэтому даже долгая загрузка не выглядит как зависшее приложение.
function BootLoading({ accent }) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 flex items-center justify-center", style: { background: BASE.bg }, children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full", style: { border: `2px solid ${BASE.line}`, borderTopColor: accent, animation: "spin 0.9s linear infinite" } }),
    /* @__PURE__ */ jsx("span", { className: "text-[11px] tracking-[0.14em] uppercase", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: "mind.exe" })
  ] }) });
}
function ProfileLoadErrorScreen({ accent, lang = "ru", onRetry, onLogout, kind = "load" }) {
  const isEn = lang === "en";
  const isConflict = kind === "conflict";
  const isSave = kind === "save";
  return /* @__PURE__ */ jsx("div", {
    className: "fixed inset-0 z-[90] flex items-center justify-center px-6",
    style: { background: BASE.bg, paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" },
    children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm text-center", children: [
      /* @__PURE__ */ jsx("div", {
        className: "w-12 h-12 rounded-full mx-auto mb-5 flex items-center justify-center",
        style: { border: `1px solid ${LOSS}38`, background: `${LOSS}08`, color: LOSS },
        children: /* @__PURE__ */ jsx(AlertTriangle, { size: 20 })
      }),
      /* @__PURE__ */ jsx("h2", {
        className: "text-[16px] mb-2",
        style: { color: BASE.ink, fontFamily: "var(--font-display)", fontWeight: 500 },
        children: isConflict
          ? isEn ? "Cloud data changed elsewhere" : "Облачные данные изменились"
          : isSave
            ? isEn ? "Sync status is uncertain" : "Не удалось подтвердить сохранение"
            : isEn ? "Could not load your data" : "Не удалось загрузить данные"
      }),
      /* @__PURE__ */ jsx("p", {
        className: "text-[12px] leading-relaxed mb-6",
        style: { color: BASE.inkDim },
        children: isConflict
          ? isEn
            ? "Another session or device saved a newer profile revision. Reload the cloud data before making more changes."
            : "Другая сессия или устройство сохранили более новую версию профиля. Перезагрузи облачные данные перед дальнейшими изменениями."
          : isSave
            ? isEn
              ? "The app stopped further cloud writes because the final save status is unknown. Reload the data before continuing."
              : "Приложение остановило дальнейшие записи в облако, потому что итоговый статус сохранения неизвестен. Перезагрузи данные перед продолжением."
            : isEn
              ? "The journal is not being shown as empty because cloud data was not confirmed. Retry the load when the connection is stable."
              : "Журнал не показывается пустым, потому что облачные данные не удалось подтвердить. Повтори загрузку при стабильном соединении."
      }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("button", {
          type: "button",
          onClick: onRetry,
          className: "flex-1 py-3 rounded-full text-sm flex items-center justify-center gap-2 active:scale-[0.98]",
          style: { background: BASE.ink, color: "#050505", fontWeight: 600 },
          children: [
            /* @__PURE__ */ jsx(RotateCcw, { size: 14 }),
            isEn ? "Retry" : "Повторить"
          ]
        }),
        /* @__PURE__ */ jsx("button", {
          type: "button",
          onClick: onLogout,
          className: "px-4 py-3 rounded-full text-sm active:scale-[0.98]",
          style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim },
          children: isEn ? "Sign out" : "Выйти"
        })
      ] })
    ] })
  });
}
function Splash({ accent, fading }) {
  const videoRef = useRef(null);
  const [flare, setFlare] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFlare(true), 4600);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Some browsers reject the autoplay attribute but allow a muted programmatic play(); if both
    // fail we simply keep the poster frame, which is a valid splash on its own.
    const p = v.play?.();
    if (p && typeof p.catch === "function") p.catch(() => {
    });
    return () => {
      try {
        v.pause();
        v.removeAttribute("src");
        v.load();
      } catch (_) {
      }
    };
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: `splash2-root fixed inset-0 z-50${flare ? " is-flare" : ""}`, style: { opacity: fading ? 0 : 1, pointerEvents: fading ? "none" : "auto", transition: "opacity 900ms cubic-bezier(0.4,0,0.2,1)" }, children: [
    /* @__PURE__ */ jsx("div", { className: "splash2-bh-scene", children: /* @__PURE__ */ jsx(
      "video",
      {
        ref: videoRef,
        className: "splash2-video",
        src: SPLASH_VIDEO_SRC,
        poster: SPLASH_POSTER_IMG,
        autoPlay: true,
        muted: true,
        playsInline: true,
        preload: "auto",
        "aria-hidden": "true"
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "splash2-vignette" }),
    /* @__PURE__ */ jsxs("div", { className: "splash2-content", children: [
      /* @__PURE__ */ jsxs("div", { className: "splash2-radar", children: [
        /* @__PURE__ */ jsx("span", { className: "splash2-ring ring-a" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-ring ring-b" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-crosshair ch-h" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-crosshair ch-v" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-node node-1" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-node node-2" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-node node-3" }),
        /* @__PURE__ */ jsx(LogoMark, { size: 42, accent, animated: true })
      ] }),
      /* @__PURE__ */ jsx(Wordmark, { accent, size: 24, animated: true, wide: true }),
      /* @__PURE__ */ jsx("div", { className: "splash2-divider" }),
      /* @__PURE__ */ jsx("p", { className: "splash2-tagline", children: "your mind leaves a pattern" }),
      /* @__PURE__ */ jsxs("div", { className: "splash2-dots", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("span", { className: "splash2-dots-line" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-dot" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-dot" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-dot active" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-dot" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-dot" }),
        /* @__PURE__ */ jsx("span", { className: "splash2-dots-line" })
      ] })
    ] })
  ] });
}
function WalletBadge({ balance, accent, onClick }) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick,
      className: "flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full transition-all duration-150 active:scale-[0.98]",
      style: { border: `1px solid ${BASE.line}`, background: `linear-gradient(180deg, ${BASE.surface2} 0%, ${BASE.surface} 100%)`, boxShadow: "0 10px 26px -18px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.04)" },
      children: [
        /* @__PURE__ */ jsx(Coins, { size: 13, style: { color: accent } }),
        /* @__PURE__ */ jsx("span", { className: "text-[12px] leading-none", style: { fontFamily: "var(--font-mono)", color: BASE.ink, fontWeight: 500 }, children: groupThousands(balance) })
      ]
    }
  );
}
function ProfileBadge({ onClick, label }) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      "aria-label": label,
      title: label,
      className: "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 active:scale-[0.98]",
      style: {
        border: `1px solid ${BASE.line}`,
        background: `linear-gradient(180deg, ${BASE.surface2} 0%, ${BASE.surface} 100%)`,
        boxShadow: "0 10px 26px -18px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.04)"
      },
      children: /* @__PURE__ */ jsx(User, { size: 17, style: { color: BASE.ink } })
    }
  );
}
function MobileNavItem({ item, active, accent, onClick }) {
  const Icon = item.icon;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick,
      "aria-label": item.label,
      className: "w-[48px] h-[40px] flex flex-col items-center justify-end gap-1 rounded-xl transition-all duration-200 active:scale-[0.96]",
      style: {
        color: active ? BASE.ink : BASE.inkFaint,
        background: active ? "rgba(255,255,255,0.018)" : "transparent"
      },
      children: [
        /* @__PURE__ */ jsx(Icon, { size: 19, strokeWidth: active ? 1.9 : 1.65, style: { color: active ? BASE.ink : BASE.inkFaint, transition: "color 0.22s ease, transform 0.22s ease", transform: active ? "translateY(-0.5px)" : "none" } }),
        /* @__PURE__ */ jsx("span", { className: "block rounded-full", style: { width: active ? 12 : 5, height: 2.5, background: active ? accent : "rgba(255,255,255,0.14)", opacity: active ? 1 : 0.55, transition: "width 0.22s ease, background 0.22s ease, opacity 0.22s ease" } })
      ]
    }
  );
}
function MobileNavPrimaryButton({ item, onClick }) {
  const Icon = item.icon;
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      "aria-label": item.label,
      className: "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 active:scale-[0.97]",
      style: {
        background: BASE.ink,
        border: "1px solid rgba(255,255,255,0.04)",
        boxShadow: "0 16px 32px -18px rgba(255,255,255,0.12), 0 18px 34px -22px rgba(0,0,0,0.95)"
      },
      children: /* @__PURE__ */ jsx(Icon, { size: 19, strokeWidth: 2, style: { color: "#050505" } })
    }
  );
}
function WalletSheet({ open, onClose, balance, ledger, accent }) {
  if (!open) return null;
  const rows = [...ledger].reverse();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-end justify-center",
      onClick: onClose,
      style: { background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          className: "w-full max-w-md rounded-t-[28px] px-5 pt-4 pb-8 vscroll",
          style: { background: BASE.surface, border: `1px solid ${BASE.line}`, borderBottom: "none", maxHeight: "78vh", overflowY: "auto", animation: "riseIn 0.28s ease-out" },
          children: [
            /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4", style: { width: 36, height: 4, borderRadius: 2, background: BASE.line } }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-sm", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 600 }, children: "MindCoin" }),
              /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1 -m-1", children: /* @__PURE__ */ jsx(XIcon, { size: 16, style: { color: BASE.inkFaint } }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 mb-1", children: [
              /* @__PURE__ */ jsx(Coins, { size: 24, style: { color: accent } }),
              /* @__PURE__ */ jsx("span", { className: "text-[28px] leading-none", style: { fontFamily: "var(--font-mono)", color: BASE.ink, fontWeight: 600 }, children: groupThousands(balance) })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] mb-6", style: { color: BASE.inkFaint }, children: "\u041F\u043E\u043A\u0430 \u043D\u0435 \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u043D\u044B \u043A \u043F\u043E\u043A\u0443\u043F\u043A\u0430\u043C \u2014 \u043E\u0431\u043C\u0435\u043D \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0437\u0436\u0435, \u0432 App Store-\u0432\u0435\u0440\u0441\u0438\u0438." }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: "\u041F\u043E\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F" }),
            rows.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: Coins, title: "\u041E\u043F\u0435\u0440\u0430\u0446\u0438\u0439 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442", hint: "+10 \u043D\u0430\u0447\u0438\u0441\u043B\u044F\u0435\u0442\u0441\u044F \u0437\u0430 \u0432\u0445\u043E\u0434 \u043A\u0430\u0436\u0434\u044B\u0439 \u0434\u0435\u043D\u044C, +5 \u2014 \u0437\u0430 \u043F\u043E\u0431\u0435\u0434\u0443 \u043D\u0430\u0434 \u0440\u044B\u043D\u043A\u043E\u043C \u0432 \u0438\u0433\u0440\u0435.", compact: true }) : /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: rows.map((tx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2.5", style: { borderBottom: `1px solid ${BASE.line}` }, children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: BASE.ink }, children: tx.reason }),
                /* @__PURE__ */ jsx("div", { className: "text-[11px]", style: { color: BASE.inkFaint }, children: relTime(new Date(tx.date)) })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-sm", style: { color: WIN, fontFamily: "var(--font-mono)" }, children: [
                "+",
                tx.amount
              ] })
            ] }, tx.id)) })
          ]
        }
      )
    }
  );
}
var RU_WEEKDAY_SHORT = ["\u0412\u0441", "\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431"];
var EN_WEEKDAY_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function useStreak(entries, lang = "ru") {
  return useMemo(() => {
    const dateSet = new Set(entries.map((e) => e.date.toDateString()));
    const cursor = /* @__PURE__ */ new Date();
    if (!dateSet.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (dateSet.has(cursor.toDateString())) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    const today = /* @__PURE__ */ new Date();
    const mondayOffset = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset);
    const weekdayLabels = lang === "en" ? EN_WEEKDAY_SHORT : RU_WEEKDAY_SHORT;
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push({ label: weekdayLabels[d.getDay()], filled: dateSet.has(d.toDateString()) });
    }
    return { streak, week };
  }, [entries, lang]);
}
function calculateChallengeProgress(entries, lang = "ru") {
  const sortedDesc = [...entries].sort((a, b) => b.date - a.date);
  let noRevenge = 0;
  for (const e of sortedDesc) {
    if (e.tag === "\u0420\u0435\u0432\u0430\u043D\u0448") break;
    noRevenge++;
    if (noRevenge >= 5) break;
  }
  const last5 = sortedDesc.slice(0, 5);
  const reflected = last5.filter((e) => e.pull && e.pull !== "\u2014" && e.lesson && e.lesson !== "\u2014").length;
  let winStreak = 0;
  for (const e of sortedDesc) {
    if (e.r === null || e.r === void 0 || e.r <= 0) break;
    winStreak++;
    if (winStreak >= 3) break;
  }
  if (lang === "en") {
    return [
      { id: "revenge", title: "No revenge trades", desc: '5 trades in a row without the "Revenge" tag.', progress: noRevenge, goal: 5 },
      { id: "reflect", title: "Full reflection", desc: "Fill in both reflection fields \u2014 in your last 5 trades.", progress: reflected, goal: 5 },
      { id: "winstreak", title: "Positive streak", desc: "3 trades in a row with a positive result.", progress: winStreak, goal: 3 }
    ];
  }
  return [
    { id: "revenge", title: "\u0411\u0435\u0437 \u0440\u0435\u0432\u0430\u043D\u0448-\u0442\u0440\u0435\u0439\u0434\u043E\u0432", desc: "5 \u0441\u0434\u0435\u043B\u043E\u043A \u043F\u043E\u0434\u0440\u044F\u0434 \u0431\u0435\u0437 \u0442\u0435\u0433\u0430 \xAB\u0420\u0435\u0432\u0430\u043D\u0448\xBB.", progress: noRevenge, goal: 5 },
    { id: "reflect", title: "\u041F\u043E\u043B\u043D\u0430\u044F \u0440\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u044F", desc: "\u0417\u0430\u043F\u043E\u043B\u043D\u044F\u0439 \u043E\u0431\u0430 \u043F\u043E\u043B\u044F \u0440\u0435\u0444\u043B\u0435\u043A\u0441\u0438\u0438 \u2014 \u0432 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0445 5 \u0441\u0434\u0435\u043B\u043A\u0430\u0445.", progress: reflected, goal: 5 },
    { id: "winstreak", title: "\u041F\u043B\u044E\u0441\u043E\u0432\u0430\u044F \u0441\u0435\u0440\u0438\u044F", desc: "3 \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u0434\u0440\u044F\u0434 \u0441 \u043F\u043E\u043B\u043E\u0436\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u043C \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u043C.", progress: winStreak, goal: 3 }
  ];
}
function WeekDots({ week, accent }) {
  return /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2.5", children: week.map((d, i) => /* @__PURE__ */ jsx(
    "span",
    {
      className: "w-2 h-2 rounded-full transition-all duration-300",
      style: { background: d.filled ? accent : "transparent", border: `1px solid ${d.filled ? accent : BASE.line}` },
      "aria-label": d.label
    },
    i
  )) });
}
// V0.8 — раньше это была голая ломаная в 1.6px с острыми углами: при двух-трёх сделках она
// выглядела как случайная «галочка» в углу карточки. Теперь линия сглажена (кубическая кривая
// по средним точкам — без библиотек), под ней мягкая заливка тем же цветом, а последнее
// значение отмечено точкой, чтобы читалось направление.
function Sparkline({ points, color, width = 84, height = 30 }) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const padY = 4;
  const stepX = width / (points.length - 1);
  const xy = points.map((v, i) => [i * stepX, height - padY - (v - min) / range * (height - padY * 2)]);
  let line = `M ${xy[0][0].toFixed(1)} ${xy[0][1].toFixed(1)}`;
  for (let i = 1; i < xy.length; i++) {
    const [px, py] = xy[i - 1];
    const [cx, cy] = xy[i];
    const mx = (px + cx) / 2;
    line += ` C ${mx.toFixed(1)} ${py.toFixed(1)}, ${mx.toFixed(1)} ${cy.toFixed(1)}, ${cx.toFixed(1)} ${cy.toFixed(1)}`;
  }
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  const gradId = `spark-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  const last = xy[xy.length - 1];
  return /* @__PURE__ */ jsxs("svg", { width, height, viewBox: `0 0 ${width} ${height}`, style: { overflow: "visible" }, children: [
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: gradId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
      /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: color, stopOpacity: "0.22" }),
      /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: color, stopOpacity: "0" })
    ] }) }),
    /* @__PURE__ */ jsx("path", { d: area, fill: `url(#${gradId})`, stroke: "none" }),
    /* @__PURE__ */ jsx("path", { d: line, fill: "none", stroke: color, strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", opacity: "0.9" }),
    /* @__PURE__ */ jsx("circle", { cx: last[0], cy: last[1], r: "2", fill: color })
  ] });
}
function Home({ entries, goTo, accent, name, measureMode, currency, startingCapital, lastCalibration, analytics, t, lang, tradingAsset, notify, strategyNote }) {
  const total = entries.length;
  const [patternOpen, setPatternOpen] = useState(false);
  const [marketSnapshot, setMarketSnapshot] = useState(null);
  const [marketRefreshing, setMarketRefreshing] = useState(false);
  useEffect(() => {
    if (!tradingAsset) {
      setMarketSnapshot(null);
      return;
    }
    let cancelled = false;
    getMarketSnapshot(tradingAsset, lang).then((snap) => {
      if (!cancelled && snap) setMarketSnapshot(snap);
    }).catch((err) => {
      console.error("mind.exe market snapshot (auto) failed:", err);
    });
    return () => {
      cancelled = true;
    };
  }, [tradingAsset, lang]);
  // V0.4 — совет по собственному журналу вместо пересказа рынка. Контекст тот же, что у Coach
  // (aiBuildContext), плюс стратегия из настроек. Запрос уходит только когда меняется хэш
  // контекста — не на каждый рендер Home.
  const [homeAdvice, setHomeAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const adviceContext = useMemo(() => aiBuildContext(entries, analytics, lang, strategyNote), [entries, analytics, lang, strategyNote]);
  const adviceHash = useMemo(() => aiHashContext(adviceContext), [adviceContext]);
  useEffect(() => {
    if (entries.length === 0) {
      setHomeAdvice(null);
      return;
    }
    let cancelled = false;
    setAdviceLoading(true);
    getHomeAdvice(adviceContext, adviceHash, false).then((text) => {
      if (!cancelled && text) setHomeAdvice(text);
    }).catch((err) => {
      console.error("mind.exe home advice failed:", err);
    }).finally(() => {
      if (!cancelled) setAdviceLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // adviceContext/entries читаются внутри; перезапуск строго по изменению хэша контекста.
  }, [adviceHash]);
  // V0.4 — кнопка обновления в шапке карточки: принудительно перегенерировать совет (мимо кэша)
  // и заодно освежить рыночные метрики внизу экрана, если актив выбран.
  const refreshInsight = async () => {
    if (marketRefreshing || adviceLoading) return;
    if (entries.length > 0) {
      setAdviceLoading(true);
      try {
        const text = await getHomeAdvice(adviceContext, adviceHash, true);
        if (text) setHomeAdvice(text);
      } catch (err) {
        console.error("mind.exe home advice (manual) failed:", err);
        notify?.(t.coach.error);
      } finally {
        setAdviceLoading(false);
      }
    }
    if (tradingAsset) refreshMarketSnapshot();
  };
  const refreshMarketSnapshot = async () => {
    if (marketRefreshing) return;
    if (!tradingAsset) {
      notify?.("\u0412\u044B\u0431\u0435\u0440\u0438 \u0442\u043E\u0440\u0433\u043E\u0432\u044B\u0439 \u0430\u043A\u0442\u0438\u0432 \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u2014 \u0431\u0435\u0437 \u043D\u0435\u0433\u043E \u0440\u044B\u043D\u043E\u0447\u043D\u044B\u0439 \u0438\u043D\u0441\u0430\u0439\u0442 \u043D\u0435 \u0441\u0442\u0440\u043E\u0438\u0442\u0441\u044F");
      return;
    }
    setMarketRefreshing(true);
    try {
      const fresh = await aiFetchMarketSnapshot(tradingAsset, lang);
      const withBucket = { ...fresh, hourBucket: marketHourBucket() };
      __marketMemCache[tradingAsset] = withBucket;
      saveCachedMarketSnapshot(tradingAsset, withBucket);
      setMarketSnapshot(withBucket);
    } catch (err) {
      console.error("mind.exe market snapshot (manual) failed:", err);
      notify?.(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0441\u0430\u0439\u0442\u0430: ${err?.message || err}`);
    } finally {
      setMarketRefreshing(false);
    }
  };
  const closedEntries = useMemo(() => entries.filter(isEntryClosed), [entries]);
  const traderPatterns = useMemo(() => analyzeTraderPatterns(closedEntries, lang), [closedEntries, lang]);
  const calibratedToday = lastCalibration && isToday(lastCalibration.date);
  const consciousScoreTarget = analytics.awareness.score.value ?? 0;
  const reflectionScore = analytics.reflection.score.value;
  const disciplineScore = analytics.discipline.score.value;
  const riskStabilityScore = analytics.risk.stability.value;
  const level = calculateTraderLevel(entries, analytics);
  const { streak, week } = useStreak(entries, lang);
  // V5.4: the local fallback used to derive a mood from consciousScoreTarget unconditionally.
  // Awareness now legitimately starts at 0 for a new account, which made that expression print
  // "Reactive" to someone who had not made a single trade yet — a psychological label invented
  // out of no data. The fallback is only used once awareness actually rests on some history.
  const awarenessKnown = analytics.awareness.score.value != null && (analytics.awareness.evidence ?? 0) >= 6;
  const moodKey = marketSnapshot?.moodLabel || (!awarenessKnown ? t.home.moodStable : consciousScoreTarget > 80 ? t.home.moodCalm : consciousScoreTarget > 60 ? t.home.moodStable : t.home.moodReactive);
  // V1.0 — данные для рыночной карточки внизу главной. Источник тот же, что и был:
  // marketSnapshot от Gemini с фолбэком на константы BTC_DOMINANCE / FEAR_GREED.
  const showBtcD = !tradingAsset || tradingAsset === "crypto";
  const btcDValue = marketSnapshot?.btcDominance ?? BTC_DOMINANCE;
  const fngValue = marketSnapshot?.sentimentScore ?? FEAR_GREED.score;
  const fngLabel = marketSnapshot?.sentimentLabel || FEAR_GREED.label;
  const marketCells = [
    showBtcD && { key: "btcd", label: "BTC.D", value: `${btcDValue}%`, mono: true, icon: Bitcoin, bar: Number(btcDValue) || 0 },
    { key: "fng", label: "F&G", value: `${fngValue}`, mono: true, icon: Gauge, pill: fngLabel },
    { key: "mood", label: t.home.market, value: moodKey, mono: false, icon: Activity }
  ].filter(Boolean);
  // Prefer a fact-based insight computed from this user's own journal (analytics.insights are
  // always backed by a real sample) over the two hardcoded generic sentences.
  const localInsight = (analytics.insights || []).find((i) => i && i.text)?.text || null;
  const withR = resultEntriesForUnit(entries, measureMode, currency);
  const excludedResultCount = countExcludedResultEntries(entries, measureMode, currency);
  const cumResult = withR.reduce((s, e) => s + e.r, 0);
  const heroTarget = measureMode === "currency" ? startingCapital + cumResult : cumResult;
  const sparkPoints = useMemo(() => {
    const sorted = [...withR].sort((a, b) => a.date - b.date);
    let cum = measureMode === "currency" ? startingCapital : 0;
    return sorted.map((e) => {
      cum += e.r;
      return cum;
    }).slice(-10);
  }, [withR, measureMode, startingCapital]);
  const consciousScore = Math.round(useAnimatedNumber(consciousScoreTarget));
  const animatedStreak = Math.round(useAnimatedNumber(streak));
  const animatedHero = useAnimatedNumber(heroTarget);
  const tiles = [
    { id: "new", label: t.home.newEntryTile, icon: BookOpen, primary: true },
    { id: "log", label: t.home.logTile, icon: NotebookText },
    { id: "patterns", label: t.home.patternsTile, icon: LineChartIcon }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-7", children: [
      /* @__PURE__ */ jsx("span", { className: "sec-cap text-[10px] block mb-3", style: { color: BASE.inkFaint }, children: measureMode === "currency" ? t.home.capital : t.home.totalResult }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-end justify-between gap-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[38px] leading-none mb-2", style: { fontFamily: "var(--font-mono)", color: BASE.ink, fontWeight: 500, letterSpacing: "-0.02em" }, children: measureMode === "currency" ? formatBalance(animatedHero, currency) : formatResult(animatedHero, "R", currency) }),
          measureMode === "currency" && /* @__PURE__ */ jsxs("span", { className: "text-[13px]", style: { color: cumResult >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: [
            formatResult(cumResult, "currency", currency),
            " ",
            t.home.sinceStart
          ] })
        ] }),
        sparkPoints.length >= 2 && /* @__PURE__ */ jsx("div", { className: "shrink-0 pb-1", children: /* @__PURE__ */ jsx(Sparkline, { points: sparkPoints, color: cumResult >= 0 ? WIN : LOSS, width: 96, height: 34 }) })
      ] }),
      excludedResultCount > 0 && /* @__PURE__ */ jsx("div", {
        className: "text-[10px] mt-2",
        style: { color: BASE.inkFaint },
        children: lang === "en"
          ? `${excludedResultCount} result${excludedResultCount === 1 ? "" : "s"} in another unit are not included`
          : `${excludedResultCount} ${pluralRu(excludedResultCount, "результат в другой единице не учитывается", "результата в другой единице не учитываются", "результатов в другой единице не учитываются")}`
      })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:columns-2 lg:gap-4", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => goTo("calibration"),
        className: "w-full flex items-center justify-between px-4 py-3.5 rounded-[22px] mb-3 text-left transition-all duration-200 active:scale-[0.98] break-inside-avoid",
        style: { border: "none", background: calibratedToday ? BASE.surface : BASE.surface2 },
        children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: [
            /* @__PURE__ */ jsx(Gauge, { size: 15, style: { color: calibratedToday ? lastCalibration.tierColor : accent } }),
            calibratedToday ? t.home.calibrationToday(lastCalibration.pct) : t.home.calibrationCta
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { size: 15, style: { color: BASE.inkFaint } })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Card, { accent, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[11px]", style: { color: BASE.inkDim, fontFamily: "var(--font-display)" }, children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 12, style: { color: accent } }),
          " ",
          t.home.insight
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* V5.1: the manual refresh control was rendered only when a trading asset had been picked
             in Settings, so for anyone who never set one it simply wasn't there \u2014 which reads as
             \"\u0440\u0443\u0447\u043D\u043E\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u043E\u043F\u0430\u043B\u043E\". It is always visible now, with a real 28px tap target, and
             explains itself instead of doing nothing when no asset is selected. */
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: refreshInsight,
              disabled: marketRefreshing || adviceLoading,
              title: t.home.marketRefresh,
              "aria-label": t.home.marketRefresh,
              className: "flex items-center justify-center w-7 h-7 -m-1 rounded-full transition-all active:scale-90",
              style: { color: accent, opacity: marketRefreshing || adviceLoading ? 0.45 : 0.85 },
              children: /* @__PURE__ */ jsx(RotateCcw, { size: 13, className: marketRefreshing || adviceLoading ? "animate-spin" : void 0 })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full animate-pulse", style: { background: accent } })
        ] })
      ] }),
      /* V0.4 — текст карточки: совет по собственному журналу. Пока Gemini отвечает (или если он
         недоступен) показывается локальный инсайт из аналитики — он всегда посчитан по реальным
         данным, поэтому подмены фактов не происходит. */
      /* V2.1 — скелетон показывается ТОЛЬКО когда показать действительно нечего: нет ни
         ответа Gemini, ни локального инсайта, ни записей. Если локальный инсайт есть, он
         выводится сразу — он посчитан по реальным данным, и подменять его серыми полосами
         значило бы прятать готовую информацию ради анимации. */
      adviceLoading && !homeAdvice && !localInsight && total === 0 ? /* @__PURE__ */ jsx("div", { className: "py-1", children: /* @__PURE__ */ jsx(SkeletonLines, { lines: 3 }) }) : /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed content-in", style: { color: BASE.ink }, children: homeAdvice || localInsight || (total >= 4 ? t.home.insightConfident : t.home.insightFocus) }, homeAdvice ? "ai" : "local")
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 divide-x", style: { borderColor: BASE.line }, children: [
        /* @__PURE__ */ jsxs("div", { className: "pr-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1", style: { color: BASE.inkFaint }, children: t.home.traderLevel }),
          /* @__PURE__ */ jsx("div", { className: "text-[24px] leading-none", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 500 }, children: level })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pl-4", style: { borderLeft: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide mb-1", style: { color: BASE.inkFaint }, children: t.home.awareness }),
          /* @__PURE__ */ jsxs("div", { className: "text-[24px] leading-none", style: { fontFamily: "var(--font-display)", color: accent, fontWeight: 500 }, children: [
            consciousScore,
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mt-3 mb-2.5", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${consciousScore}%`, background: accent } }) }),
      total > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 flex-wrap text-[10px]", style: { color: BASE.inkFaint }, children: [
        reflectionScore != null && /* @__PURE__ */ jsxs("span", { children: [
          t.home.reflection,
          " ",
          reflectionScore,
          "%"
        ] }),
        reflectionScore != null && (disciplineScore != null || riskStabilityScore != null) && /* @__PURE__ */ jsx("span", { children: "\xB7" }),
        disciplineScore != null && /* @__PURE__ */ jsxs("span", { children: [
          t.home.discipline,
          " ",
          disciplineScore,
          "%"
        ] }),
        disciplineScore != null && riskStabilityScore != null && /* @__PURE__ */ jsx("span", { children: "\xB7" }),
        riskStabilityScore != null && /* @__PURE__ */ jsxs("span", { children: [
          t.home.riskStability,
          " ",
          riskStabilityScore,
          "%"
        ] }),
        calibratedToday && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { children: "\xB7" }),
          /* @__PURE__ */ jsxs("span", { style: { color: lastCalibration.tierColor }, children: [
            t.home.calibrationTodayShort,
            " ",
            lastCalibration.pct,
            "%"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-3 mt-3", style: { borderTop: `1px solid ${BASE.line}` }, children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => goTo("challenge"), className: "flex items-center gap-1.5 text-xs transition-transform duration-150 active:scale-95", style: { color: BASE.inkDim }, children: [
          /* @__PURE__ */ jsx(Flame, { size: 13, className: streak > 0 ? "flame-flicker" : "", style: { color: streak > 0 ? "#D98A4A" : BASE.inkFaint } }),
          streak > 0 ? t.home.streakDays(animatedStreak) : t.home.startStreak
        ] }),
        /* @__PURE__ */ jsx(WeekDots, { week, accent })
      ] })
    ] }),
    traderPatterns.available ? traderPatterns.primaryPattern ? /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: t.pattern.yourPattern }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] px-2 py-0.5 rounded-full", style: { color: accent, border: `1px solid ${accent}40` }, children: traderPatterns.primaryPattern.confidence === "high" ? t.pattern.strongSignal : traderPatterns.primaryPattern.confidence === "medium" ? t.pattern.observedPattern : t.pattern.someSigns })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-base mb-1.5", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 600 }, children: traderPatterns.primaryPattern.title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
        /* @__PURE__ */ jsx("span", { children: t.pattern.trades(traderPatterns.primaryPattern.stats.trades) }),
        /* @__PURE__ */ jsxs("span", { children: [
          traderPatterns.primaryPattern.stats.winRate,
          "% ",
          t.pattern.winShort
        ] }),
        /* @__PURE__ */ jsxs("span", { style: { color: traderPatterns.primaryPattern.stats.avgR >= 0 ? WIN : LOSS }, children: [
          formatResult(traderPatterns.primaryPattern.stats.avgR ?? 0, "R", currency),
          " ",
          t.pattern.avgShort
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-3", style: { color: BASE.inkDim }, children: traderPatterns.primaryPattern.description }),
      /* @__PURE__ */ jsx("button", { onClick: () => setPatternOpen(true), className: "text-sm transition-transform duration-150 active:scale-95", style: { color: accent, fontFamily: "var(--font-display)", fontWeight: 500 }, children: t.pattern.breakdown })
    ] }) : traderPatterns.healthyPatterns.length > 0 ? /* @__PURE__ */ jsxs(Card, { accent, className: "mb-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: t.pattern.yourPattern }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] px-2 py-0.5 rounded-full", style: { color: WIN, border: `1px solid ${WIN}40` }, children: t.pattern.strength })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-base mb-1.5", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 600 }, children: traderPatterns.healthyPatterns[0].title }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
        /* @__PURE__ */ jsx("span", { children: t.pattern.trades(traderPatterns.healthyPatterns[0].stats.trades) }),
        /* @__PURE__ */ jsxs("span", { children: [
          traderPatterns.healthyPatterns[0].stats.winRate,
          "% ",
          t.pattern.winShort
        ] }),
        /* @__PURE__ */ jsxs("span", { style: { color: WIN }, children: [
          formatResult(traderPatterns.healthyPatterns[0].stats.avgR ?? 0, "R", currency),
          " ",
          t.pattern.avgShort
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.inkDim }, children: traderPatterns.healthyPatterns[0].description })
    ] }) : /* @__PURE__ */ jsxs(Card, { className: "mb-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-1.5", style: { color: BASE.inkFaint }, children: t.pattern.yourPattern }),
      /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.inkDim }, children: t.pattern.noClearPattern })
    ] }) : /* @__PURE__ */ jsxs(Card, { className: "mb-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-1.5", style: { color: BASE.inkFaint }, children: t.pattern.yourPattern }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-2", style: { color: BASE.ink }, children: t.pattern.buildingUp(traderPatterns.sampleSize, traderPatterns.needed) }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-2", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${Math.min(100, traderPatterns.sampleSize / traderPatterns.needed * 100)}%`, background: accent } }) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed", style: { color: BASE.inkFaint }, children: t.pattern.buildingUpDesc })
    ] }),
    patternOpen && traderPatterns.primaryPattern && /* @__PURE__ */ jsx(TraderPatternDetail, { pattern: traderPatterns.primaryPattern, accent, currency, onClose: () => setPatternOpen(false), t, lang }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 mb-3 break-inside-avoid", children: tiles.map((tile) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => goTo(tile.id),
        className: "flex items-center justify-between px-4 py-3.5 rounded-2xl text-left transition-all duration-200 active:scale-[0.98]",
        style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: BASE.ink },
        children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { fontFamily: "var(--font-display)" }, children: [
            /* @__PURE__ */ jsx(tile.icon, { size: 15, style: { color: tile.primary ? accent : BASE.inkDim } }),
            " ",
            tile.label
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { size: 15, style: { color: BASE.inkFaint } })
        ]
      },
      tile.id
    )) })
    ] }),
    /* V1.5 — три колонки в ряд не помещались на телефоне: «Волатильный» ломался посреди
       слова, а пилюля с настроением уезжала в две строки. Значения тут разной природы —
       число, число с текстовой меткой и просто слово — и равные узкие колонки для них не
       подходят. Теперь это список строк: слева иконка и подпись, справа значение, которому
       больше не приходится втискиваться в треть ширины. Данные и их источник прежние. */
    /* @__PURE__ */ jsx("div", { className: "pt-3.5", children: /* @__PURE__ */ jsx("div", { className: "rounded-2xl px-4 py-1", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: marketCells.map((m, i) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "py-3",
        style: i === 0 ? void 0 : { borderTop: `1px solid ${BASE.line}` },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 shrink-0", children: [
              /* @__PURE__ */ jsx("span", { className: "shrink-0 flex items-center justify-center rounded-full", style: { width: 26, height: 26, border: `1px solid ${BASE.line}`, background: BASE.surface2 }, children: /* @__PURE__ */ jsx(m.icon, { size: 13, style: { color: BASE.inkDim } }) }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-[0.12em]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: m.label })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "min-w-0 text-right", children: [
              /* @__PURE__ */ jsx("span", { className: "block text-[17px] leading-tight", style: { color: BASE.ink, fontFamily: m.mono ? "var(--font-mono)" : "var(--font-display)", fontWeight: 600 }, children: m.value }),
              m.pill && /* @__PURE__ */ jsx("span", { className: "block text-[11px] leading-snug mt-0.5", style: { color: BASE.inkDim }, children: m.pill })
            ] })
          ] }),
          m.bar !== void 0 && /* @__PURE__ */ jsx("div", { className: "w-full h-[3px] rounded-full mt-2.5", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-[3px] rounded-full transition-all duration-700 ease-out", style: { width: `${Math.max(0, Math.min(100, m.bar))}%`, background: accent } }) })
        ]
      },
      m.key
    )) }) })
  ] });
}
function TraderPatternDetail({ pattern, accent, currency, onClose, t, lang }) {
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-end justify-center", onClick: onClose, style: { background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }, children: /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: (e) => e.stopPropagation(),
      className: "w-full max-w-md rounded-t-[28px] px-5 pt-4 pb-8 vscroll",
      style: { background: BASE.surface, border: `1px solid ${BASE.line}`, borderBottom: "none", maxHeight: "88vh", overflowY: "auto", animation: "riseIn 0.28s ease-out" },
      children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4", style: { width: 36, height: 4, borderRadius: 2, background: BASE.line } }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide", style: { color: BASE.inkFaint }, children: t.pattern.detailTitle }),
          /* @__PURE__ */ jsx("button", { onClick: onClose, className: "p-1 -m-1", children: /* @__PURE__ */ jsx(XIcon, { size: 16, style: { color: BASE.inkFaint } }) })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl mb-2", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 600 }, children: pattern.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed mb-4", style: { color: BASE.inkDim }, children: pattern.description }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.pattern.tradesLabel }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: pattern.stats.trades })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.pattern.winRateLabel }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: [
              pattern.stats.winRate,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.pattern.avgRLabel }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: (pattern.stats.avgR ?? 0) >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: formatResult(pattern.stats.avgR ?? 0, "R", currency) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.pattern.comparison }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink }, children: t.pattern.similarSituations }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: (pattern.stats.avgR ?? 0) >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: formatResult(pattern.stats.avgR ?? 0, "R", currency) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-1", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.inkFaint }, children: t.pattern.otherTrades }),
            /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: (pattern.comparisonStats.avgR ?? 0) >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: formatResult(pattern.comparisonStats.avgR ?? 0, "R", currency) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.pattern.whereOnMap }),
        /* @__PURE__ */ jsx("div", { style: { width: "100%", height: 220 }, className: "mb-4", children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(ScatterChart, { margin: { top: 10, right: 10, bottom: 20, left: 0 }, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: BASE.line }),
          /* @__PURE__ */ jsx(
            XAxis,
            {
              type: "number",
              dataKey: "x",
              domain: [0, 100],
              tick: { fill: BASE.inkFaint, fontSize: 10 },
              stroke: BASE.line,
              label: { value: t.pattern.fearToConfidence, position: "insideBottom", offset: -10, fill: BASE.inkFaint, fontSize: 10 }
            }
          ),
          /* @__PURE__ */ jsx(
            YAxis,
            {
              type: "number",
              dataKey: "y",
              domain: [0, 100],
              reversed: true,
              tick: { fill: BASE.inkFaint, fontSize: 10 },
              stroke: BASE.line,
              label: { value: t.pattern.nervousToCalm, angle: -90, position: "insideLeft", fill: BASE.inkFaint, fontSize: 10 }
            }
          ),
          /* @__PURE__ */ jsx(ZAxis, { range: [70, 70] }),
          /* @__PURE__ */ jsx(Scatter, { data: pattern.comparisonStats._trades || [], fill: BASE.line, isAnimationActive: false }),
          /* @__PURE__ */ jsx(Scatter, { data: pattern.stats._trades || [], isAnimationActive: false, children: (pattern.stats._trades || []).map((t2) => /* @__PURE__ */ jsx(Cell, { fill: accent }, t2.id)) })
        ] }) }) }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.pattern.tradeExamples }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 mb-4", children: pattern.sampleTrades.map((tr) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm py-1.5", style: { borderBottom: `1px solid ${BASE.line}` }, children: [
          /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { background: outcomeColor(tr.outcome) } }),
          /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, className: "text-xs shrink-0", children: tr.date.toLocaleDateString(lang === "en" ? "en-US" : "ru-RU", { day: "2-digit", month: "2-digit" }) }),
          /* @__PURE__ */ jsx("span", { style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, className: "shrink-0", children: tr.instrument }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs shrink-0", style: { color: BASE.inkFaint }, children: [
            "x",
            Math.round(tr.x),
            " y",
            Math.round(tr.y)
          ] }),
          hasRealizedRR(tr) && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0", style: { color: outcomeColor(tr.outcome), fontFamily: "var(--font-mono)" }, children: formatResult(tr.realizedRR, "R", currency) })
        ] }, tr.id)) }),
        /* @__PURE__ */ jsxs(Card, { className: "mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide block mb-2", style: { color: BASE.inkFaint }, children: t.pattern.whyShown }),
          /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: t.pattern.whyShownText(pattern.evidenceCount, formatResult(pattern.stats.avgR ?? 0, "R", currency), formatResult(pattern.comparisonStats.avgR ?? 0, "R", currency)) })
        ] })
      ]
    }
  ) });
}
// V1.4 — блок «Эмоции» в аналитике. Раньше там был скаттер: каждая сделка точкой в
// координатах страх→уверенность / нервы→спокойствие. Читать его было нечем — точки не
// подписаны, никакого вывода из облака не следует, а после перехода на процентные шкалы
// оси вообще стали производной величиной. Вместо него считается прямое сравнение: при
// какой эмоции результат в среднем лучше, а при какой хуже.
//
// Порог 60/40 — намеренно с зазором: сделки, где эмоция отмечена в середине, не попадают
// ни в одну группу, иначе сравнение размывается пограничными случаями.
var EMOTION_IMPACT_HIGH = 60;
var EMOTION_IMPACT_LOW = 40;
var EMOTION_IMPACT_MIN = 3;
function ei_avg(rows) {
  return rows.length ? rows.reduce((sum, x) => sum + x.r, 0) / rows.length : null;
}
// labels передаются явно, а не берутся из t: этой же статистикой пользуется «Разбор»,
// который знает только lang и не имеет доступа к объекту переводов экрана записи.
function emotionImpactStats(entries, labelList) {
  const keys = emotionScaleKeys("entry");
  const labels = Array.isArray(labelList) && labelList.length === keys.length ? labelList : keys;
  // У записей до V1.1 процентов нет — для них проценты восстанавливаются из осей, иначе
  // блок был бы пустым у всех, кто вёл журнал раньше. Восстановление приблизительное
  // (см. pointToEmotions), поэтому доля таких сделок показывается отдельно.
  const rows = (entries || []).filter((e) => typeof e.r === "number" && !isNaN(e.r)).map((e) => {
    const exact = normalizeEmotions(e.emotions, "entry");
    return { r: e.r, v: exact || pointToEmotions(e.x, e.y, "entry"), exact: !!exact };
  }).filter((x) => x.v);
  if (rows.length < EMOTION_IMPACT_MIN * 2) {
    return { available: false, reason: "few_trades", sample: rows.length, needed: EMOTION_IMPACT_MIN * 2 };
  }
  // V1.8 — allScales считается ДО фильтра по размеру групп. Раньше отфильтрованные шкалы
  // просто исчезали, и блок показывал сообщение про нехватку сделок даже когда сделок
  // хватало: причина была другой — ни в одной шкале не набиралось по 3 сделки в обеих
  // группах сразу. Теперь эти числа доступны UI, и он может объяснить, чего не хватает.
  const allScales = keys.map((key, i) => {
    const high = rows.filter((x) => emotionClampPct(x.v[key]) >= EMOTION_IMPACT_HIGH);
    const low = rows.filter((x) => emotionClampPct(x.v[key]) <= EMOTION_IMPACT_LOW);
    return { key, label: labels[i], highN: high.length, lowN: low.length, highAvg: ei_avg(high), lowAvg: ei_avg(low) };
  });
  const scales = allScales.filter((s2) => s2.highN >= EMOTION_IMPACT_MIN && s2.lowN >= EMOTION_IMPACT_MIN).map((s2) => ({ ...s2, diff: s2.highAvg - s2.lowAvg })).sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff));
  const withConflict = rows.map((x) => ({ ...x, c: emotionConflict(x.v, "entry").max }));
  const mixed = withConflict.filter((x) => x.c >= 40);
  const clear = withConflict.filter((x) => x.c < 40);
  const conflict = mixed.length >= EMOTION_IMPACT_MIN && clear.length >= EMOTION_IMPACT_MIN ? { mixedN: mixed.length, clearN: clear.length, mixedAvg: ei_avg(mixed), clearAvg: ei_avg(clear) } : null;
  const available = scales.length > 0 || !!conflict;
  return {
    available,
    reason: available ? null : "no_groups",
    sample: rows.length,
    approxCount: rows.filter((x) => !x.exact).length,
    allScales,
    scales,
    conflict
  };
}
// Одна строка сравнения: подпись, число сделок и средний результат столбиком в обе
// стороны от общей базовой линии. Ширина считается от максимума по всему блоку, чтобы
// строки были сопоставимы между собой, а не каждая в своём масштабе.
function EmotionImpactRow({ label, count, avg, scale, measureMode, currency }) {
  const pct = scale > 0 ? Math.min(100, Math.abs(avg) / scale * 100) : 0;
  const positive = avg >= 0;
  const color = positive ? WIN : LOSS;
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 py-1", children: [
    /* @__PURE__ */ jsx("span", { className: "text-[11px] shrink-0 text-right", style: { color: BASE.inkDim, width: 62 }, children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative flex-1 h-4", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 bottom-0 w-px left-1/2", style: { background: BASE.line } }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute top-1/2 -translate-y-1/2 h-2 rounded-full",
          style: { width: `${pct / 2}%`, background: color, opacity: 0.85, left: positive ? "50%" : void 0, right: positive ? void 0 : "50%" }
        }
      )
    ] }),
    /* @__PURE__ */ jsx("span", { className: "text-[11px] shrink-0 text-right", style: { color, fontFamily: "var(--font-mono)", width: 54 }, children: formatResult(avg, measureMode, currency) }),
    /* @__PURE__ */ jsxs("span", { className: "text-[10px] shrink-0 text-right", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)", width: 26 }, children: [
      "\u00D7",
      count
    ] })
  ] });
}
function EmotionImpact({ stats, measureMode, currency }) {
  if (!stats.available) {
    // V1.8 — два РАЗНЫХ случая, которые раньше показывали один и тот же текст. Отсюда и
    // брался абсурд «нужно минимум 6, сейчас 6»: сделок хватало, не хватало разброса.
    if (stats.reason === "few_trades") {
      return /* @__PURE__ */ jsxs("p", { className: "text-sm leading-relaxed", style: { color: BASE.inkFaint }, children: [
        "\u041D\u0443\u0436\u043D\u043E \u043C\u0438\u043D\u0438\u043C\u0443\u043C ",
        stats.needed || EMOTION_IMPACT_MIN * 2,
        " \u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A \u0441 \u043E\u0442\u043C\u0435\u0447\u0435\u043D\u043D\u044B\u043C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435\u043C. \u0421\u0435\u0439\u0447\u0430\u0441 ",
        stats.sample || 0,
        "."
      ] });
    }
    return /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("p", { className: "text-[13px] leading-relaxed mb-3", style: { color: BASE.inkDim }, children: [
        "\u0421\u0434\u0435\u043B\u043E\u043A \u0445\u0432\u0430\u0442\u0430\u0435\u0442 (",
        stats.sample,
        "), \u043D\u043E \u0441\u0440\u0430\u0432\u043D\u0438\u0432\u0430\u0442\u044C \u043F\u043E\u043A\u0430 \u043D\u0435 \u0441 \u0447\u0435\u043C: \u043D\u0438 \u043F\u043E \u043E\u0434\u043D\u043E\u0439 \u0448\u043A\u0430\u043B\u0435 \u043D\u0435 \u043D\u0430\u0431\u0440\u0430\u043B\u043E\u0441\u044C \u043F\u043E ",
        EMOTION_IMPACT_MIN,
        " \u0441\u0434\u0435\u043B\u043A\u0438 \u0441 \u0432\u044B\u0441\u043E\u043A\u043E\u0439 \u0438 \u0441 \u043D\u0438\u0437\u043A\u043E\u0439 \u044D\u043C\u043E\u0446\u0438\u0435\u0439 \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E."
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1.5 mb-3", children: (stats.allScales || []).map((sc) => /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[12px] truncate", style: { color: BASE.inkDim }, children: sc.label }),
        /* @__PURE__ */ jsxs("span", { className: "text-[11px] shrink-0", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
          `\u043E\u0442 ${EMOTION_IMPACT_HIGH}%: `,
          sc.highN,
          `  \u00B7  \u0434\u043E ${EMOTION_IMPACT_LOW}%: `,
          sc.lowN
        ] })
      ] }, sc.key)) }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] leading-relaxed", style: { color: BASE.inkFaint }, children: "\u0421\u0435\u0440\u0435\u0434\u0438\u043D\u0430 \u0448\u043A\u0430\u043B\u044B (41\u201359%) \u043D\u0430\u043C\u0435\u0440\u0435\u043D\u043D\u043E \u043D\u0435 \u043F\u043E\u043F\u0430\u0434\u0430\u0435\u0442 \u043D\u0438 \u0432 \u043E\u0434\u043D\u0443 \u0433\u0440\u0443\u043F\u043F\u0443 \u2014 \u0438\u043D\u0430\u0447\u0435 \u0441\u0440\u0430\u0432\u043D\u0435\u043D\u0438\u0435 \u0440\u0430\u0437\u043C\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u043E\u0433\u0440\u0430\u043D\u0438\u0447\u043D\u044B\u043C\u0438 \u0441\u043B\u0443\u0447\u0430\u044F\u043C\u0438. \u0411\u043B\u043E\u043A \u0437\u0430\u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442, \u043A\u043E\u0433\u0434\u0430 \u043D\u0430\u043A\u043E\u043F\u044F\u0442\u0441\u044F \u0441\u0434\u0435\u043B\u043A\u0438 \u0441 \u0440\u0430\u0437\u043D\u044B\u043C\u0438 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F\u043C\u0438." })
    ] });
  }
  const all = [];
  stats.scales.forEach((s) => all.push(s.highAvg, s.lowAvg));
  if (stats.conflict) all.push(stats.conflict.mixedAvg, stats.conflict.clearAvg);
  const scale = Math.max(0.01, ...all.map((v) => Math.abs(v || 0)));
  return /* @__PURE__ */ jsxs("div", { children: [
    stats.scales.map((s) => /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline justify-between mb-1", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[13px]", style: { color: BASE.ink }, children: s.label }),
        /* @__PURE__ */ jsxs("span", { className: "text-[11px]", style: { color: s.diff >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: [
          s.diff >= 0 ? "+" : "\u2212",
          Math.abs(s.diff).toFixed(2),
          "R \u0440\u0430\u0437\u043D\u0438\u0446\u0430"
        ] })
      ] }),
      /* @__PURE__ */ jsx(EmotionImpactRow, { label: `\u043E\u0442 ${EMOTION_IMPACT_HIGH}%`, count: s.highN, avg: s.highAvg, scale, measureMode, currency }),
      /* @__PURE__ */ jsx(EmotionImpactRow, { label: `\u0434\u043E ${EMOTION_IMPACT_LOW}%`, count: s.lowN, avg: s.lowAvg, scale, measureMode, currency })
    ] }, s.key)),
    stats.conflict && /* @__PURE__ */ jsxs("div", { className: "pt-3", style: { borderTop: `1px solid ${BASE.line}` }, children: [
      /* @__PURE__ */ jsx("span", { className: "text-[13px] block mb-1", style: { color: BASE.ink }, children: "\u0421\u043C\u0435\u0448\u0430\u043D\u043D\u043E\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435" }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] mb-1.5 leading-relaxed", style: { color: BASE.inkFaint }, children: "\u0421\u0434\u0435\u043B\u043A\u0438, \u0433\u0434\u0435 \u043F\u0440\u043E\u0442\u0438\u0432\u043E\u043F\u043E\u043B\u043E\u0436\u043D\u044B\u0435 \u044D\u043C\u043E\u0446\u0438\u0438 \u043E\u0442\u043C\u0435\u0447\u0435\u043D\u044B \u043E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u2014 \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 \u0443\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u0441\u0442\u044C \u0432\u043C\u0435\u0441\u0442\u0435 \u0441\u043E \u0441\u0442\u0440\u0430\u0445\u043E\u043C." }),
      /* @__PURE__ */ jsx(EmotionImpactRow, { label: "\u0441\u043C\u0435\u0448\u0430\u043D\u043D\u043E", count: stats.conflict.mixedN, avg: stats.conflict.mixedAvg, scale, measureMode, currency }),
      /* @__PURE__ */ jsx(EmotionImpactRow, { label: "\u043E\u0434\u043D\u043E\u0437\u043D\u0430\u0447\u043D\u043E", count: stats.conflict.clearN, avg: stats.conflict.clearAvg, scale, measureMode, currency })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-[11px] mt-3 leading-relaxed", style: { color: BASE.inkFaint }, children: [
      "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043F\u043E ",
      stats.sample,
      " \u0441\u0434\u0435\u043B\u043A\u0430\u043C. \u0413\u0440\u0443\u043F\u043F\u044B \u043F\u0435\u0440\u0435\u0441\u0435\u043A\u0430\u044E\u0442\u0441\u044F: \u043E\u0434\u043D\u0430 \u0441\u0434\u0435\u043B\u043A\u0430 \u043F\u043E\u043F\u0430\u0434\u0430\u0435\u0442 \u0432 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0448\u043A\u0430\u043B \u0441\u0440\u0430\u0437\u0443.",
      stats.approxCount > 0 ? ` \u0423 ${stats.approxCount} \u0441\u0434\u0435\u043B\u043E\u043A \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E \u0438\u0437 \u0441\u0442\u0430\u0440\u043E\u0433\u043E \u0444\u043E\u0440\u043C\u0430\u0442\u0430 \u043F\u0440\u0438\u0431\u043B\u0438\u0437\u0438\u0442\u0435\u043B\u044C\u043D\u043E.` : ""
    ] })
  ] });
}
// V2.0 — дизайн-проход, этап 2: пустые состояния. До этого их не существовало как
// сущности: там, где данных нет, стояла одинокая серая строка или вообще ничего. Это
// первое, что видит новый пользователь, и именно оно создаёт впечатление незаконченности.
//
// Компонент даёт всем таким местам одну форму: иконка в круге, короткий заголовок, одно
// поясняющее предложение и — там, где действие очевидно — кнопка. Тексты передаются
// вызывающим, компонент ничего не придумывает сам.
// V2.1 — дизайн-проход, этап 3: скелетоны. Пока данные едут, экран был пустым и потом
// резко наполнялся. Скелетон повторяет ФОРМУ будущего содержимого, а не абстрактный
// прямоугольник, — иначе он не снимает ощущение пустоты, а добавляет мельтешения.
function TagBars({ data, measureMode, currency }) {
  const maxAbs = Math.max(...data.map((d) => Math.abs(d.totalR != null ? d.totalR : d.avgR)), 0.1);
  return /* @__PURE__ */ jsx("div", { className: "space-y-2.5", children: data.map((d) => {
    const result = d.totalR != null ? d.totalR : d.avgR;
    const positive = result >= 0;
    const width = Math.max(6, Math.abs(result) / maxAbs * 100);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: "rounded-[18px] px-3.5 py-3",
        style: { background: BASE.surface2, border: `1px solid ${BASE.line}` },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-2.5", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[15px] truncate", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: d.tag }),
              /* @__PURE__ */ jsx("div", { className: "text-[10px] mt-1", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: `${d.count} ${pluralRu(d.count, "сделка", "сделки", "сделок")}` })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "shrink-0 text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "text-[15px] leading-none", style: { color: positive ? WIN : LOSS, fontFamily: "var(--font-mono)", fontWeight: 500 }, children: formatResult(result, measureMode, currency) }),
              /* @__PURE__ */ jsxs("div", { className: "text-[10px] mt-1", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
                "ср. ",
                formatResult(d.avgR, measureMode, currency),
                " / сделку"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full h-[6px] rounded-full overflow-hidden", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-[6px] rounded-full transition-all duration-500 ease-out", style: { width: `${width}%`, background: positive ? WIN : LOSS, boxShadow: `0 0 18px ${positive ? WIN : LOSS}33` } }) })
        ]
      },
      d.tag
    );
  }) });
}
function CalendarView({ entries, accent, measureMode, currency, t }) {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const entriesByDate = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      const key = e.date.toDateString();
      (map[key] = map[key] || []).push(e);
    });
    return map;
  }, [entries]);
  const cells = useMemo(() => {
    const year = viewMonth.getFullYear(), month = viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < startOffset; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    return arr;
  }, [viewMonth]);
  const dayColor = (date) => {
    const dayEntries = entriesByDate[date.toDateString()];
    if (!dayEntries?.length) return null;
    const resultEntries = resultEntriesForUnit(dayEntries, measureMode, currency);
    if (!resultEntries.length) return BASE.inkDim;
    const netR = resultEntries.reduce((s, e) => s + e.r, 0);
    if (netR > 0) return WIN;
    if (netR < 0) return LOSS;
    return BASE.inkDim;
  };
  const selectedEntries = selectedDate ? entriesByDate[selectedDate.toDateString()] || [] : [];
  const selectedResultEntries = resultEntriesForUnit(selectedEntries, measureMode, currency);
  const selectedNet = selectedResultEntries.reduce((s, e) => s + e.r, 0);
  const daySummary = useMemo(
    () => calculateCalendarStats(selectedEntries, selectedEntries.filter(isEntryClosed), measureMode, currency),
    [selectedEntries, measureMode, currency]
  );
  const monthLabel = viewMonth.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
  const weekdayLabels = ["\u041F\u043D", "\u0412\u0442", "\u0421\u0440", "\u0427\u0442", "\u041F\u0442", "\u0421\u0431", "\u0412\u0441"];
  const changeMonth = (delta) => {
    setSelectedDate(null);
    setViewMonth((prev) => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + delta);
      return d;
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "tab-content max-w-md mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => changeMonth(-1), className: "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-150 active:scale-90", style: { border: `1px solid ${BASE.line}` }, children: /* @__PURE__ */ jsx(ChevronLeft, { size: 14, style: { color: BASE.inkDim } }) }),
      /* @__PURE__ */ jsx("span", { className: "text-sm capitalize", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: monthLabel }),
      /* @__PURE__ */ jsx("button", { onClick: () => changeMonth(1), className: "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-150 active:scale-90", style: { border: `1px solid ${BASE.line}` }, children: /* @__PURE__ */ jsx(ChevronRight, { size: 14, style: { color: BASE.inkDim } }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1.5 mb-1", children: weekdayLabels.map((w) => /* @__PURE__ */ jsx("div", { className: "text-center text-[10px]", style: { color: BASE.inkFaint }, children: w }, w)) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-1.5 mb-4", children: cells.map((date, i) => {
      if (!date) return /* @__PURE__ */ jsx("div", {}, i);
      const color = dayColor(date);
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const isTodayCell = date.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
      return /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setSelectedDate(date),
          className: "aspect-square rounded-lg flex items-center justify-center text-xs transition-all duration-150 active:scale-90",
          style: {
            background: color ? `${color}18` : BASE.surface,
            border: `1px solid ${isSelected ? accent : color ? color + "50" : BASE.line}`,
            color: color || BASE.inkDim,
            boxShadow: isTodayCell ? `0 0 0 1px ${accent}60 inset` : "none"
          },
          children: date.getDate()
        },
        i
      );
    }) }),
    selectedDate ? /* @__PURE__ */ jsxs(Card, { accent, glowing: selectedEntries.length > 0, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: selectedDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long" }) }),
        selectedEntries.length > 0 && /* @__PURE__ */ jsx("span", {
          className: "text-xs",
          style: { color: selectedResultEntries.length ? selectedNet >= 0 ? WIN : LOSS : BASE.inkFaint, fontFamily: "var(--font-mono)" },
          children: selectedResultEntries.length ? formatResult(selectedNet, measureMode, currency) : "\u2014"
        })
      ] }),
      selectedEntries.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: "\u0421\u0434\u0435\u043B\u043E\u043A \u0432 \u044D\u0442\u043E\u0442 \u0434\u0435\u043D\u044C \u043D\u0435 \u0431\u044B\u043B\u043E." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: "\u0421\u0434\u0435\u043B\u043E\u043A" }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: selectedEntries.length })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsx("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: t.home.wlbe }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: [
              daySummary.wins,
              "/",
              daySummary.losses,
              "/",
              daySummary.breakevens
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg px-2 py-2 text-center", style: { background: BASE.surface2, border: `1px solid ${BASE.line}` }, children: [
            /* @__PURE__ */ jsxs("div", { className: "text-[9px] uppercase tracking-wide mb-0.5", style: { color: BASE.inkFaint }, children: [
              "\u0421\u0440. ",
              unitSymbol(measureMode, currency)
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-sm", style: { color: daySummary.avgR >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: formatResult(daySummary.avgR, measureMode, currency) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1 mb-3 text-xs", children: [
          daySummary.topInstrument && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442" }),
            /* @__PURE__ */ jsxs("span", { style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: [
              daySummary.topInstrument.value,
              daySummary.topInstrument.count > 1 ? ` \xD7${daySummary.topInstrument.count}` : ""
            ] })
          ] }),
          daySummary.topTag && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u0441\u0435\u0442\u0430\u043F" }),
            /* @__PURE__ */ jsxs("span", { style: { color: BASE.ink }, children: [
              daySummary.topTag.value,
              daySummary.topTag.count > 1 ? ` \xD7${daySummary.topTag.count}` : ""
            ] })
          ] }),
          daySummary.mood && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkFaint }, children: "\u042D\u043C\u043E\u0446\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0444\u043E\u043D" }),
            /* @__PURE__ */ jsx("span", { style: { color: daySummary.moodColor }, children: daySummary.mood })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "pt-3 space-y-2", style: { borderTop: `1px solid ${BASE.line}` }, children: selectedEntries.map((e) => /* @__PURE__ */ jsxs("div", { className: "text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { background: outcomeColor(e.outcome) } }),
            /* @__PURE__ */ jsx("span", { style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: e.instrument }),
            /* @__PURE__ */ jsx("span", { style: { color: BASE.inkDim }, children: DIRECTION_LABEL[e.direction] }),
            !isEntryClosed(e) && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0 text-[10px]", style: { color: BASE.inkFaint }, children: "\u041E\u0442\u043A\u0440\u044B\u0442\u0430" }),
            isEntryClosed(e) && e.r !== null && e.r !== void 0 && /* @__PURE__ */ jsx("span", { className: "ml-auto shrink-0", style: { color: outcomeColor(e.outcome), fontFamily: "var(--font-mono)" }, children: formatStoredResult(e, measureMode, currency) })
          ] }),
          e.lesson && e.lesson !== "\u2014" && /* @__PURE__ */ jsx("p", { className: "text-xs pl-3.5 mt-0.5", style: { color: BASE.inkFaint }, children: e.lesson })
        ] }, e.id)) })
      ] })
    ] }) : /* @__PURE__ */ jsx("p", { className: "text-sm text-center", style: { color: BASE.inkFaint }, children: "\u041D\u0430\u0436\u043C\u0438 \u043D\u0430 \u0447\u0438\u0441\u043B\u043E, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0441\u0432\u043E\u0434\u043A\u0443 \u0437\u0430 \u0434\u0435\u043D\u044C." })
  ] });
}
function Patterns({ entries, accent, measureMode, currency, analytics, t, lang }) {
  const [view, setView] = useState("emotions");
  const [reviewOpen, setReviewOpen] = useState(false);
  const closedEntries = useMemo(() => entries.filter(isEntryClosed), [entries]);
  const grouped = useMemo(() => {
    const g = { Win: [], Loss: [], Breakeven: [] };
    closedEntries.forEach((e) => g[e.outcome]?.push(e));
    return g;
  }, [closedEntries]);
  const winRate = grouped.Win.length + grouped.Loss.length > 0 ? Math.round(grouped.Win.length / (grouped.Win.length + grouped.Loss.length) * 100) : 0;
  // V0.1 — equityCurve/tagStats ниже читают `withR`, но переменная нигде не объявлялась:
  // рендер вкладки "Аналитика" падал с ReferenceError и экран оставался чёрным.
  // Определение то же, что в Home: закрытые сделки с посчитанным r.
  const withR = useMemo(
    () => resultEntriesForUnit(closedEntries, measureMode, currency),
    [closedEntries, measureMode, currency]
  );
  const traderPatterns = useMemo(() => analyzeTraderPatterns(closedEntries, lang), [closedEntries, lang]);
  const insight = useMemo(() => {
    if (grouped.Win.length < 2 || grouped.Loss.length < 2) return t.pattern.needMoreEntries;
    if (analytics.insights.length) return analytics.insights[0].text;
    if (traderPatterns.available) return t.pattern.noPatternYetLong;
    return t.pattern.accumulating(traderPatterns.needed - traderPatterns.sampleSize);
  }, [grouped, traderPatterns, analytics, t]);
  const equityCurve = useMemo(() => {
    const sorted = [...withR].sort((a, b) => a.date - b.date);
    const grouped = [];
    sorted.forEach((e) => {
      const dayKey = e.date.toLocaleDateString("sv-SE");
      let bucket = grouped[grouped.length - 1];
      if (!bucket || bucket.dayKey !== dayKey) {
        bucket = {
          dayKey,
          dateLabel: e.date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
          dayResult: 0,
          tradeCount: 0,
          instruments: []
        };
        grouped.push(bucket);
      }
      bucket.dayResult += e.r;
      bucket.tradeCount += 1;
      if (e.instrument && !bucket.instruments.includes(e.instrument)) bucket.instruments.push(e.instrument);
    });
    let cum = 0;
    return grouped.map((d) => {
      cum += d.dayResult;
      return {
        ...d,
        cum,
        instrumentsLabel: d.instruments.slice(0, 2).join(", ") + (d.instruments.length > 2 ? " +" : "")
      };
    });
  }, [withR]);
  const tagStats = useMemo(() => {
    const stats = {};
    withR.forEach((e) => {
      stats[e.tag] = stats[e.tag] || { count: 0, sumR: 0, wins: 0, losses: 0, breakevens: 0 };
      stats[e.tag].count += 1;
      stats[e.tag].sumR += e.r;
      if (e.r > 0) stats[e.tag].wins += 1;
      else if (e.r < 0) stats[e.tag].losses += 1;
      else stats[e.tag].breakevens += 1;
    });
    return Object.entries(stats).map(([tag, s]) => ({
      tag,
      totalR: s.sumR,
      avgR: s.sumR / s.count,
      count: s.count,
      wins: s.wins,
      losses: s.losses,
      breakevens: s.breakevens
    })).sort((a, b) => b.totalR - a.totalR || b.avgR - a.avgR);
  }, [withR]);
  const emotionImpact = useMemo(() => emotionImpactStats(withR, t.newEntry.emotionGrid.scales), [withR, t]);
  const planVsFact = useMemo(() => {
    const withPlan = closedEntries.filter((e) => typeof e.plannedRR === "number" && typeof e.realizedRR === "number");
    if (withPlan.length < 3) return null;
    const avgPlanned = st_mean(withPlan.map((e) => e.plannedRR));
    const avgRealized = st_mean(withPlan.map((e) => e.realizedRR));
    const captures = withPlan.filter((e) => e.plannedRR > 0).map((e) => Math.max(0, Math.min(1, e.realizedRR / e.plannedRR)));
    const captureRatio = captures.length ? st_mean(captures) * 100 : null;
    const closeCounts = { tp: 0, sl: 0, manual: 0 };
    closedEntries.forEach((e) => {
      if (e.closeType && closeCounts[e.closeType] != null) closeCounts[e.closeType]++;
    });
    const closeTotal = closeCounts.tp + closeCounts.sl + closeCounts.manual;
    return { count: withPlan.length, avgPlanned, avgRealized, captureRatio, closeCounts, closeTotal };
  }, [closedEntries]);
  const EquityTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const e = payload[0].payload;
    const dayPositive = e.dayResult >= 0;
    return /* @__PURE__ */ jsxs("div", { className: "px-3 py-2.5 rounded-xl text-xs", style: { background: BASE.surface2, border: `1px solid ${BASE.line}`, color: BASE.ink }, children: [
      /* @__PURE__ */ jsxs("div", { style: { color: BASE.inkFaint }, children: [
        e.dateLabel,
        " \xB7 ",
        e.tradeCount,
        " ",
        pluralRu(e.tradeCount, "сделка", "сделки", "сделок")
      ] }),
      e.instrumentsLabel && /* @__PURE__ */ jsx("div", { className: "mt-0.5", style: { color: BASE.inkDim }, children: e.instrumentsLabel }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1.5", style: { fontFamily: "var(--font-mono)" }, children: [
        "Итого: ",
        formatResult(e.cum, measureMode, currency)
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-0.5", style: { color: dayPositive ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: [
        formatResult(e.dayResult, measureMode, currency),
        " за день"
      ] })
    ] });
  };
  // V1.4: ChartTooltip обслуживал только скаттер эмоций и после его замены не имел
  // вызовов — удалён, чтобы не тянуть за собой мёртвый код.
  if (reviewOpen) {
    return /* @__PURE__ */ jsx(JournalReview, { entries: closedEntries, accent, onClose: () => setReviewOpen(false), t, lang });
  }
  // V2.0 — вся аналитика построена на ЗАКРЫТЫХ сделках. Пока их нет, экран показывал
  // вкладки, нулевые метрики и пустые графики — выглядело как сломанное приложение,
  // хотя данных просто ещё не было. Теперь состояние названо прямо.
  if (closedEntries.length === 0) {
    return /* @__PURE__ */ jsx(
      EmptyState,
      {
        icon: LineChartIcon,
        title: entries.length === 0 ? "\u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430 \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u043F\u043E\u0441\u043B\u0435 \u043F\u0435\u0440\u0432\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A" : "\u041D\u0435\u0442 \u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0445 \u0441\u0434\u0435\u043B\u043E\u043A",
        hint: entries.length === 0 ? "\u0417\u0434\u0435\u0441\u044C \u0431\u0443\u0434\u0435\u0442 \u0432\u0438\u0434\u043D\u043E, \u043A\u0430\u043A \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043D\u0430 \u0432\u0445\u043E\u0434\u0435 \u0441\u0432\u044F\u0437\u0430\u043D\u043E \u0441 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u043E\u043C. \u0414\u043B\u044F \u044D\u0442\u043E\u0433\u043E \u043D\u0443\u0436\u043D\u044B \u0437\u0430\u043F\u0438\u0441\u0438 \u0441 \u043E\u0442\u043C\u0435\u0447\u0435\u043D\u043D\u044B\u043C \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435\u043C." : `\u0421\u0434\u0435\u043B\u043E\u043A \u0432 \u0436\u0443\u0440\u043D\u0430\u043B\u0435: ${entries.length}, \u043D\u043E \u043D\u0438 \u043E\u0434\u043D\u0430 \u0435\u0449\u0451 \u043D\u0435 \u0437\u0430\u043A\u0440\u044B\u0442\u0430. \u0420\u0430\u0441\u0447\u0451\u0442\u044B \u0441\u0447\u0438\u0442\u0430\u044E\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E \u0437\u0430\u043A\u0440\u044B\u0442\u044B\u043C.`,
        accent
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h2", { className: "sec-cap text-[10px] text-center mb-4", style: { color: BASE.inkDim, fontFamily: "var(--font-display)", fontWeight: 400 }, children: [
      " \u0410\u043D\u0430\u043B\u0438\u0442\u0438\u043A\u0430"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "\u0421\u0434\u0435\u043B\u043A\u0438", value: entries.length, accent: BASE.ink }),
      /* @__PURE__ */ jsx(StatCard, { label: "\u0412\u0438\u043D\u0440\u0435\u0439\u0442", value: `${winRate}%`, accent }),
      /* @__PURE__ */ jsx(StatCard, { label: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439 RR", value: analytics.rrStats?.avgRealizedRR != null ? `${analytics.rrStats.avgRealizedRR >= 0 ? "+" : ""}${analytics.rrStats.avgRealizedRR}R` : "\u2014", accent: BASE.ink })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-5", children: [
      /* @__PURE__ */ jsx(Pill, { active: view === "emotions", onClick: () => setView("emotions"), accent, children: "\u042D\u043C\u043E\u0446\u0438\u0438" }),
      /* @__PURE__ */ jsx(Pill, { active: view === "performance", onClick: () => setView("performance"), accent, children: "\u0414\u0438\u043D\u0430\u043C\u0438\u043A\u0430" }),
      /* @__PURE__ */ jsx(Pill, { active: view === "calendar", onClick: () => setView("calendar"), accent, children: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C" })
    ] }),
    view === "calendar" && /* @__PURE__ */ jsx(CalendarView, { entries, accent, measureMode, currency, t }),
    view === "emotions" && /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[11px]", style: { color: BASE.inkDim, fontFamily: "var(--font-display)" }, children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 12, style: { color: accent } }),
            " \u0427\u0442\u043E \u0433\u043E\u0432\u043E\u0440\u0438\u0442 \u0436\u0443\u0440\u043D\u0430\u043B"
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setReviewOpen(true),
              className: "shrink-0 px-2.5 py-1 rounded-full text-[11px] transition-all duration-150 active:scale-95",
              style: { color: accent, border: `1px solid ${accent}40`, background: `${accent}0F`, fontFamily: "var(--font-display)" },
              children: "\u0420\u0430\u0437\u0431\u043E\u0440"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed", style: { color: BASE.ink }, children: insight })
      ] }),
      /* V1.4 — метрики стояли одной строкой из четырёх «· подпись N%», которая на телефоне
         переносилась посреди подписи. Теперь сетка 2x2 из карточек одинаковой ширины. */
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2 mb-6", children: [
        { key: "awareness", label: t.home.awareness, score: analytics.awareness.score.value, trend: analytics.awareness.trend },
        { key: "discipline", label: t.home.discipline, score: analytics.discipline.score.value, trend: analytics.discipline.trend },
        { key: "risk", label: t.home.riskStability, score: analytics.risk.stability.value, trend: analytics.risk.trend },
        { key: "reflection", label: t.home.reflection, score: analytics.reflection.score.value, trend: analytics.reflection.trend }
      ].filter((m) => m.score != null).map((m) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "rounded-xl px-3 py-2.5",
          style: { border: `1px solid ${BASE.line}`, background: BASE.surface },
          children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.08em] mb-1.5 truncate", style: { color: BASE.inkFaint }, children: m.label }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 mb-1.5", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-[17px] leading-none", style: { color: BASE.ink, fontFamily: "var(--font-mono)" }, children: [
                m.score,
                "%"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "text-[11px]", style: { color: BASE.inkFaint }, children: TREND_ARROW[m.trend] || "" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-full h-[3px] rounded-full", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-[3px] rounded-full transition-all duration-700 ease-out", style: { width: `${Math.max(0, Math.min(100, m.score))}%`, background: accent } }) })
          ]
        },
        m.key
      )) }),
      /* V1.4 — на месте скаттера теперь прямое сравнение «при какой эмоции результат
         лучше». Облако точек в координатах страх/уверенность ничего не сообщало: точки
         не подписаны, вывода из формы облака не следует, а сами оси после перехода на
         процентные шкалы стали производной величиной, а не исходными данными. */
      /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-baseline justify-between gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: "\u041A\u0430\u043A \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0432\u043B\u0438\u044F\u0435\u0442 \u043D\u0430 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] shrink-0", style: { color: BASE.inkFaint }, children: "\u0441\u0440\u0435\u0434\u043D\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442" })
      ] }),
      /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(EmotionImpact, { stats: emotionImpact, measureMode, currency }) })
    ] }),
    view === "performance" && /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
      /* @__PURE__ */ jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm block", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: "Кривая доходности" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] block mt-1", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: "накопительный результат по дням" })
          ] }),
          equityCurve.length > 0 && /* @__PURE__ */ jsx("span", { className: "shrink-0 text-sm", style: { color: equityCurve[equityCurve.length - 1].cum >= 0 ? WIN : LOSS, fontFamily: "var(--font-mono)" }, children: formatResult(equityCurve[equityCurve.length - 1].cum, measureMode, currency) })
        ] }),
        equityCurve.length < 2 ? /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: "Добавь результат хотя бы к паре сделок, чтобы увидеть динамику по дням." }) : /* @__PURE__ */ jsx("div", { style: { width: "100%", height: 240 }, children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(AreaChart, { data: equityCurve, margin: { top: 8, right: 6, bottom: 6, left: -14 }, children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "eqGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: accent, stopOpacity: 0.26 }),
            /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: accent, stopOpacity: 0.02 })
          ] }) }),
          /* @__PURE__ */ jsx(CartesianGrid, { stroke: `${BASE.line}CC`, vertical: false, strokeDasharray: "3 6" }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "dateLabel", tick: { fill: BASE.inkFaint, fontSize: 10 }, stroke: "transparent", tickLine: false, axisLine: false, dy: 6 }),
          /* @__PURE__ */ jsx(YAxis, { tick: { fill: BASE.inkFaint, fontSize: 10 }, stroke: "transparent", tickLine: false, axisLine: false, width: 36 }),
          /* @__PURE__ */ jsx(Tooltip, { content: /* @__PURE__ */ jsx(EquityTooltip, {}), cursor: { stroke: BASE.line, strokeDasharray: "3 4" } }),
          /* @__PURE__ */ jsx(Area, { type: "linear", dataKey: "cum", stroke: accent, strokeWidth: 2.5, fill: "url(#eqGrad)", dot: { r: 3.5, fill: BASE.ink, stroke: accent, strokeWidth: 1.5 }, activeDot: { r: 5, fill: BASE.ink, stroke: accent, strokeWidth: 2 }, isAnimationActive: true, animationDuration: 650 })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm block", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: "Результат по типу сетапа" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] block mt-1", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: "итог + средний результат на сделку" })
          ] }),
          tagStats.length > 0 && /* @__PURE__ */ jsx("span", { className: "shrink-0 text-[10px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: `${tagStats.length} сетап.` })
        ] }),
        tagStats.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm", style: { color: BASE.inkFaint }, children: "Добавь результат к сделкам, чтобы увидеть, какие сетапы реально работают." }) : /* @__PURE__ */ jsx(TagBars, { data: tagStats, measureMode, currency })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:grid lg:grid-cols-2 lg:gap-4 lg:items-start", children: [
      analytics.rrStats && analytics.rrStats.sampleSize > 0 && /* @__PURE__ */ jsxs(Card, { className: "mb-6", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm block mb-3", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: t.home.avgRrWinRate }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(StatCard, { label: "Average RR", value: analytics.rrStats.avgRealizedRR != null ? `${analytics.rrStats.avgRealizedRR >= 0 ? "+" : ""}${analytics.rrStats.avgRealizedRR}R` : "—", accent: analytics.rrStats.avgRealizedRR != null ? analytics.rrStats.avgRealizedRR >= 0 ? WIN : LOSS : BASE.ink }),
          /* @__PURE__ */ jsx(StatCard, { label: "Win Rate", value: analytics.rrStats.winRate != null ? `${analytics.rrStats.winRate}%` : "—", accent: BASE.ink })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
          /* @__PURE__ */ jsxs("span", { children: ["Wins ", analytics.rrStats.wins] }),
          /* @__PURE__ */ jsxs("span", { children: ["Losses ", analytics.rrStats.losses] }),
          /* @__PURE__ */ jsxs("span", { children: ["Breakeven ", analytics.rrStats.breakevens] })
        ] })
      ] }),
      planVsFact && /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm block mb-3", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: "План vs Факт" }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-3", children: [
          /* @__PURE__ */ jsx(StatCard, { label: "Ср. Planned RR", value: `${planVsFact.avgPlanned.toFixed(1)}R`, accent: BASE.ink }),
          /* @__PURE__ */ jsx(StatCard, { label: "Ср. Realized RR", value: `${planVsFact.avgRealized.toFixed(1)}R`, accent: planVsFact.avgRealized >= 0 ? WIN : LOSS }),
          planVsFact.captureRatio != null && /* @__PURE__ */ jsx(StatCard, { label: "TP Capture", value: `${Math.round(planVsFact.captureRatio)}%`, accent: BASE.ink })
        ] }),
        planVsFact.closeTotal > 0 && /* @__PURE__ */ jsxs("div", { className: "flex gap-3 text-[11px]", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
          /* @__PURE__ */ jsxs("span", { children: ["TP ", Math.round(planVsFact.closeCounts.tp / planVsFact.closeTotal * 100), "%"] }),
          /* @__PURE__ */ jsxs("span", { children: ["SL ", Math.round(planVsFact.closeCounts.sl / planVsFact.closeTotal * 100), "%"] }),
          /* @__PURE__ */ jsxs("span", { children: ["Manual ", Math.round(planVsFact.closeCounts.manual / planVsFact.closeTotal * 100), "%"] })
        ] })
      ] })
      ] })
    ] })
  ] });
}

function ChallengeCard({ icon: Icon, title, desc, progress, goal, accent }) {
  const pct = Math.min(100, Math.round(progress / goal * 100));
  const completed = progress >= goal;
  return /* @__PURE__ */ jsxs(Card, { accent, glowing: completed, className: "mb-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-1", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-7 h-7 rounded-full flex items-center justify-center shrink-0", style: { background: completed ? `${accent}14` : BASE.surface2, border: `1px solid ${completed ? accent + "40" : BASE.line}` }, children: /* @__PURE__ */ jsx(Icon, { size: 13, style: { color: completed ? accent : BASE.inkDim } }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: title })
      ] }),
      completed && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full", style: { color: accent, border: `1px solid ${accent}40` }, children: [
        /* @__PURE__ */ jsx(Check, { size: 10 }),
        " \u0413\u043E\u0442\u043E\u0432\u043E"
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs mb-2.5", style: { color: BASE.inkFaint }, children: desc }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 h-1 rounded-full", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${pct}%`, background: completed ? accent : BASE.inkDim } }) }),
      /* @__PURE__ */ jsxs("span", { className: "text-[11px] shrink-0", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: [
        Math.min(progress, goal),
        "/",
        goal
      ] })
    ] })
  ] });
}
function Challenge({ entries, accent, weeklyGoal, t, lang }) {
  const { streak, week } = useStreak(entries, lang);
  const daysThisWeek = week.filter((d) => d.filled).length;
  const effectiveWeeklyGoal = 7;
  const pct = Math.min(100, Math.round(daysThisWeek / effectiveWeeklyGoal * 100));
  const animatedStreak = Math.round(useAnimatedNumber(streak));
  const CHALLENGE_ICONS = { revenge: ShieldCheck, reflect: PenLine, winstreak: TrendingUp };
  const challenges = useMemo(() => calculateChallengeProgress(entries, lang), [entries, lang]);
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("h2", { className: "sec-cap text-[10px] text-center mb-5", style: { color: BASE.inkDim, fontFamily: "var(--font-display)", fontWeight: 400 }, children: [
      " ",
      t.challenge.title
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:columns-2 lg:gap-4", children: [
    /* @__PURE__ */ jsxs(Card, { accent, glowing: true, className: "mb-4 text-center py-6", children: [
      /* @__PURE__ */ jsx("div", { className: "text-4xl mb-1", style: { fontFamily: "var(--font-display)", color: BASE.ink, fontWeight: 500 }, children: animatedStreak }),
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide", style: { color: BASE.inkFaint }, children: t.challenge.daysInARow })
    ] }),
    /* @__PURE__ */ jsx(ChallengeCard, { icon: CalendarCheck, title: t.challenge.weeklyConsistency, desc: t.challenge.weeklyConsistencyDesc(effectiveWeeklyGoal), progress: daysThisWeek, goal: effectiveWeeklyGoal, accent }),
    challenges.map((c) => /* @__PURE__ */ jsx(ChallengeCard, { icon: CHALLENGE_ICONS[c.id], title: c.title, desc: c.desc, progress: c.progress, goal: c.goal, accent }, c.id)),
    /* @__PURE__ */ jsxs(Card, { className: "mt-3 mb-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: t.challenge.thisWeek }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs", style: { color: BASE.inkFaint }, children: [
          daysThisWeek,
          "/",
          effectiveWeeklyGoal
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full h-1 rounded-full mb-4", style: { background: BASE.line }, children: /* @__PURE__ */ jsx("div", { className: "h-1 rounded-full transition-all duration-700 ease-out", style: { width: `${pct}%`, background: accent } }) }),
      /* @__PURE__ */ jsx(WeekDots, { week, accent })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed break-inside-avoid", style: { color: BASE.inkFaint }, children: t.challenge.footer })
    ] })
  ] });
}
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
        const cur = await storageGet(mediaEntryKey(userId, id), false);
        if (!cur?.value) await storageSet(mediaEntryKey(userId, id), JSON.stringify(val), false);
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
  return {
    async register(username, password) {
      const uname = (username || "").trim();
      if (!USERNAME_RE.test(uname.toLowerCase())) {
        throw new Error("\u041B\u043E\u0433\u0438\u043D: 3-32 \u0441\u0438\u043C\u0432\u043E\u043B\u0430, \u043B\u0430\u0442\u0438\u043D\u0438\u0446\u0430/\u0446\u0438\u0444\u0440\u044B/._-");
      }
      if ((password || "").length < 6) {
        throw new Error("\u041F\u0430\u0440\u043E\u043B\u044C \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043E\u0442 6 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432");
      }
      const cred = await createUserWithEmailAndPassword(fbAuth, usernameToEmail(uname), password);
      await firebaseUpdateProfile(cred.user, { displayName: uname });
      const migration = await migrateLocalAccountIfNeeded(cred.user.uid, uname);
      if (migration === "none") __freshAccountUids.add(cred.user.uid);
      return { id: cred.user.uid, username: uname };
    },
    async login(username, password) {
      const uname = (username || "").trim();
      const cred = await signInWithEmailAndPassword(fbAuth, usernameToEmail(uname), password);
      await migrateLocalAccountIfNeeded(cred.user.uid, uname);
      return { id: cred.user.uid, username: cred.user.displayName || emailToUsername(cred.user.email) };
    },
    async logout() {
      await firebaseSignOut(fbAuth);
    },
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(fbAuth, provider);
      const uname = cred.user.displayName || emailToUsername(cred.user.email) || `user_${cred.user.uid.slice(0, 6)}`;
      return { id: cred.user.uid, username: uname };
    },
    async getSession() {
      return new Promise((resolve) => {
        const unsub = onAuthStateChanged(fbAuth, (u) => {
          unsub();
          resolve(u ? { id: u.uid, username: u.displayName || emailToUsername(u.email) } : null);
        });
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
    authService.getCurrentUser().then((u) => {
      if (!cancelled) {
        setUser(u);
        setStatus(u ? "authenticated" : "unauthenticated");
      }
    }).catch(() => {
      if (!cancelled) setStatus("unauthenticated");
    });
    return () => {
      cancelled = true;
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
    const u = await authService.loginWithGoogle();
    setUser(u);
    setStatus("authenticated");
    return u;
  };
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setStatus("unauthenticated");
  };
  return { status, user, register, login, loginWithGoogle, logout };
}
function AuthScreen({ accent, onRegister, onLogin, onGoogle }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const switchMode = (m) => {
    setMode(m);
    setError("");
  };
  const submit = async () => {
    if (busy) return;
    setError("");
    if (mode === "register" && password !== confirmPassword) {
      setError("\u041F\u0430\u0440\u043E\u043B\u0438 \u043D\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0430\u044E\u0442");
      return;
    }
    setBusy(true);
    try {
      if (mode === "register") await onRegister(username, password);
      else await onLogin(username, password);
    } catch (e) {
      const raw = e?.message || "";
      setError(/unexpected response/i.test(raw) ? "\u0425\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435 \u043D\u0435 \u043E\u0442\u0432\u0435\u0442\u0438\u043B\u043E \u2014 \u043F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u0435\u0449\u0451 \u0440\u0430\u0437." : raw || "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A");
    } finally {
      setBusy(false);
    }
  };
  const submitGoogle = async () => {
    if (googleBusy) return;
    setError("");
    setGoogleBusy(true);
    try {
      await onGoogle();
    } catch (e) {
      setError(e?.message || "\u0427\u0442\u043E-\u0442\u043E \u043F\u043E\u0448\u043B\u043E \u043D\u0435 \u0442\u0430\u043A");
    } finally {
      setGoogleBusy(false);
    }
  };
  const disabled = busy || !username.trim() || !password || mode === "register" && !confirmPassword;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-40 flex flex-col items-center justify-center px-8", style: { background: "#040405" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "pointer-events-none fixed inset-0 overflow-hidden", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("div", { className: "cosmic-core" }),
      /* @__PURE__ */ jsx("div", { className: "cosmic-stars cosmic-stars-1" }),
      /* @__PURE__ */ jsx("div", { className: "cosmic-stars cosmic-stars-2" }),
      /* @__PURE__ */ jsx("div", { className: "cosmic-vignette" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 mb-9", children: [
        /* @__PURE__ */ jsx(LogoMark, { size: 38, accent }),
        /* @__PURE__ */ jsx(Wordmark, { accent, size: 17 })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mb-6 justify-center", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => switchMode("login"),
            className: "px-4 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
            style: { background: mode === "login" ? `${accent}12` : "transparent", color: mode === "login" ? accent : BASE.inkDim, border: `1px solid ${mode === "login" ? accent + "40" : BASE.line}` },
            children: "\u0412\u043E\u0439\u0442\u0438"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => switchMode("register"),
            className: "px-4 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
            style: { background: mode === "register" ? `${accent}12` : "transparent", color: mode === "register" ? accent : BASE.inkDim, border: `1px solid ${mode === "register" ? accent + "40" : BASE.line}` },
            children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(Card, { accent, className: "mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-2", style: { color: BASE.inkFaint, fontFamily: "var(--font-display)" }, children: "\u041B\u043E\u0433\u0438\u043D" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b py-2", style: { borderColor: BASE.line }, children: [
            /* @__PURE__ */ jsx(User, { size: 14, style: { color: BASE.inkFaint } }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: username,
                onChange: (e) => setUsername(e.target.value),
                placeholder: "trader01",
                autoCapitalize: "none",
                autoCorrect: "off",
                spellCheck: false,
                className: "flex-1 bg-transparent outline-none text-sm",
                style: { color: BASE.ink }
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: mode === "register" ? "mb-4" : "mb-1", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-2", style: { color: BASE.inkFaint, fontFamily: "var(--font-display)" }, children: "\u041F\u0430\u0440\u043E\u043B\u044C" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b py-2", style: { borderColor: BASE.line }, children: [
            /* @__PURE__ */ jsx(KeyRound, { size: 14, style: { color: BASE.inkFaint } }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: password,
                onChange: (e) => setPassword(e.target.value),
                type: showPw ? "text" : "password",
                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022",
                className: "flex-1 bg-transparent outline-none text-sm",
                style: { color: BASE.ink }
              }
            ),
            /* @__PURE__ */ jsx("button", { onClick: () => setShowPw((v) => !v), className: "shrink-0", type: "button", "aria-label": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C", children: showPw ? /* @__PURE__ */ jsx(EyeOff, { size: 14, style: { color: BASE.inkFaint } }) : /* @__PURE__ */ jsx(Eye, { size: 14, style: { color: BASE.inkFaint } }) })
          ] })
        ] }),
        mode === "register" && /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-2", style: { color: BASE.inkFaint, fontFamily: "var(--font-display)" }, children: "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b py-2", style: { borderColor: BASE.line }, children: [
            /* @__PURE__ */ jsx(KeyRound, { size: 14, style: { color: BASE.inkFaint } }),
            /* @__PURE__ */ jsx(
              "input",
              {
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
                type: showPw ? "text" : "password",
                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022",
                className: "flex-1 bg-transparent outline-none text-sm",
                style: { color: BASE.ink }
              }
            )
          ] })
        ] })
      ] }),
      error && /* @__PURE__ */ jsx("p", { className: "text-xs mb-3 text-center", style: { color: LOSS }, children: error }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: submit,
          disabled,
          className: "w-full py-3 rounded-xl text-sm mb-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-40",
          style: { border: `1px solid ${accent}40`, background: `${accent}12`, color: accent, fontFamily: "var(--font-display)" },
          children: busy ? "\u2026" : mode === "register" ? "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442" : "\u0412\u043E\u0439\u0442\u0438"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: submitGoogle,
          disabled: googleBusy,
          type: "button",
          className: "w-full py-3 rounded-xl text-sm mb-6 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-40",
          style: { border: `1px solid ${BASE.line}`, color: BASE.ink, background: BASE.surface2 },
          children: [
            /* @__PURE__ */ jsxs("svg", { width: 16, height: 16, viewBox: "0 0 48 48", "aria-hidden": "true", children: [
              /* @__PURE__ */ jsx("path", { fill: "#FFC107", d: "M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" }),
              /* @__PURE__ */ jsx("path", { fill: "#FF3D00", d: "M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z" }),
              /* @__PURE__ */ jsx("path", { fill: "#4CAF50", d: "M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.4 34.9 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z" }),
              /* @__PURE__ */ jsx("path", { fill: "#1976D2", d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.5 5.5C41.5 35.7 44 30.4 44 24c0-1.2-.1-2.4-.4-3.5z" })
            ] }),
            googleBusy ? "\u2026" : "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u0441 Google"
          ]
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-center mb-2", style: { color: BASE.inkFaint }, children: mode === "login" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "\u041D\u0435\u0442 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430? ",
        /* @__PURE__ */ jsx("span", { onClick: () => switchMode("register"), className: "underline cursor-pointer", style: { color: accent }, children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442" })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        "\u0423\u0436\u0435 \u0435\u0441\u0442\u044C \u0430\u043A\u043A\u0430\u0443\u043D\u0442? ",
        /* @__PURE__ */ jsx("span", { onClick: () => switchMode("login"), className: "underline cursor-pointer", style: { color: accent }, children: "\u0412\u043E\u0439\u0442\u0438" })
      ] }) }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-center", style: { color: BASE.inkFaint }, children: "\u041B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0442\u0435\u0441\u0442\u043E\u0432\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442 \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435." })
    ] })
  ] });
}
function LegacyMigratePrompt({ accent, onMigrate, onSkip }) {
  const [busy, setBusy] = useState(false);
  const run = async (fn) => {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-40 flex flex-col items-center justify-center px-8", style: { background: "#040405" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "pointer-events-none fixed inset-0 overflow-hidden", "aria-hidden": "true", children: [
      /* @__PURE__ */ jsx("div", { className: "cosmic-core" }),
      /* @__PURE__ */ jsx("div", { className: "cosmic-stars cosmic-stars-1" }),
      /* @__PURE__ */ jsx("div", { className: "cosmic-vignette" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-sm text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx(LogoMark, { size: 32, accent }) }),
      /* @__PURE__ */ jsx("p", { className: "text-sm mb-2", style: { color: BASE.ink, fontFamily: "var(--font-display)" }, children: "\u041D\u0430\u0439\u0434\u0435\u043D \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0439 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mb-8 leading-relaxed", style: { color: BASE.inkFaint }, children: "\u0414\u043D\u0435\u0432\u043D\u0438\u043A, \u043A\u043E\u0448\u0435\u043B\u0451\u043A MindCoin, streak \u0438 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438, \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u043D\u0430 \u044D\u0442\u043E\u043C \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0435 \u0440\u0430\u043D\u044C\u0448\u0435. \u041F\u0435\u0440\u0435\u043D\u0435\u0441\u0442\u0438 \u0438\u0445 \u0432 \u043D\u043E\u0432\u044B\u0439 \u0430\u043A\u043A\u0430\u0443\u043D\u0442?" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => run(onMigrate),
          disabled: busy,
          className: "w-full py-3 rounded-xl text-sm mb-3 transition-all duration-200 active:scale-[0.98] disabled:opacity-50",
          style: { border: `1px solid ${accent}40`, background: `${accent}12`, color: accent, fontFamily: "var(--font-display)" },
          children: "\u041F\u0435\u0440\u0435\u043D\u0435\u0441\u0442\u0438"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => run(onSkip),
          disabled: busy,
          className: "w-full py-3 rounded-xl text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50",
          style: { border: `1px solid ${BASE.line}`, color: BASE.inkDim },
          children: "\u041D\u0430\u0447\u0430\u0442\u044C \u0437\u0430\u043D\u043E\u0432\u043E"
        }
      )
    ] })
  ] });
}
function BootIntro({ accent, name, lang, onDone }) {
  const isEn = lang === "en";
  const lines = isEn ? [
    "> mind.exe",
    "> auth\u2026 ok",
    "> syncing journal\u2026",
    `> welcome, ${name || "operator"}`
  ] : [
    "> mind.exe",
    "> \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F\u2026 ok",
    "> \u0441\u0438\u043D\u0445\u0440\u043E\u043D\u0438\u0437\u0430\u0446\u0438\u044F \u0434\u043D\u0435\u0432\u043D\u0438\u043A\u0430\u2026",
    `> \u0434\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C, ${name || "\u043E\u043F\u0435\u0440\u0430\u0442\u043E\u0440"}`
  ];
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const lineDelay = 220;
    const holdAfter = 260;
    const totalTypeTime = lines.length * lineDelay + holdAfter;
    const fadeTimer = setTimeout(() => setFading(true), totalTypeTime);
    const doneTimer = setTimeout(() => onDone(), totalTypeTime + 300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex flex-col items-center justify-center px-8 transition-opacity duration-500",
      style: { background: "#040405", opacity: fading ? 0 : 1 },
      children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-xs", children: lines.map((line, i) => /* @__PURE__ */ jsx(
        "p",
        {
          className: "text-sm mb-2",
          style: {
            color: i === lines.length - 1 ? BASE.ink : BASE.inkDim,
            fontFamily: "var(--font-mono)",
            opacity: 0,
            animation: `riseIn 0.4s ease ${i * 0.42}s forwards`
          },
          children: line
        },
        i
      )) })
    }
  );
}
function DesktopSidebar({ nav, tab, setTab, accent, mindCoins, onWalletClick }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "hidden md:flex fixed left-0 top-0 bottom-0 w-[232px] flex-col px-3 pt-6 pb-5 z-20",
      style: { background: "rgba(10,10,12,0.6)", borderRight: `1px solid ${BASE.line}`, backdropFilter: "blur(10px)" },
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-2 mb-1", children: [
          /* @__PURE__ */ jsx(LogoMark, { size: 24, accent }),
          /* @__PURE__ */ jsx(Wordmark, { accent })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mb-6 mt-2 px-2", children: /* @__PURE__ */ jsx(WalletBadge, { balance: mindCoins, accent, onClick: onWalletClick }) }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-1 flex-1", children: nav.map((n) => {
          const active = tab === n.id;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setTab(n.id),
              className: "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150",
              style: { background: active ? `${accent}12` : "transparent", border: `1px solid ${active ? accent + "35" : "transparent"}` },
              children: [
                /* @__PURE__ */ jsx(n.icon, { size: 16, strokeWidth: 2, style: { color: active ? accent : BASE.inkFaint } }),
                /* @__PURE__ */ jsx("span", { className: "text-[13px]", style: { color: active ? accent : BASE.inkDim, fontFamily: "var(--font-display)" }, children: n.label })
              ]
            },
            n.id
          );
        }) })
      ]
    }
  );
}
class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("mind.exe: render crash", error, info);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return /* @__PURE__ */ jsx("div", {
      className: "fixed inset-0 z-[100] flex items-center justify-center px-7",
      style: { background: "#000", color: BASE.ink, fontFamily: "var(--font-display)" },
      children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm text-center", children: [
        /* @__PURE__ */ jsx(LogoMark, { size: 34, color: BASE.ink }),
        /* @__PURE__ */ jsx("h1", { className: "text-lg mt-5 mb-2", children: "mind.exe" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed mb-5", style: { color: BASE.inkDim }, children: "Интерфейс столкнулся с ошибкой. Сохранённые данные не сбрасываются. Перезапусти приложение." }),
        /* @__PURE__ */ jsx("button", { onClick: () => window.location.reload(), className: "w-full py-3 rounded-full text-sm", style: { background: BASE.ink, color: "#000", fontWeight: 600 }, children: "Перезапустить" })
      ] })
    });
  }
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
  const authLegacyGateRef = useRef(false);
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
    try {
      const newUser = await authLoginWithGoogle();
      if (hasLegacy) setMigrateFor(newUser.id);
      return newUser;
    } catch (e) {
      authLegacyGateRef.current = false;
      throw e;
    }
  };
  const handleMigrate = async () => {
    if (!migrateFor) return;
    await claimLegacyData(migrateFor);
    authLegacyGateRef.current = false;
    setMigrateFor(null);
  };
  const handleSkipMigrate = async () => {
    await skipLegacyData();
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
