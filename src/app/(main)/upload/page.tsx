import UploadButton from '@/app/_components/UploadButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { getUser } from '@/utils/auth'
import { createClient } from '@/utils/supabase/server'
import { Download } from 'lucide-react'
import Link from 'next/link'
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
      {tasks.map(async (task) => {
        const dueDt = Date.parse(task.due_datetime)
        const dueDtString = new Date(dueDt).toLocaleTimeString(
          locale,
          dtOptions
        )
        const passed = dueDt < Date.now()
        const fileUrl = await getUploads(task.id)

        return (
          <Card
            key={task.id}
            className='flex flex-row items-center justify-between'
          >
            <CardHeader>
              <CardTitle>{task.name}</CardTitle>
              <CardDescription>{task.description}</CardDescription>
              <p className={cn('text-sm text-bold')}>
                截止時間：
                <br />
                {dueDtString}
              </p>
            </CardHeader>
            <CardContent className='pb-0 flex flex-col items-center justify-center gap-1 w-1/2'>
              {fileUrl ? (
                <>
                  <p className='text-xs text-slate-400'>已上傳</p>
                  <Button asChild variant='link'>
                    <Link href={fileUrl}>
                      <Download size={20} className='pr-1' />
                      下載
                    </Link>
                  </Button>
                </>
              ) : null}
              {passed ? (
                <Badge variant='destructive'>已截止</Badge>
              ) : (
                <UploadButton taskId={task.id} />
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

async function getTasks() {
  const supabase = createClient()

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_datetime', { ascending: true })

  if (error || !tasks) {
    return null
  }

  return tasks
}

async function getUploads(taskId: number) {
  const { user } = await getUser()

  if (!user?.email) {
    return null
  }

  const supabase = createClient()

  const { data: uploads, error } = await supabase
    .from('uploads')
    .select('file_url')
    .eq('task_id', taskId)
    .eq('user', user.email)
    .order('id', { ascending: false })
    .limit(1)

  if (error || !uploads || uploads.length === 0) {
    return null
  }

  const { data: fileUrl, error: urlError } = await supabase.storage
    .from('files')
    .createSignedUrl(uploads[0].file_url, 3600)

  if (urlError || !fileUrl) {
    return null
  }

  return fileUrl.signedUrl
}
