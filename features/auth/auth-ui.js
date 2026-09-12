import { useState, useEffect } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { User, KeyRound, Eye, EyeOff } from "lucide-react";
import { BASE, LOSS } from "../../config/app-config.js?v=1";
import { LogoMark, Wordmark } from "../../ui/brand.js?v=1";

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

export { AuthScreen, LegacyMigratePrompt, BootIntro };
