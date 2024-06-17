'use client'

import { DataTable } from '@/app/_components/DataTable'
import DeleteDialog from '@/app/_components/DeleteDialog'
import SubmitBtn from '@/app/_components/SubmitBtn'
import UserAvatar from '@/app/_components/UserAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { currencyFormatter } from '@/lib/formatters'
import { FullUser } from '@/utils/auth'
import { ColumnDef } from '@tanstack/react-table'
import { Diff, Plus, UserCheck, UserCog, UserX } from 'lucide-react'
import { useOptimistic, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  adjustUserBalance,
  changeUserPassword,
  deleteUser,
  newUser,
  setUserBalance,
  toggleUserAdmin,
  toggleUserVerified,
  updateUserData,
} from './actions'

const userRoleMap = {
  staff: '工作人員',
  npc: 'NPC',
  team: '小隊',
}

export default function UserTable({ users }: { users: FullUser[] }) {
  users.sort((a, b) => (a.isCurrent ? -1 : b.isCurrent ? 1 : 0))

  return (
    <>
      <div className='flex flex-row items-center justify-between p-3'>
        <h2 className='text-lg font-bold'>帳號列表</h2>
        <NewUserDialog />
      </div>
      <DataTable columns={columns} data={users} />
    </>
  )
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
            <p className='text-xs text-slate-500'>
              {`${user.email?.split('@')[0]}${
                user.realName ? ' (' + user.realName + ')' : ''
              }`}
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
    id: 'userRole',
    header: '類別',
    cell: ({ row }) => {
      const user = row.original

      return (
        <>
          {user.userRole ? (
            <Badge>
              {user.teamType}
              {user.userRole}
            </Badge>
          ) : null}
        </>
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
        <div className='flex flex-row items-center justify-start gap-1'>
          <div className='flex flex-row items-center justify-start gap-2 pr-2'>
            <VerificationCheckBox user={user} />
          </div>
          <ToggleAdminButton user={user} />
          <BalanceDialog user={user} />
          <EditUserDialog user={user} />
          <DeleteDialog
            title='確定要刪除此帳號嗎？'
            onClick={() =>
              deleteUser(user).then((result) => {
                if (!result) {
                  toast.error('帳號刪除失敗')
                  return false
                }
                toast.success('帳號已刪除')
                return true
              })
            }
            disabled={user.isCurrent}
          />
        </div>
      )
    },
  },
]

function ToggleAdminButton({ user }: { user: FullUser }) {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      variant='ghost'
      onClick={async () => {
        toast.loading('更新管理員中', {
          id: `update-admin-${user.id}`,
          duration: Infinity,
        })
        setLoading(true)
        await toggleUserAdmin(user)
        setLoading(false)
        toast.dismiss(`update-admin-${user.id}`)
        toast.success('更新成功')
      }}
      disabled={user.isCurrent || loading}
      className='m-0 p-2'
    >
      {user.admin ? <UserCheck size={18} /> : <UserX size={18} />}
    </Button>
  )
}

function VerificationCheckBox({ user }: { user: FullUser }) {
  const [optimisticVerified, setOptimisticVerified] = useState(user.verified)
  const [loading, setLoading] = useState(false)

  return (
    <>
      <Checkbox
        checked={optimisticVerified}
        onCheckedChange={async () => {
          toast.loading(
            `帳號 ${user.displayName} ${user.verified ? '取消' : ''}驗證中`,
            {
              id: `update-verified-${user.id}`,
              duration: Infinity,
            },
          )
          setLoading(true)
          setOptimisticVerified(!optimisticVerified)
          const verified = await toggleUserVerified(user)
          setLoading(false)
          toast.dismiss(`update-verified-${user.id}`)
          setOptimisticVerified(verified)
          toast.success(`${user.displayName} 驗證修改成功`)
        }}
        disabled={loading}
      />
      <Label>{optimisticVerified ? '已驗證' : '未驗證'}</Label>
    </>
  )
}

function NewUserDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>
          <Plus size={18} className='mr-2' />
          新增帳號
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>新增帳號</DialogTitle>
        </DialogHeader>
        <form
          action={(formData: FormData) => {
            newUser({
              email: formData.get('email') as string,
              password: formData.get('password') as string,
              displayName: formData.get('displayName') as string,
              realName: formData.get('realName') as string,
              userRole: formData.get('userRole') as string,
            }).then((result) => {
              if (!result) {
                toast.error('帳號新增失敗')
                return
              }
              setOpen(false)
              toast.success('帳號已新增')
            })
          }}
          className='mt-10 grid grid-cols-6 items-center justify-between gap-8'
        >
          <Label className='col-span-3'>帳號</Label>
          <input
            type='text'
            name='email'
            className='col-span-3 w-full rounded border border-slate-300 p-2'
          />
          <Label className='col-span-3'>密碼</Label>
          <input
            type='text'
            name='password'
            className='col-span-3 w-full rounded border border-slate-300 p-2'
          />
          <Label className='col-span-3'>顯示名稱</Label>
          <input
            type='text'
            name='displayName'
            className='col-span-3 w-full rounded border border-slate-300 p-2'
          />
          <Label className='col-span-3'>真實姓名</Label>
          <input
            type='text'
            name='realName'
            className='col-span-3 w-full rounded border border-slate-300 p-2'
          />
          <Label className='col-span-3'>角色</Label>
          <Select name='userRole'>
            <SelectTrigger className='col-span-3 w-[180px]'>
              <SelectValue placeholder='請選擇' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='工作人員'>工作人員</SelectItem>
              <SelectItem value='NPC'>NPC</SelectItem>
              <SelectItem value='小隊'>小隊</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter className='col-span-6'>
            <SubmitBtn name='確定' className='w-40' />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditUserDialog({ user }: { user: FullUser }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' className='m-0 p-2'>
          <UserCog size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>修改帳號資料</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue='info' className='w-full'>
          <TabsList className='w-full'>
            <TabsTrigger value='info' className='w-full'>
              資料
            </TabsTrigger>
            <TabsTrigger value='password' className='w-full'>
              密碼
            </TabsTrigger>
          </TabsList>
          <TabsContent value='info'>
            <form
              action={(formData: FormData) => {
                updateUserData(user, {
                  displayName: formData.get('displayName') as string,
                  realName: formData.get('realName') as string,
                  userRole: formData.get('userRole') as string,
                  teamType: formData.get('teamType') as string,
                }).then(() => {
                  setOpen(false)
                  toast.success('帳號資料已更新')
                })
              }}
              className='mt-10 grid grid-cols-6 items-center justify-between gap-8'
            >
              <Label className='col-span-3'>顯示名稱</Label>
              <input
                type='text'
                name='displayName'
                className='col-span-3 w-full rounded border border-slate-300 p-2'
                defaultValue={user.displayName || ''}
              />
              <Label className='col-span-3'>真實姓名</Label>
              <input
                type='text'
                name='realName'
                className='col-span-3 w-full rounded border border-slate-300 p-2'
                defaultValue={user.realName || ''}
              />
              <Label className='col-span-3'>角色</Label>
              <Select name='userRole' defaultValue={user.userRole || undefined}>
                <SelectTrigger className='col-span-3 w-[180px]'>
                  <SelectValue placeholder='請選擇' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='工作人員'>工作人員</SelectItem>
                  <SelectItem value='NPC'>NPC</SelectItem>
                  <SelectItem value='小隊'>小隊</SelectItem>
                </SelectContent>
              </Select>
              {user.userRole == '小隊' ? (
                <>
                  <Label className='col-span-3'>小隊類型</Label>
                  <Select
                    name='teamType'
                    defaultValue={user.teamType || undefined}
                  >
                    <SelectTrigger className='col-span-3 w-[180px]'>
                      <SelectValue placeholder='請選擇' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='政黨'>政黨</SelectItem>
                      <SelectItem value='利團'>利團</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : null}
              <DialogFooter className='col-span-6'>
                <SubmitBtn name='確定' className='w-40' />
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value='password'>
            <form
              action={(formData: FormData) => {
                const newPassword = formData.get('password') as string
                changeUserPassword(user, newPassword).then((result) => {
                  if (result) {
                    setOpen(false)
                    toast.success('密碼已更新')
                  } else {
                    toast.error('密碼更新失敗，請使用不同的密碼')
                  }
                })
              }}
              className='mt-10 grid grid-cols-6 items-center justify-between gap-8'
            >
              <Label className='col-span-3'>新密碼</Label>
              <input
                type='text'
                name='password'
                className='col-span-3 w-full rounded border border-slate-300 p-2'
              />
              <DialogFooter className='col-span-6'>
                <SubmitBtn name='確定' className='w-40' />
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function BalanceDialog({ user }: { user: FullUser }) {
  const [adjustedBalance, setAdjustedBalance] = useState<string>('0')
  const [open, setOpen] = useState(false)
  const addRef = useRef<HTMLButtonElement>(null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                  formData.get('balance') as unknown as number,
                )
                  .then(() => setOpen(false))
                  .finally(() => toast.success('帳戶餘額已更新'))
              }}
              className='mt-10 grid grid-cols-6 items-center justify-between gap-8'
            >
              <Label className='col-span-3'>原餘額</Label>
              <Label className='col-span-3 text-right'>
                {currencyFormatter.format(user.balance)}
              </Label>
              <Label className='col-span-4'>新餘額</Label>
              <input
                type='number'
                name='balance'
                className='col-span-2 w-full rounded border border-slate-300 p-2'
              />
              <DialogFooter className='col-span-6 mt-5'>
                <SubmitBtn name='確定' className='w-40' />
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value='adjust'>
            <form
              action={async (formData: FormData) => {
                adjustUserBalance(
                  user,
                  formData.get('amount') as unknown as number,
                  addRef.current?.ariaChecked == 'true',
                )
                  .then(() => setOpen(false))
                  .finally(() => toast.success('帳戶餘額已調整'))
              }}
              className='mt-10 grid grid-cols-6 items-center justify-between gap-8'
            >
              <Label className='col-span-3'>原餘額</Label>
              <Label className='col-span-3 text-right'>
                {currencyFormatter.format(user.balance)}
              </Label>
              <Label className='col-span-2'>新增或減少</Label>
              <RadioGroup
                defaultValue='add'
                className='col-span-2 grid grid-cols-2 items-center justify-start gap-2'
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
                className='col-span-2 w-full rounded border border-slate-300 p-2'
                onChange={(e) => {
                  setAdjustedBalance(e.target.value)
                }}
              />
              <Label className='col-span-3'>新餘額</Label>
              <Label className='col-span-3 text-right'>
                {currencyFormatter.format(
                  user.balance +
                    (parseInt(adjustedBalance) *
                      (addRef.current?.ariaChecked == 'true' ? 1 : -1) || 0),
                )}
              </Label>
              <DialogFooter className='col-span-6 mt-5'>
                <SubmitBtn name='確定' className='w-40' />
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
