/* ============================================================
   data.js — shared portfolio data + app registry (no components)
   ============================================================ */
import Logo from "../../assets/logo.png";
import Pet from "../../assets/logodog.png";
import Nyla from "../../assets/NylaLogo.png";
import WEYAPP from "../../assets/WEYAPP.png";

export const TECH_STACK = [
  "HTML5", "CSS3", "JavaScript", "Python", "C++", "Figma",
  "React", "MongoDB", "GitHub", "VS Code", "Arduino", "Vite",
].map((name) => ({
  name,
  icon: `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${{
    HTML5: "html5/html5-original", CSS3: "css3/css3-original",
    JavaScript: "javascript/javascript-original", Python: "python/python-original",
    "C++": "cplusplus/cplusplus-original", Figma: "figma/figma-original",
    React: "react/react-original", MongoDB: "mongodb/mongodb-original",
    GitHub: "github/github-original", "VS Code": "vscode/vscode-original",
    Arduino: "arduino/arduino-original", Vite: "vitejs/vitejs-original",
  }[name]}.svg`,
}));

export const PROJECTS = [
  { title: "PET-LOCATION", img: Pet, tag: "Capstone · 2024–2025", desc: "Smart pet tracking system to locate pets in real time." },
  { title: "RCJCIM", img: Logo, tag: "React · Freelance", desc: "Freelance work using JavaScript, React, HTML & Tailwind CSS." },
  { title: "WEYAPP!", img: WEYAPP, tag: "Chat System · React", desc: "Real-time chat app with live message sync between users." },
  { title: "Nyia AI Copilot", img: Nyla, tag: "AI · In Progress", desc: "My own AI Copilot — learning to train and improve it." },
];

export const SERVICES = [
  { icon: "💻", title: "Web Development", desc: "Modern, responsive web apps with React, Tailwind & JavaScript." },
  { icon: "🎨", title: "UI/UX Design", desc: "Clean, user-friendly interfaces designed in Figma." },
  { icon: "🤖", title: "AI Integration", desc: "Smart AI-powered features built into web applications." },
];

export const CONTACTS = [
  { icon: "📞", label: "+63 927 386 5959", href: "tel:+639273865959" },
  { icon: "✉️", label: "abejar199@gmail.com", href: "mailto:abejar199@gmail.com" },
  { icon: "📘", label: "fb Jay Harold Mars Abejar", href: "https://facebook.com" },
  { icon: "📸", label: "ig @jayyhrold", href: "https://instagram.com/jayyhrold" },
];

/* app registry — order defines dock / home-screen order */
export const APPS = [
  { id: "about",      title: "About Me",        glyph: "👤", grad: "linear-gradient(145deg,#5ea8ff,#2563eb)", w: 560, h: 460 },
  { id: "projects",   title: "Projects",        glyph: "🗂️", grad: "linear-gradient(145deg,#38bdf8,#0ea5e9)", w: 620, h: 480 },
  { id: "skills",     title: "Skills",          glyph: "🧩", grad: "linear-gradient(145deg,#a78bfa,#7c3aed)", w: 520, h: 420 },
  { id: "services",   title: "Services",        glyph: "🛠️", grad: "linear-gradient(145deg,#fbbf24,#f59e0b)", w: 520, h: 400 },
  { id: "illuminary", title: "Illuminary Peak", glyph: "⛰️", grad: "linear-gradient(145deg,#f472b6,#db2777)", w: 520, h: 420 },
  { id: "messages",   title: "JayHarold_Bot",   glyph: "💬", grad: "linear-gradient(145deg,#4ade80,#16a34a)", w: 440, h: 560 },
  { id: "jaybot",     title: "Jaybot",          glyph: "🤖", grad: "linear-gradient(145deg,#22d3ee,#0891b2)", w: 460, h: 480 },
  { id: "contact",    title: "Contact",         glyph: "✉️", grad: "linear-gradient(145deg,#818cf8,#4f46e5)", w: 520, h: 420 },
  { id: "stocks",     title: "Stocks",          glyph: "📈", grad: "linear-gradient(145deg,#34d399,#059669)", route: "/stocks" },
  { id: "tutorials",  title: "Tutorials",       glyph: "📚", grad: "linear-gradient(145deg,#fb7185,#e11d48)", route: "/tutorials" },
];
export const appById = (id) => APPS.find((a) => a.id === id);
export const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
