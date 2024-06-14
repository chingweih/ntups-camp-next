import { supabaseAdmin } from '@/utils/supabase/admin'
import TransactionTable from './TransactionTable'

export default async function TransactionPage() {
  const transactions = await getAllTransactions()

  return <TransactionTable transactions={transactions} />
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

  return data
}
