'use client'

import UserAvatar from '@/app/_components/UserAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getDateString } from '@/lib/dt-options'
import { FullUser } from '@/utils/auth'
import { Tables } from '@/utils/database.types'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'

export type TasksWithFiles = Tables<'tasks'> & {
  files:
    | {
        user: FullUser | null
        file: Tables<'uploads'>
      }[]
    | null
}

export default function TaskTable({ tasks }: { tasks: TasksWithFiles[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className='w-3/12'>截止時間</TableHead>
          <TableHead className='w-3/12'>項目</TableHead>
          <TableHead className='w-2/12'>小隊</TableHead>
          <TableHead className='w-4/12'>操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TaskRow task={task} key={task.id} />
        ))}
      </TableBody>
    </Table>
  )
}

function TaskRow({ task, key }: { task: TasksWithFiles; key?: number }) {
  const [downloading, setDownloading] = useState(false)

  return (
    <Collapsible key={key!} asChild>
      <>
        <TableRow>
          <TableCell>{getDateString(task.due_datetime)}</TableCell>
          <TableCell>{task.name}</TableCell>
          <TableCell>
            <Badge>{task.for_team || '所有'}</Badge>
          </TableCell>
          <TableCell>
            <div className='flex flex-row'>
              <CollapsibleTrigger asChild>
                <Button variant='link'>查看檔案</Button>
              </CollapsibleTrigger>
              <Button
                variant='link'
                disabled={downloading}
                onClick={async () => {
                  setDownloading(true)
                  toast.loading(`正在下載｜${task.name}`, {
                    id: `downloading-${task.id}`,
                    duration: Infinity,
                  })
                  let zip = new JSZip()

                  const files = task.files?.map(async (file) => {
                    const downloadFile = await fetch(
                      `/admin/task/download/${file.file.file_url}`
                    )

                    const blob = await downloadFile.blob()
                    return {
                      blob,
                      fileName: `${task.name}-${
                        file.user?.displayName ||
                        file.user?.email?.split('@')[0]
                      }.pdf`,
                    }
                  })

                  if (!files) {
                    toast.dismiss(`downloading-${task.id}`)
                    toast.error('檔案下載失敗或是沒有檔案')
                    setDownloading(false)
                    return
                  }

                  const blobs = await Promise.all(files)

                  blobs.forEach((blob) => {
                    zip.file(blob.fileName, blob.blob)
                  })

                  zip.generateAsync({ type: 'blob' }).then((content) => {
                    saveAs(content, `【政治營檔案】${task.name}.zip`)
                    setDownloading(false)
                    toast.dismiss(`downloading-${task.id}`)
                    toast.success(`下載完成｜${task.name}`)
                  })
                }}
              >
                下載全部
              </Button>
            </div>
          </TableCell>
        </TableRow>
        <CollapsibleContent asChild>
          <>
            {task.files ? (
              task.files.map((file) => (
                <TableRow key={file.file.file_url}>
                  <TableCell>
                    <div className='flex flex-row items-center justify-start gap-3'>
                      <UserAvatar
                        user={file.user}
                        userDisplayName={file.user?.displayName || ''}
                      />
                      <div className='flex flex-col items-start justify-center'>
                        <p>{file.user?.displayName}</p>
                        <p className='text-slate-500 text-xs'>
                          {file.user?.email?.split('@')[0]}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell colSpan={2}>
                    最後上傳時間：
                    {getDateString(file.file.created_at)}
                  </TableCell>
                  <TableCell>
                    <Button variant='link'>
                      <Link
                        href={`/admin/task/download/${file.file.file_url}`}
                        target='_blank'
                      >
                        下載
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>尚未有檔案</TableCell>
              </TableRow>
            )}
          </>
        </CollapsibleContent>
      </>
    </Collapsible>
  )
}
