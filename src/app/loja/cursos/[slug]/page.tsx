'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faChevronDown, faClock, faLaptop, faLock, faMobileScreen, faPlay, faSignal } from '@fortawesome/free-solid-svg-icons';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { cartKey, useCart } from '@/components/providers/CartProvider';
import { FlagSash } from '@/components/ui/FlagSash';
import { courseAccessService } from '@/services/courses/courseAccessService';
import { storeService } from '@/services/store/storeService';
import type { OnlineCourse } from '@/services/store/types';
import { formatCurrency } from '@/utils/publicFormatters';

const faq = [
  ['Como recebo o acesso?', 'Assim que o pagamento é aprovado, o curso aparece na sua Área do aluno com um código de acesso vinculado à sua conta. Pix libera na hora; boleto, em até 2 dias úteis.'],
  ['Posso assistir no celular e na TV?', 'Sim. Você pode entrar de qualquer aparelho com navegador, e até 2 aparelhos podem assistir ao mesmo tempo. Se um terceiro tentar entrar, você escolhe qual sessão encerrar.'],
  ['Posso dividir a conta com amigos?', 'O acesso é pessoal e intransferível. O limite de aparelhos simultâneos existe para proteger o trabalho dos professores. Para presentear alguém, compre um novo acesso.'],
  ['Recebo nota fiscal?', 'Sim. A nota fiscal é emitida automaticamente com os dados do seu cadastro depois da confirmação do pagamento.']
];

