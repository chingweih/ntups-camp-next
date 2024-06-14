import Image from 'next/image'
import Navigation from '../_components/Navigation'
import title from '@/assets/title.png'
import UserHeader from '../_components/UserHeader'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col items-center justify-center w-full'>
      <div className='mx-auto w-full max-w-md'>
        <div className='flex flex-row items-center justify-center m-2 mt-1'>
          <Image src={title} alt='憲政熱映中' height={50} priority={true} />
        </div>
        <Navigation />
        <UserHeader />
      </div>
      <div className='w-full max-w-screen-lg mt-5'>{children}</div>
    </div>
  )
}
