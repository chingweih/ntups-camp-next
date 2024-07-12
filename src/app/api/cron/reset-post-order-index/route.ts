import { supabaseAdmin } from '@/utils/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  // Vercel cron job validation
  if (process.env.NODE_ENV !== 'development') {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', {
        status: 401,
      })
    }
  }

  return supabaseAdmin
    .from('posts')
    .select('id')
    .order('order', { ascending: true })
    .then(({ data, error }) => {
      if (error) {
        console.error(error)
        return new Response('Fail to fetch posts', { status: 500 })
      }

      return data.forEach((post, index) => {
        supabaseAdmin
          .from('posts')
          .update({ order: (index + 1) * 100000 })
          .match({ id: post.id })
          .then(({ error }) => {
            if (error) {
              console.error(error)
              return error
            }
          })
      })
    })
    .then((error) => {
      if (error) {
        return new Response('Fail to update post order', { status: 500 })
      }

      return NextResponse.json({
        success: 'Post order reset.',
        timecode: new Date().toISOString(),
      })
    })
}
