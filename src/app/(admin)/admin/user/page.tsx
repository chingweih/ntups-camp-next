import {
  adminGetUserBalance,
  checkUserAdmin,
  checkUserVerified,
  getUser,
  getUserDisplayName,
} from '@/utils/auth'
import { supabaseAdmin } from '@/utils/supabase/admin'
import UserTable from './UserTable'

export default async function AdminUser() {
  const users = await getUserList()

  const { user: loginUser } = await getUser()

  const userMap = users.map(async (user) => {
    return {
      ...user,
      displayName: await getUserDisplayName(user),
      verified: await checkUserVerified(user),
      admin: await checkUserAdmin(user),
      isCurrent: loginUser?.id === user.id,
      balance: (await adminGetUserBalance(user)) || 0,
    }
  })

  const fullUsers = await Promise.all(userMap)

  if (!users || users.length === 0 || !users[0].email) {
    return <div>沒有使用者</div>
  }

  return <UserTable users={fullUsers} />
}

async function getUserList() {
  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 500,
  })

  if (error) {
    console.error(error)
    return []
  }

  if (!users) {
    return []
  }

  return users
}
