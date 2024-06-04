import UploadButton from '@/app/_components/UploadButton'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getUser } from '@/utils/auth'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function UploadPage() {
  const { user } = await getUser()

  if (!user?.email) {
    redirect(`/login?next=${encodeURI('/upload')}`)
  }

  return <TaskList />
}

const dtOptions = {
  month: '2-digit' as const,
  day: '2-digit' as const,
  hour: '2-digit' as const,
  minute: '2-digit' as const,
  timeZone: 'Asia/Taipei',
}

const locale = 'en-US'

async function TaskList() {
  const tasks = await getTasks()

  if (!tasks) {
    return null
  }

  return (
    <div className='flex flex-col gap-5'>
      {tasks.map((task) => {
        const dueDt = Date.parse(task.due_datetime)
        const dueDtString = new Date(dueDt).toLocaleTimeString(
          locale,
          dtOptions
        )

        return (
          <Card
            key={task.id}
            className='flex flex-row items-center justify-between'
          >
            <CardHeader>
              <CardTitle>{task.name}</CardTitle>
              <CardDescription>{task.description}</CardDescription>
              <Label>截止日期：{dueDtString}</Label>
            </CardHeader>
            <CardContent className='pb-0 flex flex-col items-center justify-center gap-1'>
              <UploadButton />
              <Label>Max 5MB</Label>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

async function getTasks() {
  const supabase = createClient()

  const { data: tasks, error } = await supabase.from('tasks').select('*')

  if (error || !tasks) {
    return null
  }

  return tasks
}
