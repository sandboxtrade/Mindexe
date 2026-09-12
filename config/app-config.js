// mind.exe — shared visual/app constants extracted from app.js.
// Pure configuration only: no persistence, auth or Firestore behavior lives here.

export const BASE = {
  bg: "#000000",
  surface: "#09090A",
  surface2: "#111113",
  line: "#202026",
  ink: "#F7F7F8",
  inkDim: "#A0A0A8",
  inkFaint: "#686871"
};
export const WIN = "#31E98F";
export const LOSS = "#FF625C";
export const FLAT = "#84848C";
export const WARN = "#D9A24A";
export const ACCENTS = [
  { name: "\u0411\u0438\u0440\u044E\u0437\u043E\u0432\u044B\u0439", value: "#37D7C0", dim: "#174F47" },
  { name: "\u042F\u043D\u0442\u0430\u0440\u043D\u044B\u0439", value: "#D8A04A", dim: "#5A421F" },
  { name: "\u0424\u0438\u043E\u043B\u0435\u0442\u043E\u0432\u044B\u0439", value: "#9285E6", dim: "#38336E" },
  { name: "\u0420\u043E\u0437\u043E\u0432\u044B\u0439", value: "#DD7397", dim: "#5B2F40" },
  { name: "\u041A\u043E\u0441\u043C\u043E\u0441", value: "#F4F4F6", dim: "#34343A", cosmic: true },
  { name: "\u0422\u0435\u0440\u043C\u0438\u043D\u0430\u043B", value: "#31E98F", dim: "#124E34" }
];
export const INSTRUMENTS = [
  { category: "\u041A\u0440\u0438\u043F\u0442\u043E", items: ["BTC/USD", "ETH/USD", "SOL/USD", "BNB/USD", "XRP/USD", "DOGE/USD", "TON/USD"] },
  { category: "\u0410\u043A\u0446\u0438\u0438", items: ["AAPL", "TSLA", "NVDA", "AMZN", "MSFT", "GOOGL", "META", "NFLX"] },
  { category: "\u0424\u043E\u0440\u0435\u043A\u0441", items: ["EUR/USD", "GBP/USD", "USD/JPY", "GBP/JPY", "USD/CHF", "AUD/USD", "USD/CAD"] },
  { category: "\u0418\u043D\u0434\u0435\u043A\u0441\u044B \u0438 \u0441\u044B\u0440\u044C\u0451", items: ["XAU/USD", "XAG/USD", "NAS100", "SPX500", "US30", "USOIL"] }
];
export const SETUP_TAGS = ["\u041F\u0440\u043E\u0431\u043E\u0439", "\u0420\u0430\u0437\u0432\u043E\u0440\u043E\u0442", "\u0420\u0435\u0432\u0430\u043D\u0448", "\u0422\u0440\u0435\u043D\u0434", "\u0424\u043B\u044D\u0442", "\u041D\u043E\u0432\u043E\u0441\u0442\u0438", "\u0418\u043C\u043F\u0443\u043B\u044C\u0441", "\u041E\u0442\u0431\u043E\u0439 \u0443\u0440\u043E\u0432\u043D\u044F", "\u0421\u043A\u0430\u043B\u044C\u043F", "\u0423\u0441\u0440\u0435\u0434\u043D\u0435\u043D\u0438\u0435"];
export const DIRECTION_LABEL = { Long: "\u041B\u043E\u043D\u0433", Short: "\u0428\u043E\u0440\u0442" };
