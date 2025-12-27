import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  role: "ADMIN" | "USER"
}

/**
 * Gets the current authenticated user profile
 * Returns null if not authenticated
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    full_name: profile.full_name,
    role: (profile.role as "ADMIN" | "USER") || "USER",
  }
}

/**
 * Requires authentication and returns the user profile
 * Redirects to login if not authenticated
 */
export async function requireAuth(): Promise<UserProfile> {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}
