'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { dtOptions, getDateString, locale } from '@/lib/dt-options'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { CheckCheck, Download } from 'lucide-react'
import Link from 'next/link'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { toast } from 'sonner'
import uploadFile from '../(user)/(main)/upload/action'
import SubmitBtn from './SubmitBtn'
import { colors } from '@/lib/custom-colors'

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
      <CardContent className='col-span-1 flex flex-col items-end justify-center gap-1 p-0 pb-0'>
        {passed ? (
          <Badge variant='destructive'>已截止</Badge>
        ) : (
          <UploadButton
            taskId={taskId}
            hasFile={Boolean(fileUrlState)}
            setFileUrlState={setFileUrlState}
            setCreatedAtState={setCreatedAtState}
          />
        )}
      </CardContent>
      {fileUrlState && createdAtState ? (
        <motion.div
          initial={{ y: 7.5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: 'easeInOut', duration: 0.5 }}
          className='col-span-3'
        >
          <CardContent
            className='col-span-3 m-0 mt-1 flex flex-row items-center justify-between rounded p-0'
            style={{ backgroundColor: colors.primaryBlue }}
          >
            <motion.p
              initial={{ y: 7.5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ease: 'easeInOut', duration: 0.5 }}
              className='flex flex-row items-center gap-2 p-0 pl-3 text-xs text-white'
              key={createdAtState}
            >
              <CheckCheck size={20} color='white' className='pr-1' />
              {getDateString(createdAtState)}
              {' 已上傳'}
            </motion.p>
            <Button asChild variant='link' className='text-xs'>
              <Link
                href={fileUrlState}
                className='pr-4 text-white'
                target='_blank noopener noreferrer'
              >
                <Download size={20} color='white' className='pr-1' />
                下載
              </Link>
            </Button>
          </CardContent>
        </motion.div>
      ) : null}
    </>
  )
}

function UploadButton({
  taskId,
  hasFile,
  setFileUrlState,
  setCreatedAtState,
}: {
  taskId: number
  hasFile: boolean
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
          toast.success('上傳成功！')
          setFileUrlState(data.file_url)
          setCreatedAtState(data.created_at)
        }
        formRef.current?.reset()
      }}
    >
      <SubmitBtn
        name={
          <>
            <UploadIcon className='pr-1' /> {hasFile ? '重新' : ''}上傳
          </>
        }
        onClick={() => inputRef.current?.click()}
        submit={false}
        loadingText='上傳中⋯'
        variant={hasFile ? 'outline' : 'default'}
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
