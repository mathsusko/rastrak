"use client";

import { useRef, useState } from "react";
import { gsap, scene, useGSAP } from "@/lib/gsap";
import { audio } from "@/lib/audio";

type Props = { onEnter: () => void; preload: () => Promise<void> };

export default function Preloader({ onEnter, preload }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      const counter = { v: 0 };
      const num = root.current!.querySelector<HTMLElement>(".boot-count")!;
      const bar = root.current!.querySelector<HTMLElement>(".boot-bar i")!;
      let loaded = false;
      preload().finally(() => (loaded = true));

      const tl = gsap.timeline();
      tl.from(".boot-line", { opacity: 0, duration: 0.01, stagger: 0.25 })
        .to(".boot-line[data-scramble]", {
          duration: 1.2,
          scrambleText: { text: "{original}", chars: "01", speed: 0.6 },
          stagger: 0.3,
        }, 0)
        .to(counter, {
          v: 100,
          duration: 3.2,
          ease: "power2.inOut",
          onUpdate() {
            // segura em 92% até os frames chegarem
            if (!loaded && counter.v > 92) counter.v = 92;
            const v = Math.round(counter.v);
            num.textContent = String(v).padStart(2, "0");
            bar.style.transform = `scaleX(${v / 100})`;
            scene.reveal = v / 100;
          },
        }, 0.2)
        .add(() => {
          const wait = () => {
            if (!loaded) return gsap.delayedCall(0.1, wait);
            num.textContent = "100";
            bar.style.transform = "scaleX(1)";
            gsap.to(scene, { reveal: 1, duration: 0.4 });
            setReady(true);
          };
          wait();
        });
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (ready) gsap.from(".boot-actions button", { y: 16, opacity: 0, stagger: 0.12, duration: 0.6, ease: "power3.out" });
    },
    { scope: root, dependencies: [ready] },
  );

  const enter = (withAudio: boolean) => {
    if (withAudio) audio.play();
    const tl = gsap.timeline({ onComplete: onEnter });
    tl.to(scene, { glitch: 1, duration: 0.12, yoyo: true, repeat: 3 })
      .to(root.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.9,
        ease: "expo.inOut",
      }, 0.15)
      .set(scene, { glitch: 0 });
  };

  return (
    <div ref={root} className="boot" role="dialog" aria-label="Inicialização">
      <div className="boot-grid" />
      <div className="boot-top mono">
        <p className="boot-line" data-scramble>SYS.TRK // RASTRAK_AUDIO_SYSTEM_V1.0</p>
        <p className="boot-line dim" data-scramble>[INITIALIZING NEURAL FREQUENCY...]</p>
        <p className="boot-line dim">BPM_RANGE 145–148 · MODE FULL-ON / UNDERGROUND</p>
      </div>

      <div className="boot-bottom">
        <div className="boot-meter">
          <span className="boot-count">00</span>
          <span className="mono boot-pct">%</span>
        </div>
        <div className="boot-bar"><i /></div>
        <div className="boot-actions mono" aria-hidden={!ready}>
          {ready && (
            <>
              <button className="btn btn-accent" onClick={() => enter(true)}>[ ENTRAR COM ÁUDIO ]</button>
              <button className="btn" onClick={() => enter(false)}>[ MODO SILENCIOSO ]</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
