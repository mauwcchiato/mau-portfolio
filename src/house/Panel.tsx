import { useEffect, useRef } from "react";
import { SITE } from "../data/site";
import type { Project } from "../data/types";
import { ApkButton, Chips } from "../components/Projects";
import { CertList } from "../components/Certs";
import { ContactList } from "../components/Contact";
import { RESUME, RESUME_NAME } from "../components/Sidebar";
import { ArrowIcon, DownloadIcon } from "../components/icons";
import { usePresence, useUI, type ViewItem } from "../lib/ui";
import { WORK } from "../components/Projects";
import type { Target } from "./plan";

const P = SITE.profile;

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="gp__kicker">{children}</p>;
}

function AboutBody({ goContact }: { goContact: () => void }) {
  return (
    <>
      <Kicker>About</Kicker>
      <h2 id="gp-title">Hi, I'm Jhan Maurice</h2>
      <img className="gp__photo" src="assets/img/profile.jpg?v=2" alt="Jhan Maurice De Roxas" />
      <p>I'm a fourth-year BS Information Technology student at Mapúa Malayan Colleges Laguna, and I'm from Cabuyao, Laguna. I finished my capstone, Kusina Kode, on 6 November 2026.</p>
      <p>In group work I often help keep things organized, but I still enjoy doing the hands-on part. I'm most interested in how apps, servers and small devices work together.</p>
      <p>Outside of class I've served as president of our IT Society and as a student ambassador, and I like helping classmates review. Right now I'm learning more about cloud, networking and security.</p>
      <p>I'm looking for an on-the-job training placement of 486 hours, and I can start right away.</p>
      <dl className="gp__facts">
        <div><dt>Program</dt><dd>BS Information Technology</dd></div>
        <div><dt>School</dt><dd>Mapúa Malayan Colleges Laguna</dd></div>
        <div><dt>Graduating</dt><dd>2027 (expected)</dd></div>
        <div><dt>Based in</dt><dd>Cabuyao, Laguna</dd></div>
      </dl>
      <h3>How I work</h3>
      <ul className="gp__list">
        {SITE.traits.map((t) => <li key={t.t}><b>{t.t}</b> {t.p}</li>)}
      </ul>
      <Chips list={SITE.honors} />
      <div className="gp__actions">
        <a className="btn btn--primary" href={RESUME} download={RESUME_NAME}><DownloadIcon />Download résumé</a>
        <button className="btn btn--glass" type="button" onClick={goContact}>Work with me</button>
      </div>
    </>
  );
}

