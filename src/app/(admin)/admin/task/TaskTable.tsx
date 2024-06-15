'use client'

import DeleteDialog from '@/app/_components/DeleteDialog'
import SubmitBtn from '@/app/_components/SubmitBtn'
import UserAvatar from '@/app/_components/UserAvatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { getDateString, timePassed } from '@/lib/dt-options'
import { FullUser } from '@/utils/auth'
import { Tables } from '@/utils/database.types'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import {
  FileDown,
  FileText,
  PanelTopClose,
  PanelTopOpen,
  Pencil,
  Plus,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { deleteTask, newTask, updateTask } from './actions'
import { cn } from '@/lib/utils'

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
    <>
      <div className='flex flex-row items-center justify-between p-3'>
        <h2 className='text-lg font-bold'>上傳列表</h2>
        <NewTaskDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-4/12'>截止時間</TableHead>
            <TableHead className='w-5/12'>項目</TableHead>
            <TableHead className='w-2/12'>小隊</TableHead>
            <TableHead className='w-5/12'>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TaskRow task={task} key={task.id} />
          ))}
        </TableBody>
      </Table>
    </>
  )
}

function TaskRow({ task }: { task: TasksWithFiles }) {
  const [downloading, setDownloading] = useState<boolean>(false)
  const [collapsibleOpen, setCollapsibleOpen] = useState<boolean>(false)

  return (
    <Collapsible
      asChild
      open={collapsibleOpen}
      onOpenChange={setCollapsibleOpen}
    >
      <>
        <TableRow>
          <TableCell
            className={cn(
              'h-full flex-col items-start justify-center gap-2',
              timePassed(task.due_datetime) ? 'flex' : '',
            )}
          >
            <p>{getDateString(task.due_datetime)}</p>
            {timePassed(task.due_datetime) ? (
              <Badge className='block w-fit' variant='destructive'>
                已截止
              </Badge>
            ) : null}
          </TableCell>
          <TableCell>{task.name}</TableCell>
          <TableCell>
            <Badge>{task.for_team || '所有'}</Badge>
          </TableCell>
          <TableCell>
            <div className='flex flex-row'>
              <EditTaskDialog task={task} />
              <CollapsibleTrigger asChild>
                <Button variant='link'>
                  {collapsibleOpen ? (
                    <PanelTopClose size={18} className='mr-1' />
                  ) : (
                    <PanelTopOpen size={18} className='mr-1' />
                  )}
                  查看檔案
                </Button>
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
                      `/admin/task/download/${file.file.file_url}`,
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
                <FileDown size={18} className='mr-1' />
                下載全部
              </Button>
              <DeleteDialog
                title='確定要刪除這個上傳項目嗎？'
                onClick={() =>
                  deleteTask(task.id).then((result) => {
                    if (result) {
                      toast.success('已刪除')
                    } else {
                      toast.error('刪除失敗')
                    }
                    return result
                  })
                }
              />
            </div>
          </TableCell>
        </TableRow>
        <CollapsibleContent asChild>
          <>
            {task.files ? (
              task.files.map((file) => (
                <TableRow key={file.file.file_url}>
                  <TableCell colSpan={4}>
                    <div className='flex flex-row items-center justify-around gap-3'>
                      <div className='flex w-3/12 flex-row items-center justify-start gap-3'>
                        <FileText size={18} />
                        <UserAvatar
                          user={file.user}
                          userDisplayName={file.user?.displayName || ''}
                        />
                        <div className='flex flex-col items-start justify-center'>
                          <p>{file.user?.displayName}</p>
                          <p className='text-xs text-slate-500'>
                            {file.user?.email?.split('@')[0]}
                          </p>
                        </div>
                      </div>
                      <p className='w-4/12 text-left'>
                        最後上傳時間：
                        {getDateString(file.file.created_at)}
                      </p>
                      <Button variant='link' className='w-1/6'>
                        <Link
                          href={`/admin/task/download/${file.file.file_url}`}
                          target='_blank'
                        >
                          下載
                        </Link>
                      </Button>
                    </div>
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

function EditTaskDialog({ task }: { task: TasksWithFiles }) {
  const [date, setDate] = useState<Date | undefined>(
    new Date(task.due_datetime),
  )
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant='link'>
          <Pencil size={18} className='mr-1' />
          編輯
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>編輯上傳項目</DialogTitle>
        </DialogHeader>
        <TaskForm
          task={task}
          date={date}
          setDate={setDate}
          action={(formData: FormData) =>
            updateTask(task.id, {
              name: formData.get('name') as string,
              description: formData.get('description') as string,
              for_team: formData.get('for-team') as string,
              due_datetime: date?.toISOString(),
            }).then((res) => {
              if (res) {
                toast.success('已更新')
                setDialogOpen(false)
              } else {
                toast.error('更新失敗')
              }
            })
          }
        />
      </DialogContent>
    </Dialog>
  )
}

function NewTaskDialog() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>
          <Plus size={18} className='mr-1' />
          新增
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增上傳項目</DialogTitle>
        </DialogHeader>
        <TaskForm
          date={date}
          setDate={setDate}
          action={(formData: FormData) =>
            newTask({
              name: formData.get('name') as string,
              description: formData.get('description') as string,
              for_team: formData.get('for-team') as string,
              due_datetime: date?.toISOString() || new Date().toISOString(),
            }).then((res) => {
              if (res) {
                toast.success('已新增')
                setDialogOpen(false)
              } else {
                toast.error('新增失敗')
              }
            })
          }
        />
      </DialogContent>
    </Dialog>
  )
}

function TaskForm({
  task,
  action,
  date,
  setDate,
}: {
  task?: TasksWithFiles
  action: (formData: FormData) => Promise<void>
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}) {
  return (
    <form
      action={action}
      className='mt-10 grid grid-cols-6 items-center justify-between gap-8'
    >
      <Label className='col-span-2'>名稱</Label>
      <Input
        type='text'
        name='name'
        defaultValue={task?.name || ''}
        className='col-span-4'
        required
      />
      <Label className='col-span-2'>敘述</Label>
      <Textarea
        className='col-span-4'
        name='description'
        defaultValue={task?.description || ''}
      />
      <Label className='col-span-2'>小隊</Label>
      <Select name='for-team' defaultValue={task?.for_team || undefined}>
        <SelectTrigger className='col-span-4'>
          <SelectValue placeholder='請選擇' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='政黨'>政黨</SelectItem>
          <SelectItem value='利團'>利團</SelectItem>
        </SelectContent>
      </Select>
      <Label className='col-span-2'>截止時間</Label>
      <DateTimePicker date={date} setDate={setDate} className='col-span-4' />
      <DialogFooter className='col-span-6'>
        <SubmitBtn name='儲存' className='w-40' />
      </DialogFooter>
    </form>
  )
}
