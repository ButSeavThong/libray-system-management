import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function MyBorrowsLoading() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header Skeleton */}
      <header className='sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/60'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-8'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-6 w-6 rounded' />
              <Skeleton className='h-6 w-32' />
            </div>
            {/* Nav Items */}
            <div className='hidden md:flex items-center gap-6'>
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-16' />
            </div>
          </div>
          <Skeleton className='h-10 w-10 rounded-full' />
        </div>
      </header>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        {/* Title Section */}
        <div className='mb-8'>
          <Skeleton className='h-9 w-72 mb-2' />
          <Skeleton className='h-5 w-80' />
        </div>

        <div className='grid gap-6'>
          {/* Stats Cards */}
          <div className='grid gap-4 md:grid-cols-3'>
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-4 w-4 rounded' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='h-8 w-12 mb-1' />
                  <Skeleton className='h-3 w-32' />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Active Loans Card */}
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-32 mb-2' />
              <Skeleton className='h-4 w-64' />
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-4 rounded-lg border p-4'
                  >
                    <Skeleton className='h-24 w-16 rounded' />
                    <div className='flex-1 space-y-2'>
                      <Skeleton className='h-5 w-3/4' />
                      <Skeleton className='h-4 w-1/2' />
                      <Skeleton className='h-4 w-2/3' />
                    </div>
                    <Skeleton className='h-9 w-24' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Return History Card */}
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-40 mb-2' />
              <Skeleton className='h-4 w-56' />
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className='flex items-center gap-4 rounded-lg border p-4'
                  >
                    <Skeleton className='h-24 w-16 rounded' />
                    <div className='flex-1 space-y-2'>
                      <Skeleton className='h-5 w-3/4' />
                      <Skeleton className='h-4 w-1/2' />
                      <Skeleton className='h-4 w-2/3' />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
