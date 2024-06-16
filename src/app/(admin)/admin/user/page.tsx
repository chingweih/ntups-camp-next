import {
  adminGetUserBalance,
  checkUserAdmin,
  checkUserVerified,
  getUser,
  getUserDisplayName,
  getUserRealName,
  getUserRole,
  getUserTeamType,
} from '@/utils/auth'
import { supabaseAdmin } from '@/utils/supabase/admin'
import UserTable from './UserTable'

export default async function AdminUser() {
  const fullUsers = await adminGetFullUserList()

  if (!fullUsers || fullUsers.length === 0 || !fullUsers[0].email) {
    return <div>沒有使用者</div>
  }

  return <UserTable users={fullUsers} />
}

export async function adminGetFullUserList() {
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
      realName: await getUserRealName(user),
      teamType: await getUserTeamType(user),
      userRole: await getUserRole(user),
    }
  })

  return await Promise.all(userMap)
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
