'use client';
import Image from 'next/image';
import Link from 'next/link';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight, faCheck, faLocationDot, faPlay, faXmark } from '@fortawesome/free-solid-svg-icons';
import { BrushStroke } from '@/components/brand/BrushStroke';
import { publicAlbumService } from '@/services/public/publicAlbumService';
import { publicClassService } from '@/services/public/publicClassService';
import { storeService } from '@/services/store/storeService';
import type { PublicAlbumImage, PublicClass } from '@/services/public/types';
import type { OnlineCourse } from '@/services/store/types';
import { formatCurrency, formatShortDate } from '@/utils/publicFormatters';
import { whatsappLink, whatsappTopics } from './whatsapp';

export type SiteModal = { type: 'historia' } | { type: 'cursos' } | { type: 'whatsapp' } | { type: 'album'; slug: string; title: string };
const ModalContext = createContext<{ open: (modal: SiteModal) => void; close: () => void } | null>(null);

export function SiteModalsProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<SiteModal | null>(null);
  const close = useCallback(() => setModal(null), []);
  const value = useMemo(() => ({ open: setModal, close }), [close]);
  return <ModalContext.Provider value={value}>{children}<Modal modal={modal} onClose={close} /></ModalContext.Provider>;
}

export function useSiteModals() { const value = useContext(ModalContext); if (!value) throw new Error('useSiteModals precisa do SiteModalsProvider'); return value; }

function Modal({ modal, onClose }: { modal: SiteModal | null; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden'; panel.current?.focus();
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; previous?.focus?.(); };
  }, [modal, onClose]);
  const title = modal?.type === 'historia' ? 'Nossa trajetória' : modal?.type === 'cursos' ? 'Todos os cursos' : modal?.type === 'whatsapp' ? 'Fale com a gente' : modal?.title;
  return <AnimatePresence>{modal && <motion.div key="modal" className="fixed inset-0 z-[300] flex items-end justify-center md:items-center md:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <button aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-gaucho-ink/70 backdrop-blur-sm" />
    <motion.div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title} initial={{ y: 60, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="paper relative max-h-[90vh] w-full overflow-y-auto rounded-t-[28px] text-gaucho-ink shadow-2xl outline-none md:max-w-4xl md:rounded-[28px]">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-black/5 bg-gaucho-snow/90 px-6 py-4 backdrop-blur md:px-10"><p className="font-script text-3xl text-gaucho-brushred">{title}</p><button onClick={onClose} aria-label="Fechar" className="flex h-11 w-11 items-center justify-center rounded-full bg-gaucho-ink text-white transition hover:rotate-90"><FontAwesomeIcon icon={faXmark} /></button></div>
      <div className="px-6 pb-10 pt-6 md:px-10">{modal.type === 'historia' ? <History /> : modal.type === 'cursos' ? <Courses /> : modal.type === 'whatsapp' ? <WhatsApp /> : <Album slug={modal.slug} />}</div>
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

const timeline = [
  { mark: '2012', title: 'Nasce o Coração Gaúcho', text: 'O grupo é fundado pela paixão pela cultura e pela tradição do Rio Grande do Sul.' },
  { mark: 'Alan & Eliane', title: 'Quem conduz a roda', text: 'O professor Alan de Abreu conduz cada turma no tempo de cada aluno; Eliane transforma cada encontro num ambiente acolhedor e familiar.' },
  { mark: 'Turma a turma', title: 'Centenas de alunos formados', text: 'Cada curso termina num Baile de Formatura, com apresentação para familiares e amigos.' },
  { mark: 'Pelo Sul', title: 'Festivais e apresentações', text: 'Participações em festivais, eventos culturais e apresentações comunitárias, sempre levando o orgulho da tradição.' },
  { mark: 'Hoje', title: 'Do salão para a sua casa', text: 'Bailes, turmas presenciais, loja oficial e aulas online para quem quer começar de onde estiver.' }
];

function History() {
  const { open } = useSiteModals();
  return <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
    <div><div className="relative aspect-[4/5]"><BrushStroke trigger="mount" seed={21} className="absolute inset-0"><Image src="/assets/Foto_sobre_1.jpg" alt="Professor Alan de Abreu e Eliane" fill sizes="400px" className="object-cover" /></BrushStroke></div><p className="mt-4 font-display text-lg font-bold leading-snug">“Mais do que professores, referência para centenas de alunos que encontraram no grupo um lugar para aprender e criar memórias.”</p></div>
    <div>
      <h2 className="font-display text-4xl font-extrabold leading-none tracking-tight">Mais de 13 anos mantendo viva a tradição gaúcha.</h2>
      <p className="mt-4 leading-7 text-black/80">Cada ensaio, apresentação e evento é mais do que uma coreografia: é a chance de manter viva uma cultura que atravessa gerações, unindo técnica, emoção e identidade em cada passo.</p>
      <ol className="relative mt-8 space-y-6 border-l-4 border-dashed border-gaucho-brushred/30 pl-6">{timeline.map((item, index) => <motion.li key={item.mark} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + index * 0.08 }} className="relative"><span className={`absolute -left-[34px] top-1 h-4 w-4 rounded-full ring-4 ring-gaucho-snow ${['bg-gaucho-brushgreen', 'bg-gaucho-brushred', 'bg-gaucho-brushgold'][index % 3]}`} /><p className="font-label text-sm font-bold uppercase tracking-widest text-gaucho-brushred">{item.mark}</p><b className="block text-lg">{item.title}</b><p className="text-black/80">{item.text}</p></motion.li>)}</ol>
      <button onClick={() => open({ type: 'cursos' })} className="btn-premium mt-8 inline-flex items-center gap-3 rounded-full bg-gaucho-ink px-6 py-4 font-bold text-white">Quero fazer parte<FontAwesomeIcon icon={faArrowRight} /></button>
    </div>
  </div>;
}

