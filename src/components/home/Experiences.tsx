'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faLocationDot, faPlay } from '@fortawesome/free-solid-svg-icons';
import { BrushStroke } from '@/components/brand/BrushStroke';
import { useSiteModals } from '@/components/site/SiteModals';
import { storeService } from '@/services/store/storeService';
import type { OnlineCourse, Product } from '@/services/store/types';
import type { PublicEvent } from '@/services/public/types';
import { formatCurrency, formatEventTime, formatShortDate } from '@/utils/publicFormatters';

const tabs = [
  { id: 'dancar', number: '01', title: 'Dançar', script: 'no baile', bg: '#c91f17', light: true, seed: 51 },
  { id: 'aprender', number: '02', title: 'Aprender', script: 'a dançar', bg: '#0f7a35', light: true, seed: 53 },
  { id: 'vestir', number: '03', title: 'Vestir', script: 'a camisa', bg: '#f3c614', light: false, seed: 57 }
] as const;
type Tab = typeof tabs[number]['id'];
const ease = [0.22, 1, 0.36, 1] as const;

export function Experiences() {
  const [tab, setTab] = useState<Tab>('dancar');
  const [events, setEvents] = useState<PublicEvent[] | null>(null);
  const [courses, setCourses] = useState<OnlineCourse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    storeService.events().then(setEvents).catch(() => setEvents([]));
    storeService.courses().then(setCourses).catch(() => undefined);
    storeService.products().then(setProducts).catch(() => undefined);
  }, []);
  const bailes = (events ?? []).filter((event) => event.type !== 'CURSO');
  const turmas = (events ?? []).filter((event) => event.type === 'CURSO');
  const current = tabs.find((item) => item.id === tab) ?? tabs[0];

  return <motion.section id="viver" animate={{ backgroundColor: current.bg }} transition={{ duration: 0.7, ease }} style={{ backgroundColor: tabs[0].bg }} className={`grain relative scroll-mt-24 overflow-hidden py-24 transition-colors duration-700 md:py-32 ${current.light ? 'text-white' : 'text-gaucho-ink'}`}>
    <BrushStroke key={`a-${tab}`} trigger="mount" seed={current.seed + 100} className="absolute -right-24 top-16 h-24 w-[45%] rotate-[8deg] opacity-25" innerClassName={current.light ? 'bg-white' : 'bg-gaucho-ink'} />
    <BrushStroke key={`b-${tab}`} trigger="mount" seed={current.seed + 200} delay={0.2} reverse className="absolute -left-24 bottom-10 h-16 w-[35%] -rotate-[5deg] opacity-20" innerClassName={current.light ? 'bg-gaucho-ink' : 'bg-gaucho-brushred'} />
    <div className="mx-auto grid max-w-[1400px] gap-12 px-4 md:px-8 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.3fr)]">
      <div>
        <p className={`font-script text-5xl ${current.light ? 'text-gaucho-brushgold' : 'text-gaucho-brushred'}`}>e aí, tchê?</p>
        <h2 className="mt-1 font-display text-5xl font-extrabold leading-[0.9] tracking-tight md:text-6xl">O que você quer viver?</h2>
        <div role="tablist" aria-label="Escolha uma experiência" className="mt-10 space-y-2">
          {tabs.map((item) => { const active = tab === item.id; return <button key={item.id} role="tab" aria-selected={active} onClick={() => setTab(item.id)} className="group relative block w-full text-left">
            {active && <motion.span layoutId="exp-brush" className="absolute inset-y-1 -left-3 right-0 -z-0" transition={{ duration: 0.5, ease }}><BrushStroke trigger="mount" seed={item.seed} duration={0.6} className="h-full w-full" innerClassName={current.light ? 'bg-gaucho-snow' : 'bg-gaucho-ink'} /></motion.span>}
            <span className="relative flex items-baseline gap-4 px-3 py-3"><span className={`font-label text-sm font-bold transition ${active ? (current.light ? 'text-gaucho-ink/70' : 'text-white/80') : 'opacity-70'}`}>{item.number}</span><span className={`font-display text-[clamp(2.6rem,6vw,5rem)] font-extrabold uppercase leading-none tracking-tight transition ${active ? (current.light ? 'text-gaucho-ink' : 'text-gaucho-brushgold') : 'opacity-60 group-hover:opacity-100'}`}>{item.title}</span><span className={`whitespace-nowrap font-script text-4xl transition ${active ? (current.light ? 'text-gaucho-brushred' : 'text-white') : 'opacity-60 group-hover:opacity-100'}`}>{item.script}</span></span>
          </button>; })}
        </div>
      </div>

      <div className="relative min-h-[520px]">
        <AnimatePresence mode="wait">
          <motion.div key={tab} role="tabpanel" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.45, ease }}>
            {tab === 'dancar' && <Dance events={bailes} loading={events === null} />}
            {tab === 'aprender' && <Learn turmas={turmas} courses={courses} />}
            {tab === 'vestir' && <Wear products={products} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </motion.section>;
}

