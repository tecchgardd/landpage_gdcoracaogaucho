import { NextResponse, type NextRequest } from 'next/server';
import { BACKEND_URL, backendHeaders } from '@/services/server/backend';

// BFF: o navegador só conversa com o próprio site; este handler, no servidor, repassa ao backend
// apenas as rotas que o site realmente usa. Qualquer outra rota do backend (admin, internas,
// webhooks) não existe por aqui. O catálogo público tem handler próprio com cache (api/public).
export const dynamic = 'force-dynamic';

const ALLOWED: Array<[RegExp, string[]]> = [
  [/^auth\/get-session$/, ['GET']],
  [/^auth\/(sign-in\/(email|social)|sign-out)$/, ['POST']],
  [/^auth\/callback\/[a-z]+$/, ['GET', 'POST']],
  [/^customer-auth\/sign-up$/, ['POST']],
  [/^me\/profile$/, ['GET', 'PATCH']],
  [/^me\/checkout\/validate$/, ['POST']],
  [/^me\/(orders|tickets|enrollments|courses|devices)$/, ['GET']],
  [/^me\/orders\/\d+$/, ['GET']],
  [/^me\/courses\/redeem$/, ['POST']],
  [/^me\/courses\/[\w-]+$/, ['GET']],
  [/^me\/courses\/[\w-]+\/sessions$/, ['POST']],
  [/^me\/course-sessions\/[\w:%.-]+\/(heartbeat|end)$/, ['POST']],
  [/^me\/course-sessions\/[\w:%.-]+$/, ['DELETE']],
  [/^me\/lessons\/[\w-]+\/playback$/, ['GET']],
  [/^me\/lessons\/[\w-]+\/progress$/, ['POST']],
  [/^me\/devices\/[\w-]+$/, ['DELETE']],
  [/^cart$/, ['GET', 'DELETE']],
  [/^cart\/items$/, ['POST']],
  [/^cart\/items\/[\w:%.-]+$/, ['PATCH', 'DELETE']],
  [/^payments\/checkout$/, ['POST']],
  [/^payments\/\d+\/status$/, ['GET']],
  [/^payments\/\d+\/retry$/, ['POST']],
  [/^consents$/, ['POST']]
];
const FORWARD_REQUEST = ['accept', 'accept-language', 'content-type', 'cookie', 'idempotency-key', 'origin', 'referer', 'user-agent'];
const DROP_RESPONSE = new Set(['connection', 'content-encoding', 'content-length', 'keep-alive', 'transfer-encoding', 'set-cookie']);
const MAX_BODY_BYTES = 64 * 1024;

const json = (status: number, message: string) => NextResponse.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } });

async function proxy(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.map(encodeURIComponent).join('/');
  const rule = ALLOWED.find(([pattern]) => pattern.test(path));
  if (!rule) return json(404, 'Rota não encontrada.');
  if (!rule[1].includes(request.method)) return json(405, 'Método não permitido.');

  // CSRF: escrita só a partir do próprio site (callbacks OAuth, como o form_post da Apple, são exceção).
  const origin = request.headers.get('origin');
  if (request.method !== 'GET' && origin && origin !== request.nextUrl.origin && !path.startsWith('auth/callback/')) return json(403, 'Origem não permitida.');

  const headers = backendHeaders();
  FORWARD_REQUEST.forEach((name) => { const value = request.headers.get(name); if (value) headers.set(name, value); });
  const clientIp = request.ip ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (clientIp) headers.set('x-forwarded-for', clientIp);
  headers.set('x-forwarded-host', request.nextUrl.host);
  headers.set('x-forwarded-proto', request.nextUrl.protocol.replace(':', ''));

  let body: ArrayBuffer | undefined;
  if (!['GET', 'HEAD'].includes(request.method)) {
    body = await request.arrayBuffer();
    if (body.byteLength > MAX_BODY_BYTES) return json(413, 'Requisição grande demais.');
  }

  let response: Response;
  try { response = await fetch(`${BACKEND_URL}/api/${path}${request.nextUrl.search}`, { method: request.method, headers, body, redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(20_000) }); }
  catch { return NextResponse.json({ message: 'O servidor demorou para responder. Tente novamente.' }, { status: 504, headers: { 'Retry-After': '3', 'Cache-Control': 'no-store' } }); }

  const out = new NextResponse(response.body, { status: response.status });
  response.headers.forEach((value, name) => { if (!DROP_RESPONSE.has(name)) out.headers.set(name, value); });
  response.headers.getSetCookie().forEach((cookie) => out.headers.append('set-cookie', cookie));
  out.headers.set('Cache-Control', 'no-store');
  return out;
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as PUT, proxy as DELETE };
