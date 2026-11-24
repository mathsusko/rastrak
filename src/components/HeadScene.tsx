"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { scene as state } from "@/lib/gsap";
import { audio } from "@/lib/audio";

// Cabeça codificada: curvas de nível da referência em pontos verdes,
// com pulso que percorre as curvas e reage aos graves.

const vertex = /* glsl */ `
  attribute float aDist;
  attribute float aRand;
  uniform float uTime;
  uniform float uReveal;
  uniform float uAudio;
  uniform float uGlitch;
  uniform float uPixel;
  uniform float uSize;
  varying float vAlpha;
  varying float vWave;

  void main() {
    vec3 p = position;
    // onda que percorre os anéis da cabeça (pulso do kick)
    float wave = sin(aDist * 34.0 - uTime * 2.4);
    float kick = 0.018 + uAudio * 0.09;
    p.z += wave * kick;
    p.xy *= 1.0 + wave * kick * 0.15;

    // glitch horizontal em faixas
    float band = floor((p.y + 1.0) * 18.0);
    float g = fract(sin(band * 91.7 + floor(uTime * 12.0)) * 43758.5);
    p.x += (g - 0.5) * 0.6 * uGlitch * step(0.55, g);

    // boot: o traçado sobe do pescoço ao topo, com dispersão por partícula
    float threshold = (p.y * 0.5 + 0.5) * 0.92 + aRand * 0.08;
    float on = smoothstep(threshold - 0.04, threshold, uReveal * 1.04);
    vec3 scatter = vec3((aRand - 0.5) * 2.0, (fract(aRand * 13.1) - 0.5) * 2.0, (fract(aRand * 7.3) - 0.5));
    p = mix(p + scatter * 0.9, p, on);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixel * (0.7 + aRand * 0.6) * (1.0 / -mv.z);
    vAlpha = on;
    vWave = wave;
  }
`;

const fragment = /* glsl */ `
  uniform float uOpacity;
  uniform float uAudio;
  varying float vAlpha;
  varying float vWave;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.1, d);
    vec3 base = vec3(0.0, 1.0, 0.4);          // #00FF66
    vec3 dim = vec3(0.133, 0.898, 0.42) * 0.35; // #22E56B rebaixado
    float hi = smoothstep(0.55, 1.0, vWave) * (0.6 + uAudio);
    vec3 col = mix(dim, base, 0.45 + hi);
    gl_FragColor = vec4(col, a * vAlpha * uOpacity * (0.55 + hi * 0.6));
  }
`;

export default function HeadScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    const dpr = Math.min(window.devicePixelRatio, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, el.clientWidth / el.clientHeight, 0.1, 50);
    camera.position.set(0, 0, 5.2);

    const group = new THREE.Group();
    scene.add(group);

    const uniforms = {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uAudio: { value: 0 },
      uGlitch: { value: 0 },
      uOpacity: { value: 1 },
      uPixel: { value: dpr },
      uSize: { value: 15 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    let points: THREE.Points | null = null;
    let disposed = false;

    fetch("/data/head.bin")
      .then((r) => r.arrayBuffer())
      .then((buf) => {
        if (disposed) return;
        const raw = new Float32Array(buf);
        const n = raw.length / 4;
        const pos = new Float32Array(n * 3);
        const dist = new Float32Array(n);
        const rand = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          pos[i * 3] = raw[i * 4];
          pos[i * 3 + 1] = raw[i * 4 + 1];
          pos[i * 3 + 2] = raw[i * 4 + 2];
          dist[i] = raw[i * 4 + 3];
          rand[i] = Math.random();
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        geo.setAttribute("aDist", new THREE.BufferAttribute(dist, 1));
        geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
        points = new THREE.Points(geo, material);
        group.add(points);
      });

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    const onResize = () => {
      renderer.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = new THREE.Timer();
    let level = 0;

    renderer.setAnimationLoop(() => {
      timer.update();
      if (state.opacity < 0.005) {
        renderer.clear();
        return;
      }
      const t = timer.getElapsed();
      const b = audio ? audio.bass() : 0;
      level += (b - level) * 0.25;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      uniforms.uTime.value = reduce ? 0 : t;
      uniforms.uReveal.value = state.reveal;
      uniforms.uAudio.value = level;
      uniforms.uGlitch.value = state.glitch;
      uniforms.uOpacity.value = state.opacity;

      // escala: cabeça ocupa ~80% da altura em qualquer proporção
      const fit = Math.min(1, (camera.aspect / 0.75) * 0.9);
      group.scale.setScalar(state.scale * fit * 1.15);
      group.position.set(state.x * camera.aspect, state.y, 0);
      group.rotation.y = (reduce ? 0 : Math.sin(t * 0.22) * 0.38) + state.spin + pointer.x * 0.25;
      group.rotation.x = pointer.y * 0.12;
      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      points?.geometry.dispose();
      material.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mount} className="head-scene" aria-hidden />;
}
