import { supabaseAdmin } from '@/utils/supabase/admin'
import TaskTable from './TaskTable'
import { adminGetUserByEmail, getUserDisplayName } from '@/utils/auth'
import { get } from 'http'

export default async function TaskPage() {
  const dbTasks = await getTasks()

  if (!dbTasks) return <div>Failed to load tasks</div>

  const tasks = await Promise.all(
    dbTasks.map(async (task) => {
      return {
        ...task,
        files: await getUploadFiles(task.id),
      }
    })
  )

  if (!tasks) return <div>Failed to load tasks</div>

  return <TaskTable tasks={tasks} />
}

async function getTasks() {
  const { data, error } = await supabaseAdmin.from('tasks').select('*')

  if (error) return null

  return data
}

export async function getUploadFiles(taskId: number) {
  const { data, error } = await supabaseAdmin
    .from('uploads')
    .select('*')
    .eq('task_id', taskId)

  if (error || data.length === 0) return null

  const groupByEmail = Object.groupBy(data, ({ user_email }) => user_email)
  const latestFiles = []

  Object.keys(groupByEmail).forEach(async (key) => {
    groupByEmail[key]?.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  })

  for (const key in groupByEmail) {
    const user = await adminGetUserByEmail(key)
    latestFiles.push({
      user,
      file: groupByEmail[key]![0],
    })
  }

  return latestFiles
}
