
import React, { useState, useEffect, useRef } from "react";
import Logo from "../assets/logo.png";
import Pet from "../assets/logodog.png";
import ChatMessage from "../components/ChatMessage";
import ChatbotIcon from "../components/ChatbotIcon";
import ChatForm from "../components/ChatForm";
import { config } from "../utils/config";

  "https://scontent.fsin11-1.fna.fbcdn.net/v/t39.30808-6/527724206_1978165126305131_7263521750765554623_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeFeKqtcWGp1rZpFLxK_H9KcTsBK9TbdY2JOwEr1Nt1jYlwHF8o0b3ozjsC3Pek219aEIYTySB529jo-gBwWkrW9&_nc_ohc=e25NW6QfhJEQ7kNvwHSXhtV&_nc_oc=AdnbvzIWqhQFFfN7uy-RpoucCzNJm5aznYppDl0G54S1tSb-wyBj6TGIpsHLLcrxz0Q&_nc_zt=23&_nc_ht=scontent.fsin11-1.fna&_nc_gid=mbpJPqRhzgiYVIeDqAsz_w&oh=00_AfqXyd6GbEt-QFlLTIHV8s8ar-rqPSjXoO1EIn0v30AmkQ&oe=69796CCA";

const NAV_LINKS = ["home", "about", "projects", "services", "contact"];

