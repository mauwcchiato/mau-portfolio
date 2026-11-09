import { useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Color, DoubleSide, RepeatWrapping, Vector3, type Group, type Material, type Mesh, type Texture } from "three";
import { useDay } from "./daylight";
import type { Hover } from "./furniture";
import { FULL_H, HEAD_H, TREES, WALL_H } from "./plan";
import { boardTexture, solarTexture } from "./textures";

/* A flat, modern roof: a slim slab with a deep overhang, a wood soffit
   underneath and a dark edge. Over the living room and hallway it steps
   up into a raised box with a band of clerestory glass, and solar panels
   sit on the back half. Click it to lift it off; it floats up and fades,
   then onGone fires. */
const OVER = .7, W = 16 + 2 * OVER, D = 11 + 2 * OVER, T = .26;

export function Roof({ lifted, onClick, onGone, onHover }: {
  lifted: boolean; onClick: () => void; onGone: () => void; onHover: (h: Hover | null) => void;
}) {
  const { day } = useDay();
  const group = useRef<Group>(null);
  const t = useRef(0);
  const gone = useRef(false);
  const soffit = useMemo(() => {
    const tex = boardTexture().clone();
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(W / 1.2, D / 4);
    tex.needsUpdate = true;
    return tex;
  }, []);
  const solar = useMemo(solarTexture, []);
  const glow = useMemo(() => new Color("#ffd9a0").multiplyScalar(day ? .8 : 2), [day]);
  const top = FULL_H + T;

  /* lifting: rise, tip back and fade out, then report gone */
  useFrame((_, dt) => {
    const g = group.current;
    if (!g || !lifted || gone.current) return;
    t.current = Math.min(1, t.current + dt / 1.3);
    const e = t.current * t.current;
    g.position.y = e * 9;
    g.rotation.x = -e * .2;
    g.traverse((o) => {
      const m = (o as Mesh).material as Material | undefined;
      if (m) { m.transparent = true; m.opacity = 1 - e; }
    });
    if (t.current >= 1) { gone.current = true; onGone(); }
  });

  const ev = {
    onClick: (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); if (e.delta < 6 && !lifted) onClick(); },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation(); document.body.style.cursor = "pointer";
      onHover({ label: "The House of My Journey", at: new Vector3(-3, top + 1.6, 2.7), hint: "Click the roof to look inside" });
    },
    onPointerOut: () => { document.body.style.cursor = ""; onHover(null); }
  };

  return (
    <group ref={group} {...ev}>
      {/* main slab, the wood underside and the roof membrane */}
      <mesh position={[0, FULL_H + T / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, T, D]} />
        <meshStandardMaterial color="#2a2536" roughness={.8} />
      </mesh>
      <mesh position={[0, FULL_H - .002, 0]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[W - .02, D - .02]} />
        <meshStandardMaterial map={soffit} color="#ffffff" roughness={.8} side={DoubleSide} />
      </mesh>
      <mesh position={[0, top + .01, 0]}>
        <boxGeometry args={[W - .5, .02, D - .5]} />
        <meshStandardMaterial color="#3b354a" roughness={1} />
      </mesh>

      {/* the raised box over the living room and hallway, with clerestory glass */}
      <group position={[-3.5, top, 2.75]}>
        <mesh position-y={.45} castShadow><boxGeometry args={[10.2, .9, 5.8]} /><meshStandardMaterial color="#ece6f5" roughness={.9} /></mesh>
        {[1, -1].map((sd) => (
          <mesh key={sd} position={[0, .42, sd * 2.91]}><planeGeometry args={[9.6, .5]} /><meshBasicMaterial color={glow} toneMapped={false} side={DoubleSide} /></mesh>
        ))}
        {[1, -1].map((sd) => (
          <mesh key={"e" + sd} position={[sd * 5.11, .42, 0]} rotation-y={Math.PI / 2}><planeGeometry args={[5.2, .5]} /><meshBasicMaterial color={glow} toneMapped={false} side={DoubleSide} /></mesh>
        ))}
        <mesh position-y={1.0} castShadow><boxGeometry args={[11, .2, 6.6]} /><meshStandardMaterial color="#2a2536" roughness={.8} /></mesh>
      </group>

      {/* solar panels on the back half */}
      {[-1, 0, 1, 2, 3].map((i) => [-3.8, -1.9].map((z) => (
        <group key={i + "," + z} position={[2.6 + i * 1.15, top + .22, z]} rotation-x={-.2}>
          <mesh castShadow><boxGeometry args={[1.05, .04, 1.6]} /><meshStandardMaterial color="#c9cbd6" metalness={.6} roughness={.3} /></mesh>
          <mesh position-y={.021} rotation-x={-Math.PI / 2}><planeGeometry args={[1, 1.55]} /><meshStandardMaterial map={solar} metalness={.4} roughness={.2} /></mesh>
        </group>
      )))}
    </group>
  );
}

