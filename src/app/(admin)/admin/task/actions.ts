'use server'
import 'server-only'

import { supabaseAdmin } from '@/utils/supabase/admin'
import { TablesInsert, TablesUpdate } from '@/utils/database.types'
import { revalidatePath } from 'next/cache'

export async function updateTask(id: number, data: TablesUpdate<'tasks'>) {
  const { error } = await supabaseAdmin.from('tasks').update(data).match({ id })

  if (error) {
    console.error('error', error)
    return false
  }

  revalidatePath('/admin/task')

  return true
}

export async function deleteTask(id: number) {
  const { error } = await supabaseAdmin.from('tasks').delete().match({ id })

  if (error) {
    console.error('error', error)
    return false
  }

  revalidatePath('/admin/task')

  return true
}

export async function newTask(data: TablesInsert<'tasks'>) {
  const { error } = await supabaseAdmin.from('tasks').insert(data)

  if (error) {
    console.error('error', error)
    return false
  }

  revalidatePath('/admin/task')

  return true
}

export async function deleteUserUploads(userEmail: string, taskId: number) {
  if (userEmail === '') {
    return false
  }

  const { error } = await supabaseAdmin
    .from('uploads')
    .delete()
    .match({ user_email: userEmail, task_id: taskId })

  if (error) {
    console.error('error', error)
    return false
  }

  revalidatePath('/admin/task')
  return true
}
