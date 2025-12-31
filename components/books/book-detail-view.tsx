'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Calendar, Hash, User, Package, Loader2 } from 'lucide-react'
import { borrowBook } from '@/app/actions/borrow'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface Book {
  id: string
  title: string
  author: string
  category: string | null
  isbn: string | null
  description: string | null
  available_copies: number
  total_copies: number
  cover_image: string | null
}

export function BookDetailView({
  book,
  userId,
  hasActiveBorrow,
}: {
  book: Book
  userId: string
  hasActiveBorrow: boolean
}) {
  const [isBorrowing, setIsBorrowing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleBorrow = async () => {
    setIsBorrowing(true)
    try {
      const result = await borrowBook(book.id, userId)

      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Success!',
          description: `You have successfully borrowed "${
            book.title
          }". Due date: ${new Date(result.dueDate!).toLocaleDateString()}`,
        })
        router.push('/my-borrows')
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to borrow book',
        variant: 'destructive',
      })
    } finally {
      setIsBorrowing(false)
    }
  }

  const isAvailable = book.available_copies > 0 && !hasActiveBorrow

  return (
    <div className='grid gap-8 lg:grid-cols-[400px_1fr]'>
      {/* Book Cover */}
      <div>
        <Card className='overflow-hidden pt-0 pb-2'>
          <div className='aspect-3/4 bg-muted'>
            {book.cover_image ? (
              <Image
                src={book.cover_image ?? '/placeholder.svg'}
                alt={book.title}
                width={100}
                height={100}
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='flex h-full items-center justify-center text-muted-foreground'>
                <BookOpen className='h-24 w-24 opacity-20' />
              </div>
            )}
          </div>
          <CardContent className='px-6 pb-2'>
            <div className='flex flex-col gap-3'>
              <div className='text-center text-sm text-muted-foreground'>
                {hasActiveBorrow
                  ? 'You already have this book borrowed'
                  : book.available_copies === 0
                  ? 'This book is currently unavailable'
                  : '2-week lending period'}
              </div>
              <Button
                onClick={handleBorrow}
                disabled={!isAvailable || isBorrowing}
                size='lg'
                className='w-full'
              >
                {isBorrowing && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                {hasActiveBorrow
                  ? 'Already Borrowed'
                  : book.available_copies === 0
                  ? 'Out of Stock'
                  : 'Borrow Book'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Book Details */}
      <div className='flex flex-col gap-6'>
        <div>
          <h1 className='text-balance text-4xl font-bold tracking-tight'>
            {book.title}
          </h1>
          <p className='mt-2 flex items-center gap-2 text-xl text-muted-foreground'>
            <User className='h-5 w-5' />
            {book.author}
          </p>
          <div className='mt-4 flex flex-wrap gap-2'>
            {book.category && (
              <Badge variant='secondary'>{book.category}</Badge>
            )}
            <Badge
              variant={book.available_copies > 0 ? 'default' : 'secondary'}
            >
              {book.available_copies > 0
                ? `${book.available_copies} Available`
                : 'Out of Stock'}
            </Badge>
          </div>
        </div>

        <Separator />

        <Card className='flex flex-col gap-2'>
          <CardHeader className=''>
            <CardTitle className=''>Book Information</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            {book.isbn && (
              <div className='flex items-center gap-3'>
                <Hash className='h-5 w-5 text-muted-foreground' />
                <div>
                  <p className='text-sm font-medium'>ISBN</p>
                  <p className='text-sm text-muted-foreground'>{book.isbn}</p>
                </div>
              </div>
            )}
            <div className='flex items-center gap-3'>
              <Package className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Availability</p>
                <p className='text-sm text-muted-foreground'>
                  {book.available_copies} of {book.total_copies} copies
                  available
                </p>
              </div>
            </div>
            <div className='flex items-center gap-3'>
              <Calendar className='h-5 w-5 text-muted-foreground' />
              <div>
                <p className='text-sm font-medium'>Lending Period</p>
                <p className='text-sm text-muted-foreground'>
                  14 days from borrow date
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {book.description && (
          <Card className='flex flex-col gap-2'>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='leading-relaxed text-muted-foreground'>
                {book.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