/* ---------------------------------------------------------------- outside */
/* A low-poly tree: a round leafy one or a tall pine. */
function Tree({ x, z, k, kind }: { x: number; z: number; k: number; kind: "round" | "pine" }) {
  const { day } = useDay();
  const leaf = day ? "#4f9a5a" : "#2c5a43";
  const leaf2 = day ? "#67b36a" : "#356b4f";
  return (
    <group position={[x, -.4, z]} scale={k}>
      <mesh position-y={.7} castShadow><cylinderGeometry args={[.1, .16, 1.4, 8]} /><meshStandardMaterial color="#5b3d2b" roughness={1} /></mesh>
      {kind === "round" ? (
        <>
          <mesh position={[0, 1.95, 0]} castShadow><icosahedronGeometry args={[.95, 0]} /><meshStandardMaterial color={leaf} roughness={1} flatShading /></mesh>
          <mesh position={[.45, 1.55, .3]} castShadow><icosahedronGeometry args={[.6, 0]} /><meshStandardMaterial color={leaf2} roughness={1} flatShading /></mesh>
          <mesh position={[-.4, 1.65, -.25]} castShadow><icosahedronGeometry args={[.55, 0]} /><meshStandardMaterial color={leaf2} roughness={1} flatShading /></mesh>
        </>
      ) : (
        [0, 1, 2].map((i) => (
          <mesh key={i} position-y={1.35 + i * .62} castShadow>
            <coneGeometry args={[.95 - i * .25, 1.15, 8]} />
            <meshStandardMaterial color={i % 2 ? leaf2 : leaf} roughness={1} flatShading />
          </mesh>
        ))
      )}
    </group>
  );
}

/* a flat panel just off a wall's outer face: wood cladding or the stone base */
function Cladding({ x, z, w, h, y = 0, turn, map, color }: { x: number; z: number; w: number; h: number; y?: number; turn: number; map?: Texture; color?: string }) {
  return (
    <mesh position={[x, y + h / 2, z]} rotation-y={turn * Math.PI / 2} receiveShadow>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={map} color={color || "#ffffff"} roughness={.85} />
    </mesh>
  );
}

/* The outside of a modern house: vertical wood cladding on some walls, a
   dark stone base all round, the front door into the hallway (left a
   little open) under a cantilevered canopy, a porch light, shrubs, and
   trees in the yard. */
