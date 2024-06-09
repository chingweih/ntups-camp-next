'use server'
import 'server-only'

import { getUser } from '../auth'
import { createClient } from '../supabase/server'
import { headers } from 'next/headers'
import { userAgent } from 'next/server'

export async function addFcmToken(token: string) {
  const { user } = await getUser()

  if (!user || !token || !user.email) {
    return
  }

  const supabase = createClient()

  const { data: existingTokens, error: fetchError } = await supabase
    .from('fcm_tokens')
    .select('fcm_token')
    .eq('user_id', user.id)

  if (fetchError) {
    console.error('An error occurred while fetching tokens. ', fetchError)
    return
  }

  if (existingTokens.length > 0) {
    const existingToken = existingTokens.find((t) => t.fcm_token === token)
    if (existingToken) {
      console.log('Token already exists.')
      return
    }
  }

  const userAgents = userAgent({ headers: headers() })

  const { error } = await supabase.from('fcm_tokens').insert({
    user_id: user.id,
    user_email: user.email,
    fcm_token: token,
    user_agent: `Engine:${userAgents.engine.name} ${userAgents.engine.version}|Device:${userAgents.device.model} ${userAgents.device.type} ${userAgents.device.vendor}|OS:${userAgents.os.name} ${userAgents.os.version}|Browser:${userAgents.browser.name} ${userAgents.browser.version}`,
  })

  if (error) {
    console.error('An error occurred while inserting token. ', error)
    return
  }
}
