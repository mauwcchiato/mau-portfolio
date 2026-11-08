import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { type ThreeEvent } from "@react-three/fiber";
import { AdditiveBlending, Box3, Color, Group, Mesh, MeshStandardMaterial, NearestFilter, SRGBColorSpace, Vector3, type Material, type Texture } from "three";
import { glowTexture } from "./textures";
import { useDay } from "./daylight";

/* Kenney's furniture is modelled at about half a metre per unit. */
const SCALE = 2;

/* Kenney's bright toy colours, swapped for a cozy night palette:
   walnut wood, violet velvet, warm lamp glass that glows. */
const PALETTE: Record<string, string> = {
  wood: "#7a5238", woodDark: "#4f3426",
  carpet: "#6d4bb8", carpetDarker: "#46307e", carpetBlue: "#3a2f7d", carpetWhite: "#ece7f6",
  metal: "#bdb7cc", metalMedium: "#6d667e", metalDark: "#262131",
  plant: "#3f9e6e", fur: "#b98a63", _defaultMat: "#ebe6f3", glass: "#9fb3d9"
};

function recolor(src: Material): Material {
  const m = (src as MeshStandardMaterial).clone();
  const hex = PALETTE[m.name];
  if (hex) m.color = new Color(hex);
  if (m.name === "lamp") {
    m.color = new Color("#ffe1b0");
    m.emissive = new Color("#ffc47a");
    m.emissiveIntensity = 2.2;
  }
  if (m.name === "glass") { m.transparent = true; m.opacity = .45; }
  m.roughness = m.name.startsWith("metal") ? .35 : .75;
  m.metalness = m.name.startsWith("metal") ? .6 : 0;
  m.userData.emissive = m.emissive.clone();
  m.userData.emissiveIntensity = m.emissiveIntensity;
  return m;
}

/* what the tooltip shows; hint replaces "Click to open" */
export interface Hover { label: string; at: Vector3; hint?: string }

interface ItemProps {
  name: string;
  position: [number, number, number];
  /* quarter turns: 1 = 90° */
  turn?: number;
  size?: number;
  /* clickable furniture gets a tooltip and a violet highlight on hover */
  label?: string;
  hint?: string;
  onClick?: () => void;
  onHover?: (h: Hover | null) => void;
  children?: ReactNode;
}

/* One piece of Kenney furniture, recoloured, standing centred on its
   footprint at position. */
function ItemModel({ name, position, turn = 0, size = 1, label, hint, onClick, onHover, children }: ItemProps) {
  const { scene } = useGLTF(`assets/house/${name}.glb`);
  const { day } = useDay();
  const group = useRef<Group>(null);
  const [hot, setHot] = useState(false);

  const { obj, height } = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const mesh = o as Mesh;
      if (mesh.isMesh) {
        mesh.material = Array.isArray(mesh.material) ? mesh.material.map(recolor) : recolor(mesh.material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    const box = new Box3().setFromObject(c);
    const mid = box.getCenter(new Vector3());
    c.position.set(-mid.x, -box.min.y, -mid.z);
    return { obj: c, height: box.max.y - box.min.y };
  }, [scene]);

  /* hover: a violet glow on every surface. Lamp shades glow at night and
     go dark in the daytime. */
  useEffect(() => {
    obj.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((mat) => {
        const m = mat as MeshStandardMaterial;
        if (hot) { m.emissive = new Color("#7c3aed"); m.emissiveIntensity = .55; }
        else {
          m.emissive = (m.userData.emissive as Color).clone();
          m.emissiveIntensity = m.name === "lamp" && day ? .05 : m.userData.emissiveIntensity as number;
        }
      });
    });
  }, [hot, obj, day]);

  const s = SCALE * size;
  const events = onClick ? {
    onClick: (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); if (e.delta < 6) onClick(); },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHot(true);
      document.body.style.cursor = "pointer";
      if (label && onHover && group.current) {
        const at = group.current.getWorldPosition(new Vector3());
        at.y += height * s + .35;
        onHover({ label, at, hint });
      }
    },
    onPointerOut: () => { setHot(false); document.body.style.cursor = ""; onHover?.(null); }
  } : {};

  return (
    <group ref={group} position={position} rotation-y={turn * Math.PI / 2}>
      <group scale={s} {...events}><primitive object={obj} /></group>
      {children}
    </group>
  );
}

export function Item(p: ItemProps) {
  return <Suspense fallback={null}><ItemModel {...p} /></Suspense>;
}

/* ---------------------------------------------------------- pictures */
interface PicProps {
  src?: string;
  tex?: Texture;
  maxW: number;
  maxH: number;
  position: [number, number, number];
  turn?: number;
  pixel?: boolean;
  glow?: boolean;
  label?: string;
  onClick?: () => void;
  onHover?: (h: Hover | null) => void;
}

/* a picture fitted into maxW × maxH, in a thin dark frame with a lilac
   edge. The picture is unlit, so screenshots look like lit screens. */
