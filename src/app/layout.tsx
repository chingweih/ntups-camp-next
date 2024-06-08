import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import title from '../assets/title.png'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Toaster } from '@/components/ui/sonner'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Navigation from './_components/Navigation'
import { colors } from '@/lib/custom-colors'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    template: '%s | 臺大政治營',
    default: '憲政熱映中｜臺大政治營',
  },
  applicationName: '臺大政治營',
  description: 'July 15-19｜2024 模擬選戰',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
  },
  icons: [
    {
      rel: 'icon',
      sizes: '32x32',
      url: '/ios/32.png',
    },
    {
      rel: 'icon',
      sizes: '16x16',
      url: '/ios/16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/ios/180.png',
    },
  ],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
  themeColor: colors.pageBackground,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased container flex justify-center items-start p-5 pt-3',
          inter.variable
        )}
        style={{ backgroundColor: colors.pageBackground }}
      >
        <div className='mx-auto w-full max-w-md'>
          <div className='flex flex-row items-center justify-center m-2 mt-1'>
            <Image src={title} alt='憲政熱映中' height={50} priority={true} />
          </div>
          <SpeedInsights />
          <Navigation />
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
