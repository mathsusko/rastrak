"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, scene, ScrollTrigger } from "@/lib/gsap";
import { audio } from "@/lib/audio";
import { startDirector } from "@/lib/director";
import HeadScene from "./HeadScene";
import Hud from "./Hud";
import Preloader from "./Preloader";
import Hero from "./Hero";
import Sequence, { preloadFrames } from "./Sequence";
import Manifesto from "./Manifesto";
import Transmissions from "./Transmissions";
import Radar from "./Radar";
import Presskit from "./Presskit";
import Cta from "./Cta";
import Footer from "./Footer";

const nav = [
  { href: "#manifesto", label: "01 MANIFESTO" },
  { href: "#transmissoes", label: "02 TRANSMISSÕES" },
  { href: "#radar", label: "03 RADAR" },
  { href: "#presskit", label: "04 PRESSKIT" },
  { href: "#whatsapp", label: "05 BOOKING" },
];

export default function Experience() {
  const [entered, setEntered] = useState(false);
  const [booting, setBooting] = useState(true);
  const [playing, setPlaying] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => audio?.subscribe(setPlaying), []);

  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const lenis = new Lenis({ lerp: 0.085, anchors: { offset: 0 } });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  // o preloader reverte suas tweens ao desmontar; fixa o estado final da cabeça
  useEffect(() => {
    if (!entered) return;
    scene.reveal = 1;
    scene.glitch = 0;
    const stop = startDirector();
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return stop;
  }, [entered]);

  const onEnter = () => {
    setBooting(false);
    setEntered(true);
    lenisRef.current?.start();
  };

  return (
    <>
      <HeadScene />
      <div className="grain" aria-hidden />
      <Hud entered={entered} />

      <header className={`nav mono ${entered ? "is-in" : ""}`}>
        <a href="#top" className="nav-brand" aria-label="RASTRAK — início">
          <span className="logo-solid" aria-hidden />
        </a>
        <nav className="nav-links" aria-label="Seções">
          {nav.map((n) => (
            <a key={n.href} href={n.href}>{n.label}</a>
          ))}
        </nav>
        <button className={`nav-audio ${playing ? "is-on" : ""}`} onClick={() => audio.toggle()} aria-label={playing ? "Desligar áudio" : "Ligar áudio"}>
          <span className="eq" aria-hidden><i /><i /><i /><i /></span>
          {playing ? "AUDIO ON" : "AUDIO OFF"}
        </button>
      </header>

      <main className={entered ? "is-entered" : "is-booting"}>
        <Hero entered={entered} />
        <Sequence />
        <Manifesto />
        <Transmissions />
        <Radar />
        <Presskit />
        <Cta />
        <Footer />
      </main>

      {booting && <Preloader onEnter={onEnter} preload={() => preloadFrames()} />}
    </>
  );
}
