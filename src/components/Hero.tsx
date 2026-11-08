import { useEffect, useRef, useState } from "react";
import { SITE } from "../data/site";
import { calm, finePointer } from "../lib/env";
import { SocialLinks } from "./icons";
import { RESUME, RESUME_NAME } from "./Sidebar";

const P = SITE.profile;

/* What ~/whoami types out, one line at a time. */
const SCRIPT = [
  '<span class="p">$</span> ./introduce.sh',
  '<span class="d">› loading profile… done</span>',
  '<span class="k">name</span>:   <span class="n">' + P.name.replace(" C.", "") + "</span>",
  '<span class="k">role</span>:   Full-stack &amp; Android dev',
  '<span class="k">school</span>: Mapúa MCL · BSIT',
  '<span class="k">stack</span>:',
  "  - Kotlin + Jetpack Compose",
  "  - PHP / REST · MySQL",
  "  - AWS · Arduino / ESP8266",
  '<span class="p">$</span> <span class="caret"></span>'
];

/* Starts typing once the intro is over. */
function useTyped(ready: boolean) {
  const [n, setN] = useState(calm ? SCRIPT.length : 0);
  useEffect(() => {
    if (!ready || calm) return;
    let k = 0, t = 0;
    function line() {
      if (k >= SCRIPT.length) return;
      k += 1;
      setN(k);
      t = window.setTimeout(line, k < 2 ? 420 : 170);
    }
    t = window.setTimeout(line, 500);
    return () => clearTimeout(t);
  }, [ready]);
  return SCRIPT.slice(0, n).join("\n");
}

export default function Hero({ ready }: { ready: boolean }) {
  const typed = useTyped(ready);
  const hero = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const visual = useRef<HTMLDivElement>(null);

  /* the background drifts against the pointer, the cards with it */
  useEffect(() => {
    const el = hero.current;
    if (calm || !finePointer || !el) return;
    function move(e: PointerEvent) {
      const r = el!.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      scene.current?.style.setProperty("--px", (x * -24).toFixed(1) + "px");
      scene.current?.style.setProperty("--py", (y * -16).toFixed(1) + "px");
      visual.current?.style.setProperty("--vx", (x * 18).toFixed(1) + "px");
      visual.current?.style.setProperty("--vy", (y * 12).toFixed(1) + "px");
    }
    el.addEventListener("pointermove", move, { passive: true });
    return () => el.removeEventListener("pointermove", move);
  }, []);

  return (
    <section className="hero" id="home" ref={hero}>
      <div className="hero__scene" id="hero-scene" ref={scene} aria-hidden="true">
        <div className="hero__sun" />
        {[1, 2, 3, 4, 5, 6].map((n) => <i key={n} className={"shard shard--" + n} />)}
        <div className="hero__beams"><i /><i /><i /><i /></div>
        <div className="hero__floor" />
      </div>

      <div className="wrap hero__solo">
        <h1 className="sr-only">Jhan Maurice De Roxas · Full-stack &amp; Android developer, BSIT at Mapúa Malayan Colleges Laguna</h1>

        <div className="hero__visual" id="hero-visual" ref={visual}>
          {/* left: what I do, in plain words; right: the whoami card */}
          <div className="hero__copy">
            <p className="hero__hi">Hi, I'm Jhan Maurice</p>
            <p className="hero__title" aria-hidden="true">I build apps that <em>talk to each other.</em></p>
            <p className="hero__lead">
              Android apps, web systems and small IoT devices, from the first sketch to the working build.
              Based in Cabuyao, Laguna.
            </p>
            <div className="profile__actions">
              <a className="btn btn--primary" href="#projects">View projects
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
              <a className="btn btn--glass" href="#contact">Work with me</a>
            </div>
            <ul className="hero__facts">
              <li><b>Android</b><span>Kotlin · Compose</span></li>
              <li><b>Web</b><span>PHP · MySQL</span></li>
              <li><b>IoT &amp; cloud</b><span>Arduino · AWS</span></li>
            </ul>
          </div>

          <div className="profile">
            <img className="profile__peek" src="assets/brand/mascot/wave.webp" alt="" width={436} height={640} decoding="async" />
            <div className="win profile__win">
              <div className="win__bar"><i /><i /><i /><span>~/whoami</span></div>
              <div className="profile__body">
                <figure className="profile__photo">
                  <img src="assets/img/profile.jpg?v=2" alt="Jhan Maurice De Roxas" width={960} height={1280} decoding="async" {...{ fetchpriority: "high" }} />
                  <figcaption>@mauwcchiato</figcaption>
                </figure>
                <div className="profile__main">
                  <pre className="hero__out" id="hero-out" aria-hidden="true" dangerouslySetInnerHTML={{ __html: typed }} />
                  <a className="profile__cv" href={RESUME} download={RESUME_NAME}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>résumé.pdf
                  </a>
                </div>
              </div>
              <div className="profile__status">
                <span aria-hidden="true"><i />online</span>
                <span aria-hidden="true">Cabuyao, PH</span>
                <span className="profile__social" id="hero-social">
                  <SocialLinks github={P.github} linkedin={P.linkedin} email={P.email} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Scroll to About"><span /></a>
    </section>
  );
}
