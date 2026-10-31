'use client';

import Link from 'next/link';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faMobileScreen, faPlay, faShieldHalved, faTicket } from '@fortawesome/free-solid-svg-icons';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SocialFloat } from '@/components/layout/SocialFloat';
import { StoreCard } from '@/components/store/StoreCard';
import { FlagSash } from '@/components/ui/FlagSash';
import { EmptyState, ErrorState, SkeletonRow } from '@/components/ui/PublicDataState';
import { storeService } from '@/services/store/storeService';
import { storeCategories, type StoreCategory, type StoreItem } from '@/services/store/types';

export default function StorePage() {
  return <Suspense fallback={null}><Store /></Suspense>;
}

function Store() {
  const params = useSearchParams(); const router = useRouter();
  const category = (params.get('categoria') ?? 'tudo') as StoreCategory | 'tudo';
  const [items, setItems] = useState<StoreItem[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { storeService.catalog().then(({ items, failed }) => { setItems(items); setFailed(failed); }).finally(() => setLoading(false)); }, []);

  const filtered = useMemo(() => items.filter((item) => (category === 'tudo' || item.category === category) && `${item.title} ${item.subtitle ?? ''} ${item.city ?? ''}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))).sort((a, b) => Number(a.soldOut) - Number(b.soldOut)), [items, category, search]);
  const counts = useMemo(() => Object.fromEntries(storeCategories.map(({ id }) => [id, id === 'tudo' ? items.length : items.filter((item) => item.category === id).length])), [items]);
  const featured = items.find((item) => item.kind === 'COURSE');
  const select = (id: string) => router.replace(id === 'tudo' ? '/loja' : `/loja?categoria=${id}`, { scroll: false });

  return (
    <main className="min-h-screen bg-gaucho-paper text-gaucho-ink">
      <Header active="loja" /><SocialFloat />
      <section className="grain relative overflow-hidden bg-gaucho-night pb-16 pt-36 text-white">
        <FlagSash className="absolute -right-24 top-24 h-24 w-[520px] -rotate-[24deg] opacity-90 md:h-28" />
        <div className="relative mx-auto max-w-7xl px-6">
          <p className="eyebrow text-gaucho-gold">Loja oficial</p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="mt-3 max-w-3xl font-display text-5xl font-black leading-[0.95] md:text-7xl">Tudo do Coração Gaúcho <em className="text-gaucho-gold">num só galpão.</em></motion.h1>
          <p className="mt-5 max-w-xl text-lg text-white/70">Ingressos de bailes, inscrições nas turmas, aulas online para dançar em casa e a pilcha do grupo.</p>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70"><li><FontAwesomeIcon icon={faShieldHalved} className="mr-2 text-gaucho-gold" />Pix, boleto ou cartão com nota fiscal</li><li><FontAwesomeIcon icon={faTicket} className="mr-2 text-gaucho-gold" />Ingresso com QR code na sua conta</li><li><FontAwesomeIcon icon={faMobileScreen} className="mr-2 text-gaucho-gold" />Aulas online em até 2 aparelhos</li></ul>
        </div>
      </section>

      <div className="sticky top-0 z-40 border-b border-black/5 bg-gaucho-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Categorias da loja" className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1">{storeCategories.map(({ id, label }) => <button key={id} onClick={() => select(id)} aria-pressed={category === id} className={`relative shrink-0 rounded-full px-4 py-2 font-label text-sm font-bold uppercase tracking-wider transition ${category === id ? 'text-white' : 'text-black/60 hover:text-black'}`}>{category === id && <motion.span layoutId="store-chip" className="absolute inset-0 rounded-full bg-gaucho-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}<span className="relative">{label}{!loading && <span className="ml-1.5 opacity-50">{counts[id]}</span>}</span></button>)}</nav>
          <label className="relative block md:w-72"><span className="sr-only">Buscar na loja</span><FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar baile, curso, produto…" className="w-full rounded-full border border-black/10 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-gaucho-green focus:ring-2 focus:ring-gaucho-green/15" /></label>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-10">
        {featured && (category === 'tudo' || category === 'cursos-online') && !search && <FeaturedCourse item={featured} />}
        {failed.length > 0 && !loading && <p className="mb-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-900 ring-1 ring-amber-200">Não conseguimos carregar {failed.join(' e ')} agora. O restante da loja está disponível.</p>}
        {loading ? <SkeletonRow count={4} className="h-96 w-72" /> : !items.length && failed.length ? <ErrorState text="Não foi possível carregar a loja agora. Tente novamente em instantes." /> : filtered.length === 0 ? <EmptyState title="Nada por aqui ainda" text="Não encontramos itens nesta categoria. Confira as outras seções da loja ou volte em breve." /> : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((item, index) => <StoreCard key={item.key} item={item} index={index} />)}</div>
        )}
      </section>
      <Footer />
    </main>
  );
}

function FeaturedCourse({ item }: { item: StoreItem }) {
  const course = item.course;
  return <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="relative mb-10 overflow-hidden rounded-3xl bg-gaucho-green text-white md:grid md:grid-cols-[1.1fr_1fr]">
    <div className="relative z-10 p-8 md:p-12"><p className="eyebrow text-gaucho-gold">Novo • curso online</p><h2 className="mt-3 font-display text-4xl font-black leading-tight md:text-5xl">{item.title}</h2>{item.subtitle && <p className="mt-3 max-w-md text-white/75">{item.subtitle}</p>}{course && <p className="mt-5 font-label text-sm font-bold uppercase tracking-wider text-white/80">{course.lessonsCount} aulas • {Math.round(course.durationMinutes / 60)}h de conteúdo • até {course.maxDevices} aparelhos</p>}<Link href={item.href} className="btn-premium mt-7 inline-flex items-center gap-3 rounded-xl bg-gaucho-gold px-7 py-4 font-black uppercase text-black"><FontAwesomeIcon icon={faPlay} />Ver aulas e preço</Link></div>
    <div className="relative min-h-[240px]">{course?.trailerUrl ? <video src={course.trailerUrl} autoPlay muted loop playsInline poster={item.image} className="absolute inset-0 h-full w-full object-cover" /> : item.image && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${item.image}")` }} />}<div className="absolute inset-0 bg-gradient-to-r from-gaucho-green via-gaucho-green/20 to-transparent md:via-transparent" /></div>
  </motion.div>;
}
