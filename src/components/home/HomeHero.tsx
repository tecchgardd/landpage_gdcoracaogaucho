'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { BrushStroke } from '@/components/brand/BrushStroke';
import { useSiteModals } from '@/components/site/SiteModals';

const ease = [0.22, 1, 0.36, 1] as const;
const intro = 2.4; // espera a abertura (IntroLoader) terminar na primeira visita

export function HomeHero() {
  const [delay] = useState(() => (typeof window !== 'undefined' && sessionStorage.getItem('cg_intro_seen') ? 0.1 : intro));
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { open } = useSiteModals();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const strokeY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const wordY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const badgeRotate = useTransform(scrollYProgress, [0, 1], [0, 160]);

  return <section ref={ref} className="paper relative flex min-h-[100svh] flex-col overflow-hidden pb-36 pt-28 text-gaucho-ink md:pb-28">
    <BrushStroke trigger="mount" seed={41} color="gold" delay={delay + 0.55} className="absolute -left-10 top-[64%] h-10 w-[46%] -rotate-[6deg] opacity-90 md:h-14" />
    <BrushStroke trigger="mount" seed={43} color="green" delay={delay + 0.7} reverse className="absolute -right-10 top-[20%] h-8 w-[30%] rotate-[8deg] md:h-12" />

    <div className="relative mx-auto w-full max-w-[1400px] flex-1 px-4 md:px-8">
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.6 }} className="flex items-center justify-center gap-3 font-label text-xs font-bold uppercase tracking-[.4em] text-gaucho-ink/80 md:text-sm"><span className="h-px w-8 bg-gaucho-ink/30" />Grupo de Danças • desde 2012<span className="h-px w-8 bg-gaucho-ink/30" /></motion.p>

      <motion.h1 style={reduce ? undefined : { y: wordY }} className="relative z-10 mt-4 text-center font-display text-[clamp(4rem,15vw,13.5rem)] font-extrabold uppercase leading-[0.8] tracking-[-0.045em]">
        {'Tradição'.split('').map((letter, index) => <motion.span key={index} initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: delay + 0.05 + index * 0.045, duration: 0.8, ease }} className="inline-block">{letter}</motion.span>)}
      </motion.h1>

      <motion.div style={reduce ? undefined : { y: strokeY }} className="relative -mx-4 -mt-[3vw] md:-mx-8">
        <BrushStroke trigger="mount" seed={7} delay={delay + 0.35} duration={1.2} className="relative mx-auto h-[30vh] w-[108%] -translate-x-[4%] -rotate-[3deg] md:h-[38vh]" innerClassName="bg-gaucho-ink">
          <video autoPlay muted loop playsInline preload="metadata" poster="/assets/bg-hero.png" className="h-full w-full scale-110 object-cover object-[center_40%]"><source src="/videos/v1.mp4" type="video/mp4" /></video>
          <div className="absolute inset-0 bg-gradient-to-r from-gaucho-brushred/25 via-transparent to-gaucho-brushgreen/20" />
        </BrushStroke>
        <motion.p initial={{ opacity: 0, scale: 0.8, rotate: -10 }} animate={{ opacity: 1, scale: 1, rotate: -6 }} transition={{ delay: delay + 1.1, duration: 0.7, ease }} className="absolute -bottom-[6vh] right-[6%] z-10 font-script text-[clamp(3.4rem,9vw,8.5rem)] leading-none text-gaucho-ink drop-shadow-[0_2px_0_#fdfaf3]">que se dança</motion.p>
        <motion.div style={reduce ? undefined : { rotate: badgeRotate }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: delay + 1.3, type: 'spring', stiffness: 180, damping: 14 }} className="absolute -top-[9vh] left-[5%] z-10 hidden h-36 w-36 md:block lg:h-44 lg:w-44"><RotatingBadge /></motion.div>
      </motion.div>
    </div>

    <div className="relative mx-auto mt-16 grid w-full max-w-[1400px] items-end gap-8 px-4 md:mt-14 md:grid-cols-[1fr_auto] md:px-8">
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay + 1.2 }} className="max-w-md text-lg leading-8 text-gaucho-ink/80">Há mais de 13 anos formando dançarinos, amizades e histórias. <b className="text-gaucho-ink">Venha para o baile, entre numa turma ou comece hoje pelas aulas online.</b></motion.p>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay + 1.35 }} className="flex flex-wrap gap-3">
        <Link href="/loja" className="btn-premium group inline-flex h-14 items-center gap-3 rounded-full bg-gaucho-ink pl-6 pr-2 font-bold text-white">Bailes, cursos e loja<span className="flex h-10 w-10 items-center justify-center rounded-full bg-gaucho-brushred transition group-hover:rotate-[-45deg]"><FontAwesomeIcon icon={faArrowRight} /></span></Link>
        <Link href="/minha-conta/cursos" className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-gaucho-ink px-6 font-bold transition hover:bg-gaucho-ink hover:text-white"><FontAwesomeIcon icon={faGraduationCap} />Área do aluno</Link>
        <button onClick={() => open({ type: 'whatsapp' })} className="inline-flex h-14 items-center gap-2 rounded-full bg-[#25d366] px-6 font-bold text-white transition hover:brightness-105"><FontAwesomeIcon icon={faWhatsapp} className="text-xl" />Tirar dúvidas</button>
      </motion.div>
    </div>
  </section>;
}

export function RotatingBadge({ text = 'Coração Gaúcho • desde 2012 • tradição que se dança • ' }: { text?: string }) {
  return <div className="relative h-full w-full rounded-full bg-gaucho-snow shadow-[0_20px_50px_rgba(0,0,0,.18)]">
    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[spin_22s_linear_infinite] motion-reduce:animate-none" aria-hidden="true"><defs><path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs><text className="fill-gaucho-ink font-label text-[15.5px] font-bold uppercase tracking-[.2em]"><textPath href="#badge-circle">{text}</textPath></text></svg>
    <Image src="/assets/logo.jpg" alt="" width={120} height={120} className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 object-contain mix-blend-multiply" />
  </div>;
}
