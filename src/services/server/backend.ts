// Só para código que roda no servidor do Next (route handlers, generateMetadata).
// API_INTERNAL_URL permite falar com o backend por rede interna/balanceador sem passar pela internet.
export const BACKEND_URL = (process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333').replace(/\/$/, '');
export const CATALOG_REVALIDATE_SECONDS = 60;

// Prova para o backend de que a chamada veio do servidor do site (pode recusar o resto e só confiar
// no X-Forwarded-For com ela). Nunca vai para o navegador: não tem prefixo NEXT_PUBLIC_.
export const backendHeaders = (headers: Headers = new Headers()) => { if (process.env.BACKEND_SHARED_SECRET) headers.set('x-bff-key', process.env.BACKEND_SHARED_SECRET); return headers; };

// Tags de cache: "catalog" invalida tudo; "catalog:events", "catalog:products" etc. só um recurso.
export const catalogTags = (resource?: string) => ['catalog', ...(resource ? [`catalog:${resource}`] : [])];
