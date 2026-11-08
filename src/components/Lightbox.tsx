import { useEffect, useRef } from "react";
import { usePresence, type ViewItem } from "../lib/ui";

export interface LightboxState { items: ViewItem[]; idx: number; label: string }

/* Full-screen viewer for photos, screens, videos and certificate PDFs. */
export default function Lightbox({ state, onStep, onClose }: { state: LightboxState | null; onStep: (d: number) => void; onClose: () => void }) {
  const { mounted, shown } = usePresence(state !== null, 260);
  const last = useRef<LightboxState | null>(null);
  if (state) last.current = state;
  const s = last.current;
  const it = s ? s.items[s.idx] : null;
  const closeBtn = useRef<HTMLButtonElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state) closeBtn.current?.focus();
    else stage.current?.querySelectorAll("video").forEach((v) => v.pause());
  }, [state]);

  const many = !!s && s.items.length > 1;
  const meta = (many && s ? `${s.idx + 1} of ${s.items.length}` : "") + (it?.sub ? " · " + it.sub : "");

  return (
    <div className={"lightbox" + (shown ? " is-open" : "")} id="lightbox" role="dialog" aria-modal="true" aria-label="Viewer" hidden={!mounted}
      onClick={(e) => { if (e.target === e.currentTarget || e.target === stage.current) onClose(); }}>
      <div className="lightbox__bar">
        <div className="lightbox__title"><b id="lb-title">{it?.title || s?.label}</b><span id="lb-meta">{meta}</span></div>
        <button className="icon-btn" id="lb-prev" type="button" aria-label="Previous" hidden={!many} onClick={() => onStep(-1)}>‹</button>
        <button className="icon-btn" id="lb-next" type="button" aria-label="Next" hidden={!many} onClick={() => onStep(1)}>›</button>
        <button className="icon-btn" id="lb-close" type="button" aria-label="Close viewer" ref={closeBtn} onClick={onClose}>✕</button>
      </div>
      <div className="lightbox__stage" id="lb-stage" ref={stage}>
        {mounted && it && (
          it.type === "video"
            ? <video key={it.src} src={it.src} controls autoPlay playsInline poster={it.poster} />
            : it.type === "pdf"
            ? <iframe key={it.src} src={it.src + "#view=FitH"} title={it.title || "Document"} />
            : <img key={it.src} src={it.src} alt={it.cap || ""} className={it.pixel ? "pixelated" : undefined} />
        )}
      </div>
      <div className="lightbox__foot" id="lb-foot">
        {it?.cap && <span>{it.cap}</span>}
        {it?.link && <a className="btn btn--glass btn--sm" href={it.link} target="_blank" rel="noopener noreferrer">Verify</a>}
        {it?.type === "pdf" && <a className="btn btn--glass btn--sm" href={it.src} target="_blank" rel="noopener noreferrer">Open PDF in a new tab</a>}
      </div>
    </div>
  );
}
