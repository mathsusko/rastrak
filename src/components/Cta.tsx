"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { cta, igDirect, waLink } from "@/lib/content";

export default function Cta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const split = SplitText.create(".cta-headline", { type: "lines,words", mask: "lines" });
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 75%" } });
      tl.from(".cta-line", { scaleX: 0, duration: 1.2, ease: "expo.inOut" })
        .from(split.words, { yPercent: 110, stagger: 0.05, duration: 1, ease: "expo.out" }, 0.2)
        .from(".cta-sub, .cta-index", { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, 0.5)
        .from(".cta-btn, .cta-ig", { opacity: 0, scale: 0.92, duration: 0.8, ease: "expo.out" }, 0.7);
      gsap.to(".cta-ring", { scale: 1.5, opacity: 0, duration: 2.4, repeat: -1, ease: "power2.out", stagger: 0.8 });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section cta" id="whatsapp">
      <div className="cta-line" aria-hidden />
      <div className="wrap cta-inner">
        <p className="index mono cta-index">{cta.index}</p>
        <h2 className="h2 cta-headline">{cta.headline}</h2>
        <p className="cta-sub">{cta.text}</p>
        <a className="cta-btn mono" href={waLink()} target="_blank" rel="noreferrer">
          <span className="cta-ring" aria-hidden />
          <span className="cta-ring" aria-hidden />
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.3Z" />
          </svg>
          {cta.button}
        </a>
        <a className="cta-ig mono" href={igDirect} target="_blank" rel="noreferrer">
          {cta.buttonIg}
        </a>
      </div>
    </section>
  );
}
