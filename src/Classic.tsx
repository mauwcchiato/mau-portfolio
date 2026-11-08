import { useEffect, useState } from "react";
import About from "./components/About";
import Certs from "./components/Certs";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Games from "./components/Games";
import Guide from "./components/Guide";
import Hero from "./components/Hero";
import Journey from "./components/Journey";
import Projects from "./components/Projects";
import Sidebar from "./components/Sidebar";
import Sky from "./components/Sky";
import Splash from "./components/Splash";
import Stack from "./components/Stack";
import { reveals, scrollFx } from "./lib/motion";

/* The classic scrolling site: one section after another. Shown when the
   3D house can't run, or when a visitor picks it. */
export default function Classic() {
  const [ready, setReady] = useState(false);

  /* scroll-linked motion runs over the whole page once it has rendered */
  useEffect(() => {
    const a = reveals(), b = scrollFx();
    return () => { a(); b(); };
  }, []);

  useEffect(() => { if (ready) document.body.classList.add("is-ready"); }, [ready]);

  return (
    <>
      <Splash onDone={() => setReady(true)} />
      <a className="skip" href="#main">Skip to content</a>
      <Sky />
      <Sidebar />

      <main id="main">
        <Hero ready={ready} />
        <About />
        <Stack />
        <Projects />
        <Games />
        <Certs />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <Guide ready={ready} />
    </>
  );
}
