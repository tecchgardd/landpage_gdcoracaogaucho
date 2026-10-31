'use client';
import { motion } from 'framer-motion';

// Faixa diagonal verde/vermelho/amarelo da bandeira do RS: assinatura visual do site.
// A rotação fica no wrapper porque o framer-motion sobrescreve o transform do elemento animado.
export function FlagSash({ className = '', delay = 0.2 }: { className?: string; delay?: number }) {
  return <div aria-hidden="true" className={`pointer-events-none ${className}`}>
    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }} className="flex h-full w-full origin-left flex-col"><span className="flex-1 bg-gaucho-green" /><span className="flex-1 bg-gaucho-red" /><span className="flex-1 bg-gaucho-gold" /></motion.div>
  </div>;
}
