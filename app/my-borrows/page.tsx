import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth"
import { MyBorrowsList } from "@/components/my-borrows/my-borrows-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Library } from "lucide-react"
import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"

export default async function MyBorrowsPage() {
  const user = await requireAuth()
  const supabase = await createClient()

  // Fetch user's active borrows
  const { data: borrows } = await supabase
    .from("borrows")
    .select(
      `
      id,
      borrow_date,
      due_date,
      return_date,
      status,
      book:books(id, title, author, cover_image, category)
    `,
    )
    .eq("user_id", user.id)
    .order("borrow_date", { ascending: false })

  const activeBorrows = borrows?.filter((b) => b.status === "active") || []
  const returnedBorrows = borrows?.filter((b) => b.status === "returned") || []
  const overdueBorrows = activeBorrows.filter((b) => new Date(b.due_date) < new Date())

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60'>
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

      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold tracking-tight'>
            My Borrowed Books
          </h1>
          <p className='mt-1 text-muted-foreground'>
            Track and manage your library loans
          </p>
        </div>

        <div className='grid gap-6'>
          {/* Stats Cards */}
          <div className='grid gap-4 md:grid-cols-3'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Active Loans
                </CardTitle>
                <BookOpen className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{activeBorrows.length}</div>
                <p className='text-xs text-muted-foreground'>
                  Currently borrowed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Overdue</CardTitle>
                <Calendar className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-destructive'>
                  {overdueBorrows.length}
                </div>
                <p className='text-xs text-muted-foreground'>Past due date</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Returned
                </CardTitle>
                <BookOpen className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {returnedBorrows.length}
                </div>
                <p className='text-xs text-muted-foreground'>All time</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Borrows */}
          <Card>
            <CardHeader>
              <CardTitle>Active Loans</CardTitle>
              <CardDescription>
                Books you currently have borrowed
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
