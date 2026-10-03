'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { ctaThemeClasses, type PromotionalCta, type PromotionalCtaAction } from './promotionalCtaDefinitions';

export function PromotionalCtaModal({ cta, onClose, onAction }: { cta: PromotionalCta; onClose: () => void; onAction: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null); const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => { previousFocus.current = document.activeElement as HTMLElement; const body = document.body; const scrollY = window.scrollY; const padding = window.innerWidth - document.documentElement.clientWidth; body.style.overflow = 'hidden'; body.style.paddingRight = `${padding}px`; dialogRef.current?.focus();
    const keydown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); if (event.key !== 'Tab') return; const nodes = dialogRef.current?.querySelectorAll<HTMLElement>('a[href],button:not([disabled])'); if (!nodes?.length) return; const first = nodes[0]; const last = nodes[nodes.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } };
    document.addEventListener('keydown', keydown); return () => { document.removeEventListener('keydown', keydown); body.style.overflow = ''; body.style.paddingRight = ''; window.scrollTo(0, scrollY); previousFocus.current?.focus(); };
  }, [onClose]);
  const theme = ctaThemeClasses[cta.theme];
  return <div className="promotional-cta-backdrop fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={`cta-title-${cta.id}`} aria-describedby={`cta-description-${cta.id}`} className="promotional-cta-modal relative grid max-h-[92vh] w-[92vw] max-w-[860px] overflow-y-auto rounded-3xl border border-white/15 bg-[#0b100d] text-white shadow-[0_30px_100px_rgba(0,0,0,.8)] outline-none md:grid-cols-[1.08fr_.92fr] md:overflow-hidden">
      <button onClick={onClose} aria-label="Fechar promoção" className="sticky right-4 top-4 z-20 ml-auto mr-4 mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/80 text-xl hover:border-gaucho-gold md:absolute"><FontAwesomeIcon icon={faXmark}/></button>
      <div className="order-2 flex flex-col justify-center p-6 pt-3 md:order-1 md:p-10"><span className={`w-fit rounded-full px-4 py-2 text-[11px] font-black tracking-[.18em] ${theme.badge}`}>{cta.badge}</span><h2 id={`cta-title-${cta.id}`} className="mt-5 font-display text-4xl font-black leading-[1.04] md:text-5xl">{cta.title} <span className="text-gaucho-gold">{cta.highlight}</span></h2><p id={`cta-description-${cta.id}`} className="mt-4 max-w-xl leading-7 text-white/70">{cta.description}</p><div className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2"><CtaAction action={cta.primaryAction} primary className={theme.accent} onClick={onAction}/>{cta.secondaryAction && <CtaAction action={cta.secondaryAction} onClick={onAction}/>}</div><button onClick={onClose} className="mt-4 min-h-11 text-sm font-bold text-white/55 hover:text-white">Agora não</button></div>
      <div className="relative order-1 h-52 overflow-hidden md:order-2 md:h-auto md:min-h-[480px]"><Image src={cta.image} alt="" fill sizes="(max-width: 768px) 92vw, 390px" className={`object-cover ${cta.theme === 'social' ? 'object-contain p-12' : ''}`}/><div className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r ${theme.glow}`}/></div>
    </div>
  </div>;
}
function CtaAction({ action, primary = false, className = '', onClick }: { action: PromotionalCtaAction; primary?: boolean; className?: string; onClick: () => void }) { const classes = `flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-center text-sm font-black transition ${primary ? className : 'border border-white/25 bg-white/5 hover:bg-white/10'}`; return action.external ? <a href={action.href} target="_blank" rel="noopener noreferrer" aria-label={action.ariaLabel} onClick={onClick} className={classes}>{action.label}</a> : <Link href={action.href} onClick={onClick} className={classes}>{action.label}</Link>; }
