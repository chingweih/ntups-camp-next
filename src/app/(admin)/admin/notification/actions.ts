'use server'
import 'server-only'

import { adminMessaging } from '@/utils/firebase/admin'
import { supabaseAdmin } from '@/utils/supabase/admin'

export async function getUserFcmTokens(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('fcm_tokens')
    .select('fcm_token')
    .eq('user_id', userId)

  if (error) {
    throw error
  }

  return data.map((token) => token.fcm_token)
}

export async function sendMessageToUsers(
  userIds: string[],
  message: {
    title: string
    body: string
  },
) {
  const fcmTokens = await Promise.all(userIds.map(getUserFcmTokens))

  const tokens = fcmTokens.flat()

  if (tokens.length === 0) {
    return
  }

  const response = await adminMessaging.sendEach(
    tokens.map((token) => ({
      notification: {
        title: message.title,
        body: message.body,
      },
      token,
    })),
  )

  return {
    all: response.successCount === tokens.length,
    successCount: response.successCount,
  }
}
