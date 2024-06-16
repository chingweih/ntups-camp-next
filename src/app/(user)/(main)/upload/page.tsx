import UploadActions from '@/app/_components/UploadButton'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { dtOptions, locale } from '@/lib/dt-options'
import { cn } from '@/lib/utils'
import { getUser } from '@/utils/auth'
import { Tables } from '@/utils/database.types'
import { createClient } from '@/utils/supabase/server'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '上傳',
}

type Tasks = Tables<'tasks'>[]

export default async function UploadPage() {
  const { user } = await getUser()

  if (!user?.email) {
    return null
  }

  const tasks = await getTasks()

  return (
    <>
      <TaskList tasks={tasks} />
      <Accordion type='single' collapsible className='p-5'>
        <AccordionItem value='faq'>
          <AccordionTrigger>上傳注意事項</AccordionTrigger>
          <AccordionContent>
            <ul className='list-disc pl-5'>
              <li>僅接受 5MB 以下的 PDF 檔案</li>
              <li>系統僅會採用最後一次上傳的版本</li>
              <li>上傳完成後，請自行下載檔案確認內容完整、版本正確</li>
              <li>截止時間後，將不再開放上傳功能</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export async function TaskList({ tasks }: { tasks: Tasks | null }) {
  if (!tasks) {
    return null
  }

  return (
    <div className='flex flex-col gap-5'>
      {tasks.map(async (task) => {
        const dueDt = Date.parse(task.due_datetime)
        const dueDtString = new Date(dueDt).toLocaleTimeString(
          locale,
          dtOptions,
        )
        const passed = dueDt < Date.now()
        const uploadInfo = await getUploads(task.id)
        const fileUrl = uploadInfo?.fileUrl || null
        const createdAt = uploadInfo?.createdAt || null

        return (
          <Card key={task.id} className='grid grid-cols-2 p-3'>
            <CardHeader className='pb-3 pr-0 pt-3'>
              <CardTitle>{task.name}</CardTitle>
              <CardDescription>{task.description}</CardDescription>
              <p className={cn('text-bold text-sm')}>
                截止時間：
                <br />
                {dueDtString}
              </p>
            </CardHeader>
            <UploadActions
              taskId={task.id}
              fileUrl={fileUrl}
              createdAt={createdAt}
              passed={passed}
            />
          </Card>
        )
      })}
    </div>
  )
}

export async function getTasks(limit?: number, ascending?: boolean) {
  const supabase = createClient()

  const { teamType } = await getUser()

  const query = supabase
    .from('tasks')
    .select('*')
    .order('due_datetime', {
      ascending: ascending === undefined ? true : ascending,
    }) // default ascending to true
    .limit(limit || 100) // default limit to 100

  let { data: tasks, error } = teamType
    ? await query.eq('for_team', teamType)
    : await query

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
    .select('*')
    .eq('task_id', taskId)
    .eq('user_email', user.email)
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

  return { fileUrl: fileUrl.signedUrl, createdAt: uploads[0].created_at }
}
