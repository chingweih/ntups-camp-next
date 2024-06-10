import { createClient } from '@/utils/supabase/server'
import { type User } from '@supabase/supabase-js'

export type Transaction = {
  timestamp: string
  to_from: string
  amount: number
  notes?: string
}

export async function getUserBalance(user: User) {
  if (!user?.email) {
    return null
  }

  const supabase = createClient()

  const { data: userData, error: balanceError } = await supabase
    .from('users')
    .select('balance')
    .eq('email', user.email)
    .single()

  if (balanceError || !userData?.balance) {
    return null
  }

  return userData.balance
}

export async function getTransactions(
  user: User
): Promise<Transaction[] | null> {
  if (!user?.email) {
    return null
  }

  const supabase = createClient()

  var transactions: Transaction[] = []

  const { data: fromData, error: transactionError } = await supabase
    .from('transactions')
    .select('*')
    .eq('from_email', user.email)

  if (transactionError || !fromData) {
    return null
  } else {
    fromData.forEach((transaction) => {
      transactions.push({
        timestamp: transaction.created_at,
        to_from: transaction.to_email,
        amount: -transaction.amount,
        notes: transaction.notes!,
      })
    })
  }

  const { data: toData, error: transactionErrorTo } = await supabase
    .from('transactions')
    .select('*')
    .eq('to_email', user.email)
  if (transactionErrorTo || !toData) {
    return null
  } else {
    toData.forEach((transaction) => {
      transactions.push({
        timestamp: transaction.created_at,
        to_from: transaction.from_email,
        amount: transaction.amount,
        notes: transaction.notes!,
      })
    })
  }

  transactions.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  if (transactions.length === 0) {
    return null
  }

  return transactions
}
