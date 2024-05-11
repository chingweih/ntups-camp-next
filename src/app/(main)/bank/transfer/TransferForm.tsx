'use client'

import SubmitBtn from '@/app/_components/SubmitBtn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type User } from '@supabase/supabase-js'
import { RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { insertTransaction, type Transaction } from '../queries'

export default function TransferForm({ user }: { user: User }) {
  const formRef = useRef<HTMLFormElement>(null)
  toast.dismiss('transfer-error')

  if (!user?.email) {
    return null
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='flex flex-row gap-3'>
            <RefreshCcw />
            轉帳
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            ref={formRef}
            action={async (formData: FormData) => {
              const data: Transaction = {
                from_email: user.email! as string,
                to_email: formData.get('to_email')! as string,
                amount: parseInt(formData.get('amount')! as string),
                notes: formData.get('notes') as string,
              }
              const { error } = await insertTransaction(data)
              if (error) {
                toast.error(error.message, {
                  id: 'transfer-error',
                })
                formRef.current?.reset()
              }
            }}
            className='grid grid-cols-6 justify-between items-center gap-5'
          >
            <Label className='col-span-2 flex flex-row gap-1 items-center'>
              轉出
            </Label>
            <Input
              type='text'
              className='col-span-4'
              defaultValue={
                user.email.split('@')[0][0].toUpperCase() +
                user.email.split('@')[0].slice(1) +
                '（此帳號）'
              }
              readOnly
              disabled
            ></Input>
            <Label className='col-span-2'>轉入</Label>
            <Input
              type='text'
              className='col-span-4'
              required
              name='to_email'
            ></Input>
            <Label className='col-span-2'>金額</Label>
            <Input
              type='number'
              className='col-span-4'
              required
              name='amount'
            ></Input>
            <Label className='col-span-2'>附註</Label>
            <Input type='text' className='col-span-4' name='notes'></Input>

            <Button asChild variant='link' className='col-span-3'>
              <Link href='/bank'>取消</Link>
            </Button>
            <SubmitBtn name='確定' className='col-span-3' />
          </form>
        </CardContent>
      </Card>
    </>
  )
}
