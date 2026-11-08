import { calm, onView } from "./env";

/* Fade-ins: anything marked .reveal (and the section titles) gets .is-in
   the first time it scrolls into view. */
export function reveals() {
  const items = Array.from(document.querySelectorAll(".reveal, .sec__title[data-title]"));
  if (calm) { items.forEach((n) => n.classList.add("is-in")); return () => {}; }
  return onView(items, (n) => n.classList.add("is-in"));
}

type Fx = (el: HTMLElement, sp: number, i: number) => void;

/* Motion tied to scroll position, not just a one-off fade: each target gets
   sp, its distance from the middle of the screen in screen heights
   (-1 above, 0 centred, 1 below). Reads happen first, writes after. */
export function scrollFx() {
  if (calm) return () => {};
  const items: { el: HTMLElement; fn: Fx; i: number }[] = [];
  const add = (sel: string, fn: Fx) => document.querySelectorAll<HTMLElement>(sel).forEach((el, i) => items.push({ el, fn, i }));

  add(".sec__head", (el, sp) => { el.style.translate = "0 " + (sp * -70).toFixed(1) + "px"; });
  add(".stack", (el, sp) => {
    const t = Math.max(0, sp);
    el.style.transform = "perspective(1100px) rotateX(" + (t * 32).toFixed(2) + "deg) scale(" + (1 - t * .12).toFixed(3) + ")";
    el.style.opacity = String(Math.max(.2, 1 - t * .9));
  });
  add(".game", (el, sp, i) => {
    el.style.translate = "0 " + (sp * (i % 2 ? 70 : 30)).toFixed(1) + "px";
    el.style.rotate = (sp * (i % 2 ? -3 : 3)).toFixed(2) + "deg";
  });
  add(".mile__card", (el, sp, i) => {
    const amp = Math.min(60, window.innerWidth * .04);
    el.style.translate = (Math.max(0, sp) * (i % 2 ? amp : -amp)).toFixed(1) + "px 0";
  });
  add(".traits__list li", (el, sp, i) => { el.style.translate = (Math.max(0, sp) * (24 + i * 10)).toFixed(1) + "px 0"; });
  add(".lead__strip img", (el, sp) => {
    el.style.translate = "0 " + (sp * 30).toFixed(1) + "px";
    el.style.scale = "1.15";
  });
  add(".contact__card", (el, sp) => { el.style.rotate = "y " + (sp * 25).toFixed(2) + "deg"; });

  const profile = document.querySelector<HTMLElement>(".profile");
  const hero = document.getElementById("home");
  function frame() {
    const vh = window.innerHeight;
    const rects = items.map((it) => it.el.getBoundingClientRect());
    items.forEach((it, k) => {
      const r = rects[k];
      if (r.bottom < -vh || r.top > vh * 2) return;
      const sp = (r.top + r.height / 2 - vh / 2) / vh;
      it.fn(it.el, Math.max(-1.5, Math.min(1.5, sp)), it.i);
    });
    if (profile && hero) {   /* the whoami card tips back and drifts away as you leave the hero */
      const p = Math.max(0, Math.min(1, window.scrollY / (hero.offsetHeight * .9)));
      profile.style.transform = "perspective(1200px) rotateX(" + (p * 28).toFixed(2) + "deg) translateY(" + (p * -60).toFixed(1) + "px) scale(" + (1 - p * .18).toFixed(3) + ")";
      profile.style.opacity = String(1 - p * .9);
    }
  }
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { frame(); ticking = false; });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", frame);
  frame();
  return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", frame); };
}

/* A short burst of confetti for wins in the games. */
export function confetti() {
  if (calm) return;
  const colors = ["#A78BFA", "#E879F9", "#22D3EE", "#FDE68A"];
  const host = document.createElement("div");
  host.className = "confetti";
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("i");
    p.style.left = Math.random() * 100 + "%";
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = Math.random() * .35 + "s";
    p.style.animationDuration = 1.1 + Math.random() * .9 + "s";
    host.appendChild(p);
  }
  document.body.appendChild(host);
  setTimeout(() => host.remove(), 2400);
}
