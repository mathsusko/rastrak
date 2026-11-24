"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

// Estado compartilhado entre a timeline de scroll e a cena WebGL da cabeça.
export const scene = {
  reveal: 0, // 0..1 traçado da cabeça (boot)
  x: 0, // deslocamento horizontal (unidades de mundo)
  y: 0,
  scale: 0.92,
  opacity: 0.85,
  glitch: 0, // 0..1 deslocamento horizontal em faixas
  spin: 0, // rotação extra vinda do scroll
};

if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  Object.assign(window, { __scene: scene, __ST: ScrollTrigger });
}
