'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData, next?: string | null) {
  const supabase = createClient()

  const data = {
    email: `${formData.get('email') as string}@${process.env.ACCOUNT_DOMAIN}`,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return error.message
  }

  const nextPath = next ? (next.startsWith('/') ? next : '/') : '/'

  revalidatePath(nextPath, 'layout')
  redirect(nextPath)
}