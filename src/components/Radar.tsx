"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { radar, waLink } from "@/lib/content";

// posições determinísticas dos alvos no radar (ângulo, raio)
const blipPos = (i: number, n: number, tab: number) => {
  const a = ((i / n) * Math.PI * 2 + tab * 0.9 + 0.4) % (Math.PI * 2);
  const r = 0.32 + ((i * 37 + tab * 13) % 50) / 100;
  return { x: 50 + Math.cos(a) * r * 46, y: 50 + Math.sin(a) * r * 46 };
};

export default function Radar() {
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState(0);
  const t = radar.tabs[tab];

  useGSAP(
    () => {
      gsap.to(".sweep", { rotation: 360, duration: 4, repeat: -1, ease: "none", svgOrigin: "50 50" });
      gsap.from(".radar-head > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".radar-head", start: "top 80%" },
      });
      gsap.from(".radar-scope", {
        scale: 0.6,
        opacity: 0,
        rotate: -30,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ".radar-scope", start: "top 85%" },
      });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      gsap.fromTo(".blip", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.07, duration: 0.5, ease: "back.out(3)", transformOrigin: "50% 50%" });
      gsap.fromTo(".radar-panel > *", { opacity: 0, x: 20 }, { opacity: 1, x: 0, stagger: 0.05, duration: 0.5, ease: "power3.out" });
      gsap.fromTo(".radar-panel .rp-title", { opacity: 1 }, { duration: 0.6, scrambleText: { text: t.short, chars: "01/<>", speed: 0.6 } });
    },
    { scope: root, dependencies: [tab] },
  );

  const connect = () => {
    const msg = `Olá, Raphael! Vi o radar da RASTRAK (${radar.tabs[tab].short}) e quero conversar.`;
    window.open(waLink(msg), "_blank", "noopener");
  };

  return (
    <section ref={root} className="section radar" id="radar">
      <div className="wrap">
        <header className="radar-head">
          <p className="index mono">{radar.index}</p>
          <h2 className="h2">{radar.headline}</h2>
          <p className="lede">{radar.subtitle}</p>
        </header>

        <div className="radar-tabs mono" role="tablist">
          {radar.tabs.map((x, i) => (
            <button key={x.id} role="tab" aria-selected={i === tab} className={i === tab ? "is-active" : ""} onClick={() => setTab(i)}>
              {x.label}
            </button>
          ))}
        </div>

        <div className="radar-grid">
          <div className="radar-scope">
            <svg viewBox="0 0 100 100" aria-hidden>
              <defs>
                <linearGradient id="sw" x1="0" x2="1">
                  <stop offset="0" stopColor="#00FF66" stopOpacity="0" />
                  <stop offset="1" stopColor="#00FF66" stopOpacity=".35" />
                </linearGradient>
              </defs>
              {[46, 34.5, 23, 11.5].map((r) => (
                <circle key={r} cx="50" cy="50" r={r} className="ring" />
              ))}
              <line x1="4" y1="50" x2="96" y2="50" className="ring" />
              <line x1="50" y1="4" x2="50" y2="96" className="ring" />
              <g className="sweep">
                <path d="M50 50 L96 50 A46 46 0 0 0 82.5 17.5 Z" fill="url(#sw)" />
                <line x1="50" y1="50" x2="96" y2="50" stroke="#00FF66" strokeWidth=".3" />
              </g>
              {t.targets.map((name, i) => {
                const p = blipPos(i, t.targets.length, tab);
                return (
                  <g key={`${tab}-${name}`} className="blip" transform={`translate(${p.x} ${p.y})`}>
                    <circle r="1.1" fill="#00FF66" />
                    <circle r="2.6" className="blip-ring" />
                    <text x="3.4" y="1" className="blip-label">{name.toUpperCase()}</text>
                  </g>
                );
              })}
            </svg>
            <span className="mono dim scope-label">SCAN // {String(tab + 1).padStart(2, "0")}</span>
          </div>

          <div className="radar-panel" role="tabpanel">
            <p className="mono dim">EIXO DO FUNIL</p>
            <h3 className="rp-title">{t.short}</h3>
            <p className="mono dim">HIPÓTESE ATUAL</p>
            <p className="rp-text">{t.hypothesis}</p>
            <p className="mono dim">ALVOS NO RADAR</p>
            <ul className="rp-targets mono">
              {t.targets.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="mono dim">OBJETIVO</p>
            <p className="rp-text">{t.objective}</p>
            <button className="btn btn-accent mono" onClick={connect}>[ INICIAR CONEXÃO DIRETA ]</button>
          </div>
        </div>
      </div>
    </section>
  );
}
