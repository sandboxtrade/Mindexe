core/// MIND.EXE — pure trade/result math.
// No React, Firebase, browser globals or persistence side effects.

export const CURRENCIES = [
  { code: "USD", symbol: "$", prefix: true },
  { code: "RUB", symbol: "\u20BD", prefix: false },
  { code: "EUR", symbol: "\u20AC", prefix: true },
  { code: "GBP", symbol: "\xA3", prefix: true },
  { code: "CNY", symbol: "\xA5", prefix: true },
  { code: "KZT", symbol: "\u20B8", prefix: false }
];

export function normalizeResultByCloseType(closeType, value) {
  if (typeof value !== "number" || !isFinite(value)) return value;
  if (closeType === "sl") return value === 0 ? 0 : -Math.abs(value);
  if (closeType === "tp") return value === 0 ? 0 : Math.abs(value);
  return value;
}

export function outcomeFromResult(value) {
  if (typeof value !== "number" || !isFinite(value)) return null;
  return value > 0 ? "Win" : value < 0 ? "Loss" : "Breakeven";
}

export function computePlannedRR(direction, entry, sl, tp) {
  if ([entry, sl, tp].some((v) => typeof v !== "number" || isNaN(v) || !isFinite(v))) {
    return { ok: false, error: "\u0417\u0430\u043f\u043e\u043b\u043d\u0438 Entry, SL \u0438 TP \u0447\u0438\u0441\u043b\u0430\u043c\u0438" };
  }
  const risk = direction === "Short" ? sl - entry : entry - sl;
  const reward = direction === "Short" ? entry - tp : tp - entry;
  if (risk <= 0) {
    return {
      ok: false,
      error: direction === "Short" ? "SL \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u0432\u044b\u0448\u0435 Entry" : "SL \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u043d\u0438\u0436\u0435 Entry"
    };
  }
  if (reward <= 0) {
    return {
      ok: false,
      error: direction === "Short" ? "TP \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u043d\u0438\u0436\u0435 Entry" : "TP \u0434\u043e\u043b\u0436\u0435\u043d \u0431\u044b\u0442\u044c \u0432\u044b\u0448\u0435 Entry"
    };
  }
  const rr = reward / risk;
  if (!isFinite(rr) || isNaN(rr)) return { ok: false, error: "\u041d\u0435\u043a\u043e\u0440\u0440\u0435\u043a\u0442\u043d\u044b\u0435 \u0437\u043d\u0430\u0447\u0435\u043d\u0438\u044f" };
  return { ok: true, rr };
}

export function computeRealizedRR(direction, entry, sl, exit) {
  if ([entry, sl, exit].some((v) => typeof v !== "number" || isNaN(v) || !isFinite(v))) return null;
  const risk = direction === "Short" ? sl - entry : entry - sl;
  if (!risk || risk <= 0) return null;
  const reward = direction === "Short" ? entry - exit : exit - entry;
  const rr = reward / risk;
  return isFinite(rr) && !isNaN(rr) ? rr : null;
}

export function findCurrency(code) {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

export function groupThousands(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function normalizeResultMode(mode) {
  return mode === "R" || mode === "currency" ? mode : null;
}

export function normalizeResultCurrency(code) {
  return typeof code === "string" && CURRENCIES.some((c) => c.code === code) ? code : null;
}

export function getStoredResultMeta(entry, fallbackMode = "R", fallbackCurrency = "USD") {
  const storedMode = normalizeResultMode(entry?.resultMode);
  const mode = storedMode || fallbackMode;
  const currency = mode === "currency"
    ? (storedMode === "currency" ? normalizeResultCurrency(entry?.resultCurrency) : null) || fallbackCurrency
    : null;
  return { mode, currency, legacy: !storedMode };
}

export function resultMatchesUnit(entry, targetMode, targetCurrency) {
  if (!entry || typeof entry.r !== "number" || !isFinite(entry.r)) return false;
  const storedMode = normalizeResultMode(entry.resultMode);
  if (!storedMode) return true;
  if (storedMode !== targetMode) return false;
  if (storedMode === "currency") {
    const storedCurrency = normalizeResultCurrency(entry.resultCurrency);
    return !storedCurrency || storedCurrency === targetCurrency;
  }
  return true;
}

export function resultEntriesForUnit(entries, targetMode, targetCurrency) {
  return (entries || []).filter((entry) => resultMatchesUnit(entry, targetMode, targetCurrency));
}

export function countExcludedResultEntries(entries, targetMode, targetCurrency) {
  return (entries || []).filter(
    (entry) => typeof entry?.r === "number" && isFinite(entry.r) && !resultMatchesUnit(entry, targetMode, targetCurrency)
  ).length;
}

export function formatResult(value, measureMode, currencyCode) {
  if (value === null || value === void 0) return "\u2014";
  if (measureMode === "R") {
    const v2 = Math.round(value * 10) / 10;
    return `${v2 > 0 ? "+" : ""}${v2}R`;
  }
  const cur = findCurrency(currencyCode);
  const v = Math.round(value);
  const sign = v > 0 ? "+" : v < 0 ? "-" : "";
  const abs = groupThousands(Math.abs(v));
  return cur.prefix ? `${sign}${cur.symbol}${abs}` : `${sign}${abs} ${cur.symbol}`;
}

export function formatStoredResult(entry, fallbackMode, fallbackCurrency) {
  if (!entry || entry.r === null || entry.r === void 0) return "\u2014";
  const meta = getStoredResultMeta(entry, fallbackMode, fallbackCurrency);
  return formatResult(entry.r, meta.mode, meta.currency || fallbackCurrency);
}

export function formatStrategyTotal(value, measureMode, currencyCode) {
  if (value === null || value === void 0 || !isFinite(value)) return "\u2014";
  const rounded = Math.round(value * 100) / 100;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "-" : "";
  const abs = Math.abs(rounded);
  const amount = abs.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  if (measureMode === "R") return `${sign}${amount}R`;
  const cur = findCurrency(currencyCode);
  return cur.prefix ? `${sign}${cur.symbol}${amount}` : `${sign}${amount} ${cur.symbol}`;
}

export function formatPriceValue(v) {
  if (v == null || isNaN(v)) return "\u2014";
  if (Math.abs(v) >= 1e3) return groupThousands(Math.round(v));
  if (Math.abs(v) >= 1) return (Math.round(v * 100) / 100).toString();
  return (Math.round(v * 1e4) / 1e4).toString();
}

export function formatBalance(value, currencyCode) {
  const cur = findCurrency(currencyCode);
  const v = Math.round(value);
  const sign = v < 0 ? "-" : "";
  const abs = groupThousands(Math.abs(v));
  return cur.prefix ? `${sign}${cur.symbol}${abs}` : `${sign}${abs} ${cur.symbol}`;
}

export function hasRealizedRR(entry) {
  return !!entry && typeof entry.realizedRR === "number" && !isNaN(entry.realizedRR) && isFinite(entry.realizedRR);
}

export function entriesWithRealizedRR(entries) {
  return (entries || []).filter(hasRealizedRR);
}

export function unitSymbol(measureMode, currencyCode) {
  return measureMode === "R" ? "R" : findCurrency(currencyCode).symbol;
}
