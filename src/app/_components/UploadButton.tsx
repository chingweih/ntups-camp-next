'use client'

import { Input } from '@/components/ui/input'
import { useRef } from 'react'
import uploadFile from '../(main)/upload/action'
import SubmitBtn from './SubmitBtn'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function UploadButton({ taskId }: { taskId: number }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        const { error } = await uploadFile(formData, taskId)
        if (error) {
          toast.error(error)
        }
      }}
    >
      <SubmitBtn
        name={
          <>
            <UploadIcon className='pr-1' /> 上傳
          </>
        }
        onClick={() => inputRef.current?.click()}
        submit={false}
        loadingText='上傳中⋯'
      />
      <Input
        type='file'
        name='file'
        accept='.pdf'
        onChange={() => formRef.current?.requestSubmit()}
        style={{ display: 'none' }}
        ref={inputRef}
      />
    </form>
  )
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className={cn('size-6', className)}
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'
      />
    </svg>
  )
}
