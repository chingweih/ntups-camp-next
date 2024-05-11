import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FileText, HomeIcon, Landmark, Newspaper } from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  return (
    <div className='flex h-5 items-center justify-between text-sm mb-10 sticky'>
      <Button variant='ghost' asChild>
        <Link href='/'>
          <HomeIcon className='pr-2' /> 首頁
        </Link>
      </Button>
      <Separator orientation='vertical' />
      <Button variant='ghost' asChild>
        <Link href='/bank'>
          <Landmark className='pr-2' /> 銀行
        </Link>
      </Button>
      <Separator orientation='vertical' />
      <Button variant='ghost' asChild>
        <Link href='/news'>
          <Newspaper className='pr-2' /> 新聞
        </Link>
      </Button>
      <Separator orientation='vertical' />
      <Button variant='ghost' asChild>
        <Link href='/upload'>
          <FileText className='pr-2' /> 上傳
        </Link>
      </Button>
    </div>
  )
}
