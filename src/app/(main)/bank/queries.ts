'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export type Transaction = {
  from_email: string
  to_email: string
  amount: number
  notes?: string
}

export async function insertTransaction({
  from_email,
  to_email,
  amount,
  notes,
}: Transaction) {
  const supabase = createClient()
  const { error } = await supabase.from('transactions').insert({
    from_email: from_email,
    to_email: `${to_email}@${process.env.ACCOUNT_DOMAIN}`,
    amount: amount,
    notes: notes,
  })

  if (!error) {
    revalidatePath('/bank')
  }

  return { error }
}
