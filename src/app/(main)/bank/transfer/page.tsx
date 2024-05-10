import { useAuth } from '@/utils/auth'
import { redirect } from 'next/navigation'
import TransferForm from './TransferForm'

export default async function Transfer() {
  const { user } = await useAuth()

  if (!user?.email) {
    redirect('/login')
  }

  return <TransferForm user={user} />
}
