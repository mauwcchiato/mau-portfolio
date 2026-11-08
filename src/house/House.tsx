import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, PCFSoftShadowMap } from "three";
import Splash from "../components/Splash";
import { RESUME, RESUME_NAME } from "../components/Sidebar";
import { DownloadIcon } from "../components/icons";
import { useUI } from "../lib/ui";
import type { Hover } from "./furniture";
import HouseScene from "./HouseScene";
import Panel from "./Panel";
import { NAV, roomById, ROOMS, type Target } from "./plan";
import { stick } from "./walk";
import "../styles/house.css";

/* desktop with a decent GPU gets shadows and bloom; phones get the light version */
const hi = typeof window !== "undefined" && window.innerWidth >= 900 && (navigator.hardwareConcurrency || 4) > 4;
const touch = typeof window !== "undefined" && !!window.matchMedia?.("(pointer: coarse)").matches;

/* The on-screen joystick for walking on a phone: drag the knob, it writes
   the direction into the walk rig's stick. */
function Joystick() {
  const base = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = base.current!;
    let id = -1;
    const set = (cx: number, cy: number) => {
      const r = el.getBoundingClientRect(), R = r.width / 2;
      let dx = cx - (r.left + R), dy = cy - (r.top + R);
      const d = Math.hypot(dx, dy);
      if (d > R) { dx *= R / d; dy *= R / d; }
      knob.current!.style.transform = `translate(${dx}px, ${dy}px)`;
      stick.x = dx / R; stick.y = -dy / R;
    };
    const reset = () => { id = -1; stick.x = stick.y = 0; knob.current!.style.transform = ""; };
    const down = (e: PointerEvent) => { id = e.pointerId; el.setPointerCapture(id); set(e.clientX, e.clientY); e.stopPropagation(); };
    const move = (e: PointerEvent) => { if (e.pointerId === id) set(e.clientX, e.clientY); };
    const up = (e: PointerEvent) => { if (e.pointerId === id) reset(); };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => { reset(); el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up); };
  }, []);
  return <div className="g-joy" ref={base} aria-hidden="true"><span ref={knob} /></div>;
}

/* The whole site as a house you can look around, like an architect's
   interactive model: drag to turn it, click a room to step in, click the
   furniture to open that part of the portfolio. Or walk around inside it
   in first person. */
