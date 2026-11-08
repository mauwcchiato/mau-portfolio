/* The games are self-contained scripts that register themselves on
   window.GAMES when imported. Each mount() draws into a stage element
   and returns a cleanup function. */
import "./asm-art-data.js";
import "./kusinakode.js";
import "./facechange.js";
import "./mines.js";
import "./pixelplot.js";
import "./cipher.js";
import "./beancatcher.js";
import "./memory.js";
import "./bugsquash.js";

export interface GameHelpers {
  toast: (msg: string) => void;
  confetti: () => void;
}

export interface Game {
  title: string;
  subtitle: string;
  origin: string;
  help?: string;
  /* made for this site, not a recreation of a college project */
  mini?: boolean;
  mount: (root: HTMLElement, helpers: GameHelpers) => (() => void) | void;
}

declare global {
  interface Window {
    GAMES?: Record<string, Game>;
  }
}

export function getGame(id: string): Game | undefined {
  return window.GAMES?.[id];
}
