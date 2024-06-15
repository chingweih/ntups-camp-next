'use client'

import { DataTable } from '@/app/_components/DataTable'
import DeleteDialog from '@/app/_components/DeleteDialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getDateString } from '@/lib/dt-options'
import { Tables } from '@/utils/database.types'
import { ColumnDef } from '@tanstack/react-table'
import Link from 'next/link'
import { toast } from 'sonner'
import { deletePost } from './actions'

const columns: ColumnDef<Tables<'posts'>>[] = [
  {
    accessorKey: 'created_at',
    header: '建立時間',
    cell: ({ row }) => {
      return getDateString(row.original.created_at)
    },
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
  },
]

export default function NewsTable({
  posts,
}: {
  posts: Tables<'posts'>[] | null
}) {
  if (!posts) return null
  return <DataTable data={posts} columns={columns} />
}
