import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getUser } from '@/utils/auth'
import Link from 'next/link'
import UserGreeting from './UserGreeting'

export default async function UserHeader() {
  const { user, displayName: userDisplayName } = await getUser()

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
              {(userDisplayName ? userDisplayName[0] : null) ||
                (user?.email ? user.email[0].toUpperCase() : '?')}
            </AvatarFallback>
          </Avatar>
          <UserGreeting user={user} displayName={userDisplayName} />
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
