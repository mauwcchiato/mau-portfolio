import { useEffect, useRef, useState } from "react";
import { store } from "../lib/env";

/* The brand intro: shooting stars cross the night sky, one lands in the
   middle, then the logo and wordmark appear (the look is all CSS).
   A click, "Skip intro", Esc/Enter/Space or the timer ends it.
   index.html sets html.is-intro before first paint when it should play. */
export default function Splash({ onDone }: { onDone: () => void }) {
  const [playing] = useState(() => document.documentElement.classList.contains("is-intro"));
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(!playing);
  const finished = useRef(false);
  const done = useRef(onDone);
  done.current = onDone;
  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!playing) { done.current(); return; }
    function finish() {
      if (finished.current) return;
      finished.current = true;
      clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      store("session").set("jm-intro", "1");
      setOut(true);
      document.documentElement.classList.remove("is-intro");
      setTimeout(() => setGone(true), 650);
      done.current();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { e.preventDefault(); finish(); }
    }
    const timer = setTimeout(finish, 3700);
    document.addEventListener("keydown", onKey);
    finishRef.current = finish;
    return () => { clearTimeout(timer); document.removeEventListener("keydown", onKey); };
  }, [playing]);

  if (gone) return null;

  return (
    <div className={"splash" + (out ? " is-out" : "")} id="splash" aria-hidden="true" onClick={() => finishRef.current()}>
      <div className="splash__sky"><i /><i /><i /><i /><i /><i /><i /><b className="splash__star" /></div>
      <div className="splash__glow" />
      <div className="splash__brand">
        <img className="splash__logo" src="assets/brand/logo-256.png" alt="" width={256} height={256} />
        <div className="splash__text">
          <p className="splash__word">
            <span>M</span><span>a</span><span>u</span>
            {/* the cat-mouth w */}
            <svg className="splash__w" viewBox="0 0 100 48" aria-hidden="true">
              <path className="splash__smile" d="M26 6V26A12 12 0 0 0 50 26V16V26A12 12 0 0 0 74 26V6" />
              <g className="splash__whisk splash__whisk--l"><path d="M17 19L4 15" /><path d="M17 26L4 29" /></g>
              <g className="splash__whisk splash__whisk--r"><path d="M83 19L96 15" /><path d="M83 26L96 29" /></g>
            </svg>
            <span>c</span><span>c</span><span>h</span><span>i</span><span>a</span><span>t</span><span>o</span>
          </p>
          <p className="splash__tag">Jhan Maurice De Roxas</p>
        </div>
      </div>
      <button className="splash__skip" type="button">Skip intro</button>
    </div>
  );
}
