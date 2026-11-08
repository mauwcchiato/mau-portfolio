import type React from "react";

/* Read once at startup, like the old main.js did. */
const mq = (q: string) => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia(q).matches;

export const calm = mq("(prefers-reduced-motion: reduce)");
export const finePointer = mq("(hover: hover) and (pointer: fine)");

export function store(kind: "local" | "session") {
  return {
    get(key: string): string | null {
      try { return (kind === "local" ? localStorage : sessionStorage).getItem(key); } catch { return null; }
    },
    set(key: string, value: string) {
      try { (kind === "local" ? localStorage : sessionStorage).setItem(key, value); } catch { /* private mode */ }
    }
  };
}

/* Call fn once for each node the first time it scrolls into view. */
export function onView(nodes: Element[], fn: (n: Element) => void, opts?: IntersectionObserverInit) {
  if (!("IntersectionObserver" in window)) { nodes.forEach(fn); return () => {}; }
  const io = new IntersectionObserver((ents) => {
    ents.forEach((e) => {
      if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); }
    });
  }, opts || { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  nodes.forEach((n) => io.observe(n));
  return () => io.disconnect();
}

export const pad2 = (n: number) => (n < 10 ? "0" : "") + n;

/* inline style with CSS custom properties, e.g. { "--d": "80ms" } */
export type Vars = React.CSSProperties & Record<`--${string}`, string | number>;
