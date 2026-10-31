// As chamadas ficam na própria origem do site: o next.config faz proxy para o backend e mantém os
// cookies de sessão first-party. /api/public/** passa antes pelo cache do servidor (src/app/api/public).
const API_BASE_URL = '';
const TIMEOUT_MS = 15_000;
const RETRYABLE = new Set([408, 429, 500, 502, 503, 504]);
const MAX_GET_RETRIES = 2;

export class ApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly details?: unknown, public readonly code?: string) {
    super(message); this.name = 'ApiError';
  }
}

type RequestOptions = { idempotencyKey?: string; signal?: AbortSignal };

async function errorFrom(response: Response) {
  const payload = await response.json().catch(() => ({})) as { message?: string; error?: string; details?: unknown; code?: string };
  const safe: Record<number, string> = { 401: 'Sua sessão expirou. Entre novamente para continuar.', 404: 'Pedido não encontrado ou não pertence a esta conta.', 409: 'Este pedido já foi pago ou possui uma tentativa ativa.', 422: 'Complete os dados obrigatórios do seu perfil antes de continuar.', 429: 'Muitas pessoas comprando agora. Aguarde alguns segundos e tente novamente.', 503: 'O serviço está temporariamente indisponível. Tente novamente em instantes.' };
  const message = (payload.code && payload.message) || safe[response.status] || payload.message || payload.error || 'Não foi possível concluir a solicitação.';
  return new ApiError(response.status, message, payload.details, payload.code);
}

const normalize = (path: string) => path.startsWith('/') ? path : `/${path}`;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// Espera exponencial com jitter (evita que milhares de clientes repitam no mesmo instante); respeita Retry-After.
const backoff = (attempt: number, retryAfter: string | null) => { const seconds = Number(retryAfter); return Number.isFinite(seconds) && seconds > 0 ? Math.min(seconds, 10) * 1000 : Math.min(4000, 400 * 2 ** attempt) * (0.5 + Math.random()); };

async function send(path: string, init: RequestInit, signal?: AbortSignal) {
  const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const abort = () => controller.abort(); signal?.addEventListener('abort', abort);
  try { return await fetch(`${API_BASE_URL}${path}`, { credentials: 'include', ...init, signal: controller.signal }); }
  catch (caught) { if (signal?.aborted) throw caught; throw new ApiError(0, controller.signal.aborted ? 'O servidor demorou para responder. Tente novamente.' : 'Sem conexão com o servidor. Verifique sua internet.'); }
  finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}

// GETs idênticos simultâneos (vários componentes pedindo o mesmo catálogo) viram uma única requisição.
const inflight = new Map<string, Promise<unknown>>();

export function publicApiGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = normalize(path);
  const shared = !options.signal && inflight.get(url);
  if (shared) return shared as Promise<T>;
  const request = (async () => {
    for (let attempt = 0; ; attempt++) {
      // Catálogo público usa o cache HTTP (Cache-Control vindo do servidor); dados da conta nunca.
      const response = await send(url, { headers: { Accept: 'application/json' }, cache: url.startsWith('/api/public/') ? 'default' : 'no-store' }, options.signal).catch((caught) => { if (caught instanceof ApiError && caught.status === 0 && attempt < MAX_GET_RETRIES) return null; throw caught; });
      if (response?.ok) return response.json() as Promise<T>;
      if (attempt < MAX_GET_RETRIES && (!response || RETRYABLE.has(response.status))) { await sleep(backoff(attempt, response?.headers.get('Retry-After') ?? null)); continue; }
      throw await errorFrom(response as Response);
    }
  })();
  if (!options.signal) { inflight.set(url, request); request.then(() => inflight.delete(url), () => inflight.delete(url)); }
  return request;
}

// Escritas não são repetidas automaticamente. Com idempotencyKey, o backend devolve o mesmo resultado
// se a mesma operação chegar duas vezes (duplo clique, rede instável, retry manual).
async function write<T>(method: 'POST' | 'PATCH' | 'PUT' | 'DELETE', path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey;
  const response = await send(normalize(path), { method, headers, body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store' }, options.signal);
  if (!response.ok) throw await errorFrom(response);
  return response.json().catch(() => ({})) as Promise<T>;
}

export const publicApiPost = <T>(path: string, body: unknown, options?: RequestOptions) => write<T>('POST', path, body, options);
export const publicApiPatch = <T>(path: string, body: unknown, options?: RequestOptions) => write<T>('PATCH', path, body, options);
export const publicApiPut = <T>(path: string, body: unknown, options?: RequestOptions) => write<T>('PUT', path, body, options);
export const publicApiDelete = <T>(path: string, options?: RequestOptions) => write<T>('DELETE', path, undefined, options);

export const newIdempotencyKey = () => crypto.randomUUID();
