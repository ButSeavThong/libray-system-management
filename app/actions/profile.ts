"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(userId: string, fullName: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", userId)

    if (error) {
      console.error(" Profile update error:", error)
      return { error: "Failed to update profile" }
    }

    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error(" Profile update error:", error)
    return { error: "An unexpected error occurred" }
  }
}
