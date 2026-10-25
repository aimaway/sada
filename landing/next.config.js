/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['fr', 'ar', 'en'],
    defaultLocale: 'fr',
    localeDetection: true,
  },
  images: {
    domains: ['localhost'],
  },
  // Performance optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
