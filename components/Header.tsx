'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBars, faCartShopping, faChevronDown, faClipboardList, faIdCard, faMinus, faPlus, faTicket, faTrash, faUserCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './providers/AuthProvider';
import { useCart } from './providers/CartProvider';
import type { SessionUser } from '@/services/authService';
import type { CartItem } from './providers/CartProvider';

export type HeaderVariant = 'institutional' | 'ticketing';
const ticketingRoutes = ['/bilheteria', '/carrinho', '/checkout', '/login', '/cadastro', '/minha-conta'];
const institutionalLinks = [['home', 'HOME', '/'], ['sobre', 'SOBRE', '/sobre'], ['blog', 'BLOG', '/blog'], ['contato', 'CONTATO', '/#contato']] as const;

function variantForPath(pathname: string): HeaderVariant {
  return ticketingRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`)) ? 'ticketing' : 'institutional';
}

export function Header({ active = 'home', variant: requestedVariant }: { active?: string; variant?: HeaderVariant }) {
  const pathname = usePathname() ?? '/';
  const variant = requestedVariant ?? variantForPath(pathname);
  const { user, signOut } = useAuth();
  const [institutionalMenuOpen, setInstitutionalMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-[100] w-full border-b-2 border-gaucho-gold/80 bg-[#07130d] text-white shadow-[0_16px_40px_rgba(0,0,0,0.38)]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#07130d] via-[#11110d] to-[#190806]" aria-hidden="true" />
      {variant === 'institutional' ? (
        <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-[92px]">
          <Logo />
          <nav aria-label="Navegação institucional" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-[13px] font-black md:flex">
            {institutionalLinks.map(([key, label, href]) => <Link key={key} href={href} className={`pb-2 transition-colors ${active === key ? 'border-b-2 border-gaucho-gold text-gaucho-gold' : 'text-white/90 hover:text-gaucho-gold'}`}>{label}</Link>)}
          </nav>
          <Link href="/bilheteria" className="hidden h-11 items-center rounded-md bg-gaucho-red px-5 text-xs font-black uppercase shadow-lg shadow-red-950/40 hover:bg-red-700 md:flex"><FontAwesomeIcon icon={faTicket} className="mr-2" />Bilheteria</Link>
          <button onClick={() => setInstitutionalMenuOpen((open) => !open)} aria-expanded={institutionalMenuOpen} aria-label={institutionalMenuOpen ? 'Fechar menu' : 'Abrir menu'} className="flex h-11 w-11 items-center justify-center rounded-md border border-white/20 md:hidden"><FontAwesomeIcon icon={institutionalMenuOpen ? faXmark : faBars} /></button>
        </div>
      ) : (
        <div className="relative mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 sm:px-5 md:h-[92px]">
          <Link href="/" aria-label="Voltar à Home" className="flex h-11 w-fit items-center rounded-md border border-white/20 px-3 text-xs font-black transition hover:border-gaucho-gold hover:text-gaucho-gold sm:px-4"><FontAwesomeIcon icon={faArrowLeft} /><span className="ml-2 hidden sm:inline">Voltar à Home</span><span className="ml-2 sm:hidden">Voltar</span></Link>
          <Logo centered />
          <div className="flex items-center justify-end gap-2 sm:gap-3"><CartMenu user={user} />{user ? <ProfileMenu user={user} signOut={signOut} /> : <Link href="/login?returnTo=/bilheteria" className="flex h-11 items-center rounded-md border border-white/20 px-3 text-xs font-black hover:border-gaucho-gold hover:text-gaucho-gold sm:px-4">Entrar</Link>}</div>
        </div>
      )}

      {variant === 'institutional' && institutionalMenuOpen && <nav aria-label="Menu institucional mobile" className="relative grid gap-1 border-t border-white/10 bg-[#07130d] px-4 py-4 shadow-xl md:hidden">{institutionalLinks.map(([key, label, href]) => <Link key={key} href={href} onClick={() => setInstitutionalMenuOpen(false)} className={`rounded-lg px-4 py-3 text-sm font-black ${active === key ? 'bg-white/10 text-gaucho-gold' : 'text-white'}`}>{label}</Link>)}<Link href="/bilheteria" onClick={() => setInstitutionalMenuOpen(false)} className="mt-2 rounded-lg bg-gaucho-red px-4 py-3 text-center text-sm font-black uppercase"><FontAwesomeIcon icon={faTicket} className="mr-2" />Bilheteria</Link></nav>}
    </header>
  );
}

function Logo({ centered = false }: { centered?: boolean }) {
  return <Link href={centered ? '/bilheteria' : '/'} aria-label={centered ? 'Ir para a bilheteria' : 'Página inicial'} className="shrink-0"><Image src="/assets/logo4.png" alt="Grupo de Danças Coração Gaúcho" width={112} height={112} className="h-[66px] w-[76px] object-contain drop-shadow-2xl md:h-[84px] md:w-[100px]" priority /></Link>;
}

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
  const estimated = cart.items.reduce((sum, item) => sum + Number(item.snapshot.startingPrice ?? 0) * item.quantity, 0);
  const badge = cart.count > 99 ? '99+' : String(cart.count);
  const finish = () => { menu.close(); router.push(user ? '/checkout' : '/login?returnTo=/checkout'); };
  return <div ref={menu.containerRef} {...menu.hover} className="relative"><button onClick={menu.toggle} aria-haspopup="menu" aria-expanded={menu.open} aria-label={`Abrir carrinho com ${cart.count} itens`} className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white hover:border-gaucho-gold hover:text-gaucho-gold"><FontAwesomeIcon icon={faCartShopping} />{cart.count > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gaucho-red px-1 text-[10px] font-black text-white">{badge}</span>}</button>{menu.open && <div role="menu" aria-label="Resumo do carrinho" className="fixed inset-x-3 top-[84px] z-[160] origin-top-right animate-[fadeIn_.18s_ease-out] overflow-hidden rounded-2xl border border-white/10 bg-[#07130d]/98 text-white shadow-2xl backdrop-blur-md md:absolute md:inset-x-auto md:right-0 md:top-14 md:w-[430px]"><div className="border-b border-white/10 px-5 py-4"><h2 className="text-lg font-black">Meu Carrinho</h2><p className="text-xs text-white/60">{cart.count} {cart.count === 1 ? 'item' : 'itens'} no total</p></div>{cart.items.length ? <><div className="max-h-[46vh] space-y-1 overflow-y-auto p-3">{cart.items.map((item) => <CartRow key={item.eventId} item={item} setQuantity={cart.setQuantity} remove={cart.remove} />)}</div><div className="border-t border-white/10 p-4 text-sm"><p className="flex justify-between"><span>Subtotal</span><b>{money(estimated)}</b></p><p className="mt-2 flex justify-between text-white/60"><span>Taxas estimadas</span><span>Calculadas no checkout</span></p><p className="mt-3 flex justify-between border-t border-white/10 pt-3 text-base"><b>Total estimado</b><b className="text-gaucho-gold">{money(estimated)}</b></p><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => { menu.close(); router.push('/bilheteria'); }} className="rounded-lg border border-white/20 px-3 py-3 text-xs font-black">Continuar comprando</button><Link href="/carrinho" onClick={menu.close} className="rounded-lg border border-gaucho-gold px-3 py-3 text-center text-xs font-black text-gaucho-gold">Ver carrinho</Link><button onClick={finish} className="col-span-2 rounded-lg bg-gaucho-red px-3 py-3 text-xs font-black uppercase">Finalizar compra</button></div></div></> : <div className="p-8 text-center"><FontAwesomeIcon icon={faCartShopping} className="text-4xl text-gaucho-gold/70" /><h3 className="mt-4 text-lg font-black">Seu carrinho está vazio.</h3><p className="mt-2 text-sm text-white/60">Escolha um baile, evento ou curso para começar.</p><button onClick={() => { menu.close(); router.push('/bilheteria'); }} className="mt-5 rounded-lg bg-gaucho-red px-6 py-3 text-sm font-black">Explorar Eventos</button></div>}</div>}</div>;
}

function CartRow({ item, setQuantity, remove }: { item: CartItem; setQuantity: (id: number, quantity: number) => void; remove: (id: number) => void }) {
  const unit = Number(item.snapshot.startingPrice ?? 0);
  const date = item.snapshot.date ? new Date(item.snapshot.date) : null;
  return <div role="menuitem" tabIndex={0} className="grid grid-cols-[64px_1fr_auto] gap-3 rounded-xl p-2 hover:bg-white/5"><div className="relative h-16 overflow-hidden rounded-lg bg-white/10">{item.snapshot.image && <Image src={item.snapshot.image} alt="" fill sizes="64px" className="object-cover" />}</div><div className="min-w-0"><b className="block truncate text-sm">{item.snapshot.title}</b><p className="truncate text-[11px] text-white/55">{item.snapshot.type ?? 'EVENTO'} • {item.snapshot.city ?? 'Cidade a confirmar'}</p><p className="text-[11px] text-white/55">{date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('pt-BR') : 'Data a confirmar'} • Lote padrão</p><div className="mt-2 flex items-center gap-2"><button aria-label="Diminuir quantidade" onClick={() => setQuantity(item.eventId, item.quantity - 1)} className="flex h-7 w-7 items-center justify-center rounded border border-white/20"><FontAwesomeIcon icon={faMinus} /></button><b className="text-xs">{item.quantity}</b><button aria-label="Aumentar quantidade" disabled={item.snapshot.type === 'CURSO'} onClick={() => setQuantity(item.eventId, item.quantity + 1)} className="flex h-7 w-7 items-center justify-center rounded border border-white/20 disabled:opacity-30"><FontAwesomeIcon icon={faPlus} /></button></div></div><div className="text-right"><button aria-label={`Remover ${item.snapshot.title}`} onClick={() => remove(item.eventId)} className="p-2 text-white/50 hover:text-red-400"><FontAwesomeIcon icon={faTrash} /></button><p className="mt-1 text-[11px] text-white/50">{money(unit)} un.</p><b className="text-xs text-gaucho-gold">{money(unit * item.quantity)}</b></div></div>;
}

function money(value: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value); }

function ProfileMenu({ user, signOut }: { user: SessionUser; signOut: () => Promise<void> }) {
  const menu = useSmartPopover();
  const router = useRouter();
  const initials = user.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const logout = async () => { menu.close(); await signOut(); router.push('/bilheteria'); };
  const itemClass = "flex items-center gap-3 rounded-lg px-3 py-3 text-sm hover:bg-white/10 focus:bg-white/10 focus:outline-none";
  return <div ref={menu.containerRef} {...menu.hover} className="relative"><button onClick={menu.toggle} aria-haspopup="menu" aria-expanded={menu.open} aria-label="Abrir menu da conta" className="flex h-11 items-center gap-1 rounded-full border border-white/20 p-1 pr-2 hover:border-gaucho-gold"><span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gaucho-gold text-xs font-black text-black">{user.image ? <Image src={user.image} alt="Foto do perfil" width={32} height={32} className="h-full w-full object-cover" /> : initials}</span><FontAwesomeIcon icon={faChevronDown} className={`text-[10px] transition-transform ${menu.open ? 'rotate-180' : ''}`} /></button>{menu.open && <div role="menu" aria-label="Menu da conta" className="fixed inset-x-3 top-[84px] z-[160] origin-top-right animate-[fadeIn_.18s_ease-out] overflow-hidden rounded-xl border border-white/10 bg-[#07130d]/98 p-3 text-white shadow-2xl backdrop-blur-md md:absolute md:inset-x-auto md:right-0 md:top-14 md:w-72"><div className="flex items-center gap-3 border-b border-white/10 px-2 pb-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gaucho-gold text-sm font-black text-black">{user.image ? <Image src={user.image} alt="Foto do perfil" width={44} height={44} className="h-full w-full object-cover" /> : initials}</span><div className="min-w-0"><b className="block truncate">{user.name}</b><span className="block truncate text-xs text-white/60">{user.email}</span></div></div><Link role="menuitem" href="/minha-conta/pedidos" onClick={menu.close} className={`mt-2 ${itemClass}`}><FontAwesomeIcon icon={faClipboardList} className="w-4 text-gaucho-gold" />Meus Pedidos</Link><Link role="menuitem" href="/minha-conta/perfil" onClick={menu.close} className={itemClass}><FontAwesomeIcon icon={faIdCard} className="w-4 text-gaucho-gold" />Meus Dados</Link><Link role="menuitem" href="/minha-conta/ingressos" onClick={menu.close} className={itemClass}><FontAwesomeIcon icon={faTicket} className="w-4 text-gaucho-gold" />Meus Ingressos</Link><Link role="menuitem" href="/minha-conta/inscricoes" onClick={menu.close} className={itemClass}><FontAwesomeIcon icon={faUserCheck} className="w-4 text-gaucho-gold" />Minhas Inscrições</Link><button role="menuitem" onClick={logout} className={`w-full text-left text-white/70 ${itemClass}`}><FontAwesomeIcon icon={faArrowLeft} className="w-4" />Sair</button></div>}</div>;
}
