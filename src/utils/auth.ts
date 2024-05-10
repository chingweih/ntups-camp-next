import { createClient } from './supabase/server'
import { type User } from '@supabase/supabase-js'

export async function useAuth() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { user }
}
