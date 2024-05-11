'use client'

import { useFormStatus } from 'react-dom'
import Spinner from './LoadingSpinner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function SubmitBtn({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const { pending } = useFormStatus()
  return (
    <div className={cn('w-full', className)}>
      <Button
        className='w-full'
        type='submit'
        disabled={pending}
        variant={pending ? 'ghost' : 'default'}
      >
        {pending ? (
          <div className='flex items-center justify-center gap-3'>
            <Spinner /> 載入中⋯⋯
          </div>
        ) : (
          name
        )}
      </Button>
    </div>
  )
}
