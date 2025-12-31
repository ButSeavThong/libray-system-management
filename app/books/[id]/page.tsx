import { BookDetailView } from '@/components/books/book-detail-view'
import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BookDetailPage({ params }: PageProps) {
  const { id } = await params
  const user = await requireAuth()
  const supabase = await createClient()

  // Fetch book details
  const { data: book, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !book) {
    notFound()
  }

  // Check if user already has an active borrow for this book
  const { data: existingBorrow } = await supabase
    .from('borrows')
    .select('id')
    .eq('user_id', user.id)
    .eq('book_id', id)
    .is('return_date', null)
    .single()

  return (
    <div className='min-h-screen bg-background'>
      <Header user={user}/>
      <div className='container mx-auto px-8 py-8'>
        <Button variant='secondary' size='sm' asChild className='mb-6'>
          <Link href='/books' className='gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Back to Library
          </Link>
        </Button>

        <BookDetailView
          book={book}
          userId={user.id}
          hasActiveBorrow={!!existingBorrow}
        />
      </div>
    </div>
  )
}
