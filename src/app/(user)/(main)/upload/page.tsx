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
import { colors } from '@/lib/custom-colors'
import { dtOptions, getDateString, locale } from '@/lib/dt-options'
import { cn } from '@/lib/utils'
import { getUser } from '@/utils/auth'
import { Tables } from '@/utils/database.types'
import { createClient } from '@/utils/supabase/server'
import { Metadata } from 'next'
import Link from 'next/link'

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
              <li>僅接受 10MB 以下的 PDF 檔案</li>
              <li>系統僅會採用最後一次上傳的版本</li>
              <li>上傳完成後，請自行下載檔案確認內容完整、版本正確</li>
              <li>截止時間後，將不再開放上傳功能</li>
              <li>
                文件模板請見手冊 QRCode 或此
                <Link
                  href='/redirect/templates'
                  className='underline'
                  target='_blank'
                  style={{ color: colors.primaryBlue }}
                >
                  連結
                </Link>
              </li>
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
        const dueDtString = getDateString(task.due_datetime)
        const passed = dueDt < Date.now()
        const uploadInfo = await getUploads(task.id)
        const fileUrl = uploadInfo?.fileUrl || null
        const createdAt = uploadInfo?.createdAt || null

        return (
          <Card key={task.id} className='w-full p-1'>
            <CardHeader className='grid grid-cols-3 items-center gap-3'>
              <div className='col-span-3'>
                <CardTitle>{task.name}</CardTitle>
                <CardDescription className='mt-1'>
                  {task.description}
                </CardDescription>
              </div>
              <p className={cn('text-bold col-span-2 text-sm')}>
                截止時間：
                <br />
                {dueDtString}
              </p>
              <UploadActions
                taskId={task.id}
                fileUrl={fileUrl}
                createdAt={createdAt}
                passed={passed}
              />
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}

export async function getTasks(
  limit?: number,
  ascending?: boolean,
  skipPassed?: boolean,
) {
  const supabase = createClient()

  const { teamType } = await getUser()

  const query = supabase
    .from('tasks')
    .select('*')
    .order('due_datetime', {
      ascending: ascending === undefined && ascending ? true : ascending,
    }) // default ascending to true
    .order('name', { ascending: false })
    .gt(
      'due_datetime',
      skipPassed === undefined || !skipPassed
        ? '1980-06-16T17:47:18+0000'
        : new Date().toISOString(),
    )
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
