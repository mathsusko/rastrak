"use client";

import { gsap, scene, ScrollTrigger } from "@/lib/gsap";

// Direção da cabeça WebGL ao longo da página: um único dono do estado,
// com keyframes ancorados nas seções e suavização no ticker.
type Pose = { x: number; y: number; scale: number; opacity: number; spin: number };
type Key = { trigger: string; start: string; pose: Pose; desktop?: Partial<Pose> };

// A cabeça só aparece no hero: some durante a sequência de frames e não volta.
const keys: Key[] = [
  { trigger: ".hero", start: "top top", pose: { x: 0, y: 0.1, scale: 0.86, opacity: 0.95, spin: 0 }, desktop: { x: 0.27, y: 0.02, scale: 1.02 } },
  { trigger: ".hero", start: "center top", pose: { x: 0, y: 0.25, scale: 0.8, opacity: 0.4, spin: 0.4 }, desktop: { x: 0.3, y: 0.2, scale: 0.95 } },
  { trigger: ".seq", start: "top top", pose: { x: 0, y: 0.3, scale: 0.75, opacity: 0, spin: 0.6 }, desktop: { x: 0.32, y: 0.3, scale: 0.9 } },
];

const props: (keyof Pose)[] = ["x", "y", "scale", "opacity", "spin"];
const ease = (t: number) => t * t * (3 - 2 * t);

export function startDirector() {
  const triggers = keys.map((k) => ScrollTrigger.create({ trigger: k.trigger, start: k.start }));
  const target: Pose = { ...keys[0].pose };

  const poseOf = (k: Key): Pose => (k.desktop && window.innerWidth > 960 ? { ...k.pose, ...k.desktop } : k.pose);

  const compute = () => {
    const y = window.scrollY;
    let i = 0;
    while (i < triggers.length - 1 && y >= triggers[i + 1].start) i++;
    const a = poseOf(keys[i]);
    if (i === triggers.length - 1) return Object.assign(target, a);
    const b = poseOf(keys[i + 1]);
    const span = Math.max(1, triggers[i + 1].start - triggers[i].start);
    const t = ease(gsap.utils.clamp(0, 1, (y - triggers[i].start) / span));
    for (const p of props) target[p] = a[p] + (b[p] - a[p]) * t;
  };

  const tick = () => {
    compute();
    for (const p of props) scene[p] += (target[p] - scene[p]) * 0.08;
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    triggers.forEach((t) => t.kill());
  };
}
