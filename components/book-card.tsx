"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Book {
  id: string
  title: string
  author: string
  genre: string
  available_copies: number
  total_copies: number
  cover_url?: string
}

export function BookCard({ book, userId }: { book: Book; userId: string }) {
  const [isBorrowing, setIsBorrowing] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const handleBorrow = async () => {
    setIsBorrowing(true)
    try {
      const dueDate = new URLSearchParams()
      const date = new Date()
      date.setDate(date.getDate() + 14) // 2 weeks borrow time

      const { error } = await supabase.from("borrows").insert({
        book_id: book.id,
        user_id: userId,
        due_date: date.toISOString(),
        status: "active",
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: `You have successfully borrowed ${book.title}.`,
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to borrow book",
        variant: "destructive",
      })
    } finally {
      setIsBorrowing(false)
    }
  }

  return (
    <Card className="flex flex-col overflow-hidden h-full">
      <div className="aspect-[3/4] bg-muted relative">
        {book.cover_url ? (
          <img src={book.cover_url || "/placeholder.svg"} alt={book.title} className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <BookOpen className="h-12 w-12 opacity-20" />
          </div>
        )}
        <Badge variant={book.available_copies > 0 ? "default" : "secondary"} className="absolute top-2 right-2">
          {book.available_copies > 0 ? `${book.available_copies} Available` : "Unavailable"}
        </Badge>
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <User className="h-3 w-3" /> {book.author}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        <Badge variant="outline" className="mt-2">
          {book.genre}
        </Badge>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={book.available_copies === 0 || isBorrowing} onClick={handleBorrow}>
          {isBorrowing ? "Borrowing..." : "Borrow Book"}
        </Button>
      </CardFooter>
    </Card>
  )
}
