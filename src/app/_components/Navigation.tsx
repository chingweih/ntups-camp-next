import { Button } from '@/components/ui/button'
import { FileText, HomeIcon, Landmark, Newspaper } from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  return (
    <div className='flex items-center justify-between gap-5 mb-7'>
      <Button variant='secondary' asChild>
        <Link href='/'>
          <HomeIcon className='pr-2' /> 首頁
        </Link>
      </Button>
      <Button variant='secondary' asChild>
        <Link href='/bank'>
          <Landmark className='pr-2' /> 銀行
        </Link>
      </Button>
      <Button variant='secondary' asChild>
        <Link href='/news'>
          <Newspaper className='pr-2' /> 新聞
        </Link>
      </Button>
      <Button variant='secondary' asChild>
        <Link href='/upload'>
          <FileText className='pr-2' /> 上傳
        </Link>
      </Button>
    </div>
  )
}
