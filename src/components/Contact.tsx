"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { contact, links } from "@/lib/content";

type Status = "idle" | "sending" | "ok" | "error";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [type, setType] = useState(contact.types[0]);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const on = (e: Event) => setType((e as CustomEvent<string>).detail);
    window.addEventListener("rastrak:connect", on);
    return () => window.removeEventListener("rastrak:connect", on);
  }, []);

  useGSAP(
    () => {
      gsap.from(".ct-head > *, .ct-form > *", {
        y: 30,
        opacity: 0,
        stagger: 0.07,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root },
  );

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      setStatus(r.ok ? "ok" : "error");
      if (r.ok) (e.target as HTMLFormElement).reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <section ref={root} className="section contact" id="contato">
      <div className="wrap ct-grid">
        <header className="ct-head">
          <p className="index mono">{contact.index}</p>
          <h2 className="h2">{contact.headline}</h2>
          <p className="lede">{contact.subtitle}</p>
          <p className="mono dim ct-alt">
            OU DIRETO NO <a href={links.instagram} target="_blank" rel="noreferrer">INSTAGRAM ↗</a>
          </p>
        </header>

        <form className="ct-form" onSubmit={submit}>
          <label>
            <span className="mono">NOME / COLETIVO / AGÊNCIA</span>
            <input name="nome" required autoComplete="name" />
          </label>
          <label>
            <span className="mono">E-MAIL OU WHATSAPP</span>
            <input name="contato" required />
          </label>
          <fieldset>
            <legend className="mono">TIPO DE CONEXÃO</legend>
            <div className="ct-types">
              {contact.types.map((t) => (
                <label key={t} className={`chip mono ${type === t ? "is-active" : ""}`}>
                  <input type="radio" name="tipo" value={t} checked={type === t} onChange={() => setType(t)} />
                  {t}
                </label>
              ))}
            </div>
          </fieldset>
          <label>
            <span className="mono">MENSAGEM / DATA DO EVENTO</span>
            <textarea name="mensagem" rows={5} required />
          </label>
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
          <button className="btn btn-accent mono ct-submit" disabled={status === "sending"}>
            {status === "sending" ? "[ TRANSMITINDO... ]" : "[ ENVIAR SINAL // CONECTAR ]"}
          </button>
          <p className="mono ct-status" aria-live="polite">
            {status === "ok" && <span className="accent">SINAL RECEBIDO. RETORNO EM BREVE.</span>}
            {status === "error" && <span>FALHA NA TRANSMISSÃO. TENTE PELO INSTAGRAM.</span>}
          </p>
        </form>
      </div>
    </section>
  );
}
