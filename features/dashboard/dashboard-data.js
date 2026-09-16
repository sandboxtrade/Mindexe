// mind.exe — lightweight Dashboard storage bridge.
// Kept separate so the large Dashboard/Recharts module can be lazy-loaded without entering the startup bundle.

let storageGet = null;
let storageSet = null;

export function configureDashboardData(deps = {}) {
  storageGet = typeof deps.storageGet === "function" ? deps.storageGet : null;
  storageSet = typeof deps.storageSet === "function" ? deps.storageSet : null;
}

export function dashboardStorageGet(...args) {
  if (!storageGet) return Promise.resolve(null);
  return storageGet(...args);
}

export function dashboardStorageSet(...args) {
  if (!storageSet) return Promise.resolve(null);
  return storageSet(...args);
}
