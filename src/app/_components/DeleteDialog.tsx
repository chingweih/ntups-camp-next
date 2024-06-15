'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash } from 'lucide-react'
import { useState } from 'react'
import Spinner from './LoadingSpinner'

export default function DeleteDialog({
  onClick,
  title,
}: {
  onClick: () => Promise<boolean>
  title: string
}) {
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' className='m-0 p-2 text-red-500'>
          <Trash size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確定要刪除此帳號嗎？</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant={loading ? 'ghost' : 'destructive'}
            onClick={async () => {
              setLoading(true)
              const result = await onClick()
              if (result) {
                setOpen(false)
              }
              setLoading(false)
            }}
          >
            {loading ? <Spinner /> : <Trash size={18} className='mr-2' />}
            刪除{loading ? '中...' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}