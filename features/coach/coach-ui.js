// mind.exe — AI Coach UI.
// AI state persistence is injected by app.js to keep persistence ownership unchanged.

import { useEffect, useRef, useState } from "react";
import {
  Sparkles, LineChart as LineChartIcon, Trash2, ShieldCheck, Send, Brain, Star,
  TrendingDown, Target, RotateCcw, Zap, Info
} from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import { BASE, WIN, LOSS } from "../../config/app-config.js?v=1";
import { Card } from "../../ui/primitives.js?v=2";
import { DecodeText, LogoSpinner } from "../../ui/brand.js?v=1";
import { aiBuildContext, aiHashContext, aiCompactRecentEntries } from "../../ai/context.js?v=1";
import { aiGenerateInsight, aiChatReply } from "../../ai/ai-service.js?v=1";

const ring = (accent) => `0 0 0 1px ${accent}35`;

export function Coach({ entries, analytics, accent, userId, lang, t, strategyNote, loadState, saveState }) {
  const [analysis, setAnalysis] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const loadedRef = useRef(false);
  const loadedForRef = useRef(null);
  const scrollRef = useRef(null);
  const lastContextHashRef = useRef(null);
  // V4.9: loadedRef was never reset when userId changed. On an account switch the save effect below
  // fired with the PREVIOUS user's analysis/chat still in state (the new load hadn't resolved yet)
  // and wrote it into the new account's AI document \u2014 a real cross-user data leak. The ref now
  // resets before each load, state is cleared immediately, and every save is checked against the
  // uid the state was actually loaded for.
  useEffect(() => {
    let cancelled = false;
    loadedRef.current = false;
    loadedForRef.current = null;
    setAnalysis("");
    setChatMessages([]);
    setError("");
    lastContextHashRef.current = null;
    if (!userId) return;
    loadState(userId).then((s) => {
      if (cancelled) return;
      setAnalysis(s.analysis || "");
      setChatMessages(Array.isArray(s.chatMessages) ? s.chatMessages : []);
      lastContextHashRef.current = s.lastContextHash || null;
      loadedForRef.current = userId;
      loadedRef.current = true;
    }).catch(() => {
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);
  useEffect(() => {
    if (!loadedRef.current || loadedForRef.current !== userId) return;
    saveState(userId, { analysis, chatMessages, lastContextHash: lastContextHashRef.current });
  }, [analysis, chatMessages, userId]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages, sending]);
  // Gemini request is only ever triggered by an explicit user action below (button press /
  // send message) — never inside a useEffect tied to entries/state, per the no-request-per-render
  // rule. runAnalyze also skips the network call entirely when the underlying stats haven't
  // changed since the last generated insight (context hash cache).
  const runAnalyze = async () => {
    if (analyzing || entries.length === 0) return;
    const context = aiBuildContext(entries, analytics, lang, strategyNote);
    const hash = aiHashContext(context);
    if (hash === lastContextHashRef.current && analysis) return;
    setAnalyzing(true);
    setError("");
    try {
      const text = await aiGenerateInsight(context);
      setAnalysis(text);
      lastContextHashRef.current = hash;
    } catch (e) {
      setError(t.coach.error);
    } finally {
      setAnalyzing(false);
    }
  };
  const sendMessage = async (overrideText) => {
    const text = (overrideText ?? chatInput).trim();
    if (!text || sending) return;
    setChatInput("");
    setError("");
    const nextMessages = [...chatMessages, { role: "user", content: text }];
    setChatMessages(nextMessages);
    setSending(true);
    try {
      const context = aiBuildContext(entries, analytics, lang, strategyNote);
      const recentTrades = aiCompactRecentEntries(entries, 15);
      const reply = await aiChatReply(context, recentTrades, nextMessages, text);
      setChatMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setError(t.coach.error);
    } finally {
      setSending(false);
    }
  };
  const quickQuestions = [
    { icon: Brain, text: t.coach.quick.lateCloses },
    { icon: Star, text: t.coach.quick.strengths },
    { icon: TrendingDown, text: t.coach.quick.losses },
    { icon: Target, text: t.coach.quick.discipline },
    { icon: RotateCcw, text: t.coach.quick.strategy },
    { icon: LineChartIcon, text: t.coach.quick.style }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "sec-cap text-[10px] text-center", style: { color: BASE.inkDim, fontFamily: "var(--font-display)", fontWeight: 400 }, children: /* @__PURE__ */ jsx(DecodeText, { text: t.coach.title }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { accent, className: "mb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-wide mb-3", style: { color: accent, fontFamily: "var(--font-display)" }, children: /* @__PURE__ */ jsx(DecodeText, { text: t.coach.analyzeTitle }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: analyzing ? /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 py-1", children: /* @__PURE__ */ jsx(LogoSpinner, { size: 20, accent }) }) : analysis ? /* @__PURE__ */ jsx("p", { className: "text-sm leading-relaxed whitespace-pre-wrap", style: { color: BASE.ink }, children: /* @__PURE__ */ jsx(DecodeText, { as: "span", text: analysis, maxTotalMs: 750 }) }) : /* @__PURE__ */ jsx("p", { className: "text-xs leading-relaxed", style: { color: BASE.inkFaint }, children: /* @__PURE__ */ jsx(DecodeText, { text: entries.length === 0 ? t.coach.analyzeNoEntries : t.coach.analyzeDesc }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "relative shrink-0 w-16 h-16 rounded-full flex items-center justify-center", style: { background: `radial-gradient(circle at 35% 30%, ${accent}30, transparent 72%)`, border: `1px solid ${accent}35`, boxShadow: ring(accent) }, children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-2 rounded-full", style: { border: `1px solid ${accent}25` } }),
          /* @__PURE__ */ jsx(Sparkles, { size: 20, style: { color: accent } })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: runAnalyze,
          disabled: analyzing || entries.length === 0,
          className: "w-full py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2",
          style: { border: `1px solid ${accent}40`, background: `linear-gradient(135deg, ${accent}30, ${accent}12)`, color: accent, fontFamily: "var(--font-display)" },
          children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 14 }),
            /* @__PURE__ */ jsx(DecodeText, { text: analyzing ? t.coach.analyzeBusy : t.coach.analyzeBtn })
          ]
        }
      ),
      entries.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mt-3 pt-3 text-[11px]", style: { borderTop: `1px solid ${BASE.line}`, color: BASE.inkFaint }, children: [
        /* @__PURE__ */ jsx(Info, { size: 12 }),
        /* @__PURE__ */ jsx(DecodeText, { text: t.coach.analyzeScopeInfo })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { accent, className: "mb-4 flex flex-col", style: { height: "52vh", maxHeight: 560 }, children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1", children: [
        /* @__PURE__ */ jsx("div", { className: "text-[11px] uppercase tracking-wide", style: { color: accent, fontFamily: "var(--font-display)" }, children: /* @__PURE__ */ jsx(DecodeText, { text: t.coach.chatTitle }) }),
        chatMessages.length > 0 && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              setChatMessages([]);
              setError("");
            },
            className: "flex items-center gap-1 text-[10px] transition-all active:scale-95",
            style: { color: BASE.inkFaint },
            title: t.coach.resetChat,
            children: [/* @__PURE__ */ jsx(Trash2, { size: 11 }), t.coach.resetChat]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mb-3", style: { color: BASE.inkFaint }, children: /* @__PURE__ */ jsx(DecodeText, { text: t.coach.chatDesc }) }),
      /* @__PURE__ */ jsxs("div", { ref: scrollRef, className: "flex-1 min-h-0 overflow-y-auto vscroll mb-3 pr-1", children: [
        chatMessages.length === 0 && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: quickQuestions.map((q, i) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => sendMessage(q.text),
            disabled: sending,
            className: "flex items-center gap-2 text-left p-2.5 rounded-xl text-[12px] leading-snug transition-all duration-200 active:scale-[0.97] disabled:opacity-40",
            style: { background: BASE.surface2, border: `1px solid ${BASE.line}`, color: BASE.ink },
            children: [
              /* @__PURE__ */ jsx("span", { className: "shrink-0 w-6 h-6 rounded-lg flex items-center justify-center", style: { background: `${accent}14`, color: accent }, children: /* @__PURE__ */ jsx(q.icon, { size: 13 }) }),
              /* @__PURE__ */ jsx(DecodeText, { text: q.text, maxTotalMs: 420 })
            ]
          },
          i
        )) }),
        chatMessages.map((m, i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: `mt-2.5 max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" ? "ml-auto" : ""}`,
            style: m.role === "user" ? { background: `${accent}14`, color: BASE.ink } : { background: BASE.surface2, color: BASE.ink },
            children: m.role === "assistant" ? /* @__PURE__ */ jsx(DecodeText, { text: m.content, maxTotalMs: 750 }) : m.content
          },
          i
        ))
      ] }),
      sending && /* @__PURE__ */ jsx("div", { className: "mb-2.5 max-w-[85%] rounded-xl px-3 py-2 flex items-center", style: { background: BASE.surface2 }, children: /* @__PURE__ */ jsx(LogoSpinner, { size: 18, accent }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            value: chatInput,
            onChange: (e) => setChatInput(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") sendMessage();
            },
            placeholder: t.coach.chatPlaceholder,
            className: "flex-1 bg-transparent outline-none text-sm px-3 py-2 rounded-xl",
            style: { border: `1px solid ${BASE.line}`, color: BASE.ink }
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => sendMessage(),
            disabled: sending || !chatInput.trim(),
            className: "shrink-0 p-2.5 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-40",
            style: { border: `1px solid ${accent}40`, background: `${accent}12`, color: accent },
            "aria-label": t.coach.send,
            children: /* @__PURE__ */ jsx(Send, { size: 15 })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[11px]", style: { color: BASE.inkFaint }, children: [
        /* @__PURE__ */ jsx(ShieldCheck, { size: 11 }),
        /* @__PURE__ */ jsx(DecodeText, { text: t.coach.disclaimer })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Card, { accent, className: "mb-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full animate-pulse", style: { background: WIN } }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs", style: { color: BASE.ink }, children: /* @__PURE__ */ jsx(DecodeText, { text: t.coach.statusReady }) }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px]", style: { color: BASE.inkFaint }, children: /* @__PURE__ */ jsx(DecodeText, { text: t.coach.statusOnline }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[11px]", style: { color: accent }, children: [
        /* @__PURE__ */ jsx(Zap, { size: 11 }),
        /* @__PURE__ */ jsx(DecodeText, { text: t.coach.modelLabel })
      ] })
    ] }),
    error && /* @__PURE__ */ jsx("p", { className: "text-xs text-center", style: { color: LOSS }, children: error })
  ] });
}
