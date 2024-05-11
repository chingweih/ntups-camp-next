'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'
import SubmitBtn from '@/app/_components/SubmitBtn'

export default function LoginForm({
  login,
}: {
  login: (formData: FormData) => Promise<string | null>
}) {
  const [error, setError] = useState<string | null>(null)

  return (
    <div className='mt-10'>
      <Card>
        <CardHeader>
          <CardTitle>登入</CardTitle>
          <CardDescription>使用提供的帳號登入</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>錯誤</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form
            action={async (formData) => {
              setError(null)

              const error = await login(formData)
              if (error) {
                setError(error)
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
