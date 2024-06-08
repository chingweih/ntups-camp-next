import withPWAInit from 'next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mgykeszptryxsxgawfvt.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/assets/**',
      },
    ],
  },
}

export default withPWA(nextConfig)
// export default nextConfig
