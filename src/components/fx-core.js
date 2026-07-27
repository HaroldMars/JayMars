/* ============================================================
   fx-core.js — non-component GSAP helpers shared by the fx toolkit
   ============================================================ */
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const isTouch = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

/* Scroll-reveal every [data-reveal] / [data-reveal-group] under a root ref. */
export function useScrollReveal(rootRef, deps = []) {
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 48, opacity: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
      });
      gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
        gsap.from(group.children, {
          y: 50, opacity: 0, scale: 0.96, duration: 0.7, ease: "power3.out", stagger: 0.09,
          scrollTrigger: { trigger: group, start: "top 82%", toggleActions: "play none none none" },
        });
      });
    }, rootRef);
    const t = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => { clearTimeout(t); ctx.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
