import { requireAuth } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Library } from "lucide-react"
import Link from "next/link"
import { MainNav } from "@/components/layout/main-nav"
import { UserNav } from "@/components/layout/user-nav"

export default async function ProfilePage() {
  const user = await requireAuth()
  const supabase = await createClient()

  // Get user stats
  const { data: activeBorrows } = await supabase
    .from("borrows")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")

  const { data: totalBorrows } = await supabase.from("borrows").select("id").eq("user_id", user.id)

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="mt-1 text-muted-foreground">Manage your account and preferences</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Info Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">{user.full_name || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Role</p>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Library Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-2xl font-bold">{activeBorrows?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Active loans</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalBorrows?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total books borrowed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
