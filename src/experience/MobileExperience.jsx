import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SceneCanvas from "./SceneCanvas";
import {
  PROJECTS,
  TECH_STACK,
  SERVICES,
  CONTACTS,
} from "../components/mac/data";
import Jay from "../assets/Mypic.jpg";
import ChatForm from "../components/ChatForm";
import ChatMessage from "../components/ChatMessage";
import ChatbotIcon from "../components/ChatbotIcon";
import { config } from "../utils/config";
import "./experience.css";

const TABS = [
  { id: "home", label: "Home", icon: "⌂" },
  { id: "about", label: "About", icon: "◉" },
  { id: "work", label: "Work", icon: "◇" },
  { id: "skills", label: "Skills", icon: "▣" },
  { id: "contact", label: "Talk", icon: "✉" },
];

export default function MobileExperience() {
  const navigate = useNavigate();
  const progressRef = useRef(0);
  const pagesRef = useRef(null);
  const [tab, setTab] = useState(0);
  const [ready, setReady] = useState(false);
  const [loadPct, setLoadPct] = useState(10);
  const [sheet, setSheet] = useState(null); // project | chat | null
  const [selected, setSelected] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    let p = 10;
    const t = setInterval(() => {
      p = Math.min(100, p + Math.random() * 22 + 10);
      setLoadPct(p);
      if (p >= 100) {
        clearInterval(t);
        setTimeout(() => setReady(true), 220);
      }
    }, 120);
    return () => clearInterval(t);
  }, []);

  // map active tab → camera progress for a gentle orbit
  useEffect(() => {
    progressRef.current = tab / Math.max(TABS.length - 1, 1);
  }, [tab]);

  const goTab = useCallback((idx) => {
    setTab(idx);
    const scroller = pagesRef.current;
    if (!scroller) return;
    const page = scroller.children[idx];
    if (page) page.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, []);

  useEffect(() => {
    const scroller = pagesRef.current;
    if (!scroller) return;
    const onScroll = () => {
      const idx = Math.round(scroller.scrollLeft / Math.max(scroller.clientWidth, 1));
      setTab(Math.min(TABS.length - 1, Math.max(0, idx)));
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [chatHistory, sheet]);

  const generateBotResponse = async (history) => {
    const payload = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    try {
      const res = await fetch(config.Gemini_ApiUrl, {
        method: "POST",
        headers: {
          "x-goog-api-key": `${config.Gemini_ApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Something went wrong!");
      data.candidates?.forEach((c) => {
        setChatHistory((prev) => [
          ...prev.filter((m) => m.text !== "Thinking..."),
          { role: "model", text: c.content.parts.map((p) => p.text).join("") },
        ]);
      });
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev.filter((m) => m.text !== "Thinking..."),
        { role: "model", text: "I hit a snag reaching the API. Try again in a moment." },
      ]);
    }
  };

  const openProject = (p) => {
    setSelected(p);
    setSheet("project");
  };

  return (
    <div className="exp-root exp-mobile">
      <div className={`exp-loader ${ready ? "done" : ""}`}>
        <div className="exp-loader-inner">
          <div className="exp-loader-brand">
            JAY
            <br />
            MARS
          </div>
          <div className="exp-loader-bar">
            <i style={{ width: `${loadPct}%` }} />
          </div>
        </div>
      </div>

      <div className="exp-mobile-canvas" aria-hidden>
        <SceneCanvas
          progressRef={progressRef}
          projects={PROJECTS}
          mobile
          selectedId={null}
          onSelectProject={() => {}}
        />
      </div>

      <div className="exp-mobile-shell">
        <header className="exp-mobile-header">
          <span className="mark">JAYMARS</span>
          <button
            type="button"
            className="exp-btn exp-btn-ghost"
            style={{ padding: "8px 12px", fontSize: "0.65rem" }}
            onClick={() => setSheet("chat")}
          >
            Bot
          </button>
        </header>

        <div className="exp-mobile-pages" ref={pagesRef}>
          {/* HOME — swipe horizontally; 3D orbits with tab */}
          <section className="exp-m-page">
            <div className="exp-m-hero">
              <p className="exp-kicker" style={{ color: "rgba(255,255,255,.85)" }}>
                Swipe to explore
              </p>
              <h1>
                JAY
                <br />
                MARS
              </h1>
              <p>
                Soft arctic world · portfolio of Jay Harold Mars. Swipe pages or use
                the dock below — built for thumbs, not desktop windows.
              </p>
              <div className="exp-cta-row" style={{ marginTop: 18 }}>
                <button type="button" className="exp-btn exp-btn-primary" onClick={() => goTab(2)}>
                  See work
                </button>
                <button type="button" className="exp-btn exp-btn-ghost" onClick={() => goTab(4)}>
                  Contact
                </button>
              </div>
            </div>
          </section>

          {/* ABOUT */}
          <section className="exp-m-page">
            <div className="exp-m-card">
              <p className="exp-panel-tag">About</p>
              <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "8px 0 12px" }}>
                <img src={Jay} alt="Jay" style={{ width: 56, height: 56, borderRadius: 14, objectFit: "cover" }} />
                <div>
                  <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Jay Harold Mars</h2>
                  <p style={{ margin: "2px 0 0" }}>CEO · Illuminary Peak</p>
                </div>
              </div>
              <p>
                Entrepreneur with a big vision — shipping web apps, AI copilots, and
                product experiences that feel calm and intentional.
              </p>
            </div>
          </section>

          {/* WORK — horizontal project carousel (mobile-specific) */}
          <section className="exp-m-page">
            <div className="exp-m-card">
              <p className="exp-panel-tag">Work</p>
              <h2>Projects</h2>
              <p>Swipe the cards, tap to open a sheet.</p>
              <div className="exp-m-projects">
                {PROJECTS.map((p) => (
                  <button key={p.title} type="button" className="exp-m-project" onClick={() => openProject(p)}>
                    <img src={p.img} alt="" />
                    <strong>{p.title}</strong>
                    <span>{p.desc}</span>
                  </button>
                ))}
              </div>
              <div className="exp-cta-row">
                <button type="button" className="exp-btn exp-btn-ghost" onClick={() => navigate("/tutorials")}>
                  Tutorials
                </button>
                <button type="button" className="exp-btn exp-btn-ghost" onClick={() => navigate("/stocks")}>
                  Stocks
                </button>
              </div>
            </div>
          </section>

          {/* SKILLS */}
          <section className="exp-m-page">
            <div className="exp-m-card">
              <p className="exp-panel-tag">Skills</p>
              <h2>Stack</h2>
              <div className="exp-grid-mini" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {TECH_STACK.map((t) => (
                  <div className="exp-chip" key={t.name} style={{ flexDirection: "column", gap: 6, justifyContent: "center" }}>
                    <img src={t.icon} alt={t.name} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    <span style={{ fontSize: 10 }}>{t.name}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
                {SERVICES.map((s) => (
                  <div key={s.title} className="exp-chip">
                    <span>{s.icon}</span>
                    <div>
                      <strong style={{ fontSize: 13 }}>{s.title}</strong>
                      <div style={{ fontSize: 12, fontWeight: 400, color: "var(--exp-muted)" }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CONTACT */}
          <section className="exp-m-page">
            <div className="exp-m-card">
              <p className="exp-panel-tag">Contact</p>
              <h2>Reach out</h2>
              <div className="exp-contact-list">
                {CONTACTS.map((c) => (
                  <a key={c.label} href={c.href} target="_blank" rel="noreferrer">
                    <span>{c.icon}</span>
                    {c.label}
                  </a>
                ))}
              </div>
              <div className="exp-cta-row">
                <a className="exp-btn exp-btn-primary" href="mailto:abejar199@gmail.com">
                  Email Jay
                </a>
                <button type="button" className="exp-btn exp-btn-ghost" onClick={() => setSheet("chat")}>
                  Chat bot
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <nav className="exp-m-tabs" aria-label="Mobile sections">
        {TABS.map((t, i) => (
          <button key={t.id} type="button" className={tab === i ? "on" : ""} onClick={() => goTab(i)}>
            <i>{t.icon}</i>
            {t.label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className="exp-chat-fab"
        aria-label="Open chat"
        onClick={() => setSheet("chat")}
      >
        💬
      </button>

      {sheet === "project" && selected && (
        <div className="exp-sheet" onClick={() => setSheet(null)} role="presentation">
          <div className="exp-sheet-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={selected.title}>
            <div className="exp-sheet-handle" />
            <img src={selected.img} alt="" style={{ width: 56, height: 56, objectFit: "contain" }} />
            <p className="exp-panel-tag" style={{ marginTop: 10 }}>{selected.tag}</p>
            <h2 style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em", margin: "6px 0 10px" }}>
              {selected.title}
            </h2>
            <p style={{ color: "var(--exp-muted)", lineHeight: 1.55 }}>{selected.desc}</p>
            <button type="button" className="exp-btn exp-btn-primary" style={{ marginTop: 18 }} onClick={() => setSheet(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {sheet === "chat" && (
        <div className="exp-sheet" onClick={() => setSheet(null)} role="presentation">
          <div
            className="exp-sheet-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Chat"
            style={{ display: "flex", flexDirection: "column", height: "78dvh", padding: 0 }}
          >
            <div style={{ padding: "14px 16px 8px" }}>
              <div className="exp-sheet-handle" />
              <strong style={{ fontFamily: "var(--font-display)" }}>JayHarold_Bot</strong>
            </div>
            <div
              ref={chatBodyRef}
              className="chat-body"
              style={{ flex: 1, height: "auto", marginBottom: 0, background: "#fff" }}
            >
              <div className="message bot-message">
                <ChatbotIcon />
                <p className="message-text">Hey! Ask me anything about Jay&apos;s work. 👋</p>
              </div>
              {chatHistory.map((chat, i) => (
                <ChatMessage key={i} chat={chat} />
              ))}
            </div>
            <div className="chat-footer" style={{ position: "relative" }}>
              <ChatForm
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                generateBotResponse={generateBotResponse}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
