/* ============================================================
   apps.jsx — shared app registry, data, and content views
   used by both the macOS Desktop and the iOS MobileOS.
   ============================================================ */
import React, { useEffect, useRef } from "react";
import Jaybot from "../Jaybot";
import ChatForm from "../ChatForm";
import ChatMessage from "../ChatMessage";
import ChatbotIcon from "../ChatbotIcon";
import Jay from "../../assets/Mypic.jpg";
import { TECH_STACK, PROJECTS, SERVICES, CONTACTS } from "./data";

/* ------------------------------------------------------------------ content views */
export function AboutApp() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-4">
        <img src={Jay} alt="Jay" className="w-20 h-20 rounded-2xl object-cover shadow-lg" />
        <div>
          <h2 className="text-xl font-bold">Jay Harold Mars V. Abejar</h2>
          <p className="text-sm opacity-70">Entrepreneur · Future Software Engineer</p>
          <p className="text-sm opacity-70">CEO &amp; Founder of Illuminary Peak</p>
        </div>
      </div>
      <p className="text-sm mt-5 leading-relaxed opacity-90">
        I am an entrepreneur driven by a big vision, a passion for innovation, and the courage to always
        explore more. I am a kind but deeply ambitious person, determined to turn ideas into real impact
        and to see how far I can go in the next decade.
      </p>
      <p className="text-sm mt-3 leading-relaxed opacity-90">
        I am also developing my own AI Copilot, Nyia, currently in its early stages — gradually learning to
        train my own AI and improve its efficiency at work.
      </p>
      <div className="grid grid-cols-2 gap-3 mt-5">
        {[["💡", "Entrepreneur"], ["🚀", "Big Vision"], ["⚙️", "Innovation"], ["🔥", "Ambitious"]].map(([e, t]) => (
          <div key={t} className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "rgba(127,127,140,.15)" }}>
            <span className="text-lg">{e}</span><span className="text-sm font-medium">{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProjectsApp({ navigate }) {
  return (
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {PROJECTS.map((p) => (
        <div key={p.title} className="rounded-xl p-4 flex gap-3" style={{ background: "rgba(127,127,140,.14)", border: "1px solid rgba(150,150,160,.2)" }}>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,.1)" }}>
            <img src={p.img} alt={p.title} className="w-9 h-9 object-contain" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider opacity-50 font-semibold">{p.tag}</p>
            <h3 className="font-bold text-sm">{p.title}</h3>
            <p className="text-xs opacity-70 leading-snug mt-0.5">{p.desc}</p>
          </div>
        </div>
      ))}
      <button onClick={() => navigate("/tutorials")} className="col-span-full text-xs opacity-70 hover:opacity-100 underline">
        See the WEYAPP tutorial →
      </button>
    </div>
  );
}

export function SkillsApp() {
  return (
    <div className="p-6">
      <h3 className="font-bold mb-4">Technologies &amp; Tools</h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {TECH_STACK.map((t) => (
          <div key={t.name} title={t.name} className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition-transform hover:-translate-y-1" style={{ background: "rgba(127,127,140,.14)" }}>
            <img src={t.icon} alt={t.name} className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = "none"; }} />
            <span className="text-[9px] opacity-60 truncate w-full text-center">{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ServicesApp() {
  return (
    <div className="p-6 flex flex-col gap-3">
      {SERVICES.map((s) => (
        <div key={s.title} className="rounded-xl p-4 flex gap-3 items-start" style={{ background: "rgba(127,127,140,.14)" }}>
          <span className="text-2xl">{s.icon}</span>
          <div><h3 className="font-bold text-sm">{s.title}</h3><p className="text-xs opacity-70 mt-0.5 leading-snug">{s.desc}</p></div>
        </div>
      ))}
    </div>
  );
}

export function IlluminaryApp() {
  return (
    <div className="p-6">
      <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>CEO &amp; Founder</span>
      <h2 className="text-2xl font-black mt-3">Illuminary Peak</h2>
      <p className="text-xs font-semibold mt-1" style={{ color: "#c084fc" }}>Software as a Service · Innovation</p>
      <p className="text-sm mt-4 leading-relaxed opacity-90">
        I founded and lead Illuminary Peak, a Software-as-a-Service company built on innovation. As CEO, I
        drive the vision, the products, and the mission to deliver software that makes a difference.
      </p>
      <div className="mt-5 rounded-xl p-4 text-sm" style={{ background: "rgba(127,127,140,.14)" }}>
        <p className="opacity-70">“Every great vision begins at the peak — then we build our way down to the city.”</p>
      </div>
    </div>
  );
}

export function MessagesApp({ chatHistory, setChatHistory, generateBotResponse }) {
  const bodyRef = useRef(null);
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [chatHistory]);
  return (
    <div className="flex flex-col h-full" style={{ background: "#fff" }}>
      <div ref={bodyRef} className="chat-body" style={{ height: "auto", flex: 1, marginBottom: 0 }}>
        <div className="message bot-message">
          <ChatbotIcon />
          <p className="message-text">Hey there! How can I help you today? 👋</p>
        </div>
        {chatHistory.map((chat, i) => <ChatMessage key={i} chat={chat} />)}
      </div>
      <div className="chat-footer" style={{ position: "relative" }}>
        <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
      </div>
    </div>
  );
}

export function JaybotApp() {
  return <div className="flex items-center justify-center h-full py-8"><Jaybot /></div>;
}

export function ContactApp() {
  return (
    <div className="p-6">
      <h3 className="font-bold mb-4">Let's work together</h3>
      <div className="flex flex-col gap-2.5">
        {CONTACTS.map((c) => (
          <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 no-underline transition-transform hover:translate-x-1" style={{ background: "rgba(127,127,140,.14)", color: "inherit" }}>
            <span className="text-lg">{c.icon}</span><span className="text-sm">{c.label}</span>
          </a>
        ))}
      </div>
      <a href="mailto:abejar199@gmail.com" className="inline-block mt-5 px-5 py-2.5 rounded-full text-sm font-semibold text-white no-underline" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}>Say Hello 👋</a>
    </div>
  );
}

/* Render an app's content by id. `ctx` carries navigate + chat wiring. */
export function AppView({ id, ctx }) {
  switch (id) {
    case "about": return <AboutApp />;
    case "projects": return <ProjectsApp navigate={ctx.navigate} />;
    case "skills": return <SkillsApp />;
    case "services": return <ServicesApp />;
    case "illuminary": return <IlluminaryApp />;
    case "messages": return <MessagesApp chatHistory={ctx.chatHistory} setChatHistory={ctx.setChatHistory} generateBotResponse={ctx.generateBotResponse} />;
    case "jaybot": return <JaybotApp />;
    case "contact": return <ContactApp />;
    default: return null;
  }
}
