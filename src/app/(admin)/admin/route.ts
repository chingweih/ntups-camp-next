import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/admin/user', req.url), {
    status: 302,
  })
}
