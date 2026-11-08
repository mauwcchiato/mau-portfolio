import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import Classic from "./Classic";
import Overlays from "./components/Overlays";
import { calm, store } from "./lib/env";
import type { View } from "./lib/ui";

/* the 3D house is a separate chunk, so the classic view never downloads Three.js */
const House = lazy(() => import("./house/House"));

function canWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

/* The house is the default. The classic page is used when WebGL is
   missing, when the visitor asks for reduced motion, or when they pick it
   (remembered for next time). */
function firstView(): View {
  const saved = store("local").get("jm-view");
  if (saved === "classic" || saved === "house") return saved === "house" && !canWebGL() ? "classic" : saved;
  return canWebGL() && !calm ? "house" : "classic";
}

export default function App() {
  const [view, setViewState] = useState<View>(firstView);

  const setView = useCallback((v: View) => {
    if (v === "house" && !canWebGL()) return;
    store("local").set("jm-view", v);
    window.scrollTo(0, 0);
    setViewState(v);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("is-house", view === "house");
  }, [view]);

  return (
    <Overlays view={view} setView={setView}>
      {view === "house"
        ? <Suspense fallback={<div className="g-boot" />}><House /></Suspense>
        : <Classic />}
    </Overlays>
  );
}