function Dance({ events, loading }: { events: PublicEvent[]; loading: boolean }) {
  if (loading) return <div className="space-y-4">{[0, 1, 2].map((index) => <div key={index} className="h-32 animate-pulse rounded-3xl bg-black/5" />)}</div>;
  return <div>
    <p className="max-w-lg text-lg opacity-90">Ingresso pela loja, QR code direto na sua conta. É só chegar e dançar.</p>
    <ul className="mt-6 space-y-4">{events.slice(0, 3).map((event, index) => <motion.li key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}><Ticket event={event} /></motion.li>)}</ul>
    {!events.length && <p className="mt-6 rounded-3xl bg-white p-8 text-gaucho-ink/80 ring-1 ring-black/5">Novos bailes em breve. Chame no WhatsApp para ser avisado.</p>}
    <Link href="/loja?categoria=ingressos" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gaucho-ink px-6 py-4 font-bold text-white transition hover:gap-3">Todos os bailes e eventos<FontAwesomeIcon icon={faArrowRight} /></Link>
  </div>;
}

function Ticket({ event }: { event: PublicEvent }) {
  const date = event.date ? formatShortDate(event.date) : null;
  const href = `/loja/eventos/${encodeURIComponent(event.slug ?? event.id)}`;
  return <Link href={href} className="group relative flex overflow-hidden rounded-3xl bg-white text-gaucho-ink shadow-[0_10px_30px_rgba(40,25,10,.08)] ring-1 ring-black/5 transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(40,25,10,.16)]">
    <div className="relative w-28 shrink-0 overflow-hidden sm:w-40">{event.image && <Image src={event.image} alt="" fill sizes="160px" className="object-cover transition duration-700 group-hover:scale-110" />}<div className="absolute inset-0 bg-gaucho-brushred/60 mix-blend-multiply" /><div className="absolute inset-0 flex flex-col items-center justify-center font-label font-bold leading-none text-white"><b className="text-5xl">{date?.day ?? '--'}</b><span className="mt-1 text-sm uppercase tracking-widest">{date?.month}</span></div></div>
    <div className="relative flex flex-1 items-center gap-4 border-l-2 border-dashed border-black/10 p-5"><span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-[#c91f17]" /><span className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-[#c91f17]" />
      <div className="min-w-0 flex-1"><p className="font-label text-xs font-bold uppercase tracking-widest text-gaucho-brushred">{event.type === 'BAILE' ? 'Baile' : 'Evento'} • {event.time ?? (event.date ? formatEventTime(event.date) : '')}</p><h3 className="mt-1 font-display text-2xl font-extrabold leading-tight">{event.title}</h3><p className="mt-1 truncate text-sm text-gaucho-ink/80"><FontAwesomeIcon icon={faLocationDot} className="mr-1.5" />{[event.place, event.city].filter(Boolean).join(' • ')}</p></div>
      <div className="hidden text-right sm:block"><p className="text-xs text-gaucho-ink/80">a partir de</p><b className="text-xl">{event.startingPrice ? formatCurrency(event.startingPrice) : 'Grátis'}</b></div>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gaucho-ink text-white transition group-hover:rotate-[-45deg] group-hover:bg-gaucho-brushred"><FontAwesomeIcon icon={faArrowRight} /></span>
    </div>
  </Link>;
}

function Learn({ turmas, courses }: { turmas: PublicEvent[]; courses: OnlineCourse[] }) {
  const { open } = useSiteModals();
  const turma = turmas[0]; const course = courses[0];
  return <div>
    <p className="max-w-lg text-lg opacity-90">No salão com a turma ou em casa no seu ritmo. Não precisa ter par nem experiência.</p>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <div className="flex flex-col rounded-3xl bg-gaucho-snow p-7 text-gaucho-ink shadow-xl"><p className="font-script text-4xl text-gaucho-brushred">presencial</p><h3 className="font-display text-3xl font-extrabold leading-tight">Curso de dança em turma</h3><ul className="mt-4 space-y-1.5 text-gaucho-ink/80"><li>• 10 aulas, uma vez por semana</li><li>• Taxa única, sem mensalidade</li><li>• Termina no Baile de Formatura</li></ul>{turma && <p className="mt-5 rounded-2xl bg-gaucho-brushgreen/10 p-4 text-sm"><b className="block text-base">Próxima turma: {turma.title}</b>{turma.date && `${formatShortDate(turma.date).day} ${formatShortDate(turma.date).month}`} • {[turma.place, turma.city].filter(Boolean).join(' • ')}</p>}<div className="mt-auto flex flex-wrap gap-2 pt-6">{turma && <Link href={`/loja/eventos/${encodeURIComponent(turma.slug ?? turma.id)}`} className="rounded-full bg-gaucho-brushgreen px-5 py-3 font-bold text-white">Fazer inscrição</Link>}<button onClick={() => open({ type: 'cursos' })} className="rounded-full border-2 border-gaucho-ink px-5 py-3 font-bold">Todas as turmas</button></div></div>
      {course ? <Link href={`/loja/cursos/${encodeURIComponent(course.slug)}`} className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-3xl bg-gaucho-ink p-7 text-white">{course.trailerUrl ? <video src={course.trailerUrl} autoPlay muted loop playsInline poster={course.image} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-105 group-hover:opacity-75" /> : course.image && <Image src={course.image} alt="" fill className="object-cover opacity-60" />}<div className="absolute inset-0 bg-gradient-to-t from-gaucho-ink via-gaucho-ink/30 to-transparent" /><span className="absolute right-6 top-6 flex h-16 w-16 items-center justify-center rounded-full bg-gaucho-brushgold text-xl text-gaucho-ink transition group-hover:scale-110"><FontAwesomeIcon icon={faPlay} /></span><div className="relative"><p className="font-script text-3xl text-gaucho-brushgold">online</p><h3 className="font-display text-3xl font-extrabold leading-tight">{course.title}</h3><p className="mt-2 text-white/85">{course.lessonsCount} aulas • até {course.maxDevices} aparelhos • {formatCurrency(course.price)}</p></div></Link> : <div className="rounded-3xl bg-gaucho-ink p-7 text-white"><p className="font-script text-3xl text-gaucho-brushgold">online</p><h3 className="font-display text-3xl font-extrabold">Aulas online em breve</h3></div>}
    </div>
  </div>;
}

