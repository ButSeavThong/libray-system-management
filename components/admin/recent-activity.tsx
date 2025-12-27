import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export async function AdminRecentActivity({ className }: { className?: string }) {
  const supabase = await createClient()

  const { data: recentLoans } = await supabase
    .from("borrows")
    .select("*, book:books(title), user:profiles(full_name, email)")
    .order("borrow_date", { ascending: false })
    .limit(5)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest book transactions and loans.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentLoans?.map((loan) => (
            <div key={loan.id} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {loan.user?.full_name || loan.user?.email} borrowed{" "}
                  <span className="font-semibold">{loan.book?.title}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(loan.borrow_date), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <div
                className={cn("ml-auto text-xs font-medium", loan.return_date ? "text-green-600" : "text-amber-600")}
              >
                {loan.return_date ? "Returned" : "Active"}
              </div>
            </div>
          ))}
          {(!recentLoans || recentLoans.length === 0) && (
            <p className="text-center text-sm text-muted-foreground py-4">No recent activity found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
