'use server'

import { getUser } from '@/utils/auth'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export default async function uploadFile(formData: FormData, taskId: number) {
  const { user, userName } = await getUser()

  if (!user?.email) {
    redirect(`/login?next=${encodeURI('/upload')}`)
  }

  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from('files')
    .upload(
      `task-${taskId.toString()}-${userName}-${Date.now()}.pdf`,
      formData.get('file') as File
    )

  if (error) {
    return { error: error.message }
  }

  const { error: dbError } = await supabase.from('uploads').insert({
    task_id: taskId,
    user: user?.email,
    file_url: data.path,
  })

  if (dbError) {
    return { error: dbError.message }
  }

  revalidatePath('/upload')
  redirect('/upload')
}