export function Outside() {
  const { day, tall } = useDay();
  const H = tall ? FULL_H : WALL_H;
  const porch = useMemo(() => new Color("#ffd9a0").multiplyScalar(day ? 1 : 2.4), [day]);
  const boards = useMemo(() => {
    const tex = boardTexture().clone();
    tex.wrapS = tex.wrapT = RepeatWrapping;
    tex.repeat.set(3, 1);
    tex.needsUpdate = true;
    return tex;
  }, []);
  const soffit = useMemo(() => boardTexture(), []);
  const [shrubs] = useState(() => {
    const out: [number, number, number][] = [];
    for (let x = -7.6; x <= 7.6; x += .85) if (Math.abs(x - .5) > 1.2) out.push([x, 6.25 + (Math.abs(x * 7) % 3) * .05, .32 + (Math.abs(x * 13) % 4) * .04]);
    return out;
  });
  const STONE = "#34303d";
  const o = .135;   /* just off the outer face of the 0.26 m outside walls */
  return (
    <group>
      {/* wood cladding */}
      <Cladding x={2.42} z={5.5 + o} w={2.7} h={H} turn={0} map={boards} />
      <Cladding x={0} z={-5.5 - o} w={5} h={H} turn={2} map={boards} />
      <Cladding x={-8 - o} z={1.8} w={7.3} h={H} turn={-1} map={boards} />
      <Cladding x={8 + o} z={-.35} w={3.1} h={H} turn={1} map={boards} />
      {/* a dark stone base all round, below the window sills */}
      <Cladding x={-3.78} z={5.5 + o + .001} w={8.56} h={.3} turn={0} color={STONE} />
      <Cladding x={4.58} z={5.5 + o + .001} w={7.05} h={.3} turn={0} color={STONE} />
      <Cladding x={0} z={-5.5 - o - .001} w={16.26} h={.3} turn={2} color={STONE} />
      <Cladding x={-8 - o - .001} z={0} w={11.26} h={.3} turn={-1} color={STONE} />
      <Cladding x={8 + o + .001} z={0} w={11.26} h={.3} turn={1} color={STONE} />

      {/* the front door, hinged at its left edge and swung inward */}
      <group position={[-.05, 0, 5.5]} rotation-y={.55}>
        <mesh position={[.55, 1.08, 0]} castShadow>
          <boxGeometry args={[1.08, 2.16, .06]} />
          <meshStandardMaterial color="#1b1824" roughness={.4} />
        </mesh>
        <mesh position={[.55, 1.08, .035]}><boxGeometry args={[.12, 1.7, .01]} /><meshStandardMaterial color="#7a5238" roughness={.6} /></mesh>
        <mesh position={[.95, 1.05, .06]}><boxGeometry args={[.03, .5, .03]} /><meshStandardMaterial color="#d4d4d8" metalness={.9} roughness={.2} /></mesh>
      </group>
      {/* the step, a cantilevered canopy with a wood underside, and the porch light */}
      <mesh position={[.5, -.2, 6.1]} receiveShadow><boxGeometry args={[1.8, .4, .7]} /><meshStandardMaterial color="#4a4558" roughness={.9} /></mesh>
      <group position={[.5, HEAD_H + .3, 6.1]}>
        <mesh castShadow><boxGeometry args={[2.6, .12, 1.3]} /><meshStandardMaterial color="#2a2536" roughness={.7} /></mesh>
        <mesh position-y={-.061} rotation-x={Math.PI / 2}><planeGeometry args={[2.58, 1.28]} /><meshStandardMaterial map={soffit} side={DoubleSide} /></mesh>
        <mesh position={[0, -.07, 0]}><cylinderGeometry args={[.07, .07, .02, 20]} /><meshBasicMaterial color={porch} toneMapped={false} /></mesh>
      </group>
      <group position={[1.45, 1.75, 5.66]}>
        <mesh><boxGeometry args={[.08, .3, .08]} /><meshStandardMaterial color="#1a1326" /></mesh>
        <mesh position-z={.041}><planeGeometry args={[.04, .24]} /><meshBasicMaterial color={porch} toneMapped={false} /></mesh>
      </group>
      {!day && <pointLight position={[.5, 2.2, 6.4]} color="#ffd29a" intensity={5} distance={4.5} decay={1.8} />}
      {/* shrubs along the front of the house */}
      {shrubs.map(([x, z, r]) => (
        <mesh key={x} position={[x, -.4 + r * .7, z]} castShadow>
          <icosahedronGeometry args={[r, 0]} />
          <meshStandardMaterial color={day ? "#5aa463" : "#2f5e47"} roughness={1} flatShading />
        </mesh>
      ))}
      {TREES.map(([x, z, k, kind]) => <Tree key={`${x},${z}`} x={x} z={z} k={k} kind={kind} />)}
    </group>
  );
}
