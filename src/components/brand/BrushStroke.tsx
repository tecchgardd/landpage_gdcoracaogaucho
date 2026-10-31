'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

// Pincelada da bandeira (identidade do logo do grupo): polígono de bordas irregulares,
// determinístico por seed, que é "pintado" da esquerda para a direita ao aparecer.
function random(seed: number) { let state = (seed * 9973 + 17) % 2147483647; return () => { state = (state * 16807) % 2147483647; return (state - 1) / 2147483646; }; }

// Ruído suavizado (média móvel) para a borda ondular como tinta, sem dentes.
function smoothNoise(next: () => number, count: number, window = 3) {
  const raw = Array.from({ length: count }, () => next());
  return raw.map((_, index) => { let sum = 0; let total = 0; for (let offset = -window; offset <= window; offset += 1) { const value = raw[index + offset]; if (value !== undefined) { sum += value; total += 1; } } return sum / total; });
}

export function brushPolygon(seed = 1, roughness = 3, steps = 64) {
  const next = random(seed);
  const topNoise = smoothNoise(next, steps + 1); const bottomNoise = smoothNoise(next, steps + 1);
  const top = topNoise.map((value, index) => [3 + (index / steps) * 94, value * roughness * 2]);
  const bottom = bottomNoise.map((value, index) => [3 + (index / steps) * 94, 100 - value * roughness * 2]);
  // Pontas com "fios" do pincel: faixas finas de comprimentos diferentes.
  const bristles = 11;
  const right = Array.from({ length: bristles }, (_, index) => [99.5 - next() * 2.2, ((index + 1) / (bristles + 1)) * 100]);
  const left = Array.from({ length: bristles }, (_, index) => [0.5 + next() * 2.2, 100 - ((index + 1) / (bristles + 1)) * 100]);
  return `polygon(${[...top, ...right, ...bottom.reverse(), ...left].map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(',')})`;
}

const brushColors = { green: 'bg-gaucho-brushgreen', red: 'bg-gaucho-brushred', gold: 'bg-gaucho-brushgold', ink: 'bg-gaucho-ink', snow: 'bg-gaucho-snow' } as const;

export function BrushStroke({ seed = 1, color, className = '', innerClassName = '', children, delay = 0, duration = 1.1, roughness, trigger = 'view', reverse = false }: { seed?: number; color?: keyof typeof brushColors; className?: string; innerClassName?: string; children?: ReactNode; delay?: number; duration?: number; roughness?: number; trigger?: 'view' | 'mount'; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  // Observa o contêiner externo (sem recorte): o elemento recortado em 100% pode não contar como visível.
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const hidden = { clipPath: reverse ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' };
  const shown = { clipPath: 'inset(0 0% 0 0%)' };
  return <div ref={ref} aria-hidden={children ? undefined : true} className={className}>
    <motion.div className="h-full w-full" initial={hidden} animate={trigger === 'mount' || inView ? shown : hidden} transition={{ duration, delay, ease: [0.65, 0, 0.35, 1] }}>
      <div className={`bristles relative h-full w-full overflow-hidden ${color ? brushColors[color] : ''} ${innerClassName}`} style={{ clipPath: brushPolygon(seed, roughness) }}>{children}</div>
    </motion.div>
  </div>;
}
