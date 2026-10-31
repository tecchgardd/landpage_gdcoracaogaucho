'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { cartService } from '@/services/store/cartService';
import { useAuth } from './AuthProvider';
import type { PublicEvent } from '@/services/public/types';
import type { OnlineCourse, Product, ProductVariant } from '@/services/store/types';

export type CartKind = 'EVENT' | 'PRODUCT' | 'COURSE';
export type CartSnapshot = { title: string; type?: string; image?: string; startingPrice?: number; date?: string; city?: string; place?: string; href?: string };
export type CartItem = { key: string; kind: CartKind; refId: string; variantId?: string; variantLabel?: string; quantity: number; snapshot: CartSnapshot };
export type CheckoutLine = { eventId: number; quantity: number } | { productId: string; variantId?: string; quantity: number } | { courseId: string; quantity: 1 };
type CartContextValue = {
  items: CartItem[]; count: number; subtotal: number; ready: boolean; error: string;
  add: (event: PublicEvent, quantity?: number) => void;
  addProduct: (product: Product, variant: ProductVariant | undefined, quantity?: number) => void;
  addCourse: (course: OnlineCourse) => void;
  setQuantity: (key: string, quantity: number) => void; remove: (key: string) => void; clear: () => void; has: (key: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export const cartKey = { event: (id: string | number) => `EVENT:${id}`, product: (id: string, variantId?: string) => `PRODUCT:${id}:${variantId ?? 'u'}`, course: (id: string) => `COURSE:${id}` };
export const singleUnit = (item: Pick<CartItem, 'kind' | 'snapshot'>) => item.kind === 'COURSE' || item.snapshot.type === 'CURSO';
const clamp = (item: Pick<CartItem, 'kind' | 'snapshot'>, quantity: number) => singleUnit(item) ? 1 : Math.max(1, Math.min(20, Math.trunc(quantity)));

const toLine = (item: CartItem): CheckoutLine => item.kind === 'PRODUCT' ? { productId: item.refId, variantId: item.variantId, quantity: item.quantity } : item.kind === 'COURSE' ? { courseId: item.refId, quantity: 1 as const } : { eventId: Number(item.refId), quantity: item.quantity };
export function toCheckoutLines(items: CartItem[]): CheckoutLine[] { return items.map(toLine); }


// O carrinho vive no backend (ver cartService). Cada alteração aparece na hora (otimista) e as
// chamadas vão para uma fila serial; quando a fila esvazia, vale o estado devolvido pelo servidor.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const pending = useRef(0);
  const sync = useCallback(() => cartService.get().then((server) => { setItems(server); setError(''); }).catch(() => setError('Não foi possível carregar seu carrinho agora.')), []);
  useEffect(() => { if (authLoading) return; pending.current = 0; sync().finally(() => setReady(true)); }, [authLoading, user?.id, sync]);
  const run = useCallback((optimistic: (current: CartItem[]) => CartItem[], request: () => Promise<CartItem[]>) => {
    setItems(optimistic); setError(''); pending.current += 1;
    queue.current = queue.current.then(request).then(
      (server) => { pending.current -= 1; if (pending.current === 0) setItems(server); },
      () => { pending.current -= 1; setError('Não foi possível atualizar o carrinho. Mostrando a versão salva.'); if (pending.current === 0) return sync(); }
    );
  }, [sync]);
  const value = useMemo<CartContextValue>(() => {
    const upsert = (next: CartItem) => { const line = { ...next, quantity: clamp(next, next.quantity) }; run((current) => current.some((item) => item.key === line.key) ? current.map((item) => item.key === line.key ? { ...item, quantity: line.quantity } : item) : [...current, line], () => cartService.add(toLine(line))); };
    return {
      items, ready, error,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + Number(item.snapshot.startingPrice ?? 0) * item.quantity, 0),
      add: (event, quantity = 1) => upsert({ key: cartKey.event(event.id), kind: 'EVENT', refId: String(event.id), quantity, snapshot: { title: event.title, type: event.type, image: event.image, startingPrice: event.startingPrice, date: event.date, city: event.city, place: event.place, href: `/loja/eventos/${encodeURIComponent(event.slug ?? event.id)}` } }),
      addProduct: (product, variant, quantity = 1) => upsert({ key: cartKey.product(product.id, variant?.id), kind: 'PRODUCT', refId: product.id, variantId: variant?.id, variantLabel: variant && variant.label !== 'Único' ? variant.label : undefined, quantity, snapshot: { title: product.title, type: 'PRODUTO', image: product.images[0], startingPrice: variant?.price ?? product.price, href: `/loja/produtos/${encodeURIComponent(product.slug)}` } }),
      addCourse: (course) => upsert({ key: cartKey.course(course.id), kind: 'COURSE', refId: course.id, quantity: 1, snapshot: { title: course.title, type: 'CURSO ONLINE', image: course.image, startingPrice: course.price, href: `/loja/cursos/${encodeURIComponent(course.slug)}` } }),
      setQuantity: (key, quantity) => { const item = items.find((entry) => entry.key === key); if (!item) return; const next = clamp(item, quantity); if (next !== item.quantity) run((current) => current.map((entry) => entry.key === key ? { ...entry, quantity: next } : entry), () => cartService.setQuantity(key, next)); },
      remove: (key) => run((current) => current.filter((item) => item.key !== key), () => cartService.remove(key)),
      clear: () => run(() => [], () => cartService.clear()),
      has: (key) => items.some((item) => item.key === key)
    };
  }, [items, ready, error, run]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('useCart precisa do CartProvider'); return value; }
