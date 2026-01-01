'use client'

import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'

export type AdminRecentActivityType = {
  id: string
  book_isbn: string
  book_title: string
  borrowed_by: string
  borrow_date: string
  due_date: string
  return_date: string | null
  status: 'borrowed' | 'returned' | 'overdue'
  email: string
}

export const columns: ColumnDef<AdminRecentActivityType>[] = [
  {
    accessorKey: 'book_isbn',
    header: 'Book ISBN',
  },
  {
    accessorKey: 'book_title',
    header: 'Book Title',
  },
  {
    accessorKey: 'borrowed_by',
    header: 'Borrowed By',
  },
  {
    accessorKey: 'borrow_date',
    header: 'Borrow Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('borrow_date')), 'MMM d, yyyy')
    },
  },
  {
    accessorKey: 'due_date',
    header: 'Due Date',
    cell: ({ row }) => {
      return format(new Date(row.getValue('due_date')), 'MMM d, yyyy')
    },
  },
  {
    accessorKey: 'return_date',
    header: 'Return Date',
    cell: ({ row }) => {
      const returnDate = row.getValue('return_date') as string | null
      return returnDate ? format(new Date(returnDate), 'MMM d, yyyy') : '-'
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <Badge
          variant={
            status === 'returned'
              ? 'default'
              : status === 'overdue'
              ? 'destructive'
              : 'secondary'
          }
        >
          {status}
        </Badge>
      )
    },
  },
]
