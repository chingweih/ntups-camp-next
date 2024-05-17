import { TransactionTable } from './../../_components/TransactionTable'

import { Button } from '@/components/ui/button'
import { getUser } from '@/utils/auth'
import { RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getTransactions } from './bank-quries'
export default async function Bank() {
  const user = await getUser()

  if (!user?.email) {
    redirect('/login?next=/bank')
  }

  const transactions = await getTransactions(user)

  return (
    <>
      <div className='flex flex-row w-full items-center justify-between p-4'>
        <p className='font-medium'>轉帳記錄</p>
        <Button asChild className='flex flex-row gap-1'>
          <Link href='/bank/transfer'>
            <RefreshCcw size={18} />
            轉帳
          </Link>
        </Button>
      </div>
      <TransactionTable transactions={transactions} />
    </>
  )
}
