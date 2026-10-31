import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

// Chamado pelo backend quando o catálogo muda (evento criado/editado, lote esgotado, estoque,
// preço, álbum novo), para o cache de leitura não esperar os 60s. Ver docs/CONTRATO_BACKEND.md.
const ALLOWED = /^catalog(:[a-z-]+)?$/;
const sameSecret = (received: string, expected: string) => received.length === expected.length && timingSafeEqual(Buffer.from(received), Buffer.from(expected));

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !sameSecret(request.headers.get('x-revalidate-secret') ?? '', secret)) return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  const body = await request.json().catch(() => ({})) as { tags?: unknown };
  const tags = (Array.isArray(body.tags) ? body.tags : ['catalog']).filter((tag): tag is string => typeof tag === 'string' && ALLOWED.test(tag));
  if (!tags.length) return NextResponse.json({ message: 'Informe tags como "catalog" ou "catalog:events".' }, { status: 422 });
  tags.forEach((tag) => revalidateTag(tag));
  return NextResponse.json({ revalidated: tags, at: new Date().toISOString() });
}
