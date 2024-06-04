import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
              <Button>
                <UploadIcon />
                上傳
              </Button>
              <Label>Max 5MB</Label>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function UploadIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='size-6'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
      />
    </svg>
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
