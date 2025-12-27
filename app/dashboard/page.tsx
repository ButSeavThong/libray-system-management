import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BookCard } from "@/components/book-card"
import { DashboardHeader } from "@/components/dashboard-header"
import { BorrowedBooksList } from "@/components/borrowed-books-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: books } = await supabase.from("books").select("*").order("created_at", { ascending: false })

  const { data: borrowedBooks } = await supabase
    .from("borrows")
    .select("*, book:books(*)")
    .eq("user_id", user.id)
    .is("return_date", null)

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <DashboardHeader user={user} profile={profile} />
      <main className="flex-1 container mx-auto py-8 px-4">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="browse">Browse Library</TabsTrigger>
            <TabsTrigger value="my-books">My Borrowed Books ({borrowedBooks?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold tracking-tight">Available Books</h2>
              <p className="text-muted-foreground">Browse our collection and borrow your next favorite read.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books?.map((book) => (
                <BookCard key={book.id} book={book} userId={user.id} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-books">
            <BorrowedBooksList borrowedBooks={borrowedBooks || []} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
