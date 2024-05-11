'use client'
import { type User } from '@supabase/supabase-js'

export default function UserGreeting({ user }: { user: User | null }) {
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
    <h1>
      {user?.email
        ? `${greeting(hour)}，${user.email
            .split('@')[0][0]
            .toUpperCase()}${user.email.split('@')[0].slice(1)}`
        : '請登入'}
    </h1>
  )
}
