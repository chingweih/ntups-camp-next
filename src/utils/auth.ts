import { createClient } from './supabase/server'
import { type User } from '@supabase/supabase-js'

export async function getUser(): Promise<{
  user: User | null
  displayName: string | null
}> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { user: user, displayName: await getUserDisplayName(user) }
}

async function getUserDisplayName(user: User | null) {
  if (!user) {
    return null
  }

  const supabase = createClient()

  const { data, error } = await supabase
    .from('users')
    .select('display_name')
    .eq('id', user.id)
    .single()

  if (error) {
    return null
  }

  return data?.display_name || null
}
