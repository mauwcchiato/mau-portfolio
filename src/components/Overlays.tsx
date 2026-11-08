import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { getGame } from "../games";
import { confetti } from "../lib/motion";
import { UIContext, type UI, type View } from "../lib/ui";
import CaseStudy from "./CaseStudy";
import { GameModal } from "./Games";
import Lightbox, { type LightboxState } from "./Lightbox";
import { WORK } from "./Projects";

/* The overlays both views share: case study, game window, viewer, toast.
   Children open them through useUI(). */
export default function Overlays({ view, setView, children }: { view: View; setView: (v: View) => void; children: ReactNode }) {
  const [project, setProject] = useState<number | null>(null);
  const [game, setGame] = useState<string | null>(null);
  const [lb, setLb] = useState<LightboxState | null>(null);
  const [held, setHeld] = useState(false);
  const [toastMsg, setToastMsg] = useState({ text: "", on: false });
  const toastTimer = useRef(0);
  /* where focus goes back to when an overlay closes */
  const focusBack = useRef<{ project?: Element | null; game?: Element | null; lb?: Element | null }>({});

  const toast = useCallback((text: string) => {
    setToastMsg({ text, on: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMsg((t) => ({ ...t, on: false })), 2400);
  }, []);

  const overlay = project !== null || game !== null || lb !== null;

  const ui: UI = useMemo(() => ({
    toast,
    confetti,
    view,
    setView,
    overlay,
    holdScroll: setHeld,
    openLightbox: (items, idx, label) => { focusBack.current.lb = document.activeElement; setLb({ items, idx: idx || 0, label }); },
    openGame: (id) => {
      if (!getGame(id)) { toast("That demo could not be loaded."); return; }
      focusBack.current.game = document.activeElement;
      setGame(id);
    },
    openProject: (id) => {
      const i = WORK.findIndex((p) => p.id === id);
      if (i < 0) return;
      focusBack.current.project = document.activeElement;
      setProject(i);
    }
  }), [toast, view, setView, overlay]);

  const restore = (k: "project" | "game" | "lb") => {
    const el = focusBack.current[k] as HTMLElement | null | undefined;
    el?.focus?.({ preventScroll: true });
    focusBack.current[k] = null;
  };
  const closeProject = () => { setProject(null); restore("project"); };
  const closeGame = () => { setGame(null); restore("game"); };
  const closeLb = () => { setLb(null); restore("lb"); };
  const stepLb = (d: number) => setLb((s) => (s ? { ...s, idx: (s.idx + d + s.items.length) % s.items.length } : s));

  /* the page behind an overlay doesn't scroll */
  useEffect(() => {
    document.body.style.overflow = overlay || held ? "hidden" : "";
  }, [overlay, held]);

  /* Esc closes the top overlay; arrows page through the viewer */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lb) {
        if (e.key === "Escape") closeLb();
        if (lb.items.length > 1 && e.key === "ArrowLeft") stepLb(-1);
        if (lb.items.length > 1 && e.key === "ArrowRight") stepLb(1);
      } else if (game) {
        if (e.key === "Escape") closeGame();
      } else if (project !== null && e.key === "Escape") {
        closeProject();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  return (
    <UIContext.Provider value={ui}>
      {children}
      <CaseStudy at={project} onGo={setProject} onClose={closeProject} />
      <GameModal id={game} onClose={closeGame} />
      <Lightbox state={lb} onStep={stepLb} onClose={closeLb} />
      <div className={"toast" + (toastMsg.on ? " is-on" : "")} id="toast" role="status" aria-live="polite">{toastMsg.text}</div>
    </UIContext.Provider>
  );
}
