import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
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

export default withSerwist(nextConfig)
// export default nextConfig
