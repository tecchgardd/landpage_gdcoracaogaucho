import { publicApiGet, publicApiPatch, publicApiPost } from '../public/apiClient';
import { toCheckoutLines, type CartItem } from '@/components/providers/CartProvider';

export type Profile = {
  userId: string; name: string; email: string; phone: string; cpf: string;
  birthDate: string; gender: string; cep: string; address: string; number: string;
  complement: string; neighborhood: string; state: string; city: string; complete: boolean;
};
export type ValidatedItem = { key?: string; eventId?: number; productId?: string; variantId?: string; courseId?: string; itemType: 'EVENT' | 'DANCE' | 'COURSE' | 'PRODUCT' | 'ONLINE_COURSE'; name: string; type: string; banner?: string; startsAt?: string; city?: string; venue?: string; requestedQuantity: number; quantity: number; quantityAdjusted: boolean; unitPrice: number; total: number; available: number | null; free: boolean };
export type CartValidation = { validItems: ValidatedItem[]; invalidItems: Array<{ key?: string; eventId?: number; productId?: string; variantId?: string; courseId?: string; name?: string; reason: string }>; subtotal: number; fee: number; total: number; changed: boolean };
export type CheckoutResult = { orderId: number; paymentId: number | null; checkoutSessionId: string | null; checkoutUrl: string | null; status: string };
export type PaymentStatus = { orderId: number; orderStatus: string; paymentStatus: string; checkoutStatus: string | null; paidAt: string | null; paymentId: number | null };
export type CustomerOrder = Record<string, unknown> & { id: number; code: string; status: string; paymentStatus?: string; paymentMethod?: string; total: number; createdAt: string; statusLabel: string; items: Array<Record<string, unknown>> };

// Só identificadores e quantidades: preço, taxa e total são sempre recalculados pelo backend.
const cartBody = (items: CartItem[]) => ({ items: toCheckoutLines(items) });
export const validatedKey = (item: Pick<ValidatedItem, 'key' | 'eventId' | 'productId' | 'variantId' | 'courseId'>) => item.key ?? (item.productId ? `PRODUCT:${item.productId}:${item.variantId ?? 'u'}` : item.courseId ? `COURSE:${item.courseId}` : `EVENT:${item.eventId}`);
const normalizeProfile = (data: Partial<Profile>): Profile => ({
  userId: String(data.userId ?? ''),
  name: String(data.name ?? ''),
  email: String(data.email ?? ''),
  phone: String(data.phone ?? ''),
  cpf: String(data.cpf ?? ''),
  birthDate: String(data.birthDate ?? ''),
  gender: String(data.gender ?? ''),
  cep: String(data.cep ?? ''),
  address: String(data.address ?? ''),
  number: String(data.number ?? ''),
  complement: String(data.complement ?? ''),
  neighborhood: String(data.neighborhood ?? ''),
  state: String(data.state ?? ''),
  city: String(data.city ?? ''),
  complete: Boolean(data.complete)
});

export const meService = {
  profile: () => publicApiGet<Partial<Profile>>('/api/me/profile').then(normalizeProfile),
  updateProfile: (profile: Pick<Profile, 'name' | 'cpf' | 'phone' | 'birthDate' | 'gender' | 'cep' | 'address' | 'number' | 'complement' | 'neighborhood' | 'state' | 'city'>) => publicApiPatch<Partial<Profile>>('/api/me/profile', profile).then(normalizeProfile),
  validateCart: (items: CartItem[]) => publicApiPost<CartValidation>('/api/me/checkout/validate', cartBody(items)),
  // idempotencyKey: a mesma tentativa de compra enviada duas vezes (duplo clique, rede caindo) gera um único pedido.
  checkout: (items: CartItem[], idempotencyKey: string) => publicApiPost<{ success: true; data: CheckoutResult }>('/api/payments/checkout', { ...cartBody(items), origin: 'SITE' }, { idempotencyKey }).then((response) => response.data),
  paymentStatus: (orderId: number) => publicApiGet<{ success: true; data: PaymentStatus }>(`/api/payments/${orderId}/status`).then((response) => response.data),
  retryPayment: (orderId: number, idempotencyKey = `retry-${orderId}-${Date.now()}`) => publicApiPost<{ success: true; data: CheckoutResult }>(`/api/payments/${orderId}/retry`, {}, { idempotencyKey }).then((response) => response.data),
  orders: () => publicApiGet<{ data: CustomerOrder[] }>('/api/me/orders'),
  order: (id: number) => publicApiGet<CustomerOrder>(`/api/me/orders/${id}`),
  tickets: () => publicApiGet<{ data: Array<Record<string, unknown>> }>('/api/me/tickets'),
  enrollments: () => publicApiGet<{ data: Array<Record<string, unknown>> }>('/api/me/enrollments')
};
