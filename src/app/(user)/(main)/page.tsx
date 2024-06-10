import Image from 'next/image'
import headerImg from '@/assets/header.png'
import { BankDashboard } from '../../_components/BankDashboard'
import Link from 'next/link'
import { ArrowRight, FileText, Landmark, Newspaper } from 'lucide-react'
import { getUser } from '@/utils/auth'
import { PostList, getPosts } from './news/page'
import { TaskList, getTasks } from './upload/page'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const { user } = await getUser()

  return (
    <main>
      <Image
        src={headerImg}
        alt='2024 臺大政治營'
        className='rounded'
        priority={true}
      />
      <div className='mt-14 mb-5 flex flex-row items-center justify-between'>
        <h1 className='text-2xl font-bold flex flex-row items-center justify-between gap-3'>
          <Landmark size={24} />
          銀行帳戶
        </h1>
        <Button variant='link' asChild>
          <Link href='/bank'>
            {user ? '前往交易 ' : '登入查看 '}
            <ArrowRight className='inline' size={15} />
          </Link>
        </Button>
      </div>
      <BankDashboard />
      <Separator className='my-10' />
      <div className='mb-5 flex flex-row items-center justify-between'>
        <h1 className='text-2xl font-bold flex flex-row items-center justify-between gap-3'>
          <Newspaper size={24} />
          最新新聞
        </h1>
        <Button variant='link' asChild>
          <Link href='/news'>
            {'看更多 '}
            <ArrowRight className='inline' size={15} />
          </Link>
        </Button>
      </div>
      <PostList posts={await getPosts(1)} />
      <Separator className='my-10' />
      <div className='mb-8 flex flex-row items-center justify-between'>
        <h1 className='text-2xl font-bold flex flex-row items-center justify-between gap-3'>
          <FileText size={24} />
          近期上傳
        </h1>
        <Button variant='link' asChild>
          <Link href='/upload'>
            {user ? '前往上傳 ' : '登入查看 '}
            <ArrowRight className='inline' size={15} />
          </Link>
        </Button>
      </div>
      <TaskList tasks={await getTasks(1, false)} />
      {user ? null : <div className='h-32' />}
    </main>
  )
}
