import Header from '@/components/header'
import { MyBorrowsList } from '@/components/my-borrows/my-borrows-list'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, Calendar, ClockArrowUp } from 'lucide-react'

export default async function MyBorrowsPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  // Fetch user's active borrows
  const { data: borrows } = await supabase
    .from('borrows')
    .select(
      `
      id,
      borrow_date,
      due_date,
      return_date,
      status,
      book:books(id, title, author, cover_image, category)
    `
    )
    .eq('user_id', user.id)
    .order('borrow_date', { ascending: false })

  const activeBorrows = borrows?.filter(b => b.status === 'borrowed') || []
  const returnedBorrows = borrows?.filter(b => b.status === 'returned') || []
  const overdueBorrows = activeBorrows.filter(
    b => new Date(b.due_date) < new Date()
  )

  const cardItems = [
    {
      id: 'currently-borrowing',
      title: 'Active Borrows',
      length: activeBorrows.length,
      des: 'Now borrowing',
      icon: BookOpen,
    },
    {
      id: 'overdue',
      title: 'Overdue',
      length: overdueBorrows.length,
      des: 'Past due date',
      icon: Calendar,
    },
    {
      id: 'total-borrows',
      title: 'Books Returned',
      length: returnedBorrows.length,
      des: 'Total Books Borrowed and Returned',
      icon: ClockArrowUp,
    },
  ]

  return (
    <div className='min-h-screen bg-background'>
      <Header user={user} />
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight'>My Books</h1>
          <p className='mt-1 text-muted-foreground'>
            Track and manage my library books borrowing process
          </p>
        </div>

        <div className='grid gap-6'>
          {/* Stats Cards */}
          <div className='grid gap-4 md:grid-cols-3'>
            {cardItems.map(item => {
              const Icon = item.icon
              return (
                <Card
                  key={item.id}
                  className='flex flex-col gap-2.5 hover:shadow-md'
                >
                  <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                    <CardTitle className='text-sm font-medium'>
                      {item.title}
                    </CardTitle>
                    <Icon className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${
                        item.id === 'overdue' && 'text-destructive'
                      }`}
                    >
                      {item.length}
                    </div>
                    <p className='text-xs text-muted-foreground'>{item.des}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Current Borrows */}
          <Card>
            <CardHeader>
              <CardTitle>Now Borrowing</CardTitle>
              <CardDescription>
                Books you currently are borrowing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MyBorrowsList borrows={activeBorrows} />
            </CardContent>
          </Card>

          {/* Returned History */}
          {returnedBorrows.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Return History</CardTitle>
                <CardDescription>Previously borrowed books</CardDescription>
              </CardHeader>
              <CardContent>
                <MyBorrowsList
                  borrows={returnedBorrows}
                  showReturnButton={false}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
