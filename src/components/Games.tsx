import { useEffect, useRef } from "react";
import { SITE } from "../data/site";
import { getGame } from "../games";
import { usePresence, useUI } from "../lib/ui";
import type { Vars } from "../lib/env";

/* The Play section: one cartridge per game. */
export default function Games() {
  const { openGame } = useUI();
  return (
    <section className="sec" id="play">
      <div className="wrap">
        <header className="sec__head">
          <p className="sec__kicker">04 · press start</p>
          <h2 className="sec__title" data-title>Play My Games</h2>
          <p className="sec__lede">College projects rebuilt in JavaScript so they run right here, plus a few quick mini games. No install.</p>
        </header>
        <div className="games" id="games">
          {SITE.playable.map((g, i) => {
            const art = g.art && g.art.length
              ? (g.art.length > 1
                  ? <span className="stack2">{g.art.map((a) => <img key={a} className="pixelated" src={a} alt="" loading="lazy" />)}</span>
                  : <img className="pixelated" src={g.art[0]} alt="" loading="lazy" />)
              : g.glyph ? <span className="glyph glyph--emoji">{g.glyph}</span>
              : <span className="glyph">{g.id === "mines" ? "💎" : "</>"}</span>;
            return (
              <button key={g.id} className="game reveal" type="button" style={{ "--d": (i % 4) * 70 + "ms" } as Vars}
                aria-label={"Play " + g.title} onClick={() => openGame(g.id)}>
                <span className="game__art">{art}</span>
                <span className="game__body">
                  <small>{g.sub}</small><h3>{g.title}</h3><p>{g.desc}</p>
                  <span className="game__go">▶ PRESS START</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* The game window. The game draws into the stage and is torn down the
   moment the window starts closing. */
export function GameModal({ id, onClose }: { id: string | null; onClose: () => void }) {
  const ui = useUI();
  const { mounted, shown } = usePresence(id !== null, 280);
  const stage = useRef<HTMLDivElement>(null);
  const last = useRef<string | null>(null);
  if (id) last.current = id;
  const g = last.current ? getGame(last.current) : undefined;
  const meta = SITE.playable.find((p) => p.id === last.current);

  useEffect(() => {
    if (!id || !stage.current) return;
    const game = getGame(id);
    if (!game) return;
    const cleanup = game.mount(stage.current, { toast: ui.toast, confetti: ui.confetti });
    document.getElementById("modal-title")?.focus({ preventScroll: true });
    return () => {
      try { if (typeof cleanup === "function") cleanup(); } catch { /* a game failing to clean up must not break closing */ }
      if (stage.current) stage.current.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, mounted]);

  return (
    <div className={"modal" + (shown ? " is-open" : "")} id="modal" role="dialog" aria-modal="true" aria-label={g?.title || "Details"}
      hidden={!mounted} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal__panel win" id="modal-panel">
        {mounted && g && (
          <>
            <button className="icon-btn modal__close" id="modal-close" type="button" aria-label="Close" onClick={onClose}>✕</button>
            <div className="win__bar"><i /><i /><i /><span>~/play/{last.current}</span></div>
            <div className="modal__body">
              <div className="pm__head">
                <div>
                  <span className="pm__kicker">{g.mini ? "Mini game" : "Web recreation"}</span>
                  <h3 id="modal-title" tabIndex={-1}>{g.title}</h3>
                  <span className="pm__sub">{g.subtitle}</span>
                </div>
                <div className="pm__meta">{g.origin}</div>
              </div>
              <div className="game-shell">
                <div className="game-stage" id="game-stage" ref={stage} />
                <p className="game-help">{g.help || ""}</p>
                {!g.mini && (
                  <div className="note"><span>A browser recreation of my college project: same rules and assets, rebuilt in JavaScript.
                    Not the original {meta?.origin ? meta.origin.split(" · ")[0] : ""} build.</span></div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
