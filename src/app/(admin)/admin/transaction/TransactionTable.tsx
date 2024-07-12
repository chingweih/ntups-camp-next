'use client'

import { DataTable } from '@/app/_components/DataTable'
import { DataTablePaging } from '@/app/_components/DataTablePaging'
import { getDateString } from '@/lib/dt-options'
import { currencyFormatter } from '@/lib/formatters'
import { Tables } from '@/utils/database.types'
import { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<Tables<'transactions'>>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 5,
  },
  {
    accessorKey: 'created_at',
    header: '時間',
    cell: ({ row }) => {
      return getDateString(row.original.created_at)
    },
    size: 5,
  },
  {
    accessorKey: 'from_email',
    header: 'From',
    cell: ({ row }) => {
      const displayName = row.original.from_email.split('||')

      return (
        <>
          {displayName[0]}
          <br />
          <span className='text-sm text-muted-foreground'>
            {displayName[1]}
          </span>
        </>
      )
    },
    size: 120,
  },
  {
    accessorKey: 'to_email',
    header: 'To',
    size: 120,
    cell: ({ row }) => {
      const displayName = row.original.from_email.split('||')

      return (
        <>
          {displayName[0]}
          <br />
          <span className='text-sm text-muted-foreground'>
            {displayName[1]}
          </span>
        </>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: '金額',
    cell: ({ row }) => {
      return (
        <span className='font-bold'>
          {currencyFormatter.format(row.original.amount)}
        </span>
      )
    },
    size: 60,
  },
  {
    accessorKey: 'notes',
    header: '備註',
    size: 120,
  },
]

export default function TransactionTable({
  transactions,
}: {
  transactions: Tables<'transactions'>[]
}) {
  return <DataTablePaging columns={columns} data={transactions} />
}
