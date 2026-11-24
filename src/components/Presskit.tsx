"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { presskit as pk } from "@/lib/content";

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="btn mono"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }}
    >
      {done ? "[ COPIADO ✓ ]" : label}
    </button>
  );
}

export default function Presskit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".pk-head > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: ".pk-head", start: "top 80%" },
      });
      gsap.from(".pk-block", {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pk-grid", start: "top 80%" },
      });
      // faixa de fotos em scroll horizontal suave
      gsap.to(".pk-strip-track", {
        xPercent: -35,
        ease: "none",
        scrollTrigger: { trigger: ".pk-strip", start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="section presskit" id="presskit">
      <div className="wrap">
        <header className="pk-head">
          <p className="index mono">{pk.index}</p>
          <h2 className="h2">{pk.headline}</h2>
        </header>
      </div>

      <div className="pk-strip" aria-label="Fotos oficiais">
        <div className="pk-strip-track">
          {[...pk.photos, ...pk.photos].map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={`/img/${p}.webp`} alt={i < pk.photos.length ? "RASTRAK — foto oficial" : ""} loading="lazy" />
          ))}
        </div>
      </div>

      <div className="wrap pk-grid">
        <article className="pk-block">
          <p className="mono dim">01 // LOGOTIPOS & IDENTIDADE</p>
          <div className="pk-logos">
            <span className="logo-solid" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo-mark.png" alt="" className="pk-mark" />
          </div>
          <p className="pk-note mono">Assinatura angular (sólida e contorno) + cabeça codificada. PNG transparente.</p>
          <a className="btn btn-accent mono" href="/presskit/RASTRAK_logotipos.zip" download>[ BAIXAR LOGOS ]</a>
        </article>

        <article className="pk-block">
          <p className="mono dim">02 // FOTOS OFICIAIS</p>
          <div className="pk-thumbs">
            {pk.photos.slice(0, 6).map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p} src={`/img/${p}.webp`} alt="" loading="lazy" />
            ))}
          </div>
          <p className="pk-note mono">7 arquivos · JPG alta resolução</p>
          <a className="btn btn-accent mono" href="/presskit/RASTRAK_fotos-oficiais.zip" download>[ BAIXAR FOTOS ]</a>
        </article>

        <article className="pk-block">
          <p className="mono dim">03 // BIO RÁPIDA — LINE-UP</p>
          <p className="pk-bio">{pk.bio}</p>
          <CopyButton text={pk.bio} label="[ COPIAR BIO ]" />
        </article>

        <article className="pk-block">
          <p className="mono dim">04 // RIDER TÉCNICO</p>
          <ul className="pk-rider mono">
            {pk.rider.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <CopyButton text={pk.rider.map((r) => `• ${r}`).join("\n")} label="[ COPIAR RIDER ]" />
        </article>
      </div>
    </section>
  );
}
