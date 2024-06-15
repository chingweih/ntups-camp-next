'use server'
import 'server-only'

import { supabaseAdmin } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function deletePost(id: number) {
  const { error } = await supabaseAdmin.from('posts').delete().eq('id', id)

  revalidatePath('/admin/news')
  return error
}
