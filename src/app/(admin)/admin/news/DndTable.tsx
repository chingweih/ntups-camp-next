'use client'

import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { GripVertical } from 'lucide-react'
import React, { CSSProperties } from 'react'
import { Tables } from '@/utils/database.types'
import { updatePostOrder } from './actions'
import { toast } from 'sonner'

export const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
  const { attributes, listeners } = useSortable({
    id: rowId,
  })
  return (
    <button {...attributes} {...listeners}>
      <GripVertical size={18} />
    </button>
  )
}

// Row Component
const DraggableRow = ({ row }: { row: Row<Tables<'posts'>> }) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id.toString(),
  })

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
    transition: transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: 'relative',
  }
  return (
    // connect row ref to dnd-kit, apply important styles
    <TableRow ref={setNodeRef} style={style}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

interface DataTableProps {
  columns: ColumnDef<Tables<'posts'>>[]
  data: Tables<'posts'>[]
}

export function DndTable({ columns, data: ogData }: DataTableProps) {
  const [data, setData] = React.useState(ogData)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(), //required because row indexes will change
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id.toString()),
    [data],
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id)
      const newIndex = dataIds.indexOf(over.id)
      setData((data) => {
        return arrayMove(data, oldIndex, newIndex) //this is just a splice util
      })
      toast.promise(updatePostOrder(data[oldIndex].id, newIndex), {
        loading: '更新中...',
        success: '順序更新成功',
        error: '更新失敗',
      })
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  )

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            <SortableContext
              items={dataIds}
              strategy={verticalListSortingStrategy}
            >
              {table.getRowModel().rows.map((row) => (
                <DraggableRow key={row.id} row={row} />
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </div>
    </DndContext>
  )
}
