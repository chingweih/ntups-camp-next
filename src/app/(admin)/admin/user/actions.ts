'use server'
import 'server-only'

import { supabaseAdmin } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { FullUser } from '@/utils/auth'

export type NewUser = {
  email?: string
  password?: string
  displayName?: string
  verified?: boolean
  admin?: boolean
  balance?: number
  realName?: string
  teamType?: string
  userRole?: string
}

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

export async function changeUserPassword(
  user: FullUser | null,
  password: string
) {
  if (!user) {
    return false
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
    password: password,
  })

  if (error) {
    return false
  }

  return true
}

export async function updateUserData(user: FullUser | null, props: NewUser) {
  if (!user) {
    return false
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({
      display_name: props.displayName,
      verified: props.verified,
      is_admin: props.admin,
      balance: props.balance,
      real_name: props.realName,
      team_type: props.teamType,
      role: props.userRole,
    })
    .eq('id', user.id)

  if (error) {
    return false
  }

  revalidatePath('/admin/user')

  return true
}

export async function newUser(props: NewUser) {
  if (!props.email || !props.password) {
    return false
  }

  const { data, error } = await supabaseAdmin.auth.signUp({
    email: `${props.email}@${process.env.ACCOUNT_DOMAIN}`,
    password: props.password,
  })

  if (error || !data.user?.id || !data.user?.email) {
    return false
  }

  const { error: dbError } = await supabaseAdmin
    .from('users')
    .update({
      display_name: props.displayName,
      verified: props.verified,
      is_admin: props.admin,
      balance: props.balance,
      real_name: props.realName,
      team_type: props.teamType,
      role: props.userRole,
    })
    .eq('id', data.user.id)

  if (dbError) {
    console.error(dbError)
    return false
  }

  revalidatePath('/admin/user')

  return true
}

export async function deleteUser(user: FullUser | null) {
  if (!user) {
    return false
  }

  const { error: dbError } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', user.id)

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
    user.id
  )

  if (dbError || authError) {
    console.error(dbError, authError)
    return false
  }

  revalidatePath('/admin/user')

  return true
}
