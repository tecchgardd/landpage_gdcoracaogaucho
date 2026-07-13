import { publicApiGet, publicApiPatch, publicApiPost } from './public/apiClient';

export type Profile = {
  userId: string; name: string; email: string; phone: string; cpf: string;
  birthDate: string; gender: string; cep: string; address: string; number: string;
  complement: string; neighborhood: string; state: string; city: string; complete: boolean;
};
export type ValidatedItem = { eventId: number; itemType: 'EVENT' | 'DANCE' | 'COURSE'; name: string; type: string; banner?: string; startsAt: string; city?: string; venue: string; requestedQuantity: number; quantity: number; quantityAdjusted: boolean; unitPrice: number; total: number; available: number | null; free: boolean };
export type CartValidation = { validItems: ValidatedItem[]; invalidItems: Array<{ eventId: number; name?: string; reason: string }>; subtotal: number; fee: number; total: number; changed: boolean };
export type CheckoutResult = { orderId: number; orderCode: string; status: string; free: boolean; total: number; checkoutUrl: string | null };
export type CustomerOrder = Record<string, unknown> & { id: number; code: string; status: string; paymentStatus?: string; paymentMethod?: string; total: number; createdAt: string; statusLabel: string; items: Array<Record<string, unknown>> };

const cartBody = (items: Array<{ eventId: number; quantity: number }>) => ({ items: items.map(({ eventId, quantity }) => ({ eventId, quantity })) });
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
  validateCart: (items: Array<{ eventId: number; quantity: number }>) => publicApiPost<CartValidation>('/api/me/checkout/validate', cartBody(items)),
  checkout: (items: Array<{ eventId: number; quantity: number }>) => publicApiPost<CheckoutResult>('/api/me/checkout', cartBody(items)),
  orders: () => publicApiGet<{ data: CustomerOrder[] }>('/api/me/orders'),
  order: (id: number) => publicApiGet<CustomerOrder>(`/api/me/orders/${id}`),
  tickets: () => publicApiGet<{ data: Array<Record<string, unknown>> }>('/api/me/tickets'),
  enrollments: () => publicApiGet<{ data: Array<Record<string, unknown>> }>('/api/me/enrollments')
};
