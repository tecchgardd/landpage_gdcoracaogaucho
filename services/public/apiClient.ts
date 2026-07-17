// API calls deliberately stay on the page origin. next.config proxies them to the
// backend so authentication cookies are first-party in production as well.
const API_BASE_URL = '';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly details?: unknown) {
    super(message); this.name = 'ApiError';
  }
}

async function errorFrom(response: Response) {
  const payload = await response.json().catch(() => ({})) as { message?: string; error?: string; details?: unknown };
  const safe: Record<number, string> = { 401: 'Sua sessão expirou. Entre novamente para continuar.', 404: 'Pedido não encontrado ou não pertence a esta conta.', 409: 'Este pedido já foi pago ou possui uma tentativa ativa.', 422: 'Complete os dados obrigatórios do seu perfil antes de continuar.', 429: 'Muitas tentativas. Aguarde um momento e tente novamente.', 503: 'O serviço de pagamentos está temporariamente indisponível.' };
  return new ApiError(response.status, safe[response.status] ?? payload.message ?? payload.error ?? 'Não foi possível concluir a solicitação.', payload.details);
}

export async function publicApiGet<T>(path: string): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw await errorFrom(response);
  }

  return response.json() as Promise<T>;
}

export async function publicApiPost<T>(path: string, body: unknown): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    method: 'POST',
    credentials: 'include',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw await errorFrom(response);
  const payload = await response.json().catch(() => ({}));
  return payload as T;
}

export async function publicApiPatch<T>(path: string, body: unknown): Promise<T> {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    method: 'PATCH', credentials: 'include',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw await errorFrom(response);
  const payload = await response.json().catch(() => ({}));
  return payload as T;
}
