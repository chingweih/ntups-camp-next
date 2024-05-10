import { BankDashboard } from '@/app/_components/BankDashboard'

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
