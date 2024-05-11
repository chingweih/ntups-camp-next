import Image from 'next/image'
import calendar from '@/assets/cal.png'

export default function Home() {
  return (
    <main>
      <Image src={calendar} alt='行程表' className='rounded-lg' />
    </main>
  )
}
