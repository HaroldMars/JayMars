import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../mac.css";
import { config } from "../../utils/config";
import { APPS, appById } from "./data";
import { AppView } from "./apps";

const DOCK_IDS = ["messages", "jaybot", "about", "contact"];

export default function MobileOS() {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [openId, setOpenId] = useState(null);
  const [closing, setClosing] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const sheetRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

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

  const openApp = useCallback((id) => {
    const app = appById(id);
    if (!app) return;
    if (app.route) { navigate(app.route); return; }
    setClosing(false);
    setOpenId(id);
  }, [navigate]);

  const goHome = () => {
    setClosing(true);
    setTimeout(() => { setOpenId(null); setClosing(false); }, 230);
  };

  // swipe-down on the nav bar closes the app (iOS-style)
  const onSheetDrag = (e) => {
    const startY = e.clientY;
    const move = (ev) => {
      if (ev.clientY - startY > 70) { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); goHome(); }
    };
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const timeStr = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const openApp_ = openId ? appById(openId) : null;
  const appCtx = { navigate, chatHistory, setChatHistory, generateBotResponse };

  const Icon = ({ app }) => (
    <div className="ios-app" onClick={() => openApp(app.id)}>
      <div className="ia-icon" style={{ background: app.grad }}>{app.glyph}</div>
      <span className="ia-label">{app.title}</span>
    </div>
  );

  const homeApps = APPS.filter((a) => !DOCK_IDS.includes(a.id));
  const dockApps = DOCK_IDS.map(appById);

  return (
    <div className="ios-root">
      <div className="wallpaper wallpaper-dark" />

      {/* status bar */}
      <div className="ios-statusbar">
        <span>{timeStr}</span>
        <div className="sb-right"><span>📶</span><span>🛜</span><span>🔋</span></div>
      </div>

      {/* home screen */}
      <div className="ios-home">
        <div className="ios-grid">
          {homeApps.map((a) => <Icon key={a.id} app={a} />)}
        </div>
        <div className="ios-page-dots"><i className="on" /><i /></div>
      </div>

      {/* dock */}
      <div className="ios-dock">
        {dockApps.map((a) => <Icon key={a.id} app={a} />)}
      </div>

      {/* full-screen app */}
      {openId && (
        <div ref={sheetRef} className={`ios-sheet ${closing ? "closing" : ""}`}>
          <div className="ios-navbar" onPointerDown={onSheetDrag}>
            <span className="ios-back" onClick={goHome}>‹ Home</span>
            <span className="ios-nav-title" style={{ marginLeft: "auto", marginRight: "auto" }}>{openApp_?.title}</span>
            <span style={{ width: 48 }} />
          </div>
          <div className="ios-sheet-body"><AppView id={openId} ctx={appCtx} /></div>
          <div className="ios-home-indicator"><i onClick={goHome} /></div>
        </div>
      )}

      {!openId && <div className="ios-home-indicator"><i onClick={() => {}} /></div>}
    </div>
  );
}
