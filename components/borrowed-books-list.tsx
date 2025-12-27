"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { useState } from "react"

export function BorrowedBooksList({ borrowedBooks }: { borrowedBooks: any[] }) {
  const [returningId, setReturningId] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const handleReturn = async (id: string) => {
    setReturningId(id)
    try {
      const { error } = await supabase
        .from("borrows")
        .update({
          return_date: new Date().toISOString(),
          status: "returned",
        })
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Book Returned",
        description: "Thank you for returning the book.",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to return book",
        variant: "destructive",
      })
    } finally {
      setReturningId(null)
    }
  }

  if (borrowedBooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg bg-background">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Calendar className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No active loans</h3>
        <p className="text-muted-foreground">You don&apos;t have any books borrowed right now.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {borrowedBooks.map((item) => {
        const isOverdue = new Date(item.due_date) < new Date()

        return (
          <Card key={item.id}>
            <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-12 bg-muted rounded overflow-hidden flex-shrink-0">
                  {item.book.cover_url ? (
                    <img
                      src={item.book.cover_url || "/placeholder.svg"}
                      alt={item.book.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <RefreshCw className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{item.book.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.book.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={isOverdue ? "destructive" : "outline"} className="text-[10px] h-5">
                      Due: {format(new Date(item.due_date), "MMM d, yyyy")}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={returningId === item.id}
                onClick={() => handleReturn(item.id)}
              >
                {returningId === item.id ? "Processing..." : "Return Book"}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
