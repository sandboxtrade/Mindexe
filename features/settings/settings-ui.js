// mind.exe — settings/profile UI.
// All data mutations are callback-driven; persistence stays in app.js.

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle, Check, Download, LogOut, Trash2, Upload, User, Volume2, VolumeX
} from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
import { BASE, LOSS, ACCENTS } from "../../config/app-config.js?v=1";
import { CURRENCIES } from "../../core/trade-math.js?v=1";

function SettingsSection({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "mb-6 break-inside-avoid", children });
}
// V0.5 — заголовок группы настроек: крупнее и с отбивкой сверху, чтобы разделы читались
// как блоки, а не как один сплошной список подписей.
function SettingsGroupTitle({ children }) {
  return /* @__PURE__ */ jsx("div", { className: "text-[12px] mt-2 mb-3 break-inside-avoid", style: { color: BASE.inkDim, fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.02em", breakAfter: "avoid" }, children });
}
function SettingsSectionLabel({ children }) {
  return /* @__PURE__ */ jsx("label", { className: "block text-[11px] uppercase tracking-wide mb-2.5", style: { color: BASE.inkFaint, fontFamily: "var(--font-display)" }, children });
}
export function Settings({
  accent,
  setAccent,
  name,
  setName,
  onThemeChange,
  soundOn,
  setSoundOn,
  weeklyGoal,
  setWeeklyGoal,
  onExport,
  onImport,
  onExportBackup,
  onImportBackup,
  onReset,
  onFullReset,
  measureMode,
  setMeasureMode,
  currency,
  setCurrency,
  tradingAsset,
  setTradingAsset,
  strategyNote,
  setStrategyNote,
  startingCapital,
  setStartingCapital,
  username,
  accountProvider,
  onLogout,
  lang,
  setLang,
  t
}) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmFullReset, setConfirmFullReset] = useState(false);
  const importInputRef = useRef(null);
  const importBackupInputRef = useRef(null);
  const [capitalDraft, setCapitalDraft] = useState(String(startingCapital));
  const capitalFocusedRef = useRef(false);
  const [strategyDraft, setStrategyDraft] = useState(strategyNote || "");
  const strategyFocusedRef = useRef(false);
  useEffect(() => {
    if (!strategyFocusedRef.current) setStrategyDraft(strategyNote || "");
  }, [strategyNote]);
  // V0.6 — черновик уходит в глобальный state по blur. Если человек печатает и сразу
  // переключает вкладку, blur может не сработать (компонент размонтируется), и текст теряется.
  // Ref держит актуальный черновик, а cleanup сохраняет его при уходе с экрана настроек.
  const strategyLatestRef = useRef(strategyNote || "");
  strategyLatestRef.current = strategyDraft;
  const strategySavedRef = useRef(strategyNote || "");
  strategySavedRef.current = strategyNote || "";
  useEffect(() => {
    return () => {
      const v = (strategyLatestRef.current || "").trim();
      if (v !== strategySavedRef.current) setStrategyNote(v);
    };
  }, []);
  useEffect(() => {
    // Never re-sync the draft while the field has focus \u2014 an external re-render (autosave finishing,
    // a coin award, a theme change) would otherwise stomp what the person is halfway through typing.
    if (!capitalFocusedRef.current) setCapitalDraft(String(startingCapital));
  }, [startingCapital]);
  const Section = SettingsSection;
  const SectionLabel = SettingsSectionLabel;
  return /* @__PURE__ */ jsxs("div", { className: "stagger", children: [
    /* @__PURE__ */ jsxs("h2", { className: "sec-cap text-[10px] text-center mb-5", style: { color: BASE.inkDim, fontFamily: "var(--font-display)", fontWeight: 400 }, children: [
      " ",
      t.settings.title
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "lg:columns-2 lg:gap-6", children: [
    /* V0.5 — настройки сгруппированы по смыслу: раньше 11 секций шли одним потоком, в котором
       аккаунт стоял между стратегией и именем, а язык — перед торговыми настройками. Порядок и
       содержимое самих секций не изменены, добавлены только заголовки групп. */
    /* @__PURE__ */ jsx(SettingsGroupTitle, { children: t.settings.groupProfile }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.account }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 py-3 rounded-xl mb-2", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { color: BASE.ink }, children: [
          /* @__PURE__ */ jsx(User, { size: 15, style: { color: accent } }),
          " ",
          username || "\u2014"
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase", style: { color: BASE.inkFaint, fontFamily: "var(--font-mono)" }, children: accountProvider || "\u2014" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: onLogout, className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: BASE.inkDim }, children: [
        /* @__PURE__ */ jsx(LogOut, { size: 15 }),
        " ",
        t.settings.logout
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mt-2", style: { color: BASE.inkFaint }, children: t.settings.localAccountNote })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.operatorName }),
      /* @__PURE__ */ jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: t.settings.operatorPlaceholder, className: "w-full bg-transparent border-b outline-none py-2 text-sm", style: { borderColor: BASE.line, color: BASE.ink } })
    ] }),
    /* @__PURE__ */ jsx(SettingsGroupTitle, { children: t.settings.groupTrading }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.tradingAssetLabel }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: [
        { id: "crypto", label: t.settings.tradingAssetCrypto },
        { id: "forex", label: t.settings.tradingAssetForex },
        { id: "stocks", label: t.settings.tradingAssetStocks }
      ].map((o) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setTradingAsset(o.id),
          className: "px-4 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
          style: { background: tradingAsset === o.id ? `${accent}12` : "transparent", color: tradingAsset === o.id ? accent : BASE.inkDim, border: `1px solid ${tradingAsset === o.id ? accent + "40" : BASE.line}` },
          children: o.label
        },
        o.id
      )) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mt-2", style: { color: BASE.inkFaint }, children: t.settings.tradingAssetNote })
    ] }),
    /* V0.4 — описание стратегии. Локальный черновик + сохранение по blur: писать в глобальный
       state на каждое нажатие клавиши здесь нельзя, иначе автосейв Firestore будет срабатывать
       на каждый символ. Тот же приём, что уже используется для startingCapital выше. */
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.strategyLabel }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: strategyDraft,
          onChange: (e) => setStrategyDraft(e.target.value.slice(0, 600)),
          onFocus: () => {
            strategyFocusedRef.current = true;
          },
          onBlur: () => {
            strategyFocusedRef.current = false;
            const v = strategyDraft.trim();
            if (v !== (strategyNote || "")) setStrategyNote(v);
          },
          rows: 4,
          maxLength: 600,
          placeholder: t.settings.strategyPlaceholder,
          className: "w-full px-4 py-3 rounded-xl text-sm outline-none resize-none",
          style: { background: BASE.surface, border: `1px solid ${BASE.line}`, color: BASE.ink }
        }
      ),
      /* @__PURE__ */ jsx("p", { className: "text-xs mt-2", style: { color: BASE.inkFaint }, children: t.settings.strategyNote })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.resultUnits }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 mb-3", children: [{ id: "R", label: t.settings.rMultiplier }, { id: "currency", label: t.settings.currencyLabel }].map((m) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMeasureMode(m.id),
          className: "px-4 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
          style: { background: measureMode === m.id ? `${accent}12` : "transparent", color: measureMode === m.id ? accent : BASE.inkDim, border: `1px solid ${measureMode === m.id ? accent + "40" : BASE.line}` },
          children: m.label
        },
        m.id
      )) }),
      measureMode === "currency" && /* @__PURE__ */ jsxs("div", { className: "tab-content", children: [
        /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap mb-3", children: CURRENCIES.map((c) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setCurrency(c.code),
            className: "px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
            style: { background: currency === c.code ? `${accent}12` : "transparent", color: currency === c.code ? accent : BASE.inkDim, border: `1px solid ${currency === c.code ? accent + "40" : BASE.line}`, fontFamily: "var(--font-mono)" },
            children: [
              c.symbol,
              " ",
              c.code
            ]
          },
          c.code
        )) }),
        /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.startingCapital }),
        /* @__PURE__ */ jsx(
          "input",
          {
            value: capitalDraft,
            onFocus: (e) => {
              capitalFocusedRef.current = true;
              // tapping the field selects the current amount, so the first keystroke replaces it
              // instead of appending to it \u2014 the behaviour people expect from an amount field
              try {
                e.target.select();
              } catch (_) {
              }
            },
            onChange: (e) => {
              // accept anything that can still become a valid non-negative number: "", "1", "12.",
              // "0.5". Nothing is coerced here, so the field can be emptied and retyped freely.
              const raw = e.target.value.replace(/[^0-9.,]/g, "").replace(",", ".");
              if (raw !== "" && !/^\d*\.?\d*$/.test(raw)) return;
              setCapitalDraft(raw.replace(/^0+(?=\d)/, ""));
            },
            onKeyDown: (e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            },
            onBlur: () => {
              capitalFocusedRef.current = false;
              const parsed = parseFloat(capitalDraft);
              // empty / "." / garbage \u2192 keep the last valid value; negatives are impossible by input
              // filtering, but clamp anyway so no NaN or negative can ever reach the R / P&L math.
              const next = Number.isFinite(parsed) && parsed >= 0 ? parsed : startingCapital;
              setStartingCapital(next);
              setCapitalDraft(String(next));
            },
            type: "text",
            inputMode: "decimal",
            className: "w-full bg-transparent border-b outline-none py-2 text-sm",
            style: { borderColor: BASE.line, color: BASE.ink, fontFamily: "var(--font-mono)" }
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx(SettingsGroupTitle, { children: t.settings.groupApp }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.language }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: [{ id: "ru", label: t.settings.russian }, { id: "en", label: t.settings.english }].map((l) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setLang(l.id),
          className: "flex-1 px-4 py-1.5 rounded-full text-sm transition-all duration-200 active:scale-95",
          style: { background: lang === l.id ? `${accent}12` : "transparent", color: lang === l.id ? accent : BASE.inkDim, border: `1px solid ${lang === l.id ? accent + "40" : BASE.line}` },
          children: l.label
        },
        l.id
      )) }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mt-2", style: { color: BASE.inkFaint }, children: t.settings.languageNote })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.accentColor }),
      /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: ACCENTS.map((a) => /* @__PURE__ */ jsxs("button", { onClick: () => {
        setAccent(a);
        onThemeChange(a.name);
      }, className: "flex flex-col items-center gap-1.5 transition-transform duration-150 active:scale-90", children: [
        /* @__PURE__ */ jsx("span", { className: "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300", style: { background: a.value, boxShadow: accent === a.value ? `0 0 0 3px ${BASE.bg}, 0 0 0 4.5px ${a.value}60` : "none" }, children: accent === a.value && /* @__PURE__ */ jsx(Check, { size: 16, color: "#06120F" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px]", style: { color: BASE.inkFaint }, children: a.name })
      ] }, a.name)) })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.sound }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setSoundOn(!soundOn), className: "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200", style: { border: `1px solid ${BASE.line}`, background: BASE.surface }, children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2.5 text-sm", style: { color: BASE.ink }, children: [
          soundOn ? /* @__PURE__ */ jsx(Volume2, { size: 16, style: { color: accent } }) : /* @__PURE__ */ jsx(VolumeX, { size: 16, style: { color: BASE.inkFaint } }),
          t.settings.soundToggleLabel
        ] }),
        /* @__PURE__ */ jsx("span", { className: "w-9 h-5 rounded-full relative transition-all duration-200", style: { background: soundOn ? accent : BASE.line }, children: /* @__PURE__ */ jsx("span", { className: "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200", style: { left: soundOn ? "18px" : "2px" } }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SettingsGroupTitle, { children: t.settings.groupData }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.data }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mb-2.5", style: { color: BASE.inkFaint }, children: t.settings.dataNote }),
      /* @__PURE__ */ jsxs("button", { onClick: onExportBackup, className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-2 transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${accent}40`, background: `${accent}0D`, color: BASE.ink }, children: [
        /* @__PURE__ */ jsx(Download, { size: 15, style: { color: accent } }),
        " ",
        t.settings.fullBackup
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => importBackupInputRef.current?.click(), className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-3 transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${accent}40`, background: `${accent}0D`, color: BASE.ink }, children: [
        /* @__PURE__ */ jsx(Upload, { size: 15, style: { color: accent } }),
        " ",
        t.settings.restoreBackup
      ] }),
      /* @__PURE__ */ jsx("input", { ref: importBackupInputRef, type: "file", accept: "application/json,.json", className: "hidden", onChange: (e) => {
        const f = e.target.files?.[0];
        e.target.value = "";
        if (f) onImportBackup(f);
      } }),
      /* @__PURE__ */ jsxs("button", { onClick: onExport, className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-2 transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: BASE.ink }, children: [
        /* @__PURE__ */ jsx(Download, { size: 15, style: { color: accent } }),
        " ",
        t.settings.exportJournalOnly
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => importInputRef.current?.click(), className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm mb-2 transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: BASE.ink }, children: [
        /* @__PURE__ */ jsx(Upload, { size: 15, style: { color: accent } }),
        " ",
        t.settings.importJournalOnly
      ] }),
      /* @__PURE__ */ jsx("input", { ref: importInputRef, type: "file", accept: "application/json,.json", className: "hidden", onChange: (e) => {
        const f = e.target.files?.[0];
        e.target.value = "";
        if (f) onImport(f);
      } }),
      confirmReset ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3 rounded-xl", style: { border: `1px solid ${LOSS}50`, background: `${LOSS}0D` }, children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 15, style: { color: LOSS } }),
        /* @__PURE__ */ jsx("span", { className: "text-xs flex-1", style: { color: BASE.ink }, children: t.settings.confirmClearJournal }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          onReset();
          setConfirmReset(false);
        }, className: "text-xs shrink-0", style: { color: LOSS }, children: t.settings.yes }),
        /* @__PURE__ */ jsx("button", { onClick: () => setConfirmReset(false), className: "text-xs shrink-0", style: { color: BASE.inkFaint }, children: t.settings.cancel })
      ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setConfirmReset(true), className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${BASE.line}`, background: BASE.surface, color: LOSS }, children: [
        /* @__PURE__ */ jsx(Trash2, { size: 15 }),
        " ",
        t.settings.clearJournal
      ] })
    ] }),
    /* @__PURE__ */ jsxs(Section, { children: [
      /* @__PURE__ */ jsx(SectionLabel, { children: t.settings.fullResetTitle }),
      /* @__PURE__ */ jsx("p", { className: "text-xs mb-3", style: { color: BASE.inkFaint }, children: t.settings.fullResetNote }),
      confirmFullReset ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-4 py-3 rounded-xl", style: { border: `1px solid ${LOSS}50`, background: `${LOSS}0D` }, children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 15, style: { color: LOSS } }),
        /* @__PURE__ */ jsx("span", { className: "text-xs flex-1", style: { color: BASE.ink }, children: t.settings.confirmFullReset }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          onFullReset();
          setConfirmFullReset(false);
        }, className: "text-xs shrink-0", style: { color: LOSS }, children: t.settings.yesReset }),
        /* @__PURE__ */ jsx("button", { onClick: () => setConfirmFullReset(false), className: "text-xs shrink-0", style: { color: BASE.inkFaint }, children: t.settings.cancel })
      ] }) : /* @__PURE__ */ jsxs("button", { onClick: () => setConfirmFullReset(true), className: "w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm transition-all duration-200 active:scale-[0.98]", style: { border: `1px solid ${LOSS}50`, background: `${LOSS}0D`, color: LOSS }, children: [
        /* @__PURE__ */ jsx(AlertTriangle, { size: 15 }),
        " ",
        t.settings.fullResetButton
      ] })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs break-inside-avoid", style: { color: BASE.inkFaint }, children: t.settings.footerNote })
    ] })
  ] });
}
