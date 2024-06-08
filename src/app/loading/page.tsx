import Link from 'next/link'
import PageLoading from '../_components/PageLoading'
import { Button } from '@/components/ui/button'

export default function AdmireLoadingAnimation() {
  return (
    <div className='flex flex-col items-center justify-center gap-5'>
      <PageLoading />
      <Button variant='link' asChild>
        <Link href='/'>回首頁</Link>
      </Button>
    </div>
  )
}
