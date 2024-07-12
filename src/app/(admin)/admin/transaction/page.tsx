import { supabaseAdmin } from '@/utils/supabase/admin'
import TransactionTable from './TransactionTable'
import { getUserDisplayNameByEmail } from '@/utils/auth'

export default async function TransactionPage() {
  const transactions = await getAllTransactions()

  return (
    <>
      <h2 className='text-lg font-bold'>交易紀錄</h2>
      <TransactionTable transactions={transactions} />
    </>
  )
}

async function getAllTransactions() {
  const { data, error } = await supabaseAdmin
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  if (!data) {
    return []
  }

  return await Promise.all(
    data.map(async (transaction) => ({
      ...transaction,
      from_email: `${await getUserDisplayNameByEmail(transaction.from_email)} (${transaction.from_email.split('@')[0]})`,
      to_email: `${await getUserDisplayNameByEmail(transaction.to_email)} (${transaction.to_email.split('@')[0]})`,
    })),
  )
}
