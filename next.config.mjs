// Cabeçalhos de segurança para todas as páginas. A CSP é mínima de propósito (não bloqueia scripts
// de terceiros como YouTube/Stripe): impede o site de ser embutido em iframes de outros domínios,
// plugins e troca de <base>, e força https nas imagens que o backend devolver em http.
const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests" }
];
const staticAssetCache = [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'http', hostname: 'res.cloudinary.com' }
    ]
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/assets/:path*', headers: staticAssetCache },
      { source: '/videos/:path*', headers: staticAssetCache }
    ];
  },
  async redirects() {
    return [
      { source: '/bilheteria', destination: '/loja?categoria=ingressos', permanent: true },
      { source: '/bilheteria/eventos/:slug', destination: '/loja/eventos/:slug', permanent: true }
    ];
  },
};

export default nextConfig;
