import { useMemo } from "react";
import { type ThreeEvent } from "@react-three/fiber";
import { Color, ExtrudeGeometry, Shape, Vector3, type Texture } from "three";
import { useDay } from "./daylight";
import type { Hover } from "./furniture";
import { Screen } from "./furniture";
import { marqueeTexture, sideArtTexture } from "./textures";

/* The side profile of an upright arcade cabinet, in metres: depth (front
   is +z) against height. Extruded across the cabinet's width. */
function profile() {
  const s = new Shape();
  s.moveTo(-.36, 0);          /* back, floor */
  s.lineTo(.34, 0);           /* front, floor */
  s.lineTo(.34, .92);         /* up the front to the control panel */
  s.lineTo(.44, 1.0);         /* the panel juts out */
  s.lineTo(.34, 1.12);        /* panel top, sloping back */
  s.lineTo(.24, 1.16);
  s.lineTo(.1, 1.62);         /* the screen leans back */
  s.lineTo(.2, 1.66);         /* marquee overhang */
  s.lineTo(.2, 1.86);
  s.lineTo(-.36, 1.86);
  s.lineTo(-.36, 0);
  return s;
}

const W = .7;

/* A full arcade cabinet: shaped sides with stripe art and neon edging, a
   lit marquee with the game's name, the screen, a joystick, buttons and a
   coin door. Clicking anywhere on it starts the game. */
export function Cabinet({ position, turn = 0, title, color, art, tex, onClick, onHover }: {
  position: [number, number, number]; turn?: number; title: string; color: string; art?: string; tex?: Texture;
  onClick: () => void; onHover: (h: Hover | null) => void;
}) {
  const { day } = useDay();
  const shape = useMemo(profile, []);
  const body = useMemo(() => new ExtrudeGeometry(shape, { depth: W - .04, bevelEnabled: false }), [shape]);
  const side = useMemo(() => new ExtrudeGeometry(shape, { depth: .02, bevelEnabled: true, bevelThickness: .006, bevelSize: .012, bevelSegments: 2 }), [shape]);
  const art2 = useMemo(() => sideArtTexture(color), [color]);
  const marquee = useMemo(() => marqueeTexture(title.toUpperCase(), color), [title, color]);
  const neon = useMemo(() => new Color(color).multiplyScalar(day ? 1.05 : 1.7), [color, day]);
  const lit = day ? 1.1 : 1.6;

  const ev = {
    onClick: (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); if (e.delta < 6) onClick(); },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation(); document.body.style.cursor = "pointer";
      onHover({ label: title, at: new Vector3(position[0], 2.2, position[2]), hint: "Click to play" });
    },
    onPointerOut: () => { document.body.style.cursor = ""; onHover(null); }
  };

  /* the slope of the screen face, for placing the picture on it */
  const screenTilt = Math.atan2(.14, .46);
  /* the control panel rises toward the back; buttons stand along its normal */
  const panelTilt = Math.atan2(.12, .1);

  return (
    <group position={position} rotation-y={turn * Math.PI / 2}>
      <group {...ev}>
        {/* body: the profile extruded across the width, sitting between the sides */}
        <mesh geometry={body} rotation-y={-Math.PI / 2} position={[W / 2 - .02, 0, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#1b1430" roughness={.55} />
        </mesh>
        {[-1, 1].map((sd) => (
          <group key={sd}>
            <mesh geometry={side} rotation-y={-Math.PI / 2} position={[sd * W / 2 + (sd > 0 ? .02 : 0), 0, 0]} castShadow>
              <meshStandardMaterial color="#ffffff" map={art2} roughness={.5} />
            </mesh>
            {/* neon T-moulding down the front edge */}
            <mesh position={[sd * (W / 2 + .004), .46, .345]}><boxGeometry args={[.012, .92, .012]} /><meshBasicMaterial color={neon} toneMapped={false} /></mesh>
          </group>
        ))}
        {/* marquee */}
        <mesh position={[0, 1.76, .205]}><planeGeometry args={[W - .04, .18]} /><meshBasicMaterial map={marquee} color={new Color(1, 1, 1).multiplyScalar(lit)} toneMapped={false} /></mesh>
        {/* screen bezel */}
        <mesh position={[0, 1.39, .175]} rotation-x={-screenTilt}><planeGeometry args={[W - .06, .44]} /><meshStandardMaterial color="#05030a" roughness={.2} /></mesh>
        {/* control panel with joystick and buttons */}
        <group position={[0, 1.06, .39]} rotation-x={panelTilt - Math.PI / 2}>
          <mesh><planeGeometry args={[W - .04, .15]} /><meshStandardMaterial color="#2a2145" roughness={.4} side={2} /></mesh>
        </group>
        <group position={[-.17, 1.07, .37]}>
          <mesh position-y={.05}><cylinderGeometry args={[.008, .008, .1, 8]} /><meshStandardMaterial color="#222" metalness={.8} /></mesh>
          <mesh position-y={.11}><sphereGeometry args={[.028, 16, 12]} /><meshStandardMaterial color="#ef4444" roughness={.3} /></mesh>
        </group>
        {[[.02, "#facc15"], [.09, "#22d3ee"], [.16, "#f472b6"], [.055, "#a3e635"]].map(([x, c], k) => (
          <mesh key={k} position={[x as number, 1.07 + (k === 3 ? .04 : 0), k === 3 ? .36 : .395]} rotation-x={panelTilt}>
            <cylinderGeometry args={[.021, .021, .02, 16]} />
            <meshBasicMaterial color={c as string} />
          </mesh>
        ))}
        {/* coin door with two glowing slots */}
        <mesh position={[0, .45, .342]}><planeGeometry args={[.26, .3]} /><meshStandardMaterial color="#120c20" metalness={.5} roughness={.4} /></mesh>
        {[-.055, .055].map((x) => (
          <mesh key={x} position={[x, .5, .344]}><planeGeometry args={[.05, .08]} /><meshBasicMaterial color={new Color("#fb923c").multiplyScalar(day ? 1 : 1.8)} toneMapped={false} /></mesh>
        ))}
      </group>
      {/* the game on screen */}
      {art
        ? <Screen src={art} w={W - .14} h={.36} position={[0, 1.39, .18]} rotation={[-screenTilt, 0, 0]} />
        : tex ? <Screen tex={tex} w={W - .14} h={.36} position={[0, 1.39, .18]} rotation={[-screenTilt, 0, 0]} /> : null}
    </group>
  );
}
