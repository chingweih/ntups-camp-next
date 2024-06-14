import { supabaseAdmin } from './supabase/admin'
import { createClient } from './supabase/server'
import { type User } from '@supabase/supabase-js'

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
