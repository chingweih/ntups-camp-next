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
import { type Transaction } from '../(user)/(main)/bank/bank-quries'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'
import { getDateString } from '@/lib/dt-options'
import { getUserDisplayNameByEmail } from '@/utils/auth'

export function TransactionTable({
  transactions,
}: {
  transactions: Transaction[] | null
}) {
  const lastUpdate = getDateString()

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
          <TransactionRow transactions={transactions} />
        ) : (
          <NoDataRow />
        )}
      </TableBody>
    </Table>
  )
}

function TransactionRow({ transactions }: { transactions: Transaction[] }) {
  return transactions.map((transaction) => (
    <React.Fragment key={transaction.timestamp}>
      <TableRow className={transaction.notes ? '' : 'border-b'}>
        <TableCell className='w-[20px] font-medium'>
          {getDateString(transaction.timestamp)}
        </TableCell>
        <TableCell>{getUserDisplayNameByEmail(transaction.to_from)}</TableCell>
        <TableCell
          className={
            'text-right ' +
            (transaction.amount > 0 ? 'text-red-500' : 'text-green-500')
          }
        >
          {currencyFormatterWithSign.format(transaction.amount)}
        </TableCell>
      </TableRow>
      <NotesRow notes={transaction.notes} />
    </React.Fragment>
  ))
}

function NotesRow({ notes }: { notes: string | undefined }) {
  return notes ? (
    <TableRow className='border-b'>
      <TableCellSm colSpan={3} className='text-right text-slate-400'>
        {notes}
      </TableCellSm>
    </TableRow>
  ) : null
}

function NoDataRow() {
  return (
    <TableRow>
      <TableCell colSpan={3} className='text-center text-slate-700'>
        尚未有轉帳資料，
        <Button asChild variant='link' className='m-0 h-auto p-0'>
          <Link href='/bank/transfer' className='decoration-underline'>
            立即轉帳
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}
