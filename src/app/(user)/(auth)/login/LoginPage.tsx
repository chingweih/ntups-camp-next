'use client'

import Link from 'next/link'
import { login } from '../actions'
import LoginForm from './LoginForm'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next')

  return (
    <>
      <LoginForm login={(formData) => login(formData, next ? next : null)} />
      <Button asChild className='mt-3 w-full' variant='link'>
        <Link href='/'>回首頁</Link>
      </Button>
    </>
  )
}
