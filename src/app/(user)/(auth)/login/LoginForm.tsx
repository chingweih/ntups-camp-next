'use client'

import SubmitBtn from '@/app/_components/SubmitBtn'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { useRef } from 'react'
import { toast } from 'sonner'

export default function LoginForm({
  login,
}: {
  login: (formData: FormData) => Promise<string | null>
}) {
  const formRef = useRef<HTMLFormElement>(null)
  toast.dismiss('login-error')

  return (
    <div className='mt-10'>
      <Card>
        <CardHeader>
          <CardTitle>登入</CardTitle>
          <CardDescription>使用提供的帳號登入</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            ref={formRef}
            action={async (formData) => {
              const error = await login(formData)
              if (error) {
                toast.error(error, { id: 'login-error' })
                formRef.current?.reset()
              }
            }}
          >
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>帳號</Label>
                <Input
                  id='email'
                  name='email'
                  placeholder='your.account'
                  required
                  type='text'
                  autoCorrect='off'
                  autoCapitalize='none'
                  autoComplete='off'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>密碼</Label>
                <Input
                  id='password'
                  name='password'
                  required
                  type='password'
                  autoCorrect='off'
                  autoCapitalize='none'
                  autoComplete='off'
                />
              </div>
              <SubmitBtn name='登入' />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
