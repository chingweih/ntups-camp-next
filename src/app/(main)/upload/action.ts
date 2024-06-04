'use server'

import { createClient } from '@/utils/supabase/server'

export default async function uploadFile(formData: FormData) {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from('files')
    .upload('file', formData.get('file') as File)

  if (error) {
    console.log('Error uploading file:', error.message)
  }
}
