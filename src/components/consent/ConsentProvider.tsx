'use client';
import Link from 'next/link';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { publicApiPost } from '@/services/public/apiClient';
import { readCookie, writeCookie } from '@/utils/cookies';

// Consentimento LGPD. Cookies necessários (sessão, carrinho, aparelho, pedido em andamento) não
// dependem de aceite; preferências e mídia de terceiros (YouTube) só depois do "sim".
export const CONSENT_VERSION = 1;
const COOKIE = 'cg_consent';
const YEAR = 365 * 24 * 60 * 60;
export type Consent = { preferences: boolean; media: boolean; decidedAt: number };
type ConsentContextValue = { consent: Consent | null; decided: boolean; save: (choice: Omit<Consent, 'decidedAt'>) => void; openPreferences: () => void };

const ConsentContext = createContext<ConsentContextValue | null>(null);
const parse = (raw: string | null): Consent | null => { const [version, preferences, media, decidedAt] = (raw ?? '').split('.'); return Number(version) === CONSENT_VERSION ? { preferences: preferences === '1', media: media === '1', decidedAt: Number(decidedAt) || 0 } : null; };
const btn = 'rounded-full px-5 py-3 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gaucho-gold';

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [panel, setPanel] = useState(false);
  useEffect(() => { setConsent(parse(readCookie(COOKIE))); setLoaded(true); }, []);
  const save = useCallback((choice: Omit<Consent, 'decidedAt'>) => {
    const next = { ...choice, decidedAt: Date.now() };
    writeCookie(COOKIE, [CONSENT_VERSION, Number(next.preferences), Number(next.media), next.decidedAt].join('.'), YEAR);
    setConsent(next); setPanel(false);
    // Registro do aceite no backend (prova de consentimento, LGPD art. 8º §2º). Falha não bloqueia o site.
    publicApiPost('/api/consents', { version: CONSENT_VERSION, preferences: next.preferences, media: next.media }).catch(() => undefined);
  }, []);
  const value = useMemo(() => ({ consent, decided: Boolean(consent), save, openPreferences: () => setPanel(true) }), [consent, save]);
  return <ConsentContext.Provider value={value}>{children}{loaded && <ConsentUi consent={consent} panel={panel} setPanel={setPanel} save={save} />}</ConsentContext.Provider>;
}

function ConsentUi({ consent, panel, setPanel, save }: { consent: Consent | null; panel: boolean; setPanel: (open: boolean) => void; save: ConsentContextValue['save'] }) {
  const [preferences, setPreferences] = useState(consent?.preferences ?? false);
  const [media, setMedia] = useState(consent?.media ?? false);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => { if (!panel) return; setPreferences(consent?.preferences ?? false); setMedia(consent?.media ?? false); const previous = document.activeElement as HTMLElement | null; dialog.current?.querySelector<HTMLElement>('button, input')?.focus(); const key = (event: KeyboardEvent) => { if (event.key === 'Escape') setPanel(false); }; document.addEventListener('keydown', key); return () => { document.removeEventListener('keydown', key); previous?.focus(); }; }, [panel, consent, setPanel]);
  const toggle = (label: string, description: string, checked: boolean, onChange?: (value: boolean) => void) => <label className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 p-4"><span><b className="block">{label}</b><span className="mt-1 block text-sm text-white/60">{description}</span></span><input type="checkbox" checked={checked} disabled={!onChange} onChange={(event) => onChange?.(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-gaucho-brushgreen disabled:opacity-60" /></label>;
  return <AnimatePresence>
    {!consent && !panel && <motion.section key="banner" role="region" aria-label="Aviso de cookies" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-x-3 bottom-3 z-[180] mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gaucho-ink/95 p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-xl sm:bottom-5 sm:p-6">
      <div className="gap-6 md:flex md:items-center"><div className="flex-1"><p className="font-display text-lg font-black">Cookies, só os que fazem sentido</p><p className="mt-1 text-sm leading-relaxed text-white/70">Usamos cookies necessários para login, carrinho e compras. Com a sua permissão, também lembramos suas preferências e carregamos o player de músicas do YouTube. Veja a <Link href="/cookies" className="font-bold text-gaucho-brushgold underline-offset-2 hover:underline">Política de Cookies</Link> e a <Link href="/privacidade" className="font-bold text-gaucho-brushgold underline-offset-2 hover:underline">Política de Privacidade</Link>.</p></div>
        <div className="mt-4 flex flex-wrap gap-2 md:mt-0 md:shrink-0"><button onClick={() => setPanel(true)} className={`${btn} text-white/80 hover:bg-white/10`}>Personalizar</button><button onClick={() => save({ preferences: false, media: false })} className={`${btn} border border-white/25 hover:border-white`}>Só os necessários</button><button onClick={() => save({ preferences: true, media: true })} className={`${btn} bg-gaucho-brushgold text-gaucho-ink hover:bg-white`}>Aceitar todos</button></div></div>
    </motion.section>}
    {panel && <motion.div key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[190] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center" onMouseDown={(event) => { if (event.target === event.currentTarget && consent) setPanel(false); }}>
      <motion.div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="consent-title" initial={{ y: 30, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, scale: 0.98 }} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-gaucho-ink p-6 text-white shadow-2xl">
        <h2 id="consent-title" className="font-display text-2xl font-black">Preferências de cookies</h2>
        <p className="mt-2 text-sm text-white/65">Você pode mudar de ideia quando quiser pelo link &ldquo;Preferências de cookies&rdquo; no rodapé.</p>
        <div className="mt-5 grid gap-3">
          {toggle('Necessários', 'Sessão da conta, carrinho, aparelho das aulas e pedido em andamento. Sem eles o site não funciona.', true)}
          {toggle('Preferências', 'Lembrar quais avisos e promoções você já viu, para não repetir.', preferences, setPreferences)}
          {toggle('Mídia de terceiros', 'Player de músicas do YouTube. O YouTube (Google) pode usar cookies próprios.', media, setMedia)}
        </div>
        <div className="mt-6 flex flex-wrap justify-end gap-2"><button onClick={() => save({ preferences: false, media: false })} className={`${btn} border border-white/25 hover:border-white`}>Só os necessários</button><button onClick={() => save({ preferences, media })} className={`${btn} bg-gaucho-brushgold text-gaucho-ink hover:bg-white`}>Salvar escolhas</button></div>
      </motion.div>
    </motion.div>}
  </AnimatePresence>;
}

export function useConsent() { const value = useContext(ConsentContext); if (!value) throw new Error('useConsent precisa do ConsentProvider'); return value; }
