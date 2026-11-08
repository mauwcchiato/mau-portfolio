import { useEffect, useRef } from "react";
import { calm } from "../lib/env";

interface Star { x: number; y: number; r: number; t: number; s: number }
interface Meteor { x: number; y: number; v: number; len: number; life: number }

/* Twinkling stars plus shooting stars that streak down to the left,
   drawn on one fixed canvas behind every section. */
export default function Sky() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, stars: Star[] = [], next = 0, running = true, raf = 0;
    const meteors: Meteor[] = [];

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(w * h / 9000);
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + .2, t: Math.random() * 6.28, s: Math.random() * .02 + .005 });
      }
      if (calm) draw(0);
    }
    function spawn() {
      const fromTop = Math.random() < .6;
      meteors.push({
        x: fromTop ? Math.random() * w * 1.1 + w * .1 : w + 20,
        y: fromTop ? -20 : Math.random() * h * .6,
        v: Math.random() * 6 + 9,
        len: Math.random() * 120 + 90,
        life: 1
      });
    }
    function draw(t: number) {
      ctx.clearRect(0, 0, w, h);
      stars.forEach((s, i) => {
        s.t += s.s;
        ctx.globalAlpha = .25 + Math.abs(Math.sin(s.t)) * .6;
        ctx.fillStyle = i % 7 === 0 ? "#C4B5FD" : "#FFFFFF";
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (calm) return;
      if (t > next) { spawn(); next = t + 500 + Math.random() * 1100; }
      const dx = -Math.cos(.62), dy = Math.sin(.62);
      for (let m = meteors.length - 1; m >= 0; m--) {
        const o = meteors[m];
        o.x += dx * o.v; o.y += dy * o.v; o.life -= .006;
        const g = ctx.createLinearGradient(o.x, o.y, o.x - dx * o.len, o.y - dy * o.len);
        g.addColorStop(0, "rgba(255,255,255," + (.9 * o.life) + ")");
        g.addColorStop(.3, "rgba(196,181,253," + (.45 * o.life) + ")");
        g.addColorStop(1, "rgba(124,58,237,0)");
        ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(o.x, o.y); ctx.lineTo(o.x - dx * o.len, o.y - dy * o.len); ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255," + o.life + ")";
        ctx.beginPath(); ctx.arc(o.x, o.y, 1.6, 0, 6.283); ctx.fill();
        if (o.life <= 0 || o.x < -200 || o.y > h + 200) meteors.splice(m, 1);
      }
    }
    function loop(t: number) {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    }
    function onVisible() {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(loop);
    }

    size();
    window.addEventListener("resize", size);
    if (!calm) {
      document.addEventListener("visibilitychange", onVisible);
      raf = requestAnimationFrame(loop);
    }
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  return <canvas className="sky" id="sky" ref={ref} aria-hidden="true" />;
}
