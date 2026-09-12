export const GOOGLE_REDIRECT_LEGACY_KEY = "mind-exe-google-redirect-legacy";

export function normalizeFirebaseUser(user) {
  if (!user) return null;
  const emailUsername = (user.email || "").split("@")[0];
  return {
    id: user.uid,
    username: user.displayName || emailUsername || `user_${String(user.uid || "").slice(0, 6)}`
  };
}

export function shouldPreferGoogleRedirect({ navigatorObj, windowObj } = {}) {
  const nav = navigatorObj || (typeof navigator !== "undefined" ? navigator : null);
  const win = windowObj || (typeof window !== "undefined" ? window : null);
  const standaloneNavigator = nav?.standalone === true;
  let standaloneMedia = false;
  try {
    standaloneMedia = !!win?.matchMedia?.("(display-mode: standalone)")?.matches;
  } catch (_) {
  }
  return standaloneNavigator || standaloneMedia;
}

export function isGooglePopupFallbackError(error) {
  const code = error?.code || "";
  return code === "auth/popup-blocked" ||
    code === "auth/operation-not-supported-in-this-environment" ||
    code === "auth/web-storage-unsupported";
}

export function safeSessionGet(key) {
  try {
    return typeof sessionStorage !== "undefined" ? sessionStorage.getItem(key) : null;
  } catch (_) {
    return null;
  }
}

export function safeSessionSet(key, value) {
  try {
    if (typeof sessionStorage !== "undefined") sessionStorage.setItem(key, value);
    return true;
  } catch (_) {
    return false;
  }
}

export function safeSessionRemove(key) {
  try {
    if (typeof sessionStorage !== "undefined") sessionStorage.removeItem(key);
  } catch (_) {
  }
}
