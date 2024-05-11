'use client'

import { useFormStatus } from 'react-dom'
import Spinner from './LoadingSpinner'
import { Button } from '@/components/ui/button'

export default function SubmitBtn({ name }: { name: string }) {
  const { pending } = useFormStatus()
  return (
    <div className='w-full'>
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
