'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faLocationDot, faPlay } from '@fortawesome/free-solid-svg-icons';
import type { StoreItem } from '@/services/store/types';
import { formatCurrency, formatShortDate } from '@/utils/publicFormatters';

const accents = { ingressos: 'bg-gaucho-red', 'cursos-presenciais': 'bg-gaucho-green', 'cursos-online': 'bg-gaucho-gold text-black', produtos: 'bg-white text-gaucho-ink' } as const;
const cta = { ingressos: 'Garantir ingresso', 'cursos-presenciais': 'Fazer inscrição', 'cursos-online': 'Conhecer o curso', produtos: 'Ver produto' } as const;

export function StoreCard({ item, index = 0 }: { item: StoreItem; index?: number }) {
  const date = item.date ? formatShortDate(item.date) : null;
  const discount = item.compareAtPrice && item.compareAtPrice > item.price ? Math.round((1 - item.price / item.compareAtPrice) * 100) : 0;
  return <motion.article initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_14px_40px_rgba(40,25,10,.10)] ring-1 ring-black/5 transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(40,25,10,.18)]">
    <span aria-hidden="true" className="flag-sash absolute inset-x-0 top-0 z-10 h-1.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
    <Link href={item.href} className="relative block aspect-[4/3] overflow-hidden bg-gaucho-ink" aria-label={item.title}>
      {item.image && <Image src={item.image} alt="" fill sizes="(max-width:640px) 90vw, 320px" className={`object-cover transition duration-700 group-hover:scale-105 ${item.soldOut ? 'grayscale' : ''}`} />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className={`absolute left-3 top-4 rounded-full px-3 py-1 font-label text-xs font-bold uppercase tracking-wider ${accents[item.category]}`}>{item.badge}</span>
      {date && <span className="absolute right-3 top-4 rounded-lg bg-white px-2.5 py-1.5 text-center font-label font-bold leading-none text-black shadow"><b className="block text-xl">{date.day}</b><span className="text-[11px] uppercase">{date.month}</span></span>}
      {item.kind === 'COURSE' && <span className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-gaucho-gold text-black shadow-lg transition group-hover:scale-110"><FontAwesomeIcon icon={faPlay} /></span>}
      {item.soldOut && <span className="absolute inset-x-0 bottom-0 bg-black/80 py-2 text-center font-label text-sm font-bold uppercase tracking-widest text-white">Esgotado</span>}
    </Link>
    <div className="flex flex-1 flex-col p-5">
      <h3 className="font-display text-xl font-black leading-tight text-gaucho-ink"><Link href={item.href} className="hover:text-gaucho-green">{item.title}</Link></h3>
      {item.subtitle && <p className="mt-1.5 line-clamp-2 text-sm text-black/55">{item.subtitle}</p>}
      {(item.city || item.place) && <p className="mt-2 truncate text-sm text-black/55"><FontAwesomeIcon icon={faLocationDot} className="mr-1.5 text-gaucho-red" />{[item.place, item.city].filter(Boolean).join(' • ')}</p>}
      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <div>{discount > 0 && <span className="block text-xs text-black/40 line-through">{formatCurrency(item.compareAtPrice ?? 0)}</span>}<b className="text-xl text-gaucho-ink">{item.price <= 0 ? 'Gratuito' : formatCurrency(item.price)}</b>{discount > 0 && <span className="ml-2 rounded bg-gaucho-red/10 px-1.5 py-0.5 text-xs font-black text-gaucho-red">-{discount}%</span>}</div>
        <Link href={item.href} className="inline-flex items-center gap-2 font-label text-sm font-bold uppercase tracking-wider text-gaucho-green transition group-hover:gap-3">{cta[item.category]}<FontAwesomeIcon icon={faArrowRight} /></Link>
      </div>
    </div>
  </motion.article>;
}
