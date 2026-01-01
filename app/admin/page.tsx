import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminStats } from '@/components/admin/stats'
import { AdminRecentActivity } from '@/components/admin/recent-activity'
import { AdminHeader } from '@/components/admin/header'
import Header from '@/components/header'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect("/auth/login")
  // }

  // Double check admin status
  // const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  // if (!profile?.is_admin) {
  //   redirect("/dashboard")
  // }

  // Fetch stats
  const { count: booksCount } = await supabase
    .from('books')
    .select('*', { count: 'exact', head: true })
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
  const { count: activeLoansCount } = await supabase
    .from('borrows')
    .select('*', { count: 'exact', head: true })
    .is('return_date', null)
  const { count: overdueCount } = await supabase
    .from('borrows')
    .select('*', { count: 'exact', head: true })
    .is('return_date', null)
    .lt('due_date', new Date().toISOString())

  return (
    <div>
      {/* <AdminSidebar /> */}
      <div className='flex flex-1 flex-col'>
        <AdminHeader user={user} />
        
        <div className='flex-1 space-y-4 p-8 pt-6'>
          <div className='flex items-center justify-between space-y-2'>
            <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
          </div>
          <AdminStats
            stats={{
              books: booksCount || 0,
              users: usersCount || 0,
              activeLoans: activeLoansCount || 0,
              overdue: overdueCount || 0,
            }}
          />
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
            <AdminRecentActivity className='md:col-span-2 lg:col-span-7' />
          </div>
        </div>
      </div>
    </div>
  )
}
