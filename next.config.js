/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Next.js 14
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  experimental: {
    // optimizeCss: true, // Comentado temporalmente por problemas de dependencias
  },
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  reactStrictMode: true,
  trailingSlash: false,
  // env: {
  //   CUSTOM_KEY: process.env.CUSTOM_KEY, // Comentado por no estar definido
  // },
}

module.exports = nextConfig
