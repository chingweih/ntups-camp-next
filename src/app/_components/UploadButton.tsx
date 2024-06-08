'use client'

import { Input } from '@/components/ui/input'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import uploadFile from '../(main)/upload/action'
import SubmitBtn from './SubmitBtn'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { CardContent } from '@/components/ui/card'
import { CheckCheck, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dtOptions, locale } from '@/lib/dt-options'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function UploadActions({
  taskId,
  fileUrl,
  createdAt,
  passed,
}: {
  taskId: number
  fileUrl: string | null
  createdAt: string | null
  passed: boolean
}) {
  const [fileUrlState, setFileUrlState] = useState(fileUrl)
  const [createdAtState, setCreatedAtState] = useState(createdAt)

  return (
    <>
      <CardContent className='pb-0 flex flex-col items-center justify-center gap-1'>
        {passed ? (
          <Badge variant='destructive'>已截止</Badge>
        ) : (
          <UploadButton
            taskId={taskId}
            setFileUrlState={setFileUrlState}
            setCreatedAtState={setCreatedAtState}
          />
        )}
      </CardContent>
      {fileUrlState && createdAtState ? (
        <CardContent
          className='col-span-2 flex flex-row items-center justify-between p-0 m-3 rounded'
          style={{ backgroundColor: '#528ECA' }}
        >
          <p className='text-xs text-white p-0 pl-3 flex flex-row gap-2 items-center'>
            <CheckCheck size={20} color='white' className='pr-1' />
            {new Date(createdAtState).toLocaleTimeString(locale, dtOptions)}
            {' 已上傳'}
          </p>
          <Button asChild variant='link' className='text-xs'>
            <Link href={fileUrlState} className='text-white pr-4'>
              <Download size={20} color='white' className='pr-1' />
              下載
            </Link>
          </Button>
        </CardContent>
      ) : null}
    </>
  )
}

function UploadButton({
  taskId,
  setFileUrlState,
  setCreatedAtState,
}: {
  taskId: number
  setFileUrlState: Dispatch<SetStateAction<string | null>>
  setCreatedAtState: Dispatch<SetStateAction<string | null>>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData: FormData) => {
        const { data, error } = await uploadFile(formData, taskId)
        if (error) {
          toast.error(error)
        }
        if (data) {
          setFileUrlState(data.file_url)
          setCreatedAtState(data.created_at)
          formRef.current?.reset()
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
