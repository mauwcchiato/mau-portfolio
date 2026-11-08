import { createContext, useContext, useEffect, useState } from "react";

/* One thing the lightbox can show. */
export interface ViewItem {
  type: "img" | "video" | "pdf";
  src: string;
  title?: string;
  sub?: string;
  cap?: string;
  pixel?: boolean;
  poster?: string;
  /* a "Verify" link, for certificates */
  link?: string;
}

/* Which site is showing: the 3D house or the classic scrolling page. */
export type View = "house" | "classic";

/* Overlays any section can open. */
export interface UI {
  toast: (msg: string) => void;
  confetti: () => void;
  view: View;
  setView: (v: View) => void;
  /* a case study, game or viewer is open */
  overlay: boolean;
  /* stop the page scrolling */
  holdScroll: (on: boolean) => void;
  openLightbox: (items: ViewItem[], idx: number, label: string) => void;
  openGame: (id: string) => void;
  openProject: (id: string) => void;
}

export const UIContext = createContext<UI | null>(null);

export function useUI(): UI {
  const ui = useContext(UIContext);
  if (!ui) throw new Error("useUI needs <UIContext.Provider>");
  return ui;
}

/* Keeps an overlay mounted through its closing transition.
   mounted: render it at all. shown: add .is-open (one tick after mount, so
   the CSS transition runs). */
export function usePresence(open: boolean, exitMs: number) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      const t = setTimeout(() => setShown(true), 20);
      return () => clearTimeout(t);
    }
    setShown(false);
    const t = setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(t);
  }, [open, exitMs]);
  return { mounted, shown };
}
