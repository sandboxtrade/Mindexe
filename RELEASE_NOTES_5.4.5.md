# MIND.EXE v5.4.5

## Journal insights — quality gate instead of filler

- Headline insights no longer promote isolated discipline frequencies such as “33% of losses were followed by another trade”. Those raw metrics remain available to the analytics engine, but are not treated as useful conclusions by themselves.
- The journal now prefers repeated two-sided comparisons: for example, quick re-entries after a loss versus other post-loss entries, with both sample sizes and realized RR shown.
- Comparisons require at least five realized-RR observations on each side and a material RR difference before they can become a headline.
- Low-confidence pattern candidates are kept in detailed analytics but filtered out of the main “Что говорит журнал” headline.
- Calibration observations are promoted only with moderate/high confidence and a sufficient same-day sample.
- Gemini Home/Coach insight prompts now explicitly reject isolated counts and causal wording. Journal data is observational: the model may describe an association, but not claim that one behavior “directly caused” the result.
- A response guard rejects causal-overreach wording. If no useful repeated relationship exists, MIND.EXE shows an honest insufficient-data message instead of manufacturing advice.
- Home insight cache key was bumped to `home-advice-v2`, so previously cached weak text cannot survive this release.

## Decision Lab — typography and psychology reliability

- LONG / SHORT / uncertainty / FOR / AGAINST controls now share one `DecisionChoiceButton` component with Inter/display typography, normal weight, restrained letter spacing, and consistent geometry across argument cards, considered direction, and final choice.
- Removed the tiny `9px uppercase tracking-wide rounded-full` side-chip style.
- If all rated thoughts are neutral/uncertain, the balance card now says that explicitly instead of looking like ratings are missing.
- Psychological synthesis no longer gives Gemini the exact deterministic LONG/SHORT percentages. Gemini receives only the qualitative code-computed relationship while the UI remains the sole renderer of exact percentages.
- Prompt now explicitly forbids repeating numeric argument weights/intensities and percentages.
- Guard-rejected, malformed, incomplete, or strategy-leaking model responses get one automatic retry inside the same first-run flow, rather than forcing the user to press “Повторить разбор”.
- Existing chart/ticker/market isolation and immutable pre-trade snapshot rules are unchanged.

## Verification

- Regression suite expanded from 139 to 144 checks.
- Added regression coverage for small-sample insight suppression, repeated two-sided RR comparisons, causal-overreach filtering/cache invalidation, unified Decision choice typography/neutral-only state, and first-run psychology retry behavior.

## Full-source audit cleanup — 2026-09-17

- Legacy local-data migration now commits through the active revisioned profile store instead of the obsolete canonical document. Failed cloud reads, failed writes and partial screenshot migration no longer retire the local source, so retry remains safe and idempotent.
- Intentional journal/full-reset tombstones prevent old local trades from being resurrected during migration.
- Close Trade uses the computed RR fallback for older entries that do not contain `plannedRR`, preventing a render-time crash.
- Screenshot compression is hard-bounded to its configured payload limit and releases canvas backing memory earlier.
- MediaRecorder error propagation was corrected while preserving microphone cleanup.
- Dead imports, dead helpers, unused props/parameters and duplicate splash source assets were removed.
- Regression suite expanded to 150 checks.
## Final code-audit cleanup

- Updated Firebase Web SDK from 12.17.1 to 12.19.0 to pick up the current iOS/iPadOS Auth persistence fixes and AI Logic fixes.
- Updated Vite from 7.1.5 to 7.3.5 to remove known 2026 dev-server file-read/security issues while staying on the same major version.
- Removed the duplicate root `splash-poster.jpg`; `public/splash-poster.jpg` is now the single source copied by Vite.
- Added release regressions that keep the Firebase floor and splash-asset layout from drifting back.

