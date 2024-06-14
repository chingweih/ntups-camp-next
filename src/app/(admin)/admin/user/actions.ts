'use server'
import 'server-only'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { FullUser } from './UserTable'
import { revalidatePath } from 'next/cache'

export async function toggleUserVerified(user: FullUser | null) {
  if (!user) {
    return false
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ verified: !user.verified })
    .eq('id', user.id)
    .select('verified')

  if (error) {
    return false
  }

  revalidatePath('/admin/user')

  return data[0].verified || false
}

export async function toggleUserAdmin(user: FullUser | null) {
  if (!user) {
    return false
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ is_admin: !user.admin })
    .eq('id', user.id)
    .select('is_admin')

  if (error) {
    return false
  }

  revalidatePath('/admin/user')

  return data[0].is_admin || false
}

export async function setUserBalance(
  user: FullUser | null,
  newBalance: number
) {
  if (!user) {
    return false
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ balance: newBalance })
    .eq('id', user.id)
    .select('balance')

  if (error) {
    return false
  }

  revalidatePath('/admin/user')

  return data[0].balance || false
}

export async function adjustUserBalance(
  user: FullUser | null,
  amount: number,
  add: boolean
) {
  if (!user || !user.email) {
    return false
  }

  if (add) {
    const { data, error } = await supabaseAdmin.from('transactions').insert({
      amount: amount,
      from_email: 'admin@bank.ethanhuang.me',
      to_email: user.email,
      notes: '系統調整',
    })

    if (error) {
      return false
    }
  } else {
    const { data, error } = await supabaseAdmin.from('transactions').insert({
      amount: amount,
      from_email: user.email,
      to_email: 'admin@bank.ethanhuang.me',
      notes: '系統調整',
    })

    if (error) {
      return false
    }
  }

  revalidatePath('/admin/user')
}
