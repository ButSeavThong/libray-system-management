import { BookCard } from "@/components/books/book-card"

interface Book {
  id: string
  title: string
  author: string
  category: string | null
  available_copies: number
  total_copies: number
  cover_image: string | null
  isbn: string | null
  description: string | null
}

export function BookGrid({ books, userId }: { books: Book[]; userId: string }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} userId={userId} />
      ))}
    </div>
  )
}