export default function House() {
  const ui = useUI();
  const [room, setRoom] = useState<string | null>(null);
  const [panel, setPanel] = useState<Target | null>(null);
  const [hovered, setHovered] = useState<Hover | null>(null);
  const [ready, setReady] = useState(false);
  const [day, setDay] = useState(false);
  const [walk, setWalk] = useState(false);
  const [spawn, setSpawn] = useState({ id: "living", n: 0 });
  const [walkRoom, setWalkRoom] = useState<string | null>(null);

  const toggleDay = useCallback(() => {
    ui.toast(day ? "Good evening. Lamps on." : "Good morning. Lights off, sun up.");
    setDay(!day);
  }, [ui, day]);

  /* in the model view, choosing a room flies there; walking, it teleports you */
  const goRoom = useCallback((id: string) => {
    if (walk) setSpawn((s) => ({ id, n: s.n + 1 }));
    else setRoom(id);
  }, [walk]);
  const pick = useCallback((id: string) => { if (!walk) setRoom(id); }, [walk]);

  /* opening something also walks you into its room (in the model view) */
  const open = useCallback((t: Target) => {
    const r = ROOMS.find((x) => x.kind === t.kind || (t.kind === "project" && x.id === "office"));
    if (r && !walk) setRoom(r.id);
    setHovered(null);
    setPanel(t);
  }, [walk]);
  const close = useCallback(() => setPanel(null), []);

  const startWalk = useCallback(() => {
    setSpawn((s) => ({ id: room || "living", n: s.n + 1 }));
    setHovered(null);
    setWalk(true);
  }, [room]);
  const stopWalk = useCallback(() => {
    setRoom(walkRoom);
    setWalk(false);
  }, [walkRoom]);

  /* Esc closes the panel, then leaves walking, then steps back out to the whole house */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (ui.overlay || e.key !== "Escape") return;
      if (panel) close(); else if (walk) stopWalk(); else if (room) setRoom(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel, room, walk, ui.overlay, close, stopWalk]);

  const shown = walk ? walkRoom : room;
  const here = shown ? roomById(shown) : null;
  const main: Target | null = here
    ? { id: here.kind === "project" ? "work" : here.id, kind: here.kind, label: here.holds }
    : null;

  const hint = walk
    ? (touch ? "Joystick to walk · drag to look · tap things" : "WASD to walk · Shift to run · drag to look · click things")
    : here ? "Click the furniture · a lamp switches day and night" : "Drag to turn · Scroll to zoom · Click a room";

  return (
    <>
      <Splash onDone={() => setReady(true)} />
      <h1 className="sr-only">Jhan Maurice De Roxas · Portfolio</h1>

      <div className={"g-stage" + (ready ? " is-ready" : "") + (day ? " is-day" : "") + (walk ? " is-walk" : "")} aria-hidden={!!panel}>
        <Canvas shadows={hi ? { type: PCFSoftShadowMap } : false} dpr={[1, hi ? 2 : 1.5]}
          camera={{ fov: 38, near: .1, far: 200, position: [10.5, 15, 16.5] }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => { gl.toneMapping = ACESFilmicToneMapping; gl.toneMappingExposure = 1.1; }}
          onPointerMissed={() => setHovered(null)}>
          <HouseScene room={room} hi={hi} open={open} pick={pick} hover={setHovered} hovered={hovered}
            day={day} toggleDay={toggleDay} walk={walk} spawn={spawn} walkRoom={walkRoom} onWalkRoom={setWalkRoom} />
        </Canvas>
      </div>

      <header className="g-nav">
        <button className="g-nav__brand" type="button" onClick={() => (walk ? stopWalk() : setRoom(null))} aria-label="See the whole house">
          <img src="assets/brand/logo-128.png" alt="" width={36} height={36} />
          <span>MAU<b>W</b>CCHIATO</span>
        </button>
        <p className="g-nav__where" aria-live="polite">{here ? `${here.name} · ${here.holds}` : walk ? "Outside" : "The house"}</p>
        <nav className="g-nav__links" aria-label="Rooms">
          {NAV.map((l) => (
            <button key={l.room} type="button" className={shown === l.room ? "is-on" : undefined} onClick={() => goRoom(l.room)}>{l.label}</button>
          ))}
          <a className="g-nav__cv" href={RESUME} download={RESUME_NAME} aria-label="Download résumé"><DownloadIcon /></a>
        </nav>
      </header>

      <div className="g-hud">
        <p className="g-hud__hint">{hint}</p>
        <div className="g-hud__step">
          {!walk && here && <button type="button" className="icon-btn" onClick={() => setRoom(null)} aria-label="Back to the whole house">⌂</button>}
          {main && <button type="button" className="g-hud__more" onClick={() => open(main)}>{here!.cta}</button>}
          {!walk && !here && <button type="button" className="g-hud__more" onClick={() => setRoom("living")}>Come in</button>}
          {walk
            ? <button type="button" className="g-hud__walk is-on" onClick={stopWalk}>Exit walk</button>
            : <button type="button" className="g-hud__walk" onClick={startWalk}>Walk around</button>}
          <button type="button" className="icon-btn g-hud__sun" onClick={toggleDay} aria-pressed={day}
            aria-label={day ? "Switch to night" : "Switch to daytime"} title={day ? "Night" : "Daytime"}>{day ? "☾" : "☀"}</button>
        </div>
        <button type="button" className="g-hud__classic" onClick={() => ui.setView("classic")}>Classic view</button>
      </div>

      {walk && touch && <Joystick />}
      {walk && <div className="g-cross" aria-hidden="true" />}

      <Panel stop={panel} onClose={close} goTo={goRoom} open={open} />
    </>
  );
}