const TECH_STACK = [
  { name: "HTML5",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3",       icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "Python",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "C++",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "Figma",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "React",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Tailwind",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
  { name: "MongoDB",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "GitHub",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "VS Code",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
  { name: "Arduino",    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg" },
  { name: "Vite",       icon: "https://vitejs.dev/logo.svg" },
  { name: "Vercel",     icon: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
];

const SERVICES = [
  { icon: "💻", title: "Web Development",  desc: "Building modern, responsive web apps using React, Tailwind CSS, and JavaScript." },
  { icon: "🎨", title: "UI/UX Design",     desc: "Crafting clean, user-friendly interfaces with Figma that balance aesthetics and usability." },
  { icon: "🤖", title: "AI Integration",   desc: "Integrating AI tools and building smart features into web applications." },
];

// ── Scroll-triggered fade-in ──────────────────────────────────────────────────
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
        transform: inView ? "translateY(0)" : "translateY(26px)",
        transition: `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionHeading({ children, sub }) {
  return (
    <FadeIn>
      <h2
        className="text-3xl font-black mb-1"
        style={{
          background: "linear-gradient(90deg,#fff 40%,#a78bfa 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </h2>
      <div className="w-10 h-0.5 mt-2 mb-2 rounded-full" style={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)" }} />
      {sub && <p className="text-sm text-white/40 mt-1 mb-8">{sub}</p>}
    </FadeIn>
  );
}

// ── Floating particles (from your original code) ──────────────────────────────
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const particles = [];
    for (let i = 0; i < 45; i++) {
      const size = Math.random() * 5 + 2;
      const el = document.createElement("div");
      Object.assign(el.style, {
        position: "absolute",
        width: size + "px",
        height: size + "px",
        borderRadius: "50%",
        background: `rgba(${Math.random() > 0.5 ? "139,92,246" : "59,130,246"},${(Math.random() * 0.3 + 0.05).toFixed(2)})`,
        top: Math.random() * 100 + "%",
        left: Math.random() * 100 + "%",
        pointerEvents: "none",
      });
      const drift = (Math.random() - 0.5) * 120;
      const anim = el.animate(
        [
          { transform: "translateY(0) translateX(0)", opacity: 0 },
          { opacity: 0.7, offset: 0.1 },
          { opacity: 0.4, offset: 0.9 },
          { transform: `translateY(-100vh) translateX(${drift}px)`, opacity: 0 },
        ],
        {
          duration: 18000 + Math.random() * 12000,
          iterations: Infinity,
          easing: "linear",
          delay: Math.random() * 15000,
        }
      );
      particles.push({ el, anim });
      container.appendChild(el);
    }
    return () => particles.forEach(({ el, anim }) => { anim.cancel(); el.remove(); });
  }, []);
  return <div ref={ref} className="fixed inset-0 pointer-events-none overflow-hidden z-0" />;
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Home() {
  const [chatHistory, setChatHistory] = useState([]);
  const [showChatbot, setShowChatbot]  = useState(false);
  const [menuOpen,    setMenuOpen]     = useState(false);
  const [scrolled,    setScrolled]     = useState(false);

  // Your original Gemini bot logic — untouched
  const generateBotResponse = async (history) => {
    history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));
    const requestOptions = {
      method: "POST",
      headers: {
        "x-goog-api-key": `${config.Gemini_ApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contents: history }),
    };
    try {
      const response = await fetch(config.Gemini_ApiUrl, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || "Something went wrong!");
      data.candidates.forEach((candidate) => {
        setChatHistory((prev) => [
          ...prev.filter((msg) => msg.text !== "Thinking..."),
          {
            role: "model",
            text: candidate.content.parts.map((part) => part.text).join(""),
          },
        ]);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div
      className="relative text-white font-sans overflow-x-hidden"
      style={{ background: "linear-gradient(135deg,#0c0c14 0%,#12121e 50%,#0c0c18 100%)" }}
    >
      {/* Particles */}
      <Particles />

      {/* Ambient glow blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ position:"absolute", top:"6%",  left:"8%",  width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,.10),transparent 70%)", filter:"blur(50px)" }} />
        <div style={{ position:"absolute", top:"55%", right:"4%", width:340, height:340, borderRadius:"50%", background:"radial-gradient(circle,rgba(59,130,246,.08),transparent 70%)",  filter:"blur(50px)" }} />
        <div style={{ position:"absolute", bottom:"8%",left:"35%", width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(236,72,153,.07),transparent 70%)", filter:"blur(50px)" }} />
      </div>

      {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background:     scrolled ? "rgba(12,12,20,.90)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom:   scrolled ? "1px solid rgba(255,255,255,.06)" : "none",
        }}
      >
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          {/* Logo / name pill */}
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2.5 group"
          >
            <img
              src={Logo}
              alt="Jay Harold"
              className="w-8 h-8 rounded-full object-cover border border-white/20 group-hover:border-purple-400/60 transition-colors"
            />
            <span className="font-bold text-sm text-white/80 group-hover:text-white transition-colors hidden sm:block">
              JayMars_Abejar
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm capitalize text-white/55 hover:text-white transition-colors duration-200"
              >
                {id}
              </button>
            ))}
            {/* Ask Nica AI button */}
            <button
              onClick={() => setShowChatbot((p) => !p)}
              className="flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-full font-medium transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}
            >
              <span style={{ fontSize: 11 }}>✦</span> Ask Nica AI
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMenuOpen((p) => !p)}
          >
            {menuOpen ? (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="4" x2="18" y2="18"/>
                <line x1="18" y1="4" x2="4" y2="18"/>
              </svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="7"  x2="19" y2="7"/>
                <line x1="3" y1="12" x2="19" y2="12"/>
                <line x1="3" y1="17" x2="19" y2="17"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden px-5 pb-4 flex flex-col gap-1"
            style={{ background: "rgba(12,12,20,.97)", borderBottom: "1px solid rgba(255,255,255,.06)" }}
          >
            {NAV_LINKS.map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left text-sm capitalize text-white/65 py-2.5 border-b border-white/5 hover:text-white transition-colors"
              >
                {id}
              </button>
            ))}
            <button
              onClick={() => { setShowChatbot((p) => !p); setMenuOpen(false); }}
              className="mt-3 self-start flex items-center gap-1.5 text-sm px-4 py-2 rounded-full font-medium"
              style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}
            >
              <span style={{ fontSize: 11 }}>✦</span> Ask Nica AI
            </button>
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section
        id="home"
        className="relative z-10 min-h-screen flex flex-col justify-center px-5 pt-28 pb-20 max-w-5xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
          {/* Left — text */}
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-purple-400 mb-2 font-medium">
              Web Developer &amp; UI/UX Designer
            </p>
            <p className="text-xs text-white/40 mb-1">Future Software Engineer and Entrepreneur</p>
            <h1
              className="font-extrabold leading-none mb-6"
              style={{
                fontSize: "clamp(2.6rem,7.5vw,5.2rem)",
                letterSpacing: "-0.03em",
                background: "linear-gradient(135deg,#fff 30%,#a78bfa 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Jay Harold<br />Mars Abejar
            </h1>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => scrollTo("about")}
                className="px-5 py-2.5 rounded-full text-sm border border-white/15 text-white/65 hover:border-white/40 hover:text-white transition-all duration-200"
              >
                Know me more
              </button>
              <button
                onClick={() => scrollTo("experience")}
                className="px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all duration-200"
                style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}
              >
                Experience
              </button>
            </div>
          </div>

          {/* Right — Nica AI card */}
          <div
            className="relative overflow-hidden rounded-2xl p-6 flex flex-col z-0 items-center justify-center gap-3 md:w-72 flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,rgba(124,58,237,.22) 0%,rgba(236,72,153,.12) 100%)",
              border: "1px solid rgba(124,58,237,.30)",
              minHeight: 160,
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at top left,rgba(124,58,237,.15),transparent 60%)" }}
            />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <span
                className="text-4xl font-black text-purple-300"
                style={{ fontFamily: "serif", letterSpacing: "-0.05em" }}
              >
                n
              </span>
              <p className="text-xs text-white/45">Ask Nica AI</p>
              <p className="text-center text-sm font-semibold text-white/75">
                Nica AI, is not yet available
              </p>
              <button
                onClick={() => setShowChatbot((p) => !p)}
                className="mt-1 text-xs px-4 py-1.5 rounded-full font-medium hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}
              >
                Try JayHarold_Bot instead
              </button>
            </div>
          </div>
        </div>

        {/* About snippet under hero */}
        <div className="mt-16 max-w-2xl" id="about">
          <h2 className="text-2xl font-bold mb-1">My Name is Jay Harold Mars Abejar</h2>
          <p className="text-sm text-purple-300 mb-4">
            A young Entrepreneur and a Future Software Engineer. 1st Year Bachelor of Science and Information Technology
          </p>
          <p className="text-sm text-white/60 leading-relaxed mb-4">
            I am pursuing my goal of becoming the CEO and founder of a company, which I am currently working towards. I am an ambitious individual determined to realise this vision. I eagerly anticipate the progress I will make in the next decade.
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            I am also developing my own AI Copilot. My project is named Nyia and is currently in the early stages due to financial constraints. However, I am gradually learning to train my own AI and improve its efficiency at work.
          </p>
        </div>
      </section>

      {/* ── EXPERIENCE ──────────────────────────────────────────────────────── */}
      <section id="experience" className="relative z-10 px-5 py-24 max-w-5xl mx-auto">
        <SectionHeading sub="Technologies & tools I work with">My Experience</SectionHeading>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-3">
          {TECH_STACK.map((tech, i) => (
            <FadeIn key={tech.name} delay={i * 40}>
              <div
                className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-default group transition-all duration-200 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.07)" }}
                title={tech.name}
              >
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="w-8 h-8 object-contain"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                <span className="text-[10px] text-white/35 group-hover:text-white/65 transition-colors hidden sm:block truncate w-full text-center">
                  {tech.name}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ────────────────────────────────────────────────────────── */}
      <section id="projects" className="relative z-10 px-5 py-24 max-w-5xl mx-auto">
        <SectionHeading sub="Things I've built and am working on">My Projects</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {/* PET-LOCATION — your capstone */}
          <FadeIn delay={0}>
            <div
              className="relative overflow-hidden rounded-2xl p-6 flex flex-col gap-3 h-56 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg,rgba(180,83,9,.45) 0%,rgba(120,53,15,.30) 100%)",
                border: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "radial-gradient(ellipse at top left,rgba(251,146,60,.2),transparent 60%)" }} />
              {/* Use your Pet asset */}
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center relative z-10"
                style={{ background: "rgba(255,255,255,.08)" }}>
                <img src={Pet} alt="PET-LOCATION" className="w-9 h-9 object-contain" />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">Capstone · 2024–2025</span>
                <h3 className="text-lg font-bold text-white/95 mt-0.5">PET-LOCATION</h3>
                <p className="text-sm text-white/55 leading-relaxed mt-1">
                  A smart pet tracking system designed to help owners locate their pets in real time.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: "white", filter: "blur(30px)", transform: "translate(30%,30%)" }} />
            </div>
          </FadeIn>

          {/* PORTFOLIO SITE */}
          <FadeIn delay={100}>
            <div
              className="relative overflow-hidden rounded-2xl p-6 flex flex-col gap-3 h-56 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg,rgba(30,64,175,.45) 0%,rgba(14,116,144,.30) 100%)",
                border: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "radial-gradient(ellipse at top left,rgba(56,189,248,.2),transparent 60%)" }} />
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center relative z-10"
                style={{ background: "rgba(255,255,255,.08)" }}>
                <img src={Logo} alt="Portfolio" className="w-9 h-9 object-contain" />
              </div>
              <div className="relative z-10">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">React · Design</span>
                <h3 className="text-lg font-bold text-white/95 mt-0.5">Portfolio Site</h3>
                <p className="text-sm text-white/55 leading-relaxed mt-1">
                  My personal website & portfolio built with React and Tailwind CSS to showcase my work and journey.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: "white", filter: "blur(30px)", transform: "translate(30%,30%)" }} />
            </div>
          </FadeIn>

          {/* NYLA AI */}
          <FadeIn delay={200}>
            <div
              className="relative overflow-hidden rounded-2xl p-6 flex flex-col gap-3 h-56 group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg,rgba(109,40,217,.45) 0%,rgba(157,23,77,.30) 100%)",
                border: "1px solid rgba(255,255,255,.08)",
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "radial-gradient(ellipse at top left,rgba(168,85,247,.2),transparent 60%)" }} />
              <div className="w-12 h-12 rounded-xl flex items-center justify-center relative z-10 text-2xl"
                style={{ background: "rgba(255,255,255,.08)" }}>
                🤖
              </div>
              <div className="relative z-10">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">AI · In Progress</span>
                <h3 className="text-lg font-bold text-white/95 mt-0.5">Nyia AI Copilot</h3>
                <p className="text-sm text-white/55 leading-relaxed mt-1">
                  My own AI Copilot — currently in early stages. Gradually learning to train and improve it.
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                style={{ background: "white", filter: "blur(30px)", transform: "translate(30%,30%)" }} />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────────── */}
      <section id="services" className="relative z-10 px-5 py-24 max-w-5xl mx-auto">
        <SectionHeading sub="What I can do for you">Services</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.title} delay={i * 100}>
              <div
                className="rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="font-bold text-white/90">{s.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────────────────────── */}
      <section id="contact" className="relative z-10 px-5 py-24 max-w-5xl mx-auto">
        <SectionHeading sub="Let's work together">Contact</SectionHeading>
        <FadeIn delay={100}>
          <div
            className="rounded-2xl p-8 flex flex-col sm:flex-row gap-10"
            style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}
          >
            <div className="flex flex-col gap-4 flex-1">
              {[
                { icon: "📞", label: "+63 98978787998" },
                { icon: "✉️", label: "jaja@gmail.com" },
                { icon: "🔵", label: "fb jaja" },
                { icon: "📷", label: "ig hasjask" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-3 group cursor-pointer">
                  <span className="text-lg">{c.icon}</span>
                  <span className="text-sm text-white/65 group-hover:text-white transition-colors">{c.label}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <p className="text-sm text-white/50 leading-relaxed">
                Have a project in mind or want to collaborate? I'm open to freelance work, collaborations, and new opportunities. Let's build something great together!
              </p>
              <button
                className="mt-2 self-start px-5 py-2.5 rounded-full text-sm font-semibold text-white hover:opacity-90 transition-all duration-200"
                style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }}
              >
                Say Hello 👋
              </button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="relative z-10 px-5 py-8 text-center border-t border-white/5">
        <p className="text-xs text-white/25">© 2026 Jay Harold Mars V. Abejar · Built with React & Tailwind CSS</p>
      </footer>

      {/* ── CHATBOT TOGGLE BUTTON ────────────────────────────────────────────── */}
      <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
        <button
          id="chatbot-toggler"
          onClick={() => setShowChatbot((p) => !p)}
          className="fixed bottom-6 Z-10 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
          style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)", boxShadow: "0 8px 28px rgba(124,58,237,.5)" }}
        >
          <span className="material-symbols-rounded" style={{ color: "#fff" }}>mode_comment</span>
          <span className="material-symbols-rounded" style={{ color: "#fff" }}>close</span>
        </button>

        {/* ── CHATBOT POPUP ──────────────────────────────────────────────────── */}
        <div className="chatbot-popup Z-50">
          <div className="chat-header" style={{ background: "linear-gradient(135deg,rgba(124,58,237,.5),rgba(236,72,153,.3))", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
            <div className="header-info">
              <ChatbotIcon />
              <h2 className="logo-text">JayHarold_Bot</h2>
            </div>
            <button
              className="material-symbols-rounded"
              onClick={() => setShowChatbot(false)}
            >
              keyboard_arrow_down
            </button>
          </div>

          <div className="chat-body">
            <div className="message bot-message">
              <ChatbotIcon />
              <p className="message-text">Hey there! How can I help you today? 👋</p>
            </div>
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>

          <div className="chat-footer">
            <ChatForm
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              generateBotResponse={generateBotResponse}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
