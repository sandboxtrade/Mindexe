# MIND.EXE v4.9.0 FINAL QA — testing

Run before every deployment:

```bash
npm test
```

No npm dependencies are required for the regression suite. Expected final output:

```text
68 regression checks passed.
MIND.EXE regression suite: OK
```

## Automated coverage

The suite checks:

- syntax of `app.js` and every local JS module;
- all relative JS imports resolve to existing files;
- static unresolved-identifier audit (`TS2304` / `TS2552`) when global `tsc` is available;
- exact Firebase/profile/media/Strategy key invariants;
- Firestore path shape;
- Profile Store v2 chunk/revision reconstruction;
- profile stale-client CAS and five-revision rollback;
- Strategy index revisions/CAS/fallbacks;
- direct Strategy trade CAS;
- journal split-media manifest-last activation/readiness guards;
- cloud-first journal mutations/import/reset/restore semantics;
- uncertain write freeze and profile conflict gate;
- result units, SL/TP/manual normalization and RR math;
- R-only analytics isolation and Pattern Engine calculations;
- modular dependency boundaries after the large `app.js` extraction;
- passive second-device `anonId` regression;
- final runtime dependencies (`Fragment`, `Card`, `JournalReview`, no dead splash mask);
- Inter + IBM Plex Mono typography contract;
- one `4.9.0` local module cache generation;
- pre-React boot fallback;
- external splash poster/video release assets.

## Additional release checks already performed for v4.9.0

- `node --check` passes for every production `.js` file.
- Static TypeScript audit reports no unresolved runtime identifiers (`TS2304` / `TS2552`).
- Every relative local JS import uses the same `?v=4.9.0` cache generation.
- `core/profile-store.js`, `core/journal-media.js`, `core/strategy-store.js` and `core/firestore-storage.js` are byte-for-byte identical to the tested v4.8.5.1 base.

A full headless browser smoke could not be validated in the build container because its DNS cannot resolve the external runtime CDNs (`esm.sh`, Firebase gstatic, Tailwind CDN). That is why the following real-device matrix is mandatory after upload.

## Mandatory post-deploy smoke matrix

### Desktop

- cold reload reaches login/app instead of ErrorBoundary;
- login and logout work;
- edit profile name/balance/currency and reload;
- create an open journal trade;
- attach entry screenshot;
- edit it;
- close it by TP / SL / manual on disposable trades;
- verify Analytics and Journal Review open;
- create/edit Strategy, add/close/delete a direct Strategy trade;
- export backup.

### iPhone / installed PWA

- fully close and relaunch PWA after deployment;
- cold boot completes;
- no infinite black/loading screen;
- open journal, screenshots, Strategy Lab, Settings;
- background the app during normal use, return and verify state;
- reload and verify cloud data;
- verify pinch zoom / normal iOS input behavior.

### Two-device

- same account on desktop + phone;
- leave phone idle;
- edit profile/trade on desktop;
- desktop must not get a false revision conflict from the idle phone;
- reload phone and verify new cloud data;
- intentionally edit from both sides to confirm stale-client conflict protection still blocks silent overwrite.

### Network interruption

Using a disposable account:

- interrupt network during a cloud save;
- app should freeze uncertain writes / show blocking recovery state rather than pretend success;
- restore network and reload cloud state;
- confirm no empty profile overwrote real journal data.

Do not deploy if any persistence/conflict/reset behavior differs from the established v4.8.x semantics.
