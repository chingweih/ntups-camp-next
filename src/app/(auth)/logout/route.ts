import { createClient } from '@/utils/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export const revalidate = true

export async function GET(req: NextRequest) {
  const supabase = createClient()

  // Check if a user's logged in
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    await supabase.auth.signOut()
  }

  return NextResponse.redirect(new URL('/login', req.url), {
    status: 302,
  })
}
