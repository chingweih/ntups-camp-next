import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotVerifiedPage() {
  return (
    <div className='flex h-80 flex-col items-center justify-center gap-10'>
      <AlertCircle size='48' className='text-red-400' />
      <h1 className='text-lg font-medium'>帳號尚未驗證，請洽營隊工作人員</h1>
      <Button variant='link' asChild>
        <Link href='/'>回首頁</Link>
      </Button>
    </div>
  )
}
