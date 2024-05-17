'use server'
import 'server-only'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { type User } from '@supabase/supabase-js'
import { getUserBalance } from './bank-quries'

export type Transaction = {
  from_email: string
  to_email: string
  amount: number
  notes?: string
}

export async function insertTransaction(
  { from_email, to_email, amount, notes }: Transaction,
  user: User
) {
  if (amount <= 0) {
    return { error: '金額必須大於 0' }
  }

  if (from_email !== user.email) {
    return { error: '僅能使用自己的帳號進行轉帳' }
  }

  const userBalance = await getUserBalance(user)

  if (!userBalance) {
    return { error: '無法取得餘額' }
  }

  if (amount > userBalance) {
    return { error: '餘額不足' }
  }

  const supabase = createClient()
  const { error } = await supabase.from('transactions').insert({
    from_email: from_email,
    to_email: `${to_email}@${process.env.ACCOUNT_DOMAIN}`,
    amount: amount,
    notes: notes,
  })

  if (!error) {
    revalidatePath('/bank')
    redirect('/bank')
  }

  return { error: error.message.toString() }
}
