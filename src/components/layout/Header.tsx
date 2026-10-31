'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBagShopping, faCartShopping, faChevronDown, faClipboardList, faGraduationCap, faHouse, faIdCard, faLaptop, faMinus, faPlus, faTicket, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../providers/AuthProvider';
import { useCart } from '../providers/CartProvider';
import { useSiteModals, type SiteModal } from '../site/SiteModals';
import type { SessionUser } from '@/services/account/authService';
import { singleUnit, type CartItem } from '../providers/CartProvider';

export type HeaderVariant = 'institutional' | 'ticketing';

type NavItem = { label: string; href?: string; modal?: SiteModal };
const navItems: NavItem[] = [
  { label: 'Início', href: '/' },
  { label: 'Bailes e cursos', href: '/#viver' },
  { label: 'Turmas', modal: { type: 'cursos' } },
  { label: 'Nossa história', modal: { type: 'historia' } },
  { label: 'Contato', modal: { type: 'whatsapp' } }
];
type Section = 'loja' | 'aluno' | null;
const sectionOf = (pathname: string): Section => /^\/(minha-conta|aulas)(\/|$)/.test(pathname) ? 'aluno' : /^\/(loja|carrinho|checkout|pagamento)(\/|$)/.test(pathname) ? 'loja' : null;

