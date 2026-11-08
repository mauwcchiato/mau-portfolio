import { useEffect, useRef, useState } from "react";
import { SITE } from "../data/site";
import type { Cert } from "../data/types";
import { calm, type Vars } from "../lib/env";
import { useUI, type ViewItem } from "../lib/ui";

const GROUPS: [string, string[]][] = [
  ["Cloud", ["Cloud", "Cloud & DevOps", "Architecture"]],
  ["DevOps", ["DevOps"]],
  ["Data", ["Data", "Data & BI", "Database"]],
  ["Product & Design", ["Product", "Design", "UI/UX", "Mobile UI", "Analysis & Design"]],
  ["Security & Networking", ["Security", "Networking"]]
];
function groupOf(c: Cert) {
  return GROUPS.find(([, cats]) => cats.includes(c.cat))?.[0] || "Other";
}
const thumb = (c: Cert) => `assets/img/certs/thumbs/${c.id}.webp`;
function viewItem(c: Cert): ViewItem {
  const type = SITE.certTypes[c.type]?.label || "";
  return { type: "pdf", src: c.file, title: c.name, sub: c.issuer + " · " + c.date, cap: type + (c.via ? " · via " + c.via : ""), link: c.verify || "" };
}
/* featured first, then newest */
const BY_DATE = SITE.certs.slice().sort((a, b) => {
  if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
  return (b.year || 0) - (a.year || 0);
});

/* A 3D ring of the newest certificates: it spins on its own, can be
   dragged, and gets a push from page scroll. */
function Ring() {
  const { openLightbox } = useUI();
  const stage = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const moved = useRef(0);
  const picks = BY_DATE.slice(0, 14);
  const items = picks.map(viewItem);
  const n = picks.length;
  const [small] = useState(() => window.innerWidth < 640);
  const w = small ? 170 : 260, h = Math.round(w * .7);
  const r = Math.round((w + (small ? 14 : 26)) * n / (2 * Math.PI));

  useEffect(() => {
    const st = stage.current!, rg = ring.current!;
    let angle = 0, vel = calm ? 0 : -.12, dragging = false, lastX = 0, visible = false, hover = false, raf = 0;
    let lastY = window.scrollY;

    const down = (e: PointerEvent) => { dragging = true; moved.current = 0; lastX = e.clientX; st.classList.add("is-drag"); };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX; lastX = e.clientX; moved.current += Math.abs(dx);
      angle += dx * .25; vel = dx * .25;
    };
    const up = () => { if (!dragging) return; dragging = false; st.classList.remove("is-drag"); };
    const enter = () => { hover = true; };
    const leave = () => { hover = false; };
    /* scrolling the page gives the ring a push */
    const scroll = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      if (visible && !calm) vel = Math.max(-4, Math.min(4, vel - dy * .04));
    };
    function spin() {
      if (!visible) return;
      if (!dragging) {
        const target = calm ? 0 : (hover ? -.03 : -.12);
        vel += (target - vel) * .04;
        angle += vel;
      }
      rg.style.setProperty("--ry", angle.toFixed(2) + "deg");
      raf = requestAnimationFrame(spin);
    }

    st.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    st.addEventListener("pointerenter", enter);
    st.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", scroll, { passive: true });
    rg.style.setProperty("--ry", "0deg");
    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver((ents) => {
        visible = ents[0].isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(spin);
      });
      io.observe(st);
    } else { visible = true; raf = requestAnimationFrame(spin); }

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      st.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      st.removeEventListener("pointerenter", enter);
      st.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", scroll);
    };
  }, []);

  return (
    <div className="ring-stage reveal" id="ring-stage" ref={stage} style={{ height: h + 44 + "px" }}>
      <div className="ring" id="ring" ref={ring} style={{ "--w": w + "px", "--h": h + "px", "--r": r + "px" } as Vars}>
        {picks.map((c, i) => (
          <button key={c.id} className="ring__card" type="button" style={{ "--a": (360 / n * i).toFixed(2) + "deg" } as Vars}
            aria-label={"Open certificate: " + c.name} onClick={() => { if (moved.current < 6) openLightbox(items, i, "Certificates"); }}>
            <img src={thumb(c)} alt="" loading="lazy" draggable={false} /><span>{c.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Every certificate, filterable by group. */
export function CertList() {
  const { openLightbox } = useUI();
  const [group, setGroup] = useState("All");
  const counts: Record<string, number> = { All: SITE.certs.length };
  SITE.certs.forEach((c) => { const g = groupOf(c); counts[g] = (counts[g] || 0) + 1; });
  const groups = ["All", ...GROUPS.map((g) => g[0]), "Other"].filter((g) => counts[g]);
  const items = BY_DATE.map(viewItem);
  const B = SITE.badges;
  let shown = 0;

  return (
    <div className="wrap">
      <div className="filters" id="cert-filters" role="group" aria-label="Filter certificates">
        {groups.map((g) => (
          <button key={g} className="filter" type="button" aria-pressed={g === group} onClick={() => setGroup(g)}>{g}<b>{counts[g]}</b></button>
        ))}
      </div>
      <div className="certs" id="cert-grid">
        {BY_DATE.map((c, i) => {
          const show = group === "All" || groupOf(c) === group;
          /* keyed by the filter too, so the entrance replays on every switch */
          return (
            <button key={group + c.id} className="cert" type="button" hidden={!show} style={{ "--n": show ? shown++ : 0 } as Vars}
              onClick={() => openLightbox(items, i, "Certificates")}>
              <img src={thumb(c)} alt="" loading="lazy" />
              <span><b>{c.name}</b><small>{c.issuer} · {c.date}</small></span>
            </button>
          );
        })}
      </div>
      {B && (
        <p className="certs__badges" id="badges">
          Plus {B.count} {B.title} skill badges · <a href={B.profile} target="_blank" rel="noopener noreferrer">see the public profile ↗</a>
        </p>
      )}
    </div>
  );
}

export default function Certs() {
  return (
    <section className="sec" id="certs">
      <div className="wrap">
        <header className="sec__head">
          <p className="sec__kicker">05 · proof of learning</p>
          <h2 className="sec__title" data-title>Certificates</h2>
          <p className="sec__lede">Drag the ring or let it spin. Click any certificate to open the original document.</p>
        </header>
      </div>
      <Ring />
      <CertList />
    </section>
  );
}
