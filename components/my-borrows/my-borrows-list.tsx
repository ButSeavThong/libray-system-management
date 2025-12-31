'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calendar, CheckCircle2, Loader2 } from 'lucide-react'
import { format, isPast } from 'date-fns'
import { returnBook } from '@/app/actions/borrow'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface Borrow {
  id: string
  borrow_date: string
  due_date: string
  return_date: string | null
  status: string
  book: {
    id: string
    title: string
    author: string
    cover_image: string | null
    category: string | null
  }
}

interface BorrowList {
  id: any
  borrow_date: any
  due_date: any
  return_date: any
  status: any
  book: Book
}

interface Book {
  id: any
  title: any
  author: any
  cover_image: any
  category: any
}

export function MyBorrowsList({
  borrows,
  showReturnButton = true,
}: {
  borrows: Borrow[]
  showReturnButton?: boolean
}) {
  const [returningId, setReturningId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleReturn = async (borrowId: string, bookTitle: string) => {
    setReturningId(borrowId)
    try {
      const result = await returnBook(borrowId)

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Book Returned',
          description: `Successfully returned "${bookTitle}".`,
        })
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to return book',
        variant: 'destructive',
      })
    } finally {
      setReturningId(null)
    }
  }

  if (borrows.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='rounded-full bg-muted p-4 mb-4'>
          <BookOpen className='h-8 w-8 text-muted-foreground' />
        </div>
        <h3 className='text-lg font-semibold'>No books found</h3>
        <p className='mt-1 text-sm text-muted-foreground'>
          {showReturnButton
            ? "You don't have any active loans"
            : 'No return history yet'}
        </p>
        {showReturnButton && (
          <Button asChild className='mt-4 bg-transparent' variant='outline'>
            <Link href='/books'>Browse Library</Link>
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className='grid gap-4'>
      {borrows.map(borrow => {
        const isOverdue =
          isPast(new Date(borrow.due_date)) && !borrow.return_date
        return (
          <div
            key={borrow.id}
            className='flex flex-col gap-4 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between hover:shadow-md'
          >
            <div className='flex gap-4'>
              <Link
                href={`/books/${borrow.book.id}`}
                className='h-20 w-14 shrink-0 overflow-hidden rounded bg-muted'
              >
                {borrow.book.cover_image ? (
                  <Image
                    src={borrow.book.cover_image ?? '/placeholder.svg'}
                    alt={borrow.book.title}
                    width={100}
                    height={100}
                    className='h-full w-full object-cover'
                  />
                ) : (
                  <div className='flex h-full items-center justify-center'>
                    <BookOpen className='h-6 w-6 opacity-20' />
                  </div>
                )}
              </Link>

              <div className='flex flex-col gap-1'>
                <Link
                  href={`/books/${borrow.book.id}`}
                  className='font-semibold hover:underline'
                >
                  {borrow.book.title}
                </Link>
                <p className='text-sm text-muted-foreground'>
                  {borrow.book.author}
                </p>
                <div className='flex flex-wrap items-center gap-2 mt-1'>
                  {borrow.book.category && (
                    <Badge variant='outline' className='text-xs'>
                      {borrow.book.category}
                    </Badge>
                  )}
                  {isOverdue && <Badge variant='destructive'>Overdue</Badge>}
                  {borrow.return_date && (
                    <Badge variant='secondary'>Returned</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-2 sm:items-end'>
              <div className='flex items-center gap-2 text-sm'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <span className='text-muted-foreground'>
                  {!borrow.return_date && borrow.status === 'borrowed'
                    ? 'Due'
                    : 'Returned'}
                  :&nbsp;
                  <span
                    className={isOverdue ? 'font-medium text-destructive' : ''}
                  >
                    {format(
                      new Date(borrow.return_date || borrow.due_date),
                      'MMM d, yyyy'
                    )}
                  </span>
                </span>
              </div>

              {showReturnButton && !borrow.return_date && (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => handleReturn(borrow.id, borrow.book.title)}
                  disabled={returningId === borrow.id}
                  className='w-full sm:w-auto'
                >
                  {returningId === borrow.id ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Returning...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className='mr-2 h-4 w-4' />
                      Return Book
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
