'use server'
import 'server-only'

import { sendMessageToUsers } from '@/app/(admin)/admin/notification/actions'
import { adminGetUserByEmail, getUserDisplayName } from '@/utils/auth'
import { createClient } from '@/utils/supabase/server'
import { type User } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getUserBalance } from './bank-quries'

export type Transaction = {
  from_email: string
  to_email: string
  amount: number
  notes?: string
}

export async function insertTransaction(
  { from_email, to_email, amount, notes }: Transaction,
  user: User,
) {
  if (amount <= 0) {
    return '金額必須大於 0'
  }

  if (from_email !== user.email) {
    return '僅能使用自己的帳號進行轉帳'
  }

  const userBalance = await getUserBalance(user)

  if (!userBalance) {
    return '無法取得餘額'
  }

  if (amount > userBalance) {
    return '餘額不足'
  }

  const supabase = createClient()
  const { error } = await supabase.from('transactions').insert({
    from_email: from_email,
    to_email: `${to_email.toLowerCase()}@${process.env.ACCOUNT_DOMAIN}`,
    amount: amount,
    notes: notes,
  })

  if (error) {
    return '使用者不存在或其他錯誤'
  } else {
    const to_user = await adminGetUserByEmail(
      `${to_email.toLowerCase()}@${process.env.ACCOUNT_DOMAIN}`,
    )
    const from_user = await adminGetUserByEmail(from_email)

    if (!to_user || !from_user) {
      return '使用者不存在或其他錯誤'
    }

    sendMessageToUsers([from_user.id], {
      title: '【政治營帳務通知】轉帳成功',
      body: `已成功轉帳 ${amount} 元給 ${await getUserDisplayName(to_user)}${notes ? `（備註：${notes}）` : ''}`,
    })

    sendMessageToUsers([to_user.id], {
      title: '【政治營帳務通知】入帳通知',
      body: `${await getUserDisplayName(from_user)} 轉帳 ${amount} 元給你${notes ? `（備註：${notes}）` : ''}`,
    })

    revalidatePath('/bank')
    redirect('/bank')
    return null
  }
}
