import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import title from '../assets/title.png'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import UserHeader from './_components/UserHeader'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: '憲政熱映中｜臺大政治營',
  description: 'July 15-19｜2024 模擬選戰',
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
          'min-h-screen bg-background font-sans antialiased container flex justify-center items-start p-5',
          inter.variable
        )}
        style={{ backgroundColor: '#fffefc' }}
      >
        <div className='mx-auto w-full max-w-md'>
          <div className='flex flex-row items-center justify-center m-2'>
            <Image src={title} alt='憲政熱映中' height={50} />
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}
