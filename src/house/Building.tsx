import { useMemo } from "react";
import { BufferGeometry, Color, Float32BufferAttribute, RepeatWrapping, type Texture } from "three";
import { carpetTexture, checkerTexture, plankTexture, plasterTexture, tileTexture } from "./textures";
import { useDay } from "./daylight";
import { FULL_H, HEAD_H, ROOMS, SILL, WALLS, WALL_H, WIN_H, type Room, type Run } from "./plan";

const PLASTER = "#ece6f5";
/* the cut tops of the walls glow, so the floor plan reads like a drawing */
const CUT = new Color("#c4b5fd").multiplyScalar(1.4);
const MOON = new Color("#fff4d0").multiplyScalar(1.6);
const SUN = new Color("#fff1c4").multiplyScalar(2.4);

function floorTex(r: Room): Texture {
  const base = r.floor === "darkwood" ? plankTexture(true) : r.floor === "wood" ? plankTexture(false)
    : r.floor === "carpet" ? carpetTexture() : r.floor === "tile" ? tileTexture() : checkerTexture();
  const t = base.clone();
  t.wrapS = t.wrapT = RepeatWrapping;
  const k = r.floor === "checker" ? 1.6 : r.floor === "tile" ? 1.2 : 2.6;
  t.repeat.set((r.x1 - r.x0) / k, (r.z1 - r.z0) / k);
  t.needsUpdate = true;
  return t;
}

function Floor({ r, onPick }: { r: Room; onPick: (id: string) => void }) {
  const tex = useMemo(() => floorTex(r), [r]);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[(r.x0 + r.x1) / 2, .002, (r.z0 + r.z1) / 2]} receiveShadow
      onClick={(e) => { e.stopPropagation(); if (e.delta < 6) onPick(r.id); }}>
      <planeGeometry args={[r.x1 - r.x0, r.z1 - r.z0]} />
      <meshStandardMaterial map={tex} roughness={r.floor === "checker" || r.floor === "tile" ? .35 : .7} />
    </mesh>
  );
}

/* one block of wall, from s to e along the run, between heights y0 and y1 */
function Block({ run, s, e, y0, y1 }: { run: Run; s: number; e: number; y0: number; y1: number }) {
  const alongX = run.a[1] === run.b[1];
  const len = e - s, h = y1 - y0, mid = (s + e) / 2;
  const x = alongX ? run.a[0] + mid : run.a[0];
  const z = alongX ? run.a[1] : run.a[1] + mid;
  const size: [number, number, number] = alongX ? [len, h, run.t] : [run.t, h, len];
  /* plaster grain, scaled to the block so it reads the same size everywhere */
  const map = useMemo(() => {
    const t = plasterTexture().clone();
    t.wrapS = t.wrapT = RepeatWrapping;
    t.repeat.set(Math.max(1, len / 1.2), Math.max(1, h / 1.2));
    t.needsUpdate = true;
    return t;
  }, [len, h]);
  return (
    <mesh position={[x, y0 + h / 2, z]} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={PLASTER} map={map} roughness={.92} />
    </mesh>
  );
}

/* A wall run cut into solid blocks around its doors and windows. Windows
   get a low wall, a sill and a pane of night-tinted glass. Walking around
   inside, the walls stand full height with a lintel over each opening. */
function Wall({ run }: { run: Run }) {
  const { day, tall } = useDay();
  const H = tall ? FULL_H : WALL_H;
  const alongX = run.a[1] === run.b[1];
  const L = alongX ? run.b[0] - run.a[0] : run.b[1] - run.a[1];
  const opens = [...(run.open || [])].sort((p, q) => p.at - q.at);
  const parts: JSX.Element[] = [];
  let cur = 0;
  opens.forEach((o, k) => {
    const s = o.at - o.w / 2, e = o.at + o.w / 2;
    if (s > cur) parts.push(<Block key={"b" + k} run={run} s={cur} e={s} y0={0} y1={H} />);
    const head = o.kind === "door" ? HEAD_H : WIN_H, top = tall ? head : H, sill = o.sill ?? SILL;
    if (tall) parts.push(<Block key={"l" + k} run={run} s={s} e={e} y0={head} y1={H} />);
    if (o.kind === "window") {
      parts.push(<Block key={"w" + k} run={run} s={s} e={e} y0={0} y1={sill} />);
      const mid = (s + e) / 2;
      const x = alongX ? run.a[0] + mid : run.a[0];
      const z = alongX ? run.a[1] : run.a[1] + mid;
      parts.push(
        <mesh key={"g" + k} position={[x, (sill + top) / 2, z]} rotation-y={alongX ? 0 : Math.PI / 2}>
          <planeGeometry args={[o.w, top - sill]} />
          <meshStandardMaterial color={day ? "#bfe3ff" : "#6f63b8"} transparent opacity={day ? .35 : .28} roughness={.05} metalness={.3} emissive={day ? "#9fd2ff" : "#3b2a7a"} emissiveIntensity={day ? .25 : .4} />
        </mesh>
      );
    }
    cur = e;
  });
  if (cur < L) parts.push(<Block key="end" run={run} s={cur} e={L} y0={0} y1={H} />);
  return <group>{parts}</group>;
}