// Navegação única do site: cápsula escura flutuante com o menu; no celular a própria cápsula
// se expande num painel. `active`/`variant` ficam só por compatibilidade com as páginas.
export function Header(_props: { active?: string; variant?: HeaderVariant }) {
  const pathname = usePathname() ?? '/';
  const { user, signOut } = useAuth();
  const { open: openModal } = useSiteModals();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const sync = () => setScrolled(window.scrollY > 24); sync(); window.addEventListener('scroll', sync, { passive: true }); return () => window.removeEventListener('scroll', sync); }, []);
  useEffect(() => { setMenuOpen(false); }, [pathname]);
  useEffect(() => { if (!menuOpen) return; const key = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); }; document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key); }, [menuOpen]);
  const section = sectionOf(pathname);
  const go = (item: NavItem) => { setMenuOpen(false); if (item.modal) openModal(item.modal); };
  const navLink = (item: NavItem, mobile = false) => {
    const cls = mobile ? 'block w-full rounded-2xl px-4 py-3 text-left font-display text-2xl font-extrabold text-white transition hover:bg-white/10' : 'rounded-full px-3.5 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white';
    return item.href ? <Link key={item.label} href={item.href} onClick={() => go(item)} className={`${cls} ${!mobile && pathname === item.href ? 'text-white' : ''}`}>{item.label}</Link> : <button key={item.label} onClick={() => go(item)} className={cls}>{item.label}</button>;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className={`relative mx-auto max-w-7xl border border-white/10 bg-gaucho-ink/95 text-white backdrop-blur-xl transition-shadow ${menuOpen ? 'rounded-[28px]' : 'rounded-[34px]'} ${scrolled || menuOpen ? 'shadow-[0_18px_50px_rgba(0,0,0,.35)]' : 'shadow-[0_10px_30px_rgba(0,0,0,.18)]'}`}>
        <div className="flex h-16 items-center justify-between gap-3 pl-2 pr-2">
          <Link href="/" aria-label="Coração Gaúcho — início" className="group flex shrink-0 items-center gap-2.5 rounded-full pr-2">
            <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gaucho-snow transition group-hover:rotate-[-8deg]"><Image src="/assets/logo.jpg" alt="" width={56} height={56} priority className="h-11 w-11 object-contain mix-blend-multiply" /></span>
            <span className="hidden leading-none sm:block"><span className="block font-script text-[24px] text-gaucho-brushgold">Coração Gaúcho</span>{section ? <span className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-label text-[11px] font-bold uppercase tracking-[.2em] ${section === 'loja' ? 'bg-gaucho-brushgold text-gaucho-ink' : 'bg-gaucho-brushgreen text-white'}`}><FontAwesomeIcon icon={section === 'loja' ? faBagShopping : faGraduationCap} className="text-[10px]" />{section === 'loja' ? 'Loja oficial' : 'Área do aluno'}</span> : <span className="font-label text-[11px] font-bold uppercase tracking-[.3em] text-white/50">Grupo de Danças</span>}</span>
          </Link>
          {!section && <nav aria-label="Navegação principal" className="hidden items-center gap-0.5 xl:flex">{navItems.map((item) => navLink(item))}</nav>}
          <div className="flex items-center gap-1.5">
            {section ? <Link href="/" className="group flex h-12 items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-bold text-white/85 transition hover:border-white/40 hover:bg-white/10 hover:text-white sm:px-5"><FontAwesomeIcon icon={faArrowLeft} className="transition group-hover:-translate-x-0.5" /><span className="sm:hidden">Site</span><span className="hidden sm:inline">Voltar para o site</span></Link> : <>
              <Link href="/minha-conta/cursos" className="hidden h-12 items-center gap-2 rounded-full bg-gaucho-brushgreen px-4 text-sm font-bold transition hover:brightness-110 md:flex"><FontAwesomeIcon icon={faGraduationCap} />Área do aluno</Link>
              <Link href="/loja" className="group flex h-12 items-center gap-2 rounded-full bg-gaucho-brushgold px-4 text-sm font-bold text-gaucho-ink transition hover:bg-white sm:px-5"><FontAwesomeIcon icon={faBagShopping} className="transition group-hover:-rotate-12" /><span>Loja</span></Link>
            </>}
            <CartMenu user={user} />
            {user ? <ProfileMenu user={user} signOut={signOut} /> : <Link href={`/login?returnTo=${encodeURIComponent(pathname)}`} className={`h-12 items-center rounded-full border border-white/20 px-4 text-sm font-bold transition hover:border-white ${section ? 'flex' : 'hidden sm:flex'}`}>Entrar</Link>}
            {!section && <button onClick={() => setMenuOpen((value) => !value)} aria-expanded={menuOpen} aria-controls="menu-painel" className="flex h-12 items-center gap-2 rounded-full bg-white/10 px-4 text-sm font-bold transition hover:bg-white/20 xl:hidden"><span className="relative block h-3 w-4"><span className={`absolute left-0 h-0.5 w-4 bg-white transition ${menuOpen ? 'top-1.5 rotate-45' : 'top-0'}`} /><span className={`absolute left-0 h-0.5 w-4 bg-white transition ${menuOpen ? 'top-1.5 -rotate-45' : 'top-2.5'}`} /></span><span className="hidden sm:inline">{menuOpen ? 'Fechar' : 'Menu'}</span></button>}
          </div>
        </div>
        <AnimatePresence initial={false}>
          {menuOpen && !section && <motion.div id="menu-painel" key="painel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden xl:hidden">
            <div className="grid gap-6 border-t border-white/10 p-4 sm:grid-cols-[1.3fr_1fr] sm:p-6">
              <nav aria-label="Menu" className="grid gap-1">{navItems.map((item, index) => <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + index * 0.05 }}>{navLink(item, true)}</motion.div>)}</nav>
              <div className="grid content-start gap-2">
                <Link href="/minha-conta/cursos" className="flex items-center gap-3 rounded-2xl bg-gaucho-brushgreen p-4 font-bold"><FontAwesomeIcon icon={faGraduationCap} className="text-xl" />Área do aluno</Link>
                <Link href="/loja" className="flex items-center gap-3 rounded-2xl bg-gaucho-brushgold p-4 font-bold text-gaucho-ink"><FontAwesomeIcon icon={faBagShopping} className="text-xl" />Loja: bailes, cursos e produtos</Link>
                {!user && <Link href={`/login?returnTo=${encodeURIComponent(pathname)}`} className="rounded-2xl border border-white/20 p-4 text-center font-bold">Entrar na minha conta</Link>}
              </div>
            </div>
          </motion.div>}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}

const popoverMotion = {
  initial: { opacity: 0, scale: 0.96, y: -8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.97, y: -6 },
  transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const }
};

function useSmartPopover() {
  const [open, setOpen] = useState(false);
  const pinned = useRef(false);
  const historyEntry = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout>>();
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();
  const close = () => { pinned.current = false; setOpen(false); if (historyEntry.current) { historyEntry.current = false; history.back(); } };
  const toggle = () => {
    if (open) return close();
    pinned.current = true; setOpen(true);
    if (window.matchMedia('(hover: none)').matches) { history.pushState({ cgPopover: true }, '', location.href); historyEntry.current = true; }
  };
  useEffect(() => {
    const outside = (event: MouseEvent | TouchEvent) => { if (open && !containerRef.current?.contains(event.target as Node)) close(); };
    const keyboard = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    const back = () => { if (historyEntry.current) { historyEntry.current = false; pinned.current = false; setOpen(false); } };
    document.addEventListener('mousedown', outside); document.addEventListener('touchstart', outside); document.addEventListener('keydown', keyboard); window.addEventListener('popstate', back);
    return () => { document.removeEventListener('mousedown', outside); document.removeEventListener('touchstart', outside); document.removeEventListener('keydown', keyboard); window.removeEventListener('popstate', back); clearTimeout(openTimer.current); clearTimeout(closeTimer.current); };
  }, [open]);
  return { open, close, toggle, containerRef, hover: { onMouseEnter: () => { clearTimeout(closeTimer.current); openTimer.current = setTimeout(() => setOpen(true), 180); }, onMouseLeave: () => { clearTimeout(openTimer.current); if (!pinned.current) closeTimer.current = setTimeout(() => setOpen(false), 220); } } };
}

function CartMenu({ user }: { user: SessionUser | null }) {
  const cart = useCart(); const menu = useSmartPopover(); const router = useRouter();
  const estimated = cart.subtotal;
  const badge = cart.count > 99 ? '99+' : String(cart.count);
  const finish = () => { menu.close(); router.push(user ? '/checkout' : '/login?returnTo=/checkout'); };
  return <div ref={menu.containerRef} {...menu.hover} className="relative"><button onClick={menu.toggle} aria-haspopup="menu" aria-expanded={menu.open} aria-label={`Abrir carrinho com ${cart.count} itens`} className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"><FontAwesomeIcon icon={faCartShopping} />{cart.count > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gaucho-red px-1 text-[10px] font-black text-white">{badge}</span>}</button><AnimatePresence>{menu.open && <motion.div {...popoverMotion} role="menu" aria-label="Resumo do carrinho" className="fixed inset-x-3 top-[84px] z-[160] origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#07130d]/98 text-white shadow-2xl backdrop-blur-md md:absolute md:inset-x-auto md:right-0 md:top-14 md:w-[430px]"><div className="border-b border-white/10 px-5 py-4"><h2 className="text-lg font-black">Meu Carrinho</h2><p className="text-xs text-white/60">{cart.count} {cart.count === 1 ? 'item' : 'itens'} no total</p></div>{cart.items.length ? <><div className="max-h-[46vh] space-y-1 overflow-y-auto p-3">{cart.items.map((item) => <CartRow key={item.key} item={item} setQuantity={cart.setQuantity} remove={cart.remove} />)}</div><div className="border-t border-white/10 p-4 text-sm"><p className="flex justify-between"><span>Subtotal</span><b>{money(estimated)}</b></p><p className="mt-2 flex justify-between text-white/60"><span>Taxas estimadas</span><span>Calculadas no checkout</span></p><p className="mt-3 flex justify-between border-t border-white/10 pt-3 text-base"><b>Total estimado</b><b className="text-gaucho-gold">{money(estimated)}</b></p><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => { menu.close(); router.push('/loja'); }} className="rounded-lg border border-white/20 px-3 py-3 text-xs font-black transition-colors hover:border-gaucho-gold">Continuar comprando</button><Link href="/carrinho" onClick={menu.close} className="rounded-lg border border-gaucho-gold px-3 py-3 text-center text-xs font-black text-gaucho-gold transition-colors hover:bg-gaucho-gold hover:text-black">Ver carrinho</Link><button onClick={finish} className="btn-premium col-span-2 rounded-lg bg-gaucho-red px-3 py-3 text-xs font-black uppercase">Finalizar compra</button></div></div></> : <div className="p-8 text-center"><FontAwesomeIcon icon={faCartShopping} className="text-4xl text-gaucho-gold/70" /><h3 className="mt-4 text-lg font-black">Seu carrinho está vazio.</h3><p className="mt-2 text-sm text-white/60">Escolha um baile, curso ou produto para começar.</p><button onClick={() => { menu.close(); router.push('/loja'); }} className="mt-5 rounded-lg bg-gaucho-red px-6 py-3 text-sm font-black transition-colors hover:bg-red-700">Explorar a loja</button></div>}</motion.div>}</AnimatePresence></div>;
}

function CartRow({ item, setQuantity, remove }: { item: CartItem; setQuantity: (key: string, quantity: number) => void; remove: (key: string) => void }) {
  const unit = Number(item.snapshot.startingPrice ?? 0);
  const date = item.snapshot.date ? new Date(item.snapshot.date) : null;
  return <div role="menuitem" tabIndex={0} className="grid grid-cols-[64px_1fr_auto] gap-3 rounded-xl p-2 hover:bg-white/5"><div className="relative h-16 overflow-hidden rounded-lg bg-white/10">{item.snapshot.image && <Image src={item.snapshot.image} alt="" fill sizes="64px" className="object-cover" />}</div><div className="min-w-0"><b className="block truncate text-sm">{item.snapshot.title}</b><p className="truncate text-[11px] text-white/55">{cartItemDetail(item, date)}</p><div className="mt-2 flex items-center gap-2"><button aria-label="Diminuir quantidade" onClick={() => setQuantity(item.key, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded border border-white/20"><FontAwesomeIcon icon={faMinus} /></button><b className="text-xs">{item.quantity}</b><button aria-label="Aumentar quantidade" disabled={singleUnit(item)} onClick={() => setQuantity(item.key, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded border border-white/20 disabled:opacity-30"><FontAwesomeIcon icon={faPlus} /></button></div></div><div className="text-right"><button aria-label={`Remover ${item.snapshot.title}`} onClick={() => remove(item.key)} className="p-2 text-white/50 hover:text-red-400"><FontAwesomeIcon icon={faTrash} /></button><p className="mt-1 text-[11px] text-white/50">{money(unit)} un.</p><b className="text-xs text-gaucho-gold">{money(unit * item.quantity)}</b></div></div>;
}

export function cartItemDetail(item: CartItem, date = item.snapshot.date ? new Date(item.snapshot.date) : null) {
  if (item.kind === 'PRODUCT') return ['Produto', item.variantLabel && `Tamanho ${item.variantLabel}`].filter(Boolean).join(' • ');
  if (item.kind === 'COURSE') return 'Curso online • acesso na Área do aluno';
  return [item.snapshot.type ?? 'EVENTO', item.snapshot.city, date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('pt-BR') : 'Data a confirmar'].filter(Boolean).join(' • ');
}

function money(value: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value); }

const accountLinks = [
  { label: 'Visão geral', href: '/minha-conta', icon: faHouse },
  { label: 'Meus cursos online', href: '/minha-conta/cursos', icon: faGraduationCap },
  { label: 'Meus ingressos', href: '/minha-conta/ingressos', icon: faTicket },
  { label: 'Inscrições em turmas', href: '/minha-conta/inscricoes', icon: faUsers },
  { label: 'Meus pedidos', href: '/minha-conta/pedidos', icon: faClipboardList },
  { label: 'Dispositivos', href: '/minha-conta/dispositivos', icon: faLaptop },
  { label: 'Meus dados', href: '/minha-conta/perfil', icon: faIdCard }
];

function ProfileMenu({ user, signOut }: { user: SessionUser; signOut: () => Promise<void> }) {
  const menu = useSmartPopover();
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const initials = user.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const logout = async () => { menu.close(); await signOut(); router.push('/'); };
  const itemClass = "flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-white/10 focus:bg-white/10 focus:outline-none";
  return <div ref={menu.containerRef} {...menu.hover} className="relative"><button onClick={menu.toggle} aria-haspopup="menu" aria-expanded={menu.open} aria-label="Abrir menu da conta" className="flex h-12 items-center gap-1 rounded-full p-1 pr-2 text-white transition-colors hover:bg-white/10"><span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gaucho-gold text-xs font-black text-black">{user.image ? <Image src={user.image} alt="Foto do perfil" width={32} height={32} className="h-full w-full object-cover" /> : initials}</span><FontAwesomeIcon icon={faChevronDown} className={`text-[10px] transition-transform ${menu.open ? 'rotate-180' : ''}`} /></button><AnimatePresence>{menu.open && <motion.div {...popoverMotion} role="menu" aria-label="Menu da conta" className="fixed inset-x-3 top-[84px] z-[160] origin-top-right overflow-hidden rounded-xl border border-white/10 bg-[#07130d]/98 p-3 text-white shadow-2xl backdrop-blur-md md:absolute md:inset-x-auto md:right-0 md:top-14 md:w-72"><div className="flex items-center gap-3 border-b border-white/10 px-2 pb-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gaucho-gold text-sm font-black text-black">{user.image ? <Image src={user.image} alt="Foto do perfil" width={44} height={44} className="h-full w-full object-cover" /> : initials}</span><div className="min-w-0"><b className="block truncate">{user.name}</b><span className="block truncate text-xs text-white/60">{user.email}</span></div></div><div className="mt-2 grid gap-0.5">{accountLinks.map(({ label, href, icon }) => { const active = href === '/minha-conta' ? pathname === href : pathname.startsWith(href) || (href === '/minha-conta/cursos' && pathname.startsWith('/aulas')); return <Link key={href} role="menuitem" href={href} onClick={menu.close} aria-current={active ? 'page' : undefined} className={`${itemClass} ${active ? 'bg-gaucho-gold/15 font-bold text-gaucho-gold' : ''}`}><FontAwesomeIcon icon={icon} className="w-4 text-gaucho-gold" />{label}</Link>; })}</div><button role="menuitem" onClick={logout} className={`mt-1 w-full border-t border-white/10 text-left text-white/70 ${itemClass}`}><FontAwesomeIcon icon={faArrowLeft} className="w-4" />Sair</button></motion.div>}</AnimatePresence></div>;
}
