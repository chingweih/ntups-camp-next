import { supabaseAdmin } from './supabase/admin'
import { createClient } from './supabase/server'
import { type User } from '@supabase/supabase-js'

export type FullUser = User & {
  displayName: string | null
  verified: boolean
  admin: boolean
  isCurrent: boolean
  balance: number
  realName: string | null
  teamType: string | null
  userRole: string | null
}

export async function getUser(): Promise<{
  user: User | null
  displayName: string | null
  userName: string | null
  isAdmin: boolean
}> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return {
    user: user,
    displayName: await getUserDisplayName(user),
    userName: user?.email?.split('@')[0] || null,
    isAdmin: await checkUserAdmin(user),
  }
}

export async function getFullUser(user: User | null): Promise<FullUser | null> {
  if (!user) {
    return null
  }

  const { user: loginUser } = await getUser()

  return {
    ...user,
    displayName: await getUserDisplayName(user),
    verified: await checkUserVerified(user),
    admin: await checkUserAdmin(user),
    isCurrent: loginUser?.id === user.id,
    balance: (await adminGetUserBalance(user)) || 0,
    realName: await getUserRealName(user),
    teamType: await getUserTeamType(user),
    userRole: await getUserRole(user),
  }
}

export async function getUserDisplayName(user: User | null) {
  if (!user) {
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('display_name')
    .eq('id', user.id)
    .single()

  if (error) {
    return null
  }

  return data?.display_name || null
}

export async function checkUserVerified(user: User | null) {
  if (!user) {
    return false
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('verified')
    .eq('id', user.id)
    .single()

  if (error) {
    return false
  }

  return data?.verified || false
}

export async function checkUserAdmin(user: User | null) {
  if (!user) {
    return false
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (error) {
    return false
  }

  return data?.is_admin || false
}

export async function adminGetUserBalance(user: User) {
  if (!user?.email) {
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('balance')
    .eq('email', user.email)
    .single()

  if (error) {
    return null
  }

  return data?.balance
}

export async function getUserRealName(user: User) {
  if (!user?.email) {
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('real_name')
    .eq('email', user.email)
    .single()

  if (error) {
    return null
  }

  return data?.real_name
}

export async function getUserTeamType(user: User) {
  if (!user?.email) {
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('team_type')
    .eq('email', user.email)
    .single()

  if (error) {
    return null
  }

  return data?.team_type
}

export async function getUserRole(user: User) {
  if (!user?.email) {
    return null
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('email', user.email)
    .single()

  if (error) {
    return null
  }

  return data?.role
}

export async function adminGetUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (error || !data) {
    return null
  }

  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.getUserById(data.id)

  return getFullUser(userData.user)
}
