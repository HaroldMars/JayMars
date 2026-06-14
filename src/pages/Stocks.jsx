import { useState } from "react";
import { useNavigate } from "react-router-dom";

const STOCKS = [
  {
    ticker: "ILLP PH",
    name: "Iluminary Peak PH",
    badge: "PH",
    price: 0.001,
    change: -1.203,
  },
];

export default function Stocks() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Watchlist");

  return (
    <div
      className="min-h-screen text-white font-sans"
      style={{ background: "linear-gradient(135deg,#0c0c14 0%,#12121e 50%,#0c0c18 100%)" }}
    >
      {/* Header */}
      <div className="px-5 pt-14 pb-4 flex items-center justify-between max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="text-white/50 hover:text-white transition-colors flex items-center gap-1 text-sm"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="15" y1="9" x2="3" y2="9"/>
            <polyline points="8 4 3 9 8 14"/>
          </svg>
          Back
        </button>
        <h1 className="text-xl font-bold">My Stocks</h1>
        <div className="w-16" />
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-5">
        <div className="flex gap-6 border-b border-white/10">
          {["Watchlist", "Projects"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-white border-b-2 border-white"
                  : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Stock list */}
      <div className="max-w-2xl mx-auto px-5 mt-4 flex flex-col gap-2">
        {STOCKS.map((stock) => (
          <div
            key={stock.ticker}
            onClick={() => navigate(`/stocks/${encodeURIComponent(stock.ticker)}`)}
            className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:bg-white/5 cursor-pointer active:scale-98"
            style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }}
          >
            {/* Logo placeholder */}
            <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm text-white/60"
              style={{ background: "rgba(255,255,255,.12)" }}>
              {stock.ticker.split(" ")[0].slice(0, 2)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-white">{stock.ticker}</p>
              <p className="text-xs text-white/45 truncate">{stock.name}</p>
              <span
                className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,.12)", color: "rgba(255,255,255,.5)" }}
              >
                {stock.badge}
              </span>
            </div>

            {/* Price & change */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-sm font-semibold text-white">
                {stock.price.toFixed(3)}
              </span>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: stock.change >= 0 ? "rgba(34,197,94,.9)" : "rgba(239,68,68,.9)",
                  color: "#fff",
                }}
              >
                {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(3)}%
              </span>
            </div>

            {/* Chevron */}
            <svg width="16" height="16" fill="none" stroke="rgba(255,255,255,.25)" strokeWidth="2">
              <polyline points="6 4 10 8 6 12"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
