import { useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3, type Group } from "three";
import { useDay } from "./daylight";
import type { Hover } from "./furniture";
import { clickable } from "./office";

type OnHover = (h: Hover | null) => void;

/* How a cat looks: coat colours, eye colour, optional patches, and how
   round they are (chonk 1 is a regular cat). */
export interface Coat {
  fur: string;
  /* stripes, ear backs and tail */
  dark: string;
  /* chest, muzzle and paws */
  light: string;
  eyes: string;
  /* extra blobs of colour on the back, for calico and patched coats */
  patches?: string;
  chonk?: number;
}

export const COATS: Record<string, Coat> = {
  toshi: { fur: "#a99fc4", dark: "#8a7fae", light: "#ece7f6", eyes: "#7dd3fc" },
  seiko: { fur: "#f6f2ec", dark: "#e58a3a", light: "#ffffff", eyes: "#a3e635", patches: "#ec8f3e" },
  kousei: { fur: "#ef8a3c", dark: "#c4621f", light: "#fde4c8", eyes: "#fbbf24", chonk: 1.4 },
  chippie: { fur: "#f7f5fb", dark: "#ddd7e8", light: "#ffffff", eyes: "#60a5fa" }
};

/* Head with ears, eyes (open or shut), muzzle and nose. Faces +z. */
function Head({ c, asleep }: { c: Coat; asleep: boolean }) {
  const mat = (col: string) => <meshStandardMaterial color={col} roughness={.9} />;
  return (
    <group>
      <mesh castShadow><sphereGeometry args={[.1, 20, 16]} />{mat(c.patches ?? c.fur)}</mesh>
      {/* a white blaze down the face */}
      <mesh position={[0, -.015, .045]} scale={[.75, .85, .7]}><sphereGeometry args={[.08, 16, 12]} />{mat(c.light)}</mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * .058, .075, -.01]} rotation-z={-s * .4}>
          <mesh><coneGeometry args={[.038, .08, 4]} />{mat(c.dark)}</mesh>
          <mesh position={[0, -.004, .011]}><coneGeometry args={[.021, .054, 4]} />{mat("#f9a8d4")}</mesh>
        </group>
      ))}
      {[-1, 1].map((s) => asleep ? (
        <mesh key={"e" + s} position={[s * .038, .014, .092]} rotation-z={Math.PI}>
          <torusGeometry args={[.014, .0035, 6, 12, Math.PI]} /><meshBasicMaterial color="#2a2140" />
        </mesh>
      ) : (
        <group key={"e" + s} position={[s * .04, .018, .088]}>
          <mesh scale={[1, 1.2, .5]}><sphereGeometry args={[.021, 12, 8]} /><meshBasicMaterial color={c.eyes} /></mesh>
          <mesh position-z={.008} scale={[.4, 1.1, .4]}><sphereGeometry args={[.017, 10, 8]} /><meshBasicMaterial color="#14101e" /></mesh>
          <mesh position={[-.006, .008, .012]}><sphereGeometry args={[.004, 6, 4]} /><meshBasicMaterial color="#ffffff" /></mesh>
        </group>
      ))}
      <mesh position={[0, -.012, .1]} rotation-x={Math.PI}><coneGeometry args={[.011, .011, 3]} /><meshBasicMaterial color="#f472b6" /></mesh>
    </group>
  );
}

/* A cat in one of three poses:
   sleep: curled in a ball, eyes shut, tail wrapped round, z's floating up
   sit:   upright on the haunches, tail curled at the feet, looking about
   loaf:  lying with paws tucked under, the classic cat loaf
   Built facing +z; turn rotates in quarter turns. */
