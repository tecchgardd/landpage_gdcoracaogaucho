'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PublicEvent } from '@/services/public/types';

export type CartItem = { eventId: number; quantity: number; snapshot: Pick<PublicEvent, 'title' | 'type' | 'image' | 'startingPrice' | 'date' | 'city' | 'place'> };
type CartContextValue = { items: CartItem[]; count: number; add: (event: PublicEvent, quantity?: number) => void; setQuantity: (eventId: number, quantity: number) => void; remove: (eventId: number) => void; clear: () => void; has: (eventId: number) => boolean };
const CartContext = createContext<CartContextValue | null>(null);
const KEY = 'cg_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setItems(JSON.parse(raw) as CartItem[]); } catch { localStorage.removeItem(KEY); }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(items)); }, [items, ready]);
  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    add: (event, quantity = 1) => setItems((current) => current.some((item) => item.eventId === Number(event.id)) ? current.map((item) => item.eventId === Number(event.id) ? { ...item, quantity: Math.max(1, Math.trunc(quantity)) } : item) : [...current, { eventId: Number(event.id), quantity: Math.max(1, Math.trunc(quantity)), snapshot: { title: event.title, type: event.type, image: event.image, startingPrice: event.startingPrice, date: event.date, city: event.city, place: event.place } }]),
    setQuantity: (eventId, quantity) => setItems((current) => current.map((item) => item.eventId === eventId ? { ...item, quantity: Math.max(1, Math.trunc(quantity)) } : item)),
    remove: (eventId) => setItems((current) => current.filter((item) => item.eventId !== eventId)),
    clear: () => setItems([]),
    has: (eventId) => items.some((item) => item.eventId === eventId)
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('useCart precisa do CartProvider'); return value; }
