import { useState, type ReactNode } from "react";
import { SITE } from "../data/site";
import { useUI } from "../lib/ui";
import { GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";
import { RESUME, RESUME_NAME } from "./Sidebar";
import type { Vars } from "../lib/env";

const P = SITE.profile;

const ROWS: { t: string; v: string; href: string; i: ReactNode }[] = [
  { t: "Email", v: P.email, href: "mailto:" + P.email, i: <MailIcon /> },
  { t: "Phone", v: P.phone, href: "tel:+63" + P.phone.replace(/\D/g, "").replace(/^0/, ""), i: <PhoneIcon /> },
  { t: "GitHub", v: "github.com/" + P.githubHandle, href: P.github, i: <GitHubIcon /> },
  { t: "LinkedIn", v: "linkedin.com/in/jm-de-roxas", href: P.linkedin, i: <LinkedInIcon /> },
  { t: "Location", v: P.location, href: "", i: <PinIcon /> }
];

function CopyButton({ label, text }: { label: string; text: string }) {
  const { toast } = useUI();
  const [ok, setOk] = useState(false);
  function copy() {
    const done = () => {
      setOk(true); toast("Copied " + text);
      setTimeout(() => setOk(false), 1400);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  }
  return (
    <button className={"copy" + (ok ? " is-ok" : "")} type="button" aria-label={"Copy " + label} onClick={copy}>
      {ok ? "Copied" : "Copy"}
    </button>
  );
}

/* Email, phone, GitHub, LinkedIn and location, each with a copy button.
   reveal: fade in on scroll (the classic page); off inside the house's side panel. */
export function ContactList({ reveal = false }: { reveal?: boolean }) {
  return (
    <div className="contact__list">
      {ROWS.map((r, n) => {
        const web = r.href.startsWith("http");
        const inner = <><span className="clink__ico">{r.i}</span><span className="clink__t"><b>{r.t}</b><span>{r.v}</span></span></>;
        return (
          <div key={r.t} className={"crow" + (reveal ? " reveal" : "")} style={{ "--d": n * 60 + "ms" } as Vars}>
            {r.href
              ? <a className="clink" href={r.href} {...(web ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inner}</a>
              : <div className="clink">{inner}</div>}
            {r.href && <CopyButton label={r.t} text={web ? r.href : r.v} />}
          </div>
        );
      })}
    </div>
  );
}

export default function Contact() {
  return (
    <section className="sec" id="contact">
      <div className="wrap">
        <header className="sec__head">
          <p className="sec__kicker">07 · say hello</p>
          <h2 className="sec__title" data-title>Contact</h2>
        </header>

        <div className="contact">
          <div className="contact__main reveal">
            <h3>Let's connect</h3>
            <p>Have a question or want to work on something together? Email is the best way to reach me.</p>
            <ContactList reveal />
          </div>
          <aside className="glass contact__card reveal" style={{ "--d": "100ms" } as Vars}>
            <img className="contact__mascot" src="assets/brand/mascot/coffee.webp" alt="" width={345} height={640} loading="lazy" />
            <p>Thanks for stopping by. Send me a hello, or take my résumé with you.</p>
            <div className="contact__actions">
              <a className="btn btn--primary" href={`mailto:${P.email}?subject=Hi%20from%20your%20portfolio`}>Say hi</a>
              <a className="btn btn--glass" href={RESUME} download={RESUME_NAME}>Download résumé</a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
