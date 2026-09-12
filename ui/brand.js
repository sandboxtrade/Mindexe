// mind.exe — brand mark, wordmark and calm text reveal primitives.

import { useMemo } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { BASE } from "../config/app-config.js?v=4.9.0";

export function LogoMark({ size = 26, color, accent, animated = false }) {
  const c = color || BASE.ink;
  const dashProps = animated ? { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 } : {};
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 64 64", fill: "none", children: [
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M13 30 V19 Q13 14 18 14 H38 L47 14",
        stroke: c,
        strokeWidth: "6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...dashProps,
        style: animated ? { animation: "drawMark 0.8s ease forwards" } : void 0
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M51 34 V45 Q51 50 46 50 H26 L17 50",
        stroke: c,
        strokeWidth: "6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...dashProps,
        style: animated ? { animation: "drawMark 0.8s ease 0.2s forwards" } : void 0
      }
    ),
    /* @__PURE__ */ jsx(
      "path",
      {
        d: "M13 32 H23 L27 23 L32 41 L36 32 H51",
        stroke: c,
        strokeWidth: "2.6",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...dashProps,
        style: animated ? { animation: "drawMark 0.7s ease 0.75s forwards" } : void 0
      }
    ),
    /* @__PURE__ */ jsx("rect", { x: "45", y: "8", width: "3.5", height: "3.5", fill: c, opacity: "0.55", style: animated ? { animation: "dotIn 0.3s ease 1.2s backwards" } : void 0 }),
    /* @__PURE__ */ jsx("rect", { x: "54", y: "17", width: "2.5", height: "2.5", fill: c, opacity: "0.35", style: animated ? { animation: "dotIn 0.3s ease 1.32s backwards" } : void 0 }),
    /* @__PURE__ */ jsx("rect", { x: "9", y: "45", width: "2.5", height: "2.5", fill: c, opacity: "0.35", style: animated ? { animation: "dotIn 0.3s ease 1.44s backwards" } : void 0 })
  ] });
}
export function LogoSpinner({ size = 22, color, accent }) {
  return /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", animation: "logoPulseFade 1.1s ease-in-out infinite" }, children: /* @__PURE__ */ jsx(LogoMark, { size, color, accent }) });
}
// ---- DecodeText.js -----------------------------------------------------------
// Reveal effect for text/numbers. Was a per-character random-glyph "decrypt" animation; replaced
// with a calmer word-by-word blur+fade cascade — each word starts slightly blurred, dimmed and
// offset, and settles into place left-to-right. No random noise, no per-frame re-renders (it's a
// single CSS animation per word via animation-delay, so the browser drives it, not JS timers).
// Total cascade length is capped via maxTotalMs regardless of word count, so a short label and a
// long AI paragraph both settle in roughly the same perceived time. Respects
// prefers-reduced-motion by skipping straight to the final text with no animation.
var decodeReduceMotion = typeof window !== "undefined" && window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
// Long text (an AI paragraph, a chat reply) is rendered as one single fade instead of a
// per-word cascade: with enough words the per-word stagger step shrinks to almost nothing, so
// a big chunk of the paragraph ends up mid-fade at once — a screenshot taken in that window
// shows a messy "half the words sharp, half still blurred, no clear order" mix rather than a
// clean wave. One synchronized block-fade reads as calm regardless of length or timing.
var DECODE_WORD_CASCADE_LIMIT = 24;
export function DecodeText({ text, as = "span", className = "", style, maxTotalMs = 520 }) {
  const value = text == null ? "" : String(text);
  const reduced = decodeReduceMotion && decodeReduceMotion.matches;
  const tokens = useMemo(() => value.split(/(\s+)/), [value]);
  const wordCount = useMemo(() => tokens.filter((w) => w.trim()).length || 1, [tokens]);
  if (reduced) return /* @__PURE__ */ jsx(as, { className, style, children: value });
  if (wordCount > DECODE_WORD_CASCADE_LIMIT) {
    return /* @__PURE__ */ jsx(as, { className, style: { ...style, display: style?.display || "inline-block", animation: "softReveal 0.55s cubic-bezier(0.22,0.61,0.36,1) both" }, children: value });
  }
  const stepMs = Math.max(10, Math.min(38, maxTotalMs / wordCount));
  let wordIndex = -1;
  return /* @__PURE__ */ jsx(as, { className, style, children: tokens.map((w, i) => {
    if (!w.trim()) return w;
    wordIndex++;
    return /* @__PURE__ */ jsx("span", { style: { display: "inline-block", animation: `softReveal 0.5s cubic-bezier(0.22,0.61,0.36,1) ${wordIndex * stepMs}ms both` }, children: w }, i);
  }) });
}
export function Wordmark({ accent, size = 15, animated = false, wide = false }) {
  const c = BASE.ink;
  return /* @__PURE__ */ jsxs("span", { className: "flex items-baseline", style: { fontFamily: "var(--font-display)", fontWeight: 500, fontSize: size, letterSpacing: wide ? "0.28em" : void 0, color: c, animation: animated ? "riseIn 0.5s ease 1.55s backwards" : void 0 }, children: [
    "mind",
    /* @__PURE__ */ jsxs("span", { className: "relative", style: { color: c }, children: [
      ".exe",
      /* @__PURE__ */ jsx("span", { className: "absolute left-0 -bottom-[3px] w-full h-px", style: { background: `repeating-linear-gradient(90deg, ${c} 0, ${c} 3px, transparent 3px, transparent 6px)` } })
    ] })
  ] });
}
