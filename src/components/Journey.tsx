import { SITE } from "../data/site";
import { useUI, type ViewItem } from "../lib/ui";
import type { Vars } from "../lib/env";

const RECOG_ICON = {
  list: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" /></>,
  cap: <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c3 2 9 2 12 0v-5" /><path d="M22 9v6" /></>,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
};

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

/* Milestones, leadership, recognition and (once there are real quotes)
   what people say. */
export default function Journey() {
  const { openLightbox } = useUI();
  const L = SITE.leadership;
  const recog = SITE.recognition;
  const recs = SITE.recommendations;

  /* photos already shown on a recognition card stay out of the strip */
  const used = recog.map((r) => r.img);
  const shots = SITE.proofs.filter((p) => !used.includes(p.src)).slice(0, 4);
  const stripItems: ViewItem[] = shots.map((p) => ({ type: "img", src: p.src, title: p.title, sub: p.sub, cap: p.cap }));

  return (
    <section className="sec" id="journey">
      <div className="wrap">
        <header className="sec__head">
          <p className="sec__kicker">06 · along the way</p>
          <h2 className="sec__title" data-title>Milestones &amp; Recognition</h2>
        </header>

        <h3 className="sub reveal">Milestones</h3>
        {/* personal milestones, alternating sides of a glowing line */}
        <ol className="miles" id="timeline">
          {SITE.milestones.map((m, n) => (
            <li key={m.t} className="mile reveal" style={{ "--d": (n % 2) * 80 + "ms" } as Vars}>
              <span className="mile__dot" aria-hidden="true" />
              <div className="glass mile__card"><small>{m.when}</small><b>{m.t}</b><p>{m.p}</p></div>
            </li>
          ))}
        </ol>

        <h3 className="sub reveal">Leadership &amp; recognition</h3>
        <div className="lead reveal">
          <div className="glass lead__card" id="lead-card">
            <span className="chip">{L.term}</span>
            <h4>{L.role}</h4>
            <p className="org">{L.org} · {L.where}</p>
            <p>{L.body}</p>
          </div>
          <div className="lead__strip" id="lead-strip">
            {shots.map((p, i) => (
              <button key={p.src} type="button" aria-label={"View photo: " + p.title} onClick={() => openLightbox(stripItems, i, "Leadership")}>
                <img src={p.src} alt="" loading="lazy" /><span>{p.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* a recognition with a photo becomes a big picture card; the rest stay compact */}
        <ul className="recog reveal" id="recog">
          {recog.map((r) => {
            const ico = <span className="recog__ico"><svg viewBox="0 0 24 24" aria-hidden="true">{RECOG_ICON[r.icon] || RECOG_ICON.star}</svg></span>;
            const text = <span><b>{r.t}</b><small>{r.p}</small></span>;
            if (!r.img) return <li key={r.t} className="glass">{ico}{text}</li>;
            const items: ViewItem[] = [{ type: "img", src: r.img, title: r.t, sub: r.p, cap: r.cap },
              ...(r.more || []).map((x): ViewItem => ({ type: "img", src: x.src, title: r.t, sub: r.p, cap: x.cap }))];
            return (
              <li key={r.t} className="recog__photo">
                <button type="button" aria-label={"View photo: " + r.t} onClick={() => openLightbox(items, 0, r.t)}>
                  <img src={r.img} alt="" loading="lazy" />
                  <span className="recog__over">{ico}{text}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {recs.length > 0 && (
          <div className="recs-wrap" id="recs-wrap">
            <h3 className="sub reveal">What people say</h3>
            <div className="recs" id="recs">
              {recs.map((r, i) => (
                <figure key={r.name} className="glass rec reveal" style={{ "--d": (i % 3) * 80 + "ms" } as Vars}>
                  <blockquote>{r.quote}</blockquote>
                  <figcaption>
                    {r.photo ? <img src={r.photo} alt="" loading="lazy" /> : <span className="rec__av" aria-hidden="true">{initials(r.name)}</span>}
                    <span><b>{r.name}</b><small>{[r.role, r.relation].filter(Boolean).join(" · ")}</small></span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
