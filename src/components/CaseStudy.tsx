import { useEffect, useRef, type ReactNode } from "react";
import type { Project } from "../data/types";
import { pad2 } from "../lib/env";
import { usePresence, useUI, type ViewItem } from "../lib/ui";
import { ApkButton, Chips, ProjectFace, WORK } from "./Projects";
import { ArrowIcon } from "./icons";

/* Enter or Space opens a figure that acts as a button. */
function pressable(go: () => void) {
  return {
    role: "button",
    tabIndex: 0,
    onClick: go,
    onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }
  };
}

function Page({ p, onNext }: { p: Project; onNext: () => void }) {
  const { openLightbox, openGame } = useUI();
  const vids = p.videos || (p.video ? [p.video] : []);
  const next = WORK[(WORK.indexOf(p) + 1) % WORK.length];
  const contain = p.heroFit === "contain";

  /* sections number themselves, skipping any that are empty */
  let n = 0;
  const sec = (title: string, body: ReactNode) => body
    ? <section className="cs__sec"><h3><span>{pad2(++n)}</span>{title}</h3>{body}</section>
    : null;
  const para = (t?: string) => (t ? <p>{t}</p> : null);
  const list = (a?: string[], cls = "cs__list") => (a && a.length ? <ul className={cls}>{a.map((x) => <li key={x}>{x}</li>)}</ul> : null);

  const gallery: ViewItem[] = (p.gallery || []).map((g) => ({ type: "img", src: g.src, cap: g.cap, pixel: g.pixel }));
  const screens: ViewItem[] = (p.phone || []).map((s) => ({ type: "img", src: s.src, cap: s.cap }));
  const pages: ViewItem[] = (p.laptop || []).map((s) => ({ type: "img", src: s.src, cap: s.cap }));
  const openGallery = (i: number) => { if (gallery.length) openLightbox(gallery, i, p.name); };
  const watch = () => openLightbox(vids.map((v) => ({
    type: "video", src: v.src, poster: v.poster || p.hero, title: p.name, sub: v.title || "Demo video", cap: v.cap
  })), 0, p.name);

  const pic = p.phone || p.laptop
    ? <ProjectFace p={p} />
    : p.hero ? <img src={p.hero} alt={p.name} className={p.heroPixel ? "pixelated" : undefined} {...pressable(() => openGallery(0))} /> : null;
  const facts = ([["My role", p.role], ["Year", p.year], ["Team", p.team], ["Course", p.course]] as const).filter((f) => f[1]);

  return (
    <>
      <header className="cs__hero">
        <div>
          <p className="cs__kicker">{p.kicker} · {p.year}</p>
          <h2 id="cs-title" tabIndex={-1}>{p.name}</h2>
          {p.sub && <p className="cs__sub">{p.sub}</p>}
          <p className="cs__lead">{p.tagline || p.blurb}</p>
          <div className="cs__actions">
            {p.live && <a className="btn btn--primary" href={p.live} target="_blank" rel="noopener noreferrer">{p.liveLabel || "Visit live site"} ↗</a>}
            {vids.length > 0 && <button className={"btn " + (p.live ? "btn--glass" : "btn--primary")} type="button" onClick={watch}>▶ Watch {vids.length > 1 ? "walkthroughs" : "demo"}</button>}
            {p.playable && <button className="btn btn--play" type="button" onClick={() => openGame(p.playable!)}>▶ PLAY IT</button>}
            <ApkButton p={p} />
            {p.figma && <a className="btn btn--glass" href={p.figma} target="_blank" rel="noopener noreferrer">Open in Figma</a>}
            {p.repo
              ? <a className="btn btn--glass" href={p.repo} target="_blank" rel="noopener noreferrer">GitHub</a>
              : p.githubSoon ? <span className="btn btn--glass" aria-disabled="true">GitHub (soon)</span> : null}
          </div>
        </div>
        {pic && <figure className={"cs__media" + (contain && !p.phone && !p.laptop ? " is-contain" : "")}>{pic}</figure>}
      </header>

      <dl className="cs__facts">
        {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>

      {(p.problem || p.solution) && sec("Overview", (
        <div className="cs__two">
          {p.problem && <div><h4>The problem</h4>{para(p.problem)}</div>}
          {p.solution && <div><h4>What we built</h4>{para(p.solution)}</div>}
        </div>
      ))}
      {p.phone && sec(p.phoneTitle || "The app", (
        <div className="cs__screens">
          {p.phone.map((s, j) => (
            <figure key={s.src} className="cs__phone" {...pressable(() => openLightbox(screens, j, p.name))}>
              <div className="phone">
                <div className="phone__screen"><img src={s.src} alt={s.cap || `${p.name} screen ${j + 1}`} loading="lazy" /></div>
                <i className="phone__island" aria-hidden="true" />
              </div>
              {s.cap && <figcaption>{s.cap}</figcaption>}
            </figure>
          ))}
        </div>
      ))}
      {p.laptop && sec(p.laptopTitle || "The website", (
        <div className="cs__screens">
          {p.laptop.map((s, j) => (
            <figure key={s.src} className="cs__lap" {...pressable(() => openLightbox(pages, j, p.name))}>
              <div className="lap">
                <div className="lap__lid"><div className="lap__screen">
                  <img src={s.src} alt={s.cap || `${p.name} page ${j + 1}`} loading="lazy" className={s.scroll ? "is-scroll" : undefined} />
                </div></div>
                <div className="lap__base" />
              </div>
              {s.cap && <figcaption>{s.cap}</figcaption>}
            </figure>
          ))}
        </div>
      ))}
      {sec("My role", (p.role || p.contribution?.length) ? <>{p.role && <p className="cs__role">{p.role}</p>}{list(p.contribution)}</> : null)}
      {sec("Key features", list(p.features, "cs__feats"))}
      {(p.process || p.outcome) && sec("How it came together", (
        <>{para(p.process)}{p.outcome && <div className="cs__outcome"><b>Outcome</b>{para(p.outcome)}</div>}</>
      ))}
      {sec("Built with", (
        <div className="cs__tech">
          <div><h4>Technologies</h4><Chips list={p.tech} /></div>
          {p.skills && <div><h4>Skills</h4><Chips list={p.skills} cls="chip--alt" /></div>}
        </div>
      ))}
      {gallery.length > 0 && sec("Gallery", (
        <div className={"cs__gallery" + (contain ? " is-contain" : "")}>
          {(p.gallery || []).map((g, i) => (
            <figure key={g.src} className="cs__shot" {...pressable(() => openGallery(i))}>
              <img src={g.src} alt={g.cap} loading="lazy" className={g.pixel ? "pixelated" : undefined} />
              <figcaption>{g.cap}</figcaption>
            </figure>
          ))}
        </div>
      ))}
      {vids.length > 0 && sec(vids.length > 1 ? "Walkthrough videos" : "Demo video", (
        <div className="cs__videos">
          {vids.map((v) => (
            <div key={v.src}>
              {v.title && <h4>{v.title}</h4>}
              <video className="cs__video" controls preload="metadata" playsInline src={v.src} poster={v.poster || p.hero} />
              {v.cap && <p className="cs__fine">{v.cap}</p>}
            </div>
          ))}
        </div>
      ))}
      {p.note && <div className="note cs__note"><span>{p.note}</span></div>}

      <button className="cs__next" type="button" onClick={onNext}>
        <span><small>Next project</small><b>{next.name}</b></span><ArrowIcon />
      </button>
      <p className="cs__fine">Source files and full documentation are in my academic archive and can be shared on request.</p>
    </>
  );
}

/* One page per project over the site. Prev/next and the "next project"
   card walk through the featured work; Esc or the back button closes. */
export default function CaseStudy({ at, onGo, onClose }: { at: number | null; onGo: (i: number) => void; onClose: () => void }) {
  const { mounted, shown } = usePresence(at !== null, 400);
  const box = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLElement>(null);
  const last = useRef<number>(0);
  if (at !== null) last.current = at;
  const p = WORK[last.current];

  /* each project starts at the top, replays the cover's entrance, and takes focus */
  useEffect(() => {
    const el = box.current;
    if (at === null || !el) return;
    el.scrollTop = 0;
    el.classList.remove("is-open"); void el.offsetWidth;
    if (shown) el.classList.add("is-open");
    document.getElementById("cs-title")?.focus({ preventScroll: true });
  }, [at, shown]);

  /* closing stops any video that is still playing */
  useEffect(() => {
    if (at === null) page.current?.querySelectorAll("video").forEach((v) => v.pause());
  }, [at]);

  const step = (d: number) => onGo(((last.current + d) % WORK.length + WORK.length) % WORK.length);

  return (
    <div className={"cs" + (shown ? " is-open" : "")} id="cs" ref={box} role="dialog" aria-modal="true" aria-labelledby="cs-title" hidden={!mounted}>
      <div className="cs__bar">
        <button className="cs__back" id="cs-close" type="button" onClick={onClose}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>All projects
        </button>
        <span className="cs__path" id="cs-path">~/projects/{p.id}</span>
        <div className="cs__nav">
          <button className="icon-btn" id="cs-prev" type="button" aria-label="Previous project" onClick={() => step(-1)}>‹</button>
          <button className="icon-btn" id="cs-next" type="button" aria-label="Next project" onClick={() => step(1)}>›</button>
        </div>
      </div>
      <article className="cs__page" id="cs-page" ref={page}>
        {mounted && <Page key={p.id} p={p} onNext={() => step(1)} />}
      </article>
    </div>
  );
}
