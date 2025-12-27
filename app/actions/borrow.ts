"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function borrowBook(bookId: string, userId: string) {
  const supabase = await createClient()
  try {
    // Check if user already has this book borrowed
    // Use .maybeSingle() to avoid errors when no record exists
    const { data: existingBorrow } = await supabase
      .from("borrows")
      .select("id")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .is("return_date", null)
      .maybeSingle()

    if (existingBorrow) {
      return { error: "You have already borrowed this book" }
    }

    // Check if book is available
    const { data: book, error: bookError } = await supabase
      .from("books")
      .select("available_copies, title")
      .eq("id", bookId)
      .single()

    if (bookError || !book) {
      console.error("Book fetch error:", bookError)
      return { error: "Book not found" }
    }

    if (book.available_copies <= 0) {
      return { error: "This book is currently unavailable" }
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    // Create borrow record
    // FIX: Changed status from "active" to "borrowed" to match database constraint
    const { data: borrowData, error: borrowError } = await supabase
      .from("borrows")
      .insert({
        book_id: bookId,
        user_id: userId,
        borrow_date: new Date().toISOString(),
        due_date: dueDate.toISOString(),
        status: "borrowed", // ✅ Changed from "active" to "borrowed"
      })
      .select()
      .single()

    if (borrowError) {
      console.error("Borrow insert error:", borrowError)
      return { error: `Failed to borrow book: ${borrowError.message}` }
    }

    // Decrease available copies
    const { error: updateError } = await supabase
      .from("books")
      .update({ available_copies: book.available_copies - 1 })
      .eq("id", bookId)

    if (updateError) {
      console.error("Update book error:", updateError)
      // Rollback: Delete the borrow record if book update fails
      await supabase.from("borrows").delete().eq("id", borrowData.id)
      return { error: "Failed to update book availability" }
    }

    // Revalidate paths to refresh the UI
    revalidatePath("/books")
    revalidatePath(`/books/${bookId}`)
    revalidatePath("/my-borrows")

    return { success: true, dueDate: dueDate.toISOString() }
  } catch (error) {
    console.error("Borrow book unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function returnBook(borrowId: string) {
  const supabase = await createClient()

  try {
    // Get borrow details with error handling
    const { data: borrow, error: fetchError } = await supabase
      .from("borrows")
      .select("book_id, status")
      .eq("id", borrowId)
      .single()

    if (fetchError || !borrow) {
      console.error("Borrow fetch error:", fetchError)
      return { error: "Borrow record not found" }
    }

    // Check if already returned
    if (borrow.status === "returned") {
      return { error: "This book has already been returned" }
    }

    // Update borrow record to mark as returned
    const { error: borrowError } = await supabase
      .from("borrows")
      .update({
        return_date: new Date().toISOString(),
        status: "returned", // ✅ This matches the database constraint
      })
      .eq("id", borrowId)

    if (borrowError) {
      console.error("Return update error:", borrowError)
      return { error: "Failed to return book. Please try again." }
    }

    // Increase available copies
    const { data: book } = await supabase
      .from("books")
      .select("available_copies")
      .eq("id", borrow.book_id)
      .single()

    if (book) {
      const { error: updateError } = await supabase
        .from("books")
        .update({ available_copies: book.available_copies + 1 })
        .eq("id", borrow.book_id)
      
      if (updateError) {
        console.error("Book update error:", updateError)
      }
    }

    // Revalidate pages
    revalidatePath("/books")
    revalidatePath("/my-borrows")

    return { success: true }
  } catch (error) {
    console.error("Return book unexpected error:", error)
    return { error: "An unexpected error occurred" }
  }
}