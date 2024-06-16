import { adminGetFullUserList } from '../user/page'
import SendNotificationForm from './SendNotificationForm'

export default async function NotificationPage() {
  const users = await adminGetFullUserList()

  return <SendNotificationForm users={users} />
}
