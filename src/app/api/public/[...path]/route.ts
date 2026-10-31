import { unstable_cache } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { BACKEND_URL, CATALOG_REVALIDATE_SECONDS, backendHeaders, catalogTags } from '@/services/server/backend';

// Lado de leitura (CQRS): o catálogo público é servido por este cache em vez de cada visitante
// bater no backend. Rota mais específica que o BFF (src/app/api/[...path]), por isso tem prioridade.
// - cache do Next (unstable_cache) por 60s, invalidável por tag via POST /api/revalidate;
// - erro do backend nunca entra no cache e, se a revalidação falhar, continua valendo a última resposta boa;
// - Cache-Control com s-maxage + stale-while-revalidate para a CDN absorver picos (abertura de vendas).
type Cached = { status: number; body: string; contentType: string };
const CACHEABLE = new Set([200, 404]);
// Com o cache vazio, N visitantes simultâneos pedindo a mesma URL viram 1 chamada ao backend (por instância).
const inflight = new Map<string, Promise<Cached>>();

function fromBackend(path: string): Promise<Cached> {
  const running = inflight.get(path);
  if (running) return running;
  const request = fetchBackend(path).finally(() => inflight.delete(path));
  inflight.set(path, request);
  return request;
}

async function fetchBackend(path: string): Promise<Cached> {
  const response = await fetch(`${BACKEND_URL}/api/public/${path}`, { headers: backendHeaders(new Headers({ Accept: 'application/json' })), cache: 'no-store', signal: AbortSignal.timeout(10_000) });
  if (!CACHEABLE.has(response.status)) throw new Error(`backend respondeu ${response.status}`);
  return { status: response.status, body: await response.text(), contentType: response.headers.get('Content-Type') ?? 'application/json' };
}

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = `${params.path.map(encodeURIComponent).join('/')}${request.nextUrl.search}`;
  try {
    const cached = await unstable_cache(() => fromBackend(path), ['public-api-v1', path], { revalidate: CATALOG_REVALIDATE_SECONDS, tags: catalogTags(params.path[0]) })();
    return new NextResponse(cached.body, { status: cached.status, headers: { 'Content-Type': cached.contentType, 'Cache-Control': `public, max-age=15, s-maxage=${CATALOG_REVALIDATE_SECONDS}, stale-while-revalidate=300` } });
  } catch {
    return NextResponse.json({ message: 'O catálogo está temporariamente indisponível. Tente novamente em instantes.' }, { status: 503, headers: { 'Retry-After': '5', 'Cache-Control': 'no-store' } });
  }
}
