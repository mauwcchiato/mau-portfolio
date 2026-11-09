import { useMemo } from "react";
import { Color, RepeatWrapping, type Texture } from "three";
import { useDay } from "./daylight";
import { FULL_H, HEAD_H, SILL, WALLS, WALL_H, WIN_H, type Run } from "./plan";
import { fabricTexture, subwayTexture } from "./textures";

const TRIM = "#f7f4fb";
/* slim black window frames, as on a modern house */
const FRAME = "#1b1824";

/* ---------------------------------------------------------------- helpers */
const alongX = (r: Run) => r.a[1] === r.b[1];
const length = (r: Run) => (alongX(r) ? r.b[0] - r.a[0] : r.b[1] - r.a[1]);

/* Outside walls only get trim on the inside; inner walls on both faces.
   side = +1 is the face toward +z (or +x). */
function faces(r: Run): number[] {
  if (r.t < .2) return [1, -1];
  if (alongX(r)) return [r.a[1] < 0 ? 1 : -1];
  return [r.a[0] < 0 ? 1 : -1];
}

/* A box lying along a wall run, from s to e, between heights y0 and y1,
   pushed off the wall's centre line by off (sideways), d deep. */
function Along({ r, s, e, y0, y1, off, d, color = TRIM, emissive }: {
  r: Run; s: number; e: number; y0: number; y1: number; off: number; d: number; color?: string | Color; emissive?: boolean;
}) {
  const len = e - s, h = y1 - y0, mid = (s + e) / 2;
  const pos: [number, number, number] = alongX(r) ? [r.a[0] + mid, y0 + h / 2, r.a[1] + off] : [r.a[0] + off, y0 + h / 2, r.a[1] + mid];
  const size: [number, number, number] = alongX(r) ? [len, h, d] : [d, h, len];
  return (
    <mesh position={pos} castShadow={false} receiveShadow>
      <boxGeometry args={size} />
      {emissive
        ? <meshBasicMaterial color={color} toneMapped={false} />
        : <meshStandardMaterial color={color} roughness={.6} />}
    </mesh>
  );
}

/* the solid stretches of a run, minus its doors (and, optionally, windows) */
function spans(r: Run, skipWindows: boolean) {
  const out: [number, number][] = [];
  let cur = 0;
  [...(r.open || [])].filter((o) => o.kind === "door" || skipWindows).sort((p, q) => p.at - q.at).forEach((o) => {
    if (o.at - o.w / 2 > cur) out.push([cur, o.at - o.w / 2]);
    cur = o.at + o.w / 2;
  });
  if (cur < length(r)) out.push([cur, length(r)]);
  return out;
}

/* ---------------------------------------------------------------- trim
   Baseboards along every wall, crown moulding at the ceiling while
   walking, and a frame around every doorway. */
export function Trim() {
  const { walk, tall } = useDay();
  const H = tall ? FULL_H : WALL_H;
  const parts: JSX.Element[] = [];
  WALLS.forEach((r, i) => {
    faces(r).forEach((side) => {
      const face = side * r.t / 2;
      spans(r, false).forEach(([s, e], k) => {
        parts.push(<Along key={`b${i}${side}${k}`} r={r} s={s} e={e} y0={0} y1={.11} off={face + side * .012} d={.024} />);
        if (walk) parts.push(<Along key={`c${i}${side}${k}`} r={r} s={s} e={e} y0={H - .08} y1={H} off={face + side * .025} d={.05} />);
      });
      (r.open || []).filter((o) => o.kind === "door").forEach((o, k) => {
        const s = o.at - o.w / 2, e = o.at + o.w / 2, top = Math.min(HEAD_H, H);
        parts.push(<Along key={`dl${i}${side}${k}`} r={r} s={s - .07} e={s} y0={0} y1={top} off={face + side * .015} d={.03} />);
        parts.push(<Along key={`dr${i}${side}${k}`} r={r} s={e} e={e + .07} y0={0} y1={top} off={face + side * .015} d={.03} />);
        if (tall) parts.push(<Along key={`dt${i}${side}${k}`} r={r} s={s - .07} e={e + .07} y0={HEAD_H} y1={HEAD_H + .08} off={face + side * .015} d={.03} />);
        /* a light switch beside each doorway */
        if (side === faces(r)[0]) parts.push(<Along key={`sw${i}${k}`} r={r} s={e + .2} e={e + .28} y0={1.15} y1={1.27} off={face + side * .008} d={.016} color="#ffffff" />);
      });
    });
  });
  return <group>{parts}</group>;
}

