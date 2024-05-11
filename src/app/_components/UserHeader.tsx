import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/utils/auth'
import Link from 'next/link'
import UserGreeting from './UserGreeting'

export default async function UserHeader() {
  const { user } = await useAuth()

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
          <UserGreeting user={user} />
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
