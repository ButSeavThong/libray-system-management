import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

export async function AdminRecentActivity({
  className,
}: {
  className?: string
}) {
  const supabase = await createClient()

  const { data: recentBorrows } = await supabase
    .from('borrows')
    .select('*, book:books(*)')
    .order('borrow_date', { ascending: false })
    .limit(5)

  if (recentBorrows && recentBorrows.length > 0) {
    const userIds = [...new Set(recentBorrows.map(b => b.user_id))]
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds)

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || [])
    recentBorrows.forEach(borrow => {
      borrow.profile = profileMap.get(borrow.user_id)
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest book transactions and borrows.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {recentBorrows?.map(borrows => (
            <div key={borrows.id} className='flex items-center'>
              <div className='ml-4 space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  {borrows.profile?.full_name}{' '}
                  <span className='font-semibold'>{borrows.book?.title}</span>
                </p>
                <p className='text-xs text-muted-foreground'>
                  {format(
                    new Date(borrows.borrow_date),
                    "MMM d, yyyy 'at' h:mm a"
                  )}
                </p>
              </div>
              <div
                className={cn(
                  'ml-auto text-xs font-medium',
                  borrows.return_date ? 'text-green-600' : 'text-amber-600'
                )}
              >
                {borrows.return_date ? 'Returned' : 'Active'}
              </div>
            </div>
          ))}
          {(!recentBorrows || recentBorrows.length === 0) && (
            <p className='text-center text-sm text-muted-foreground py-4'>
              No recent activity found.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
