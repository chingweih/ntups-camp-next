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
import { dtOptions as options, locale } from '@/lib/dt-options'

function getDateString(timestamp?: string) {
  return timestamp
    ? new Date(timestamp).toLocaleTimeString(locale, options)
    : new Date().toLocaleTimeString(locale, options)
}

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
        <TableCell className='font-medium'>
          {getDateString(transaction.timestamp)}
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
        <Button asChild variant='link' className='p-0 m-0 h-auto'>
          <Link href='/bank/transfer' className='decoration-underline'>
            立即轉帳
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  )
}
