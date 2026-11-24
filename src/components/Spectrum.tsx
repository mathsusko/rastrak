"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { audio } from "@/lib/audio";

const BINS = 128;

const frag = /* glsl */ `
  uniform sampler2D uSpec;
  uniform float uTime;
  uniform vec2 uRes;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    // espelhado a partir do centro, graves no meio
    float x = abs(uv.x - 0.5) * 2.0;
    float s = texture2D(uSpec, vec2(pow(x, 1.6) * 0.85, 0.5)).r;
    float y = abs(uv.y - 0.5) * 2.0;

    // barras finas
    float cols = 96.0;
    float cell = fract(uv.x * cols);
    float bar = step(0.28, cell) * step(cell, 0.72);
    float h = s * 0.92 + 0.015;
    float on = step(y, h) * bar;

    // linha de forma de onda e grade técnica
    float line = smoothstep(0.012, 0.0, abs(y - h)) * 0.9;
    float grid = step(0.985, fract(uv.y * 8.0)) * 0.06 + step(0.995, fract(uv.x * 16.0)) * 0.05;

    vec3 green = vec3(0.0, 1.0, 0.4);
    vec3 slate = vec3(0.43, 0.46, 0.51);
    float peak = smoothstep(0.55, 1.0, s);
    vec3 col = mix(slate * 0.55, green, 0.35 + peak) * on + green * line + slate * grid;
    float a = max(max(on * (0.35 + s), line), grid);
    gl_FragColor = vec4(col, a);
  }
`;

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

export default function Spectrum() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current!;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const data = new Uint8Array(BINS * 4);
    const tex = new THREE.DataTexture(data, BINS, 1, THREE.RGBAFormat);
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;

    const mat = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      uniforms: { uSpec: { value: tex }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2() } },
    });
    const sceneGl = new THREE.Scene();
    sceneGl.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    const cam = new THREE.Camera();

    const smooth = new Float32Array(BINS);
    const timer = new THREE.Timer();
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    renderer.setAnimationLoop(() => {
      if (!visible) return;
      timer.update();
      const t = timer.getElapsed();
      const spec = audio?.spectrum();
      const live = audio?.playing;
      for (let i = 0; i < BINS; i++) {
        // modo silencioso: sinal sintético em 146 BPM
        const beat = Math.pow(1 - ((t * 146) / 60) % 1, 6);
        const idle = (0.12 + 0.1 * Math.sin(i * 0.31 + t * 1.7) + beat * 0.45 * Math.exp(-i / 14)) * (1 - i / BINS);
        const target = live && spec ? spec[Math.min(i, spec.length - 1)] / 255 : Math.max(0, idle);
        smooth[i] += (target - smooth[i]) * 0.3;
        data[i * 4] = Math.min(255, smooth[i] * 255);
      }
      tex.needsUpdate = true;
      mat.uniforms.uTime.value = t;
      renderer.render(sceneGl, cam);
    });

    const onResize = () => renderer.setSize(el.clientWidth, el.clientHeight);
    window.addEventListener("resize", onResize);
    return () => {
      io.disconnect();
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", onResize);
      tex.dispose();
      mat.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mount} className="spectrum" aria-hidden />;
}
