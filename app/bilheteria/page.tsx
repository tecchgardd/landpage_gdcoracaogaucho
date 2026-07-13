'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { SocialFloat } from '@/components/SocialFloat';
import { Footer } from '@/components/Footer';
import { EventCard, type EventCardData } from '@/components/EventCard';
import { EmptyState, ErrorState, SkeletonRow } from '@/components/PublicDataState';
import { ticketService } from '@/services/public/ticketService';
import type { PublicEvent } from '@/services/public/types';
import { useCart } from '@/components/providers/CartProvider';
import { formatEventTime, formatShortDate } from '@/utils/publicFormatters';

export default function TicketOfficePage() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('TODOS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const cart = useCart();

  useEffect(() => {
    ticketService.listAvailableEvents().then(setEvents).catch(() => setError(true)).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => events.filter((event) => {
    const text = `${event.title} ${event.city ?? ''} ${event.place ?? ''}`.toLocaleLowerCase('pt-BR');
    return (type === 'TODOS' || event.type === type) && text.includes(search.toLocaleLowerCase('pt-BR'));
  }), [events, search, type]);

  return (
    <main className="min-h-screen bg-[#f7efe1] text-[#17130f]">
      <Header active="bilheteria" /><SocialFloat />
      <section className="relative mx-auto max-w-7xl overflow-hidden px-6 pb-24 pt-36">
        <div className="pointer-events-none absolute -right-32 top-20 h-80 w-80 rounded-full bg-gaucho-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-40 top-72 h-96 w-96 rounded-full bg-gaucho-green/10 blur-3xl" />
        <p className="relative font-black tracking-widest text-gaucho-red">EVENTOS REAIS E VAGAS ATUALIZADAS</p>
        <h1 className="mt-3 font-display text-5xl font-black md:text-7xl">Bilheteria</h1>
        <p className="relative mt-3 max-w-2xl text-lg leading-8 text-black/60">Encontre seu próximo baile, evento ou curso e garanta sua participação com segurança.</p>
        <div className="relative mt-8 grid gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-[0_18px_50px_rgba(55,35,15,.12)] md:grid-cols-[1fr_220px]">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar evento, cidade ou local" className="rounded-xl border border-black/10 bg-[#fcfaf6] px-5 py-4 text-black outline-none transition focus:border-gaucho-gold focus:ring-2 focus:ring-gaucho-gold/20" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="rounded-xl border border-black/10 bg-[#fcfaf6] px-5 py-4 text-black outline-none transition focus:border-gaucho-gold"><option value="TODOS">Todos os tipos</option><option value="BAILE">Bailes</option><option value="EVENTO">Eventos</option><option value="CURSO">Cursos</option></select>
        </div>
        <div className="relative mt-10">
          {loading ? <SkeletonRow count={4} className="h-96 w-72" /> : error ? <ErrorState text="Não foi possível carregar a bilheteria agora. Tente novamente em instantes." /> : filtered.length === 0 ? <EmptyState title="Nenhum evento disponível no momento" text="Estamos preparando novas experiências para você. Volte em breve para conferir os próximos eventos do GD Coração Gaúcho." /> : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map((event) => <EventCard key={event.id} event={toCard(event)} detailsHref={`/bilheteria/eventos/${encodeURIComponent(event.slug ?? event.id)}`} onBuy={() => cart.add(event)} actionLabel={cart.has(Number(event.id)) ? 'VER NO CARRINHO' : event.type === 'CURSO' ? 'FAZER INSCRIÇÃO' : 'COMPRAR INGRESSO'} />)}</div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function toCard(event: PublicEvent): EventCardData {
  const short = formatShortDate(event.date);
  return {
    id: event.id,
    title: event.title,
    city: event.city ?? '',
    place: event.place ?? '',
    date: short.day,
    month: short.month,
    time: event.time ?? formatEventTime(event.date),
    price: event.startingPrice ?? 0,
    remain: event.available ?? undefined,
    image: event.image ?? '/assets/bg-hero.png',
    type: event.type ?? 'EVENTO',
    color: event.type === 'BAILE' ? 'red' : event.type === 'CURSO' ? 'green' : 'gold'
  };
}
