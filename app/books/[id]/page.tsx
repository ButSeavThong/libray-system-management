import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { requireAuth } from "@/lib/auth"
import { BookDetailView } from "@/components/books/book-detail-view"
import { ArrowLeft, Library } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"

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
  const { data: book, error } = await supabase.from("books").select("*").eq("id", id).single()

  if (error || !book) {
    notFound()
  }

  // Check if user already has an active borrow for this book
  const { data: existingBorrow } = await supabase
    .from("borrows")
    .select("id")
    .eq("user_id", user.id)
    .eq("book_id", id)
    .is("return_date", null)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link href="/books" className="flex items-center gap-2">
              <Library className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Library System</span>
            </Link>
            <MainNav />
          </div>
          <UserNav user={user} />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/books" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Library
          </Link>
        </Button>

        <BookDetailView book={book} userId={user.id} hasActiveBorrow={!!existingBorrow} />
      </div>
    </div>
  )
}