export function Cat({ name, coat, pose, position, turn = 0, size = 1, hint, room, onClick, onHover }: {
  name: string; coat: Coat; pose: "sleep" | "sit" | "loaf"; position: [number, number, number]; turn?: number; size?: number;
  hint: string; room: string; onClick: () => void; onHover: OnHover;
}) {
  const { walk, here } = useDay();
  const body = useRef<Group>(null), head = useRef<Group>(null), tail = useRef<Group>(null);
  const c = coat, w = c.chonk ?? 1;
  const mat = (col: string) => <meshStandardMaterial color={col} roughness={.9} />;
  /* a little offset per cat so they don't breathe in step */
  const phase = useMemo(() => name.length * 1.7, [name]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase, breath = Math.sin(t * 1.4);
    if (body.current) body.current.scale.set(1 + breath * .015, 1 + breath * .04, 1);
    if (pose === "sleep") {
      if (head.current) head.current.position.y = .1 + breath * .006;
      if (tail.current) tail.current.rotation.y = Math.sin(t * .5) * .06;
    } else {
      /* awake: look around now and then, flick the tail */
      if (head.current) head.current.rotation.y = Math.sin(t * .4) * .5;
      if (tail.current) tail.current.rotation.y = Math.sin(t * 1.3) * .25;
    }
  });

  const at = useMemo(() => new Vector3(position[0], position[1] + .55 * size, position[2]), [position, size]);
  const stripes = [-.06, 0, .06];

  return (
    <group position={position} rotation-y={turn * Math.PI / 2} scale={size}>
      <group {...clickable(name, hint, at, onClick, onHover)}>
        {pose === "sleep" && (
          <>
            <group ref={body} position={[0, .1, -.03]}>
              <mesh scale={[1.25 * w, .72, 1.05]} castShadow><sphereGeometry args={[.15, 24, 16]} />{mat(c.fur)}</mesh>
              {c.patches && <mesh position={[-.05, .06, -.02]} scale={[1.1, .55, .9]}><sphereGeometry args={[.1, 16, 12]} />{mat(c.patches)}</mesh>}
              {stripes.map((x) => (
                <mesh key={x} position={[x, .085, -.02]} rotation-z={Math.PI / 2} scale={[1, 1, 1.6]}><torusGeometry args={[.035, .008, 6, 12, Math.PI]} />{mat(c.dark)}</mesh>
              ))}
            </group>
            <group ref={tail} position={[0, .03, 0]}>
              <mesh rotation-x={Math.PI / 2} position={[.02, 0, .03]}><torusGeometry args={[.17 * w, .03, 8, 24, Math.PI * 1.15]} />{mat(c.dark)}</mesh>
            </group>
            {[-.05, .05].map((x) => <mesh key={x} position={[x + .06, .03, .15]} scale={[1, .6, 1.4]}><sphereGeometry args={[.034, 12, 8]} />{mat(c.light)}</mesh>)}
            <group ref={head} position={[.07, .1, .13]} rotation={[.35, -.35, .25]}><Head c={c} asleep /></group>
          </>
        )}

        {pose === "sit" && (
          <>
            <group ref={body}>
              <mesh position={[0, .17, -.02]} scale={[w, 1.15, 1.1]} castShadow><sphereGeometry args={[.14, 20, 16]} />{mat(c.fur)}</mesh>
              <mesh position={[0, .13, .08]} scale={[.8 * w, .9, .6]}><sphereGeometry args={[.1, 16, 12]} />{mat(c.light)}</mesh>
              {c.patches && <mesh position={[.05, .24, -.08]} scale={[.9, 1, .8]}><sphereGeometry args={[.09, 14, 10]} />{mat(c.patches)}</mesh>}
            </group>
            {[-.05, .05].map((x) => <mesh key={x} position={[x, .03, .12]} scale={[1, .7, 1.4]}><sphereGeometry args={[.035, 12, 8]} />{mat(c.light)}</mesh>)}
            <group ref={head} position={[0, .38, .02]}><Head c={c} asleep={false} /></group>
            <group ref={tail} position={[0, .03, -.12]}>
              <mesh rotation={[Math.PI / 2, 0, .4]} position={[.08, 0, .05]}><torusGeometry args={[.13, .028, 8, 18, Math.PI * .9]} />{mat(c.dark)}</mesh>
            </group>
          </>
        )}

        {pose === "loaf" && (
          <>
            <group ref={body}>
              <mesh position={[0, .11, -.02]} scale={[w, .8, 1.45]} castShadow><sphereGeometry args={[.14, 22, 16]} />{mat(c.fur)}</mesh>
              {/* tabby stripes: thin dark bands lying across the back */}
              {stripes.map((z) => (
                <mesh key={z} position={[0, .19, z * 1.6 - .02]} scale={[1.05 * w, .3, .22]}><sphereGeometry args={[.13, 18, 10]} />{mat(c.dark)}</mesh>
              ))}
              {c.patches && <mesh position={[-.04, .17, -.08]} scale={[1, .5, 1.2]}><sphereGeometry args={[.09, 14, 10]} />{mat(c.patches)}</mesh>}
            </group>
            {[-.045, .045].map((x) => <mesh key={x} position={[x * w, .025, .17]} scale={[1, .55, 1.2]}><sphereGeometry args={[.033, 12, 8]} />{mat(c.light)}</mesh>)}
            <group ref={head} position={[0, .23, .17]}><Head c={c} asleep={false} /></group>
            <group ref={tail} position={[0, .03, -.15]}>
              <mesh rotation={[Math.PI / 2, 0, -.2]} position={[.1 * w, 0, .06]}><torusGeometry args={[.14 * w, .028, 8, 18, Math.PI * .8]} />{mat(c.dark)}</mesh>
            </group>
          </>
        )}
      </group>

      {pose === "sleep" && (!walk || here === room) && (
        <Html position={[.12, .32, .1]} zIndexRange={[20, 0]} pointerEvents="none">
          <div className="g-zzz" aria-hidden="true"><i>z</i><i>z</i><i>z</i></div>
        </Html>
      )}
    </group>
  );
}

/* a round, plush cat bed: a padded rim around a soft cushion */
export function CatBed({ position, color = "#5b45a0" }: { position: [number, number, number]; color?: string }) {
  return (
    <group position={position}>
      <mesh position-y={.09} rotation-x={Math.PI / 2} castShadow receiveShadow>
        <torusGeometry args={[.3, .1, 14, 32]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      <mesh position-y={.045} receiveShadow>
        <cylinderGeometry args={[.32, .34, .07, 32]} />
        <meshStandardMaterial color="#d9cff0" roughness={1} />
      </mesh>
    </group>
  );
}

/* food and water bowls (Kousei's favourite spot) */
export function Bowls({ position, turn = 0 }: { position: [number, number, number]; turn?: number }) {
  return (
    <group position={position} rotation-y={turn * Math.PI / 2}>
      {[[-.13, "#a16207"], [.13, "#7dd3fc"]].map(([x, fill]) => (
        <group key={x as number} position={[x as number, 0, 0]}>
          <mesh position-y={.035} castShadow><cylinderGeometry args={[.09, .065, .07, 24]} /><meshStandardMaterial color="#e879f9" roughness={.4} /></mesh>
          <mesh position-y={.066}><cylinderGeometry args={[.075, .075, .005, 24]} /><meshStandardMaterial color={fill as string} roughness={fill === "#7dd3fc" ? .1 : .9} /></mesh>
        </group>
      ))}
      <mesh position-y={.002} rotation-x={-Math.PI / 2}><planeGeometry args={[.5, .28]} /><meshStandardMaterial color="#3b2d55" roughness={1} /></mesh>
    </group>
  );
}
