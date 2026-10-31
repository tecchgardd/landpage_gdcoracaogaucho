'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BrushStroke } from './BrushStroke';

const KEY = 'cg_intro_seen';

// Abertura: as três pinceladas da bandeira são pintadas, o coração bate e a cortina sobe.
// Uma vez por sessão; some na hora com prefers-reduced-motion.
export function IntroLoader() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (reduce || sessionStorage.getItem(KEY)) { setVisible(false); return; }
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => { sessionStorage.setItem(KEY, '1'); setVisible(false); }, 2600);
    return () => { clearTimeout(timer); document.body.style.overflow = ''; };
  }, [reduce]);
  useEffect(() => { if (!visible) document.body.style.overflow = ''; }, [visible]);

  return <AnimatePresence>{visible && <motion.div key="intro" role="status" aria-label="Carregando o site do Coração Gaúcho" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }} className="paper fixed inset-0 z-[500] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 -rotate-[14deg] scale-125">
      <BrushStroke trigger="mount" seed={3} color="green" className="absolute left-[-5%] top-[24%] h-[16vh] w-[110%]" duration={0.75} />
      <BrushStroke trigger="mount" seed={7} color="red" className="absolute left-[-5%] top-[42%] h-[16vh] w-[110%]" delay={0.3} duration={0.75} reverse />
      <BrushStroke trigger="mount" seed={11} color="gold" className="absolute left-[-5%] top-[60%] h-[16vh] w-[110%]" delay={0.6} duration={0.75} />
    </div>
    <motion.div initial={{ scale: 0.4, opacity: 0, rotate: -8 }} animate={{ scale: [0.4, 1.08, 1, 1.06, 1], opacity: 1, rotate: 0 }} transition={{ delay: 1.05, duration: 1.3, times: [0, 0.35, 0.55, 0.75, 1] }} className="relative flex h-60 w-60 items-center justify-center rounded-full bg-gaucho-snow shadow-[0_30px_80px_rgba(0,0,0,.25)] md:h-72 md:w-72">
      <Image src="/assets/logo.jpg" alt="" width={260} height={260} priority className="h-[88%] w-[88%] object-contain mix-blend-multiply" />
    </motion.div>
    <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6 }} className="absolute bottom-10 font-label text-sm font-bold uppercase tracking-[.4em] text-gaucho-ink/60">desde 2012 • tradição que se dança</motion.p>
  </motion.div>}</AnimatePresence>;
}
