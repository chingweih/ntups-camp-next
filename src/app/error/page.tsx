import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ErrorPage() {
  return (
    <div className='h-80 flex flex-col items-center justify-center gap-10'>
      <AlertCircle size='48' className='text-red-400' />
      <h1 className='text-lg font-medium'>發生錯誤，請轉接相關單位</h1>
      <Button variant='link' asChild>
        <Link href='/'>回首頁</Link>
      </Button>
    </div>
  )
}
