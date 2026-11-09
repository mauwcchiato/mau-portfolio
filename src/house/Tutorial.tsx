import { useEffect, useLayoutEffect, useState } from "react";

/* One step of the guide: what it points at (a CSS selector, or nothing for
   a centred card), a title and a line or two of help. */
/* optional: skip the step when its target isn't on screen (the room menu is hidden on phones) */
interface Step { target?: string; title: string; body: string; optional?: boolean }

export const STEPS: Step[] = [
  { title: "Welcome in", body: "With the roof off you can see the whole floor plan. Drag to turn the house, and scroll or pinch to zoom." },
  { target: ".g-room", title: "Every room is a chapter", body: "Click a room's label to step inside. The office has my projects, the game room my games, the library my certificates." },
  { target: ".g-nav__links", title: "Jump anywhere", body: "Or use the menu to go straight to a room.", optional: true },
  { target: ".g-hud__walk", title: "Walk around", body: "Explore in first person: WASD (or the joystick on a phone) to move, drag to look around." },
  { target: ".g-hud__sun", title: "Day or night", body: "Switch the time of day here, or click any lamp in the house." },
  { target: ".g-hud__classic", title: "Prefer a regular page?", body: "Classic view shows everything on one scrolling page, no 3D needed." },
  { target: ".g-hud__help", title: "Need this again?", body: "Press ? any time to replay this guide. And say hi to Toshi, Seiko, Kousei and Chippie while you're here." }
];

/* the visible element for a step, if it's on screen */
function find(sel?: string): DOMRect | null {
  if (!sel) return null;
  const el = Array.from(document.querySelectorAll(sel)).find((n) => {
    const r = n.getBoundingClientRect();
    return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < window.innerHeight;
  });
  return el ? el.getBoundingClientRect() : null;
}

/* The house guide: a ring around the control being explained and a card
   beside it with Back / Next, step dots and Skip. */
export default function Tutorial({ step, onStep, onClose }: { step: number | null; onStep: (n: number) => void; onClose: () => void }) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const s = step === null ? null : STEPS[step];

  /* follow the target as the page lays out and the window resizes */
  useLayoutEffect(() => {
    if (!s) return;
    let raf = 0;
    const tick = () => { setRect(find(s.target)); raf = requestAnimationFrame(tick); };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [s]);

  useEffect(() => {
    if (step === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { e.stopPropagation(); onClose(); }
      if (e.key === "ArrowRight") onStep(Math.min(STEPS.length - 1, step! + 1));
      if (e.key === "ArrowLeft") onStep(Math.max(0, step! - 1));
    }
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [step, onStep, onClose]);

  /* an optional step with nothing to point at moves straight on */
  useEffect(() => {
    if (step === null || !s?.optional || find(s.target)) return;
    onStep(step + 1 < STEPS.length ? step + 1 : step);
  }, [step, s, onStep]);

  if (!s || step === null) return null;
  const last = step === STEPS.length - 1;

  /* card goes below a target near the top, above one near the bottom */
  const pad = 8;
  let card: React.CSSProperties = {};
  let arrow: "up" | "down" | null = null;
  if (rect) {
    const cx = Math.min(window.innerWidth - 170, Math.max(170, rect.left + rect.width / 2));
    if (rect.top > window.innerHeight / 2) { card = { left: cx, top: rect.top - pad - 14, transform: "translate(-50%, -100%)" }; arrow = "down"; }
    else { card = { left: cx, top: rect.bottom + pad + 14, transform: "translateX(-50%)" }; arrow = "up"; }
  }

  return (
    <div className="g-tour" role="dialog" aria-modal="false" aria-labelledby="g-tour-title">
      {rect && (
        <div className="g-tour__ring" style={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }} />
      )}
      <div className={"g-tour__card" + (rect ? "" : " is-center") + (arrow ? " is-" + arrow : "")} style={card}>
        <p className="g-tour__count">Guide · {step + 1} of {STEPS.length}</p>
        <h3 id="g-tour-title">{s.title}</h3>
        <p>{s.body}</p>
        <div className="g-tour__row">
          <div className="g-tour__dots" aria-hidden="true">
            {STEPS.map((_, i) => <i key={i} className={i === step ? "is-on" : undefined} />)}
          </div>
          <div className="g-tour__btns">
            {!last && <button type="button" className="g-tour__skip" onClick={onClose}>Skip</button>}
            {step > 0 && <button type="button" className="g-tour__back" onClick={() => onStep(step - 1)}>Back</button>}
            <button type="button" className="g-tour__next" onClick={() => (last ? onClose() : onStep(step + 1))} autoFocus>
              {last ? "Start exploring" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
