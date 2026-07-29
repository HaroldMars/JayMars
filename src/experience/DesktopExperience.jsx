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

const SECTION_AT = [0, 0.22, 0.42, 0.62, 0.82];

function sectionFromProgress(p) {
  if (p < 0.14) return 0;
  if (p < 0.34) return 1;
  if (p < 0.54) return 2;
  if (p < 0.74) return 3;
  return 4;
}

export default function DesktopExperience() {
  const navigate = useNavigate();
  const progressRef = useRef(0);
  const spacerRef = useRef(null);
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
      const el = spacerRef.current;
      if (!el) return;
      const max = Math.max(1, el.offsetHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      progressRef.current = p;
      setProgress(p);
      setSection(sectionFromProgress(p));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToSection = useCallback((idx) => {
    const el = spacerRef.current;
    if (!el) return;
    const max = Math.max(1, el.offsetHeight - window.innerHeight);
    window.scrollTo({ top: SECTION_AT[idx] * max, behavior: "smooth" });
  }, []);

  /** Discrete active section — always fully visible, no fragile opacity stack */
  const show = (idx) => section === idx;

  const projects = useMemo(() => PROJECTS, []);
  const vignette = 0.1 + progress * 0.2;

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

      {/* Subtle CSS wash — primary blur comes from WebGL DepthOfField */}
      <div
        className="exp-scroll-fx"
        style={{
          opacity: Math.min(0.35, progress * 0.45),
          background: `radial-gradient(70% 60% at 50% 40%, transparent 40%, rgba(170,178,188,${vignette}) 100%)`,
        }}
        aria-hidden
      />

      <header className="exp-topbar">
        <a
          className="exp-brand-mark"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection(0);
          }}
        >
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

      {/* Fixed UI layer — never scrolls away (fixes invisible content bug) */}
      <div className="exp-fixed-ui">
        {show(0) && (
          <div className="exp-hero-copy exp-ui-block exp-ui-enter">
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
        )}

        {show(1) && (
          <div className="exp-section-copy exp-ui-block exp-ui-enter">
            <div className="exp-content-card">
              <p className="exp-panel-tag">About</p>
              <div className="exp-about-row">
                <img src={Jay} alt="Jay" className="exp-avatar" />
                <div>
                  <h2>Jay Harold Mars V. Abejar</h2>
                  <p className="exp-sub">CEO &amp; Founder · Illuminary Peak</p>
                </div>
              </div>
              <p>
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
        )}

        {show(2) && (
          <div className="exp-section-copy exp-ui-block exp-ui-enter">
            <div className="exp-content-card">
              <p className="exp-panel-tag">Selected work</p>
              <h2>Projects in the ice</h2>
              <p>
                Click a floating crystal in the scene — or pick a project below —
                to open details.
              </p>
              <div className="exp-grid-mini exp-project-grid">
                {PROJECTS.map((p) => (
                  <button
                    key={p.title}
                    type="button"
                    className="exp-chip exp-project-chip"
                    onClick={() => setSelected(p)}
                  >
                    <img src={p.img} alt="" />
                    <span>{p.title}</span>
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
        )}

        {show(3) && (
          <div className="exp-section-copy exp-ui-block exp-ui-enter">
            <div className="exp-content-card">
              <p className="exp-panel-tag">Stack &amp; services</p>
              <h2>Tools I build with</h2>
              <div className="exp-grid-mini exp-skill-grid">
                {TECH_STACK.slice(0, 8).map((t) => (
                  <div className="exp-chip exp-skill-chip" key={t.name} title={t.name}>
                    <img
                      src={t.icon}
                      alt={t.name}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <span>{t.name}</span>
                  </div>
                ))}
              </div>
              <div className="exp-service-list">
                {SERVICES.slice(0, 3).map((s) => (
                  <div key={s.title} className="exp-chip">
                    <span>{s.icon}</span>
                    <div>
                      <strong>{s.title}</strong>
                      <span className="exp-chip-desc">{s.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {show(4) && (
          <div className="exp-section-copy exp-ui-block exp-ui-enter">
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
        )}

        {progress < 0.1 && section === 0 && (
          <div className="exp-scroll-hint">Scroll to explore</div>
        )}
      </div>

      {/* Tall spacer drives scroll progress — UI itself is fixed */}
      <div className="exp-scroll-spacer" ref={spacerRef} aria-hidden />

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
          className="exp-panel exp-chat-panel"
          role="dialog"
          aria-label="Chat"
        >
          <button type="button" className="exp-panel-close" onClick={() => setChatOpen(false)} aria-label="Close chat">
            ×
          </button>
          <p className="exp-panel-tag">Assistant</p>
          <h3>JayHarold_Bot</h3>
          <div ref={chatBodyRef} className="chat-body exp-chat-body">
            <div className="message bot-message">
              <ChatbotIcon />
              <p className="message-text">Hey! Ask me anything about Jay&apos;s work. 👋</p>
            </div>
            {chatHistory.map((chat, i) => (
              <ChatMessage key={i} chat={chat} />
            ))}
          </div>
          <div className="chat-footer exp-chat-footer">
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
