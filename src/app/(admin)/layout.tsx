import Image from 'next/image'
import Navigation from '../_components/Navigation'
import title from '@/assets/title.png'
import UserHeader from '../_components/UserHeader'
import { Badge } from '@/components/ui/badge'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <div className='mx-auto w-full max-w-md'>
        <div className='m-2 mt-1 flex flex-col items-center justify-center gap-2'>
          <Image src={title} alt='憲政熱映中' height={50} priority={true} />
          <Badge>管理介面</Badge>
        </div>
        <Navigation />
        <UserHeader />
      </div>
      <div className='mt-5 w-full max-w-screen-lg'>{children}</div>
    </div>
  )
}
