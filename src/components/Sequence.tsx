"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export const FRAME_COUNT = 119;
export const frameSrc = (i: number) => `/frames/f_${String(i + 1).padStart(3, "0")}.webp`;

/** Frames compartilhados com o preloader. */
export const frames: HTMLImageElement[] = [];

export function preloadFrames(firstBatch = 24): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const load = (i: number) =>
    new Promise<void>((res) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = img.onerror = () => res();
      img.src = frameSrc(i);
      frames[i] = img;
    });
  const first = Array.from({ length: firstBatch }, (_, i) => load(i));
  // o resto segue em segundo plano
  Promise.all(first).then(() => {
    for (let i = firstBatch; i < FRAME_COUNT; i++) load(i);
  });
  return Promise.all(first).then(() => undefined);
}

export default function Sequence() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const c = canvas.current!;
      const ctx = c.getContext("2d")!;
      const tc = root.current!.querySelector<HTMLElement>(".seq-tc")!;
      const fr = root.current!.querySelector<HTMLElement>(".seq-frame")!;
      const state = { f: 0 };
      let last = -1;

      const size = () => {
        const r = c.getBoundingClientRect();
        const d = Math.min(window.devicePixelRatio, 2);
        c.width = r.width * d;
        c.height = r.height * d;
        last = -1;
        draw();
      };

      const draw = () => {
        let i = Math.round(state.f);
        // usa o frame carregado mais próximo
        while (i > 0 && !(frames[i]?.complete && frames[i].naturalWidth)) i--;
        const img = frames[i];
        if (!img || !img.naturalWidth || i === last) return;
        last = i;
        const s = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
        const w = img.naturalWidth * s;
        const h = img.naturalHeight * s;
        ctx.drawImage(img, (c.width - w) / 2, (c.height - h) / 2, w, h);
        const sec = (i / 4).toFixed(2).padStart(5, "0");
        tc.textContent = `00:00:${sec}`;
        fr.textContent = String(i + 1).padStart(3, "0");
      };

      size();
      window.addEventListener("resize", size);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          id: "seq",
          end: "+=150%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          refreshPriority: 1,
        },
      });
      tl.to(state, { f: FRAME_COUNT - 1, ease: "none", onUpdate: draw, duration: 1 }, 0)
        .fromTo(".seq-panel", { clipPath: "inset(18% 30% 18% 30%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 0.35 }, 0)
        .from(".seq-meta-l > *", { x: -30, opacity: 0, stagger: 0.03, duration: 0.2 }, 0.1)
        .from(".seq-meta-r > *", { x: 30, opacity: 0, stagger: 0.03, duration: 0.2 }, 0.12)
        .fromTo(".seq-quote", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.2 }, 0.55)
        .to(".seq-quote", { opacity: 0, y: -40, duration: 0.15 }, 0.85);

      return () => window.removeEventListener("resize", size);
    },
    { scope: root },
  );

  return (
    <section ref={root} className="seq" aria-label="Registro de pista">
      <div className="seq-meta seq-meta-l mono">
        <span className="dim">SIGNAL_CAPTURE</span>
        <span>LIVE SET // FULL-ON</span>
        <span className="dim">TC <b className="seq-tc">00:00:00.00</b></span>
        <span className="dim">FRAME <b className="seq-frame">001</b>/119</span>
      </div>

      <div className="seq-panel">
        <canvas ref={canvas} className="seq-canvas" />
        <div className="seq-tint" />
        <div className="seq-scan" />
        <span className="seq-corner tl" />
        <span className="seq-corner tr" />
        <span className="seq-corner bl" />
        <span className="seq-corner br" />
      </div>

      <div className="seq-meta seq-meta-r mono">
        <span className="dim">CHANNEL</span>
        <span>REC ● <b className="accent">ON</b></span>
        <span className="dim">WINDOW</span>
        <span>MADRUGADA DENSA</span>
      </div>

      <p className="seq-quote">
        Leitura cirúrgica de pista.<br />
        <span className="accent">Cada virada reorganiza corpo e espaço.</span>
      </p>
    </section>
  );
}
