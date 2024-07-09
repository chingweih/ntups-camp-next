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
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/user',
        permanent: true,
      },
      {
        source: '/redirect/templates',
        destination:
          'https://drive.google.com/drive/folders/1DC3TW7Oual7wd_ivvwftuq9tn1pXyi5C?usp=sharing',
        permanent: true,
      },
    ]
  },
}

export default withSerwist(nextConfig)
