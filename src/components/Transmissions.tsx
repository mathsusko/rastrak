"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { audio } from "@/lib/audio";
import { links, transmissions as tx } from "@/lib/content";
import Spectrum from "./Spectrum";

export default function Transmissions() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => audio?.subscribe(setPlaying), []);

  useGSAP(
    () => {
      gsap.from(".tx-head > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".tx-head", start: "top 80%" },
      });
      gsap.from(".tx-slot", {
        xPercent: -8,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: ".tx-list", start: "top 85%" },
      });
      gsap.from(".spectrum", {
        scaleY: 0,
        transformOrigin: "50% 50%",
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: ".spectrum", start: "top 90%" },
      });
    },
    { scope: root },
  );

  // troca do monitor de vídeo com glitch rápido
  useGSAP(
    () => {
      gsap.fromTo(".tx-monitor video", { clipPath: "inset(0 0 100% 0)", opacity: 0.3 }, { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 0.7, ease: "expo.out" });
    },
    { scope: root, dependencies: [active] },
  );

  const slot = tx.slots[active];

  return (
    <section ref={root} className="section transmissions" id="transmissoes">
      <div className="wrap">
        <header className="tx-head">
          <p className="index mono">{tx.index}</p>
          <h2 className="h2">{tx.headline}</h2>
          <p className="lede">{tx.description}</p>
        </header>

        <Spectrum />

        <div className="tx-grid">
          <ol className="tx-list">
            {tx.slots.map((s, i) => (
              <li key={s.id}>
                <button
                  className={`tx-slot ${i === active ? "is-active" : ""}`}
                  onClick={() => {
                    if (i === active) audio.toggle();
                    else {
                      setActive(i);
                      if (!audio.playing) audio.play();
                    }
                  }}
                  aria-pressed={i === active && playing}
                >
                  <span className="tx-id mono">{s.id}</span>
                  <span className="tx-name">{s.name}</span>
                  <span className="tx-tag mono">[{s.tag}]</span>
                  <span className="tx-state mono">{i === active && playing ? "■ PAUSAR" : "▶ OUVIR"}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="tx-monitor">
            <video key={slot.video} src={slot.video} poster={slot.poster} autoPlay muted loop playsInline />
            <div className="tx-monitor-ui mono">
              <span>{slot.id}</span>
              <span className={playing ? "accent" : "dim"}>{playing ? "● AUDIO LIVE" : "○ STANDBY"}</span>
            </div>
            <a className="tx-open mono" href={slot.href} target="_blank" rel="noreferrer">ABRIR NA PLATAFORMA ↗</a>
          </div>
        </div>

        <nav className="platforms mono" aria-label="Plataformas">
          <a href={links.soundcloud} target="_blank" rel="noreferrer">SOUNDCLOUD ↗</a>
          <a href={links.youtube} target="_blank" rel="noreferrer">YOUTUBE ↗</a>
          <a href={links.instagram} target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
        </nav>
      </div>
    </section>
  );
}
