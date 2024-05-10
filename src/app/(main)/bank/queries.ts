'use server'

import { createClient } from '@/utils/supabase/server'

export type Transaction = {
  from_email: string
  to_email: string
  amount: number
  notes?: string
}

export async function insertTransaction(transaction: Transaction) {
  const supabase = createClient()
  const { error } = await supabase.from('transactions').insert(transaction)
  return { error }
}
