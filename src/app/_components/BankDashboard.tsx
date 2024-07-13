import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  currencyFormatter,
  currencyFormatterCompactWithSign,
} from '@/lib/formatters'
import { getUser } from '@/utils/auth'
import { Activity, DollarSign } from 'lucide-react'
import {
  getTransactions,
  getUserBalance,
} from '../(user)/(main)/bank/bank-quries'

export async function BankDashboard() {
  const { user } = await getUser()

  const balance = user ? (await getUserBalance(user)) || 0 : 0
  const transactions = user ? await getTransactions(user) : null

  return (
    <div className='mb-5 flex w-full flex-row gap-4'>
      <Card className='grow'>
        <CardHeader>
          <CardDescription className='flex flex-row items-center justify-between'>
            帳號餘額
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardDescription>
          <CardTitle style={{ fontSize: 'clamp(0.8rem, 5vw, 1.5rem)' }}>
            {currencyFormatter.format(balance)}
          </CardTitle>
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
            style={{ fontSize: 'clamp(0.8rem, 5vw, 1.5rem)' }}
          >
            {transactions
              ? currencyFormatterCompactWithSign.format(transactions[0].amount)
              : '--'}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
