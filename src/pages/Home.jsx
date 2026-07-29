import { useState, useEffect, lazy, Suspense } from "react";

const DesktopExperience = lazy(() => import("../experience/DesktopExperience"));
const MobileExperience = lazy(() => import("../experience/MobileExperience"));

const QUERY = "(max-width: 767px), (hover: none) and (pointer: coarse) and (max-width: 1024px)";

function BootFallback() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "#b8bec8",
        color: "#fff",
        fontFamily: "Syne, sans-serif",
        fontWeight: 800,
        fontSize: "clamp(2.4rem, 8vw, 4.5rem)",
        letterSpacing: "-0.04em",
        lineHeight: 0.9,
        textAlign: "center",
      }}
    >
      JAY
      <br />
      MARS
    </div>
  );
}

export default function Home() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(QUERY).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isMobile) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = prev;
      document.documentElement.style.overflow = "";
    };
  }, [isMobile]);

  return (
    <Suspense fallback={<BootFallback />}>
      {isMobile ? <MobileExperience /> : <DesktopExperience />}
    </Suspense>
  );
}
