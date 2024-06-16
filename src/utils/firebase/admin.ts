import { initializeApp } from 'firebase-admin/app'
import { credential } from 'firebase-admin'
import { getMessaging } from 'firebase-admin/messaging'

const firebaseAdmin = initializeApp({
  credential: credential.cert(
    JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!),
  ),
})

export const adminMessaging = getMessaging(firebaseAdmin)
