import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ProfileLoading() {
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
          <Skeleton className='h-9 w-56 mb-2' />
          <Skeleton className='h-5 w-72' />
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Profile Info Card */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <Skeleton className='h-6 w-48 mb-2' />
              <Skeleton className='h-4 w-56' />
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {/* Form Fields */}
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-24' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-32' />
                  <Skeleton className='h-10 w-full' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-28' />
                  <Skeleton className='h-24 w-full' />
                </div>
                {/* Submit Button */}
                <Skeleton className='h-10 w-32' />
              </div>
            </CardContent>
          </Card>

          {/* Stats Sidebar */}
          <div className='space-y-6'>
            {/* Account Details Card */}
            <Card>
              <CardHeader>
                <Skeleton className='h-5 w-32' />
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Email */}
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-5 w-5 rounded' />
                  <div className='flex-1 space-y-1'>
                    <Skeleton className='h-4 w-12' />
                    <Skeleton className='h-4 w-40' />
                  </div>
                </div>
                {/* Name */}
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-5 w-5 rounded' />
                  <div className='flex-1 space-y-1'>
                    <Skeleton className='h-4 w-12' />
                    <Skeleton className='h-4 w-32' />
                  </div>
                </div>
                {/* Role */}
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-5 w-5 rounded' />
                  <div className='flex-1 space-y-1'>
                    <Skeleton className='h-4 w-12' />
                    <Skeleton className='h-5 w-16 rounded-full' />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Library Activity Card */}
            <Card>
              <CardHeader>
                <Skeleton className='h-5 w-32' />
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='space-y-1'>
                  <Skeleton className='h-8 w-12' />
                  <Skeleton className='h-4 w-24' />
                </div>
                <div className='space-y-1'>
                  <Skeleton className='h-8 w-12' />
                  <Skeleton className='h-4 w-36' />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
