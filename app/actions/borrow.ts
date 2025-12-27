'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function borrowBook(bookId: string, userId: string) {
  const supabase = await createClient()

  try {
    // Check if user already has this book borrowed
    const { data: existingBorrow } = await supabase
      .from('borrows')
      .select('id')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .is('return_date', null)
      .single()

    if (existingBorrow) {
      return { error: 'You have already borrowed this book' }
    }

    // Check if book is available
    const { data: book } = await supabase
      .from('books')
      .select('available_copies, title')
      .eq('id', bookId)
      .single()

    if (!book || book.available_copies <= 0) {
      return { error: 'This book is currently unavailable' }
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14)

    // Create borrow record
    const { error: borrowError } = await supabase.from('borrows').insert({
      book_id: bookId,
      user_id: userId,
      borrow_date: new Date().toISOString(),
      due_date: dueDate.toISOString(),
      status: 'borrowed',
    })

    if (borrowError) {
      console.error('[v0] Borrow error:', borrowError)
      return { error: 'Failed to borrow book. Please try again.' }
    }

    // Decrease available copies
    const { error: updateError } = await supabase
      .from('books')
      .update({ available_copies: book.available_copies - 1 })
      .eq('id', bookId)

    if (updateError) {
      console.error('[v0] Update book error:', updateError)
      return { error: 'Failed to update book availability' }
    }

    revalidatePath('/books')
    revalidatePath('/books/[id]')
    revalidatePath('/my-borrows')

    return { success: true, dueDate: dueDate.toISOString() }
  } catch (error) {
    console.error('[v0] Borrow book error:', error)
    return { error: 'An unexpected error occurred' }
  }
}

export async function returnBook(borrowId: string) {
  const supabase = await createClient()

  try {
    // Get borrow details
    const { data: borrow } = await supabase
      .from('borrows')
      .select('book_id, status')
      .eq('id', borrowId)
      .single()

    if (!borrow || borrow.status === 'returned') {
      return { error: 'Invalid borrow record' }
    }

    // Update borrow record
    const { error: borrowError } = await supabase
      .from('borrows')
      .update({
        return_date: new Date().toISOString(),
        status: 'returned',
      })
      .eq('id', borrowId)

    if (borrowError) {
      console.error('[v0] Return error:', borrowError)
      return { error: 'Failed to return book. Please try again.' }
    }

    // Increase available copies
    const { data: book } = await supabase
      .from('books')
      .select('available_copies')
      .eq('id', borrow.book_id)
      .single()

    if (book) {
      await supabase
        .from('books')
        .update({ available_copies: book.available_copies + 1 })
        .eq('id', borrow.book_id)
    }

    revalidatePath('/books')
    revalidatePath('/my-borrows')

    return { success: true }
  } catch (error) {
    console.error('[v0] Return book error:', error)
    return { error: 'An unexpected error occurred' }
  }
}
