'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { animate, AnimatePresence, motion, useInView } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { BrushStroke } from '@/components/brand/BrushStroke';
import { useSiteModals } from '@/components/site/SiteModals';
import { INSTAGRAM_URL, YOUTUBE_URL, whatsappLink, whatsappTopics } from '@/components/site/whatsapp';
import { publicAlbumService } from '@/services/public/publicAlbumService';
import type { PublicAlbum } from '@/services/public/types';

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  { title: 'Inscrição', text: 'Taxa única, sem mensalidade. Não precisa ter par.', color: 'bg-gaucho-brushgreen' },
  { title: '10 aulas', text: 'Um encontro por semana, roupa confortável, no seu tempo.', color: 'bg-gaucho-brushred' },
  { title: 'Ritmos', text: 'Bugio, marchinha, vanera, chamamé, milonga, valsa e xote.', color: 'bg-gaucho-brushgold' },
  { title: 'Formatura', text: 'O Baile de Formatura, com família e amigos na plateia.', color: 'bg-white' }
];

export function Journey() {
  const { open } = useSiteModals();
  return <section className="grain relative overflow-hidden bg-gaucho-ink py-24 text-white md:py-32">
    <div className="mx-auto max-w-[1400px] px-4 md:px-8">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end"><div><p className="font-script text-4xl text-gaucho-brushgold">a jornada</p><h2 className="font-display text-5xl font-extrabold leading-[0.9] tracking-tight md:text-7xl">Do primeiro passo<br />à formatura.</h2></div><button onClick={() => open({ type: 'cursos' })} className="btn-premium inline-flex h-14 items-center gap-3 self-end rounded-full bg-gaucho-brushgold pl-6 pr-2 font-bold text-gaucho-ink">Ver turmas abertas<span className="flex h-10 w-10 items-center justify-center rounded-full bg-gaucho-ink text-white"><FontAwesomeIcon icon={faArrowRight} /></span></button></div>
      <div className="relative mt-16">
        <BrushStroke seed={61} color="red" duration={1.6} className="absolute left-0 right-0 top-9 hidden h-5 md:block" />
        <ol className="relative grid gap-10 md:grid-cols-4 md:gap-6">{steps.map((step, index) => <motion.li key={step.title} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ delay: 0.3 + index * 0.25, duration: 0.7, ease }}>
          <span className={`flex h-20 w-20 items-center justify-center rounded-full font-display text-3xl font-extrabold ring-8 ring-gaucho-ink ${step.color} ${index >= 2 ? 'text-gaucho-ink' : 'text-white'}`}>{index + 1}</span>
          <h3 className="mt-6 font-display text-3xl font-extrabold">{step.title}</h3><p className="mt-2 max-w-xs text-white/80">{step.text}</p>
        </motion.li>)}</ol>
      </div>
      <p className="mt-16 text-white/80">Prefere começar de casa? <Link href="/loja?categoria=cursos-online" className="font-bold text-gaucho-brushgold underline-offset-4 hover:underline">Conheça as aulas online</Link>.</p>
    </div>
  </section>;
}

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null); const inView = useInView(ref, { once: true });
  useEffect(() => { if (!inView || !ref.current) return; const node = ref.current; const controls = animate(0, value, { duration: 1.6, ease, onUpdate: (latest) => { node.textContent = `${Math.round(latest).toLocaleString('pt-BR')}${suffix}`; } }); return () => controls.stop(); }, [inView, value, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}
const stats = [{ value: 13, suffix: '+', label: 'anos de história' }, { value: 500, suffix: '+', label: 'alunos' }, { value: 100, suffix: '+', label: 'eventos' }, { value: 1000, suffix: '+', label: 'famílias' }];

export function Founders() {
  const { open } = useSiteModals();
  return <section className="grain relative overflow-hidden bg-gaucho-brushgold py-24 text-gaucho-ink md:py-32">
    <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-4 md:px-8 lg:grid-cols-[1.05fr_1fr]">
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px]">
        <BrushStroke seed={71} color="red" className="absolute -left-6 top-[8%] h-[84%] w-[60%] -rotate-[4deg]" />
        <BrushStroke seed={73} duration={1.3} delay={0.2} className="absolute inset-[4%] rotate-[2deg]" innerClassName="bg-gaucho-ink"><Image src="/assets/Foto_sobre_1.jpg" alt="Professor Alan de Abreu e Eliane dançando" fill sizes="(max-width:1024px) 90vw, 560px" className="object-cover" /></BrushStroke>
        <motion.p initial={{ opacity: 0, rotate: -12, scale: 0.8 }} whileInView={{ opacity: 1, rotate: -8, scale: 1 }} viewport={{ once: true }} transition={{ delay: 1, duration: 0.6 }} className="absolute -bottom-4 right-0 font-script text-6xl text-white drop-shadow-[0_3px_0_#0b1a12] md:text-7xl">Alan & Eliane</motion.p>
      </div>
      <div>
        <p className="font-label text-sm font-bold uppercase tracking-[.35em] text-gaucho-ink/80">Quem conduz a roda</p>
        <h2 className="mt-3 font-display text-5xl font-extrabold leading-[0.92] tracking-tight md:text-6xl">Mais que professores. <span className="text-gaucho-brushred">Família.</span></h2>
        <p className="mt-6 text-lg leading-8 text-gaucho-ink/80">O professor Alan de Abreu conduz cada turma respeitando o tempo de cada aluno. Eliane transforma cada encontro num lugar leve, acolhedor e familiar. Juntos, mantêm viva a tradição gaúcha desde 2012.</p>
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">{stats.map((stat) => <div key={stat.label}><dd className="font-display text-4xl font-extrabold"><Counter value={stat.value} suffix={stat.suffix} /></dd><dt className="text-sm text-gaucho-ink/80">{stat.label}</dt></div>)}</dl>
        <button onClick={() => open({ type: 'historia' })} className="btn-premium mt-10 inline-flex h-14 items-center gap-3 rounded-full bg-gaucho-ink pl-6 pr-2 font-bold text-white">Conhecer nossa trajetória<span className="flex h-10 w-10 items-center justify-center rounded-full bg-gaucho-brushred"><FontAwesomeIcon icon={faArrowRight} /></span></button>
      </div>
    </div>
  </section>;
}

