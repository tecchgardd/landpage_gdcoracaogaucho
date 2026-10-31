import { publicApiDelete, publicApiGet, publicApiPatch, publicApiPost } from '../public/apiClient';
import { asRecord, optionalNumber, optionalString, stringValue } from '../public/mappers';
import type { CartItem, CartKind, CheckoutLine } from '@/components/providers/CartProvider';

// Carrinho no backend. Visitante sem login é identificado por um cookie httpOnly (cg_cart) que o
// próprio backend cria no primeiro GET/POST; ao entrar na conta, o backend junta esse carrinho ao
// da conta. O preço exibido aqui é só uma prévia: o valor final é recalculado no checkout.
type Raw = Record<string, unknown>;
const KINDS: CartKind[] = ['EVENT', 'PRODUCT', 'COURSE'];

function mapLine(raw: Raw): CartItem {
  const kind = (KINDS.includes(String(raw.kind ?? raw.tipo) as CartKind) ? String(raw.kind ?? raw.tipo) : raw.productId ? 'PRODUCT' : raw.courseId ? 'COURSE' : 'EVENT') as CartKind;
  const refId = stringValue(raw.refId ?? raw.eventId ?? raw.productId ?? raw.courseId);
  const variantId = optionalString(raw.variantId ?? raw.varianteId);
  const snapshot = asRecord(raw.snapshot ?? raw);
  return {
    key: stringValue(raw.key, kind === 'PRODUCT' ? `PRODUCT:${refId}:${variantId ?? 'u'}` : `${kind}:${refId}`), kind, refId, variantId,
    variantLabel: optionalString(raw.variantLabel ?? raw.tamanho), quantity: optionalNumber(raw.quantity ?? raw.quantidade) ?? 1,
    snapshot: {
      title: stringValue(snapshot.title ?? snapshot.name ?? snapshot.nome, 'Item'), type: optionalString(snapshot.type ?? snapshot.tipo), image: optionalString(snapshot.image ?? snapshot.imagem ?? snapshot.banner),
      startingPrice: optionalNumber(snapshot.unitPrice ?? snapshot.startingPrice ?? snapshot.preco), date: optionalString(snapshot.date ?? snapshot.startsAt ?? snapshot.data),
      city: optionalString(snapshot.city ?? snapshot.cidade), place: optionalString(snapshot.place ?? snapshot.venue ?? snapshot.local), href: optionalString(snapshot.href)
    }
  };
}

const toItems = (payload: unknown) => { const record = asRecord(asRecord(payload).data ?? payload); return (Array.isArray(record.items) ? record.items : []).map((item) => mapLine(asRecord(item))); };
const path = (key: string) => `/api/cart/items/${encodeURIComponent(key)}`;

export const cartService = {
  get: async () => toItems(await publicApiGet('/api/cart')),
  add: async (line: CheckoutLine) => toItems(await publicApiPost('/api/cart/items', line)),
  setQuantity: async (key: string, quantity: number) => toItems(await publicApiPatch(path(key), { quantity })),
  remove: async (key: string) => toItems(await publicApiDelete(path(key))),
  clear: async () => toItems(await publicApiDelete('/api/cart'))
};
