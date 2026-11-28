import { useEffect, useRef, useState, type ReactNode } from "react";
import { SITE } from "../data/site";
import { calm, finePointer, onView, pad2, type Vars } from "../lib/env";

const CYCLE = 4200;
const TRAITS = SITE.traits;

/* badges pick up a link key from their wording, so the bio can point at them */
function honorLink(h: string) {
  return /ITSOC/.test(h) ? "itsoc" : /Ambassador/.test(h) ? "amb" : /Scholar/.test(h) ? "scholar" : /Lister/.test(h) ? "lister" : "";
}

/* How I work cycles through its traits on its own (hover pauses it, a click
   or hover picks one). Phrases in the bio and the badges, facts and traits
   share link keys, so pointing at one lights up the others. The bio card
   carries a soft spotlight that follows the mouse. */
export default function About() {
  const [open, setOpen] = useState(0);
  const [run, setRun] = useState(0);            /* bumps to restart the fill bar */
  const [paused, setPaused] = useState(false);
  const [linked, setLinked] = useState<string | null>(null);
  const openRef = useRef(0), pausedRef = useRef(false), started = useRef(false), timer = useRef(0);
  const list = useRef<HTMLUListElement>(null);
  const bio = useRef<HTMLDivElement>(null);

  function show(k: number) { openRef.current = k; setOpen(k); setRun((r) => r + 1); }
  function schedule() {
    clearTimeout(timer.current);
    if (calm || pausedRef.current || !started.current) return;
    timer.current = window.setTimeout(() => { show((openRef.current + 1) % TRAITS.length); schedule(); }, CYCLE);
  }
  function pause(on: boolean) { pausedRef.current = on; setPaused(on); }

  useEffect(() => {
    /* only start cycling once the list is actually on screen */
    const stop = onView([list.current!], () => { started.current = true; schedule(); });
    return () => { stop(); clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = bio.current;
    if (!el || !finePointer || calm) return;
    function move(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      el!.style.setProperty("--mx", (e.clientX - r.left).toFixed(0) + "px");
      el!.style.setProperty("--my", (e.clientY - r.top).toFixed(0) + "px");
    }
    el.addEventListener("pointermove", move, { passive: true });
    return () => el.removeEventListener("pointermove", move);
  }, []);

  function light(key: string, on: boolean) {
    setLinked(on ? key : null);
    if (on) {
      const t = TRAITS.findIndex((x) => x.t.toLowerCase() === key);
      if (t >= 0) { show(t); clearTimeout(timer.current); }
    } else if (!pausedRef.current) {
      schedule();
    }
  }
  /* props for anything that takes part in the linked highlight */
  function lk(key: string, cls = "") {
    const c = [cls, linked === key ? "is-linked" : ""].filter(Boolean).join(" ");
    return {
      "data-link": key,
      className: c || undefined,
      onPointerEnter: () => light(key, true),
      onPointerLeave: () => light(key, false),
      onFocus: () => light(key, true),
      onBlur: () => light(key, false)
    };
  }
  const kw = (key: string, children: ReactNode) => <span {...lk(key, "kw")}>{children}</span>;

  return (
    <section className="sec" id="about">
      <div className="wrap">
        <header className="sec__head">
          <p className="sec__kicker">01 · who I am</p>
          <h2 className="sec__title" data-title>About Me</h2>
        </header>

        <div className="about">
          <div className="glass about__bio reveal" ref={bio}>
            <p>
              Hi, I'm <strong>Jhan Maurice</strong>. I'm a fourth-year {kw("bsit", "BS Information Technology")} student at{" "}
              {kw("school", "Mapúa Malayan Colleges Laguna")}, and I'm from {kw("home", "Cabuyao, Laguna")}. I finished
              my capstone, Kusina Kode, on 6 November 2026.
            </p>
            <p>
              In group work I often help {kw("organized", "keep things organized")}, but I still enjoy
              doing the {kw("hands-on", "hands-on part")}. I'm most interested in how apps, servers and small
              devices {kw("curious", "work together")}.
            </p>
            <p>
              Outside of class I've served as {kw("itsoc", "president of our IT Society")} and as a{" "}
              {kw("amb", "student ambassador")}, and I like {kw("helpful", "helping classmates review")}. Right now
              I'm learning more about <a {...lk("curious", "kw kw--go")} href="#certs">cloud, networking and security</a>.
            </p>
            <p>
              I'm looking for an on-the-job training placement of 486 hours, and I can start right away.
            </p>
            <dl className="about__facts">
              <div {...lk("bsit")}><dt>Program</dt><dd>BS Information Technology</dd></div>
              <div {...lk("school")}><dt>School</dt><dd>Mapúa Malayan Colleges Laguna</dd></div>
              <div {...lk("grad")}><dt>Graduating</dt><dd>2027 (expected)</dd></div>
              <div {...lk("home")}><dt>Based in</dt><dd>Cabuyao, Laguna</dd></div>
            </dl>
            <ul className="about__honors" id="honors">
              {SITE.honors.map((h) => {
                const key = honorLink(h);
                return key ? <li key={h} {...lk(key)}>{h}</li> : <li key={h}>{h}</li>;
              })}
            </ul>
          </div>

          <div className="traits reveal" style={{ "--d": "80ms" } as Vars}>
            <h3 className="traits__title">How I work</h3>
            <ul className="traits__list" id="traits" ref={list}
              onPointerEnter={() => { pause(true); clearTimeout(timer.current); show(openRef.current); }}
              onPointerLeave={() => { pause(false); show(openRef.current); setTimeout(schedule); }}>
              {TRAITS.map((t, i) => {
                const key = t.t.toLowerCase();
                const on = i === open;
                const props = lk(key, on ? "is-open" : "");
                return (
                  <li key={key} {...props} onPointerEnter={() => { show(i); props.onPointerEnter(); }}>
                    <button type="button" aria-expanded={on} onClick={() => { show(i); schedule(); }}>
                      <span className="traits__n">{pad2(i + 1)}</span><b>{t.t}</b>
                      <i key={run} className="traits__bar" aria-hidden="true"
                        style={on && !calm && !paused ? { animation: `traitFill ${CYCLE}ms linear forwards` } : { animation: "none" }} />
                    </button>
                    <div className="traits__body"><p>{t.p}</p></div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