export function Graduations() {
  const { open } = useSiteModals();
  const [albums, setAlbums] = useState<PublicAlbum[]>([]);
  useEffect(() => { publicAlbumService.list().then((list) => setAlbums(list.slice(0, 6))).catch(() => undefined); }, []);
  if (!albums.length) return null;
  return <section className="grain relative overflow-hidden bg-gaucho-ink py-24 text-white md:py-32">
    <BrushStroke seed={95} color="green" className="absolute -right-16 top-20 h-14 w-[38%] rotate-[6deg] opacity-80" />
    <div className="relative mx-auto max-w-[1400px] px-4 md:px-8"><p className="font-script text-5xl text-gaucho-brushgold">formaturas</p><h2 className="font-display text-5xl font-extrabold leading-[0.9] tracking-tight md:text-6xl">Cada turma, uma noite<br />inesquecível.</h2></div>
    <div className="no-scrollbar mt-14 flex gap-8 overflow-x-auto px-4 pb-10 pt-4 md:px-8">{albums.map((album, index) => <motion.button key={album.id} onClick={() => open({ type: 'album', slug: album.slug, title: album.title })} initial={{ opacity: 0, y: 40, rotate: 0 }} whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 3 : -3 }} whileHover={{ rotate: 0, y: -8 }} viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.6, ease }} className="relative w-[78vw] max-w-[340px] shrink-0 bg-white p-4 pb-6 text-left text-gaucho-ink shadow-[0_30px_60px_rgba(0,0,0,.45)]">
      <span className={`absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-[-3deg] opacity-80 ${['bg-gaucho-brushgreen', 'bg-gaucho-brushred', 'bg-gaucho-brushgold'][index % 3]}`} />
      <div className="relative aspect-[4/5] overflow-hidden bg-gaucho-paper">{album.coverImage && <Image src={album.coverImage} alt="" fill sizes="340px" className="object-cover" />}</div>
      <p className="mt-4 font-script text-4xl leading-none text-gaucho-ink">{album.title}</p><p className="mt-1 text-sm text-gaucho-ink/80">{[album.city, album.photoCount && `${album.photoCount} fotos`].filter(Boolean).join(' • ')}</p>
    </motion.button>)}</div>
  </section>;
}

const chat = [
  { from: 'bot', text: 'Bah, seja bem-vindo ao Coração Gaúcho! 💚❤️💛 Como posso te ajudar?' },
  { from: 'me', text: 'Quero aprender a dançar, mas não tenho par 😅' },
  { from: 'bot', text: 'Sem problema nenhum! No curso não precisa de par. Já te passo as próximas turmas e te coloco em contato com a equipe do grupo pra fazer a inscrição.' }
];

