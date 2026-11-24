"use client";

// Motor de áudio único do site: toca o trecho de sinal e expõe nível/espectro
// para o WebGL e o visualizador.

type Listener = (on: boolean) => void;

class AudioEngine {
  private el: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private data: Uint8Array<ArrayBuffer> = new Uint8Array(new ArrayBuffer(128));
  private listeners = new Set<Listener>();
  playing = false;

  private ensure() {
    if (this.el) return;
    this.el = new Audio("/media/rastrak-signal.mp3");
    this.el.loop = true;
    this.el.crossOrigin = "anonymous";
    this.el.volume = 0.85;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    const src = this.ctx.createMediaElementSource(this.el);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.82;
    src.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    this.data = new Uint8Array(new ArrayBuffer(this.analyser.frequencyBinCount));
  }

  async play() {
    this.ensure();
    await this.ctx?.resume();
    try {
      await this.el!.play();
      this.set(true);
    } catch {
      this.set(false);
    }
  }

  pause() {
    this.el?.pause();
    this.set(false);
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  private set(on: boolean) {
    this.playing = on;
    this.listeners.forEach((l) => l(on));
  }

  subscribe(l: Listener) {
    this.listeners.add(l);
    return () => {
      this.listeners.delete(l);
    };
  }

  /** Espectro 0..255 (vazio se o áudio estiver parado). */
  spectrum(): Uint8Array {
    if (this.analyser && this.playing) this.analyser.getByteFrequencyData(this.data);
    else this.data.fill(0);
    return this.data;
  }

  /** Nível de graves normalizado 0..1. */
  bass(): number {
    const d = this.spectrum();
    let s = 0;
    for (let i = 1; i < 8; i++) s += d[i];
    return s / (7 * 255);
  }
}

export const audio = typeof window !== "undefined" ? new AudioEngine() : (null as unknown as AudioEngine);
