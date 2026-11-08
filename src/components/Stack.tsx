import { useEffect, useRef, useState } from "react";
import { SITE } from "../data/site";
import { onView, type Vars } from "../lib/env";

/* A logo per tool (from Simple Icons, falling back to its short mark),
   then the two roles I take on in a team. */
export default function Stack() {
  const grid = useRef<HTMLDivElement>(null);
  const [broken, setBroken] = useState<Set<string>>(new Set());

  useEffect(() => onView([grid.current!], (g) => g.classList.add("is-in")), []);

  return (
    <section className="sec" id="stack">
      <div className="wrap">
        <header className="sec__head">
          <p className="sec__kicker">02 · what I use</p>
          <h2 className="sec__title" data-title>Tech Stack</h2>
        </header>

        <div className="glass stack" id="stack-grid" ref={grid}>
          {SITE.techIcons.map((t, n) => {
            const mark = t.mark || t.name.slice(0, 3);
            const useImg = t.slug && !broken.has(t.name);
            return (
              <div key={t.name} className="tile" style={{ "--n": n, "--c": "#" + (t.color || "8B5CF6") } as Vars}>
                <span className="tile__ico">
                  {useImg
                    ? <img src={`https://cdn.simpleicons.org/${t.slug}/${t.color || "ffffff"}`} alt="" width={26} height={26} loading="lazy"
                        onError={() => setBroken((b) => new Set(b).add(t.name))} />
                    : <b>{mark}</b>}
                </span>
                <span>{t.name}</span>
              </div>
            );
          })}
        </div>

        <div className="roles" id="roles">
          {SITE.skillRoles.map((r, i) => (
            <article key={r.n} className="glass role reveal" style={{ "--d": i * 90 + "ms" } as Vars}>
              <div className="role__top"><span className="role__n">{r.n}</span><h4>{r.k}</h4></div>
              <p>{r.p}</p>
              <div className="chips">
                {r.tags.map((t) => <span key={t} className={"chip" + (i ? " chip--alt" : "")}>{t}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
