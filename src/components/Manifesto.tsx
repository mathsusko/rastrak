"use client";

import { useRef } from "react";
import { gsap, scene, SplitText, useGSAP } from "@/lib/gsap";
import { manifesto } from "@/lib/content";

const BANDS = 10;

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Transição em glitch horizontal limpo: faixas saem para lados alternados
      gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 15%", scrub: 0.8 },
      })
        .to(".band", {
          xPercent: (i) => (i % 2 ? 105 : -105),
          ease: "power3.in",
          stagger: { each: 0.03, from: "center" },
        })
        .to(scene, { glitch: 0.8, duration: 0.15, yoyo: true, repeat: 1 }, 0.1);

      gsap.fromTo(
        ".portrait img",
        { scale: 1.25, yPercent: -6 },
        { scale: 1, yPercent: 6, ease: "none", scrollTrigger: { trigger: ".portrait", start: "top bottom", end: "bottom top", scrub: true } },
      );

      const split = SplitText.create(".mf-headline", { type: "lines,words", mask: "lines" });
      gsap.from(split.words, {
        yPercent: 110,
        stagger: 0.04,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".mf-copy", start: "top 85%" },
      });

      const body = SplitText.create(".mf-text", { type: "lines", mask: "lines" });
      gsap.from(body.lines, {
        yPercent: 100,
        opacity: 0,
        stagger: 0.05,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".mf-copy", start: "top 85%" },
      });

      gsap.from(".spec", {
        opacity: 0,
        y: 20,
        stagger: 0.08,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: ".specs", start: "top 85%" },
      });
      gsap.utils.toArray<HTMLElement>(".spec-v").forEach((el, i) => {
        gsap.to(el, {
          duration: 1.1,
          delay: i * 0.08,
          scrambleText: { text: "{original}", chars: "01", speed: 0.5 },
          scrollTrigger: { trigger: ".specs", start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section manifesto" id="manifesto">
      <div className="bands" aria-hidden>
        {Array.from({ length: BANDS }, (_, i) => (
          <span key={i} className="band" style={{ top: `${(i * 100) / BANDS}%`, height: `${100 / BANDS + 0.2}%` }} />
        ))}
      </div>

      <div className="wrap mf-grid">
        <figure className="portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/portrait-dark.webp" alt="Raphael Ferreira (RASTRAK) em retrato de alto contraste" />
          <figcaption className="mono dim">RAPHAEL FERREIRA // RASTRAK</figcaption>
        </figure>

        <div className="mf-copy">
          <p className="index mono">{manifesto.index}</p>
          <h2 className="mf-headline h2">{manifesto.headline}</h2>
          <p className="mf-text">{manifesto.text}</p>

          <dl className="specs mono">
            {manifesto.specs.map((s) => (
              <div className="spec" key={s.k}>
                <dt>{s.k}</dt>
                <dd className="spec-v">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
