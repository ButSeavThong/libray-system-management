import { Skeleton } from '@/components/ui/skeleton'

export default function BookLoading() {
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
        {/* Title Section */}
        <div className='mb-8'>
          <Skeleton className='h-9 w-64 mb-2' />
          <Skeleton className='h-5 w-96' />
        </div>

        <div className='flex flex-col gap-6'>
          {/* Search and Filters Skeleton */}
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
            {/* Search Bar */}
            <Skeleton className='h-10 w-full lg:w-96' />

            {/* Filters */}
            <div className='flex gap-2'>
              <Skeleton className='h-10 w-32' />
              <Skeleton className='h-10 w-32' />
            </div>
          </div>

          {/* Books Grid Skeleton */}
          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='flex flex-col space-y-3'>
                <Skeleton className='h-64 w-full rounded-lg' />
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
                <Skeleton className='h-8 w-full' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