/* ---------------------------------------------------------------- windows
   A frame, a centre mullion and a deep sill on the inside of each window,
   plus a pair of curtains on a rod. */
export function Windows() {
  const { tall, day } = useDay();
  const top = tall ? WIN_H : WALL_H - .02;
  const fabric = useMemo(() => {
    const t = fabricTexture().clone();
    t.wrapS = RepeatWrapping; t.needsUpdate = true;
    return t;
  }, []);
  const parts: JSX.Element[] = [];
  WALLS.forEach((r, i) => {
    const side = faces(r)[0];
    const face = side * r.t / 2;
    (r.open || []).filter((o) => o.kind === "window").forEach((o, k) => {
      const s = o.at - o.w / 2, e = o.at + o.w / 2, m = o.at, SL = o.sill ?? SILL;
      const key = `${i}-${k}`;
      parts.push(
        <group key={key}>
          <Along r={r} s={s - .02} e={e + .02} y0={SL - .04} y1={SL} off={face + side * .05} d={.12} />
          <Along r={r} s={s} e={s + .045} y0={SL} y1={top} off={face - side * .02} d={.08} color={FRAME} />
          <Along r={r} s={e - .045} e={e} y0={SL} y1={top} off={face - side * .02} d={.08} color={FRAME} />
          <Along r={r} s={m - .018} e={m + .018} y0={SL} y1={top} off={face - side * .02} d={.05} color={FRAME} />
          <Along r={r} s={s} e={e} y0={top - .045} y1={top} off={face - side * .02} d={.08} color={FRAME} />
          <Along r={r} s={s} e={e} y0={SL} y1={SL + .045} off={face - side * .02} d={.08} color={FRAME} />
          {/* curtains, gathered at each side, and the rod */}
          <Curtain r={r} s={s - .32} e={s + .05} top={top + .06} off={face + side * .13} map={fabric} day={day} />
          <Curtain r={r} s={e - .05} e={e + .32} top={top + .06} off={face + side * .13} map={fabric} day={day} />
          <Along r={r} s={s - .4} e={e + .4} y0={top + .07} y1={top + .1} off={face + side * .13} d={.03} color="#2a2140" />
        </group>
      );
    });
  });
  return <group>{parts}</group>;
}

function Curtain({ r, s, e, top, off, map, day }: { r: Run; s: number; e: number; top: number; off: number; map: Texture; day: boolean }) {
  const len = e - s, h = top - .04, mid = (s + e) / 2;
  const pos: [number, number, number] = alongX(r) ? [r.a[0] + mid, .04 + h / 2, r.a[1] + off] : [r.a[0] + off, .04 + h / 2, r.a[1] + mid];
  const size: [number, number, number] = alongX(r) ? [len, h, .05] : [.05, h, len];
  return (
    <mesh position={pos} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={day ? "#b9a3e6" : "#7a5cc4"} map={map} roughness={.95} />
    </mesh>
  );
}

/* ---------------------------------------------------------------- feature walls */
/* a wall of vertical wood slats, behind the living room TV */
export function SlatWall({ x, z0, z1 }: { x: number; z0: number; z1: number }) {
  const { tall } = useDay();
  const H = tall ? FULL_H : WALL_H;
  const n = Math.floor((z1 - z0) / .09);
  return (
    <group>
      <mesh position={[x + .005, H / 2, (z0 + z1) / 2]}>
        <boxGeometry args={[.01, H, z1 - z0]} />
        <meshStandardMaterial color="#2a1c16" />
      </mesh>
      {Array.from({ length: n }, (_, i) => (
        <mesh key={i} position={[x + .025, H / 2, z0 + .045 + i * .09]} castShadow receiveShadow>
          <boxGeometry args={[.035, H - .02, .055]} />
          <meshStandardMaterial color={i % 5 === 2 ? "#8a5d3e" : "#7a5238"} roughness={.7} />
        </mesh>
      ))}
    </group>
  );
}

