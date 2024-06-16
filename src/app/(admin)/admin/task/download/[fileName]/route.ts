import { getUser } from '@/utils/auth'
import { supabaseAdmin } from '@/utils/supabase/admin'
import { NextResponse, type NextRequest } from 'next/server'

export const revalidate = true

export async function GET(
  req: NextRequest,
  { params }: { params: { fileName: string } }
) {
  const { isAdmin } = await getUser()

  if (!isAdmin) {
    return NextResponse.redirect(new URL('/', req.url), {
      status: 302,
    })
  }

  const file = await supabaseAdmin.storage
    .from('files')
    .createSignedUrl(params.fileName, 3600)

  if (!file?.data?.signedUrl) {
    return NextResponse.redirect(new URL('/', req.url), {
      status: 302,
    })
  }

  return NextResponse.redirect(file.data.signedUrl, {
    status: 302,
  })
}
