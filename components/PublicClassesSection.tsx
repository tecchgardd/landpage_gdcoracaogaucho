'use client';
import { useEffect, useState } from 'react';
import { AutoCarousel } from './AutoCarousel';
import { EventCard, type EventCardData } from './EventCard';
import { EmptyState, ErrorState, SkeletonRow } from './PublicDataState';
import { publicClassService } from '@/services/public/publicClassService';
import type { PublicClass } from '@/services/public/types';
import { formatEventTime, formatShortDate } from '@/utils/publicFormatters';

export function PublicClassesSection() {
  const [classes, setClasses] = useState<PublicClass[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(false);
  useEffect(() => { let active = true; publicClassService.listAvailable().then((items) => { if (active) setClasses(items); }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  if (loading) return <SkeletonRow count={3} className="h-[560px] w-[320px]" />;
  if (error) return <ErrorState text="Não foi possível carregar as turmas disponíveis. Tente novamente em instantes." />;
  if (!classes.length) return <EmptyState title="Novas turmas em breve" text="No momento não temos turmas abertas, mas logo teremos novas oportunidades para você aprender e viver a tradição gaúcha." />;
  return <AutoCarousel itemClassName="w-[min(88vw,340px)]" speed="slow">{classes.map((item) => { const href = `/bilheteria/eventos/${encodeURIComponent(item.slug ?? item.id)}`; return <EventCard key={item.id} event={toCard(item)} detailsHref={href} buyHref={href} actionLabel="FAZER INSCRIÇÃO"/>; })}</AutoCarousel>;
}
function toCard(item: PublicClass): EventCardData { const short = formatShortDate(item.startsAt); return { id: item.id, title: item.title, city: item.city ?? '', place: item.place ?? '', date: short.day, month: short.month, time: item.time ?? formatEventTime(item.startsAt), price: item.signupFee ?? 0, remain: item.availableSpots, image: item.image ?? '/assets/bg-hero.png', type: 'CURSO' }; }
