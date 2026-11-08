import { Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { CameraControls, Html, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, N8AO, Vignette } from "@react-three/postprocessing";
import { Color, MathUtils, SRGBColorSpace, Vector3, type PerspectiveCamera, type Texture } from "three";
import { SITE } from "../data/site";
import type { Project } from "../data/types";
import { WORK } from "../components/Projects";
import { useUI, type ViewItem } from "../lib/ui";
import Building from "./Building";
import { Item, Pic, Screen, Standee, type Hover } from "./furniture";
import { center, FULL_H, ROOMS, roomById, WALL_H, type Target } from "./plan";
import { glyphTexture, menuTexture, pressStartTexture, signTexture, tvTexture } from "./textures";
import { CeilingLights, Panel, Pendants, SlatWall, Trim, Wainscot, Windows } from "./details";
import { Cabinet } from "./arcade";
import { Bowls, Cat, CatBed, COATS } from "./cats";
import { PcTower, ServerRack, ShelfFrame, useLed, WallPhone, Wash } from "./office";
import { DayContext, useDay } from "./daylight";
import { WalkRig } from "./walk";

type Open = (t: Target) => void;
type OnHover = (h: Hover | null) => void;

/* where the camera sits for the whole house, and for each room */
const OVERVIEW: [number, number, number, number, number, number] = [10.5, 15, 16.5, 0, 0, .4];
function roomView(id: string): [number, number, number, number, number, number] {
  const [cx, cz] = center(roomById(id));
  /* high and fairly steep, so the cut walls never block the room */
  return [cx + 2.2, 8.4, cz + 5.4, cx, .3, cz - .1];
}

const projectTarget = (p: Project): Target => ({ id: p.id, kind: "project", label: p.name, project: p });

/* a white dot like the reel's: the main thing to click in a room */
function Dot({ room, at, label, onOpen }: { room: string; at: [number, number, number]; label: string; onOpen: () => void }) {
  const { walk, here } = useDay();
  if (walk && here !== room) return null;
  return (
    <Html position={at} zIndexRange={[30, 0]}>
      <button className="g-pin g-dot" type="button" aria-label={label} onClick={onOpen}><span /></button>
    </Html>
  );
}

/* A lamp you can click: it switches the whole house between night and day. */
function Lamp({ name, position, hover }: { name: string; position: [number, number, number]; hover: OnHover }) {
  const { day, toggle } = useDay();
  return <Item name={name} position={position} label="Lamp" hint={day ? "Click for night" : "Click for daytime"} onClick={toggle} onHover={hover} />;
}

/* ============================================================ ROOMS */
const workAll: Target = { id: "work", kind: "project", label: "Projects" };

/* Web projects live on the office monitors; mobile apps live on phones. */
const isMobile = (p: Project) => !!p.phone && !(p.laptop && p.face !== "phone");
const WEB = WORK.filter((p) => !isMobile(p));
const MOBILE = WORK.filter(isMobile);
/* two pictures for a web project's pair of monitors */
function webShots(p: Project): [string, string] {
  const all = [...(p.laptop || []).map((s) => s.src), ...(p.gallery || []).map((s) => s.src), p.hero].filter(Boolean) as string[];
  return [all[0], all[1] || all[0]];
}
const STATION_LED = ["#22d3ee", "#e879f9", "#8b5cf6"];

/* one workstation: a desk, two monitors on a web project, keyboard and
   mouse, an RGB PC tower, LED strip and bias light, and a chair turned
   aside so the screens stay in view */
function Station({ x, p, led, open, hover }: { x: number; p: Project; led: string; open: Open; hover: OnHover }) {
  const [a, b] = webShots(p);
  const strip = useLed(led, 2.4);
  const go = () => open(projectTarget(p));
  return (
    <group>
      <Wash position={[x, 1.18, -5.355]} size={[2.1, 1.05]} color={led} opacity={.6} />
      <Item name="desk" position={[x, 0, -4.97]} label={p.name} hint="Click to open the project" onClick={go} onHover={hover} />
      <Item name="computerScreen" position={[x - .37, .77, -5.07]} label={p.name} hint="Click to open the project" onClick={go} onHover={hover} />
      <Item name="computerScreen" position={[x + .37, .77, -5.07]} label={p.name} hint="Click to open the project" onClick={go} onHover={hover} />
      <Screen src={a} w={.66} h={.4} position={[x - .37, 1.15, -4.95]} />
      <Screen src={b} w={.66} h={.4} position={[x + .37, 1.15, -4.95]} />
      <Item name="computerKeyboard" position={[x - .05, .77, -4.74]} />
      <Item name="computerMouse" position={[x + .38, .77, -4.74]} />
      <mesh position={[x, .735, -4.59]}><boxGeometry args={[1.42, .012, .012]} /><meshBasicMaterial color={strip} toneMapped={false} /></mesh>
      <PcTower position={[x + .48, 0, -5.02]} color={led} />
      <Item name="chairDesk" position={[x - .5, 0, -4.2]} turn={2.45} />
    </group>
  );
}

function Office({ open, hover }: { open: Open; hover: OnHover }) {
  const { walk } = useDay();
  const { toast } = useUI();
  const H = walk ? FULL_H : WALL_H;
  const cove = useLed("#8b5cf6", 2);
  return (
    <group>
      {/* a deep violet feature wall with an LED line along the top */}
      <Panel pos={[-5.25, H / 2, -5.364]} size={[5.42, H]} color="#2f2552" />
      <mesh position={[-5.25, H - .14, -5.33]}><boxGeometry args={[5.4, .02, .02]} /><meshBasicMaterial color={cove} toneMapped={false} /></mesh>
      <Item name="rugRectangle" position={[-5.3, 0, -2.5]} size={1.15} />

      {/* three workstations, one web project each */}
      {[-7.0, -5.5, -4.0].map((x, k) => WEB[k] && <Station key={x} x={x} p={WEB[k]} led={STATION_LED[k]} open={open} hover={hover} />)}

      {/* the mobile apps, each on a big phone on the wall by the door */}
      {MOBILE.slice(0, 3).map((p, k) => {
        const n = p.phone!.length;
        const src = p.phone![(p.cover || [Math.min(2, n - 1)])[0]].src;
        return <WallPhone key={p.id} position={[[-7.1, -6.35, -5.6][k], 1.45, -.12]} turn={2} src={src}
          color={["#4ade80", "#fb923c", "#38bdf8"][k]} label={p.name} onClick={() => open(projectTarget(p))} onHover={hover} />;
      })}

      <ServerRack position={[-2.92, 0, -.62]} turn={-1} />
      <Item name="bookcaseOpen" position={[-2.9, 0, -4.35]} turn={-1} />
      <Item name="books" position={[-2.92, .26, -4.55]} turn={-1} />
      <Item name="books" position={[-2.92, .74, -4.15]} turn={-1} />
      <Item name="books" position={[-2.92, 1.22, -4.55]} turn={-1} />
      <Lamp name="lampRoundTable" position={[-2.9, 1.76, -4.35]} hover={hover} />
      <Item name="pottedPlant" position={[-7.5, 0, -1.2]} />

      {/* Toshi, asleep in the cat bed under the window */}
      <CatBed position={[-7.35, 0, -2.75]} />
      <Cat name="Toshi" coat={COATS.toshi} pose="sleep" position={[-7.35, .08, -2.75]} turn={1} size={1.3} room="office"
        hint="Shh, sleeping" onHover={hover} onClick={() => toast("Toshi is fast asleep. Shh.")} />

      <Dot room="office" at={[-5.5, 2.05, -4.97]} label="My projects" onOpen={() => open(workAll)} />
    </group>
  );
}

function GameRoom({ open, hover }: { open: Open; hover: OnHover }) {
  const { openGame } = useUI();
  const { walk, day } = useDay();
  const H = walk ? FULL_H : WALL_H;
  const games = SITE.playable;
  const arcade: Target = { id: "arcade", kind: "arcade", label: "Arcade" };
  const poster = useMemo(pressStartTexture, []);
  const neon = useMemo(() => new Color("#e879f9").multiplyScalar(day ? 1.1 : 2), [day]);
  const z = [-1.8, -1.35, -.9, -.45];
  return (
    <group>
      {/* dark feature wall with a neon line across it */}
      <Panel pos={[0, H / 2, -5.364]} size={[4.84, H]} color="#241a42" />
      <mesh position={[0, 1.98, -5.35]}><boxGeometry args={[4.8, .025, .02]} /><meshBasicMaterial color={neon} toneMapped={false} /></mesh>
      <Item name="rugRound" position={[1.05, 0, -3.3]} size={1.3} />
      <Cabinet position={[-2.02, 0, -4.75]} turn={1} title="Kusina Kode" color="#e879f9" art="assets/img/game/kusinakode/kk-logo.png"
        onClick={() => openGame("kusinakode")} onHover={hover} />
      <Cabinet position={[-2.02, 0, -3.92]} turn={1} title="Bean Catcher" color="#22d3ee" tex={glyphTexture("☕")}
        onClick={() => openGame("beancatcher")} onHover={hover} />
      <Item name="cabinetTelevision" position={[1.35, 0, -5.15]} />
      <Item name="televisionModern" position={[1.35, .62, -5.18]} label="All my games" onClick={() => open(arcade)} onHover={hover} />
      <Screen src="assets/img/pixel/cat.png" w={1.12} h={.66} position={[1.35, 1.14, -5.03]} />
      <Item name="speaker" position={[.35, 0, -5.12]} />
      <Item name="speaker" position={[2.25, 0, -5.12]} />
      <Item name="loungeDesignSofa" position={[.75, 0, -1.55]} turn={2} size={.85} />
      <Item name="pillowBlueLong" position={[.75, .36, -1.42]} turn={2} />
      <Item name="bear" position={[2.05, 0, -.5]} turn={-1} />
      <Item name="pillowBlue" position={[-1.25, 0, -.55]} size={1.4} />
      <Item name="televisionVintage" position={[-2.0, 0, -.55]} turn={1} />
      <Pic tex={poster} maxW={.75} maxH={1.05} position={[2.41, 1.45, -4.2]} turn={-1} label="Press start" onClick={() => open(arcade)} onHover={hover} />
      <Pic src="assets/brand/mascot/celebrate.png" maxW={.6} maxH={.85} position={[2.41, 1.45, -1.0]} turn={-1} />
      {/* eight game cartridges, on the stretch of wall between the door and the corner */}
      {games.map((g, k) => {
        const pos: [number, number, number] = [-2.42, k % 2 ? 1.27 : 1.75, z[Math.floor(k / 2)]];
        const play = () => openGame(g.id);
        return g.art && g.art.length
          ? <Pic key={g.id} src={g.art[0]} pixel maxW={.38} maxH={.38} position={pos} turn={1} glow label={g.title} onClick={play} onHover={hover} />
          : <Pic key={g.id} tex={glyphTexture(g.glyph || (g.id === "mines" ? "💎" : "⌨️"))} maxW={.38} maxH={.38} position={pos} turn={1} glow label={g.title} onClick={play} onHover={hover} />;
      })}
      <Dot room="arcade" at={[1.35, 1.95, -5.1]} label="All my games" onOpen={() => open(arcade)} />
    </group>
  );
}

/* Certificates: the three most relevant on the wall, the rest standing on
   the shelves, newest first. */
const CERTS_BY_DATE = SITE.certs.slice().sort((a, b) => (!!b.featured !== !!a.featured ? (b.featured ? 1 : -1) : b.year - a.year));
const WALL_CERTS = CERTS_BY_DATE.slice(0, 3);
const SHELF_CERTS = CERTS_BY_DATE.slice(3, 15);
/* one more on each shelf of the two wide bookcases */
const WIDE_CERTS = CERTS_BY_DATE.slice(15, 21);
const certItem = (c: (typeof CERTS_BY_DATE)[number]): ViewItem => ({
  type: "pdf", src: c.file, title: c.name, sub: c.issuer + " · " + c.date,
  cap: (SITE.certTypes[c.type]?.label || "") + (c.via ? " · via " + c.via : ""), link: c.verify || ""
});

/* a certificate standing in a small frame on a shelf */
function CertStand({ src, position, turn, label, onClick, onHover }: {
  src: string; position: [number, number, number]; turn: number; label: string; onClick: () => void; onHover: OnHover;
}) {
  const tex = useTexture(src, (t) => { (t as Texture).colorSpace = SRGBColorSpace; }) as Texture;
  return (
    <group onClick={(e) => { e.stopPropagation(); if (e.delta < 6) onClick(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; onHover({ label, at: new Vector3(position[0], position[1] + .5, position[2]), hint: "Click to view" }); }}
      onPointerOut={() => { document.body.style.cursor = ""; onHover(null); }}>
      <ShelfFrame position={position} turn={turn} tex={tex} w={.3} h={.21} />
    </group>
  );
}

function Library({ open, hover }: { open: Open; hover: OnHover }) {
  const { openLightbox, toast } = useUI();
  const certs: Target = { id: "certs", kind: "certs", label: "Certificates" };
  const all = CERTS_BY_DATE.map(certItem);
  const view = (id: string) => openLightbox(all, CERTS_BY_DATE.findIndex((c) => c.id === id), "Certificates");
  /* shelf slots on the two open bookcases: three shelves, two frames each */
  const slots: [number, number, number][] = [];
  [-4.4, -1.2].forEach((z) => [.26, .74, 1.22].forEach((y) => [-.18, .18].forEach((dz) => slots.push([7.6, y, z + dz]))));
  return (
    <group>
      <Item name="rugRound" position={[5.3, 0, -2.7]} size={1.4} />
      <Item name="bookcaseClosedWide" position={[3.4, 0, -5.12]} label="Certificates" onClick={() => open(certs)} onHover={hover} />
      <Item name="bookcaseClosedWide" position={[7.15, 0, -5.12]} label="Certificates" onClick={() => open(certs)} onHover={hover} />
      <Item name="bookcaseOpen" position={[7.62, 0, -4.4]} turn={-1} />
      <Item name="bookcaseOpen" position={[7.62, 0, -1.2]} turn={-1} />
      {SHELF_CERTS.map((c, k) => slots[k] && (
        <Suspense key={c.id} fallback={null}>
          <CertStand src={`assets/img/certs/thumbs/${c.id}.webp`} position={slots[k]} turn={-1} label={c.name} onClick={() => view(c.id)} onHover={hover} />
        </Suspense>
      ))}
      {/* the wide bookcases: a row of books on every shelf, one certificate standing among them */}
      {[3.4, 7.15].map((x, b) => [.14, .62, 1.1].map((y, r) => {
        const c = WIDE_CERTS[b * 3 + r];
        const certAt = (b + r) % 2 ? .48 : -.48;
        return (
          <group key={`${x}${y}`}>
            {[-.55, -.2, .15, .5].filter((dx) => Math.abs(dx - certAt) > .2).map((dx, k) => (
              <Item key={dx} name="books" position={[x + dx, y, -5.08]} turn={k % 2 ? 0 : 2} />
            ))}
            {c && (
              <Suspense fallback={null}>
                <CertStand src={`assets/img/certs/thumbs/${c.id}.webp`} position={[x + certAt, y, -5.06]} turn={0} label={c.name} onClick={() => view(c.id)} onHover={hover} />
              </Suspense>
            )}
          </group>
        );
      }))}
      {/* books and a plant on the tops */}
      <Item name="books" position={[7.62, 1.76, -4.5]} turn={-1} />
      <Item name="plantSmall1" position={[7.62, 1.76, -1.2]} />
      <Item name="books" position={[3.1, 1.58, -5.15]} size={1.2} />
      <Item name="plantSmall2" position={[3.75, 1.58, -5.15]} />
      <Item name="books" position={[7.0, 1.58, -5.15]} size={1.2} />
      {/* reading corner */}
      <Item name="loungeChairRelax" position={[5.35, 0, -2.3]} turn={2} />
      <Item name="pillowLong" position={[5.35, .45, -2.1]} turn={2} />
      <Item name="sideTable" position={[6.4, 0, -2.5]} turn={2} size={.7} />
      <Lamp name="lampRoundTable" position={[6.4, .54, -2.5]} hover={hover} />
      <Item name="pottedPlant" position={[7.5, 0, -.35]} />
      {/* Chippie, sitting on the library rug */}
      <Cat name="Chippie" coat={COATS.chippie} pose="sit" position={[6.1, 0, -3.55]} turn={-.6} size={1.25} room="library"
        hint="Say hi to Chippie" onHover={hover} onClick={() => toast("Chippie purrs.")} />
      {/* the three most relevant, framed on the wall */}
      {WALL_CERTS.map((c, k) => (
        <Pic key={c.id} src={`assets/img/certs/thumbs/${c.id}.webp`} maxW={.62} maxH={.44}
          position={[2.59, 1.55, [-4.45, -3.65, -1.15][k]]} turn={1}
          label={c.name} onClick={() => view(c.id)} onHover={hover} />
      ))}
      <Dot room="library" at={[3.4, 1.95, -5.1]} label="All certificates" onOpen={() => open(certs)} />
    </group>
  );
}

function Living({ open, hover }: { open: Open; hover: OnHover }) {
  const { toast } = useUI();
  const { walk } = useDay();
  const about: Target = { id: "about", kind: "about", label: "About me" };
  const tv = useMemo(tvTexture, []);
  return (
    <group>
      <SlatWall x={-7.87} z0={1.3} z1={4.5} />
      <Item name="rugRectangle" position={[-6, 0, 2.9]} turn={1} size={1.15} />
      <Item name="cabinetTelevision" position={[-7.55, 0, 2.9]} turn={1} />
      <Item name="televisionModern" position={[-7.57, .62, 2.9]} turn={1} label="About me" onClick={() => open(about)} onHover={hover} />
      <Screen tex={tv} w={1.12} h={.63} position={[-7.43, 1.14, 2.9]} rotation={[0, Math.PI / 2, 0]} />
      <Item name="plantSmall1" position={[-7.55, .62, 3.55]} />
      <Item name="speakerSmall" position={[-7.6, 0, 1.95]} turn={1} />
      <Item name="speakerSmall" position={[-7.6, 0, 3.85]} turn={1} />
      <Item name="tableCoffee" position={[-5.9, 0, 2.9]} turn={1} />
      <Cat name="Seiko" coat={COATS.seiko} pose="sit" position={[-6.95, 0, 1.55]} turn={1.4} size={1.3} room="living"
        hint="She's keeping watch" onHover={hover} onClick={() => toast("Seiko blinks at you slowly. That's a cat hello.")} />
      <Item name="books" position={[-5.9, .46, 2.75]} turn={1} />
      <Item name="loungeSofa" position={[-4.55, 0, 2.9]} turn={-1} />
      <Item name="pillowLong" position={[-4.4, .45, 2.55]} turn={-1} />
      <Item name="pillowBlueLong" position={[-4.4, .45, 3.3]} turn={-1} />
      <Item name="loungeChair" position={[-6, 0, 4.7]} turn={2} />
      <Lamp name="lampRoundFloor" position={[-7.45, 0, .6]} hover={hover} />
      <Item name="pottedPlant" position={[-7.45, 0, 5]} />
      <Item name="pottedPlant" position={[-1.5, 0, .6]} />
      <Item name="rugDoormat" position={[-3.4, 0, 5.05]} />
      <Item name="coatRackStanding" position={[-1.5, 0, 5.05]} />
      {walk && <Item name="ceilingFan" position={[-5.6, FULL_H - .27, 2.9]} />}
      <Pic src="assets/img/profile.jpg?v=2" maxW={.8} maxH={1.02} position={[-6.6, 1.4, .09]} glow label="About me" onClick={() => open(about)} onHover={hover} />
      <Pic src="assets/img/leadership/ambassador.jpg" maxW={.95} maxH={.7} position={[-2.6, 1.45, .09]} label="About me" onClick={() => open(about)} onHover={hover} />
      <Pic src="assets/brand/mascot/wave.png" maxW={.55} maxH={.8} position={[-1.09, 1.45, 1.1]} turn={-1} />
      <Pic src="assets/brand/logo-512.png" maxW={.65} maxH={.65} position={[-1.09, 1.45, 4.25]} turn={-1} />
      <Dot room="living" at={[-7.45, 1.9, 2.9]} label="About me" onOpen={() => open(about)} />
    </group>
  );
}

function Hall({ open, hover }: { open: Open; hover: OnHover }) {
  const journey: Target = { id: "journey", kind: "journey", label: "Milestones" };
  const photos = SITE.leadership.photos;
  const spots: { pos: [number, number, number]; turn: number }[] = [
    { pos: [-.91, 1.6, 1.05], turn: 1 }, { pos: [-.91, 1.6, 4.3], turn: 1 },
    { pos: [1.91, 1.6, 1.05], turn: -1 }, { pos: [1.91, 1.6, 4.3], turn: -1 }
  ];
  return (
    <group>
      <Wainscot x={-.92} z0={.08} z1={2.05} side={1} />
      <Wainscot x={-.92} z0={3.15} z1={5.37} side={1} />
      <Wainscot x={1.92} z0={.08} z1={2.05} side={-1} />
      <Wainscot x={1.92} z0={3.15} z1={5.37} side={-1} />
      <Item name="rugRectangle" position={[.5, 0, 2.7]} turn={1} size={.85} />
      {photos.slice(0, 4).map((p, k) => (
        <Pic key={p.src} src={p.src} maxW={.8} maxH={.7} position={spots[k].pos} turn={spots[k].turn}
          label={p.title} onClick={() => open(journey)} onHover={hover} />
      ))}
      <Item name="benchCushion" position={[.5, 0, 5.05]} />
      <Item name="pottedPlant" position={[-.6, 0, 5.1]} />
      <Item name="plantSmall1" position={[1.6, 0, .45]} size={1.6} />
      <Dot room="hall" at={[.5, 1.5, 4.9]} label="Milestones" onOpen={() => open(journey)} />
    </group>
  );
}

function Kitchen({ open, hover }: { open: Open; hover: OnHover }) {
  const { toast } = useUI();
  const { walk } = useDay();
  const contact: Target = { id: "contact", kind: "contact", label: "Contact" };
  const sign = useMemo(() => signTexture("SAY HI"), []);
  const menu = useMemo(menuTexture, []);
  return (
    <group>
      {/* tiled backsplash either side of the window over the sink */}
      <Panel pos={[7.865, 1.17, .77]} size={[.95, .55]} turn={-1} tiles />
      <Panel pos={[7.865, 1.17, 3.25]} size={[1.58, .55]} turn={-1} tiles />
      <Item name="kitchenCabinet" position={[7.6, 0, .86]} turn={-1} />
      <Item name="kitchenSink" position={[7.6, 0, 1.86]} turn={-1} />
      <Item name="kitchenCabinet" position={[7.6, 0, 2.72]} turn={-1} />
      <Item name="kitchenStove" position={[7.6, 0, 3.58]} turn={-1} />
      <Item name="kitchenFridgeLarge" position={[7.55, 0, 4.75]} turn={-1} />
      <Item name="kitchenMicrowave" position={[7.65, .9, .86]} turn={-1} />
      <Item name="toaster" position={[7.65, .9, 2.85]} turn={-1} />
      <Item name="kitchenBlender" position={[7.7, .9, 2.55]} turn={-1} />
      {walk && <>
        <Item name="kitchenCabinetUpper" position={[7.78, 1.48, .86]} turn={-1} />
        <Item name="kitchenCabinetUpperDouble" position={[7.78, 1.48, 2.82]} turn={-1} />
        <Item name="hoodModern" position={[7.72, 1.6, 3.58]} turn={-1} />
      </>}
      {[4.2, 5.06, 5.92].map((x) => <Item key={x} name="kitchenBar" position={[x, 0, 2.6]} turn={2} />)}
      <Item name="kitchenCoffeeMachine" position={[5.06, .84, 2.55]} turn={2} label="Contact me" onClick={() => open(contact)} onHover={hover} />
      {[4.2, 5.06, 5.92].map((x) => <Item key={"s" + x} name="stoolBar" position={[x, 0, 3.5]} turn={2} />)}
      <Pendants xs={[4.2, 5.06, 5.92]} z={2.6} y={1.78} />
      <Item name="pottedPlant" position={[2.5, 0, 5]} />
      <Item name="trashcan" position={[6.9, 0, .45]} />
      <Bowls position={[6.85, 0, 3.95]} turn={-1} />
      <Cat name="Kousei" coat={COATS.kousei} pose="loaf" position={[6.45, 0, 4.45]} turn={-.6} size={1.35} room="kitchen"
        hint="He's waiting for snacks" onHover={hover} onClick={() => toast("Kousei would like a snack, please.")} />
      <Lamp name="lampSquareTable" position={[5.92, .84, 2.55]} hover={hover} />
      <Standee src="assets/brand/mascot/coffee.webp" h={1.45} position={[3, 0, 4.2]} label="Contact me" onClick={() => open(contact)} onHover={hover} />
      <Screen tex={sign} w={1.4} h={.35} position={[2.09, 1.6, 1.35]} rotation={[0, Math.PI / 2, 0]} />
      <Pic tex={menu} maxW={1.15} maxH={.8} position={[3.15, 1.5, .09]} label="Today's menu" onClick={() => open(contact)} onHover={hover} />
      <Pic src="assets/brand/mascot/coffee.png" maxW={.5} maxH={.8} position={[6.75, 1.5, .09]} />
      <Dot room="kitchen" at={[5.06, 1.55, 2.55]} label="Contact me" onOpen={() => open(contact)} />
    </group>
  );
}

/* ============================================================ LIGHT
   Night: the moon from the back left and a warm lamp in each room.
   Day: the sun from the front right, a bright sky, lamps off. */
function Lights({ hi }: { hi: boolean }) {
  const { day } = useDay();
  const lamps: { at: [number, number, number]; c: string; i: number }[] = [
    { at: [-5.2, 1.9, -2.7], c: "#ffcf8a", i: 9 },
    { at: [0, 1.9, -2.9], c: "#f0abfc", i: 10 },
    { at: [5.2, 1.9, -2.8], c: "#ffcf8a", i: 9 },
    { at: [-4.6, 1.9, 2.8], c: "#ffd29a", i: 10 },
    { at: [.5, 1.9, 2.7], c: "#c4b5fd", i: 6 },
    { at: [5, 1.9, 2.6], c: "#ffd9a6", i: 9 }
  ];
  return (
    <>
      <ambientLight intensity={day ? .75 : .32} color={day ? "#fff8ee" : "#8f7fe0"} />
      <hemisphereLight args={day ? ["#cfe8ff", "#b8a98c", .9] : ["#4c3a9a", "#120c22", .45]} />
      <directionalLight position={day ? [14, 22, 12] : [-14, 20, -10]} intensity={day ? 2.6 : .9} color={day ? "#fff0d8" : "#c8c2ff"} castShadow={hi}
        shadow-mapSize={[2048, 2048]} shadow-bias={-.0004}
        shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} shadow-camera-far={60} />
      {!day && lamps.map((l, k) => <pointLight key={k} position={l.at} color={l.c} intensity={l.i} distance={7.5} decay={1.6} />)}
    </>
  );
}

/* ============================================================ SCENE */
export default function HouseScene({ room, hi, open, pick, hover, hovered, day, toggleDay, walk, spawn, walkRoom, onWalkRoom }: {
  room: string | null; hi: boolean; open: Open; pick: (id: string) => void; hover: OnHover; hovered: Hover | null;
  day: boolean; toggleDay: () => void;
  walk: boolean; spawn: { id: string; n: number }; walkRoom: string | null; onWalkRoom: (id: string | null) => void;
}) {
  const daylight = useMemo(() => ({ day, toggle: toggleDay, walk, here: walkRoom }), [day, toggleDay, walk, walkRoom]);
  const { camera } = useThree();
  const sky = day ? "#bcd6f2" : "#0a0716";
  const controls = useRef<CameraControls>(null);

  /* fly to the room (or back out to the whole house) */
  useEffect(() => {
    if (walk) return;
    const v = room ? roomView(room) : OVERVIEW;
    controls.current?.setLookAt(...v, true);
  }, [room, walk]);

  /* walking uses a wider lens; stepping out hands the camera back to the
     orbit controls from wherever you stood, then pulls up to the model */
  useEffect(() => {
    const cam = camera as PerspectiveCamera;
    cam.fov = walk ? 70 : 38;
    cam.updateProjectionMatrix();
    if (!walk && controls.current) {
      const ahead = new Vector3(0, 0, -3).applyQuaternion(cam.quaternion).add(cam.position);
      controls.current.setLookAt(cam.position.x, cam.position.y, cam.position.z, ahead.x, ahead.y, ahead.z, false);
      const v = room ? roomView(room) : OVERVIEW;
      controls.current.setLookAt(...v, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walk, camera]);

  const labels: ReactNode = ROOMS.map((r) => {
    const [cx, cz] = center(r);
    return (
      <Html key={r.id} position={[cx, 2.5, cz]} zIndexRange={[25, 0]}>
        <button type="button" className={"g-pin g-room" + (room === r.id ? " is-on" : "")} onClick={() => pick(r.id)}>
          <b>{r.name}</b><small>{r.holds}</small>
        </button>
      </Html>
    );
  });

  return (
    <DayContext.Provider value={daylight}>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[sky, 34, 80]} />
      {walk && <WalkRig spawn={spawn} onRoom={onWalkRoom} />}
      <CameraControls ref={controls} makeDefault={!walk} enabled={!walk} minDistance={3.5} maxDistance={32}
        minPolarAngle={.25} maxPolarAngle={MathUtils.degToRad(72)} smoothTime={.55} draggingSmoothTime={.12}
        truckSpeed={0} />
      <Lights hi={hi} />
      <Building onPick={pick} />
      <Trim />
      <Windows />
      <CeilingLights />
      <Office open={open} hover={hover} />
      <GameRoom open={open} hover={hover} />
      <Library open={open} hover={hover} />
      <Living open={open} hover={hover} />
      <Hall open={open} hover={hover} />
      <Kitchen open={open} hover={hover} />
      {!room && !walk && labels}
      {hovered && (
        <Html position={hovered.at} zIndexRange={[40, 0]}>
          <div className="g-pin g-tip">{hovered.label}<span>{hovered.hint || "Click to open"}</span></div>
        </Html>
      )}
      {hi && (
        <EffectComposer multisampling={0}>
          <N8AO aoRadius={.55} intensity={day ? 2.4 : 1.8} distanceFalloff={.6} halfRes />
          <Bloom mipmapBlur intensity={day ? .45 : .75} luminanceThreshold={1} luminanceSmoothing={.15} />
          <Vignette offset={.3} darkness={day ? .3 : .55} />
        </EffectComposer>
      )}
    </DayContext.Provider>
  );
}
