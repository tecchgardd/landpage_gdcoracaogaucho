'use client';
import { useEffect, useRef } from 'react';

type Props = { horizonColor: string; waveColor: string; crestColor: string; amplitude?: number; fogDepth?: number; brightness?: number; opacity?: number; className?: string };
type Rgb = [number, number, number];

const hex = (value: string): Rgb => { const n = parseInt(value.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mix = (a: Rgb, b: Rgb, t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(' ')})`;
const LAYERS = 6;

export function GradientWaves({ horizonColor, waveColor, crestColor, amplitude = 3, fogDepth = 30, brightness = 1, opacity = 1, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return;
    const horizon = hex(horizonColor), wave = hex(waveColor), crest = hex(crestColor);
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0, height = 0, frame = 0;
    const resize = () => { const dpr = Math.min(window.devicePixelRatio || 1, 2); width = canvas.clientWidth; height = canvas.clientHeight; canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); if (still) draw(0); };
    const draw = (time: number) => {
      const t = time / 1000; const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, mix(horizon, [255, 255, 255], 0.08)); sky.addColorStop(1, mix(horizon, wave, 0.5));
      ctx.fillStyle = sky; ctx.fillRect(0, 0, width, height);
      for (let i = 0; i < LAYERS; i++) {
        const depth = i / (LAYERS - 1); const fog = Math.min(0.92, (1 - depth) * (fogDepth / 40));
        const base = height * (0.3 + depth * 0.5); const amp = amplitude * height * 0.011 * (0.55 + depth); const speed = 0.18 + depth * 0.22; const phase = i * 1.7;
        ctx.beginPath(); ctx.moveTo(0, height);
        for (let x = 0; x <= width + 8; x += 8) { const k = x / Math.max(width, 1); ctx.lineTo(x, base + Math.sin(k * (3 + i * 0.6) + t * speed + phase) * amp + Math.sin(k * (7.3 - i * 0.4) - t * speed * 1.4 + phase * 2) * amp * 0.35); }
        ctx.lineTo(width, height); ctx.closePath();
        const fill = ctx.createLinearGradient(0, base - amp, 0, base + amp * 3);
        fill.addColorStop(0, mix(crest, horizon, fog)); fill.addColorStop(0.35, mix(wave, horizon, fog)); fill.addColorStop(1, mix(wave, [0, 0, 0], 0.35 * depth));
        ctx.fillStyle = fill; ctx.fill();
      }
      if (!still) frame = requestAnimationFrame(draw);
    };
    const observer = new ResizeObserver(resize); observer.observe(canvas); resize();
    if (!still) frame = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [horizonColor, waveColor, crestColor, amplitude, fogDepth]);
  return <canvas ref={ref} aria-hidden="true" className={`block h-full w-full ${className}`} style={{ opacity, filter: brightness === 1 ? undefined : `brightness(${brightness})` }} />;
}
