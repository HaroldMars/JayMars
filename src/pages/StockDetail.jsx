import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

function generateData(range, basePrice, isDown) {
  const points = { "1D": 48, "1W": 35, "1M": 30, "3M": 90, "6M": 60, "1Y": 52, "2Y": 50, "5Y": 60, "10Y": 60, ALL: 60 };
  const n = points[range] || 48;
  const data = [];
  let price = basePrice * (isDown ? 1.08 : 0.95);
  for (let i = 0; i < n; i++) {
    price += (Math.random() - (isDown ? 0.52 : 0.48)) * basePrice * 0.008;
    price = Math.max(basePrice * 0.85, Math.min(basePrice * 1.15, price));
    const label =
      range === "1D" ? `${9 + Math.floor(i / 6)}:${String((i % 6) * 10).padStart(2, "0")}`
      : range === "1W" ? `Day ${i + 1}`
      : `Point ${i + 1}`;
    data.push({ time: label, price: parseFloat(price.toFixed(4)) });
  }
  return data;
}

const STOCK_DB = {
  "ILLP PH": {
    ticker: "ILLP PH",
    name: "Iluminary Peak PH",
    exchange: "PSE · PHP",
    badge: "PH",
    price: 0.001,
    afterHoursPrice: 0.001,
    afterHoursChange: 0.000,
    change: -1.203,
    open: 0.00102,
    high: 0.00105,
    low: 0.00098,
    vol: "1.20M",
    pe: "N/A",
    mktCap: "120.5M",
    weekHigh52: 0.00210,
    weekLow52: 0.00080,
    avgVol: "980K",
    yield: "N/A",
    beta: "0.85",
    eps: "N/A",
  },
};

const RANGES = ["1D", "1W", "1M", "3M", "6M", "YTD", "1Y", "2Y", "5Y", "10Y", "ALL"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "rgba(20,20,32,.95)",
      border: "1px solid rgba(255,255,255,.10)",
      borderRadius: 10,
      padding: "8px 14px",
    }}>
      <p style={{ color: "rgba(255,255,255,.5)", fontSize: 11, marginBottom: 2 }}>{label}</p>
      <p style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{payload[0].value.toFixed(5)}</p>
    </div>
  );
}

export default function StockDetail() {
  const navigate = useNavigate();
  const { ticker } = useParams();
  const stock = STOCK_DB[ticker] || STOCK_DB["ILLP PH"];

  const [activeRange, setActiveRange] = useState("1D");
  const isDown = stock.change < 0;
  const color = isDown ? "#ef4444" : "#22c55e";

  const chartData = useMemo(
    () => generateData(activeRange, stock.price, isDown),
    [activeRange, stock.price, isDown]
  );

  const openLine = stock.open;

  const STATS = [
    { label: "Open",    value: stock.open.toFixed(5) },
    { label: "Vol",     value: stock.vol },
    { label: "52W H",   value: stock.weekHigh52.toFixed(5) },
    { label: "Yield",   value: stock.yield },
    { label: "High",    value: stock.high.toFixed(5) },
    { label: "P/E",     value: stock.pe },
    { label: "52W L",   value: stock.weekLow52.toFixed(5) },
    { label: "Beta",    value: stock.beta },
    { label: "Low",     value: stock.low.toFixed(5) },
    { label: "Mkt Cap", value: stock.mktCap },
    { label: "Avg Vol", value: stock.avgVol },
    { label: "EPS",     value: stock.eps },
  ];

  return (
    <div
      className="min-h-screen text-white font-sans"
      style={{ background: "#0f0f14" }}
    >
      {/* ── HEADER ── */}
      <div className="px-4 sm:px-6 pt-12 pb-2 max-w-3xl mx-auto flex items-center gap-3">
        <button
          onClick={() => navigate("/stocks")}
          className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="15" y1="9" x2="3" y2="9"/>
            <polyline points="8 4 3 9 8 14"/>
          </svg>
          Back
        </button>
      </div>

      {/* ── STOCK IDENTITY ── */}
      <div className="px-4 sm:px-6 pt-3 pb-2 max-w-3xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-0.5">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{stock.ticker.split(" ")[0]}</h1>
              <span className="text-xl sm:text-2xl text-white/40 font-light mt-1">{stock.name}</span>
            </div>
            <p className="text-sm text-white/35">{stock.exchange}</p>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-4 justify-end flex-wrap">
              <div>
                <p className="text-2xl sm:text-3xl font-black">{stock.price.toFixed(3)}</p>
                <p className="text-xs text-white/35 mt-0.5">At Close</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: isDown ? "#ef4444" : "#22c55e" }}>
                  {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(3)}%
                </p>
                <p className="text-xs text-white/35 mt-0.5">After Hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIME RANGE TABS ── */}
      <div className="max-w-3xl mx-auto px-2 sm:px-6 mt-4">
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRange(r)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
              style={{
                background: activeRange === r ? "rgba(255,255,255,.15)" : "transparent",
                color: activeRange === r ? "#fff" : "rgba(255,255,255,.4)",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* ── CHART ── */}
      <div className="max-w-3xl mx-auto px-2 sm:px-4 mt-2" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 50, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tick={{ fill: "rgba(255,255,255,.3)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "rgba(255,255,255,.3)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => v.toFixed(4)}
              width={55}
              orientation="right"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,.15)", strokeWidth: 1 }} />
            <ReferenceLine
              y={openLine}
              stroke="rgba(255,255,255,.18)"
              strokeDasharray="4 3"
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={1.8}
              fill="url(#colorPrice)"
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── VOLUME BAR (decorative) ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-1" style={{ height: 28 }}>
        <div className="flex items-end gap-px h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${20 + Math.random() * 80}%`,
                background: "rgba(255,255,255,.08)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── STATS GRID ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-6 mb-6">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,.07)" }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="px-4 py-3 flex justify-between sm:flex-col sm:gap-1"
                style={{
                  background: i % 2 === 0 ? "rgba(255,255,255,.02)" : "transparent",
                  borderBottom: i < STATS.length - (STATS.length % 4 || 4) ? "1px solid rgba(255,255,255,.05)" : "none",
                  borderRight: (i + 1) % 4 !== 0 ? "1px solid rgba(255,255,255,.05)" : "none",
                }}
              >
                <span className="text-xs text-white/35">{s.label}</span>
                <span className="text-sm font-semibold text-white/85">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── INVEST CTA ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-10">
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: "linear-gradient(135deg,rgba(124,58,237,.15) 0%,rgba(236,72,153,.10) 100%)",
            border: "1px solid rgba(124,58,237,.25)",
          }}
        >
          <div>
            <p className="text-base font-bold text-white/90">Interested in investing?</p>
            <p className="text-sm text-white/45 mt-0.5">
              If you want to invest, contact me and let's talk about it.
            </p>
          </div>
          <a
            href="mailto:abejar199@gmail.com"
            className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all duration-200"
            style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}
          >
            Contact Me 📩
          </a>
        </div>
      </div>

    </div>
  );
}
