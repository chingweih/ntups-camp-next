import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/utils/auth'
import Link from 'next/link'

export default async function UserHeader() {
  const { user } = await useAuth()

  const now = new Date()
  const hour = now.getHours()

  const greeting = (hour: number) => {
    if (hour < 12 && hour >= 6) {
      return '早安'
    } else if (hour < 18 && hour >= 12) {
      return '午安'
    } else {
      return '晚安'
    }
  }

  return (
    <>
      <div className='flex flex-row w-full gap-4 items-center justify-between sticky mb-6'>
        <div className='flex flex-row gap-4 items-center'>
          <Avatar>
            <AvatarImage
              src='#'
              alt={user?.email ? user.email.split('@')[0] : '?'}
            />
            <AvatarFallback>
              {user?.email ? user.email[0].toUpperCase() : '?'}
            </AvatarFallback>
          </Avatar>
          <h1>
            {user?.email
              ? `${greeting(hour)}，${user.email
                  .split('@')[0][0]
                  .toUpperCase()}${user.email.split('@')[0].slice(1)}`
              : '請登入'}
          </h1>
        </div>
        <Button variant='link' asChild>
          {user ? (
            <Link href='/logout'>登出</Link>
          ) : (
            <Link href='/login'>登入</Link>
          )}
        </Button>
      </div>
    </>
  )
}
