'use server'
import { getUser } from '@/utils/auth'
import { supabaseAdmin } from '@/utils/supabase/admin'
import 'server-only'

export async function uploadImage(formData: FormData) {
  const { isAdmin } = await getUser()

  if (!isAdmin) {
    return null
  }

  const file = formData.get('file') as File

  const { data, error } = await supabaseAdmin.storage
    .from('assets')
    .upload(`post-image-${Date.now()}.${file.name.split('.')[-1]}`, file)

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  return supabaseAdmin.storage.from('assets').getPublicUrl(data.path)
}
