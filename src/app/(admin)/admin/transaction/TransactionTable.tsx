'use client'

import { DataTable } from '@/app/_components/DataTable'
import { getDateString } from '@/app/_components/TransactionTable'
import { currencyFormatter } from '@/lib/formatters'
import { Tables } from '@/utils/database.types'
import { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<Tables<'transactions'>>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'created_at',
    header: '時間',
    cell: ({ row }) => {
      return getDateString(row.original.created_at)
    },
  },
  {
    accessorKey: 'from_email',
    header: 'From',
    cell: ({ row }) => {
      return row.original.from_email.split('@')[0]
    },
  },
  {
    accessorKey: 'to_email',
    header: 'To',
    cell: ({ row }) => {
      return row.original.to_email.split('@')[0]
    },
  },
  {
    accessorKey: 'amount',
    header: '金額',
    cell: ({ row }) => {
      return currencyFormatter.format(row.original.amount)
    },
  },
  {
    accessorKey: 'notes',
    header: '備註',
  },
]

export default function TransactionTable({
  transactions,
}: {
  transactions: Tables<'transactions'>[]
}) {
  return <DataTable columns={columns} data={transactions} />
}
