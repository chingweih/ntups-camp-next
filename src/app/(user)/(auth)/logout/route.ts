import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export const revalidate = true

export async function GET(req: NextRequest) {
  const supabase = createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut({ scope: 'local' })
  }

  revalidatePath('/', 'layout')
  revalidatePath('/', 'page')
  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })
}