function ProjectBody({ p }: { p: Project }) {
  const { openProject, openGame, openLightbox } = useUI();
  const shots: ViewItem[] = (p.laptop && p.face !== "phone" ? p.laptop : p.phone || (p.hero ? [{ src: p.hero }] : []))
    .map((s) => ({ type: "img", src: s.src, cap: s.cap }));
  const phones = !!p.phone && !(p.laptop && p.face !== "phone");
  const facts = ([["My role", p.role], ["Year", p.year], ["Team", p.team], ["Course", p.course]] as const).filter((f) => f[1]);
  return (
    <>
      <Kicker>{p.kicker} · {p.year}</Kicker>
      <h2 id="gp-title">{p.name}</h2>
      {p.sub && <p className="gp__sub">{p.sub}</p>}
      <p className="gp__lead">{p.tagline || p.blurb}</p>
      {shots.length > 0 && (
        <div className={"gp__shots" + (phones ? " is-phones" : "")}>
          {shots.slice(0, phones ? 3 : 1).map((s, i) => (
            <button key={s.src} type="button" onClick={() => openLightbox(shots, i, p.name)} aria-label={"View " + (s.cap || p.name + " screen " + (i + 1))}>
              <img src={s.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
      <div className="gp__actions">
        <button className="btn btn--primary" type="button" onClick={() => openProject(p.id)}>Open the full case study <ArrowIcon /></button>
        {p.live && <a className="btn btn--glass" href={p.live} target="_blank" rel="noopener noreferrer">{p.liveLabel || "Visit live site"} ↗</a>}
        {p.playable && <button className="btn btn--play" type="button" onClick={() => openGame(p.playable!)}>▶ PLAY</button>}
        <ApkButton p={p} />
        {p.figma && <a className="btn btn--glass" href={p.figma} target="_blank" rel="noopener noreferrer">Open in Figma</a>}
      </div>
      <dl className="gp__facts">
        {facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
      {p.problem && <><h3>The problem</h3><p>{p.problem}</p></>}
      {p.solution && <><h3>{/^(Solo|Personal)/.test(p.team || "") ? "What I built" : "What we built"}</h3><p>{p.solution}</p></>}
      <h3>Built with</h3>
      <Chips list={p.tech} />
    </>
  );
}

/* the office desk: every project, each opening its own panel */
function WorkBody({ open }: { open: (t: Target) => void }) {
  return (
    <>
      <Kicker>The office</Kicker>
      <h2 id="gp-title">Projects</h2>
      <p className="gp__lead">Things I've built in class and for real users: IoT, Android apps, web systems and cloud designs.</p>
      <ul className="gp__work">
        {WORK.map((p, i) => (
          <li key={p.id}>
            <button type="button" onClick={() => open({ id: p.id, kind: "project", label: p.name, project: p })}>
              <small>{String(i + 1).padStart(2, "0")} · {p.kicker} · {p.year}</small>
              <b>{p.name}</b>
              <span>{p.blurb || p.tagline}</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function ArcadeBody() {
  const { openGame } = useUI();
  return (
    <>
      <Kicker>Press start</Kicker>
      <h2 id="gp-title">Play my games</h2>
      <p className="gp__lead">College projects rebuilt in JavaScript so they run right here, plus a few quick mini games. No install.</p>
      <ul className="gp__games">
        {SITE.playable.map((g) => (
          <li key={g.id}>
            <span className="gp__art">
              {g.art && g.art.length ? <img className="pixelated" src={g.art[0]} alt="" loading="lazy" /> : <span>{g.glyph || (g.id === "mines" ? "💎" : "</>")}</span>}
            </span>
            <span className="gp__game">
              <small>{g.sub}</small><b>{g.title}</b><span>{g.desc}</span>
            </span>
            <button className="btn btn--play btn--sm" type="button" onClick={() => openGame(g.id)}>▶ Play</button>
          </li>
        ))}
      </ul>
    </>
  );
}

function CertsBody() {
  return (
    <>
      <Kicker>Proof of learning</Kicker>
      <h2 id="gp-title">Certificates</h2>
      <p className="gp__lead">Click any certificate to open the original document.</p>
      <CertList />
    </>
  );
}

function JourneyBody() {
  const { openLightbox } = useUI();
  const L = SITE.leadership;
  return (
    <>
      <Kicker>Along the way</Kicker>
      <h2 id="gp-title">Milestones &amp; recognition</h2>
      <ol className="gp__miles">
        {SITE.milestones.map((m) => <li key={m.t}><small>{m.when}</small><b>{m.t}</b><span>{m.p}</span></li>)}
      </ol>
      <h3>Leadership</h3>
      <div className="gp__card">
        <small>{L.term}</small><b>{L.role}, {L.org}</b><p>{L.body}</p>
      </div>
      <h3>Recognition</h3>
      <ul className="gp__list">
        {SITE.recognition.map((r) => {
          const items: ViewItem[] = r.img ? [{ type: "img", src: r.img, title: r.t, sub: r.p, cap: r.cap },
            ...(r.more || []).map((x): ViewItem => ({ type: "img", src: x.src, title: r.t, sub: r.p, cap: x.cap }))] : [];
          return (
            <li key={r.t}>
              <b>{r.t}</b> {r.p}
              {items.length > 0 && <button className="gp__link" type="button" onClick={() => openLightbox(items, 0, r.t)}>See photos</button>}
            </li>
          );
        })}
      </ul>
    </>
  );
}

function ContactBody() {
  return (
    <>
      <Kicker>Say hello</Kicker>
      <h2 id="gp-title">Let's connect</h2>
      <img className="gp__mascot" src="assets/brand/mascot/coffee.webp" alt="" />
      <p className="gp__lead">Have a question or want to work on something together? Email is the best way to reach me.</p>
      <div className="gp__actions">
        <a className="btn btn--primary" href={`mailto:${P.email}?subject=Hi%20from%20your%20portfolio`}>Say hi</a>
        <a className="btn btn--glass" href={RESUME} download={RESUME_NAME}>Download résumé</a>
      </div>
      <ContactList />
    </>
  );
}

/* The side panel a hotspot opens: the room stays visible, dimmed, behind it. */
export default function Panel({ stop, onClose, goTo, open }: { stop: Target | null; onClose: () => void; goTo: (room: string) => void; open: (t: Target) => void }) {
  const { mounted, shown } = usePresence(!!stop, 380);
  const last = useRef<Target | null>(stop);
  if (stop) last.current = stop;
  const s = last.current;
  const box = useRef<HTMLDivElement>(null);
  const closer = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (stop) { box.current?.scrollTo(0, 0); closer.current?.focus({ preventScroll: true }); }
  }, [stop]);

  let body: React.ReactNode = null;
  if (s) {
    switch (s.kind) {
      case "about": body = <AboutBody goContact={() => { onClose(); goTo("kitchen"); }} />; break;
      case "project": body = s.project ? <ProjectBody p={s.project} /> : <WorkBody open={open} />; break;
      case "arcade": body = <ArcadeBody />; break;
      case "certs": body = <CertsBody />; break;
      case "journey": body = <JourneyBody />; break;
      case "contact": body = <ContactBody />; break;
    }
  }

  return (
    <>
      <div className={"gp-scrim" + (shown ? " is-open" : "")} hidden={!mounted} onClick={onClose} />
      <aside className={"gp" + (shown ? " is-open" : "")} hidden={!mounted} role="dialog" aria-modal="true" aria-labelledby="gp-title">
        <div className="gp__bar">
          <span>~/house/{s?.id}</span>
          <button className="icon-btn" type="button" ref={closer} onClick={onClose} aria-label="Close panel">✕</button>
        </div>
        <div className="gp__scroll" ref={box}>{mounted && body}</div>
      </aside>
    </>
  );
}
