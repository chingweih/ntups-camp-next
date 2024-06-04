'use client'

import { useFormStatus } from 'react-dom'
import Spinner from './LoadingSpinner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function SubmitBtn({
  name,
  className,
  submit = true,
  onClick,
  loadingText,
}: {
  name: string | React.ReactNode
  className?: string
  submit?: boolean
  onClick?: () => void
  loadingText?: string
}) {
  const { pending } = useFormStatus()
  return (
    <div className={cn('w-full', className)}>
      <Button
        className='w-full'
        type={submit ? 'submit' : 'button'}
        disabled={pending}
        variant={pending ? 'ghost' : 'default'}
        onClick={onClick || (() => {})}
      >
        {pending ? (
          <div className='flex items-center justify-center gap-3'>
            <Spinner /> {loadingText || '載入中⋯'}
          </div>
        ) : (
          name
        )}
      </Button>
    </div>
  )
}
