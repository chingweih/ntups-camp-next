import { BankDashboard } from '@/app/_components/BankDashboard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '銀行｜臺大政治營',
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
