import { Component, useState, useRef, useEffect } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { X as XIcon, AlertTriangle, Coins, User, RotateCcw } from "lucide-react";
import { BASE, WIN, LOSS } from "../config/app-config.js?v=4.9.0";
import { groupThousands } from "../core/trade-math.js?v=4.9.0";
import { LogoMark, Wordmark } from "./brand.js?v=4.9.0";
import { EmptyState } from "./primitives.js?v=4.9.0";

const relTime = (date) => {
  const diff = Math.floor((Date.now() - date.getTime()) / 864e5);
  if (diff <= 0) return "Сегодня";
  if (diff === 1) return "Вчера";
  if (diff < 7) return `${diff} дн. назад`;
  return `${Math.floor(diff / 7)} нед. назад`;
};

var SPLASH_POSTER_IMG = "./splash-poster.jpg?v=4.9.0";
// V4.6.13: новый splash-видеофон заменяет прежний «глаз». Сам каркас splash screen,
// логотип, оверлеи, fade-out и общая анимационная логика сохранены без изменений.
// Видео остаётся sibling-файлом рядом с index.html. Query string нужен как cache-buster:
// iOS PWA иначе может продолжать показывать старый splash.mp4.
// Встроенный SPLASH_POSTER_IMG — первый кадр этого же видео; если autoplay не сработает,
// экран всё равно остаётся в новой визуальной концепции.
var SPLASH_VIDEO_SRC = "./splash.mp4?v=4.9.0";
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
          className: "flex-1 h-11 rounded-[12px] text-sm flex items-center justify-center gap-2 active:scale-[0.98]",
          style: { background: BASE.ink, color: "#050505", fontWeight: 600 },
          children: [
            /* @__PURE__ */ jsx(RotateCcw, { size: 14 }),
            isConflict
              ? isEn ? "Load latest data" : "Загрузить свежие данные"
              : isEn ? "Retry load" : "Повторить загрузку"
          ]
        }),
        /* @__PURE__ */ jsx("button", {
          type: "button",
          onClick: onLogout,
          className: "px-4 h-11 rounded-[12px] text-sm active:scale-[0.98]",
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
      className: "flex items-center gap-1.5 pl-2.5 pr-3 h-9 rounded-[10px] transition-all duration-150 active:scale-[0.98]",
      style: { border: `1px solid ${BASE.line}`, background: BASE.surface2, boxShadow: "none" },
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
      className: "w-10 h-10 rounded-[12px] flex items-center justify-center transition-all duration-150 active:scale-[0.98]",
      style: {
        border: `1px solid ${BASE.line}`,
        background: BASE.surface2,
        boxShadow: "none"
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
      className: "w-12 h-12 rounded-[14px] flex items-center justify-center transition-all duration-150 active:scale-[0.97]",
      style: {
        background: BASE.ink,
        border: "1px solid rgba(255,255,255,0.04)",
        boxShadow: "0 8px 22px rgba(0,0,0,0.28)"
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
          className: "w-full max-w-md rounded-t-[20px] px-5 pt-4 pb-8 vscroll",
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

function DesktopSidebar({ nav, tab, setTab, accent, mindCoins, onWalletClick }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "hidden md:flex fixed left-0 top-0 bottom-0 w-[232px] flex-col px-3 pt-6 pb-5 z-20",
      style: { background: "rgba(8,8,9,0.92)", borderRight: `1px solid ${BASE.line}`, backdropFilter: "blur(14px)" },
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
              className: "relative flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-left transition-all duration-150",
              style: { background: active ? BASE.surface2 : "transparent", border: `1px solid ${active ? BASE.line : "transparent"}` },
              children: [
                /* @__PURE__ */ jsx(n.icon, { size: 16, strokeWidth: 2, style: { color: active ? accent : BASE.inkFaint } }),
                /* @__PURE__ */ jsx("span", { className: "text-[13px]", style: { color: active ? BASE.ink : BASE.inkDim, fontFamily: "var(--font-display)", fontWeight: active ? 600 : 500 }, children: n.label })
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
        /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed mb-3", style: { color: BASE.inkDim }, children: "Интерфейс столкнулся с ошибкой. Сохранённые данные не сбрасываются." }),
        this.state.error?.message && /* @__PURE__ */ jsx("div", { className: "mb-5 px-3 py-2.5 rounded-[10px] text-[10px] text-left break-words", style: { color: BASE.inkFaint, background: BASE.surface, border: `1px solid ${BASE.line}`, fontFamily: "var(--font-mono)" }, children: this.state.error.message }),
        /* @__PURE__ */ jsx("button", { onClick: () => window.location.reload(), className: "w-full h-11 rounded-[12px] text-sm", style: { background: BASE.ink, color: "#000", fontWeight: 600 }, children: "Перезапустить" })
      ] })
    });
  }
}

export { BootLoading, ProfileLoadErrorScreen, Splash, WalletBadge, ProfileBadge, MobileNavItem, MobileNavPrimaryButton, WalletSheet, DesktopSidebar, AppErrorBoundary };
