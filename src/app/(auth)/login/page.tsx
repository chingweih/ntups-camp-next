import { login } from '../actions'
import LoginForm from './LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '登入',
  description: '使用提供的帳號登入',
}

export default function Login() {
  return <LoginForm login={login} />
}
