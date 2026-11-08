import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";
import { roomAt, solids, SPAWN } from "./plan";

const EYE = 1.6;
const RADIUS = .25;
const WALK = 2.2, RUN = 4.2;          /* metres per second */
const WALLS = solids(RADIUS);
/* the yard around the house you can step out into */
const BOUNDS = { x0: -11, x1: 11, z0: -8.5, z1: 9.5 };

/* The on-screen joystick (phones) writes here; the rig reads it each frame.
   x: -1 left … 1 right, y: -1 back … 1 forward. */
export const stick = { x: 0, y: 0 };

const blocked = (x: number, z: number) =>
  x < BOUNDS.x0 || x > BOUNDS.x1 || z < BOUNDS.z0 || z > BOUNDS.z1 ||
  WALLS.some((w) => x > w.x0 && x < w.x1 && z > w.z0 && z < w.z1);

/* First-person camera: WASD or arrows (Shift to run) or the joystick to
   walk, drag to look. Walls stop you; doorways let you through. spawn
   moves you to a room (its n changes on every teleport). */
export function WalkRig({ spawn, onRoom }: { spawn: { id: string; n: number }; onRoom: (id: string | null) => void }) {
  const { camera, gl } = useThree();
  const me = useRef({ x: 0, z: 0, yaw: 0, pitch: -.08, vx: 0, vz: 0, room: "" as string | null });
  const keys = useRef(new Set<string>());

  useEffect(() => {
    const s = SPAWN[spawn.id] || SPAWN.living;
    Object.assign(me.current, { x: s.x, z: s.z, yaw: s.yaw, pitch: -.08, vx: 0, vz: 0 });
  }, [spawn]);

  useEffect(() => {
    const el = gl.domElement;
    let drag: { x: number; y: number; id: number } | null = null;
    const down = (e: PointerEvent) => { drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const k = e.pointerType === "touch" ? .006 : .0042;
      /* the view follows the drag: right looks right, up looks up */
      me.current.yaw -= (e.clientX - drag.x) * k;
      me.current.pitch = MathUtils.clamp(me.current.pitch - (e.clientY - drag.y) * k, -1.1, 1.1);
      drag.x = e.clientX; drag.y = e.clientY;
    };
    const up = () => { drag = null; };
    const isMove = (k: string) => ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift"].includes(k);
    const kd = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.target as HTMLElement)?.closest?.("input, textarea, .gp, .modal, .cs, .lightbox")) return;
      if (isMove(k)) { keys.current.add(k); if (k.startsWith("arrow")) e.preventDefault(); }
    };
    const ku = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    const blur = () => keys.current.clear();
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    window.addEventListener("blur", blur);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      window.removeEventListener("blur", blur);
    };
  }, [gl]);

  useFrame((_, raw) => {
    const dt = Math.min(raw, .05), m = me.current, k = keys.current;
    /* input: forward/back and strafe, from keys and the joystick */
    let f = stick.y, r = stick.x;
    if (k.has("w") || k.has("arrowup")) f += 1;
    if (k.has("s") || k.has("arrowdown")) f -= 1;
    if (k.has("d")) r += 1;
    if (k.has("a")) r -= 1;
    /* arrow left/right turn, like a game */
    if (k.has("arrowleft")) m.yaw += 1.8 * dt;
    if (k.has("arrowright")) m.yaw -= 1.8 * dt;
    const len = Math.hypot(f, r);
    if (len > 1) { f /= len; r /= len; }
    const speed = k.has("shift") ? RUN : WALK;
    /* yaw 0 faces -z; forward is (-sin, -cos), right is (cos, -sin) */
    const sin = Math.sin(m.yaw), cos = Math.cos(m.yaw);
    const tx = (-sin * f + cos * r) * speed, tz = (-cos * f - sin * r) * speed;
    m.vx = MathUtils.damp(m.vx, tx, 10, dt);
    m.vz = MathUtils.damp(m.vz, tz, 10, dt);
    /* move one axis at a time so you slide along walls instead of sticking */
    const nx = m.x + m.vx * dt;
    if (!blocked(nx, m.z)) m.x = nx; else m.vx = 0;
    const nz = m.z + m.vz * dt;
    if (!blocked(m.x, nz)) m.z = nz; else m.vz = 0;

    const bob = Math.hypot(m.vx, m.vz) > .3 ? Math.sin(performance.now() / 160) * .025 : 0;
    camera.position.set(m.x, EYE + bob, m.z);
    camera.rotation.set(m.pitch, m.yaw, 0, "YXZ");

    const here = roomAt(m.x, m.z)?.id ?? null;
    if (here !== m.room) { m.room = here; onRoom(here); }
  });

  return null;
}
