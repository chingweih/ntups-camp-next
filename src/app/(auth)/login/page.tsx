import type { Metadata } from 'next'
import LoginPage from './LoginPage'

export const metadata: Metadata = {
  title: '登入',
  description: '使用提供的帳號登入',
}

export default function Login() {
  return <LoginPage />
}
