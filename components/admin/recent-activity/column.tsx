'use client'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

async function handleStatusChange(borrowId: string, newStatus: string) {
  try {
    const response = await fetch('/api/borrows/update-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        borrowId,
        status: newStatus,
        returnDate: newStatus === 'returned' ? new Date().toISOString() : null,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to update status')
    }

    window.location.reload()
  } catch (error) {
    console.error('Error updating status:', error)
    alert('Failed to update status. Please try again.')
  }
}

export const columns: ColumnDef<AdminRecentActivityType>[] = [
  {
    accessorKey: 'book_isbn',
    header: ({ column }) => {
      return (
        <button
          className='p-0 flex gap-1 items-center hover:underline hover:underline-offset-4 hover:cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Book ISBN
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </button>
      )
    },
    size: 150,
  },
  {
    accessorKey: 'book_title',
    header: ({ column }) => {
      return (
        <button
          className='p-0 flex gap-1 items-center hover:underline hover:underline-offset-4 hover:cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Book Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </button>
      )
    },
    size: 250,
  },
  {
    accessorKey: 'borrowed_by',
    header: ({ column }) => {
      return (
        <button
          className='p-0 flex gap-1 items-center hover:underline hover:underline-offset-4 hover:cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Borrowed By
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </button>
      )
    },
    size: 180,
  },
  {
    accessorKey: 'borrow_date',
    header: ({ column }) => {
      return (
        <button
          className='p-0 flex gap-1 items-center hover:underline hover:underline-offset-4 hover:cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Borrow Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </button>
      )
    },
    cell: ({ row }) => {
      return format(new Date(row.getValue('borrow_date')), 'MMM d, yyyy')
    },
    size: 150,
  },
  {
    accessorKey: 'due_date',
    header: ({ column }) => {
      return (
        <button
          className='p-0 flex gap-1 items-center hover:underline hover:underline-offset-4 hover:cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Due Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </button>
      )
    },
    cell: ({ row }) => {
      return format(new Date(row.getValue('due_date')), 'MMM d, yyyy')
    },
  },
  {
    accessorKey: 'return_date',
    header: ({ column }) => {
      return (
        <button
          className='p-0 flex gap-1 items-center hover:underline hover:underline-offset-4 hover:cursor-pointer'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Return Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </button>
      )
    },
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
      const borrowId = row.original.id

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <Badge
                variant={
                  status === 'returned'
                    ? 'default'
                    : status === 'overdue'
                    ? 'destructive'
                    : 'secondary'
                }
                className='cursor-pointer hover:opacity-80'
              >
                {status}
              </Badge>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-40' align='end'>
            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleStatusChange(borrowId, 'borrowed')}
              disabled={status === 'borrowed'}
            >
              Borrowed
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(borrowId, 'returned')}
              disabled={status === 'returned'}
            >
              Returned
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleStatusChange(borrowId, 'overdue')}
              disabled={status === 'overdue'}
            >
              Overdue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
