'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faClock, faLocationDot, faTicket, faUsers } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency } from '@/utils/publicFormatters';

export type EventCardData = { id: string | number; title: string; city: string; place: string; date: string; month: string; time: string; price: number; remain?: number; image: string; type: string; color?: string; href?: string };
const themes = {
  CURSO: { border: 'border-gaucho-green/70', accent: 'bg-gaucho-green', text: 'text-green-400', hover: 'hover:bg-green-800' },
  BAILE: { border: 'border-gaucho-red/70', accent: 'bg-gaucho-red', text: 'text-red-400', hover: 'hover:bg-red-700' },
  EVENTO: { border: 'border-purple-600/70', accent: 'bg-purple-700', text: 'text-purple-300', hover: 'hover:bg-purple-600' },
  APRESENTAÇÃO: { border: 'border-purple-600/70', accent: 'bg-purple-700', text: 'text-purple-300', hover: 'hover:bg-purple-600' }
} as const;

export function EventCard({ event, onBuy, onDetails, buyHref, detailsHref, actionLabel }: { event: EventCardData; onBuy?: (event: EventCardData) => void; onDetails?: (event: EventCardData) => void; compact?: boolean; buyHref?: string; detailsHref?: string; actionLabel?: string }) {
  const type = event.type.toUpperCase(); const theme = themes[type as keyof typeof themes] ?? themes.EVENTO; const primary = actionLabel ?? (type === 'CURSO' ? 'FAZER INSCRIÇÃO' : 'COMPRAR INGRESSO');
  return <article className={`group flex min-h-[560px] flex-col overflow-hidden rounded-xl border bg-[#07130d] text-white shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:shadow-2xl ${theme.border}`}>
    <div className="relative h-48 shrink-0 overflow-hidden"><Image src={event.image || '/assets/bg-hero.png'} alt={`Banner de ${event.title}`} fill loading="lazy" sizes="(max-width:640px) 88vw, 340px" className="object-cover transition duration-500 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-[#07130d] via-black/25 to-transparent"/><div className={`absolute left-3 top-3 rounded-lg px-3 py-2 text-center font-black leading-none ${theme.accent}`}><span className="block text-2xl">{event.date}</span><span className="text-xs">{event.month}</span></div><span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[10px] font-black tracking-wide ${theme.accent}`}>{type}</span></div>
    <div className="flex flex-1 flex-col p-5"><span className={`text-xs font-black ${theme.text}`}>{type === 'CURSO' ? 'CURSO • TURMA' : type}</span><h3 className="mt-2 line-clamp-2 min-h-[58px] font-display text-2xl font-black leading-tight">{event.title}</h3>
      <div className="mt-4 space-y-2 text-sm text-white/75"><p><FontAwesomeIcon icon={faCalendarDays} className={`mr-2 w-4 ${theme.text}`}/>{event.date} {event.month}</p><p><FontAwesomeIcon icon={faClock} className={`mr-2 w-4 ${theme.text}`}/>{event.time || 'Horário a confirmar'}</p><p className="line-clamp-2"><FontAwesomeIcon icon={faLocationDot} className={`mr-2 w-4 ${theme.text}`}/>{event.place || 'Local a confirmar'}{event.city ? ` • ${event.city}` : ''}</p><p><FontAwesomeIcon icon={faTicket} className={`mr-2 w-4 ${theme.text}`}/><strong className={event.price <= 0 ? theme.text : 'text-gaucho-gold'}>{type === 'CURSO' ? 'Taxa' : 'Entrada'}: {event.price <= 0 ? 'Gratuita' : formatCurrency(event.price)}</strong></p><p><FontAwesomeIcon icon={faUsers} className={`mr-2 w-4 ${theme.text}`}/>{event.remain == null ? 'Vagas limitadas' : `${event.remain} vagas disponíveis`}</p></div>
      <div className="mt-auto grid grid-cols-2 gap-2 border-t border-white/10 pt-5">{detailsHref ? <Link aria-label={`Ver detalhes de ${event.title}`} href={detailsHref} className="flex min-h-16 items-center justify-center rounded-lg border border-white/25 px-2 text-center text-[10px] font-black leading-tight hover:bg-white/10">VER DETALHES</Link> : <button aria-label={`Ver detalhes de ${event.title}`} onClick={() => onDetails?.(event)} className="min-h-16 rounded-lg border border-white/25 px-2 text-[10px] font-black leading-tight hover:bg-white/10">VER DETALHES</button>}{buyHref ? <Link aria-label={`${primary}: ${event.title}`} href={buyHref} className={`flex min-h-16 items-center justify-center rounded-lg px-2 text-center text-[10px] font-black leading-tight ${theme.accent} ${theme.hover}`}>{primary}</Link> : <button aria-label={`${primary}: ${event.title}`} onClick={() => onBuy?.(event)} className={`min-h-16 rounded-lg px-2 text-[10px] font-black leading-tight ${theme.accent} ${theme.hover}`}>{primary}</button>}</div>
    </div>
  </article>;
}