const howItWorks = ['Taxa única de inscrição, sem mensalidade', '10 aulas, uma vez por semana', 'Não precisa ter par nem traje', 'Termina com Baile de Formatura'];
const rhythms = ['Bugio', 'Marchinha', 'Vanera', 'Chamamé', 'Milonga', 'Valsa', 'Xote'];

function Courses() {
  const [classes, setClasses] = useState<PublicClass[] | null>(null);
  const [online, setOnline] = useState<OnlineCourse[] | null>(null);
  useEffect(() => { publicClassService.listAvailable().then(setClasses).catch(() => setClasses([])); storeService.courses().then(setOnline).catch(() => setOnline([])); }, []);
  return <div className="space-y-10">
    <section><h2 className="font-display text-3xl font-extrabold">Turmas presenciais</h2><ul className="mt-4 flex flex-wrap gap-2">{howItWorks.map((item) => <li key={item} className="rounded-full bg-gaucho-brushgreen/10 px-4 py-2 text-sm font-bold text-gaucho-green"><FontAwesomeIcon icon={faCheck} className="mr-2" />{item}</li>)}</ul>
      <div className="mt-5 grid gap-3 md:grid-cols-2">{classes === null ? <div className="h-28 animate-pulse rounded-2xl bg-black/5 md:col-span-2" /> : classes.length === 0 ? <p className="text-black/80 md:col-span-2">Nenhuma turma aberta agora. Chame no WhatsApp para entrar na lista da próxima.</p> : classes.map((item) => { const date = item.startsAt ? formatShortDate(item.startsAt) : null; return <Link key={item.id} href={`/loja/eventos/${encodeURIComponent(item.slug ?? item.id)}`} className="group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg"><span className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-gaucho-brushgreen font-label font-bold leading-none text-white"><b className="text-2xl">{date?.day ?? '--'}</b><span className="text-xs uppercase">{date?.month ?? ''}</span></span><span className="min-w-0 flex-1"><b className="block truncate">{item.title}</b><span className="block truncate text-sm text-black/80"><FontAwesomeIcon icon={faLocationDot} className="mr-1 text-gaucho-brushred" />{[item.place, item.city].filter(Boolean).join(' • ')}</span><span className="text-sm font-bold">{item.signupFee ? `Inscrição ${formatCurrency(item.signupFee)}` : 'Inscrição gratuita'}{item.availableSpots != null && ` • ${item.availableSpots} vagas`}</span></span><FontAwesomeIcon icon={faArrowRight} className="text-black/30 transition group-hover:translate-x-1 group-hover:text-gaucho-brushred" /></Link>; })}</div>
      <p className="mt-4 text-sm text-black/80">Ritmos: {rhythms.join(' • ')} e outros ritmos tradicionais.</p></section>
    <section className="rounded-3xl bg-gaucho-ink p-6 text-white md:p-8"><p className="font-script text-3xl text-gaucho-brushgold">aprenda em casa</p><h2 className="font-display text-3xl font-extrabold">Cursos online</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">{online === null ? <div className="h-28 animate-pulse rounded-2xl bg-white/10 md:col-span-2" /> : online.length === 0 ? <p className="text-white/80 md:col-span-2">Em breve.</p> : online.map((course) => <Link key={course.id} href={`/loja/cursos/${encodeURIComponent(course.slug)}`} className="group flex items-center gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 transition hover:bg-white/10"><span className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl">{course.image && <Image src={course.image} alt="" fill sizes="80px" className="object-cover" />}<span className="absolute inset-0 flex items-center justify-center bg-black/30"><FontAwesomeIcon icon={faPlay} /></span></span><span className="min-w-0 flex-1"><b className="block">{course.title}</b><span className="text-sm text-white/80">{course.lessonsCount} aulas • {formatCurrency(course.price)}</span></span><FontAwesomeIcon icon={faArrowRight} className="text-white/40 transition group-hover:translate-x-1 group-hover:text-gaucho-brushgold" /></Link>)}</div></section>
  </div>;
}

function WhatsApp() {
  return <div className="grid gap-8 md:grid-cols-[1fr_1.1fr] md:items-center">
    <div><span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#25d366] text-3xl text-white"><FontAwesomeIcon icon={faWhatsapp} /></span><h2 className="mt-5 font-display text-4xl font-extrabold leading-none">Dúvida? Chama no WhatsApp.</h2><p className="mt-4 leading-7 text-black/80">Nosso assistente responde na hora, a qualquer hora, e encaminha você para a pessoa certa do grupo. Escolha o assunto para começar a conversa.</p></div>
    <ul className="grid gap-2">{whatsappTopics.map((topic) => <li key={topic.id}><a href={whatsappLink(topic.text)} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-2xl bg-white p-4 font-bold ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:ring-[#25d366]"><span className="text-2xl">{topic.emoji}</span><span className="flex-1">{topic.label}</span><FontAwesomeIcon icon={faArrowRight} className="text-black/30 transition group-hover:translate-x-1 group-hover:text-[#25d366]" /></a></li>)}</ul>
  </div>;
}

function Album({ slug }: { slug: string }) {
  const [photos, setPhotos] = useState<PublicAlbumImage[] | null>(null);
  useEffect(() => { publicAlbumService.getPhotos(slug, undefined, 24).then((page) => setPhotos(page.data)).catch(() => setPhotos([])); }, [slug]);
  if (!photos) return <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-square animate-pulse rounded-2xl bg-black/5" />)}</div>;
  if (!photos.length) return <p className="text-black/80">As fotos deste álbum ainda não foram publicadas.</p>;
  return <div><div className="columns-2 gap-3 md:columns-3">{photos.map((photo, index) => <motion.div key={photo.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index, 12) * 0.04 }} className="relative mb-3 overflow-hidden rounded-2xl"><Image src={photo.thumbnailUrl ?? photo.url} alt={photo.alt ?? ''} width={photo.width ?? 600} height={photo.height ?? 600} sizes="(max-width:768px) 45vw, 280px" className="h-auto w-full" /></motion.div>)}</div><Link href={`/blog/${encodeURIComponent(slug)}`} className="mt-4 inline-flex items-center gap-2 font-bold text-gaucho-green">Abrir galeria completa<FontAwesomeIcon icon={faArrowRight} /></Link></div>;
}
