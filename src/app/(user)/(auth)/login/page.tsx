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

  return (
    <>
      <LoginPage />
      {process.env.DEMO_MODE === '1' ? (
        <p className='mt-3 w-full rounded-md bg-slate-300 p-5 font-mono text-sm'>
          DEMO MODE: <br />
          (1) Username: Admin / Password: password
          <br />
          (2) Username: Ethan / Password: ethanhuang
        </p>
      ) : null}
    </>
  )
}
