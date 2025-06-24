import Image from 'next/image'
import Navigation from '../_components/Navigation'
import title from '@/assets/title.png'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='mx-auto w-full max-w-md'>
      <div className='m-2 mt-1 flex flex-row items-center justify-center'>
        <Image src={title} alt='沙政風暴' height={50} priority={true} />
      </div>
      <Navigation />
      {children}
    </div>
  )
}
