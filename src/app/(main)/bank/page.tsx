import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableCellSm,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/TableNotes'
import { Button } from '@/components/ui/button'
import { currencyFormatterWithSign } from '@/lib/formatters'
import { useAuth } from '@/utils/auth'
import { RefreshCcw } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getTransactions, getUserBalance } from './bank-data'

export default async function Bank() {
  const { user } = await useAuth()

  if (!user?.email) {
    redirect('/login')
  }

  const transactions = await getTransactions(user)

  if (!transactions) {
    redirect('/error')
  }

  const lastUpdate = new Date().toLocaleTimeString('en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

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
      <Table>
        <TableCaption>更新時間：{lastUpdate}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>時間</TableHead>
            <TableHead>對象</TableHead>
            <TableHead className='text-right'>金額</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <>
              <TableRow className={transaction.notes ? '' : 'border-b'}>
                <TableCell className='font-medium'>
                  {new Date(transaction.timestamp).toLocaleTimeString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </TableCell>
                <TableCell>
                  {transaction.to_from[0].toUpperCase() +
                    transaction.to_from.split('@')[0].slice(1)}
                </TableCell>
                <TableCell
                  className={
                    'text-right ' +
                    (transaction.amount > 0 ? 'text-red-500' : 'text-green-500')
                  }
                >
                  {currencyFormatterWithSign.format(transaction.amount)}
                </TableCell>
              </TableRow>
              {transaction.notes ? (
                <TableRow className='border-b'>
                  <TableCellSm
                    colSpan={3}
                    className='text-right text-slate-400'
                  >
                    {transaction.notes}
                  </TableCellSm>
                </TableRow>
              ) : null}
            </>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
