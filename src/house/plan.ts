import type { Project } from "../data/types";

/* The floor plan, in metres. x runs left to right, z from the back wall
   (negative) to the front door (positive). Two rows of three rooms. */
export type Kind = "about" | "project" | "arcade" | "certs" | "journey" | "contact";

/* something a click can open in the side panel */
export interface Target {
  id: string;
  kind: Kind;
  label: string;
  project?: Project;
}

export interface Room {
  id: string;
  name: string;
  /* the main button while you're in the room */
  cta: string;
  /* what you'll find there, shown under the name */
  holds: string;
  kind: Kind;
  x0: number; x1: number; z0: number; z1: number;
  floor: "wood" | "darkwood" | "carpet" | "tile" | "checker";
}

export const WALL_H = 2.1;      /* walls are cut at this height, like an architect's model */
export const FULL_H = 2.75;     /* ...and stand full height when you walk around inside */
export const HEAD_H = 2.2;      /* top of doors */
export const WIN_H = 2.45;      /* top of the tall modern windows */
export const SILL = .35;        /* windows start low, nearly floor to ceiling */
export const OUTER = .26;
export const INNER = .16;

export const ROOMS: Room[] = [
  { id: "office", name: "Office", cta: "See my projects", holds: "Projects", kind: "project", x0: -8, x1: -2.5, z0: -5.5, z1: 0, floor: "darkwood" },
  { id: "arcade", name: "Game room", cta: "See all games", holds: "Play my games", kind: "arcade", x0: -2.5, x1: 2.5, z0: -5.5, z1: 0, floor: "carpet" },
  { id: "library", name: "Library", cta: "See certificates", holds: "Certificates", kind: "certs", x0: 2.5, x1: 8, z0: -5.5, z1: 0, floor: "wood" },
  { id: "living", name: "Living room", cta: "About me", holds: "About me", kind: "about", x0: -8, x1: -1, z0: 0, z1: 5.5, floor: "wood" },
  { id: "hall", name: "Hallway", cta: "See milestones", holds: "Milestones", kind: "journey", x0: -1, x1: 2, z0: 0, z1: 5.5, floor: "tile" },
  { id: "kitchen", name: "Coffee bar", cta: "Contact me", holds: "Contact", kind: "contact", x0: 2, x1: 8, z0: 0, z1: 5.5, floor: "checker" }
];

export const roomById = (id: string) => ROOMS.find((r) => r.id === id)!;
export const center = (r: Room): [number, number] => [(r.x0 + r.x1) / 2, (r.z0 + r.z1) / 2];

/* An opening in a wall run: a door (a gap) or a window (a low wall with
   glass above). at is the distance along the run to its centre. */
/* sill: how high the glass starts (defaults to SILL; the kitchen window sits above the counter) */
export interface Opening { at: number; w: number; kind: "door" | "window"; sill?: number }
/* A straight wall from a to b (axis-aligned), with its openings. */
export interface Run { a: [number, number]; b: [number, number]; t: number; open?: Opening[] }

export const WALLS: Run[] = [
  /* outside */
  { a: [-8, -5.5], b: [8, -5.5], t: OUTER, open: [{ at: 13.3, w: 1.6, kind: "window" }] },
  { a: [-8, 5.5], b: [8, 5.5], t: OUTER, open: [{ at: 2, w: 1.6, kind: "window" }, { at: 4.6, w: 1.6, kind: "window" }, { at: 8.5, w: 1.1, kind: "door" }, { at: 13, w: 2.4, kind: "window" }] },
  { a: [-8, -5.5], b: [-8, 5.5], t: OUTER, open: [{ at: 2.75, w: 1.6, kind: "window" }] },
  { a: [8, -5.5], b: [8, 5.5], t: OUTER, open: [{ at: 2.75, w: 1.6, kind: "window" }, { at: 7.36, w: 1.2, kind: "window", sill: 1 }] },
  /* between the rows */
  { a: [-8, 0], b: [8, 0], t: INNER, open: [{ at: 3.3, w: 1, kind: "door" }, { at: 8.5, w: 1, kind: "door" }, { at: 13, w: 1, kind: "door" }] },
  /* back row dividers */
  { a: [-2.5, -5.5], b: [-2.5, 0], t: INNER, open: [{ at: 2.9, w: 1, kind: "door" }] },
  { a: [2.5, -5.5], b: [2.5, 0], t: INNER, open: [{ at: 2.9, w: 1, kind: "door" }] },
  /* front row dividers */
  { a: [-1, 0], b: [-1, 5.5], t: INNER, open: [{ at: 2.6, w: 1, kind: "door" }] },
  { a: [2, 0], b: [2, 5.5], t: INNER, open: [{ at: 2.6, w: 1, kind: "door" }] }
];

