/* ============================================================
   fx.jsx — GSAP-powered interactive building blocks
   Custom cursor · magnetic buttons · 3D tilt cards ·
   scroll reveals · parallax 3D shapes · scroll progress
   ============================================================ */
import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, isTouch } from "./fx-core";

/* ---------- Glowing cursor that reacts to interactive elements ---------- */
export function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (isTouch()) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dx = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });

    let shown = false;
    const move = (e) => {
      if (!shown) {
        shown = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX); dy(e.clientY);
      rx(e.clientX); ry(e.clientY);
    };
    const over = (e) => {
      if (e.target.closest("a,button,[data-cursor],input,textarea"))
        gsap.to(ring, { scale: 1.8, borderColor: "rgba(236,72,153,.9)", duration: 0.3 });
    };
    const out = (e) => {
      if (e.target.closest("a,button,[data-cursor],input,textarea"))
        gsap.to(ring, { scale: 1, borderColor: "rgba(167,139,250,.7)", duration: 0.3 });
    };
    const leave = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 });

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    window.addEventListener("mouseout", out);
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mouseout", out);
      document.removeEventListener("mouseleave", leave);
    };
  }, []);

  if (isTouch()) return null;
  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{ width: 8, height: 8, background: "#f0abfc", mixBlendMode: "screen" }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
        style={{
          width: 38, height: 38,
          border: "1.5px solid rgba(167,139,250,.7)",
          boxShadow: "0 0 18px rgba(167,139,250,.5)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}

/* ---------- Thin scroll-progress bar pinned to the top ---------- */
export function ScrollProgress() {
  const barRef = useRef(null);
  useEffect(() => {
    const bar = barRef.current;
    const setX = gsap.quickTo(bar, "scaleX", { duration: 0.2, ease: "power2" });
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setX(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[9998] h-[3px] pointer-events-none">
      <div
        ref={barRef}
        className="h-full w-full origin-left"
        style={{ transform: "scaleX(0)", background: "linear-gradient(90deg,#7c3aed,#ec4899,#f59e0b)" }}
      />
    </div>
  );
}

/* ---------- Magnetic wrapper: pulls its child toward the cursor ---------- */
export function Magnetic({ children, strength = 0.4, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isTouch()) return;
    const el = ref.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,0.4)" });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const leave = () => { xTo(0); yTo(0); };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [strength]);
  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}

/* ---------- 3D tilt card that follows the pointer, with a glare sweep ---------- */
export function TiltCard({ children, className = "", style = {}, max = 14, glare = true, ...rest }) {
  const ref = useRef(null);
  const glareRef = useRef(null);
  useEffect(() => {
    if (isTouch()) return;
    const el = ref.current;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, {
        rotateY: px * max, rotateX: -py * max,
        transformPerspective: 900, transformOrigin: "center",
        duration: 0.4, ease: "power2",
      });
      if (glareRef.current)
        gsap.to(glareRef.current, {
          opacity: 0.35,
          background: `radial-gradient(circle at ${(px + 0.5) * 100}% ${(py + 0.5) * 100}%, rgba(255,255,255,.35), transparent 55%)`,
          duration: 0.3,
        });
    };
    const leave = () => {
      gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.7, ease: "elastic.out(1,0.5)" });
      if (glareRef.current) gsap.to(glareRef.current, { opacity: 0, duration: 0.4 });
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
    };
  }, [max]);
  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d", ...style }}
      {...rest}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ opacity: 0, mixBlendMode: "overlay" }}
        />
      )}
    </div>
  );
}

/* ---------- Parallax field of floating 3D shapes ---------- */
export function FloatingShapes() {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    const shapes = gsap.utils.toArray(".fx-shape", root);
    const ctx = gsap.context(() => {
      shapes.forEach((s, i) => {
        // continuous drift + rotation
        gsap.to(s, {
          y: `+=${gsap.utils.random(-40, 40)}`,
          x: `+=${gsap.utils.random(-30, 30)}`,
          rotateX: gsap.utils.random(-40, 40),
          rotateY: gsap.utils.random(-60, 60),
          duration: gsap.utils.random(6, 11),
          repeat: -1, yoyo: true, ease: "sine.inOut",
        });
        // scroll parallax — deeper shapes move more
        gsap.to(s, {
          yPercent: gsap.utils.random(-30, 30) * (i % 3 + 1),
          ease: "none",
          scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 },
        });
      });
      // pointer parallax
      if (!isTouch()) {
        const onMove = (e) => {
          const cx = e.clientX / window.innerWidth - 0.5;
          const cy = e.clientY / window.innerHeight - 0.5;
          shapes.forEach((s, i) => {
            const depth = (i % 3 + 1) * 12;
            gsap.to(s, { x: `+=${cx * depth * 0.15}`, y: `+=${cy * depth * 0.15}`, duration: 0.6, ease: "power2" });
          });
        };
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
      }
    }, root);
    return () => ctx.revert();
  }, []);

  const shape = (cls, style) => (
    <div className={`fx-shape absolute ${cls}`} style={{ transformStyle: "preserve-3d", ...style }} />
  );

  return (
    <div ref={ref} className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ perspective: 1000 }}>
      {shape("", { top: "14%", left: "8%", width: 90, height: 90, borderRadius: 20,
        background: "linear-gradient(140deg,rgba(124,58,237,.35),rgba(236,72,153,.12))",
        border: "1px solid rgba(167,139,250,.4)", boxShadow: "0 0 40px rgba(124,58,237,.35)" })}
      {shape("", { top: "62%", left: "12%", width: 54, height: 54, borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%,rgba(244,114,182,.6),transparent 70%)",
        boxShadow: "0 0 40px rgba(236,72,153,.4)" })}
      {shape("", { top: "22%", right: "9%", width: 130, height: 130, borderRadius: "50%",
        border: "1px solid rgba(99,102,241,.5)", boxShadow: "0 0 30px rgba(99,102,241,.3)" })}
      {shape("", { top: "72%", right: "14%", width: 40, height: 40, borderRadius: 12,
        background: "linear-gradient(140deg,rgba(59,130,246,.5),transparent)",
        border: "1px solid rgba(59,130,246,.5)" })}
      {shape("", { bottom: "10%", left: "44%", width: 180, height: 180, borderRadius: 40,
        background: "linear-gradient(140deg,rgba(124,58,237,.18),transparent)",
        border: "1px solid rgba(167,139,250,.25)", opacity: 0.6 })}
      {shape("", { top: "40%", left: "48%", width: 26, height: 26, borderRadius: "50%",
        background: "rgba(245,158,11,.7)", boxShadow: "0 0 30px rgba(245,158,11,.6)" })}
    </div>
  );
}