export default function CoursePage({ params }: { params: { slug: string } }) {
  const cart = useCart(); const router = useRouter(); const { user } = useAuth();
  const [course, setCourse] = useState<OnlineCourse | null>(null);
  const [error, setError] = useState(false);
  const [owned, setOwned] = useState(false);
  const [open, setOpen] = useState(0);
  useEffect(() => { storeService.course(params.slug).then(setCourse).catch(() => setError(true)); }, [params.slug]);
  useEffect(() => { if (user && course) courseAccessService.myCourses().then((list) => setOwned(list.some((access) => access.course.id === course.id && access.status === 'ATIVO'))).catch(() => undefined); }, [user, course]);

  if (error) return <main className="min-h-screen bg-gaucho-paper"><Header active="loja" /><div className="px-6 pt-44 text-center"><h1 className="font-display text-4xl font-black">Curso não encontrado.</h1><Link href="/loja?categoria=cursos-online" className="mt-6 inline-block rounded-xl bg-gaucho-red px-6 py-3 font-black text-white">Ver cursos online</Link></div></main>;
  if (!course) return <main className="min-h-screen bg-gaucho-night"><Header active="loja" /><div className="mx-auto max-w-6xl px-6 pt-40"><div className="h-96 animate-pulse rounded-3xl bg-white/10" /></div></main>;
  const inCart = cart.has(cartKey.course(course.id));
  const buy = () => { if (!inCart) cart.addCourse(course); router.push('/carrinho'); };
  const hours = Math.max(1, Math.round(course.durationMinutes / 60));

  return <main className="min-h-screen bg-gaucho-paper text-gaucho-ink"><Header active="loja" />
    <section className="grain relative overflow-hidden bg-gaucho-night pb-20 pt-32 text-white">
      {course.trailerUrl && <video src={course.trailerUrl} autoPlay muted loop playsInline poster={course.image} aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
      <div className="absolute inset-0 bg-gradient-to-r from-gaucho-night via-gaucho-night/85 to-gaucho-night/30" />
      <FlagSash className="absolute -left-20 bottom-10 h-16 w-[380px] rotate-[18deg] opacity-80" delay={0.5} />
      <div className="relative mx-auto max-w-6xl px-6">
        <Link href="/loja?categoria=cursos-online" className="inline-flex items-center gap-2 text-sm font-bold text-white/60 hover:text-gaucho-gold"><FontAwesomeIcon icon={faArrowLeft} />Cursos online</Link>
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mt-6 max-w-3xl">
          <p className="eyebrow text-gaucho-gold">Curso online {course.level && `• ${course.level}`}</p>
          <h1 className="mt-3 font-display text-5xl font-black leading-[0.95] md:text-7xl">{course.title}</h1>
          {course.subtitle && <p className="mt-5 max-w-xl text-lg text-white/75">{course.subtitle}</p>}
          <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3 font-label text-sm font-bold uppercase tracking-wider text-white/80"><li><FontAwesomeIcon icon={faPlay} className="mr-2 text-gaucho-gold" />{course.lessonsCount} aulas</li><li><FontAwesomeIcon icon={faClock} className="mr-2 text-gaucho-gold" />{hours}h de conteúdo</li><li><FontAwesomeIcon icon={faMobileScreen} className="mr-2 text-gaucho-gold" />Até {course.maxDevices} aparelhos</li>{course.accessDays && <li><FontAwesomeIcon icon={faSignal} className="mr-2 text-gaucho-gold" />Acesso por {Math.round(course.accessDays / 30)} meses</li>}</ul>
        </motion.div>
      </div>
    </section>

    <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1fr_360px]">
      <div className="space-y-14">
        {course.description && <div><h2 className="font-display text-3xl font-black">Sobre o curso</h2><p className="mt-4 text-lg leading-8 text-black/70">{course.description}</p></div>}
        {course.highlights.length > 0 && <ul className="grid gap-3 sm:grid-cols-2">{course.highlights.map((text) => <li key={text} className="flex items-center gap-3 rounded-2xl bg-white p-4 font-bold shadow-sm ring-1 ring-black/5"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gaucho-green text-sm text-white"><FontAwesomeIcon icon={faCheck} /></span>{text}</li>)}</ul>}
        <div><h2 className="font-display text-3xl font-black">O que você vai aprender</h2><div className="mt-5 divide-y divide-black/10 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">{course.modules.map((module, index) => <div key={module.id}><button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index} className="flex w-full items-center justify-between gap-4 p-5 text-left"><span><span className="font-label text-sm font-bold uppercase tracking-wider text-gaucho-red">Módulo {index + 1}</span><b className="block text-lg">{module.title}</b></span><span className="flex items-center gap-3 text-sm text-black/50">{module.lessons.length} aulas<FontAwesomeIcon icon={faChevronDown} className={`transition ${open === index ? 'rotate-180' : ''}`} /></span></button>{open === index && <ol className="space-y-1 px-5 pb-5">{module.lessons.map((lesson) => <li key={lesson.id} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-black/[.03]"><span className="flex items-center gap-3"><FontAwesomeIcon icon={lesson.preview ? faPlay : faLock} className={lesson.preview ? 'text-gaucho-green' : 'text-black/30'} />{lesson.title}{lesson.preview && <span className="rounded bg-gaucho-green/10 px-1.5 py-0.5 text-[11px] font-black text-gaucho-green">AMOSTRA</span>}</span>{lesson.durationMinutes && <span className="text-black/40">{lesson.durationMinutes} min</span>}</li>)}</ol>}</div>)}</div></div>
        <div className="grid gap-5 rounded-3xl bg-gaucho-ink p-8 text-white md:grid-cols-[auto_1fr] md:items-center"><span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gaucho-gold text-2xl text-black"><FontAwesomeIcon icon={faLaptop} /></span><div><h3 className="font-display text-2xl font-black">Seu acesso, seus aparelhos</h3><p className="mt-2 text-white/70">Cada compra gera um código de acesso vinculado à sua conta. Assista no celular, computador ou TV com navegador — até {course.maxDevices} ao mesmo tempo. Você vê e desconecta aparelhos em <b className="text-white">Minha conta › Dispositivos</b>.</p></div></div>
        <div><h2 className="font-display text-3xl font-black">Perguntas frequentes</h2><div className="mt-5 space-y-3">{faq.map(([question, answer]) => <details key={question} className="group rounded-2xl bg-white p-5 ring-1 ring-black/5"><summary className="flex cursor-pointer list-none items-center justify-between font-bold">{question}<FontAwesomeIcon icon={faChevronDown} className="text-black/40 transition group-open:rotate-180" /></summary><p className="mt-3 leading-7 text-black/65">{answer}</p></details>)}</div></div>
      </div>
      <aside className="h-fit rounded-3xl bg-white p-7 shadow-[0_24px_60px_rgba(40,25,10,.14)] ring-1 ring-black/5 lg:sticky lg:top-8">
        {course.compareAtPrice && <p className="text-black/40 line-through">{formatCurrency(course.compareAtPrice)}</p>}
        <p className="font-display text-5xl font-black">{formatCurrency(course.price)}</p>
        <p className="mt-1 text-sm text-black/50">Pagamento único • Pix, boleto ou cartão</p>
        {owned ? <Link href={`/aulas/${course.slug}`} className="btn-premium mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-gaucho-green py-4 font-black uppercase text-white"><FontAwesomeIcon icon={faPlay} />Ir para as aulas</Link> : <button onClick={buy} className="btn-premium mt-6 w-full rounded-xl bg-gaucho-red py-4 font-black uppercase text-white">{inCart ? 'Ir para o carrinho' : 'Quero esse curso'}</button>}
        <ul className="mt-6 space-y-3 border-t border-black/10 pt-6 text-sm text-black/65"><li><FontAwesomeIcon icon={faCheck} className="mr-2 text-gaucho-green" />Acesso imediato após a aprovação</li><li><FontAwesomeIcon icon={faCheck} className="mr-2 text-gaucho-green" />Nota fiscal emitida automaticamente</li><li><FontAwesomeIcon icon={faCheck} className="mr-2 text-gaucho-green" />Reveja as aulas quantas vezes quiser</li></ul>
      </aside>
    </section><Footer /></main>;
}
