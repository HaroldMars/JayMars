import { useState, useEffect } from "react";
import Desktop from "../components/mac/Desktop";
import MobileOS from "../components/mac/MobileOS";

const QUERY = "(max-width: 767px)";

export default function Home() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile ? <MobileOS /> : <Desktop />;
}
