import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["About", "Projects", "Services", "Contact"];

const TECH_STACK = [
  { name: "HTML5", color: "#E34F26", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS3", color: "#1572B6", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "JavaScript", color: "#F7DF1E", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "Python", color: "#3776AB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  { name: "C++", color: "#00599C", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  { name: "Figma", color: "#F24E1E", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
  { name: "React", color: "#61DAFB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Tailwind", color: "#06B6D4", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
  { name: "MongoDB", color: "#47A248", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  { name: "GitHub", color: "#ffffff", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "VS Code", color: "#007ACC", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
  { name: "Arduino", color: "#00979D", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg" },
  { name: "Vite", color: "#646CFF", icon: "https://vitejs.dev/logo.svg" },
  { name: "Vercel", color: "#ffffff", icon: "https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png" },
];

const PROJECTS = [
  {
    title: "Nyia AI Copilot",
    desc: "An AI-powered copilot project I'm developing to train my own model and improve productivity.",
    tag: "AI / In Progress",
    gradient: "from-purple-900/60 to-pink-900/40",
  },
  {
    title: "Portfolio Website",
    desc: "My personal portfolio built with React, showcasing my projects, skills, and journey as a developer.",
    tag: "React / Design",
    gradient: "from-blue-900/60 to-cyan-900/40",
  },
  {
    title: "Coming Soon",
    desc: "More projects are currently being developed. Stay tuned for exciting releases.",
    tag: "Future Project",
    gradient: "from-slate-800/60 to-slate-700/40",
  },
];

const SERVICES = [
  {
    icon: "💻",
    title: "Web Development",
    desc: "Building modern, responsive web applications using React, Tailwind CSS, and JavaScript.",
  },
  {
    icon: "🎨",
    title: "UI/UX Design",
    desc: "Crafting clean, user-friendly interfaces with Figma that blend aesthetics with functionality.",
  },
  {
    icon: "🤖",
    title: "AI Integration",
    desc: "Integrating AI tools and building smart features into web applications.",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
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
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div
      className="min-h-screen text-white font-sans"
      style={{
        background: "linear-gradient(135deg, #0f0f14 0%, #141420 40%, #0f0f1a 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div style={{ position: "absolute", top: "8%", left: "10%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", top: "50%", right: "5%", width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "30%", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>

      {/* NAVBAR */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(15,15,20,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}
      >
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between">
          <span className="font-bold text-base tracking-tight text-white/90">JayMars_Abejar</span>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l.toLowerCase())}
                className="text-sm text-white/60 hover:text-white transition-colors duration-200"
              >
                {l}
              </button>
            ))}
            <button
              onClick={() => scrollTo("about")}
              className="flex items-center gap-2 text-sm px-4 py-1.5 rounded-full font-medium transition-all duration-200 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", color: "#fff" }}
            >
              <span style={{ fontSize: 12 }}>✦</span> Ask Nica AI
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="4" x2="18" y2="18"/><line x1="18" y1="4" x2="4" y2="18"/></svg>
            ) : (
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="7" x2="19" y2="7"/><line x1="3" y1="12" x2="19" y2="12"/><line x1="3" y1="17" x2="19" y2="17"/></svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-5 pb-4 flex flex-col gap-3" style={{ background: "rgba(15,15,20,0.97)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {NAV_LINKS.map((l) => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())} className="text-left text-sm text-white/70 py-1.5 border-b border-white/5">
                {l}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="about" className="relative z-10 min-h-screen flex flex-col justify-center px-5 pt-28 pb-16 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-widest text-purple-400 mb-3 font-medium">Web Developer & UI/UX Designer</p>
            <p className="text-xs text-white/40 mb-1">Future Software Engineer and Entrepreneur</p>
            <h1
              className="font-extrabold leading-none mb-6"
              style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)", letterSpacing: "-0.03em", background: "linear-gradient(135deg, #fff 30%, #a78bfa 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              Jake Moreno
            </h1>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => scrollTo("about")}
                className="px-5 py-2 rounded-full text-sm border border-white/15 text-white/70 hover:border-white/40 hover:text-white transition-all duration-200"
              >
                Know me more
              </button>
              <button
                onClick={() => scrollTo("experience")}
                className="px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #7c3aed, #6366f1)" }}
              >
                Experience
              </button>
            </div>
          </div>

          {/* Nica AI card */}
          <div
            className="relative overflow-hidden rounded-2xl p-6 flex flex-col items-center justify-center gap-3 md:w-72"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(236,72,153,0.15) 100%)", border: "1px solid rgba(124,58,237,0.3)", minHeight: 160 }}
          >
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at top left, rgba(124,58,237,0.15), transparent 60%)" }} />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <span className="text-3xl font-black text-purple-300" style={{ fontFamily: "serif", letterSpacing: "-0.05em" }}>n</span>
              <p className="text-sm text-white/50">Ask Nica AI</p>
              <p className="text-center text-base font-semibold text-white/80">Nica AI, is not yet available</p>
            </div>
          </div>
        </div>

        {/* About text */}
        <div className="mt-16 max-w-2xl">
          <h2 className="text-2xl font-bold mb-1">My Name is Jake Moreno</h2>
          <p className="text-sm text-purple-300 mb-4">A young Entrepreneur and a Future Software Engineer. 1st Year Bachelor of Science and Information Technology</p>
          <p className="text-sm text-white/60 leading-relaxed mb-4">
            I am pursuing my goal of becoming the CEO and founder of a company, which I am currently working towards. I am an ambitious individual determined to realise this vision. I eagerly anticipate the progress I will make in the next decade.
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            I am also developing my own AI Copilot. My project is named Nyia and is currently in the early stages due to financial constraints. However, I am gradually learning to train my own AI and improve its efficiency at work.
          </p>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="relative z-10 px-5 py-20 max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-2">My Experience</h2>
          <p className="text-sm text-white/40 mb-10">Technologies & tools I work with</p>
        </FadeIn>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-3">
          {TECH_STACK.map((tech, i) => (
            <FadeIn key={tech.name} delay={i * 40}>
              <div
                className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-default group transition-all duration-200 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
                title={tech.name}
              >
                <img src={tech.icon} alt={tech.name} className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = "none"; }} />
                <span className="text-[10px] text-white/40 group-hover:text-white/70 transition-colors hidden sm:block truncate w-full text-center">{tech.name}</span>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="relative z-10 px-5 py-20 max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-2">My Projects</h2>
          <p className="text-sm text-white/40 mb-10">Things I've built and am working on</p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => (
            <FadeIn key={p.title} delay={i * 100}>
              <div
                className={`relative overflow-hidden rounded-2xl p-6 flex flex-col gap-3 h-52 bg-gradient-to-br ${p.gradient} group cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">{p.tag}</span>
                <h3 className="text-lg font-bold text-white/90">{p.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{p.desc}</p>
                <div className="absolute bottom-0 right-0 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: "white", filter: "blur(30px)", transform: "translate(30%, 30%)" }} />
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative z-10 px-5 py-20 max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-2">Services</h2>
          <p className="text-sm text-white/40 mb-10">What I can do for you</p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => (
            <FadeIn key={s.title} delay={i * 100}>
              <div
                className="rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="font-bold text-white/90">{s.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative z-10 px-5 py-20 max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-2xl font-bold mb-2">Contact</h2>
          <p className="text-sm text-white/40 mb-10">Let's work together</p>
        </FadeIn>
        <FadeIn delay={100}>
          <div
            className="rounded-2xl p-8 flex flex-col sm:flex-row gap-8 sm:items-center"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex flex-col gap-4 flex-1">
              {[
                { icon: "📞", label: "+63 98978787998" },
                { icon: "✉️", label: "jaja@gmail.com" },
                { icon: "🔵", label: "fb jaja" },
                { icon: "📷", label: "ig hasjask" },
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="text-lg">{c.icon}</span>
                  <span className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer">{c.label}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <p className="text-sm text-white/50">Have a project in mind or want to collaborate? Feel free to reach out through any of my contact channels. I'm open to freelance work, collaborations, and new opportunities.</p>
              <button
                className="mt-2 self-start px-5 py-2 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
              >
                Say Hello 👋
              </button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 px-5 py-10 text-center border-t border-white/5">
        <p className="text-xs text-white/25">© 2026 Jake Moreno · Built with React & Tailwind CSS</p>
      </footer>
    </div>
  );
}
