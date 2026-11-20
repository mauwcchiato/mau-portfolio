import type { ReactNode } from "react";
import { SITE } from "../data/site";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { Brand } from "./Sidebar";
import type { Vars } from "../lib/env";

const P = SITE.profile;

const SOCIAL: { t: string; v: string; href: string; i: ReactNode; c: string }[] = [
  { t: "GitHub", v: "@" + P.githubHandle, href: P.github, i: <GitHubIcon />, c: "#A78BFA" },
  { t: "LinkedIn", v: "in/jhanmauricederoxas", href: P.linkedin, i: <LinkedInIcon />, c: "#0A66C2" },
  { t: "Email", v: P.email, href: "mailto:" + P.email, i: <MailIcon />, c: "#E879F9" }
];

const EXPLORE = [["about", "About"], ["stack", "Tech Stack"], ["projects", "Projects"], ["play", "Play"],
  ["certs", "Certificates"], ["journey", "Milestones"], ["contact", "Contact"]];

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div className="foot__brand">
            <Brand label="Back to top" />
            <p>Developer from Cabuyao, Laguna.</p>
            <div className="foot__bye">
              <img src="assets/brand/mascot/wave.webp" alt="" width={436} height={640} loading="lazy" />
              <span>Thanks for visiting!</span>
            </div>
          </div>

          <div className="foot__col">
            <h4>Find me on</h4>
            <ul className="foot__social" id="foot-social">
              {SOCIAL.map((s) => (
                <li key={s.t}>
                  <a href={s.href} style={{ "--c": s.c } as Vars}
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    <span className="foot__ico">{s.i}</span>
                    <span><b>{s.t}</b><small>{s.v}</small></span>
                    <span className="foot__go" aria-hidden="true">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="foot__col" aria-label="Footer">
            <h4>Explore</h4>
            <ul className="foot__links">
              {EXPLORE.map(([id, label]) => <li key={id}><a href={"#" + id}>{label}</a></li>)}
            </ul>
          </nav>
        </div>

        <div className="foot__bottom">
          <span>© {new Date().getFullYear()} Jhan Maurice C. De Roxas</span>
          <a className="foot__up" href="#home">Back to top
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
