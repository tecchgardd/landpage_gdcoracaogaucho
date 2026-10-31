'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { PromotionalCtaModal } from './PromotionalCtaModal';
import { promotionalCtaDefinitions, type PromotionalCta } from './promotionalCtaDefinitions';
import { PromotionalCtaContext } from './usePromotionalCta';
import { useConsent } from '../consent/ConsentProvider';
import { readCookie, writeCookie } from '@/utils/cookies';

const STORAGE_KEY = 'gd-coracao-gaucho-promotional-ctas-v1';
const SESSION_KEY = `${STORAGE_KEY}-session`;
const DAY = 24 * 60 * 60 * 1000;
const INTERVAL = 90 * 1000;
type ItemHistory = { lastShownAt?: number; dismissedAt?: number; clickedAt?: number };
type LocalHistory = { items: Record<string, ItemHistory> };
type SessionHistory = { count: number; lastShownAt: number; seen: string[] };
const emptyLocal = (): LocalHistory => ({ items: {} });
const emptySession = (): SessionHistory => ({ count: 0, lastShownAt: 0, seen: [] });
// Histórico de exibição: cookie de 30 dias só com consentimento de "Preferências"; sem ele, dura a sessão.
const CTA_COOKIE = 'cg_cta';
let persistent = false;
function read<T>(key: string, fallback: T): T { try { const value = persistent ? readCookie(CTA_COOKIE) : window.sessionStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; } catch { return fallback; } }
function readSession(): SessionHistory { try { const value = window.sessionStorage.getItem(SESSION_KEY); return value ? JSON.parse(value) as SessionHistory : emptySession(); } catch { return emptySession(); } }
function write(key: string, value: unknown, session = false) { try { if (!session && persistent) writeCookie(CTA_COOKIE, JSON.stringify(value), 30 * 24 * 60 * 60); else window.sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* Storage can be unavailable in private browsing. */ } }

// Em stand-by na home desde o redesign (a página nova tem os próprios CTAs e modais).
function routeBlocksAll(pathname: string) { return pathname === '/' || pathname === '/checkout' || pathname === '/login' || pathname === '/cadastro' || pathname.startsWith('/minha-conta') || pathname.startsWith('/aulas') || pathname.startsWith('/pedido'); }
function allowedOnRoute(cta: PromotionalCta, pathname: string) {
  if (routeBlocksAll(pathname)) return false;
  if (cta.id === 'bilheteria-social' && (pathname.startsWith('/loja') || pathname === '/carrinho')) return false;
  if (cta.id === 'online-courses' && (pathname.startsWith('/loja') || pathname.startsWith('/aulas'))) return false;
  if (cta.id === 'new-events-classes' && (pathname.startsWith('/loja') || pathname === '/curso')) return false;
  if (cta.id === 'graduation-albums' && pathname.startsWith('/blog')) return false;
  return true;
}
function interactionBlocksModal() {
  if (document.visibilityState !== 'visible' || document.fullscreenElement) return true;
  const active = document.activeElement;
  if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement || active?.getAttribute('contenteditable') === 'true') return true;
  return Boolean(document.querySelector('[role="dialog"], [role="menu"], [aria-modal="true"], [class*="fixed"][class*="inset-0"]'));
}

export function PromotionalCtaProvider({ children }: { children: React.ReactNode }) {
  const { consent, decided } = useConsent(); useEffect(() => { persistent = Boolean(consent?.preferences); }, [consent]);
  const pathname = usePathname() ?? '/'; const [active, setActive] = useState<PromotionalCta | null>(null); const [armed, setArmed] = useState(false); const closeReason = useRef<'dismissedAt' | 'clickedAt'>('dismissedAt');
  useEffect(() => { if (routeBlocksAll(pathname)) return; const timer = window.setTimeout(() => setArmed(true), 25_000); const scroll = () => { const available = document.documentElement.scrollHeight - window.innerHeight; if (available > 0 && window.scrollY / available >= .35) setArmed(true); }; window.addEventListener('scroll', scroll, { passive: true }); scroll(); return () => { clearTimeout(timer); window.removeEventListener('scroll', scroll); }; }, [pathname]);
  const choose = useCallback(() => { if (!decided || !armed || active || routeBlocksAll(pathname) || interactionBlocksModal()) return; const session = readSession(); const now = Date.now(); if (session.count >= 2 || now - session.lastShownAt < INTERVAL) return; const local = read<LocalHistory>(STORAGE_KEY, emptyLocal()); const next = promotionalCtaDefinitions.filter((cta) => allowedOnRoute(cta, pathname) && !session.seen.includes(cta.id) && now - (local.items[cta.id]?.lastShownAt ?? 0) >= DAY).sort((a, b) => b.priority - a.priority)[0]; if (!next) return;
    const updatedSession = { count: session.count + 1, lastShownAt: now, seen: [...session.seen, next.id] }; const updatedLocal = { items: { ...local.items, [next.id]: { ...local.items[next.id], lastShownAt: now } } }; write(SESSION_KEY, updatedSession, true); write(STORAGE_KEY, updatedLocal); closeReason.current = 'dismissedAt'; setActive(next);
  }, [active, armed, pathname, decided]);
  useEffect(() => { if (!armed || active) return; choose(); const timer = window.setInterval(choose, 2_000); return () => clearInterval(timer); }, [active, armed, choose]);
  const close = useCallback((clicked = false) => { setActive((current) => { if (!current) return null; const local = read<LocalHistory>(STORAGE_KEY, emptyLocal()); const field = clicked ? 'clickedAt' : closeReason.current; write(STORAGE_KEY, { items: { ...local.items, [current.id]: { ...local.items[current.id], [field]: Date.now() } } }); return null; }); }, []);
  const context = useMemo(() => ({ active, close }), [active, close]);
  return <PromotionalCtaContext.Provider value={context}>{children}<AnimatePresence>{active && <PromotionalCtaModal key={active.id} cta={active} onClose={() => close(false)} onAction={() => { closeReason.current = 'clickedAt'; close(true); }}/>}</AnimatePresence></PromotionalCtaContext.Provider>;
}
