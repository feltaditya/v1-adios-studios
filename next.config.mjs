/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production'
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages: [],
  // Allow accessing dev server via LAN IP without warnings
  experimental: isDev
    ? { allowedDevOrigins: ["http://192.168.1.104:3000"], turbo: { rules: {} } }
    : {},
}

export default nextConfig
