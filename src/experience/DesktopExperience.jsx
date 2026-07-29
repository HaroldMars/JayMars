import { useEffect, useMemo, useRef, useState, useCallback } from "react";
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

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

function sectionFromProgress(p) {
  if (p < 0.16) return 0;
  if (p < 0.36) return 1;
  if (p < 0.56) return 2;
  if (p < 0.76) return 3;
  return 4;
}

export default function DesktopExperience() {
  const navigate = useNavigate();
  const progressRef = useRef(0);
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState(0);
  const [selected, setSelected] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [ready, setReady] = useState(false);
  const [loadPct, setLoadPct] = useState(12);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [chatHistory, chatOpen]);

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

  useEffect(() => {
    let p = 12;
    const t = setInterval(() => {
      p = Math.min(100, p + Math.random() * 18 + 8);
      setLoadPct(p);
      if (p >= 100) {
        clearInterval(t);
        setTimeout(() => setReady(true), 280);
      }
    }, 140);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const max = el.offsetHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progressRef.current = p;
      setProgress(p);
      setSection(sectionFromProgress(p));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = useCallback((idx) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.offsetHeight - window.innerHeight;
    const targets = [0, 0.26, 0.46, 0.66, 0.9];
    window.scrollTo({ top: targets[idx] * max, behavior: "smooth" });
  }, []);

  const opacityFor = (idx) => {
    const centers = [0.05, 0.26, 0.46, 0.66, 0.88];
    const d = Math.abs(progress - centers[idx]);
    return Math.max(0, 1 - d / 0.18);
  };


  const projects = useMemo(() => PROJECTS, []);

  return (
    <div className="exp-root exp-desktop-root">
      <div className={`exp-loader ${ready ? "done" : ""}`} aria-hidden={ready}>
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

      <div className="exp-canvas-wrap" aria-hidden>
        <SceneCanvas
          progressRef={progressRef}
          projects={projects}
          selectedId={selected?.title}
          onSelectProject={(p) => setSelected(p)}
        />
      </div>

      <header className="exp-topbar">
        <a className="exp-brand-mark" href="#home" onClick={(e) => { e.preventDefault(); scrollToSection(0); }}>
          JayMars
        </a>
        <nav className="exp-nav" aria-label="Primary">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={section === i ? "active" : ""}
              onClick={() => scrollToSection(i)}
            >
              {s.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="exp-progress" aria-hidden>
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={section === i ? "on" : ""}
            onClick={() => scrollToSection(i)}
            title={s.label}
          />
        ))}
      </div>

      <div className="exp-desktop" ref={trackRef}>
        <div className="exp-scroll-track">
          <div className="exp-sticky-ui">
            {/* HOME */}
            <div
              className="exp-hero-copy"
              style={{
                opacity: opacityFor(0),
                transform: `translateY(${(1 - opacityFor(0)) * 28}px)`,
                position: "absolute",
                left: "clamp(18px, 5vw, 56px)",
                bottom: "clamp(28px, 5vh, 52px)",
                pointerEvents: section === 0 ? "auto" : "none", visibility: opacityFor(0) < 0.05 ? "hidden" : "visible",
              }}
            >
              <p className="exp-kicker">Entrepreneur · Builder · Vision</p>
              <h1 className="exp-brand-hero">
                JAYMARS
                <span className="inc">OS</span>
              </h1>
              <p className="exp-lede">
                Building software, products, and Illuminary Peak — an arctic-calm
                portfolio experience for Jay Harold Mars V. Abejar.
              </p>
              <div className="exp-cta-row">
                <button type="button" className="exp-btn exp-btn-primary" onClick={() => scrollToSection(2)}>
                  Explore work
                </button>
                <button type="button" className="exp-btn exp-btn-ghost" onClick={() => scrollToSection(4)}>
                  Contact
                </button>
              </div>
            </div>

            {/* ABOUT */}
            <div
              className="exp-section-copy"
              style={{
                opacity: opacityFor(1),
                transform: `translateY(${(1 - opacityFor(1)) * 24}px)`,
                position: "absolute",
                left: "clamp(18px, 5vw, 56px)",
                bottom: "clamp(28px, 5vh, 52px)",
                pointerEvents: section === 1 ? "auto" : "none", visibility: opacityFor(1) < 0.05 ? "hidden" : "visible",
              }}
            >
              <div className="exp-content-card">
                <p className="exp-panel-tag">About</p>
                <div style={{ display: "flex", gap: 14, alignItems: "center", marginTop: 8 }}>
                  <img src={Jay} alt="Jay" style={{ width: 64, height: 64, borderRadius: 16, objectFit: "cover" }} />
                  <div>
                    <h2 style={{ margin: 0, fontSize: "1.35rem" }}>Jay Harold Mars V. Abejar</h2>
                    <p style={{ margin: "4px 0 0" }}>CEO &amp; Founder · Illuminary Peak</p>
                  </div>
                </div>
                <p style={{ marginTop: 14 }}>
                  Entrepreneur driven by vision and craft — building modern web apps,
                  AI copilots, and products that turn ideas into real impact.
                </p>
                <div className="exp-grid-mini">
                  {[["💡", "Entrepreneur"], ["🚀", "Big Vision"], ["⚙️", "Innovation"], ["🔥", "Ambitious"]].map(
                    ([e, t]) => (
                      <div className="exp-chip" key={t}>
                        <span>{e}</span>
                        {t}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* PROJECTS */}
            <div
              className="exp-section-copy"
              style={{
                opacity: opacityFor(2),
                transform: `translateY(${(1 - opacityFor(2)) * 24}px)`,
                position: "absolute",
                left: "clamp(18px, 5vw, 56px)",
                bottom: "clamp(28px, 5vh, 52px)",
                pointerEvents: section === 2 ? "auto" : "none", visibility: opacityFor(2) < 0.05 ? "hidden" : "visible",
              }}
            >
              <div className="exp-content-card">
                <p className="exp-panel-tag">Selected work</p>
                <h2>Projects in the ice</h2>
                <p>
                  Click a floating crystal in the scene — or pick a project below —
                  to open details. Scroll further to keep the journey moving.
                </p>
                <div className="exp-grid-mini" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  {PROJECTS.map((p) => (
                    <button
                      key={p.title}
                      type="button"
                      className="exp-chip"
                      style={{ cursor: "pointer", textAlign: "left", width: "100%" }}
                      onClick={() => setSelected(p)}
                    >
                      <img src={p.img} alt="" />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {p.title}
                      </span>
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
            </div>

            {/* SKILLS */}
            <div
              className="exp-section-copy"
              style={{
                opacity: opacityFor(3),
                transform: `translateY(${(1 - opacityFor(3)) * 24}px)`,
                position: "absolute",
                left: "clamp(18px, 5vw, 56px)",
                bottom: "clamp(28px, 5vh, 52px)",
                pointerEvents: section === 3 ? "auto" : "none", visibility: opacityFor(3) < 0.05 ? "hidden" : "visible",
              }}
            >
              <div className="exp-content-card">
                <p className="exp-panel-tag">Stack &amp; services</p>
                <h2>Tools I build with</h2>
                <div className="exp-grid-mini" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                  {TECH_STACK.slice(0, 8).map((t) => (
                    <div className="exp-chip" key={t.name} title={t.name} style={{ justifyContent: "center", flexDirection: "column", gap: 6 }}>
                      <img src={t.icon} alt={t.name} onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      <span style={{ fontSize: 10, opacity: 0.7 }}>{t.name}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
                  {SERVICES.slice(0, 3).map((s) => (
                    <div key={s.title} className="exp-chip">
                      <span>{s.icon}</span>
                      <div>
                        <strong style={{ display: "block", fontSize: 13 }}>{s.title}</strong>
                        <span style={{ fontSize: 12, fontWeight: 400, color: "var(--exp-muted)" }}>{s.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CONTACT */}
            <div
              className="exp-section-copy"
              style={{
                opacity: opacityFor(4),
                transform: `translateY(${(1 - opacityFor(4)) * 24}px)`,
                position: "absolute",
                left: "clamp(18px, 5vw, 56px)",
                bottom: "clamp(28px, 5vh, 52px)",
                pointerEvents: section === 4 ? "auto" : "none", visibility: opacityFor(4) < 0.05 ? "hidden" : "visible",
              }}
            >
              <div className="exp-content-card">
                <p className="exp-panel-tag">Contact</p>
                <h2>Let&apos;s build together</h2>
                <p>Open to collaborations, freelance work, and ambitious product ideas.</p>
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
                    Say hello
                  </a>
                </div>
              </div>
            </div>

            {progress < 0.12 && <div className="exp-scroll-hint">Scroll to explore</div>}
          </div>
        </div>
      </div>

      {selected && (
        <aside className="exp-panel" role="dialog" aria-label={selected.title}>
          <button type="button" className="exp-panel-close" onClick={() => setSelected(null)} aria-label="Close">
            ×
          </button>
          <img src={selected.img} alt="" />
          <p className="exp-panel-tag">{selected.tag}</p>
          <h3>{selected.title}</h3>
          <p>{selected.desc}</p>
        </aside>
      )}

      <button
        type="button"
        className="exp-chat-fab"
        style={{ bottom: 28, right: 28 }}
        aria-label="Open chat"
        onClick={() => setChatOpen((v) => !v)}
      >
        {chatOpen ? "×" : "💬"}
      </button>

      {chatOpen && (
        <aside
          className="exp-panel"
          style={{ right: 28, bottom: 96, top: "auto", transform: "none", width: minPanelWidth() }}
          role="dialog"
          aria-label="Chat"
        >
          <button type="button" className="exp-panel-close" onClick={() => setChatOpen(false)} aria-label="Close chat">
            ×
          </button>
          <p className="exp-panel-tag">Assistant</p>
          <h3 style={{ marginBottom: 8 }}>JayHarold_Bot</h3>
          <div
            ref={chatBodyRef}
            className="chat-body"
            style={{ height: 280, marginBottom: 0, background: "#fff", borderRadius: 14 }}
          >
            <div className="message bot-message">
              <ChatbotIcon />
              <p className="message-text">Hey! Ask me anything about Jay&apos;s work. 👋</p>
            </div>
            {chatHistory.map((chat, i) => (
              <ChatMessage key={i} chat={chat} />
            ))}
          </div>
          <div className="chat-footer" style={{ position: "relative", marginTop: 10, padding: "10px 0 0" }}>
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </aside>
      )}
    </div>
  );
}

function minPanelWidth() {
  if (typeof window === "undefined") return 360;
  return Math.min(380, window.innerWidth - 32);
}
