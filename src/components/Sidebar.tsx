import { useEffect, useRef, useState } from "react";
import { SITE } from "../data/site";
import { store } from "../lib/env";
import { useUI } from "../lib/ui";
import { DownloadIcon, SocialLinks } from "./icons";

export const RESUME = "assets/docs/resume.pdf?v=3";
/* the file name the résumé saves as */
export const RESUME_NAME = "Jhan Maurice De Roxas Resume.pdf";

const LINKS: { id: string; label: string; icon: JSX.Element }[] = [
  { id: "home", label: "Home", icon: <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /> },
  { id: "about", label: "About", icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.5-6 8-6s7 2 8 6" /></> },
  { id: "stack", label: "Tech Stack", icon: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></> },
  { id: "projects", label: "Projects", icon: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M8 21h8M12 18v3" /></> },
  { id: "play", label: "Play", icon: <><rect x="2" y="7" width="20" height="11" rx="5" /><path d="M7 11v3M5.5 12.5h3M16 12h.01M18 14h.01" /></> },
  { id: "certs", label: "Certificates", icon: <><circle cx="12" cy="9" r="5" /><path d="M8.5 13l-1.5 8 5-3 5 3-1.5-8" /></> },
  { id: "journey", label: "Milestones", icon: <path d="M5 21V4M5 4h11l-2 4 2 4H5" /> },
  { id: "contact", label: "Contact", icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></> }
];

/* The scroll progress bar along the top. */
function Progress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ticking = false;
    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0).toFixed(4) + ")";
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div className="progress" id="progress" ref={ref} aria-hidden="true" />;
}

function Brand({ label = "Jhan Maurice De Roxas, back to top" }: { label?: string }) {
  return (
    <a className="nav__brand" href="#home" aria-label={label}>
      <img className="nav__mark" src="assets/brand/logo-128.png" alt="" width={44} height={44} decoding="async" />
      <span className="nav__name">JHAN<b>MAURICE</b></span>
    </a>
  );
}
export { Brand };

/* Dark by default; the switch flips to light and remembers it.
   index.html applies a saved choice before first paint. */
function useTheme() {
  const root = document.documentElement;
  const [light, setLight] = useState(() => root.getAttribute("data-theme") === "light");
  useEffect(() => {
    if (light) root.setAttribute("data-theme", "light"); else root.removeAttribute("data-theme");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", light ? "#F5F2FB" : "#07050D");
  }, [light, root]);
  function toggle() {
    setLight((was) => {
      store("local").set("jm-theme", was ? "dark" : "light");
      return !was;
    });
  }
  return { light, toggle };
}

/* The section the middle of the screen is in. */
function useActiveSection() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    LINKS.forEach((l) => { const s = document.getElementById(l.id); if (s) io.observe(s); });
    return () => io.disconnect();
  }, []);
  return active;
}

/* Desktop: a sidebar that widens on hover. Phones: a slim top bar that
   opens it as a drawer. */
export default function Sidebar() {
  const P = SITE.profile;
  const [open, setOpen] = useState(false);
  const { light, toggle } = useTheme();
  const active = useActiveSection();
  const { setView } = useUI();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => { if (open) setOpen(false); };

  return (
    <>
      <Progress />
      <div className="mbar">
        <Brand />
        <button className="nav__toggle" id="nav-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
      </div>
      <div className="side__scrim" id="side-scrim" hidden={!open} onClick={() => setOpen(false)} />

      <aside className={"side" + (open ? " is-open" : "")} id="nav">
        <a className="nav__brand side__brand" href="#home" aria-label="Jhan Maurice De Roxas, back to top" onClick={close}>
          <img className="nav__mark" src="assets/brand/logo-128.png" alt="" width={44} height={44} decoding="async" />
          <span className="side__who fade"><b>Jhan Maurice</b><small>De Roxas · Portfolio</small></span>
        </a>

        <nav className="side__links" id="nav-links" aria-label="Sections">
          <p className="side__label fade">Menu</p>
          {LINKS.map((l) => (
            <a key={l.id} href={"#" + l.id} aria-current={active === l.id ? "true" : undefined} onClick={close}>
              <svg viewBox="0 0 24 24" aria-hidden="true">{l.icon}</svg><span className="fade">{l.label}</span>
            </a>
          ))}
        </nav>

        <div className="side__foot">
          <button className="side__theme" type="button" aria-label="Open the 3D house" onClick={() => setView("house")}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V9l9-6 9 6v12" /><path d="M7 21v-7h10v7M3 21h18" /></svg>
            <span className="fade">3D house</span>
          </button>
          <button className="side__theme" id="theme-toggle" type="button" aria-pressed={light}
            aria-label={light ? "Switch to dark mode" : "Switch to light mode"} onClick={toggle}>
            <svg className="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
            <svg className="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
            <span className="fade" id="theme-label">{light ? "Dark mode" : "Light mode"}</span>
          </button>
          <a className="btn btn--primary btn--sm side__cv" href={RESUME} download={RESUME_NAME} aria-label="Download résumé" onClick={close}>
            <DownloadIcon /><span className="fade">Download résumé</span>
          </a>
          <div className="side__social fade" id="side-social">
            <SocialLinks github={P.github} linkedin={P.linkedin} email={P.email} />
          </div>
          <p className="side__status fade"><i />Cabuyao, Laguna</p>
        </div>
      </aside>
    </>
  );
}
