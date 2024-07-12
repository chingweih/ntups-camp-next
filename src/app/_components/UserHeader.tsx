import { Button } from '@/components/ui/button'
import { getUser } from '@/utils/auth'
import { RequestNotificationPermission } from '@/utils/firebase/Notification'
import Link from 'next/link'
import UserGreeting from './UserGreeting'
import UserAvatar from './UserAvatar'
import { Badge } from '@/components/ui/badge'
import { QrCode } from 'lucide-react'

export default async function UserHeader() {
  const { user, displayName: userDisplayName, isAdmin } = await getUser()

  return (
    <>
      <div className='sticky mb-6 flex w-full flex-row items-center justify-between gap-4'>
        <div className='flex flex-row items-center gap-4'>
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
          {user ? (
            <>
              <Button variant='ghost' asChild className='p-2.5'>
                <Link href='/qrcode'>
                  <QrCode size={18} />
                </Link>
              </Button>
              <RequestNotificationPermission user={user} />
            </>
          ) : null}
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
