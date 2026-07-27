import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../mac.css";
import { config } from "../../utils/config";
import { APPS, appById, clamp } from "./data";
import { AppView } from "./apps";

const AppleLogo = ({ size = 15, color = "currentColor" }) => (
  <svg viewBox="0 0 384 512" width={size} height={size} fill={color} aria-hidden="true" style={{ display: "block" }}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

/* ------------------------------------------------------------------ Dock */
function Dock({ openApp, openIds, bounceId, onLaunchpad, onTrash }) {
  const Item = ({ id, glyph, grad, title, onClick, running }) => (
    <div className={`dock-item ${bounceId === id ? "bouncing" : ""}`} onClick={onClick}>
      <span className="dock-tip">{title}</span>
      <div className="dock-icon" style={{ background: grad }}>{glyph}</div>
      {running && <i className="run-dot" />}
    </div>
  );

  return (
    <div className="dock-wrap">
      <div className="dock">
        {APPS.map((a) => (
          <Item key={a.id} id={a.id} glyph={a.glyph} grad={a.grad} title={a.title}
            running={openIds.includes(a.id)} onClick={() => openApp(a.id)} />
        ))}
        <div className="dock-sep" />
        <Item id="launchpad" glyph="🚀" grad="linear-gradient(145deg,#64748b,#334155)" title="Launchpad" onClick={onLaunchpad} />
        <Item id="trash" glyph="🗑️" grad="linear-gradient(145deg,#94a3b8,#475569)" title="Trash" onClick={onTrash} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Window */
function MacWindow({ win, app, active, theme, onClose, onMin, onMax, onFocus, onDrag, children }) {
  const startDrag = (e) => {
    if (win.max) return;
    onFocus();
    const startX = e.clientX - win.x;
    const startY = e.clientY - win.y;
    const move = (ev) => onDrag(win.id, clamp(ev.clientX - startX, -win.w + 120, window.innerWidth - 120), clamp(ev.clientY - startY, 28, window.innerHeight - 60));
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const style = win.max
    ? { left: 8, top: 34, width: window.innerWidth - 16, height: window.innerHeight - 110, zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z };

  return (
    <div
      className={`mac-window ${active ? "active" : ""} ${theme === "light" ? "light" : ""} ${win.closing ? "closing" : ""}`}
      style={style}
      onMouseDown={onFocus}
    >
      <div className="win-titlebar" onPointerDown={startDrag} onDoubleClick={onMax}>
        <div className="traffic">
          <i className="red" onClick={(e) => { e.stopPropagation(); onClose(); }}><span>✕</span></i>
          <i className="yellow" onClick={(e) => { e.stopPropagation(); onMin(); }}><span>–</span></i>
          <i className="green" onClick={(e) => { e.stopPropagation(); onMax(); }}><span>+</span></i>
        </div>
        <span className="win-title">{app.title}</span>
      </div>
      <div className="win-body">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ Desktop */
export default function Desktop() {
  const navigate = useNavigate();
  const [booting, setBooting] = useState(true);
  const [bootPct, setBootPct] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [now, setNow] = useState(new Date());

  const [windows, setWindows] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const zRef = useRef(20);

  const [appleMenu, setAppleMenu] = useState(false);
  const [spotlight, setSpotlight] = useState(false);
  const [spotQuery, setSpotQuery] = useState("");
  const [launchpad, setLaunchpad] = useState(false);
  const [controlCenter, setControlCenter] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [selIcon, setSelIcon] = useState(null);
  const [deskIcons, setDeskIcons] = useState(() => {
    const x = (typeof window !== "undefined" ? window.innerWidth : 1200) - 104;
    return [
      { id: "about", glyph: "💽", label: "Macintosh HD", x, y: 44 },
      { id: "projects", glyph: "📁", label: "Projects", x, y: 152 },
      { id: "illuminary", glyph: "⛰️", label: "Illuminary", x, y: 260 },
    ];
  });
  const [bounceId, setBounceId] = useState(null);

  const [chatHistory, setChatHistory] = useState([]);

  /* ---- boot sequence (re-runs on every restart) ---- */
  useEffect(() => {
    if (!booting) return;
    let p = 0;
    setBootPct(0);
    const t = setInterval(() => {
      p += Math.random() * 16 + 6;
      if (p >= 100) { p = 100; clearInterval(t); setTimeout(() => setBooting(false), 350); }
      setBootPct(p);
    }, 180);
    return () => clearInterval(t);
  }, [booting]);

  /* ---- live clock ---- */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ---- global shortcuts ---- */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSpotlight((s) => !s); }
      if (e.key === "Escape") { setSpotlight(false); setLaunchpad(false); setAppleMenu(false); setControlCenter(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const focus = useCallback((id) => {
    zRef.current += 1;
    const z = zRef.current;
    setActiveId(id);
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, z } : w)));
  }, []);

  const openApp = useCallback((appId) => {
    setLaunchpad(false); setSpotlight(false); setAppleMenu(false);
    const app = appById(appId);
    if (!app) return;
    if (app.route) { navigate(app.route); return; }
    setBounceId(appId);
    setTimeout(() => setBounceId(null), 650);
    setWindows((ws) => {
      const existing = ws.find((w) => w.id === appId);
      zRef.current += 1;
      if (existing) {
        setActiveId(appId);
        return ws.map((w) => (w.id === appId ? { ...w, min: false, z: zRef.current } : w));
      }
      const count = ws.length;
      const w = app.w || 520, h = app.h || 440;
      const x = clamp(window.innerWidth / 2 - w / 2 + count * 28 - 40, 20, window.innerWidth - w - 20);
      const y = clamp(90 + count * 26, 40, window.innerHeight - h - 120);
      setActiveId(appId);
      return [...ws, { id: appId, x, y, w, h, z: zRef.current, min: false, max: false }];
    });
  }, [navigate]);

  const closeWin = (id) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, closing: true } : w)));
    setTimeout(() => setWindows((ws) => ws.filter((w) => w.id !== id)), 190);
  };
  const minWin = (id) => setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, min: true } : w)));
  const maxWin = (id) => setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, max: !w.max } : w)));
  const dragWin = (id, x, y) => setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)));

  const generateBotResponse = async (history) => {
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    try {
      const res = await fetch(config.Gemini_ApiUrl, {
        method: "POST",
        headers: { "x-goog-api-key": `${config.Gemini_ApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ contents: history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Something went wrong!");
      data.candidates.forEach((c) => {
        setChatHistory((prev) => [
          ...prev.filter((m) => m.text !== "Thinking..."),
          { role: "model", text: c.content.parts.map((p) => p.text).join("") },
        ]);
      });
    } catch (err) { console.error(err); }
  };

  const appCtx = { navigate, chatHistory, setChatHistory, generateBotResponse };

  const activeApp = activeId ? appById(activeId) : null;

  const spotResults = APPS.filter((a) => a.title.toLowerCase().includes(spotQuery.toLowerCase()));
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const closeAllMenus = () => { setAppleMenu(false); setControlCenter(false); setSelIcon(null); };

  const dragIcon = (e, id) => {
    e.stopPropagation();
    setSelIcon(id);
    const icon = deskIcons.find((d) => d.id === id);
    if (!icon) return;
    const startX = e.clientX - icon.x;
    const startY = e.clientY - icon.y;
    const move = (ev) => setDeskIcons((list) => list.map((d) => (d.id === id
      ? { ...d, x: clamp(ev.clientX - startX, 4, window.innerWidth - 88), y: clamp(ev.clientY - startY, 32, window.innerHeight - 110) }
      : d)));
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  if (booting) {
    return (
      <div className="boot-screen">
        <div className="boot-logo"><AppleLogo size={80} color="#fff" /></div>
        <div className="boot-bar"><i style={{ width: `${bootPct}%`, transition: "width .2s ease" }} /></div>
      </div>
    );
  }

  return (
    <div className="mac-root" onMouseDown={closeAllMenus}>
      {/* wallpaper */}
      <div className={`wallpaper ${theme === "light" ? "wallpaper-light" : "wallpaper-dark"}`} />
      {/* brightness overlay (functional) */}
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: (100 - brightness) / 160, pointerEvents: "none", zIndex: 90 }} />

      {/* ---------- MENU BAR ---------- */}
      <div className="menubar" onMouseDown={(e) => e.stopPropagation()}>
        <span className="mb-item" style={{ display: "flex", alignItems: "center" }} onClick={(e) => { e.stopPropagation(); setAppleMenu((v) => !v); }}><AppleLogo /></span>
        <span className="mb-item mb-strong">{activeApp ? activeApp.title : "Finder"}</span>
        <span className="mb-item">File</span>
        <span className="mb-item">Edit</span>
        <span className="mb-item">View</span>
        <span className="mb-item">Window</span>
        <span className="mb-item" onClick={() => openApp("contact")}>Help</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <span className="mb-item" onClick={() => setControlCenter((v) => !v)}>🎛️</span>
          <span className="mb-item" onClick={() => setSpotlight(true)}>🔍</span>
          <span className="mb-item">🔋</span>
          <span className="mb-item">📶</span>
          <span className="mb-item">{dateStr}</span>
          <span className="mb-item mb-strong">{timeStr}</span>
        </div>
      </div>

      {/* apple menu */}
      {appleMenu && (
        <div className="mac-menu" style={{ top: 30, left: 8 }} onMouseDown={(e) => e.stopPropagation()}>
          <button onClick={() => openApp("about")}>About This Mac</button>
          <div className="sep" />
          <button onClick={() => setControlCenter(true)}>System Settings…</button>
          <button onClick={() => setLaunchpad(true)}>Launchpad</button>
          <div className="sep" />
          <button onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>Toggle Appearance</button>
          <div className="sep" />
          <button onClick={() => { setWindows([]); setBootPct(0); setBooting(true); }}>Restart…</button>
        </div>
      )}

      {/* control center */}
      {controlCenter && (
        <div className="control-center" onMouseDown={(e) => e.stopPropagation()}>
          <div className="cc-tile">
            <div className="cc-toggle" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
              <span className={`cc-dot ${theme === "dark" ? "on" : ""}`}>🌙</span>
              <div><div className="text-xs font-semibold">Appearance</div><div className="text-[11px] opacity-60">{theme === "dark" ? "Dark" : "Light"}</div></div>
            </div>
          </div>
          <div className="cc-tile">
            <div className="cc-toggle">
              <span className="cc-dot on">📶</span>
              <div><div className="text-xs font-semibold">Wi-Fi</div><div className="text-[11px] opacity-60">Connected</div></div>
            </div>
          </div>
          <div className="cc-tile wide">
            <div className="text-xs font-semibold mb-1">☀️ Brightness</div>
            <input className="cc-slider" type="range" min="20" max="100" value={brightness} onChange={(e) => setBrightness(+e.target.value)} />
          </div>
        </div>
      )}

      {/* ---------- DESKTOP ICONS (draggable) ---------- */}
      <div className="desk-icons">
        {deskIcons.map((d) => (
          <div
            key={d.id}
            className={`desk-icon ${selIcon === d.id ? "sel" : ""}`}
            style={{ position: "absolute", left: d.x, top: d.y }}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => dragIcon(e, d.id)}
            onDoubleClick={() => openApp(d.id)}
          >
            <span className="di-glyph">{d.glyph}</span>
            <span className="di-label">{d.label}</span>
          </div>
        ))}
      </div>

      {/* ---------- WINDOWS ---------- */}
      {windows.filter((w) => !w.min).map((w) => (
        <MacWindow
          key={w.id}
          win={w}
          app={appById(w.id)}
          active={activeId === w.id}
          theme={theme}
          onClose={() => closeWin(w.id)}
          onMin={() => minWin(w.id)}
          onMax={() => maxWin(w.id)}
          onFocus={() => focus(w.id)}
          onDrag={dragWin}
        >
          <AppView id={w.id} ctx={appCtx} />
        </MacWindow>
      ))}

      {/* ---------- SPOTLIGHT ---------- */}
      {spotlight && (
        <div className="spotlight-overlay" onMouseDown={() => setSpotlight(false)}>
          <div className="spotlight" onMouseDown={(e) => e.stopPropagation()}>
            <input autoFocus placeholder="Spotlight Search" value={spotQuery}
              onChange={(e) => setSpotQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && spotResults[0]) { openApp(spotResults[0].id); setSpotlight(false); setSpotQuery(""); } }} />
            {spotQuery && (
              <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", paddingBottom: 6 }}>
                {spotResults.length ? spotResults.map((a, i) => (
                  <div key={a.id} className={`sp-result ${i === 0 ? "active" : ""}`} onClick={() => { openApp(a.id); setSpotlight(false); setSpotQuery(""); }}>
                    <span style={{ fontSize: 18 }}>{a.glyph}</span>{a.title}
                  </div>
                )) : <div className="sp-result">No results</div>}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------- LAUNCHPAD ---------- */}
      {launchpad && (
        <div className="launchpad" onMouseDown={() => setLaunchpad(false)}>
          {APPS.map((a) => (
            <div key={a.id} className="lp-item" onMouseDown={(e) => e.stopPropagation()} onClick={() => openApp(a.id)}>
              <div className="lp-icon" style={{ background: a.grad }}>{a.glyph}</div>
              <span>{a.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* ---------- DOCK ---------- */}
      <Dock
        openApp={openApp}
        openIds={windows.map((w) => w.id)}
        bounceId={bounceId}
        onLaunchpad={() => setLaunchpad((v) => !v)}
        onTrash={() => { setBounceId("trash"); setTimeout(() => setBounceId(null), 650); }}
      />
    </div>
  );
}
