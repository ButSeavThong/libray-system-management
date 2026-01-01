import { createClient } from '@/lib/supabase/server'
import { DataTable } from '@/components/admin/recent-activity/data-table'
import { columns } from '@/components/admin/recent-activity/column'
import { AdminHeader } from '@/components/admin/header'

async function getBorrowsData() {
  const supabase = await createClient()

  // get all borrows
  const { data: borrows, error } = await supabase
    .from('borrows')
    .select('*')
    .order('borrow_date', { ascending: false })

  if (error) {
    console.error('Error fetching borrows:', error)
    return []
  }

  if (!borrows || borrows.length === 0) {
    return []
  }

  // Get unique book IDs and user IDs
  const bookIds = [...new Set(borrows.map(b => b.book_id))]
  const userIds = [...new Set(borrows.map(b => b.user_id))]

  // Fetch books
  const { data: books } = await supabase
    .from('books')
    .select('id, title, isbn')
    .in('id', bookIds)

  // Fetch profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('id', userIds)

  // Create maps for easy lookup
  const bookMap = new Map(books?.map(b => [b.id, b]) || [])
  const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])

  // Transform the data
  return borrows.map(borrow => {
    const book = bookMap.get(borrow.book_id)
    const profile = profileMap.get(borrow.user_id)

    return {
      id: borrow.id,
      book_isbn: book?.isbn || 'N/A',
      book_title: book?.title || 'Unknown',
      borrowed_by: profile?.full_name || 'Unknown User',
      borrow_date: borrow.borrow_date,
      due_date: borrow.due_date,
      return_date: borrow.return_date,
      status: borrow.status as 'borrowed' | 'returned' | 'overdue',
      email: borrow.user_id,
    }
  })
}

async function getUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export default async function BorrowsPage() {
  const data = await getBorrowsData()
  const user = await getUser()

  return (
    <div>
      <div className='flex flex-1 flex-col'>
        <AdminHeader user={user} />
        <div className='flex-1 space-y-4 p-8 pt-6'>
          <h2 className='text-3xl font-bold tracking-tight'>
            Borrows Collection
          </h2>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}
