import React, { useCallback, useRef, useState } from "react";
import "./Jaybot.css";

const PHRASES = [
  "Hi There, this is Jaybot",
  "How was my portfolio",
  "I am glad to see you here",
  "Thanks for visiting my portfolio, explore it",
];

export default function Jaybot() {
  const [speech, setSpeech] = useState(null);
  const [poke, setPoke] = useState(false);
  const [expression, setExpression] = useState("happy"); // happy | focused
  const timers = useRef({ hide: null, poke: null, expr: null });

  const speak = useCallback(() => {
    // Pick a phrase that differs from the current one when possible.
    let next = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    if (speech && PHRASES.length > 1) {
      while (next === speech) {
        next = PHRASES[Math.floor(Math.random() * PHRASES.length)];
      }
    }

    setSpeech(next);
    setPoke(true);
    setExpression("focused");

    Object.values(timers.current).forEach((t) => t && clearTimeout(t));
    timers.current.poke = setTimeout(() => setPoke(false), 420);
    timers.current.expr = setTimeout(() => setExpression("happy"), 1200);
    timers.current.hide = setTimeout(() => setSpeech(null), 3600);
  }, [speech]);

  const handleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      speak();
    }
  };

  return (
    <div className="jaybot-stage" aria-live="polite">
      <div
        className={`jaybot ${poke ? "is-poked" : ""} expr-${expression}`}
        role="button"
        tabIndex={0}
        aria-label="Jaybot. Tap to hear a greeting."
        onClick={speak}
        onKeyDown={handleKey}
      >
        {/* Speech bubble */}
        <div className={`jaybot-speech ${speech ? "show" : ""}`}>
          <span>{speech}</span>
        </div>

        <div className="jaybot-float">
          {/* Antenna */}
          <div className="jb-antenna">
            <div className="jb-antenna-orb" />
            <div className="jb-antenna-rod" />
          </div>

          {/* Head */}
          <div className="jb-head">
            <div className="jb-ear jb-ear-l" />
            <div className="jb-ear jb-ear-r" />
            <div className="jb-visor">
              <div className="jb-scanline" />
              <div className="jb-eyes">
                <div className="jb-eye" />
                <div className="jb-eye jb-eye-2" />
              </div>
              <div className="jb-smile" />
              <div className="jb-sheen" />
            </div>
          </div>

          {/* Neck */}
          <div className="jb-neck" />

          {/* Body */}
          <div className="jb-body">
            <div className="jb-core">
              <div className="jb-core-glow" />
            </div>
            <div className="jb-arm jb-arm-l" />
            <div className="jb-arm jb-arm-r" />
          </div>
        </div>

        {/* Hover shadow */}
        <div className="jb-shadow" />

        <span className="jaybot-hint">Tap me</span>
      </div>
    </div>
  );
}
