import type { Metadata } from 'next'
import LoginPage from './LoginPage'
import { getUser } from '@/utils/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: '登入',
  description: '使用提供的帳號登入',
}

export default async function Login() {
  const { user } = await getUser()
  if (user) {
    redirect('/')
  }

  return <LoginPage />
}
