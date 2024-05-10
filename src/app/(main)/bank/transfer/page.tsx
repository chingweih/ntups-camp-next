import { useAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'
import TransferForm from './TransferForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '轉帳｜臺大政治營',
}

export default async function Transfer() {
  const { user } = await useAuth()

  if (!user?.email) {
    redirect('/login')
  }

  return <TransferForm user={user} />
}
