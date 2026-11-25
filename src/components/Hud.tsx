"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

// Moldura HUD fixa em volta da viewport (borda com recortes angulares,
// colchetes nos cantos e réguas laterais) + indicador da seção atual.

const sections = [
  { id: "top", n: "00", label: "SIGNAL" },
  { id: "manifesto", n: "01", label: "MANIFESTO" },
  { id: "transmissoes", n: "02", label: "TRANSMISSÕES" },
  { id: "radar", n: "03", label: "RADAR" },
  { id: "presskit", n: "04", label: "PRESSKIT" },
  { id: "whatsapp", n: "05", label: "CANAL DIRETO" },
];

function framePath(w: number, h: number, m: number, mobile: boolean) {
  const c = mobile ? 10 : 16; // chanfro dos cantos
  const nw = mobile ? 54 : 120; // meia largura do recorte de cima/baixo
  const nd = mobile ? 5 : 8; // profundidade do recorte
  const sh = mobile ? 60 : 110; // meia altura do recorte lateral
  const cx = w / 2;
  const cy = h / 2;
  const L = m, R = w - m, T = m, B = h - m;
  return [
    `M${L + c},${T}`,
    `H${cx - nw - nd}`, `L${cx - nw},${T + nd}`, `H${cx + nw}`, `L${cx + nw + nd},${T}`,
    `H${R - c}`, `L${R},${T + c}`,
    `V${cy - sh - nd}`, `L${R - nd},${cy - sh}`, `V${cy + sh}`, `L${R},${cy + sh + nd}`,
    `V${B - c}`, `L${R - c},${B}`,
    `H${cx + nw + nd}`, `L${cx + nw},${B - nd}`, `H${cx - nw}`, `L${cx - nw - nd},${B}`,
    `H${L + c}`, `L${L},${B - c}`,
    `V${cy + sh + nd}`, `L${L + nd},${cy + sh}`, `V${cy - sh}`, `L${L},${cy - sh - nd}`,
    `V${T + c}`, "Z",
  ].join(" ");
}

export default function Hud({ entered }: { entered: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0, mobile: false });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight, mobile: window.innerWidth < 760 });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  // seção ativa
  useEffect(() => {
    if (!entered) return;
    const sts = sections.map((s, i) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(i),
      }),
    );
    return () => {
      sts.forEach((s) => s.kill());
    };
  }, [entered]);

  // desenho da moldura na abertura
  useGSAP(
    () => {
      if (!size.w) return;
      const path = root.current!.querySelector<SVGPathElement>(".hud-frame")!;
      const len = path.getTotalLength();
      gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" });
      gsap.from(".hud-corner, .hud-ticks", { opacity: 0, duration: 0.6, stagger: 0.08, delay: 1 });
    },
    { scope: root, dependencies: [size.w > 0] },
  );

  // troca do número da seção com scramble
  useGSAP(
    () => {
      gsap.fromTo(".hud-index", { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out" });
      gsap.to(".hud-tab-label", { duration: 0.6, scrambleText: { text: `${sections[active].n} // ${sections[active].label}`, chars: "01/<>", speed: 0.6 } });
    },
    { scope: root, dependencies: [active] },
  );

  const { w, h, mobile } = size;
  const m = mobile ? 6 : 10;
  const s = sections[active];

  return (
    <div ref={root} className={`hud ${entered ? "is-in" : ""} `} aria-hidden>
      {w > 0 && (
        <svg className="hud-svg" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          <path className="hud-frame" d={framePath(w, h, m, mobile)} />
          {/* colchetes verdes nos cantos */}
          {[
            [m + 6, m + 6, 1, 1],
            [w - m - 6, m + 6, -1, 1],
            [m + 6, h - m - 6, 1, -1],
            [w - m - 6, h - m - 6, -1, -1],
          ].map(([x, y, sx, sy], i) => (
            <path key={i} className="hud-corner" d={`M${x},${y + sy * 14} V${y} H${x + sx * 14}`} />
          ))}
          {/* réguas laterais */}
          {!mobile &&
            [m + 14, w - m - 14].map((x, side) => (
              <g key={side} className="hud-ticks">
                {Array.from({ length: 15 }, (_, i) => {
                  const y = h / 2 - 84 + i * 12;
                  const len = i % 5 === 0 ? 10 : 5;
                  return <line key={i} x1={x} x2={x + (side ? -len : len)} y1={y} y2={y} />;
                })}
              </g>
            ))}
        </svg>
      )}

      <div className="hud-section mono">
        <span className="hud-tab-label">{`${s.n} // ${s.label}`}</span>
        <span className="hud-index">{s.n}</span>
      </div>
    </div>
  );
}
