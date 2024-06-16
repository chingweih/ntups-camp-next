'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { type User } from '@supabase/supabase-js'

export default function UserAvatar({
  user,
  userDisplayName,
}: {
  user: User | null
  userDisplayName?: string | null
}) {
  return (
    <Avatar>
      <AvatarImage src='#' alt={user?.email ? user.email.split('@')[0] : '?'} />
      <AvatarFallback>
        {(userDisplayName ? userDisplayName[0] : null) ||
          (user?.email ? user.email[0].toUpperCase() : '?')}
      </AvatarFallback>
    </Avatar>
  )
}