function Framed({ tex, maxW, maxH, position, turn = 0, glow, label, onClick, onHover }: PicProps & { tex: Texture }) {
  const halo = useMemo(glowTexture, []);
  const img = tex.image as { width: number; height: number };
  const a = img.width / img.height;
  let w = maxW, h = w / a;
  if (h > maxH) { h = maxH; w = h * a; }
  const ref = useRef<Group>(null);
  const [hot, setHot] = useState(false);
  const events = onClick ? {
    onClick: (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); if (e.delta < 6) onClick(); },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation(); setHot(true); document.body.style.cursor = "pointer";
      if (label && onHover && ref.current) { const at = ref.current.getWorldPosition(new Vector3()); at.y += h / 2 + .3; onHover({ label, at }); }
    },
    onPointerOut: () => { setHot(false); document.body.style.cursor = ""; onHover?.(null); }
  } : {};
  return (
    <group ref={ref} position={position} rotation-y={turn * Math.PI / 2}>
      {glow && (
        <mesh position-z={-.01}>
          <planeGeometry args={[(w + .1) * 1.7, (h + .1) * 1.7]} />
          <meshBasicMaterial map={halo} color="#8b5cf6" transparent opacity={hot ? .8 : .28} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      )}
      <mesh position-z={.015} castShadow>
        <boxGeometry args={[w + .07, h + .07, .03]} />
        <meshStandardMaterial color={hot ? "#7c3aed" : "#1a1326"} roughness={.4} metalness={.4} />
      </mesh>
      <mesh position-z={.032} {...events}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}

function PicLoad(p: PicProps & { src: string }) {
  const tex = useTexture(p.src, (t) => {
    const x = t as Texture;
    x.colorSpace = SRGBColorSpace;
    x.anisotropy = 8;
    if (p.pixel) { x.magFilter = NearestFilter; x.minFilter = NearestFilter; }
  }) as Texture;
  return <Framed {...p} tex={tex} />;
}

export function Pic(p: PicProps) {
  if (p.tex) return <Framed {...p} tex={p.tex} />;
  return <Suspense fallback={null}><PicLoad {...p} src={p.src!} /></Suspense>;
}

/* a picture on a screen (TV, monitor, arcade): just the glowing image */
export function Screen({ src, tex, w, h, position, rotation = [0, 0, 0] }: { src?: string; tex?: Texture; w: number; h: number; position: [number, number, number]; rotation?: [number, number, number] }) {
  if (tex) return <mesh position={position} rotation={rotation}><planeGeometry args={[w, h]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>;
  return <Suspense fallback={null}><ScreenLoad src={src!} w={w} h={h} position={position} rotation={rotation} /></Suspense>;
}
function ScreenLoad({ src, w, h, position, rotation }: { src: string; w: number; h: number; position: [number, number, number]; rotation: [number, number, number] }) {
  const tex = useTexture(src, (t) => { (t as Texture).colorSpace = SRGBColorSpace; }) as Texture;
  return <mesh position={position} rotation={rotation}><planeGeometry args={[w, h]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>;
}

/* a cut-out picture standing upright (the coffee mascot) */
export function Standee({ src, h, position, turn = 0, onClick, onHover, label }: { src: string; h: number; position: [number, number, number]; turn?: number; onClick?: () => void; onHover?: (h: Hover | null) => void; label?: string }) {
  return <Suspense fallback={null}><StandeeLoad {...{ src, h, position, turn, onClick, onHover, label }} /></Suspense>;
}
function StandeeLoad({ src, h, position, turn = 0, onClick, onHover, label }: { src: string; h: number; position: [number, number, number]; turn?: number; onClick?: () => void; onHover?: (h: Hover | null) => void; label?: string }) {
  const tex = useTexture(src, (t) => { (t as Texture).colorSpace = SRGBColorSpace; }) as Texture;
  const img = tex.image as { width: number; height: number };
  const w = h * img.width / img.height;
  return (
    <mesh position={[position[0], position[1] + h / 2, position[2]]} rotation-y={turn * Math.PI / 2} castShadow
      onClick={(e) => { e.stopPropagation(); if (e.delta < 6) onClick?.(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; if (label) onHover?.({ label, at: new Vector3(position[0], position[1] + h + .3, position[2]) }); }}
      onPointerOut={() => { document.body.style.cursor = ""; onHover?.(null); }}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} transparent alphaTest={.05} toneMapped={false} />
    </mesh>
  );
}

/* start fetching every model as soon as the house loads, all at once,
   instead of one by one as each piece first appears */
useGLTF.preload([
  "bear", "benchCushion", "bookcaseClosedWide", "bookcaseOpen", "bookcaseOpenLow", "books", "cabinetTelevision", "cardboardBoxOpen",
  "ceilingFan", "chairCushion", "chairDesk", "coatRack", "coatRackStanding", "computerKeyboard", "computerMouse", "computerScreen",
  "desk", "deskCorner", "hoodModern", "kitchenBar", "kitchenBarEnd", "kitchenBlender", "kitchenCabinet", "kitchenCabinetUpper",
  "kitchenCabinetUpperDouble", "kitchenCoffeeMachine", "kitchenFridgeLarge", "kitchenMicrowave", "kitchenSink", "kitchenStove", "lampRoundFloor", "lampRoundTable",
  "lampSquareCeiling", "lampSquareFloor", "lampSquareTable", "lampWall", "laptop", "loungeChair", "loungeChairRelax", "loungeDesignChair",
  "loungeDesignSofa", "loungeSofa", "loungeSofaCorner", "pillow", "pillowBlue", "pillowBlueLong", "pillowLong", "plantSmall1",
  "plantSmall2", "plantSmall3", "pottedPlant", "radio", "rugDoormat", "rugRectangle", "rugRound", "rugRounded",
  "sideTable", "sideTableDrawers", "speaker", "speakerSmall", "stoolBar", "tableCoffee", "tableCoffeeGlass", "tableRound",
  "televisionModern", "televisionVintage", "toaster", "trashcan"
].map((n) => `assets/house/${n}.glb`));
