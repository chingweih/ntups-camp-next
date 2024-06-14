'use client'

import { DataTable } from '@/app/_components/DataTable'
import UserAvatar from '@/app/_components/UserAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { currencyFormatter } from '@/lib/formatters'
import { type User } from '@supabase/supabase-js'
import { ColumnDef } from '@tanstack/react-table'
import { Diff, UserCheck, UserX } from 'lucide-react'
import {
  adjustUserBalance,
  setUserBalance,
  toggleUserAdmin,
  toggleUserVerified,
} from './actions'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import SubmitBtn from '@/app/_components/SubmitBtn'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useRef, useState } from 'react'

export type FullUser = User & {
  displayName: string | null
  verified: boolean
  admin: boolean
  isCurrent: boolean
  balance: number
}

const columns: ColumnDef<FullUser>[] = [
  {
    id: 'users',
    header: '帳號',
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className='flex flex-row items-center justify-start gap-3'>
          <UserAvatar user={user} userDisplayName={user.displayName} />
          <div className='flex flex-col items-start justify-center'>
            <p>{user.displayName}</p>
            <p className='text-slate-500 text-xs'>
              {user.email?.split('@')[0]}
            </p>
          </div>
          {user.admin ? (
            <Badge variant='secondary'>
              Admin{user.isCurrent ? ' (current)' : ''}
            </Badge>
          ) : null}
        </div>
      )
    },
  },
  {
    accessorKey: 'balance',
    header: '餘額',
    cell: ({ row }) => {
      return currencyFormatter.format(row.getValue('balance'))
    },
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => {
      const user = row.original

      return (
        <div className='flex flex-row items-center justify-start gap-2'>
          <div className='flex flex-row items-center justify-start gap-2 pr-2'>
            <Checkbox
              checked={user.verified}
              onCheckedChange={() => toggleUserVerified(user)}
            />
            <Label>{user.verified ? '已驗證' : '未驗證'}</Label>
          </div>
          <Button
            variant='ghost'
            onClick={() => toggleUserAdmin(user)}
            disabled={user.isCurrent}
            className='m-0 p-2'
          >
            {user.admin ? <UserCheck size={18} /> : <UserX size={18} />}
          </Button>
          <BalanceDialog user={user} />
        </div>
      )
    },
  },
]

export default function UserTable({ users }: { users: FullUser[] }) {
  return <DataTable columns={columns} data={users} />
}

function BalanceDialog({ user }: { user: FullUser }) {
  const [adjustedBalance, setAdjustedBalance] = useState<string>('0')
  const addRef = useRef<HTMLButtonElement>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' className='m-0 p-2'>
          <Diff size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>調整帳戶餘額</DialogTitle>
          <DialogDescription>
            設定｜直接將帳戶餘額修改為新的數字，不增加交易紀錄
            <br />
            調整｜新增一筆交易紀錄
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue='set' className='w-full'>
          <TabsList className='w-full'>
            <TabsTrigger value='set' className='w-full'>
              設定
            </TabsTrigger>
            <TabsTrigger value='adjust' className='w-full'>
              調整
            </TabsTrigger>
          </TabsList>
          <TabsContent value='set'>
            <form
              action={(formData: FormData) => {
                setUserBalance(
                  user,
                  formData.get('balance') as unknown as number
                )
              }}
              className='grid grid-cols-6 justify-between items-center gap-8 mt-10'
            >
              <Label className='col-span-3'>原餘額</Label>
              <Label className='col-span-3 text-right'>
                {currencyFormatter.format(user.balance)}
              </Label>
              <Label className='col-span-4'>新餘額</Label>
              <input
                type='number'
                name='balance'
                className='w-full p-2 border border-slate-300 rounded col-span-2'
              />
              <DialogFooter className='mt-5 col-span-6'>
                <SubmitBtn name='確定' className='w-40' />
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value='adjust'>
            <form
              action={(formData: FormData) => {
                adjustUserBalance(
                  user,
                  formData.get('amount') as unknown as number,
                  addRef.current?.ariaChecked == 'true'
                )
              }}
              className='grid grid-cols-6 justify-between items-center gap-8 mt-10'
            >
              <Label className='col-span-3'>原餘額</Label>
              <Label className='col-span-3 text-right'>
                {currencyFormatter.format(user.balance)}
              </Label>
              <Label className='col-span-2'>新增或減少</Label>
              <RadioGroup
                defaultValue='add'
                className='col-span-2 grid grid-cols-2 justify-start items-center gap-2'
                name='add'
              >
                <RadioGroupItem value='add' ref={addRef} />
                <Label>新增</Label>
                <RadioGroupItem value='subtract' />
                <Label>減少</Label>
              </RadioGroup>
              <input
                type='number'
                name='amount'
                className='w-full p-2 border border-slate-300 rounded col-span-2'
                onChange={(e) => {
                  setAdjustedBalance(e.target.value)
                }}
              />
              <Label className='col-span-3'>新餘額</Label>
              <Label className='col-span-3 text-right'>
                {currencyFormatter.format(
                  user.balance +
                    (parseInt(adjustedBalance) *
                      (addRef.current?.ariaChecked == 'true' ? 1 : -1) || 0)
                )}
              </Label>
              <DialogFooter className='mt-5 col-span-6'>
                <SubmitBtn name='確定' className='w-40' />
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
