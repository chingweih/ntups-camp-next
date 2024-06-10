import { BankDashboard } from '@/app/_components/BankDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s｜政治營銀行',
    default: '銀行',
  },
}

export default function BankLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BankDashboard />
      {children}
    </>
  )
}
