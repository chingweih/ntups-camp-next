import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { colors } from '@/lib/custom-colors'
import {
  Bell,
  Landmark,
  LucideProps,
  Newspaper,
  Upload,
  User,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default async function AdminPanel({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-row items-start justify-between w-full gap-5'>
      <div
        className='w-2/12 flex flex-col items-center justify-center gap-3 rounded p-5 text-white'
        style={{ backgroundColor: colors.primaryBlue }}
      >
        <AdminLink href='/admin/user' Icon={User}>
          帳號管理
        </AdminLink>
        <AdminLink href='/admin/transaction' Icon={Landmark}>
          交易紀錄
        </AdminLink>
        <AdminLink href='/admin/news' Icon={Newspaper}>
          文章管理
        </AdminLink>
        <AdminLink href='/admin/task' Icon={Upload}>
          文件管理
        </AdminLink>
        <AdminLink href='/admin/notification' Icon={Bell}>
          發送通知
        </AdminLink>
      </div>
      <Separator orientation='vertical' />
      <div className='w-10/12'>{children}</div>
    </div>
  )
}

function AdminLink({
  href,
  Icon,
  children,
}: {
  href: string
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
  children: React.ReactNode
}) {
  return (
    <Button asChild variant='link' className='text-white'>
      <Link href={href}>
        <Icon size={18} className='mr-2' />
        {children}
      </Link>
    </Button>
  )
}
