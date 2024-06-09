'use client'

import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from 'firebase/messaging'
import { initializeApp } from 'firebase/app'
import { SetStateAction, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { BellDot, BellOff } from 'lucide-react'
import { type User } from '@supabase/supabase-js'
import { addFcmToken } from './actions'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export function RequestNotificationPermission({
  iconSize = 18,
  user,
}: {
  iconSize?: number
  user: User | null
}) {
  const [permission, setPermission] = useState<boolean>(false)
  const [token, setToken] = useState<string | null>(null)
  const [fcmSupport, setFcmSupport] = useState<boolean>(true)

  async function requestPermission() {
    try {
      const permission = await Notification.requestPermission()
      setPermission(permission === 'granted')
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error)
    }
  }

  useEffect(() => {
    requestPermission()
  }, [])

  useEffect(() => {
    if (token) {
      addFcmToken(token)
    }
  }, [token, user, permission])

  return user && fcmSupport ? (
    <>
      <Button onClick={requestPermission} variant='ghost' className='p-2.5'>
        {permission ? (
          <BellDot size={iconSize} />
        ) : (
          <BellOff size={iconSize} className='text-red-500' />
        )}
      </Button>
      <FcmInit
        setToken={setToken}
        permission={permission}
        setFcmSupport={setFcmSupport}
      />
    </>
  ) : null
}

export function FcmInit({
  setToken,
  permission,
  setFcmSupport,
}: {
  setToken: React.Dispatch<SetStateAction<string | null>>
  setFcmSupport: React.Dispatch<SetStateAction<boolean>>
  permission: boolean
}) {
  useEffect(() => {
    async function checkSupport() {
      const firebaseSupported = await isSupported()
      if (!firebaseSupported) {
        console.log('[FCM] not supported')
        setFcmSupport(false)
        return
      }

      setFcmSupport(true)
      const messaging = getMessaging(app)
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      getToken(messaging, { vapidKey: vapidKey })
        .then((currentToken) => {
          if (currentToken) {
            console.log('currentToken: ', currentToken)
            setToken(currentToken)
          } else {
            console.log(
              'No registration token available. Request permission to generate one.'
            )
          }
        })
        .catch((err) => {
          console.log('An error occurred while retrieving token. ', err)
        })

      onMessage(messaging, (payload) => {
        if (payload.notification) {
          toast.info(
            `${payload.notification.title}｜${payload.notification.body}`
          )
        }
      })
    }

    checkSupport()
  }, [setToken, permission, setFcmSupport])

  return null
}
