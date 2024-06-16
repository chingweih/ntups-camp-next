'use client'

import SubmitBtn from '@/app/_components/SubmitBtn'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MultiSelect } from '@/components/ui/multi-select'
import { Textarea } from '@/components/ui/textarea'
import { FullUser } from '@/utils/auth'
import { type User } from '@supabase/supabase-js'
import { Contact } from 'lucide-react'
import { useState } from 'react'
import { sendMessageToUsers } from './actions'
import { toast } from 'sonner'

export default function SendNotificationForm({ users }: { users: FullUser[] }) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const selectUserOptions = users.map((user) => ({
    value: user.id,
    label: `${user.displayName}${user.teamType ? ` (${user.teamType})` : ''}`,
    icon: Contact,
  }))

  return (
    <form
      className='grid w-full grid-cols-6 items-center gap-6'
      action={(formData: FormData) => {
        sendMessageToUsers(selectedUsers, {
          title: formData.get('title') as string,
          body: formData.get('body') as string,
        }).then((res) => {
          if (!res) {
            toast.error('發送失敗')
          } else {
            toast.success(
              `${res.all ? '全數' : ''}發送成功${res.all ? '' : ` (${res.successCount})`}`,
            )
          }
        })
      }}
    >
      <h2 className='col-span-4 text-lg font-bold'>發送通知</h2>
      <SubmitBtn className='col-span-2' name='發送通知' />
      <Label className='col-span-2'>對象</Label>
      <div className='col-span-4'>
        <MultiSelect
          options={selectUserOptions}
          onValueChange={setSelectedUsers}
          defaultValue={selectedUsers}
          placeholder='選擇發送通知的帳號'
          variant='default'
        />
      </div>
      <Label className='col-span-2'>標題</Label>
      <Input
        type='text'
        placeholder='輸入標題'
        defaultValue='【政治營通知】'
        name='title'
        className='col-span-4'
      />
      <Label className='col-span-2'>內容</Label>
      <Textarea placeholder='' name='body' className='col-span-4' />
    </form>
  )
}
