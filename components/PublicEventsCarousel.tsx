'use client';

import { useEffect, useMemo, useState } from 'react';
import { AutoCarousel } from '@/components/AutoCarousel';
import { EventCard, EventCardData } from '@/components/EventCard';
import { EmptyState, ErrorState, SkeletonRow } from '@/components/PublicDataState';
import { publicEventService } from '@/services/public/publicEventService';
import { PublicEvent } from '@/services/public/types';
import { formatEventTime, formatShortDate } from '@/utils/publicFormatters';

export function PublicEventsCarousel() {
  const [events, setEvents] = useState<PublicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    publicEventService
      .list()
      .then((items) => {
        if (active) setEvents(items);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const cards = useMemo(() => events.map(mapEventToCard), [events]);

  if (loading) return <SkeletonRow count={4} className="h-[560px] w-[320px]" />;
  if (error) return <ErrorState text="Não foi possível carregar os próximos eventos. Tente novamente em instantes." />;
  if (cards.length === 0) {
    return (
      <EmptyState
        title="Nenhum evento disponível no momento"
        text="Estamos preparando novas experiências para você. Acompanhe nossas redes sociais e volte em breve para conferir as próximas novidades."
      />
    );
  }

  return (
    <AutoCarousel itemClassName="w-[300px] sm:w-[320px]" speed="slow">
      {cards.map((event) => (
        <EventCard key={event.id} event={event} compact detailsHref={event.href} buyHref={event.href} />
      ))}
    </AutoCarousel>
  );
}

function mapEventToCard(event: PublicEvent): EventCardData {
  const shortDate = formatShortDate(event.date);

  return {
    id: event.id,
    title: event.title,
    city: event.city ?? '',
    place: event.place ?? '',
    date: shortDate.day,
    month: shortDate.month,
    time: event.time ?? formatEventTime(event.date),
    price: event.startingPrice ?? 0,
    remain: event.available ?? undefined,
    image: event.image ?? '/assets/bg-hero.png',
    type: event.type ?? 'EVENTO',
    color: event.type === 'BAILE' ? 'red' : 'gold',
    href: `/bilheteria/eventos/${encodeURIComponent(event.slug ?? event.id)}`
  };
}