function Wear({ products }: { products: Product[] }) {
  const list = products.filter((product) => !product.soldOut).slice(0, 4);
  return <div>
    <p className="max-w-lg text-lg opacity-90">Pilcha, acessórios e a camiseta oficial para levar o Coração Gaúcho com você.</p>
    <div className="mt-6 grid grid-cols-2 gap-4">{list.map((product, index) => <motion.div key={product.id} initial={{ opacity: 0, y: 20, rotate: index % 2 ? 2 : -2 }} animate={{ opacity: 1, y: 0, rotate: index % 2 ? 1 : -1 }} transition={{ delay: index * 0.07 }}><Link href={`/loja/produtos/${encodeURIComponent(product.slug)}`} className="group block rounded-3xl bg-white p-3 shadow-[0_10px_30px_rgba(40,25,10,.08)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:rotate-0"><div className="relative aspect-square overflow-hidden rounded-2xl bg-gaucho-paper">{product.images[0] && <Image src={product.images[0]} alt="" fill sizes="(max-width:768px) 45vw, 300px" className="object-cover transition duration-700 group-hover:scale-105" />}</div><div className="flex items-end justify-between gap-2 px-1 pb-1 pt-3"><b className="leading-tight">{product.title}</b><span className="shrink-0 rounded-full bg-gaucho-brushgold px-3 py-1 text-sm font-bold">{formatCurrency(product.price)}</span></div></Link></motion.div>)}</div>
    <Link href="/loja?categoria=produtos" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gaucho-ink px-6 py-4 font-bold text-white transition hover:gap-3">Ver todos os produtos<FontAwesomeIcon icon={faArrowRight} /></Link>
  </div>;
}