/* Where you appear when you walk into a room: a spot near its middle,
   facing its main piece of furniture (yaw 0 looks toward the back wall,
   PI/2 looks left). */
export const SPAWN: Record<string, { x: number; z: number; yaw: number }> = {
  living: { x: -3.3, z: 3.6, yaw: Math.PI / 2 },
  office: { x: -5.2, z: -1.4, yaw: 0 },
  arcade: { x: .4, z: -1.1, yaw: 0 },
  library: { x: 4.7, z: -.9, yaw: 0 },
  hall: { x: .5, z: 4.3, yaw: 0 },
  kitchen: { x: 4.9, z: 4.7, yaw: 0 }
};

/* Trees in the yard: [x, z, size, kind]. Kept clear of the front path. */
export const TREES: [number, number, number, "round" | "pine"][] = [
  [-11.2, -6.8, 1.1, "round"], [-12.4, -1.5, .9, "pine"], [-11.6, 3.6, 1.2, "round"], [-10.4, 8.6, .95, "pine"],
  [11.1, -7.2, 1.15, "pine"], [12.6, -2.2, 1, "round"], [11.4, 3.2, .9, "pine"], [10.6, 8.4, 1.2, "round"],
  [-6.5, -9.6, 1, "pine"], [-.6, -10.2, 1.25, "round"], [5.6, -9.4, .95, "pine"], [3.5, 9.8, 1.05, "round"], [-8.2, 10.2, .9, "round"]
];

/* the room containing a point on the floor, if any */
export const roomAt = (x: number, z: number) => ROOMS.find((r) => x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) || null;

/* Solid wall rectangles for walking: every run minus its door gaps
   (windows are solid below the glass), padded by the walker's radius. */
export function solids(pad: number) {
  const out: { x0: number; x1: number; z0: number; z1: number }[] = [];
  WALLS.forEach((run) => {
    const alongX = run.a[1] === run.b[1];
    const L = alongX ? run.b[0] - run.a[0] : run.b[1] - run.a[1];
    const doors = (run.open || []).filter((o) => o.kind === "door").sort((p, q) => p.at - q.at);
    let cur = 0;
    const push = (s: number, e: number) => {
      if (e <= s) return;
      if (alongX) out.push({ x0: run.a[0] + s - pad, x1: run.a[0] + e + pad, z0: run.a[1] - run.t / 2 - pad, z1: run.a[1] + run.t / 2 + pad });
      else out.push({ x0: run.a[0] - run.t / 2 - pad, x1: run.a[0] + run.t / 2 + pad, z0: run.a[1] + s - pad, z1: run.a[1] + e + pad });
    };
    doors.forEach((d) => { push(cur, d.at - d.w / 2); cur = d.at + d.w / 2; });
    push(cur, L);
  });
  return out;
}

/* the room buttons on the right of the nav */
export const NAV = [
  { label: "About", room: "living" },
  { label: "Work", room: "office" },
  { label: "Play", room: "arcade" },
  { label: "Certificates", room: "library" },
  { label: "Milestones", room: "hall" },
  { label: "Contact", room: "kitchen" }
];
