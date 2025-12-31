import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function BookIDLoading() {
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
      <div className='container mx-auto px-8 py-8'>
        {/* Back Button */}
        <Skeleton className='h-9 w-36 mb-6' />

        {/* Book Detail View */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Book Cover and Info */}
          <div className='lg:col-span-1'>
            <Card>
              <CardContent className='p-6'>
                <Skeleton className='aspect-[2/3] w-full rounded-lg mb-6' />
                <div className='space-y-4'>
                  <div>
                    <Skeleton className='h-4 w-20 mb-2' />
                    <Skeleton className='h-5 w-24 rounded-full' />
                  </div>
                  <div>
                    <Skeleton className='h-4 w-24 mb-2' />
                    <Skeleton className='h-5 w-16' />
                  </div>
                  <div>
                    <Skeleton className='h-4 w-20 mb-2' />
                    <Skeleton className='h-5 w-20' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book Details */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Title and Author */}
            <div>
              <Skeleton className='h-10 w-3/4 mb-3' />
              <Skeleton className='h-6 w-1/2 mb-4' />
              <div className='flex gap-2'>
                <Skeleton className='h-6 w-20 rounded-full' />
                <Skeleton className='h-6 w-24 rounded-full' />
              </div>
            </div>

            {/* Action Button */}
            <Skeleton className='h-11 w-full max-w-xs' />

            {/* Description Card */}
            <Card>
              <CardHeader>
                <Skeleton className='h-6 w-24' />
              </CardHeader>
              <CardContent>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-5/6' />
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-4/5' />
                </div>
              </CardContent>
            </Card>

            {/* Book Information Card */}
            <Card>
              <CardHeader>
                <Skeleton className='h-6 w-40' />
              </CardHeader>
              <CardContent>
                <div className='grid gap-4 sm:grid-cols-2'>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className='space-y-1'>
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-5 w-32' />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
