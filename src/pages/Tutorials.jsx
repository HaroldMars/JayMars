import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── Scroll fade-in ────────────────────────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Code block (styled like the screenshot) ───────────────────────────────────
function CodeBlock({ title, code }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="rounded-2xl overflow-hidden my-4" style={{ border: "1px solid rgba(255,255,255,.10)" }}>
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: "#05050c" }}>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
          {title && <span className="ml-3 text-xs text-white/35">{title}</span>}
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-2.5 py-1 rounded-md text-white/50 hover:text-white transition-colors"
          style={{ background: "rgba(255,255,255,.06)" }}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre className="px-4 py-4 overflow-x-auto text-xs sm:text-sm leading-relaxed" style={{ background: "#0a0a14" }}>
        <code className="text-white/80" style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {code}
        </code>
      </pre>
    </div>
  );
}

// ── Steps list renderer ───────────────────────────────────────────────────────
function StepList({ steps }) {
  return (
    <div className="flex flex-col gap-8">
      {steps.map((step, i) => (
        <FadeIn key={step.n} delay={i * 50}>
          <div className="flex gap-3 sm:gap-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}
              >
                {step.n}
              </div>
              {i < steps.length - 1 && (
                <div className="w-px flex-1 mt-2" style={{ background: "rgba(255,255,255,.10)" }} />
              )}
            </div>
            <div className="flex-1 pb-2 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white/95">{step.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed mt-1">{step.desc}</p>
              <CodeBlock title={step.lang} code={step.code} />
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

// ── CHAT APP tutorial steps ───────────────────────────────────────────────────
const CHAT_STEPS = [
  {
    n: 1, title: "Set up your project", lang: "bash · terminal",
    desc: "Create a React app with Vite and install Socket.IO for real-time messaging.",
    code: `npm create vite@latest weyapp -- --template react
cd weyapp
npm install
npm install socket.io-client`,
  },
  {
    n: 2, title: "Create the message state", lang: "Chat.jsx",
    desc: "Hold all chat messages and the current input value using useState.",
    code: `import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
}`,
  },
  {
    n: 3, title: "Build the send function", lang: "Chat.jsx",
    desc: "Add the user's message to the list and clear the input box.",
    code: `const sendMessage = () => {
  if (!input.trim()) return;
  setMessages((prev) => [
    ...prev,
    { id: Date.now(), text: input, sender: "me" },
  ]);
  setInput("");
};`,
  },
  {
    n: 4, title: "Render the messages", lang: "Chat.jsx",
    desc: "Map over messages and show each bubble. Your messages align right.",
    code: `<div className="messages">
  {messages.map((m) => (
    <div key={m.id} className={m.sender === "me" ? "me" : "them"}>
      {m.text}
    </div>
  ))}
</div>`,
  },
  {
    n: 5, title: "Add the input bar", lang: "Chat.jsx",
    desc: "A text field plus a send button. Enter key also sends.",
    code: `<input
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
  placeholder="Type a message..."
/>
<button onClick={sendMessage}>Send</button>`,
  },
  {
    n: 6, title: "Go real-time with Socket.IO", lang: "Chat.jsx",
    desc: "Sync messages live between users — this is the heart of WEYAPP.",
    code: `import { io } from "socket.io-client";
const socket = io("http://localhost:3001");

socket.emit("message", { text: input });

socket.on("message", (msg) => {
  setMessages((prev) => [...prev, msg]);
});`,
  },
];

// ── STOCKS tutorial steps ─────────────────────────────────────────────────────
const STOCK_STEPS = [
  {
    n: 1, title: "Define your stock data", lang: "Stocks.jsx",
    desc: "Start with an array of stock objects holding ticker, price and change.",
    code: `const STOCKS = [
  { ticker: "ILLP PH", name: "Iluminary Peak",
    price: 0.001, change: -1.203 },
];`,
  },
  {
    n: 2, title: "Render a stock list", lang: "Stocks.jsx",
    desc: "Map over your stocks and display each as a clickable row.",
    code: `{STOCKS.map((s) => (
  <div key={s.ticker} className="stock-row">
    <span>{s.ticker}</span>
    <span>{s.price.toFixed(3)}</span>
  </div>
))}`,
  },
  {
    n: 3, title: "Color the price change", lang: "Stocks.jsx",
    desc: "Show green for gains and red for losses based on the change value.",
    code: `<span style={{
  color: s.change >= 0 ? "#22c55e" : "#ef4444"
}}>
  {s.change >= 0 ? "+" : ""}{s.change.toFixed(3)}%
</span>`,
  },
  {
    n: 4, title: "Add a price chart", lang: "Stocks.jsx",
    desc: "Install Recharts and draw an area chart of the price history.",
    code: `npm install recharts

import { AreaChart, Area } from "recharts";

<AreaChart data={data}>
  <Area dataKey="price" stroke="#ef4444" />
</AreaChart>`,
  },
  {
    n: 5, title: "Make rows clickable", lang: "Stocks.jsx",
    desc: "Use React Router to open a detail page when a stock is tapped.",
    code: `import { useNavigate } from "react-router-dom";
const navigate = useNavigate();

<div onClick={() => navigate(\`/stocks/\${s.ticker}\`)}>
  {s.ticker}
</div>`,
  },
];

// ── Website designs gallery ───────────────────────────────────────────────────
const DESIGNS = [
  { name: "WEYAPP! Chat",   tag: "Chat System",  gradient: "from-violet-600/40 to-fuchsia-600/20", emoji: "💬" },
  { name: "PET-LOCATION",   tag: "Tracking App", gradient: "from-amber-600/40 to-orange-600/20",  emoji: "🐾" },
  { name: "RCJCIM",         tag: "Business Site", gradient: "from-blue-600/40 to-cyan-600/20",     emoji: "🏢" },
  { name: "Wander PH",      tag: "Commuter SaaS", gradient: "from-green-600/40 to-emerald-600/20", emoji: "🚌" },
  { name: "Nyia AI",        tag: "AI Copilot",   gradient: "from-purple-600/40 to-indigo-600/20",  emoji: "🤖" },
  { name: "Stocks App",     tag: "Finance UI",   gradient: "from-rose-600/40 to-pink-600/20",      emoji: "📈" },
];

export default function Tutorials() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("chat");

  return (
    <div
      className="relative min-h-screen text-white font-sans overflow-x-hidden"
      style={{ background: "linear-gradient(135deg,#0c0c14 0%,#12121e 50%,#0c0c18 100%)" }}
    >
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ position:"absolute", top:"6%", left:"8%", width:380, height:380, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.10),transparent 70%)", filter:"blur(50px)" }} />
        <div style={{ position:"absolute", bottom:"10%", right:"6%", width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,rgba(236,72,153,.07),transparent 70%)", filter:"blur(50px)" }} />
      </div>

      {/* Back */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 pt-12 pb-2">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-sm text-white/50 hover:text-white transition-colors"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="15" y1="9" x2="3" y2="9"/>
            <polyline points="8 4 3 9 8 14"/>
          </svg>
          Back to Portfolio
        </button>
      </div>

      {/* Header */}
      <section className="relative z-10 max-w-3xl mx-auto px-5 pt-6 pb-6">
        <FadeIn>
          <p className="text-xs uppercase tracking-widest text-purple-400 mb-2 font-medium">Step-by-step tutorials</p>
          <h1
            className="font-extrabold leading-tight mb-3"
            style={{
              fontSize: "clamp(2rem,6vw,3.5rem)",
              background: "linear-gradient(135deg,#fff 30%,#a78bfa 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Learn to Build
          </h1>
          <p className="text-sm text-white/55 leading-relaxed max-w-xl">
            Beginner-friendly guides for building real apps with React — including <span className="text-purple-300 font-semibold">WEYAPP</span>, my own chat system.
          </p>
        </FadeIn>
      </section>

      {/* Tab switcher */}
      <div className="relative z-10 max-w-3xl mx-auto px-5 mb-8">
        <div className="inline-flex gap-1 p-1 rounded-full" style={{ background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }}>
          {[
            { id: "chat",  label: "💬 Chat App" },
            { id: "stock", label: "📈 Stocks App" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: tab === t.id ? "linear-gradient(135deg,#7c3aed,#ec4899)" : "transparent",
                color: tab === t.id ? "#fff" : "rgba(255,255,255,.5)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active tutorial */}
      <section className="relative z-10 max-w-3xl mx-auto px-5 pb-12">
        {tab === "chat" ? (
          <>
            <FadeIn>
              <h2 className="text-xl font-bold mb-1">Build a Chat Application</h2>
              <p className="text-sm text-white/45 mb-8">The foundation behind WEYAPP — a real-time messenger.</p>
            </FadeIn>
            <StepList steps={CHAT_STEPS} />
          </>
        ) : (
          <>
            <FadeIn>
              <h2 className="text-xl font-bold mb-1">Build a Stocks App</h2>
              <p className="text-sm text-white/45 mb-8">A live stock watchlist with charts and detail pages.</p>
            </FadeIn>
            <StepList steps={STOCK_STEPS} />
          </>
        )}
      </section>

      {/* Website designs
      <section className="relative z-10 max-w-5xl mx-auto px-5 py-12">
        <FadeIn>
          <h2 className="text-2xl font-black mb-1" style={{ background: "linear-gradient(90deg,#fff,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Website Designs
          </h2>
          <div className="w-10 h-0.5 mt-2 mb-8 rounded-full" style={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)" }} />
        </FadeIn>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {DESIGNS.map((d, i) => (
            <FadeIn key={d.name} delay={i * 50}>
              <div
                className={`relative overflow-hidden rounded-2xl p-5 h-36 sm:h-40 flex flex-col justify-between bg-gradient-to-br ${d.gradient} group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                style={{ border: "1px solid rgba(255,255,255,.08)" }}
              >
                <span className="text-2xl sm:text-3xl">{d.emoji}</span>
                <div>
                  <h3 className="font-bold text-white/95 text-sm">{d.name}</h3>
                  <span className="text-xs text-white/45">{d.tag}</span>
                </div>
                <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: "white", filter: "blur(30px)", transform: "translate(30%,30%)" }} />
              </div>
            </FadeIn>
          ))}
        </div>
      </section> */}

      {/* Chat to my email CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-5 py-12 mb-10">
        <FadeIn>
          <div
            className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5"
            style={{
              background: "linear-gradient(135deg,rgba(124,58,237,.15) 0%,rgba(236,72,153,.10) 100%)",
              border: "1px solid rgba(124,58,237,.25)",
            }}
          >
            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-white/95">Got a question about these tutorials?</p>
              <p className="text-sm text-white/50 mt-1 leading-relaxed">
                Chat with me directly through email — happy to help you build your own app!
              </p>
            </div>
            <a
              href="mailto:abejar199@gmail.com?subject=Tutorial%20Question"
              className="flex-shrink-0 px-6 py-3 rounded-full text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all duration-200 no-underline whitespace-nowrap"
              style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}
            >
              💬 Chat via Email
            </a>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
