import { getApps, initializeApp } from 'firebase-admin/app'
import { credential } from 'firebase-admin'
import { getMessaging } from 'firebase-admin/messaging'

const alreadyCreatedApps = getApps()

const firebaseAdmin =
  alreadyCreatedApps.length === 0
    ? initializeApp(
        {
          credential: credential.cert(
            JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!),
          ),
        },
        `ntupscamp-firebase-admin-${Date.now()}`,
      )
    : alreadyCreatedApps[0]

export const adminMessaging = getMessaging(firebaseAdmin)
