import AdminLink from '@/app/_components/AdminLink'
import { colors } from '@/lib/custom-colors'
import { Bell, Landmark, Newspaper, Upload, User } from 'lucide-react'
import React from 'react'

export default async function AdminPanel({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex w-full flex-col items-start justify-between gap-10 sm:flex-row'>
      <div
        className='sticky top-5 z-50 flex w-full flex-row items-center justify-center rounded-full p-2 text-white shadow-sm shadow-slate-300 sm:top-8 sm:w-2/12 sm:flex-col sm:gap-3 sm:rounded sm:p-5 sm:shadow-none'
        style={{ backgroundColor: colors.primaryBlue }}
      >
        <AdminLink href='/admin/user'>
          <User size={18} className='mr-1 sm:mr-2' />
          帳號<span className='hidden md:inline'>管理</span>
        </AdminLink>
        <AdminLink href='/admin/transaction'>
          <Landmark size={18} className='mr-1 sm:mr-2' />
          交易<span className='hidden md:inline'>紀錄</span>
        </AdminLink>
        <AdminLink href='/admin/news'>
          <Newspaper size={18} className='mr-1 sm:mr-2' />
          文章<span className='hidden md:inline'>管理</span>
        </AdminLink>
        <AdminLink href='/admin/task'>
          <Upload size={18} className='mr-1 sm:mr-2' />
          文件<span className='hidden md:inline'>管理</span>
        </AdminLink>
        <AdminLink href='/admin/notification'>
          <Bell size={18} className='mr-1 sm:mr-2' />
          <span className='hidden md:inline'>發送</span>通知
        </AdminLink>
      </div>
      <div className='w-full sm:w-10/12'>{children}</div>
    </div>
  )
}
