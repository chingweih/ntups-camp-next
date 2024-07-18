'use server'
import 'server-only'

import { getUser } from '@/utils/auth'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function getUploadFileUrl(taskId: number) {
  const { user, userName } = await getUser()

  if (!user?.email) {
    return null
  }

  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from('files')
    .createSignedUploadUrl(
      `task-${taskId.toString()}-${userName}-${Date.now()}.pdf`,
    )

  if (error || !data) {
    return null
  }

  return { data: data.signedUrl, path: data.path }
}

export async function insertUpload(taskId: number, filePath: string) {
  const { user } = await getUser()

  if (!user?.email) {
    return { error: 'User not found' }
  }

  const supabase = createClient()

  const { error: fileError } = await supabase.storage
    .from('files')
    .createSignedUrl(filePath, 3600)

  if (fileError) {
    return { error: fileError.message }
  }

  const { data, error } = await supabase
    .from('uploads')
    .insert({
      task_id: taskId,
      user_email: user.email,
      file_url: filePath,
    })
    .select()

  if (error) {
    return { error: error.message }
  }

  return { data }
}

export default async function uploadFile(formData: FormData, taskId: number) {
  const { user, userName } = await getUser()

  if (!user?.email) {
    return { error: 'User not found' }
  }

  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from('files')
    .upload(
      `task-${taskId.toString()}-${userName}-${Date.now()}.pdf`,
      formData.get('file') as File,
    )

  if (error) {
    return { error: error.message }
  }

  const { data: recordData, error: dbError } = await supabase
    .from('uploads')
    .insert({
      task_id: taskId,
      user_email: user?.email,
      file_url: data.path,
    })
    .select()

  if (dbError) {
    return { error: dbError.message }
  }

  const { data: fileUrl, error: urlError } = await supabase.storage
    .from('files')
    .createSignedUrl(recordData[0].file_url, 3600)

  if (urlError || !fileUrl) {
    return { error: urlError?.message }
  }

  return {
    data: { file_url: fileUrl.signedUrl, created_at: recordData[0].created_at },
  }
}
