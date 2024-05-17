import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Activity, DollarSign } from 'lucide-react'
import { currencyFormatter, currencyFormatterWithSign } from '@/lib/formatters'
import { getUser } from '@/utils/auth'
import { getTransactions, getUserBalance } from '../(main)/bank/bank-quries'

export async function BankDashboard() {
  const user = await getUser()

  if (!user?.email) {
    return null
  }

  const balance = (await getUserBalance(user)) || 0
  const transactions = await getTransactions(user)

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
              transactions
                ? transactions[0].amount > 0
                  ? 'text-red-500'
                  : 'text-green-500'
                : ''
            }
          >
            {transactions
              ? currencyFormatterWithSign.format(transactions[0].amount)
              : '--'}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