/* the glowing outline along the top of every wall */
function CutLines() {
  const geo = useMemo(() => {
    const pts: number[] = [];
    WALLS.forEach((run) => {
      const alongX = run.a[1] === run.b[1];
      const L = alongX ? run.b[0] - run.a[0] : run.b[1] - run.a[1];
      const opens = [...(run.open || [])].filter((o) => o.kind === "door").sort((p, q) => p.at - q.at);
      let cur = 0;
      const seg = (s: number, e: number) => {
        for (const side of [-1, 1]) {
          const off = side * run.t / 2;
          if (alongX) pts.push(run.a[0] + s, WALL_H + .003, run.a[1] + off, run.a[0] + e, WALL_H + .003, run.a[1] + off);
          else pts.push(run.a[0] + off, WALL_H + .003, run.a[1] + s, run.a[0] + off, WALL_H + .003, run.a[1] + e);
        }
      };
      opens.forEach((o) => { seg(cur, o.at - o.w / 2); cur = o.at + o.w / 2; });
      seg(cur, L);
    });
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color={CUT} toneMapped={false} />
    </lineSegments>
  );
}

/* stars on a dome around the house */
function Stars() {
  const geo = useMemo(() => {
    const pts: number[] = [];
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 1400; i++) {
      const th = rnd() * Math.PI * 2, ph = Math.acos(rnd() * .92), r = 80;
      pts.push(Math.sin(ph) * Math.cos(th) * r, Math.cos(ph) * r - 6, Math.sin(ph) * Math.sin(th) * r);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#ffffff" size={.35} sizeAttenuation transparent opacity={.85} />
    </points>
  );
}

/* the ceiling, only while walking around inside */
function Ceiling() {
  const { day } = useDay();
  return (
    <mesh rotation-x={Math.PI / 2} position={[0, FULL_H, 0]}>
      <planeGeometry args={[16.3, 11.3]} />
      <meshStandardMaterial color={day ? "#f4f0fa" : "#2a2142"} roughness={1} />
    </mesh>
  );
}

export default function Building({ onPick }: { onPick: (id: string) => void }) {
  const { day, walk } = useDay();
  return (
    <group>
      {/* the model's plinth and the ground it sits on */}
      <mesh position={[0, -.21, 0]} receiveShadow>
        <boxGeometry args={[17.4, .4, 12]} />
        <meshStandardMaterial color={day ? "#b9aed3" : "#231a3a"} roughness={.8} />
      </mesh>
      <mesh position={[0, -.012, 6.05]}>
        <boxGeometry args={[17.4, .02, .02]} />
        <meshBasicMaterial color={CUT} toneMapped={false} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -.41, 0]} receiveShadow>
        <circleGeometry args={[60, 64]} />
        <meshStandardMaterial color={day ? "#a9c48f" : "#0d0a18"} roughness={1} />
      </mesh>
      {/* a path to the front door */}
      {[0, 1, 2].map((k) => (
        <mesh key={k} rotation-x={-Math.PI / 2} position={[.5, -.398, 6.7 + k * .75]} receiveShadow>
          <planeGeometry args={[.9, .5]} />
          <meshStandardMaterial color={day ? "#e4dccb" : "#3a3150"} roughness={.9} />
        </mesh>
      ))}

      {ROOMS.map((r) => <Floor key={r.id} r={r} onPick={onPick} />)}
      {WALLS.map((run, i) => <Wall key={i} run={run} />)}
      {walk ? <Ceiling /> : <CutLines />}
      {!day && <Stars />}
      {/* the moon at night, the sun by day, on opposite sides of the sky */}
      <mesh position={day ? [36, 34, 30] : [-34, 30, -46]}>
        <sphereGeometry args={[day ? 4 : 3, 32, 16]} />
        <meshBasicMaterial color={day ? SUN : MOON} toneMapped={false} />
      </mesh>
    </group>
  );
}
