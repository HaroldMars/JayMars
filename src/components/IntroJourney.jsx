/* ============================================================
   IntroJourney.jsx — cinematic scroll intro
   Scene 1: Mountain Peak under a designed dawn sky
   Scene 2: The Sea beyond the horizon
   Scene 3: The City at sunrise
   Driven by a single scrubbed GSAP timeline. The stage is
   `position: sticky` so it holds while the tall wrapper scrolls.
   ============================================================ */
import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./fx-core";

export default function IntroJourney() {
  const wrapRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    const q = gsap.utils.selector(stage);

    const ctx = gsap.context(() => {
      // twinkle the stars independently of scroll
      gsap.to(q(".star"), {
        opacity: gsap.utils.wrap([0.2, 1, 0.5]),
        duration: 1.6, repeat: -1, yoyo: true, ease: "sine.inOut",
        stagger: { each: 0.15, from: "random" },
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // ---- Scene 1 → 2 : Peak dissolves into the Sea ----
      tl.to(q(".scene-peak-caption"), { opacity: 0, y: -40, duration: 0.4 }, 0.18)
        .to(q(".sky-peak"), { opacity: 0, duration: 0.5 }, 0.25)
        .to(q(".sky-sea"), { opacity: 1, duration: 0.5 }, 0.25)
        .to(q(".stars"), { opacity: 0, duration: 0.4 }, 0.2)
        .to(q(".mountains"), { yPercent: 60, opacity: 0, duration: 0.5, ease: "power1.in" }, 0.2)
        .fromTo(q(".sea"), { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5 }, 0.28)
        .to(q(".sun"), { top: "38%", scale: 0.9, backgroundColor: "#fff1c9", duration: 0.5 }, 0.2)
        .fromTo(q(".scene-sea-caption"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0.36);

      // ---- Scene 2 → 3 : Sea gives way to the City at sunrise ----
      tl.to(q(".scene-sea-caption"), { opacity: 0, y: -40, duration: 0.4 }, 0.56)
        .to(q(".sky-sea"), { opacity: 0, duration: 0.5 }, 0.6)
        .to(q(".sky-city"), { opacity: 1, duration: 0.5 }, 0.6)
        .to(q(".sea"), { yPercent: 40, opacity: 0, duration: 0.5, ease: "power1.in" }, 0.6)
        .to(q(".sun"), { top: "58%", scale: 1.35, backgroundColor: "#ffd27a", boxShadow: "0 0 120px 50px rgba(255,180,90,.7)", duration: 0.6 }, 0.6)
        .fromTo(q(".city"), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5 }, 0.66)
        .to(q(".city-glow"), { opacity: 1, duration: 0.5 }, 0.7)
        .fromTo(q(".scene-city-caption"), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0.78)
        .to(q(".scroll-hint"), { opacity: 0, duration: 0.3 }, 0.1);

      const t = setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => clearTimeout(t);
    }, stageRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} className="relative" style={{ height: "360vh" }} data-intro>
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* ---------------- SKIES ---------------- */}
        <div className="sky-peak absolute inset-0" style={{
          background: "linear-gradient(180deg,#070b24 0%,#1a1240 38%,#5a2c7a 68%,#c46592 88%,#f0a58c 100%)",
        }} />
        <div className="sky-sea absolute inset-0" style={{
          opacity: 0,
          background: "linear-gradient(180deg,#0d2a4a 0%,#1c5878 45%,#3f97ab 72%,#7fc6d2 100%)",
        }} />
        <div className="sky-city absolute inset-0" style={{
          opacity: 0,
          background: "linear-gradient(180deg,#241245 0%,#6a2f66 38%,#c95a53 64%,#ee8a4c 82%,#f7c46b 100%)",
        }} />

        {/* ---------------- SUN / GUIDING LIGHT ---------------- */}
        <div className="sun absolute rounded-full" style={{
          top: "24%", left: "50%", width: 120, height: 120, marginLeft: -60,
          background: "#fff4d6",
          boxShadow: "0 0 90px 30px rgba(255,225,170,.75)",
        }} />

        {/* ---------------- STARS (scene 1) ---------------- */}
        <div className="stars absolute inset-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="star absolute rounded-full bg-white" style={{
              top: `${Math.random() * 55}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              opacity: Math.random(),
            }} />
          ))}
        </div>

        {/* ---------------- MOUNTAINS (scene 1) ---------------- */}
        <svg className="mountains absolute bottom-0 left-0 w-full" viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" style={{ height: "70%" }}>
          <defs>
            <linearGradient id="mtnFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a2b63" /><stop offset="1" stopColor="#221a3f" />
            </linearGradient>
            <linearGradient id="mtnNear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#191233" /><stop offset="1" stopColor="#0c0920" />
            </linearGradient>
            <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f3d9e8" /><stop offset="1" stopColor="#b98fc0" />
            </linearGradient>
          </defs>
          {/* far range */}
          <path d="M0,300 L250,150 L470,320 L700,120 L960,300 L1200,180 L1440,320 L1440,520 L0,520 Z" fill="url(#mtnFar)" />
          {/* the Peak — center hero mountain */}
          <path d="M520,520 L760,90 L1000,520 Z" fill="url(#mtnNear)" />
          <path d="M710,165 L760,90 L812,167 L785,150 L760,175 L735,150 Z" fill="url(#snow)" />
          {/* near range */}
          <path d="M0,520 L180,330 L420,470 L640,360 L900,500 L1150,360 L1440,470 L1440,520 Z" fill="url(#mtnNear)" />
        </svg>

        {/* ---------------- SEA (scene 2) ---------------- */}
        <div className="sea absolute bottom-0 left-0 w-full" style={{ height: "48%", opacity: 0 }}>
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg,#2a83a0 0%,#12557a 45%,#062c46 100%)",
          }} />
          {/* sun reflection */}
          <div className="absolute left-1/2 top-0" style={{
            width: 90, height: "100%", marginLeft: -45,
            background: "linear-gradient(180deg,rgba(255,240,200,.75),transparent 80%)",
            filter: "blur(6px)",
          }} />
          {/* wave bands */}
          <svg className="absolute top-0 left-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ height: 60 }}>
            <path d="M0,60 C240,20 480,100 720,60 C960,20 1200,100 1440,60 L1440,120 L0,120 Z" fill="rgba(255,255,255,.10)" />
          </svg>
          <svg className="absolute w-full" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ top: 40, height: 70 }}>
            <path d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z" fill="rgba(255,255,255,.07)" />
          </svg>
        </div>

        {/* ---------------- CITY (scene 3) ---------------- */}
        <div className="city-glow absolute inset-0" style={{
          opacity: 0,
          background: "radial-gradient(60% 40% at 50% 80%, rgba(255,170,90,.35), transparent 70%)",
        }} />
        <svg className="city absolute bottom-0 left-0 w-full" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice" style={{ height: "58%", opacity: 0 }}>
          <defs>
            <linearGradient id="bldg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a1f45" /><stop offset="1" stopColor="#160b22" />
            </linearGradient>
          </defs>
          <g fill="url(#bldg)">
            <rect x="40" y="200" width="90" height="220" />
            <rect x="150" y="130" width="70" height="290" />
            <rect x="240" y="240" width="80" height="180" />
            <rect x="340" y="90" width="60" height="330" />
            <rect x="420" y="180" width="100" height="240" />
            <rect x="540" y="140" width="70" height="280" />
            <rect x="630" y="60" width="80" height="360" />
            <rect x="730" y="200" width="90" height="220" />
            <rect x="840" y="120" width="70" height="300" />
            <rect x="930" y="170" width="100" height="250" />
            <rect x="1050" y="90" width="70" height="330" />
            <rect x="1140" y="210" width="90" height="210" />
            <rect x="1250" y="140" width="80" height="280" />
            <rect x="1350" y="190" width="90" height="230" />
          </g>
          {/* lit windows */}
          <g fill="rgba(255,214,140,.85)">
            {Array.from({ length: 60 }).map((_, i) => (
              <rect key={i} x={50 + (i * 137) % 1360} y={110 + ((i * 53) % 260)} width="6" height="8" />
            ))}
          </g>
        </svg>

        {/* ---------------- CAPTIONS ---------------- */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <div className="scene-peak-caption absolute">
            <p className="text-xs sm:text-sm tracking-[0.4em] text-white/70 uppercase mb-3">Illuminary Peak</p>
            <h2 className="font-black text-white leading-none" style={{ fontSize: "clamp(2.2rem,8vw,5.5rem)", textShadow: "0 4px 40px rgba(0,0,0,.5)" }}>
              THE SUMMIT
            </h2>
            <p className="mt-4 text-white/70 text-sm sm:text-base">Every great vision begins at the peak</p>
          </div>

          <div className="scene-sea-caption absolute" style={{ opacity: 0 }}>
            <p className="text-xs sm:text-sm tracking-[0.4em] text-white/70 uppercase mb-3">Explore More</p>
            <h2 className="font-black text-white leading-none" style={{ fontSize: "clamp(2.2rem,8vw,5.5rem)", textShadow: "0 4px 40px rgba(0,0,0,.5)" }}>
              THE HORIZON
            </h2>
            <p className="mt-4 text-white/70 text-sm sm:text-base">Dive deeper, beyond what you can see</p>
          </div>

          <div className="scene-city-caption absolute" style={{ opacity: 0 }}>
            <p className="text-xs sm:text-sm tracking-[0.4em] text-white/80 uppercase mb-3">Innovation</p>
            <h2 className="font-black text-white leading-none" style={{ fontSize: "clamp(2.2rem,8vw,5.5rem)", textShadow: "0 4px 40px rgba(0,0,0,.5)" }}>
              A NEW DAWN
            </h2>
            <p className="mt-4 text-white/80 text-sm sm:text-base">Building the future, one city at a time</p>
          </div>
        </div>

        {/* scroll hint */}
        <div className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
          <span className="text-[11px] tracking-[0.3em] uppercase">Scroll</span>
          <span className="block w-[22px] h-[36px] rounded-full border border-white/40 relative">
            <span className="absolute left-1/2 top-2 -translate-x-1/2 w-1 h-2 rounded-full bg-white/80 animate-bounce" />
          </span>
        </div>
      </div>
    </section>
  );
}
