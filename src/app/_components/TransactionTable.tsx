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
import { currencyFormatterWithSign } from '@/lib/formatters'
import { type Transaction } from '../(main)/bank/bank-quries'

export function TransactionTable({
  transactions,
}: {
  transactions: Transaction[] | null
}) {
  const lastUpdate = new Date().toLocaleTimeString('en-US', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
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
        {transactions ? (
          transactions.map((transaction) => (
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
          ))
        ) : (
          <TableRow>
            <TableCell>--</TableCell>
            <TableCell>--</TableCell>
            <TableCell>--</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