/* a flat painted panel on a wall: an accent colour or a tiled backsplash */
export function Panel({ pos, size, turn = 0, color, tiles }: { pos: [number, number, number]; size: [number, number]; turn?: number; color?: string; tiles?: boolean }) {
  const map = useMemo(() => {
    if (!tiles) return undefined;
    const t = subwayTexture().clone();
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(size[0] / .5, size[1] / .5);
    t.needsUpdate = true;
    return t;
  }, [tiles, size]);
  return (
    <mesh position={pos} rotation-y={turn * Math.PI / 2} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color || "#ffffff"} map={map} roughness={tiles ? .25 : .9} />
    </mesh>
  );
}

/* lower-wall panelling with raised rectangles, for the hallway */
export function Wainscot({ x, z0, z1, side }: { x: number; z0: number; z1: number; side: 1 | -1 }) {
  const n = Math.max(1, Math.round((z1 - z0) / .7));
  const w = (z1 - z0) / n;
  return (
    <group position={[x, 0, 0]}>
      <mesh position={[side * .006, .5, (z0 + z1) / 2]}>
        <boxGeometry args={[.012, 1, z1 - z0]} />
        <meshStandardMaterial color="#d9d1ea" roughness={.7} />
      </mesh>
      <mesh position={[side * .02, 1.01, (z0 + z1) / 2]}>
        <boxGeometry args={[.04, .04, z1 - z0]} />
        <meshStandardMaterial color={TRIM} />
      </mesh>
      {Array.from({ length: n }, (_, i) => (
        <mesh key={i} position={[side * .016, .55, z0 + w * (i + .5)]}>
          <boxGeometry args={[.012, .6, w - .16]} />
          <meshStandardMaterial color="#e6dff2" roughness={.6} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------- lights */
/* flush ceiling lights, only drawn while walking under the ceiling */
export function CeilingLights() {
  const { walk, day } = useDay();
  const glow = useMemo(() => new Color("#fff1d6").multiplyScalar(day ? 1 : 2.2), [day]);
  if (!walk) return null;
  const spots: [number, number][] = [[-5.25, -2.75], [0, -2.75], [5.25, -2.75], [-4.5, 2.75], [.5, 1.4], [.5, 4.1], [5, 1.2]];
  return (
    <group>
      {spots.map(([x, z]) => (
        <group key={x + "," + z} position={[x, FULL_H - .02, z]}>
          <mesh><cylinderGeometry args={[.22, .22, .03, 32]} /><meshStandardMaterial color="#f4f0fa" /></mesh>
          <mesh position-y={-.017}><cylinderGeometry args={[.17, .17, .005, 32]} /><meshBasicMaterial color={glow} toneMapped={false} /></mesh>
        </group>
      ))}
    </group>
  );
}

/* three pendant lamps over the coffee bar */
export function Pendants({ xs, z, y }: { xs: number[]; z: number; y: number }) {
  const { tall, day } = useDay();
  const top = tall ? FULL_H : WALL_H;
  const bulb = useMemo(() => new Color("#ffd9a0").multiplyScalar(day ? 1 : 2.6), [day]);
  return (
    <group>
      {xs.map((x) => (
        <group key={x} position={[x, 0, z]}>
          <mesh position={[0, (top + y) / 2, 0]}><cylinderGeometry args={[.006, .006, top - y, 6]} /><meshBasicMaterial color="#1a1326" /></mesh>
          <mesh position={[0, y, 0]} castShadow><coneGeometry args={[.17, .2, 24, 1, true]} /><meshStandardMaterial color="#1e1830" metalness={.6} roughness={.35} side={2} /></mesh>
          <mesh position={[0, y - .07, 0]}><sphereGeometry args={[.05, 16, 8]} /><meshBasicMaterial color={bulb} toneMapped={false} /></mesh>
        </group>
      ))}
    </group>
  );
}
