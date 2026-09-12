// mind.exe — shared UI primitives and screenshot viewer.
// Presentational/browser UI only; no profile persistence or Firebase writes.

import { useEffect, useState } from "react";
import { Download, X as XIcon } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import { BASE } from "../config/app-config.js?v=1";

export function Pill({ active, children, onClick, accent }) {
  return /* @__PURE__ */ jsx(
    "button",
    {
      onClick,
      className: "px-3.5 py-1.5 rounded-full text-[12px] transition-[background,color,border,transform] duration-200 active:scale-[0.98] whitespace-nowrap shrink-0",
      style: {
        background: active ? BASE.surface2 : "transparent",
        color: active ? BASE.ink : BASE.inkDim,
        border: active ? `1px solid ${BASE.line}` : "1px solid transparent",
        boxShadow: active ? "inset 0 1px 0 rgba(255,255,255,0.025)" : "none"
      },
      children
    }
  );
}
export function Card({ children, className = "", glowing = false, accent, style = {} }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `rounded-[21px] p-4 transition-colors duration-250 break-inside-avoid ${className}`,
      style: {
        background: glowing ? `linear-gradient(180deg, ${BASE.surface2} 0%, ${BASE.surface} 100%)` : BASE.surface,
        border: `1px solid ${BASE.line}`,
        boxShadow: glowing ? `0 14px 34px -24px ${accent || BASE.ink}28, inset 0 1px 0 rgba(255,255,255,0.035)` : "inset 0 1px 0 rgba(255,255,255,0.018)",
        ...style
      },
      children
    }
  );
}
export function Toast({ text }) {
  if (!text) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full text-xs toast-in",
      style: { top: "calc(env(safe-area-inset-top, 0px) + 12px)", background: "rgba(14,14,16,.96)", border: `1px solid ${BASE.line}`, color: BASE.ink, boxShadow: "0 10px 28px rgba(0,0,0,0.42)", backdropFilter: "blur(14px)" },
      children: text
    }
  );
}
function openScreenshotPreview(src, alt = "") {
  if (!src || typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("mindexe:preview-screenshot", { detail: { src, alt } }));
}
async function downloadScreenshotFile(src, alt = "mind-exe-screenshot") {
  if (!src || typeof document === "undefined") return;
  const safeName = String(alt || "mind-exe-screenshot")
    .replace(/[^\w\u0400-\u04FF.-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80) || "mind-exe-screenshot";
  let href = src;
  let revoke = null;
  let ext = "png";
  try {
    const match = /^data:image\/([a-zA-Z0-9.+-]+);/.exec(src);
    if (match?.[1]) {
      const type = match[1].toLowerCase();
      ext = type === "jpeg" ? "jpg" : type === "svg+xml" ? "svg" : type;
    }
    const response = await fetch(src);
    const blob = await response.blob();
    if (blob?.type?.startsWith("image/")) {
      const type = blob.type.split("/")[1]?.toLowerCase();
      if (type) ext = type === "jpeg" ? "jpg" : type === "svg+xml" ? "svg" : type;
      href = URL.createObjectURL(blob);
      revoke = href;
    }
  } catch (_) {
  }
  try {
    const a = document.createElement("a");
    a.href = href;
    a.download = `${safeName}.${ext}`;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    if (revoke) setTimeout(() => URL.revokeObjectURL(revoke), 1500);
  }
}
export function ScreenshotPreviewHost() {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const onPreview = (e) => {
      const src = e?.detail?.src;
      if (!src) return;
      setPreview({ src, alt: e?.detail?.alt || "" });
    };
    window.addEventListener("mindexe:preview-screenshot", onPreview);
    return () => window.removeEventListener("mindexe:preview-screenshot", onPreview);
  }, []);

  useEffect(() => {
    if (!preview) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setPreview(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [preview]);

  if (!preview) return null;

  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "fixed inset-0 z-[140] flex flex-col",
      onClick: () => setPreview(null),
      style: {
        background: "rgba(0,0,0,0.96)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)"
      },
      children: [
        /* @__PURE__ */ jsxs("div", {
          className: "flex items-center justify-between px-4 shrink-0",
          style: {
            paddingTop: "calc(env(safe-area-inset-top, 0px) + 12px)",
            paddingBottom: 10
          },
          children: [
            /* @__PURE__ */ jsx("div", {
              className: "text-[10px] uppercase tracking-[0.14em] truncate pr-4",
              style: { color: BASE.inkFaint },
              children: preview.alt || "Screenshot"
            }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
              /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: async (e) => {
                  e.stopPropagation();
                  await downloadScreenshotFile(preview.src, preview.alt || "mind-exe-screenshot");
                },
                "aria-label": "Скачать",
                title: "Скачать",
                className: "w-10 h-10 rounded-full flex items-center justify-center active:scale-[0.96]",
                style: {
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: BASE.ink
                },
                children: /* @__PURE__ */ jsx(Download, { size: 18 })
              }),
              /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: (e) => {
                  e.stopPropagation();
                  setPreview(null);
                },
                "aria-label": "Закрыть",
                className: "w-10 h-10 rounded-full flex items-center justify-center active:scale-[0.96]",
                style: {
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.06)",
                  color: BASE.ink
                },
                children: /* @__PURE__ */ jsx(XIcon, { size: 19 })
              })
            ] })
          ]
        }),
        /* @__PURE__ */ jsx("div", {
          className: "flex-1 min-h-0 overflow-auto flex items-center justify-center px-3 pb-3",
          onClick: () => setPreview(null),
          style: {
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x pan-y"
          },
          children: /* @__PURE__ */ jsx("img", {
            src: preview.src,
            alt: preview.alt || "Screenshot",
            draggable: false,
            onClick: (e) => e.stopPropagation(),
            className: "block object-contain select-none",
            style: {
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              borderRadius: 12,
              boxShadow: "0 24px 70px rgba(0,0,0,0.55)"
            }
          })
        })
      ]
    }
  );
}
export function ScreenshotImage({ src, alt, className = "", style = {}, onClick }) {
  const open = (e) => {
    e?.stopPropagation?.();
    onClick?.(e);
    openScreenshotPreview(src, alt);
  };
  return /* @__PURE__ */ jsx("img", {
    src,
    alt,
    onClick: open,
    draggable: false,
    className: `${className} cursor-zoom-in`,
    style,
    role: "button",
    tabIndex: 0,
    onKeyDown: (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(e);
      }
    }
  });
}

