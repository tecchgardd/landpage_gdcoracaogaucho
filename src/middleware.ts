import { NextResponse, type NextRequest } from 'next/server';

// Primeira barreira das rotas logadas: sem o cookie de sessão do better-auth (prefixo
// "cg-admin", ver backend src/lib/auth.ts) nem renderiza a página e vai direto ao login.
// A validação real da sessão continua no backend (/api/auth/get-session e /api/me/*).
const SESSION_COOKIES = ['cg-admin.session_token', '__Secure-cg-admin.session_token'];

export function middleware(request: NextRequest) {
  if (SESSION_COOKIES.some((name) => request.cookies.has(name))) return NextResponse.next();
  const login = new URL('/login', request.url);
  login.searchParams.set('returnTo', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(login);
}

export const config = { matcher: ['/minha-conta/:path*', '/aulas/:path*', '/checkout'] };
