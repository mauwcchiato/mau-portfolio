import { useEffect, useRef, useState } from "react";
import { calm, store } from "../lib/env";

const STEPS: { el: string | null; at?: "right"; say: string }[] = [
  { el: ".profile__photo", at: "right", say: "Hi! I'm Jhan, welcome to my portfolio!" },
  { el: "#hero-social", say: "These are my socials." },
  { el: ".profile__actions .btn--primary", say: "Start here to see my projects." },
  { el: ".profile__actions .btn--glass", say: "Have a project in mind? Start here." },
  { el: ".profile__cv", say: "My résumé is right here too." },
  { el: '#nav-links a[href="#about"]', say: "Hover the sidebar to jump to any section." },
  { el: "#theme-toggle", say: "Prefer light mode? Switch it here." },
  { el: ".hero__scroll", say: "Scroll down, the page moves with you." },
  { el: null, say: "That's the tour. Enjoy looking around!" }
];

/* A second cursor glides to each feature and types a short tip into its
   name tag. Plays once per visit after the intro; desktop with a mouse
   only. Scrolling away or pressing Esc ends it, then a pill offers a replay. */
export default function Guide({ ready }: { ready: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const [prompt, setPrompt] = useState(false);
  const play = useRef<() => void>(() => {});

  useEffect(() => {
    const b = box.current!, tx = text.current!;
    const able = window.matchMedia?.("(min-width: 1024px) and (hover: hover) and (pointer: fine)").matches;
    let run = 0, startY = 0;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => { const t = window.setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); };

    const wait = (ms: number, id: number) => new Promise<void>((ok, no) => later(() => (id === run ? ok() : no()), ms));
    function moveTo(x: number, y: number) {
      b.classList.toggle("is-flip", x + 400 > window.innerWidth);
      b.style.setProperty("--gx", (x - 4).toFixed(1) + "px");
      b.style.setProperty("--gy", (y - 3).toFixed(1) + "px");
    }
    function pointFor(step: typeof STEPS[number]): [number, number] | null {
      if (!step.el) return [window.innerWidth * .55, window.innerHeight * .45];
      const n = document.querySelector(step.el);
      if (!n) return null;
      const r = n.getBoundingClientRect();
      if (!r.width || r.bottom < 0 || r.top > window.innerHeight) return null;   /* off screen: skip */
      return step.at === "right" ? [r.right - 10, r.top + r.height * .35] : [r.left + r.width / 2, r.top + r.height / 2];
    }
    function type(say: string, id: number) {
      tx.textContent = "";
      const chars = Array.from(say);
      let k = 0;
      return new Promise<void>((ok, no) => {
        (function tick() {
          if (id !== run) return no();
          if (k >= chars.length) return ok();
          tx.textContent += chars[k++];
          later(tick, 26);
        })();
      });
    }
    function stop(showPrompt: boolean) {
      run += 1;
      b.classList.remove("is-on");
      tx.textContent = "";
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      if (showPrompt) setPrompt(true);
    }
    function onScroll() { if (Math.abs(window.scrollY - startY) > 140) stop(true); }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") stop(true); }

    play.current = () => {
      if (!able || calm) return;
      const id = ++run;
      setPrompt(false);
      startY = window.scrollY;
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("keydown", onKey);
      moveTo(window.innerWidth * .7, window.innerHeight * .85);
      b.classList.add("is-on");

      let chain = wait(500, id);
      STEPS.forEach((step) => {
        chain = chain.then(() => {
          const pt = pointFor(step);
          if (!pt) return;
          tx.textContent = "";
          moveTo(pt[0], pt[1]);
          return wait(1050, id)
            .then(() => { b.classList.add("is-tap"); return wait(160, id); })
            .then(() => { b.classList.remove("is-tap"); return type(step.say, id); })
            .then(() => wait(800 + step.say.length * 18, id));
        });
      });
      chain.then(() => { store("session").set("jm-guide", "1"); stop(true); }, () => {});
    };

    return () => { run += 1; timers.forEach(clearTimeout); window.removeEventListener("scroll", onScroll); document.removeEventListener("keydown", onKey); };
  }, []);

  /* first visit: start a moment after the intro, if still at the top */
  useEffect(() => {
    if (!ready) return;
    const s = store("session");
    if (s.get("jm-guide") === "1") return;
    s.set("jm-guide", "1");
    const t = setTimeout(() => { if (window.scrollY < 80) play.current(); }, 2600);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <>
      <div className="guide" id="guide" ref={box} aria-hidden="true">
        <svg className="guide__arrow" viewBox="0 0 24 24"><path d="M4 2.5l15.5 7.2-6.6 2.1-2.4 6.9z" /></svg>
        <div className="guide__tag"><b>Jhan</b><span className="guide__text" id="guide-text" ref={text} /><i className="guide__caret" /></div>
      </div>
      <div className="guide-prompt" id="guide-prompt" hidden={!prompt}>
        <button type="button" className="guide-prompt__replay" id="guide-replay" onClick={() => {
          setPrompt(false);
          window.scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
          setTimeout(() => play.current(), 700);
        }}>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.5-3.6M13 2.6v2.7h-2.7" /></svg>
          Take the tour again
        </button>
        <button type="button" className="guide-prompt__close" id="guide-close" aria-label="Dismiss tour prompt" onClick={() => setPrompt(false)}>✕</button>
      </div>
    </>
  );
}