export function Skeleton({ w = "100%", h = 12, className = "", style = {} }) {
  return /* @__PURE__ */ jsx("div", { className: `skel ${className}`, style: { width: w, height: h, ...style } });
}
export function SkeletonLines({ lines = 3, gap = 8 }) {
  // Последняя строка короче: ровный блок из одинаковых полос читается как таблица,
  // а не как текст, который вот-вот появится.
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col", style: { gap }, children: Array.from({ length: lines }, (_, i) => /* @__PURE__ */ jsx(Skeleton, { w: i === lines - 1 ? "62%" : "100%", h: 11 }, i)) });
}
export function EmptyState({ icon: Icon, title, hint, actionLabel, onAction, accent, compact = false }) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex flex-col items-center text-center ${compact ? "py-8" : "py-14"} px-6`,
      children: [
        Icon && /* @__PURE__ */ jsx(
          "span",
          {
            className: "flex items-center justify-center rounded-full mb-4",
            style: { width: 48, height: 48, border: `1px solid ${BASE.line}`, background: BASE.surface },
            children: /* @__PURE__ */ jsx(Icon, { size: 20, style: { color: BASE.inkFaint } })
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-[13px] mb-1.5", style: { color: BASE.ink, fontFamily: "var(--font-display)", fontWeight: 600 }, children: title }),
        hint && /* @__PURE__ */ jsx("p", { className: "text-[11px] leading-relaxed max-w-[280px]", style: { color: BASE.inkFaint }, children: hint }),
        actionLabel && onAction && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: onAction,
            className: "mt-5 px-5 py-2.5 rounded-xl text-[12px] transition-opacity duration-150 active:opacity-70",
            style: { background: accent || BASE.ink, color: BASE.bg, fontWeight: 600 },
            children: actionLabel
          }
        )
      ]
    }
  );
}
export function StatCard({ label, value, accent }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex-1 rounded-[16px] px-3.5 py-3.5 min-w-0", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.018)" }, children: [
    /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.13em] mb-2 truncate", style: { color: BASE.inkFaint }, children: label }),
    /* @__PURE__ */ jsx("div", { className: "text-[25px] leading-none truncate", style: { color: accent, fontFamily: "var(--font-mono)", fontWeight: 500 }, children: value })
  ] });
}
