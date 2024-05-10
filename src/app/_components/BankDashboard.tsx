import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Activity, DollarSign } from 'lucide-react'
import { currencyFormatter, currencyFormatterWithSign } from '@/lib/formatters'
import { createClient } from '@/utils/supabase/server'
import { useAuth } from '@/utils/auth'
import { getTransactions, getUserBalance } from '../(main)/bank/bank-data'

export async function BankDashboard() {
  const { user } = await useAuth()

  if (!user?.email) {
    return null
  }

  const balance = await getUserBalance(user)

  if (!balance) {
    return null
  }

  const transactions = await getTransactions(user)

  if (!transactions) {
    return null
  }

  return (
    <div className='flex flex-row w-full gap-4 mb-5'>
      <Card className='grow'>
        <CardHeader>
          <CardDescription className='flex flex-row items-center justify-between'>
            帳號餘額
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardDescription>
          <CardTitle>{currencyFormatter.format(balance)}</CardTitle>
        </CardHeader>
      </Card>
      <Card className='grow'>
        <CardHeader>
          <CardDescription className='flex flex-row items-center justify-between'>
            最近交易
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardDescription>
          <CardTitle
            className={
              transactions[0].amount > 0 ? 'text-red-500' : 'text-green-500'
            }
          >
            {currencyFormatterWithSign.format(transactions[0].amount)}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
