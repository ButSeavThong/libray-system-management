'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Eye } from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  category: string | null
  available_copies: number
  total_copies: number
  cover_image: string | null
}

export function BookCard({ book, userId }: { book: Book; userId: string }) {
  return (
    <Card className='group flex flex-col overflow-hidden transition-shadow hover:shadow-lg'>
      <Link
        href={`/books/${book.id}`}
        className='relative overflow-hidden bg-muted max-h-100'
      >
        {book.cover_image ? (
          <img
            src={book.cover_image || '/placeholder.svg'}
            alt={book.title}
            className='h-50 w-full object-contain transition-transform group-hover:scale-105'
          />
        ) : (
          <div className='flex items-center justify-center text-muted-foreground'>
            <BookOpen className='h-16 w-16 opacity-20' />
          </div>
        )}
        <Badge
          variant={book.available_copies > 0 ? 'default' : 'secondary'}
          className='absolute right-2 top-2'
        >
          {book.available_copies > 0
            ? `${book.available_copies} Available`
            : 'Out of Stock'}
        </Badge>
      </Link>
      <CardHeader className=''>
        <CardTitle className='line-clamp-2 text-balance text-lg'>
          {book.title}
        </CardTitle>
        <CardDescription className='line-clamp-1'>
          {book.author}
        </CardDescription>
      </CardHeader>
      <CardContent className=''>
        {book.category && (
          <Badge variant='outline' className='text-xs'>
            {book.category}
          </Badge>
        )}
      </CardContent>
      <CardFooter className=''>
        <Button asChild className='w-full bg-transparent' variant='outline'>
          <Link href={`/books/${book.id}`}>
            <Eye className='mr-2 h-4 w-4' />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
