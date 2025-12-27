import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { BookGrid } from '@/components/books/book-grid'
import { BookFilters } from '@/components/books/book-filters'
import { BookSearch } from '@/components/books/book-search'
import { Skeleton } from '@/components/ui/skeleton'
import { Library } from 'lucide-react'
import { MainNav } from '@/components/layout/main-nav'
import { UserNav } from '@/components/layout/user-nav'

interface PageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    author?: string
  }>
}

export default async function BooksPage({ searchParams }: PageProps) {
  const user = await requireAuth()
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from('books')
    .select('*')
    .order('title', { ascending: true })

  // Apply filters
  if (params.search) {
    query = query.or(
      `title.ilike.%${params.search}%,author.ilike.%${params.search}%`
    )
  }
  if (params.category) {
    query = query.eq('category', params.category)
  }
  if (params.author) {
    query = query.ilike('author', `%${params.author}%`)
  }

  const { data: books, error } = await query

  // Get unique categories for filter
  const { data: categoriesData } = await supabase
    .from('books')
    .select('category')
    .not('category', 'is', null)

  const categories = Array.from(
    new Set(categoriesData?.map(b => b.category).filter(Boolean) || [])
  )

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-8'>
            <Link href='/books' className='flex items-center gap-2'>
              <Library className='h-6 w-6 text-primary' />
              <span className='text-lg font-semibold'>Library System</span>
            </Link>
            <MainNav />
          </div>
          <UserNav user={user} />
        </div>
      </header>

      <div className='container mx-auto px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Browse Collection
          </h1>
          <p className='mt-1 text-muted-foreground'>
            Discover and borrow from our extensive library
          </p>
        </div>

        <div className='flex flex-col gap-6'>
          {/* Search and Filters */}
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            <BookSearch />
            <BookFilters categories={categories} />
          </div>

          {/* Books Grid */}
          <Suspense
            fallback={
              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className='h-96 w-full' />
                ))}
              </div>
            }
          >
            <BookGrid books={books || []} userId={user.id} />
          </Suspense>

          {error && (
            <div className='rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-center'>
              <p className='text-sm text-destructive'>
                Failed to load books. Please try again.
              </p>
            </div>
          )}

          {!error && books?.length === 0 && (
            <div className='rounded-lg border bg-card p-12 text-center'>
              <Library className='mx-auto h-12 w-12 text-muted-foreground opacity-50' />
              <h3 className='mt-4 text-lg font-semibold'>No books found</h3>
              <p className='mt-2 text-sm text-muted-foreground'>
                Try adjusting your search or filters to find what you&apos;re
                looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
