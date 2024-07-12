import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '../database.types'
import { getUser } from '../auth'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    },
  )

  // refreshing the auth token
  await supabase.auth.getUser()

  const { user, isAdmin, verified } = await getUser()
  if (request.nextUrl.pathname.startsWith('/admin') && !isAdmin) {
    if (user) {
      return NextResponse.redirect(new URL('/', request.url))
    } else {
      return NextResponse.redirect(
        new URL(`/login?next=${request.nextUrl.pathname}`, request.url),
      )
    }
  }

  if (isProtectedRoute(request.nextUrl)) {
    if (!user) {
      return NextResponse.redirect(
        new URL(`/login?next=${request.nextUrl.pathname}`, request.url),
      )
    }

    if (!verified) {
      return NextResponse.redirect(new URL('/error/not-verified', request.url))
    }
  }

  return response
}

function isProtectedRoute(url: URL) {
  const protectedRoutes = ['/bank', '/upload', '/qrcode']

  return protectedRoutes.some((route) => url.pathname.startsWith(route))
}
