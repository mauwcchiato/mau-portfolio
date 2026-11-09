import { SITE } from "../data/site";
import type { Project } from "../data/types";
import { pad2 } from "../lib/env";
import { useUI } from "../lib/ui";
import { ArrowIcon, DownloadIcon } from "./icons";

/* Selected work: the featured projects, in data order. */
export const WORK = SITE.projects.filter((p) => p.featured);

/* "Request the APK": a prefilled email, for projects flagged apk: true */
function apkMail(p: Project) {
  const subject = p.name + " APK request";
  const body = "Hi Jhan Maurice,\n\nI'd like to try " + p.name + " on my Android phone. Could you send me the APK?\n\nThanks!";
  return "mailto:" + SITE.profile.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}
export function ApkButton({ p, cls = "btn--glass" }: { p: Project; cls?: string }) {
  if (!p.apk) return null;
  return <a className={"btn " + cls} href={apkMail(p)}><DownloadIcon />Request the APK</a>;
}

export function Chips({ list, cls }: { list: string[]; cls?: string }) {
  return <div className="chips">{list.map((t) => <span key={t} className={"chip" + (cls ? " " + cls : "")}>{t}</span>)}</div>;
}

/* The picture for a project: a laptop for websites, two phones for apps
   with real screens, otherwise its cover image. */
export function ProjectFace({ p }: { p: Project }) {
  if (p.laptop && p.face !== "phone") {
    return (
      <span className="card-dev card-dev--laptop">
        <span className="mini-lap"><span><img src={p.laptop[0].src} alt="" draggable={false} /></span></span>
      </span>
    );
  }
  if (p.phone) {
    const n = p.phone.length;
    const [front, back] = p.cover || [Math.min(2, n - 1), n > 4 ? 4 : 0];
    return (
      <span className="card-dev">
        <span className="mini-phone is-back"><img src={p.phone[back].src} alt="" draggable={false} /></span>
        <span className="mini-phone"><img src={p.phone[front].src} alt="" draggable={false} /></span>
      </span>
    );
  }
  return p.hero ? <img src={p.hero} alt="" draggable={false} className={p.heroPixel ? "pixelated" : undefined} /> : null;
}

/* One card per featured project, opening its case study. */
export default function Projects() {
  const { openProject, openGame } = useUI();
  return (
    <section className="sec" id="projects">
      <div className="wrap">
        <header className="sec__head">
          <p className="sec__kicker">03 · selected work</p>
          <h2 className="sec__title" data-title>Projects</h2>
          <p className="sec__lede">Things I've built in class, on my own and for real users: IoT, Android apps, web systems, an AI study tool and cloud designs. Open one to see how it was made.</p>
        </header>

        <div className="work" id="work">
          {WORK.map((p, i) => (
            <article key={p.id} className="work__item reveal">
              <button className={"work__media" + (p.heroFit === "contain" && !p.phone && !p.laptop ? " is-contain" : "")} type="button"
                aria-label={`Open the ${p.name} case study`} onClick={() => openProject(p.id)}>
                <ProjectFace p={p} />
                <span className="work__num">{pad2(i + 1)}</span>
                <span className="work__open">View case study</span>
              </button>
              <div className="work__copy">
                <span className="work__kicker">{p.kicker} · {p.year}</span>
                <h3>{p.name}</h3>
                {p.sub && <p className="work__sub">{p.sub}</p>}
                <p className="work__blurb">{p.blurb || p.tagline}</p>
                {p.role && <p className="work__role"><b>My role:</b> {p.role}</p>}
                <Chips list={p.tech.slice(0, 6)} />
                <div className="work__actions">
                  <button className="btn btn--primary" type="button" onClick={() => openProject(p.id)}>View case study <ArrowIcon /></button>
                  {p.live && <a className="btn btn--glass" href={p.live} target="_blank" rel="noopener noreferrer">{p.liveLabel || "Visit live site"} ↗</a>}
                  {p.playable && <button className="btn btn--play" type="button" onClick={() => openGame(p.playable!)}>▶ PLAY</button>}
                  <ApkButton p={p} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
