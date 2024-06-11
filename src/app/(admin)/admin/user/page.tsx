import { supabaseAdmin } from '@/utils/supabase/admin'
import UserTable from './UserTable'

export default async function AdminUser() {
  const users = await getUserList()

  return <UserTable users={users} />
}

async function getUserList() {
  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 500,
  })
  return users
}
