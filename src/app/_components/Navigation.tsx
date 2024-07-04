import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FileText, HomeIcon, Landmark, Newspaper } from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  return (
    <div
      className='sticky top-0 z-50 mb-3 pb-5 pt-5'
      style={{ backgroundColor: '#fffefc' }}
    >
      <div className='flex h-5 items-center justify-between text-sm'>
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
            <Newspaper className='pr-2' /> 串文
          </Link>
        </Button>
        <Separator orientation='vertical' />
        <Button variant='ghost' asChild>
          <Link href='/upload'>
            <FileText className='pr-2' /> 上傳
          </Link>
        </Button>
      </div>
    </div>
  )
}
