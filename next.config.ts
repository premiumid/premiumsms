import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      { hostname: 'pub-95c2092167d04db7b77824f71f6c6512.r2.dev' },
      { hostname: 'flagcdn.com' },
      { hostname: 'cdn.simpleicons.org' }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://pub-95c2092167d04db7b77824f71f6c6512.r2.dev https://flagcdn.com https://cdn.simpleicons.org; font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com; connect-src 'self' https://*.supabase.co https://api.nowpayments.io https://ipn.nowpayments.io; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self'" },
        ],
      },
    ]
  },
};

export default withNextIntl(nextConfig);
