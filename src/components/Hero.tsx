"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { hero } from "@/lib/content";

export default function Hero({ entered }: { entered: boolean }) {
  const root = useRef<HTMLElement>(null);

  // Intro após o boot
  useGSAP(
    () => {
      if (!entered) return;
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(".hero-logo", { clipPath: "inset(0 50% 0 50%)", opacity: 0 }, { clipPath: "inset(0 0% 0 0%)", opacity: 1, duration: 1.6 })
        .from(".hero-tag", { y: 12, opacity: 0, duration: 0.8 }, 0.3)
        .from(".hero-sub", { y: 20, opacity: 0, duration: 1 }, 0.5)
        .from(".hero-ctas .btn", { y: 16, opacity: 0, stagger: 0.1, duration: 0.8 }, 0.7)
        .from(".techbar > *", { opacity: 0, stagger: 0.08, duration: 0.6 }, 0.9)
        .to(".techbar-status", { duration: 1, scrambleText: { text: hero.status, chars: "01<>/", speed: 0.5 } }, 1);
    },
    { scope: root, dependencies: [entered] },
  );

  // Saída controlada pelo scroll: marca em paralaxe, cabeça migra para a direita
  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
      });
      tl.to(".hero-logo", { yPercent: -60, scale: 0.9, ease: "none" }, 0)
        .to(".hero-copy", { yPercent: -30, opacity: 0, ease: "none" }, 0);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" id="top">
      <div className="hero-inner">
        <p className="hero-tag mono">
          <span className="dot" /> {hero.tag}
        </p>

        <h1 className="hero-logo">
          <span className="sr-only">RASTRAK</span>
          <span className="logo-solid" aria-hidden />
        </h1>

        <div className="hero-copy">
          <p className="hero-sub">{hero.subtitle}</p>
          <div className="hero-ctas mono">
            <a className="btn btn-accent" href="#transmissoes">[ OUVIR TRANSMISSÕES ]</a>
            <a className="btn" href="#radar">[ ACESSAR RADAR DE CONEXÕES ]</a>
          </div>
        </div>
      </div>

      <div className="techbar mono">
        <span>BPM RANGE: <b>{hero.bpm}</b></span>
        <span className="sep">|</span>
        <span>STATUS: <b className="techbar-status accent">{hero.status}</b></span>
        <span className="techbar-scroll">SCROLL ↓</span>
      </div>
    </section>
  );
}
