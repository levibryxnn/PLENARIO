import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['node:sqlite'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: `default-src 'self'; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.camara.leg.br; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`,
          },
        ],
      },
      {
        source: '/api/admin/:path*',
        headers: [{ key: 'Cache-Control', value: 'private, no-store, max-age=0' }],
      },
      {
        source: '/api/corrections',
        headers: [{ key: 'Cache-Control', value: 'private, no-store, max-age=0' }],
      },
      {
        source: '/admin',
        headers: [{ key: 'Cache-Control', value: 'private, no-store, max-age=0' }],
      },
    ];
  },
};
export default nextConfig;
