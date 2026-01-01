import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'
import { BooksTable } from '@/components/admin/books-table'
import { AddBookDialog } from '@/components/admin/add-book-dialog'

export default async function AdminBooksPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect("/auth/login")
  // }

  // const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  // if (!profile?.is_admin) {
  //   redirect("/dashboard")
  // }

  const { data: books } = await supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className='flex flex-1 flex-col'>
        <AdminHeader user={user} />
        <div className='flex-1 space-y-4 p-8 pt-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-3xl font-bold tracking-tight'>Manage Books</h2>
            <AddBookDialog />
          </div>
          <BooksTable books={books || []} />
        </div>
      </div>
    </div>
  )
}