export function WhatsAppBot() {
  const ref = useRef<HTMLDivElement>(null); const inView = useInView(ref, { once: true, amount: 0.4 });
  const [shown, setShown] = useState(0);
  useEffect(() => { if (!inView) return; const timers = chat.map((_, index) => setTimeout(() => setShown(index + 1), 600 + index * 1500)); return () => timers.forEach(clearTimeout); }, [inView]);
  return <section id="contato" className="relative overflow-hidden bg-gaucho-brushgreen py-24 text-white md:py-32">
    <BrushStroke seed={81} color="gold" className="absolute -right-20 top-10 h-16 w-[50%] rotate-[6deg] opacity-80" />
    <div className="relative mx-auto grid max-w-[1400px] items-center gap-14 px-4 md:px-8 lg:grid-cols-[1fr_.9fr]">
      <div>
        <p className="font-script text-4xl text-gaucho-brushgold">dúvida?</p>
        <h2 className="font-display text-5xl font-extrabold leading-[0.9] tracking-tight md:text-7xl">Chama no WhatsApp.</h2>
        <p className="mt-6 max-w-lg text-lg leading-8 text-white/80">Nosso assistente responde na hora, a qualquer hora, e encaminha você para a pessoa certa do grupo. Escolha um assunto:</p>
        <div className="mt-8 flex flex-wrap gap-2">{whatsappTopics.map((topic) => <a key={topic.id} href={whatsappLink(topic.text)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/10 px-4 py-3 font-bold ring-1 ring-white/20 transition hover:-translate-y-0.5 hover:bg-white hover:text-gaucho-green">{topic.emoji} {topic.label}</a>)}</div>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn-premium mt-10 inline-flex h-16 items-center gap-3 rounded-full bg-[#25d366] px-8 text-lg font-bold shadow-[0_14px_40px_rgba(0,0,0,.25)]"><FontAwesomeIcon icon={faWhatsapp} className="text-2xl" />Abrir conversa</a>
      </div>
      <div ref={ref} className="mx-auto w-full max-w-[380px] rounded-[44px] bg-gaucho-ink p-3 shadow-[0_40px_90px_rgba(0,0,0,.4)]">
        <div className="overflow-hidden rounded-[34px] bg-[#efe7dc]">
          <div className="flex items-center gap-3 bg-[#075e54] px-5 py-4 text-white"><span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white"><Image src="/assets/logo.jpg" alt="" width={40} height={40} className="h-9 w-9 object-contain mix-blend-multiply" /></span><span><b className="block leading-tight">Coração Gaúcho</b><span className="text-xs text-white/85">assistente • online</span></span></div>
          <div className="flex min-h-[340px] flex-col gap-3 p-4 text-[15px] text-gaucho-ink">
            <AnimatePresence>{chat.slice(0, shown).map((message, index) => <motion.p key={index} initial={{ opacity: 0, y: 12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${message.from === 'bot' ? 'self-start rounded-tl-sm bg-white' : 'self-end rounded-tr-sm bg-[#d9fdd3]'}`}>{message.text}</motion.p>)}</AnimatePresence>
            {shown < chat.length && inView && <span className="flex gap-1 self-start rounded-2xl bg-white px-4 py-3">{[0, 1, 2].map((dot) => <motion.i key={dot} animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: dot * 0.15 }} className="h-2 w-2 rounded-full bg-gaucho-ink/40" />)}</span>}
          </div>
        </div>
      </div>
    </div>
  </section>;
}

export function Social() {
  const links = [
    { href: INSTAGRAM_URL, icon: faInstagram, label: 'Instagram', handle: '@gdcoracaogaucho', text: 'Bastidores, bailes e as turmas em ação.', color: 'bg-gaucho-ink', seed: 91 },
    { href: YOUTUBE_URL, icon: faYoutube, label: 'YouTube', handle: 'Nossos Caminhos', text: 'Apresentações completas e vídeos dos bailes.', color: 'bg-gaucho-brushgold', seed: 93 }
  ];
  return <section className="grain bg-[#c91f17] py-24 text-white md:py-28">
    <div className="mx-auto max-w-[1400px] px-4 md:px-8"><p className="font-script text-5xl text-gaucho-brushgold">siga o fandango</p>
      <div className="mt-6 divide-y-2 divide-white/40 border-y-2 border-white/40">{links.map((link) => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" className="group relative flex items-center gap-6 overflow-hidden py-8 md:py-10">
        <span className={`absolute inset-y-2 left-0 w-full origin-left scale-x-0 transition-transform duration-700 ease-out group-hover:scale-x-100 ${link.color}`} style={{ clipPath: 'polygon(0 12%, 6% 4%, 30% 9%, 55% 2%, 80% 8%, 100% 3%, 98% 92%, 70% 97%, 45% 90%, 20% 98%, 2% 90%)' }} />
        <FontAwesomeIcon icon={link.icon} className="relative text-4xl md:text-6xl" />
        <span className="relative flex-1"><span className="block font-display text-4xl font-extrabold uppercase tracking-tight md:text-7xl">{link.label}</span><span className="opacity-85">{link.handle} — {link.text}</span></span>
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="relative text-2xl transition group-hover:rotate-12" />
      </a>)}</div>
    </div>
  </section>;
}
