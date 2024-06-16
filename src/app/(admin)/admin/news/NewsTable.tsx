'use client'

import DeleteDialog from '@/app/_components/DeleteDialog'
import SubmitBtn from '@/app/_components/SubmitBtn'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { getDateString } from '@/lib/dt-options'
import { Tables } from '@/utils/database.types'
import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DndTable, RowDragHandleCell } from './DndTable'
import { deletePost, newPost } from './actions'

const columns: ColumnDef<Tables<'posts'>>[] = [
  {
    id: 'drag-handle',
    header: '移動',
    cell: ({ row }) => <RowDragHandleCell rowId={row.id.toString()} />,
    size: 60,
  },
  {
    accessorKey: 'created_at',
    header: '建立時間',
    cell: ({ row }) => {
      return getDateString(row.original.created_at)
    },
    size: 150,
  },
  {
    accessorKey: 'tag',
    header: '標籤',
    cell: ({ row }) => {
      return (
        <Badge className='text-xs'>
          {row.original.tag || '新聞 (Default)'}
        </Badge>
      )
    },
    size: 60,
  },
  {
    id: 'title-des',
    header: '文章',
    cell: ({ row }) => {
      return (
        <div>
          <h2 className='text-lg font-bold'>{row.original.title}</h2>
          <p className='text-gray-500'>{row.original.description}</p>
        </div>
      )
    },
    size: 250,
  },
  {
    id: 'actions',
    header: '操作',
    cell: ({ row }) => {
      return (
        <div className='flex space-x-1'>
          <Button asChild variant='link'>
            <Link href={`/admin/news/edit/${row.original.id}`}>編輯</Link>
          </Button>
          <DeleteDialog
            title='確定要刪除此文章嗎？'
            onClick={() =>
              deletePost(row.original.id).then((error) => {
                if (error) {
                  toast.error('刪除失敗')
                  return false
                } else {
                  toast.success('成功刪除文章')
                  return true
                }
              })
            }
          />
        </div>
      )
    },
    size: 150,
  },
]

export default function NewsTable({
  posts,
}: {
  posts: Tables<'posts'>[] | null
}) {
  if (!posts) return null
  return (
    <>
      <div className='flex flex-row items-center justify-between p-3'>
        <h2 className='text-lg font-bold'>文章列表</h2>
        <NewPostDialog />
      </div>
      <DndTable data={posts} columns={columns} />
    </>
  )
}

function NewPostDialog() {
  const router = useRouter()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus size={18} className='mr-1' />
          新增文章
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增文章</DialogTitle>
        </DialogHeader>
        <form
          className='mt-10 grid grid-cols-6 items-center justify-between gap-8'
          action={(formData: FormData) =>
            newPost({
              tag: formData.get('tag') as string,
              title: formData.get('title') as string,
              description: formData.get('description') as string,
              contents: '',
            }).then(({ id, error }) => {
              if (error || !id) {
                toast.error('新增失敗')
              } else {
                toast.success(`成功新增文章，將跳轉至編輯頁面 (ID: ${id})`)
                router.push(`/admin/news/edit/${id}`)
              }
            })
          }
        >
          <Label className='col-span-2'>標籤</Label>
          <Input className='col-span-4' type='text' name='tag' />
          <Label className='col-span-2'>標題</Label>
          <Input className='col-span-4' type='text' name='title' />
          <Label className='col-span-2'>敘述</Label>
          <Textarea className='col-span-4' name='description' />
          <DialogFooter className='col-span-6'>
            <SubmitBtn className='w-40' name='送出後編輯' />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
