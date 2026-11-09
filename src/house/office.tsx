import { useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { AdditiveBlending, Color, Vector3, type Group, type Texture } from "three";
import { useDay } from "./daylight";
import { Screen, type Hover } from "./furniture";
import { glowTexture } from "./textures";

type OnHover = (h: Hover | null) => void;

/* hover + click handlers shared by the clickable pieces (and the cats) */
export function clickable(label: string, hint: string, at: Vector3, onClick: () => void, onHover: OnHover) {
  return {
    onClick: (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); if (e.delta < 6) onClick(); },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); document.body.style.cursor = "pointer"; onHover({ label, at, hint }); },
    onPointerOut: () => { document.body.style.cursor = ""; onHover(null); }
  };
}

/* An LED colour: brighter than white at night so it blooms, softer by day. */
export function useLed(hex: string, k = 2.2) {
  const { day } = useDay();
  return useMemo(() => new Color(hex).multiplyScalar(day ? 1 : k), [hex, day, k]);
}

/* a soft coloured wash on the wall behind something (bias lighting) */
export function Wash({ position, size, color, opacity = .55, turn = 0 }: { position: [number, number, number]; size: [number, number]; color: string; opacity?: number; turn?: number }) {
  const halo = useMemo(glowTexture, []);
  return (
    <mesh position={position} rotation-y={turn * Math.PI / 2}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={halo} color={color} transparent opacity={opacity} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

/* ---------------------------------------------------------------- PC tower
   A glass-sided case with three RGB front fans and a power light. */
export function PcTower({ position, color, turn = 0 }: { position: [number, number, number]; color: string; turn?: number }) {
  const led = useLed(color, 2.6);
  const fans = useRef<Group>(null);
  useFrame((_, dt) => { fans.current?.children.forEach((f) => { f.rotation.z += dt * 3; }); });
  return (
    <group position={position} rotation-y={turn * Math.PI / 2}>
      <mesh position-y={.25} castShadow><boxGeometry args={[.22, .5, .46]} /><meshStandardMaterial color="#14101e" metalness={.5} roughness={.35} /></mesh>
      {/* glass side panel, tinted, with the glow inside */}
      <mesh position={[.112, .26, 0]} rotation-y={Math.PI / 2}><planeGeometry args={[.4, .42]} /><meshStandardMaterial color="#0a0812" transparent opacity={.55} metalness={.8} roughness={.05} /></mesh>
      <mesh position={[.1, .26, 0]} rotation-y={Math.PI / 2}><planeGeometry args={[.36, .38]} /><meshBasicMaterial color={led} transparent opacity={.25} toneMapped={false} /></mesh>
      <group ref={fans}>
        {[.38, .25, .12].map((y) => (
          <mesh key={y} position={[0, y, .232]}><torusGeometry args={[.05, .007, 8, 24]} /><meshBasicMaterial color={led} toneMapped={false} /></mesh>
        ))}
      </group>
      <mesh position={[.07, .47, .232]}><circleGeometry args={[.008, 12]} /><meshBasicMaterial color={new Color("#4ade80").multiplyScalar(2)} toneMapped={false} /></mesh>
    </group>
  );
}

/* ---------------------------------------------------------------- monitor
   A slim desktop monitor built to fit its picture exactly: a thin bezel,
   a back housing, a neck and a base, and a small power light. */
export function Monitor({ position, turn = 0, src, label, onClick, onHover }: {
  position: [number, number, number]; turn?: number; src: string; label: string; onClick: () => void; onHover: OnHover;
}) {
  const w = .62, h = .37, b = .018;
  const led = useLed("#4ade80", 2);
  const at = useMemo(() => new Vector3(position[0], position[1] + .75, position[2]), [position]);
  return (
    <group position={position} rotation-y={turn}>
      <group {...clickable(label, "Click to open the project", at, onClick, onHover)}>
        <mesh position-y={.008} castShadow><boxGeometry args={[.24, .016, .16]} /><meshStandardMaterial color="#1b1824" metalness={.6} roughness={.3} /></mesh>
        <mesh position={[0, .13, -.045]} castShadow><boxGeometry args={[.04, .25, .03]} /><meshStandardMaterial color="#1b1824" metalness={.6} roughness={.3} /></mesh>
        <group position={[0, .23 + h / 2, 0]}>
          <mesh castShadow><boxGeometry args={[w + 2 * b, h + 2 * b + .012, .022]} /><meshStandardMaterial color="#0f0c17" metalness={.4} roughness={.35} /></mesh>
          <mesh position-z={-.025}><boxGeometry args={[w * .55, h * .55, .03]} /><meshStandardMaterial color="#1b1824" metalness={.5} roughness={.4} /></mesh>
          <mesh position={[w / 2 - .02, -h / 2 - .011, .012]}><circleGeometry args={[.004, 8]} /><meshBasicMaterial color={led} toneMapped={false} /></mesh>
        </group>
      </group>
      <Screen src={src} w={w} h={h} position={[0, .23 + h / 2 + .006, .0115]} />
    </group>
  );
}

/* ---------------------------------------------------------------- server rack
   A tall cabinet of rack units, each with a row of status lights that
   blink at their own pace. */
export function ServerRack({ position, turn = 0 }: { position: [number, number, number]; turn?: number }) {
  const lights = useRef<Group>(null);
  const green = useLed("#4ade80", 2.4), blue = useLed("#38bdf8", 2.4), amber = useLed("#fbbf24", 2.4);
  const units = 9;
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    lights.current?.children.forEach((l, i) => { l.visible = Math.sin(t * (1.3 + (i % 7) * .37) + i) > -.35; });
  });
  return (
    <group position={position} rotation-y={turn * Math.PI / 2}>
      <mesh position-y={.9} castShadow><boxGeometry args={[.6, 1.8, .62]} /><meshStandardMaterial color="#0e0b16" metalness={.6} roughness={.35} /></mesh>
      {Array.from({ length: units }, (_, u) => (
        <mesh key={u} position={[0, .2 + u * .17, .312]}><planeGeometry args={[.52, .13]} /><meshStandardMaterial color="#1d1830" metalness={.5} roughness={.4} /></mesh>
      ))}
      <group ref={lights}>
        {Array.from({ length: units * 5 }, (_, i) => {
          const u = Math.floor(i / 5), k = i % 5;
          return (
            <mesh key={i} position={[-.2 + k * .035, .2 + u * .17, .314]}>
              <planeGeometry args={[.016, .016]} />
              <meshBasicMaterial color={k === 4 ? amber : k % 2 ? blue : green} toneMapped={false} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

/* ---------------------------------------------------------------- phones
   A big phone mounted on the wall, showing a mobile app's screen. Used for
   the mobile projects, so they read as apps rather than websites. */
export function WallPhone({ position, turn = 0, src, color, label, onClick, onHover }: {
  position: [number, number, number]; turn?: number; src: string; color: string; label: string; onClick: () => void; onHover: OnHover;
}) {
  const w = .54, h = 1.12;
  const at = useMemo(() => {
    const v = new Vector3(0, h / 2 + .25, 0).applyAxisAngle(new Vector3(0, 1, 0), turn * Math.PI / 2);
    return v.add(new Vector3(...position));
  }, [position, turn]);
  return (
    <group position={position} rotation-y={turn * Math.PI / 2}>
      <Wash position={[0, 0, .005]} size={[w * 2.1, h * 1.7]} color={color} opacity={.5} />
      <group {...clickable(label, "Click to open the app", at, onClick, onHover)}>
        <RoundedBox args={[w, h, .045]} radius={.05} smoothness={4} position-z={.03} castShadow>
          <meshStandardMaterial color="#141020" metalness={.6} roughness={.3} />
        </RoundedBox>
        {/* side buttons */}
        <mesh position={[w / 2 + .004, .18, .03]}><boxGeometry args={[.01, .16, .02]} /><meshStandardMaterial color="#2a2340" /></mesh>
        <mesh position={[w / 2 + .004, -.02, .03]}><boxGeometry args={[.01, .09, .02]} /><meshStandardMaterial color="#2a2340" /></mesh>
      </group>
      <Screen src={src} w={w - .05} h={h - .06} position={[0, 0, .054]} />
      {/* punch-hole camera */}
      <mesh position={[0, h / 2 - .06, .056]}><circleGeometry args={[.012, 16]} /><meshBasicMaterial color="#05030a" /></mesh>
    </group>
  );
}

/* a phone standing on a small stand on a desk */
export function DeskPhone({ position, turn = 0, src }: { position: [number, number, number]; turn?: number; src: string }) {
  return (
    <group position={position} rotation-y={turn * Math.PI / 2}>
      <mesh position={[0, .015, 0]}><boxGeometry args={[.1, .03, .08]} /><meshStandardMaterial color="#2a2340" /></mesh>
      <group position={[0, .13, -.01]} rotation-x={-.22}>
        <RoundedBox args={[.1, .2, .012]} radius={.012} smoothness={3}><meshStandardMaterial color="#141020" /></RoundedBox>
        <Screen src={src} w={.088} h={.185} position={[0, 0, .007]} />
      </group>
    </group>
  );
}

/* ---------------------------------------------------------------- frames on shelves
   A small frame standing on a shelf, leaning back a little. */
export function ShelfFrame({ position, turn = 0, tex, w = .3, h = .22 }: { position: [number, number, number]; turn?: number; tex: Texture; w?: number; h?: number }) {
  return (
    <group position={position} rotation-y={turn * Math.PI / 2}>
      <group position-y={h / 2 + .02} rotation-x={-.12}>
        <mesh castShadow><boxGeometry args={[w + .03, h + .03, .015]} /><meshStandardMaterial color="#1a1326" roughness={.4} /></mesh>
        <mesh position-z={.009}><planeGeometry args={[w, h]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
      </group>
    </group>
  );
}
