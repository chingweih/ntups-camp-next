import { Button } from '@/components/ui/button'
import { getUser } from '@/utils/auth'
import { RequestNotificationPermission } from '@/utils/firebase/Notification'
import Link from 'next/link'
import UserGreeting from './UserGreeting'
import UserAvatar from './UserAvatar'
import { Badge } from '@/components/ui/badge'

export default async function UserHeader() {
  const { user, displayName: userDisplayName, isAdmin } = await getUser()

  return (
    <>
      <div className='flex flex-row w-full gap-4 items-center justify-between sticky mb-6'>
        <div className='flex flex-row gap-4 items-center'>
          <UserAvatar user={user} userDisplayName={userDisplayName} />
          <UserGreeting user={user} displayName={userDisplayName} />
          {isAdmin ? (
            <Link href='/admin'>
              <Badge variant='outline' className='mr-2'>
                Admin
              </Badge>
            </Link>
          ) : null}
        </div>
        <div className='flex flex-row items-center justify-end'>
          <RequestNotificationPermission user={user} />
          <Button variant='link' asChild>
            {user ? (
              <Link href='/logout'>登出</Link>
            ) : (
              <Link href='/login'>登入</Link>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}
